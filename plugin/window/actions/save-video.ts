import * as utils from "~/plugin/utils/utils.ts"
import { removeAndPlayNext } from "~/plugin/window/actions/previous-next.ts"
import { $outDir, $videoState } from "~/plugin/window/store.ts"

export function saveVideo() {
  const outDir = $outDir.get()
  if (!outDir) throw new Error("failed to save video: outDir not set")

  const videoState = $videoState.get()
  if (videoState.path === null) throw new Error(`failed to save video at index ${videoState.index}: path is null`)

  void utils.sh(`mv '${videoState.path}' '${outDir}'`)

  removeAndPlayNext()
}
