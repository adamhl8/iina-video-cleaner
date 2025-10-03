/** biome-ignore-all lint/nursery/noJsxLiterals: ignore */
import { useStore } from "@nanostores/react"
import { useEffect } from "react"

import { MessageHandler } from "~/shared/message-handler.ts"
import DirectoryInput from "~/views/window/components/DirectoryInput.tsx"
import KeyboardShortcuts from "~/views/window/components/KeyboardShortcuts.tsx"
import Rename from "~/views/window/components/Rename.tsx"
import StatusDisplay from "~/views/window/components/Status.tsx"
import { $isStarted, $outDir, $parentDir, $status, $videoState } from "~/views/window/store.ts"

const messageHandler = new MessageHandler(iina)

export default function Window() {
  const videoState = useStore($videoState)
  const isStarted = useStore($isStarted)
  const parentDir = useStore($parentDir)
  const outDir = useStore($outDir)

  useEffect(() => {
    messageHandler.on("update-is-started", (newIsStarted) => $isStarted.set(newIsStarted))
    messageHandler.on("update-video-state", (newVideoState) => $videoState.set(newVideoState))
  }, [])

  const handleStart = () => {
    $status.set(null)
    messageHandler.post("start", { parentDir, outDir })
  }

  const handleStop = () => {
    $status.set(null)
    messageHandler.post("stop")
  }

  return (
    <div className="h-full space-y-3 rounded-lg bg-white p-8 shadow-md">
      <h1 className="font-semibold text-2xl">Video Cleaner</h1>

      <DirectoryInput
        label="Parent Directory:"
        placeholder="/path/to/videos"
        disabled={isStarted}
        onBlur={(value) => $parentDir.set(value)}
      />

      <DirectoryInput
        label="Output Directory:"
        placeholder="/path/to/output"
        disabled={isStarted}
        onBlur={(value) => $outDir.set(value)}
      />

      <button
        type="button"
        onClick={() => (isStarted ? handleStop() : handleStart())}
        className={`w-full cursor-pointer rounded p-3 font-medium text-white ${isStarted ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}`}
      >
        {isStarted ? "Stop" : "Start"}
      </button>

      <StatusDisplay />

      {videoState.index !== null && videoState.name !== null && (
        <div className="rounded border border-gray-200 bg-gray-50 p-2 text-gray-600">
          <div className="font-semibold text-gray-700 text-sm">Current Video</div>
          <div className="mt-1.5 font-semibold text-gray-900">{videoState.name}</div>
          <div className="mt-1 text-sm">
            {videoState.index + 1}/{videoState.videos.length}
          </div>
        </div>
      )}

      <Rename />
      <KeyboardShortcuts
        shortcuts={[
          { key: "d", description: "Delete (move to _deleted folder)" },
          { key: "s", description: "Save (move to output folder)" },
          { key: "r", description: "Rename and save" },
          { key: "Left/Right", description: "Previous/Next video" },
        ]}
      />
    </div>
  )
}
