package controllers

import (
	"encoding/json"
	"net/http"
	"stellar/db"
	"stellar/models"

	"golang.org/x/crypto/bcrypt"
)

func Signin(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	user := &models.User{}
	json.NewDecoder(r.Body).Decode(user)

	userFromTable := models.User{}
	db.DB.Table("users").Find(&userFromTable, "username = ?", user.Username)

	mismatch := bcrypt.CompareHashAndPassword([]byte(userFromTable.Password), []byte(user.Password))
	if mismatch != nil {
		http.Error(w, "Wrong username/password", http.StatusUnauthorized)
		return
	}

	w.WriteHeader(http.StatusOK)
}
