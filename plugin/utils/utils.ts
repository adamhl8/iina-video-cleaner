const { utils } = iina

export async function sh(command: string) {
  const { status, stdout, stderr } = await utils.exec("/bin/sh", ["-c", command])
  const output = [stdout, stderr]
    .map((txt) => txt.trim())
    .filter(Boolean)
    .join("\n")

  if (status === 0) return output

  throw new Error(`failed to execute command '${command}':\n${output}`)
}
