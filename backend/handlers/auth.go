package handlers

import (
	"crypto/rand"
	"encoding/hex"
	"net/http"
	"rpg-manager-backend/database"
	"rpg-manager-backend/models"

	"github.com/gin-gonic/gin"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type LoginRequest struct {
	Username   string `json:"username" binding:"required"`
	Password   string `json:"password" binding:"required"`
	RememberMe bool   `json:"rememberMe"`
}

type RegisterRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}

	// Check if user exists
	var exists int
	err := database.DB.QueryRow("SELECT COUNT(*) FROM users WHERE username = ?", req.Username).Scan(&exists)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao verificar usuário"})
		return
	}
	if exists > 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "Este nome de agente já está em uso"})
		return
	}

	// Hash password
	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao processar segurança"})
		return
	}

	id := uuid.New().String()
	_, err = database.DB.Exec("INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)",
		id, req.Username, string(hash))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao criar registro"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Agente rergistrado com sucesso no sistema KAISER"})
}

func Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Identificação inválida"})
		return
	}

	var user models.User
	err := database.DB.QueryRow("SELECT id, username, password_hash FROM users WHERE username = ?", req.Username).
		Scan(&user.ID, &user.Username, &user.PasswordHash)
	
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Credenciais não reconhecidas pelo sistema"})
		return
	}

	// Compare password
	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Credenciais não reconhecidas pelo sistema"})
		return
	}

	// Generate a simple token (UUID for simplicity in this terminal style app)
	token := generateSecureToken()
	
	// In a real app we would store this token in a session table or use JWT.
	// For this RPG manager, we'll return it and the frontend will handle it.
	
	c.JSON(http.StatusOK, gin.H{
		"token":    token,
		"username": user.Username,
		"message":  "ACESSO CONCEDIDO. BEM-VINDO AO KAISER.",
	})
}

func generateSecureToken() string {
	b := make([]byte, 32)
	rand.Read(b)
	return hex.EncodeToString(b)
}
