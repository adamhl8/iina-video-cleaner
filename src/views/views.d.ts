interface IINAWebview {
  postMessage: (name: string, data?: unknown) => void
  onMessage: (name: string, handler: (data: unknown) => void) => void
}

declare const iina: IINAWebview
