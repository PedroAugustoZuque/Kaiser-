package handlers

import (
	"crypto/rand"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"rpg-manager-backend/database"
	"rpg-manager-backend/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)


func GenerateInviteCode() string {
	b := make([]byte, 3)
	rand.Read(b)
	return fmt.Sprintf("%X", b)
}

func CreateRoom(c *gin.Context) {
	var input struct {
		Name   string `json:"name"`
		GMName string `json:"gmName"`
		System string `json:"system"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	roomID := uuid.New().String()
	inviteCode := GenerateInviteCode()

	query := `INSERT INTO rooms (id, name, gm_name, invite_code) VALUES (?, ?, ?, ?)`
	_, err := database.DB.Exec(query, roomID, input.Name, input.GMName, inviteCode)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create room"})
		return
	}

	// Add GM as participant
	participantQuery := `INSERT INTO room_participants (room_id, user_name, role) VALUES (?, ?, ?)`
	_, err = database.DB.Exec(participantQuery, roomID, input.GMName, "GM")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Falha ao vincular mestre: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"id":         roomID,
		"inviteCode": inviteCode,
	})
}


func JoinRoom(c *gin.Context) {
	var input struct {
		InviteCode string `json:"inviteCode"`
		UserName   string `json:"userName"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var roomID string
	err := database.DB.QueryRow("SELECT id FROM rooms WHERE invite_code = ?", input.InviteCode).Scan(&roomID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Room not found"})
		return
	}

	// Check if already in room
	var existing string
	err = database.DB.QueryRow("SELECT role FROM room_participants WHERE room_id = ? AND user_name = ?", roomID, input.UserName).Scan(&existing)
	
	if err != nil {
		// New participant
		query := `INSERT INTO room_participants (room_id, user_name, role) VALUES (?, ?, ?)`
		_, err = database.DB.Exec(query, roomID, input.UserName, "Player")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to join room"})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"id": roomID, "status": "joined"})
}

func GetRoom(c *gin.Context) {
	id := c.Param("id")

	var room models.Room
	err := database.DB.QueryRow("SELECT id, name, gm_name, invite_code, created_at FROM rooms WHERE id = ?", id).
		Scan(&room.ID, &room.Name, &room.GMName, &room.InviteCode, &room.CreatedAt)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Room not found"})
		return
	}

	// Get Participants
	var participants []models.Participant
	rows, err := database.DB.Query("SELECT room_id, user_name, role, character_id FROM room_participants WHERE room_id = ?", id)
	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var p models.Participant
			var charID sql.NullString
			_ = rows.Scan(&p.RoomID, &p.UserName, &p.Role, &charID)
			if charID.Valid {
				p.CharacterID = charID.String
			}
			participants = append(participants, p)
		}
	}

	// Get Dice Rolls
	var rolls []models.DiceRoll
	rollRows, err := database.DB.Query("SELECT id, room_id, user_name, dice_string, result_text, is_private, created_at FROM dice_rolls WHERE room_id = ? ORDER BY created_at ASC", id)
	if err == nil {
		defer rollRows.Close()
		for rollRows.Next() {
			var r models.DiceRoll
			var isPrivate int
			_ = rollRows.Scan(&r.ID, &r.RoomID, &r.UserName, &r.DiceString, &r.ResultText, &isPrivate, &r.CreatedAt)
			r.IsPrivate = isPrivate == 1
			rolls = append(rolls, r)
		}
	}

	// Get Map State
	var m models.MapState
	var tokensData string
	err = database.DB.QueryRow(`
		SELECT room_id, background_url, grid_size, grid_color, opacity, offset_x, offset_y, zoom, tokens_data 
		FROM room_map_state WHERE room_id = ?`, id).
		Scan(&m.RoomID, &m.Background, &m.GridSize, &m.GridColor, &m.Opacity, &m.OffsetX, &m.OffsetY, &m.Zoom, &tokensData)

	if err != nil {
		// Default map state if not found or table doesn't exist yet
		m = models.MapState{
			RoomID:    id,
			GridSize:  70,
			GridColor: "rgba(255,255,255,0.2)",
			Opacity:   0.5,
			Zoom:      1.0,
			Tokens:    []models.Token{},
		}
		// Async attempt to initialize row if it doesn't exist
		go func() {
			_, _ = database.DB.Exec("INSERT OR IGNORE INTO room_map_state (room_id, grid_size, grid_color, opacity, zoom, tokens_data) VALUES (?, ?, ?, ?, ?, ?)",
				id, 70, m.GridColor, 0.5, 1.0, "[]")
		}()
	} else {
		_ = json.Unmarshal([]byte(tokensData), &m.Tokens)
	}


	c.JSON(http.StatusOK, models.RoomDetails{
		Room:         room,
		Participants: participants,
		Rolls:        rolls,
		Map:          m,
	})
}

func UpdateMapState(c *gin.Context) {
	var m models.MapState
	if err := c.ShouldBindJSON(&m); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tokensJSON, _ := json.Marshal(m.Tokens)

	query := `
	INSERT INTO room_map_state (room_id, background_url, grid_size, grid_color, opacity, offset_x, offset_y, zoom, tokens_data)
	VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
	ON CONFLICT(room_id) DO UPDATE SET
		background_url=excluded.background_url,
		grid_size=excluded.grid_size,
		grid_color=excluded.grid_color,
		opacity=excluded.opacity,
		offset_x=excluded.offset_x,
		offset_y=excluded.offset_y,
		zoom=excluded.zoom,
		tokens_data=excluded.tokens_data;
	`

	_, err := database.DB.Exec(query, m.RoomID, m.Background, m.GridSize, m.GridColor, m.Opacity, m.OffsetX, m.OffsetY, m.Zoom, string(tokensJSON))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "map_updated"})
}


func AssignCharacter(c *gin.Context) {
	roomID := c.Param("id")
	var input struct {
		UserName    string `json:"userName"`
		CharacterID string `json:"characterId"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	query := `UPDATE room_participants SET character_id = ? WHERE room_id = ? AND user_name = ?`
	_, err := database.DB.Exec(query, input.CharacterID, roomID, input.UserName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to assign character"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "assigned"})
}

func SaveRoll(c *gin.Context) {
	roomID := c.Param("id")
	var roll models.DiceRoll
	if err := c.ShouldBindJSON(&roll); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	roll.ID = uuid.New().String()
	roll.RoomID = roomID
	
	isPrivate := 0
	if roll.IsPrivate {
		isPrivate = 1
	}

	query := `INSERT INTO dice_rolls (id, room_id, user_name, dice_string, result_text, is_private) VALUES (?, ?, ?, ?, ?, ?)`
	_, err := database.DB.Exec(query, roll.ID, roll.RoomID, roll.UserName, roll.DiceString, roll.ResultText, isPrivate)
	
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save roll"})
		return
	}

	c.JSON(http.StatusOK, roll)
}

func ListUserRooms(c *gin.Context) {
	userName := c.Query("userName")
	if userName == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "userName is required"})
		return
	}

	query := `
		SELECT r.id, r.name, r.gm_name, r.invite_code, r.created_at 
		FROM rooms r
		JOIN room_participants rp ON r.id = rp.room_id
		WHERE rp.user_name = ?
	`
	rows, err := database.DB.Query(query, userName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var rooms []models.Room
	for rows.Next() {
		var r models.Room
		_ = rows.Scan(&r.ID, &r.Name, &r.GMName, &r.InviteCode, &r.CreatedAt)
		rooms = append(rooms, r)
	}

	c.JSON(http.StatusOK, rooms)
}
