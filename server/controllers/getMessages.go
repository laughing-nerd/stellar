package controllers

import (
	"encoding/json"
	"net/http"
	"stellar/db"
	"stellar/models"
)

func GetMessages(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	room := r.URL.Query()["room"][0]
	messageData := []models.Message{}
	db.DB.Table("messages").Find(&messageData, "room = ?", room)

	toSend, _ := json.Marshal(messageData)
	_, err := w.Write(toSend)
	if err != nil {
		return
	}
}
