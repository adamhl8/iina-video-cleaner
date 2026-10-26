import { atom, computed, map } from "nanostores"

import { parse } from "#plugin/utils/path.ts"
import type { BaseVideoState, VideoState } from "#shared/messages.ts"

export const $isStarted = atom(false)
export const $parentDir = atom<string | undefined>()
export const $outDir = atom<string | undefined>()

export const $registeredIinaEvents = atom<{ name: string; id: string }[]>([])

export const $baseVideoState = map<BaseVideoState>({
  videos: [],
  index: 0,
})

export const $videoState = computed($baseVideoState, (baseVideoState): VideoState => {
  const videoPath = baseVideoState.videos[baseVideoState.index]
  const videoName = videoPath ? parse(videoPath).base : undefined

  return {
    ...baseVideoState,
    path: videoPath,
    name: videoName,
  }
})
