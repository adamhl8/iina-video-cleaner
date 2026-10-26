import { MessageHandler } from "#shared/message-handler.ts"

const messageHandler = new MessageHandler(iina)

const handleOpen = () => {
  messageHandler.post("open-window")
}

export function Sidebar() {
  return (
    <div className="p-3">
      <button
        type="button"
        className="w-full cursor-pointer rounded-sm bg-blue-500 p-3 text-sm text-white"
        onClick={handleOpen}
      >
        Open Video Cleaner
      </button>
    </div>
  )
}
