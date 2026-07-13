import { releaseItConfig } from "@adamhl8/configs"

const config = releaseItConfig({
  hooks: {
    "after:bump": ["bun scripts/pack.ts ${version}"],
  },
  github: {
    assets: ["*.iinaplgz"],
  },
})

export default config
