import { type } from "arktype"
import { $ } from "bun"

const INFO_PATH = "./Info.json"
const PLGZ_PATH = "./iina-video-cleaner.iinaplgz"
const PACKAGE_CONTENTS = ["Info.json", "dist", "README.md", "LICENSE"]

/** IINA's plugin manifest: https://docs.iina.io/pages/creating-plugins.html */
const PluginInfo = type({
  name: "string",
  identifier: "string",
  version: "string",
  description: "string",
  author: {
    name: "string",
    email: "string.email",
    url: "string.url",
  },
  ghRepo: /^[\w\-]+\/[\w\-]+$/v,
  ghVersion: "number.integer >= 0",
  entry: "string",
  sidebarTab: { name: "string" },
  permissions: "('file-system' | 'network-request' | 'show-osd' | 'show-alert' | 'video-overlay')[]",
})

const version = process.argv.at(2)
if (!version) throw new Error("usage: bun scripts/pack.ts <version>")

const info = PluginInfo.assert(await Bun.file(INFO_PATH).json())

info.version = version
info.ghVersion += 1

await Bun.write(INFO_PATH, `${JSON.stringify(info, null, 2)}\n`)
await $`bun oxfmt ${INFO_PATH}`

await $`rm -f ${PLGZ_PATH}`
await $`zip --recurse-paths --quiet ${PLGZ_PATH} ${PACKAGE_CONTENTS}`
