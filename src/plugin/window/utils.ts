import { MessageHandler } from "#shared/message-handler.ts"

const messageHandler = new MessageHandler(iina.standaloneWindow)

export const postErrorStatus = (error: Error) => {
  messageHandler.post("update-status", { message: error.message, type: "error" })
}
