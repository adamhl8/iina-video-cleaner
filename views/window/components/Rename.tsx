import { useCallback, useEffect, useRef, useState } from "react"

import { MessageHandler } from "#shared/message-handler.ts"
import { $status } from "#views/window/store.ts"

const messageHandler = new MessageHandler(iina)

export const Rename = () => {
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

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRenameValue(e.target.value)
  }, [])

  const handleClose = useCallback(() => {
    setShouldShow(false)
    setRenameValue("")
    messageHandler.post("rename-cancel")
  }, [])

  const handleSave = useCallback(() => {
    const newName = renameValue.trim()
    if (!newName) {
      $status.set({ message: "Filename cannot be empty", type: "error" })
      return
    }

    messageHandler.post("rename-end", newName)

    handleClose()
  }, [renameValue, handleClose])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") handleSave()
      else if (e.key === "Escape") handleClose()
    },
    [handleSave, handleClose],
  )

  if (!shouldShow) return

  return (
    <div className="flex flex-col space-y-3">
      <span className="text-sm text-gray-600">Rename file:</span>

      <input
        className="w-full rounded border border-gray-300 p-2.5 text-sm"
        ref={inputRef}
        type="text"
        placeholder="Enter new filename"
        value={renameValue}
        onChange={handleChange}
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
