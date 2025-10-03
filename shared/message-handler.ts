import type { Messages } from "~/shared/messages.ts"
import { tryCatch } from "~/shared/utils.ts"

interface IINAShared {
  postMessage(name: string, data: unknown): void
  onMessage(name: string, handler: (data: unknown) => void): void
}

export class MessageHandler {
  readonly #iina: IINAShared

  public constructor(parent: IINAShared) {
    this.#iina = parent
  }

  public on<E extends keyof Messages>(
    event: E,
    callback: (data: Messages[E]) => void,
    onError?: (error: Error) => void,
  ) {
    this.#iina.onMessage(`event:${event}`, (data) => {
      tryCatch(() => callback(data as Messages[E]), onError)
    })
  }

  public post<E extends keyof Messages>(
    event: E,
    // This rest parameter allows the second argument to be optional if the event type is `undefined`
    ...args: Messages[E] extends undefined ? [data?: Messages[E]] : [data: Messages[E]]
  ): void {
    this.#iina.postMessage(`event:${event}`, args[0])
  }
}
