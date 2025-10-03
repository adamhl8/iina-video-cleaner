export function tryCatch(fn: () => unknown, onError?: (error: Error) => void) {
  try {
    fn()
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    onError?.(error)
  }
}
