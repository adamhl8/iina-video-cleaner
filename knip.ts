import { knipConfig } from "@adamhl8/configs"

const config = knipConfig({
  entry: ["./plugin/main.ts", "./views/**/main.tsx", "./scripts/*.ts"],
  ignore: ["views/global.css"],
  ignoreDependencies: ["tailwindcss"],
  typescript: { config: ["tsconfig.json", "plugin/tsconfig.json", "views/tsconfig.json"] },
})

export default config
