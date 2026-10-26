import { oxlintConfig } from "@adamhl8/configs"
import { defineConfig } from "oxlint"

const config = oxlintConfig({
  overrides: [
    {
      // Turn off `import/unambiguous` because ambient declaration files must stay scripts to declare globals.
      // A disable comment can't suppress it, because the rule reports at the file level.
      files: ["**/*.d.ts"],
      rules: { "import/unambiguous": "off" },
    },
  ],
})

export default defineConfig(config)
