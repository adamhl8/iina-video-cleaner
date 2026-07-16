import { join, parse, relative } from "#plugin/utils/path.ts"
import { sh } from "#plugin/utils/utils.ts"
import { removeAndPlayNext } from "#plugin/window/actions/previous-next.ts"
import { $outDir, $parentDir, $videoState } from "#plugin/window/store.ts"

export const saveVideo = () => {
  const outDir = $outDir.get()
  if (!outDir) throw new Error("failed to save video: outDir not set")
  const parentDir = $parentDir.get()
  if (!parentDir) throw new Error("failed to save video: parentDir not set")

  const videoState = $videoState.get()
  if (videoState.path === null) throw new Error(`failed to save video at index ${videoState.index}: path is null`)

  const subDir = parse(relative(parentDir, videoState.path)).dir
  const destDir = subDir ? join(outDir, subDir) : outDir
  void sh(`mkdir -p "${destDir}" && mv '${videoState.path}' '${destDir}'`)

  removeAndPlayNext()
}
