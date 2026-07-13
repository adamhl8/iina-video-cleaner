import { atom, map } from "nanostores"

import type { Status, VideoState } from "#shared/messages.ts"

export const $isStarted = atom(false)
export const $parentDir = atom<string | null>(null)
export const $outDir = atom<string | null>(null)

export const $status = atom<Status | null>(null)

export const $videoState = map<VideoState>({
  videos: [],
  index: 0,
  path: null,
  name: null,
})
