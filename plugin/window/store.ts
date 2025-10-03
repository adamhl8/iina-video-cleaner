import { atom, computed, map } from "nanostores"

import * as path from "~/plugin/utils/path.ts"
import type { BaseVideoState, VideoState } from "~/shared/messages.ts"

export const $isStarted = atom(false)
export const $outDir = atom<string | null>(null)

export const $registeredIinaEvents = atom<{ name: string; id: string }[]>([])

export const $baseVideoState = map<BaseVideoState>({
  videos: [],
  index: 0,
})

export const $videoState = computed<VideoState, typeof $baseVideoState>($baseVideoState, (baseVideoState) => {
  const videoPath = baseVideoState.videos[baseVideoState.index] ?? null
  const videoName = videoPath ? path.parse(videoPath).base : null

  return {
    ...baseVideoState,
    path: videoPath,
    name: videoName,
  }
})
