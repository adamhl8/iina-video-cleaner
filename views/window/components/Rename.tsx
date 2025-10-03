/** biome-ignore-all lint/nursery/noJsxLiterals: ignore */
import { useEffect, useRef, useState } from "react"

import { MessageHandler } from "~/shared/message-handler.ts"
import { $status } from "~/views/window/store.ts"

const messageHandler = new MessageHandler(iina)

export default function RenameSection() {
  const [renameValue, setRenameValue] = useState("")
  const [shouldShow, setShouldShow] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messageHandler.on("rename-start", () => {
      setRenameValue("")
      setShouldShow(true)
    })
  }, [])

  useEffect(() => {
    if (shouldShow && inputRef.current) {
      inputRef.current.select()
      inputRef.current.focus()
    }
  }, [shouldShow])

  if (!shouldShow) return

  const handleClose = () => {
    setShouldShow(false)
    setRenameValue("")
    messageHandler.post("rename-cancel")
  }

  const handleSave = () => {
    const newName = renameValue.trim()
    if (!newName) {
      $status.set({ message: "Filename cannot be empty", type: "error" })
      return
    }

    messageHandler.post("rename-end", newName)

    handleClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSave()
    else if (e.key === "Escape") handleClose()
  }

  return (
    <div className="flex flex-col space-y-3">
      <span className="text-gray-600 text-sm">Rename file:</span>

      <input
        className="w-full rounded border border-gray-300 p-2.5 text-sm"
        ref={inputRef}
        type="text"
        placeholder="Enter new filename"
        value={renameValue}
        onChange={(e) => setRenameValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <div className="flex space-x-2">
        <button
          type="button"
          onClick={handleClose}
          className="cursor-pointer rounded bg-gray-400 p-3 font-medium text-white hover:bg-gray-500"
        >
          Cancel (Esc)
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="cursor-pointer rounded bg-blue-500 p-3 font-medium text-white hover:bg-blue-600"
        >
          Save (Enter)
        </button>
      </div>
    </div>
  )
}
