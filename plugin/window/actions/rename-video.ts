import { join, parse, relative } from "#plugin/utils/path.ts"
import { sh } from "#plugin/utils/utils.ts"
import { playVideo, removeAndPlayNext } from "#plugin/window/actions/previous-next.ts"
import { $outDir, $parentDir, $videoState } from "#plugin/window/store.ts"
import { MessageHandler } from "#shared/message-handler.ts"

const { standaloneWindow, file } = iina

const messageHandler = new MessageHandler(standaloneWindow)

export const renameVideo = (): void => {
  const outDir = $outDir.get()
  if (!outDir) throw new Error("failed to rename video: outDir not set")
  const parentDir = $parentDir.get()
  if (!parentDir) throw new Error("failed to rename video: parentDir not set")

  standaloneWindow.open()
  messageHandler.post("rename-start")

  messageHandler.on("rename-cancel", playVideo)

  messageHandler.on("rename-end", (newName) => {
    const videoState = $videoState.get()
    if (videoState.path === null) throw new Error(`failed to rename video at index ${videoState.index}: path is null`)

    const subDir = parse(relative(parentDir, videoState.path)).dir
    const destDir = subDir ? join(outDir, subDir) : outDir

    const { ext } = parse(videoState.path)
    let finalName = `${newName}.${ext}`

    let counter = 1
    while (file.exists(join(destDir, finalName))) {
      finalName = `${newName}_${counter}.${ext}`
      counter++
    }

    const destPath = join(destDir, finalName)
    void sh(`mkdir -p "${destDir}" && mv '${videoState.path}' '${destPath}'`)

    removeAndPlayNext()
  })
}
