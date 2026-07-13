export const tryCatch = (fn: () => unknown, onError?: (error: Error) => void) => {
  try {
    fn()
  } catch (error) {
    onError?.(error instanceof Error ? error : new Error(String(error)))
  }
}
