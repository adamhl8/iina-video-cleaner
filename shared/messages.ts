export interface StartData {
  parentDir: string | null
  outDir: string | null
}

export interface Status {
  message: string
  type: "info" | "error"
}

export interface BaseVideoState {
  videos: string[]
  index: number
}

export interface VideoState extends BaseVideoState {
  path: string | null
  name: string | null
}

export interface Messages {
  start: StartData
  stop: undefined
  "open-window": undefined
  "update-video-state": VideoState
  "update-status": Status
  "update-is-started": boolean
  "rename-start": undefined
  "rename-cancel": undefined
  "rename-end": string
}
