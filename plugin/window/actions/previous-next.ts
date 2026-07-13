import { $baseVideoState, $videoState } from "#plugin/window/store.ts"

const { core } = iina

export const playVideo = () => {
  const videoState = $videoState.get()
  const videoPath = videoState.path
  if (!videoPath) throw new Error(`failed to play video at index '${videoState.index}': path is null`)

  core.open(videoPath)
}

export const previousVideo = (): void => {
  const baseVideoState = $baseVideoState.get()
  // If we're not at the first video, play the previous one, otherwise play the first one
  const previousIndex = baseVideoState.index > 0 ? baseVideoState.index - 1 : 0
  $baseVideoState.setKey("index", previousIndex)
  playVideo()
}

export const nextVideo = (): void => {
  const baseVideoState = $baseVideoState.get()

  const lastIndex = baseVideoState.videos.length - 1
  // If we're not at the last video, play the next one, otherwise play the last one
  const nextIndex = baseVideoState.index < lastIndex ? baseVideoState.index + 1 : lastIndex

  $baseVideoState.setKey("index", nextIndex)
  playVideo()
}

export const removeAndPlayNext = () => {
  const baseVideoState = $baseVideoState.get()
  const videos = baseVideoState.videos.toSpliced(baseVideoState.index, 1)
  const lastIndex = videos.length - 1
  // If the removed video was the last one, play the new last video, otherwise play the current index (which will be the next one)
  const index = baseVideoState.index > lastIndex ? lastIndex : baseVideoState.index

  $baseVideoState.set({
    videos,
    index,
  })
  playVideo()
}
