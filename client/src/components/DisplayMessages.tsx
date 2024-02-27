import { LogOutIcon, UserIcon } from "lucide-react"

const DisplayMessages = ({ joinedRoom, messages }: {
  joinedRoom: string
  messages: IMessage[]
}) => {
  return (
    <div className="h-full">

      {/* Top bar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-2 py-3 items-center">
          <div className="w-3 h-3 my-2 bg-green-600 animate-pulse rounded-full"></div>
          <div>
            <p className="font-bold text-2xl">{joinedRoom}</p>
            <p className="text-xs uppercase font-semibold">Public Room</p>
          </div>
        </div>
        <div className="group cursor-pointer text-2xl py-3">
          <p className="flex group-hover:hidden items-center gap-1"><UserIcon /><span className="font-bold">{localStorage.getItem("username")}</span></p>
          <p className="group-hover:flex hidden cursor-pointer items-center gap-1 text-red-500" onClick={() => {
            localStorage.clear()
            location.href = "/signin"
          }}><LogOutIcon />Logout</p>
        </div>
      </div>

      {/* Actual Messages */}
      <div className="h-[80%] overflow-y-auto scrollbar space-y-5">
        {messages.map((ele, index) => (
          <div key={index} className="flex items-start">
            {localStorage.getItem("username") !== ele.author
              ? <div className="inline-block max-w-[70%] ">
                <p>{ele.author}</p>
                <p className="bg-[#E40915]/60 px-3 py-2 text-wrap break-words rounded-bl-xl rounded-br-xl rounded-tr-xl">
                  {ele.content}
                </p>
              </div>
              : <p className="ml-auto bg-[#E40915] px-3 py-2 inline-block max-w-[70%] text-wrap break-words rounded-bl-xl rounded-br-xl rounded-tl-xl">
                {ele.content}
              </p>
            }
          </div>
        ))}
      </div>
    </div>
  )
}

export default DisplayMessages
