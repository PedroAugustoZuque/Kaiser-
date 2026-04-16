package models

type Skill struct {
	ID            string `json:"id" db:"id"`
	Name          string `json:"name" db:"name"`
	BaseAttribute string `json:"baseAttribute" db:"base_attribute"`
	TrainedOnly   bool   `json:"trainedOnly" db:"trained_only"`
	LoadPenalty   bool   `json:"loadPenalty" db:"load_penalty"`
}

type Class struct {
	ID               string   `json:"id" db:"id"`
	Name             string   `json:"name" db:"name"`
	InitialPV        int      `json:"initialPV" db:"initial_pv"`
	GainPV           int      `json:"gainPV" db:"gain_pv"`
	InitialSAN        int      `json:"initialSAN" db:"initial_san"`
	GainSAN          int      `json:"gainSAN" db:"gain_san"`
	InitialPE        int      `json:"initialPE" db:"initial_pe"`
	GainPE           int      `json:"gainPE" db:"gain_pe"`
	InitialAbilities []string `json:"initialAbilities" db:"-"`
}

type Trilha struct {
	ID      string `json:"id" db:"id"`
	Name    string `json:"name" db:"name"`
	ClassID string `json:"classId" db:"class_id"`
	Source  string `json:"source" db:"source"`
	Summary string `json:"summary" db:"summary"`
}

type Agent struct {
	ID        string `json:"id" db:"id"`
	Name      string `json:"name" db:"name"`
	Player    string `json:"player" db:"player"`
	OriginID  string `json:"originId" db:"origin_id"`
	ClassID   string `json:"classId" db:"class_id"`
	TrilhaID  string `json:"trilhaId" db:"trilha_id"`
	NEX       int    `json:"nex" db:"nex"`
	Portrait  string `json:"portraitUrl" db:"portrait_url"`
	Data      string `json:"fieldsData" db:"fields_data"` // JSON string for dynamic fields
}

type Room struct {
	ID         string `json:"id" db:"id"`
	Name       string `json:"name" db:"name"`
	GMName     string `json:"gmName" db:"gm_name"`
	InviteCode string `json:"inviteCode" db:"invite_code"`
	CreatedAt  string `json:"createdAt" db:"created_at"`
}

type Participant struct {
	RoomID      string `json:"roomId" db:"room_id"`
	UserName    string `json:"userName" db:"user_name"`
	Role        string `json:"role" db:"role"` // "GM" or "Player"
	CharacterID string `json:"characterId" db:"character_id"`
}

type DiceRoll struct {
	ID         string `json:"id" db:"id"`
	RoomID     string `json:"roomId" db:"room_id"`
	UserName   string `json:"userName" db:"user_name"`
	DiceString string `json:"diceString" db:"dice_string"`
	ResultText string `json:"resultText" db:"result_text"`
	IsPrivate  bool   `json:"isPrivate" db:"is_private"`
	CreatedAt  string `json:"createdAt" db:"created_at"`
}

type User struct {
	ID           string `json:"id" db:"id"`
	Username     string `json:"username" db:"username"`
	PasswordHash string `json:"-" db:"password_hash"`
	CreatedAt    string `json:"createdAt" db:"created_at"`
}

type Token struct {
	ID          string  `json:"id"`
	Name        string  `json:"name"`
	Type        string  `json:"type"` // "agent", "monster", "item"
	X           float64 `json:"x"`
	Y           float64 `json:"y"`
	Size        int     `json:"size"` // 1, 2, 3 (grid units)
	PortraitUrl string  `json:"portraitUrl"`
	CurrentHP   int     `json:"currentHp"`
	MaxHP       int     `json:"maxHp"`
	IsVisible   bool    `json:"isVisible"`
}

type MapState struct {
	RoomID     string  `json:"roomId" db:"room_id"`
	Background string  `json:"background" db:"background_url"`
	GridSize   int     `json:"gridSize" db:"grid_size"`
	GridColor  string  `json:"gridColor" db:"grid_color"`
	Opacity    float64 `json:"opacity" db:"opacity"`
	OffsetX    int     `json:"offsetX" db:"offset_x"`
	OffsetY    int     `json:"offsetY" db:"offset_y"`
	Zoom       float64 `json:"zoom" db:"zoom"`
	Tokens     []Token `json:"tokens" db:"-"` // Stored as JSON or separate
}

type RoomDetails struct {
	Room         Room          `json:"room"`
	Participants []Participant `json:"participants"`
	Rolls        []DiceRoll    `json:"rolls"`
	Map          MapState      `json:"map"`
}


