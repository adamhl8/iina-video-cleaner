import { start } from "#plugin/window/events/start.ts"
import { stop } from "#plugin/window/events/stop.ts"
import { $isStarted, $videoState } from "#plugin/window/store.ts"
import { postErrorStatus } from "#plugin/window/utils.ts"
import { MessageHandler } from "#shared/message-handler.ts"

const { standaloneWindow } = iina

const messageHandler = new MessageHandler(standaloneWindow)

export const openWindow = (): void => {
  standaloneWindow.loadFile(IINA_WINDOW_HTML_PATH)
  standaloneWindow.setFrame(500, 800)

  messageHandler.on("start", start, postErrorStatus)
  messageHandler.on("stop", stop, postErrorStatus)

  standaloneWindow.open()
}

$isStarted.listen((isStarted) => {
  messageHandler.post("update-is-started", isStarted)
})
$videoState.listen((videoState) => {
  messageHandler.post("update-video-state", videoState)
})
