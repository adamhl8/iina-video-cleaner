import * as path from "~/plugin/utils/path.ts"
import * as utils from "~/plugin/utils/utils.ts"
import { removeAndPlayNext } from "~/plugin/window/actions/previous-next.ts"
import { $outDir, $videoState } from "~/plugin/window/store.ts"

export async function deleteVideo() {
  const videoState = $videoState.get()
  const outDir = $outDir.get()
  if (!outDir) throw new Error("failed to delete video: outDir not set")

  const deletedDir = path.join(outDir, "_deleted")
  await utils.sh(`mkdir -p "${deletedDir}"`)
  await utils.sh(`mv '${videoState.path}' '${deletedDir}'`)

  removeAndPlayNext()
}
