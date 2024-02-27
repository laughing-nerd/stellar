package websock

import (
	"encoding/json"
	"fmt"
	"stellar/db"
	"stellar/models"

	"golang.org/x/net/websocket"
)

type Server struct {
	connections map[*websocket.Conn]string
}

func NewServer() *Server {
	return &Server{
		connections: make(map[*websocket.Conn]string),
	}
}

func (s *Server) HandleConnection(ws *websocket.Conn) {
	fmt.Println("Incoming Connection from ", ws.RemoteAddr())

	// Get the room name/id
	room := make([]byte, 20)
	n, err := ws.Read(room)
	if err != nil {
		fmt.Println(err.Error())
	}

	// Assign that connection to the room
	s.connections[ws] = string(room[:n])
	s.ReadLoop(ws)
}

func (s *Server) ReadLoop(ws *websocket.Conn) {
	msg := make([]byte, 1024)
	for {
		n, err := ws.Read(msg)
		if err != nil {
			continue
		}

		messageData := &models.Message{}
		json.Unmarshal(msg[:n], messageData)
		messageData.Room = s.connections[ws]

		msg, _ := json.Marshal(messageData)

		s.BroadcastMessage(msg, s.connections[ws])
		err2 := db.DB.Table("messages").Create(messageData).Error
		if err2 != nil {
			fmt.Println(err2.Error())
		}
	}
}

func (s *Server) BroadcastMessage(msg []byte, room string) {
	for conns, rooms := range s.connections {
		if rooms == room {
			n, err := conns.Write(msg)
			if err != nil {
				continue
			}
			fmt.Printf("Wrote %v bytes to %v\n", n, conns.RemoteAddr())
		}
	}
}
