import { deleteVideo } from "#plugin/window/actions/delete-video.ts"
import { nextVideo, previousVideo } from "#plugin/window/actions/previous-next.ts"
import { renameVideo } from "#plugin/window/actions/rename-video.ts"
import { saveVideo } from "#plugin/window/actions/save-video.ts"
import { postErrorStatus } from "#plugin/window/utils.ts"
import { tryCatch } from "#shared/utils.ts"

const { input } = iina

const KEYBINDS = {
  d: deleteVideo,
  s: saveVideo,
  r: renameVideo,
  LEFT: previousVideo,
  RIGHT: nextVideo,
}

export const registerKeybinds = (): void => {
  for (const [key, handler] of Object.entries(KEYBINDS)) {
    input.onKeyUp(
      key,
      () => {
        tryCatch(handler, postErrorStatus)
        return true
      },
      input.PRIORITY_HIGH,
    )

    input.onKeyDown(key, () => true, input.PRIORITY_HIGH)
  }
}

export const unregisterKeybinds = (): void => {
  for (const [key] of Object.entries(KEYBINDS)) {
    // The JSDoc for `onKeyUp` and `onKeyDown` state "To remove the listener, pass null to this parameter", but that doesn't seem to actually work.
    // So instead, we just make them no-ops.
    input.onKeyUp(key, () => false, input.PRIORITY_LOW)
    input.onKeyDown(key, () => false, input.PRIORITY_LOW)
  }
}
