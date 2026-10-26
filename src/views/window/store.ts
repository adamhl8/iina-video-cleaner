import { atom, map } from "nanostores"

import type { Status, VideoState } from "#shared/messages.ts"

export const $isStarted = atom(false)
export const $parentDir = atom<string | undefined>()
export const $outDir = atom<string | undefined>()

export const $status = atom<Status | undefined>()

export const $videoState = map<VideoState>({
  videos: [],
  index: 0,
  path: undefined,
  name: undefined,
})
