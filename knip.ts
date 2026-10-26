import { knipConfig } from "@adamhl8/configs"

const config = knipConfig({
  // List `global.css` because Tailwind's CLI loads it, which knip can't see.
  entry: ["./src/plugin/main.ts", "./src/views/**/main.tsx", "./src/views/global.css"],
  typescript: { config: ["tsconfig.json", "src/plugin/tsconfig.json", "src/views/tsconfig.json"] },
})

export default config
