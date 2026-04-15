package handlers

import (
	"net/http"
	"rpg-manager-backend/database"
	"rpg-manager-backend/models"

	"github.com/gin-gonic/gin"
)

func GetCatalogs(c *gin.Context) {
	var skills []models.Skill
	var classes []models.Class

	rows, err := database.DB.Query("SELECT id, name, base_attribute, trained_only, load_penalty FROM skills")
	if err == nil {
		for rows.Next() {
			var s models.Skill
			_ = rows.Scan(&s.ID, &s.Name, &s.BaseAttribute, &s.TrainedOnly, &s.LoadPenalty)
			skills = append(skills, s)
		}
	}

	rows, err = database.DB.Query("SELECT id, name, initial_pv, gain_pv, initial_san, gain_san, initial_pe, gain_pe FROM classes")
	if err == nil {
		for rows.Next() {
			var cl models.Class
			_ = rows.Scan(&cl.ID, &cl.Name, &cl.InitialPV, &cl.GainPV, &cl.InitialSAN, &cl.GainSAN, &cl.InitialPE, &cl.GainPE)
			classes = append(classes, cl)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"skills":  skills,
		"classes": classes,
	})
}

func GetAgents(c *gin.Context) {
	var agents []models.Agent
	rows, err := database.DB.Query("SELECT id, name, player, origin_id, class_id, trilha_id, nex, portrait_url, fields_data FROM agents")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Next()

	for rows.Next() {
		var a models.Agent
		_ = rows.Scan(&a.ID, &a.Name, &a.Player, &a.OriginID, &a.ClassID, &a.TrilhaID, &a.NEX, &a.Portrait, &a.Data)
		agents = append(agents, a)
	}

	c.JSON(http.StatusOK, agents)
}

func SaveAgent(c *gin.Context) {
	var agent models.Agent
	if err := c.ShouldBindJSON(&agent); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if agent.ID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID is required"})
		return
	}

	query := `
	INSERT INTO agents (id, name, player, origin_id, class_id, trilha_id, nex, portrait_url, fields_data)
	VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
	ON CONFLICT(id) DO UPDATE SET
		name=excluded.name,
		player=excluded.player,
		origin_id=excluded.origin_id,
		class_id=excluded.class_id,
		trilha_id=excluded.trilha_id,
		nex=excluded.nex,
		portrait_url=excluded.portrait_url,
		fields_data=excluded.fields_data;
	`

	_, err := database.DB.Exec(query, agent.ID, agent.Name, agent.Player, agent.OriginID, agent.ClassID, agent.TrilhaID, agent.NEX, agent.Portrait, agent.Data)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "saved", "id": agent.ID})
}

func GetAgent(c *gin.Context) {
	id := c.Param("id")
	var a models.Agent
	err := database.DB.QueryRow("SELECT id, name, player, origin_id, class_id, trilha_id, nex, portrait_url, fields_data FROM agents WHERE id = ?", id).
		Scan(&a.ID, &a.Name, &a.Player, &a.OriginID, &a.ClassID, &a.TrilhaID, &a.NEX, &a.Portrait, &a.Data)
	
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Agent not found"})
		return
	}

	c.JSON(http.StatusOK, a)
}
