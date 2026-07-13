import { oxlintConfig } from "@adamhl8/configs"
import { defineConfig } from "oxlint"

const config = oxlintConfig({
  rules: {
    "unicorn/no-null": "off",
  },
  overrides: [
    {
      files: ["**/*.d.ts"],
      rules: {
        "import/unambiguous": "off",
      },
    },
  ],
})

export default defineConfig(config)
