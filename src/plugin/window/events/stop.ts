import { unregisterKeybinds } from "#plugin/window/keybinds.ts"
import { $baseVideoState, $isStarted, $registeredIinaEvents } from "#plugin/window/store.ts"

const { core, event } = iina

export const stop = () => {
  unregisterKeybinds()
  $baseVideoState.set({
    videos: [],
    index: 0,
  })

  core.stop()

  for (const { name, id } of $registeredIinaEvents.get()) event.off(name, id)

  $isStarted.set(false)
}
