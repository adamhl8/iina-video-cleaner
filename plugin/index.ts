import { openWindow } from "~/plugin/window/index.ts"
import { MessageHandler } from "~/shared/message-handler.ts"

const { event, sidebar, console: logger } = iina

const messageHandler = new MessageHandler(sidebar)

event.on("iina.window-loaded", () => {
  sidebar.loadFile(IINA_SIDEBAR_HTML_PATH)
  logger.log("Video Cleaner plugin loaded")

  messageHandler.on("open-window", openWindow)
})
