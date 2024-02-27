package main

import (
	"fmt"
	"net/http"
	"stellar/controllers"
	"stellar/db"
	"stellar/websock"

	"github.com/joho/godotenv"
	"golang.org/x/net/websocket"
)

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		panic(err.Error())
	}
	go db.Init()

	server := websock.NewServer()
	fmt.Println("Server started!")

	// API routes
	http.HandleFunc("/rooms", controllers.GetRooms)
	http.HandleFunc("/getMessages", controllers.GetMessages)
	http.HandleFunc("/signup", controllers.Signup)
	http.HandleFunc("/signin", controllers.Signin)

	// Handle websocket route
	http.Handle("/ws", websocket.Handler(server.HandleConnection))

	http.ListenAndServe(":5000", nil)
}
