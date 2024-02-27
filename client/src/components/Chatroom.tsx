import { useState } from "react";
import { MenuIcon, RefreshCw, XIcon } from "lucide-react";
import { ws } from "@/store/wsStore";
import { room } from "@/store/roomStore";

export default function Chatroom() {
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [chatrooms, setChatrooms] = useState<string[]>([])
  const [joined, setJoined] = useState<string>("")
  const [shown, setShown] = useState<boolean>(false)

  const fetchChatrooms = async () => {
    try {
      setRefreshing(true)
      const res = await fetch(`${import.meta.env.PUBLIC_API_URL}/rooms`)
      const data = await res.json()
      setChatrooms(data)
    }
    catch (err) {
      console.error(err)
    }
    finally {
      setRefreshing(false)
    }
  }

  const connectToRoom = (ele: string) => {
    if (ws.get() !== null) {
      ws.get()?.close()
    }
    const socket = new WebSocket(`${import.meta.env.PUBLIC_WS_URL}`);
    socket.onopen = () => { socket.send(ele) }
    ws.set(socket)
    room.set(ele)
    setJoined(ele)
  }

  return (
    <>
      <MenuIcon className="md:hidden block" onClick={() => setShown(!shown)} />
      <div className={`${!shown ? "w-0" : "w-full"} md:w-[220px] lg:w-[300px] fixed md:static left-0 h-full bg-[#2D2C2C] z-10 md:px-5 overflow-hidden transition-all`}>
        <div className="flex justify-between">
          <div className="font-protest flex items-center gap-1 mb-5">
            <div className="w-20 aspect-square">
              <img src="/rocket.svg" alt="logo" />
            </div>
            <p className="text-2xl tracking-wide uppercase">Stellar</p>
          </div>

          <XIcon onClick={()=>setShown(!shown)} className="mt-6 pr-1" />
        </div>

        <div className="flex justify-between px-4 mb-10">
          <p className="font-semibold">Chatrooms ({chatrooms.length})</p>
          <RefreshCw className={`${refreshing ? "animate-spin" : ""} cursor-pointer`} size={20} onClick={fetchChatrooms} />
        </div>
        {
          chatrooms.length === 0
            ? <div className="font-bold flex items-center justify-center my-10 text-center">No chatrooms found<br />Please Refresh the list</div>
            : <div>
              {chatrooms.map((ele, index) => (
                <>
                  <div
                    key={index}
                    className={`${joined === ele ? "after:content-['_🚀'] after:ml-auto bg-[#FF1111]" : "bg-transparent"} rounded-md cursor-pointer hover:bg-[#E40915] transition-all py-4 my-2 px-3`}
                    onClick={() => connectToRoom(ele)}
                  >
                    {ele}
                  </div>
                </>
              ))}
            </div>
        }
      </div>
    </>
  )
}
