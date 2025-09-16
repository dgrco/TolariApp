package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"math"
	"os"
	"path/filepath"
	"strconv"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

const APP_NAME = "Tungsten"

type AppSettings struct {
	UIZoom float32 `json:"zoom"`
}

type KanbanDataFile struct {
	Columns      map[string][]string `json:"columns"`
	ColumnTitles map[string]string   `json:"columnTitles"`
	Cards        map[string]string   `json:"cards"`
	NextCardId   uint64              `json:"nextCardId"`
	NextColumnId uint64              `json:"nextColumnId"`
}

// App struct
type App struct {
	ctx        context.Context
	db         *sql.DB
	settings   *AppSettings
	kanbanData *KanbanDataFile
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	var err error
	dataPath, err := a.getDataPath()
	if err != nil {
		log.Fatalf(fmt.Sprintf("Failed to get the data path: %s", err.Error()))
	}

	// kanban-state.json File Setup
	kanbanStatePath := filepath.Join(dataPath, "kanban-state.json")
	_, err = os.Stat(kanbanStatePath)
	if errors.Is(err, os.ErrNotExist) { // Initialize the data file
		initialState := KanbanDataFile{
			Cards: map[string]string{},
			Columns: map[string][]string{
				"col-1": {},
				"col-2": {},
				"col-3": {},
			},
			ColumnTitles: map[string]string{
				"col-1": "To-Do",
				"col-2": "In Progress",
				"col-3": "Done",
			},
			NextCardId:   1,
			NextColumnId: 1,
		}
		marshalledState, err := json.Marshal(initialState)
		if err != nil {
			log.Fatal(err)
		}
		os.WriteFile(kanbanStatePath, marshalledState, 0644)
	}
	// Read the data file
	kanbanDataRaw, err := os.ReadFile(kanbanStatePath)
	if err != nil {
		log.Fatal(err)
	}
	kanbanData := &KanbanDataFile{}
	err = json.Unmarshal(kanbanDataRaw, kanbanData)
	if err != nil {
		log.Fatal(err)
	}
	a.kanbanData = kanbanData

	// Database Setup
	dbPath := filepath.Join(dataPath, "app.db")
	a.db, err = sql.Open("sqlite3", dbPath)
	if err != nil {
		log.Fatalf(fmt.Sprintf("Failed to open the database: %s", err.Error()))
	}

	// Create tables if they don't exist
	// Flashcard table
	sqlStmt := `
	CREATE TABLE IF NOT EXISTS flashcards (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		front TEXT,
		back TEXT,
        repetitions INTEGER DEFAULT 0,
        easiness REAL DEFAULT 2.5,
        interval INTEGER DEFAULT 0,
        review_date DATETIME
	);`
	_, err = a.db.Exec(sqlStmt)
	if err != nil {
		log.Fatalf(fmt.Sprintf("Failed to create table: %s", err.Error()))
	}

	fmt.Println("Database ready.")

}

// shutdown is called when the app terminates
func (a *App) shutdown(ctx context.Context) {
	if a.db != nil {
		a.db.Close()
		log.Println("Database closed.")
	}
}

func (a *App) GetSettings() *AppSettings {
	return a.settings
}

// Initialize the `settings` of the app to its default values.
// WARN: This will overwrite any existing settings.
func (a *App) NewConfig() {
	a.settings = &AppSettings{
		UIZoom: 1.0,
	}
}

// Get the config path (make it if necessary)
func (a *App) getConfigPath() (string, error) {
	dir, err := os.UserConfigDir()
	if err != nil {
		return "", err
	}
	configPath := filepath.Join(dir, APP_NAME)
	if err := os.MkdirAll(configPath, 0755); err != nil {
		return "", err
	}
	return configPath, nil
}

// Get the data path (make it if necessary)
func (a *App) getDataPath() (string, error) {
	dir, err := os.UserCacheDir()
	if err != nil {
		return "", err
	}
	dataPath := filepath.Join(dir, APP_NAME)
	if err := os.MkdirAll(dataPath, 0755); err != nil {
		return "", err
	}
	return dataPath, nil
}

// Save the settings to the config file in JSON format.
func (a *App) SaveConfig(settings *AppSettings) error {
	data, err := json.MarshalIndent(settings, "", "  ")
	if err != nil {
		return err
	}
	configPath, err := a.getConfigPath()
	if err != nil {
		return err
	}
	path := filepath.Join(configPath, "settings.json")

	return os.WriteFile(path, data, 0644)
}

// Load the config from the settings.
// This method will initialize the config file if it doesn't exist.
func (a *App) LoadConfig() error {
	configPath, err := a.getConfigPath()
	if err != nil {
		return err
	}
	path := filepath.Join(configPath, "settings.json")

	jsonData, err := os.ReadFile(path)
	if err != nil {
		if os.IsNotExist(err) {
			a.NewConfig()
			a.SaveConfig(a.settings)
			fmt.Printf("Config was not found. A new one has been initialized.\n")
		} else {
			return err
		}
	}

	settings := &AppSettings{}
	if err := json.Unmarshal(jsonData, settings); err != nil {
		return err
	}

	a.settings = settings

	return nil
}

func (a *App) GetCurrentDateString() string {
	return serializeDate(time.Now())
}

// Flashcard Definition
type Flashcard struct {
	ID          uint    `json:"id"`
	Front       string  `json:"front"`
	Back        string  `json:"back"`
	Repetitions uint    `json:"repetitions"` // Consecutive successful reviews
	Easiness    float64 `json:"easiness"`    // SM-2 easiness factor
	Interval    uint    `json:"interval"`    // Days until next review
	ReviewDate  string  `json:"review_date"` // RFC3339 string (SQLite compatible)
}

// Deserialize a review date string into a time.Time
func parseReviewDate(card Flashcard) (time.Time, error) {
	parsedTime, err := time.Parse(time.RFC3339, card.ReviewDate)
	if err != nil {
		return time.Now(), err
	}

	return parsedTime, nil
}

// Convert a time.Time into a string (RFC3339 format)
func serializeDate(reviewDate time.Time) string {
	return reviewDate.Format(time.RFC3339)
}

// Creates a new Flashcard.
func NewFlashcard(front string, back string) *Flashcard {
	now := time.Now()
	return &Flashcard{
		Front:       front,
		Back:        back,
		Repetitions: 0,
		Easiness:    2.5,
		Interval:    0,
		ReviewDate:  serializeDate(now.Add(-24 * time.Hour)),
	}
}

// Saves a Flashcard to the database. Returns the Flashcard pointer on success.
func (a *App) SaveFlashcard(front string, back string) (*Flashcard, error) {
	card := NewFlashcard(front, back)
	stmt, err := a.db.Prepare(`
        INSERT INTO flashcards
        (front, back, repetitions, easiness, interval, review_date)
        VALUES (?, ?, ?, ?, ?, ?)
    `)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	res, err := stmt.Exec(
		card.Front,
		card.Back,
		card.Repetitions,
		card.Easiness,
		card.Interval,
		card.ReviewDate,
	)
	if err != nil {
		return nil, err
	}

	id, err := res.LastInsertId()
	if err != nil {
		return nil, err
	}
	card.ID = uint(id)

	return card, nil
}

type FlashcardMap map[uint]*Flashcard

// Get all Flashcards from the database.
func (a *App) GetAllFlashcards() (FlashcardMap, error) {
	rows, err := a.db.Query("SELECT * FROM flashcards;")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	cards := make(FlashcardMap)
	for rows.Next() {
		var card Flashcard
		err := rows.Scan(
			&card.ID,
			&card.Front,
			&card.Back,
			&card.Repetitions,
			&card.Easiness,
			&card.Interval,
			&card.ReviewDate,
		)
		if err != nil {
			return nil, err
		}
		cards[card.ID] = &card
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return cards, nil
}

// Retrieve a card from the database given its ID.
func (a *App) getCardByID(cardID uint) (*Flashcard, error) {
	card := &Flashcard{}
	err := a.db.QueryRow(`
        SELECT * FROM flashcards WHERE id=?
    `, cardID).Scan(
		&card.ID, &card.Front, &card.Back, &card.Repetitions,
		&card.Easiness, &card.Interval, &card.ReviewDate,
	)
	return card, err
}

// Review a card given its ID and with a user-specified difficulty value.
// Difficulty values are from 0-5, where 0 is the hardest and 5 is easiest.
func (a *App) ReviewCard(cardID uint, difficulty uint) (*Flashcard, error) {
	card, err := a.getCardByID(cardID)
	if err != nil {
		return nil, err
	}

	card.review(difficulty)

	_, err = a.db.Exec(`
		UPDATE flashcards SET
			repetitions = ?,
			easiness = ?,
			interval = ?,
			review_date = ?
		WHERE id = ?`,
		card.Repetitions, card.Easiness, card.Interval,
		card.ReviewDate, card.ID,
	)

	return card, err
}

func (c *Flashcard) review(difficulty uint) {
	currTime := time.Now()

	if difficulty < 3 { // Incorrect
		c.Repetitions = 0
		c.Interval = 1
	} else { // Correct
		c.Easiness += 0.1 - (5-float64(difficulty))*(0.08+(5-float64(difficulty))*0.02)
		if c.Easiness < 1.3 {
			c.Easiness = 1.3
		}

		c.Repetitions++
		switch c.Repetitions {
		case 1:
			c.Interval = 1
		case 2:
			c.Interval = 6
		default:
			c.Interval = uint(math.Round(float64(c.Interval) * c.Easiness))
		}
	}

	c.ReviewDate = serializeDate(currTime.AddDate(0, 0, int(c.Interval)))
}

func (a *App) GetReviewCards() ([]Flashcard, error) {
	rows, err := a.db.Query(`
		SELECT * FROM flashcards
		WHERE review_date < CURRENT_TIMESTAMP;
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	cards := []Flashcard{}
	for rows.Next() {
		var card Flashcard
		err := rows.Scan(
			&card.ID,
			&card.Front,
			&card.Back,
			&card.Repetitions,
			&card.Easiness,
			&card.Interval,
			&card.ReviewDate,
		)
		if err != nil {
			return nil, err
		}
		cards = append(cards, card)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return cards, nil
}

////////////////////////////////
//			 Kanban
////////////////////////////////
// NOTE: All Kanban Storage will be placed in a separate json file (kanban-state.json)
// to match the in-memory representation for simplicity and efficiency.
// For now, the SQL DB will only be for flashcards.

func (a *App) saveKanbanData() {
	dataPath, err := a.getDataPath()
	if err != nil {
		log.Fatal(err)
	}
	kanbanFilePath := filepath.Join(dataPath, "kanban-state.json")

	data, err := json.Marshal(a.kanbanData)
	if err != nil {
		log.Fatal(err)
	}
	if err = os.WriteFile(kanbanFilePath, data, 0644); err != nil {
		log.Fatal(err)
	}
}

func (a *App) SaveKanbanCard(content string, columnId string) string {
	cardId := "card-" + strconv.FormatUint(a.kanbanData.NextCardId, 10)
	a.kanbanData.Cards[cardId] = content
	a.kanbanData.NextCardId += 1
	a.kanbanData.Columns[columnId] = append(a.kanbanData.Columns[columnId], cardId)

	a.saveKanbanData()
	return cardId
}

func (a *App) SaveColumn(title string) string {
	columnId := "col-" + strconv.FormatUint(a.kanbanData.NextColumnId, 10)
	a.kanbanData.ColumnTitles[columnId] = title
	a.kanbanData.Columns[columnId] = make([]string, 0)
	a.kanbanData.NextColumnId += 1

	a.saveKanbanData()
	return columnId
}

func (a *App) GetKanbanCards() map[string]string {
	return a.kanbanData.Cards
}

func (a *App) GetKanbanColumns() map[string][]string {
	return a.kanbanData.Columns
}

func (a *App) GetKanbanColumnTitles() map[string]string {
	return a.kanbanData.ColumnTitles
}

func (a *App) SaveAllKanbanData(cards map[string]string, columns map[string][]string, columnTitles map[string]string) {
	a.kanbanData.Cards = cards
	a.kanbanData.Columns = columns
	a.kanbanData.ColumnTitles = columnTitles
	a.saveKanbanData()
}
