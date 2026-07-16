import videoExtensions from "video-extensions"

import { join, parse, resolve } from "#plugin/utils/path.ts"
import { sh } from "#plugin/utils/utils.ts"
import { playVideo } from "#plugin/window/actions/previous-next.ts"
import { registerKeybinds } from "#plugin/window/keybinds.ts"
import {
  $baseVideoState,
  $isStarted,
  $outDir,
  $parentDir,
  $registeredIinaEvents,
  $videoState,
} from "#plugin/window/store.ts"
import type { StartData } from "#shared/messages.ts"

const { file, event, core } = iina

const VIDEO_EXTENSIONS = new Set([...videoExtensions, "ts"])

const collectVideos = (dir: string): string[] =>
  file.list(dir, { includeSubDir: false }).flatMap((item) => {
    const itemPath = join(dir, item.filename)
    if (item.isDir) return collectVideos(itemPath)

    const ext = parse(item.filename).ext?.toLowerCase() ?? ""
    return ext && VIDEO_EXTENSIONS.has(ext) ? [itemPath] : []
  })

const getVideos = (dir: string) => collectVideos(dir).toSorted((a, b) => a.localeCompare(b))

export const start = ({ parentDir, outDir }: StartData) => {
  if (!(parentDir && outDir)) throw new Error("Please enter both directories")

  const resolvedParentDir = resolve(parentDir)
  if (!file.exists(resolvedParentDir)) throw new Error("Parent directory does not exist")
  const resolvedOutDir = resolve(outDir)

  const videos = getVideos(resolvedParentDir)
  if (videos.length === 0) throw new Error(`No videos in '${resolvedParentDir}'`)

  $isStarted.set(true)
  $parentDir.set(resolvedParentDir)
  $outDir.set(resolvedOutDir)
  void sh(`mkdir -p "${resolvedOutDir}"`)

  $baseVideoState.set({
    videos,
    index: 0,
  })

  const eventId = event.on("iina.file-loaded", () => {
    const duration = core.status.duration ?? 0
    core.seekTo(duration / 2)
    core.resume()
    core.setSpeed(1)
    core.audio.volume = 50

    const videoState = $videoState.get()

    // iina will automatically play the next video in the playlist when the current video ends. So a different video will be playing than what is shown to be playing in video-cleaner.
    // To handle this, if the video iina is playing is not the same as the one in video-cleaner, we play the current video.
    if (videoState.path && !core.status.url.endsWith(videoState.path)) playVideo()
  })
  $registeredIinaEvents.get().push({ name: "iina.file-loaded", id: eventId })

  registerKeybinds()
  playVideo()
}
