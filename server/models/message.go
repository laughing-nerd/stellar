package models

import "gorm.io/gorm"

type Message struct {
	gorm.Model
	Content string `json:"content"`
	Room    string `json:"room"`
	Author  string `json:"author"`
}
