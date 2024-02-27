import { ws } from "../store/wsStore";
import { SendIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { room } from "../store/roomStore";
import DisplayMessages from "./DisplayMessages";

const Messages = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [websocket, setWebsocket] = useState<WebSocket>()
  const [joinedRoom, setJoinedRoom] = useState<string>("")
  const [username, setUsername] = useState<string>("")
  const messageRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setUsername(localStorage.getItem("username")!)
    const handleWebsocketMessage = (event: MessageEvent) => {
      const parsedData = JSON.parse(event.data)
      setMessages((prevMessages) => [...prevMessages, {
        content: parsedData.content,
        room: parsedData.room,
        author: parsedData.author
      }])
    };

    const unsubscribeWs = ws.subscribe((newWebSocket: WebSocket | null) => {
      if (websocket) {
        websocket.removeEventListener("message", handleWebsocketMessage);
      }
      if (newWebSocket !== null) {
        newWebSocket.addEventListener("message", handleWebsocketMessage);

        setWebsocket(newWebSocket)
      }
    })

    const unsubscribeRoom = room.subscribe(async (roomVal: string) => {
      setJoinedRoom(roomVal)
      const res = await fetch(`${import.meta.env.PUBLIC_API_URL}/getMessages?room=${roomVal}`)
      const data = await res.json()
      if (data !== null) {
        setMessages(JSON.parse(JSON.stringify(data)))
      }
      else {
        setMessages([])
      }
    })

    return () => {
      unsubscribeWs()
      unsubscribeRoom()
    }
  }, []);

  // Handler function
  const submitChat = (e: React.FormEvent) => {
    e.preventDefault()
    if (messageRef.current !== null && websocket !== null) {
      websocket?.send(JSON.stringify({
        "content": messageRef.current.value,
        "author": username,
      }))
      messageRef.current.value = ""
    }
  }


  return (
    <>
      <div className="messages-bg"></div>
      <div className="w-full md:w-[75%] md:px-0 px-2 mx-auto relative messages">
        <div className="h-[95vh]">
          {joinedRoom.length > 0
            ? <DisplayMessages joinedRoom={joinedRoom} messages={messages} />
            : <div className="h-full flex items-center justify-center font-bold text-3xl text-center">Click on a room to start chatting 💬</div>
          }
        </div>

        {/* Message Input */}
        <form className={`${joinedRoom.length > 0 ? "block" : "hidden"} w-full relative bottom-5 flex items-center justify-center`} onSubmit={submitChat}>
          <input
            ref={messageRef}
            className="w-full bg-[#040611] px-5 py-3 border border-r-0 rounded-l-full outline-none"
            placeholder="Start Chatting..."
          />
          <button type="submit" className="bg-[#E40915] p-3 border border-[#E40915] rounded-r-full cursor-pointer" title="Send">
            <SendIcon />
          </button>
        </form>
      </div>
    </>
  );
};

export default Messages;
