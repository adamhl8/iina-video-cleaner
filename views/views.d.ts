/** biome-ignore-all lint/suspicious/noExplicitAny: ignore */

interface IINAWebview {
  postMessage(name: string, data?: any): void
  onMessage(name: string, handler: (data?: any) => void): void
}

declare const iina: IINAWebview
