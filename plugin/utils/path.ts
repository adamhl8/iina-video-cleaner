interface ParsedPath {
  /** The last part of the path (everything after the last slash). */
  base: string
  /** The last part of the path (everything after the last slash), _without_ the extension if there is one. */
  name: string
  /** The extension of the file if there is one. */
  ext: string | undefined
  /** The parent directory. i.e. the full path, excluding the last part of the path (everything before the last slash). */
  dir: string
}

export function parse(path: string): ParsedPath {
  const parts = path.split("/")

  const filename = parts.at(-1) ?? ""
  const filenameParts = filename.split(".")

  const name = parts.length > 1 ? parts.slice(0, -1).join(".") : filename

  const ext = filenameParts.length > 1 ? filenameParts.at(-1) : undefined

  const dir = parts.slice(0, -1).join("/")

  return { base: filename, name, ext, dir }
}

export function join(...parts: string[]): string {
  return parts.join("/").replaceAll(/\/+/g, "/")
}

export function resolve(path: string): string {
  return iina.utils.resolvePath(path)
}
