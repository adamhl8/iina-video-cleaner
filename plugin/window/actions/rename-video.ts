import { join, parse } from "#plugin/utils/path.ts"
import { sh } from "#plugin/utils/utils.ts"
import { playVideo, removeAndPlayNext } from "#plugin/window/actions/previous-next.ts"
import { $outDir, $videoState } from "#plugin/window/store.ts"
import { MessageHandler } from "#shared/message-handler.ts"

const { standaloneWindow, file } = iina

const messageHandler = new MessageHandler(standaloneWindow)

export const renameVideo = (): void => {
  const outDir = $outDir.get()
  if (!outDir) throw new Error("failed to rename video: outDir not set")

  standaloneWindow.open()
  messageHandler.post("rename-start")

  messageHandler.on("rename-cancel", playVideo)

  messageHandler.on("rename-end", (newName) => {
    const videoState = $videoState.get()
    if (videoState.path === null) throw new Error(`failed to rename video at index ${videoState.index}: path is null`)
    const { ext } = parse(videoState.path)
    let finalName = `${newName}.${ext}`

    let counter = 1
    while (file.exists(join(outDir, finalName))) {
      finalName = `${newName}_${counter}.${ext}`
      counter++
    }

    const destPath = join(outDir, finalName)
    void sh(`mv '${videoState.path}' '${destPath}'`)

    removeAndPlayNext()
  })
}
