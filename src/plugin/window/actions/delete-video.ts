import { join } from "#plugin/utils/path.ts"
import { sh } from "#plugin/utils/utils.ts"
import { removeAndPlayNext } from "#plugin/window/actions/previous-next.ts"
import { $outDir, $videoState } from "#plugin/window/store.ts"

export const deleteVideo = async () => {
  const videoState = $videoState.get()
  const outDir = $outDir.get()
  if (!outDir) throw new Error("failed to delete video: outDir not set")

  const deletedDir = join(outDir, "_deleted")
  await sh(`mkdir -p "${deletedDir}"`)
  await sh(`mv '${videoState.path}' '${deletedDir}'`)

  removeAndPlayNext()
}
