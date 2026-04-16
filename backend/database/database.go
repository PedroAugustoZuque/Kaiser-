package database

import (
	"database/sql"
	"log"
	"rpg-manager-backend/models"

	_ "modernc.org/sqlite"
)

var DB *sql.DB

func InitDB() {
	var err error
	DB, err = sql.Open("sqlite", "./rpg_manager.db")
	if (err != nil) {
		log.Fatal(err)
	}

	statements := []string{
		`CREATE TABLE IF NOT EXISTS skills (
			id TEXT PRIMARY KEY,
			name TEXT,
			base_attribute TEXT,
			trained_only INTEGER,
			load_penalty INTEGER
		);`,
		`CREATE TABLE IF NOT EXISTS classes (
			id TEXT PRIMARY KEY,
			name TEXT,
			initial_pv INTEGER,
			gain_pv INTEGER,
			initial_san INTEGER,
			gain_san INTEGER,
			initial_pe INTEGER,
			gain_pe INTEGER
		);`,
		`CREATE TABLE IF NOT EXISTS tracks (
			id TEXT PRIMARY KEY,
			name TEXT,
			class_id TEXT,
			source TEXT,
			summary TEXT
		);`,
		`CREATE TABLE IF NOT EXISTS agents (
			id TEXT PRIMARY KEY,
			name TEXT,
			player TEXT,
			origin_id TEXT,
			class_id TEXT,
			trilha_id TEXT,
			nex INTEGER,
			portrait_url TEXT,
			fields_data TEXT
		);`,
		`CREATE TABLE IF NOT EXISTS rooms (
			id TEXT PRIMARY KEY,
			name TEXT,
			gm_name TEXT,
			invite_code TEXT UNIQUE,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP
		);`,
		`CREATE TABLE IF NOT EXISTS room_participants (
			room_id TEXT,
			user_name TEXT,
			role TEXT,
			character_id TEXT,
			PRIMARY KEY (room_id, user_name)
		);`,
		`CREATE TABLE IF NOT EXISTS dice_rolls (
			id TEXT PRIMARY KEY,
			room_id TEXT,
			user_name TEXT,
			dice_string TEXT,
			result_text TEXT,
			is_private INTEGER,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP
		);`,
		`CREATE TABLE IF NOT EXISTS users (
			id TEXT PRIMARY KEY,
			username TEXT UNIQUE,
			password_hash TEXT,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP
		);`,
		`CREATE TABLE IF NOT EXISTS room_map_state (
			room_id TEXT PRIMARY KEY,
			background_url TEXT,
			grid_size INTEGER DEFAULT 70,
			grid_color TEXT DEFAULT 'rgba(255,255,255,0.2)',
			opacity REAL DEFAULT 0.5,
			offset_x INTEGER DEFAULT 0,
			offset_y INTEGER DEFAULT 0,
			zoom REAL DEFAULT 1.0,
			tokens_data TEXT DEFAULT '[]'
		);`,
	}

	for _, stmt := range statements {
		_, err = DB.Exec(stmt)
		if err != nil {
			log.Printf("Error creating table: %v\n", err)
		}
	}


	SeedData()
}

func SeedData() {
	// Simple seeding logic - insert if not exists
	skills := []models.Skill{
		{ID: "acrobacia", Name: "Acrobacia", BaseAttribute: "AGI", TrainedOnly: false, LoadPenalty: true},
		{ID: "crime", Name: "Crime", BaseAttribute: "AGI", TrainedOnly: true, LoadPenalty: true},
		{ID: "furtividade", Name: "Furtividade", BaseAttribute: "AGI", TrainedOnly: false, LoadPenalty: true},
		{ID: "iniciativa", Name: "Iniciativa", BaseAttribute: "AGI", TrainedOnly: false, LoadPenalty: false},
		{ID: "pilotagem", Name: "Pilotagem", BaseAttribute: "AGI", TrainedOnly: true, LoadPenalty: false},
		{ID: "pontaria", Name: "Pontaria", BaseAttribute: "AGI", TrainedOnly: false, LoadPenalty: false},
		{ID: "reflexos", Name: "Reflexos", BaseAttribute: "AGI", TrainedOnly: false, LoadPenalty: false},
		{ID: "atletismo", Name: "Atletismo", BaseAttribute: "FOR", TrainedOnly: false, LoadPenalty: false},
		{ID: "luta", Name: "Luta", BaseAttribute: "FOR", TrainedOnly: false, LoadPenalty: false},
		{ID: "atualidades", Name: "Atualidades", BaseAttribute: "INT", TrainedOnly: false, LoadPenalty: false},
		{ID: "ciencias", Name: "Ciências", BaseAttribute: "INT", TrainedOnly: true, LoadPenalty: false},
		{ID: "investigacao", Name: "Investigação", BaseAttribute: "INT", TrainedOnly: false, LoadPenalty: false},
		{ID: "medicina", Name: "Medicina", BaseAttribute: "INT", TrainedOnly: false, LoadPenalty: false},
		{ID: "ocultismo", Name: "Ocultismo", BaseAttribute: "INT", TrainedOnly: true, LoadPenalty: false},
		{ID: "profissao", Name: "Profissão", BaseAttribute: "INT", TrainedOnly: true, LoadPenalty: false},
		{ID: "sobrevivencia", Name: "Sobrevivência", BaseAttribute: "INT", TrainedOnly: false, LoadPenalty: false},
		{ID: "tatica", Name: "Tática", BaseAttribute: "INT", TrainedOnly: true, LoadPenalty: false},
		{ID: "tecnologia", Name: "Tecnologia", BaseAttribute: "INT", TrainedOnly: true, LoadPenalty: false},
		{ID: "adestramento", Name: "Adestramento", BaseAttribute: "PRE", TrainedOnly: true, LoadPenalty: false},
		{ID: "artes", Name: "Artes", BaseAttribute: "PRE", TrainedOnly: true, LoadPenalty: false},
		{ID: "diplomacia", Name: "Diplomacia", BaseAttribute: "PRE", TrainedOnly: false, LoadPenalty: false},
		{ID: "enganacao", Name: "Enganação", BaseAttribute: "PRE", TrainedOnly: false, LoadPenalty: false},
		{ID: "intimidacao", Name: "Intimidação", BaseAttribute: "PRE", TrainedOnly: false, LoadPenalty: false},
		{ID: "intuicao", Name: "Intuição", BaseAttribute: "PRE", TrainedOnly: false, LoadPenalty: false},
		{ID: "percepcao", Name: "Percepção", BaseAttribute: "PRE", TrainedOnly: false, LoadPenalty: false},
		{ID: "religiao", Name: "Religião", BaseAttribute: "PRE", TrainedOnly: true, LoadPenalty: false},
		{ID: "vontade", Name: "Vontade", BaseAttribute: "PRE", TrainedOnly: false, LoadPenalty: false},
		{ID: "fortitude", Name: "Fortitude", BaseAttribute: "VIG", TrainedOnly: false, LoadPenalty: false},
	}

	for _, s := range skills {
		_, _ = DB.Exec("INSERT OR IGNORE INTO skills (id, name, base_attribute, trained_only, load_penalty) VALUES (?, ?, ?, ?, ?)",
			s.ID, s.Name, s.BaseAttribute, s.TrainedOnly, s.LoadPenalty)
	}

	classes := []models.Class{
		{ID: "combatente", Name: "Combatente", InitialPV: 20, GainPV: 4, InitialSAN: 12, GainSAN: 3, InitialPE: 2, GainPE: 2},
		{ID: "especialista", Name: "Especialista", InitialPV: 16, GainPV: 3, InitialSAN: 16, GainSAN: 4, InitialPE: 3, GainPE: 3},
		{ID: "ocultista", Name: "Ocultista", InitialPV: 12, GainPV: 2, InitialSAN: 20, GainSAN: 5, InitialPE: 4, GainPE: 4},
	}

	for _, c := range classes {
		_, _ = DB.Exec("INSERT OR IGNORE INTO classes (id, name, initial_pv, gain_pv, initial_san, gain_san, initial_pe, gain_pe) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
			c.ID, c.Name, c.InitialPV, c.GainPV, c.InitialSAN, c.GainSAN, c.InitialPE, c.GainPE)
	}
	
	log.Println("Database initialized and Ordem Paranormal catalogs seeded.")
}
