import { useStore } from "@nanostores/react"
import { useCallback, useEffect } from "react"

import { MessageHandler } from "#shared/message-handler.ts"
import { DirectoryInput } from "#views/window/components/DirectoryInput.tsx"
import { KeyboardShortcuts } from "#views/window/components/KeyboardShortcuts.tsx"
import { Rename } from "#views/window/components/Rename.tsx"
import { StatusDisplay } from "#views/window/components/Status.tsx"
import { $isStarted, $outDir, $parentDir, $status, $videoState } from "#views/window/store.ts"

const messageHandler = new MessageHandler(iina)

const SHORTCUTS = [
  { key: "d", description: "Delete (move to _deleted folder)" },
  { key: "s", description: "Save (move to output folder)" },
  { key: "r", description: "Rename and save" },
  { key: "Left/Right", description: "Previous/Next video" },
]

const handleParentDirBlur = (value: string) => {
  $parentDir.set(value)
}

const handleOutDirBlur = (value: string) => {
  $outDir.set(value)
}

export const Window = () => {
  const videoState = useStore($videoState)
  const isStarted = useStore($isStarted)
  const parentDir = useStore($parentDir)
  const outDir = useStore($outDir)

  useEffect(() => {
    messageHandler.on("update-is-started", (newIsStarted) => {
      $isStarted.set(newIsStarted)
    })
    messageHandler.on("update-video-state", (newVideoState) => {
      $videoState.set(newVideoState)
    })
  }, [])

  const handleToggle = useCallback(() => {
    $status.set(null)
    if (isStarted) messageHandler.post("stop")
    else messageHandler.post("start", { parentDir, outDir })
  }, [isStarted, parentDir, outDir])

  return (
    <div className="h-full space-y-3 rounded-lg bg-white p-8 shadow-md">
      <h1 className="text-2xl font-semibold">Video Cleaner</h1>

      <DirectoryInput
        label="Parent Directory:"
        placeholder="/path/to/videos"
        disabled={isStarted}
        onBlur={handleParentDirBlur}
      />

      <DirectoryInput
        label="Output Directory:"
        placeholder="/path/to/output"
        disabled={isStarted}
        onBlur={handleOutDirBlur}
      />

      <button
        type="button"
        onClick={handleToggle}
        className={`w-full cursor-pointer rounded p-3 font-medium text-white ${isStarted ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}`}
      >
        {isStarted ? "Stop" : "Start"}
      </button>

      <StatusDisplay />

      {videoState.name !== null && (
        <div className="rounded border border-gray-200 bg-gray-50 p-2 text-gray-600">
          <div className="text-sm font-semibold text-gray-700">Current Video</div>
          <div className="mt-1.5 font-semibold text-gray-900">{videoState.name}</div>
          <div className="mt-1 text-sm">
            {videoState.index + 1}/{videoState.videos.length}
          </div>
        </div>
      )}

      <Rename />
      <KeyboardShortcuts shortcuts={SHORTCUTS} />
    </div>
  )
}
