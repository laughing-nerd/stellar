package controllers

import (
	"encoding/json"
	"net/http"
)

var rooms = [5]string{"Colloseum", "NSFW", "Karens Assemble", "Let's Rant", "Ooga Booga"}

func GetRooms(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	toSend, _ := json.Marshal(rooms)
	_, err := w.Write(toSend)
	if err != nil {
		return
	}
}
