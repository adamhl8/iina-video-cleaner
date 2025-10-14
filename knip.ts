import { knipConfig } from "@adamhl8/configs"

const config = knipConfig({
  entry: ["./plugin/main.ts", "./views/**/main.tsx", "./**/*.d.ts"],
  ignoreDependencies: ["@tailwindcss/cli", "tailwindcss"],
})

export default config
