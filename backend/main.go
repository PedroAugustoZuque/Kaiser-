package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"rpg-manager-backend/database"
	"rpg-manager-backend/handlers"
	"time"

	"github.com/gin-gonic/gin"
)

// ThematicMiddleware for "Ordo Realitas" logging vibe
func ThematicMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		
		fmt.Fprintf(os.Stdout, "\033[32m[CRIS_SYSTEM]\033[0m %s SCANNING REQUEST: %s\n", time.Now().Format("15:04:05"), path)
		
		c.Next()
		
		latency := time.Since(start)
		status := c.Writer.Status()
		
		color := "\033[32m" // Green for success
		if status >= 400 {
			color = "\033[31m" // Red for error
		}
		
		fmt.Fprintf(os.Stdout, "%s[CRIS_SYSTEM]\033[0m ACCESS_LOG: %s | STATUS: %d | LATENCY: %v\n", color, path, status, latency)
	}
}

func main() {
	// Initialize Database
	fmt.Println("\033[32m> INITIALIZING ORDO REALITAS DATABASE INTERFACE...\033[0m")
	database.InitDB()

	// Gin Setup
	gin.SetMode(gin.ReleaseMode)
	r := gin.New()
	
	// Add Middlewares
	r.Use(ThematicMiddleware())
	r.Use(gin.Recovery())

	// CORS Middleware (Simple version for local dev)
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	})

	// API Routes
	v1 := r.Group("/api/v1")
	{
		// Auth Routes
		auth := v1.Group("/auth")
		{
			auth.POST("/login", handlers.Login)
			auth.POST("/register", handlers.Register)
		}

		v1.GET("/catalogs", handlers.GetCatalogs)

		v1.GET("/agents", handlers.GetAgents)
		v1.GET("/agents/:id", handlers.GetAgent)
		v1.POST("/agents", handlers.SaveAgent)

		// Room Routes
		v1.GET("/rooms", handlers.ListUserRooms)
		v1.GET("/rooms/:id", handlers.GetRoom)
		v1.POST("/rooms", handlers.CreateRoom)
		v1.POST("/rooms/join", handlers.JoinRoom)
		v1.POST("/rooms/:id/assign", handlers.AssignCharacter)
		v1.POST("/rooms/:id/roll", handlers.SaveRoll)
		v1.PUT("/rooms/:id/map", handlers.UpdateMapState)
	}


	port := "0.0.0.0:8080"
	fmt.Printf("\033[32m> CRIS TERMINAL ACTIVE ON PORT %s. STATUS: SECURE.\033[0m\n", port)
	
	if err := r.Run(port); err != nil {
		log.Fatal("Failed to start CRIS system: ", err)
	}

}
