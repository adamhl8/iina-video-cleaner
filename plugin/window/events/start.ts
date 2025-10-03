import * as path from "~/plugin/utils/path.ts"
import * as utils from "~/plugin/utils/utils.ts"
import { playVideo } from "~/plugin/window/actions/previous-next.ts"
import { registerKeybinds } from "~/plugin/window/keybinds.ts"
import { $baseVideoState, $isStarted, $outDir, $registeredIinaEvents, $videoState } from "~/plugin/window/store.ts"
import type { StartData } from "~/shared/messages.ts"

const { file, event, core } = iina

export function start({ parentDir, outDir }: StartData) {
  if (!(parentDir && outDir)) throw new Error("Please enter both directories")

  const resolvedParentDir = path.resolve(parentDir)
  if (!file.exists(resolvedParentDir)) throw new Error("Parent directory does not exist")
  const resolvedOutDir = path.resolve(outDir)

  const videos = getVideos(resolvedParentDir)
  if (videos.length === 0) throw new Error(`No videos in '${resolvedParentDir}'`)

  $isStarted.set(true)
  $outDir.set(resolvedOutDir)
  void utils.sh(`mkdir -p "${resolvedOutDir}"`)

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

const VIDEO_EXTENSIONS = ["mp4", "mkv", "avi", "mov", "wmv", "flv", "webm", "m4v", "mpg", "mpeg", "qt"]

function getVideos(dir: string) {
  const items = file.list(dir, { includeSubDir: true })

  const videos = items
    .filter((item) => {
      if (item.isDir) return false
      const ext = path.parse(item.filename).ext?.toLowerCase() ?? ""
      if (!ext) return false
      return VIDEO_EXTENSIONS.includes(ext.toLowerCase())
    })
    .map((item) => `${dir}/${item.filename}`)
    .sort((a, b) => a.localeCompare(b))

  return videos
}
