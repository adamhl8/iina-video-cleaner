import { useStore } from "@nanostores/react"
import { useEffect } from "react"

import { MessageHandler } from "~/shared/message-handler.ts"
import { $status } from "~/views/window/store.ts"

const messageHandler = new MessageHandler(iina)

export default function StatusDisplay() {
  const status = useStore($status)

  useEffect(() => {
    messageHandler.on("update-status", (newStatus) => $status.set(newStatus))
  }, [])

  if (!status) return
  const { message, type } = status

  return (
    <div className={`rounded p-3 text-sm ${type === "info" ? "bg-blue-50 text-blue-700" : "bg-red-50 text-red-700"}`}>
      {message}
    </div>
  )
}
