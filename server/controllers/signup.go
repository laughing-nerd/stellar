package controllers

import (
	"encoding/json"
	"net/http"
	"stellar/db"
	"stellar/models"

	"golang.org/x/crypto/bcrypt"
)

func Signup(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	user := &models.User{}
	json.NewDecoder(r.Body).Decode(user)

	byteHash, _ := bcrypt.GenerateFromPassword([]byte(user.Password), 10)
	user.Password = string(byteHash)

	db.DB.Table("users").Create(user)
}
