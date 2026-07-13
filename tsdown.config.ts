import { execSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

import { tsdownBundleConfig } from "@adamhl8/configs"
import { defineConfig } from "tsdown"

const PLUGIN_ROOT = "./plugin"
const VIEWS_ROOT = "./views"
const DIST_ROOT = "./dist"

const VIEWS = {
  sidebar: {
    componentPath: `${VIEWS_ROOT}/sidebar/main.tsx`,
    htmlPath: `${VIEWS_ROOT}/sidebar/sidebar.html`,
  },
  window: {
    componentPath: `${VIEWS_ROOT}/window/main.tsx`,
    htmlPath: `${VIEWS_ROOT}/window/window.html`,
  },
} as const

const getDistPath = (srcPath: string) => path.join(DIST_ROOT, path.relative(VIEWS_ROOT, srcPath))
const getDistDir = (srcPath: string) => path.dirname(getDistPath(srcPath))

/** Matches anything so _all_ dependencies are bundled. */
const alwaysBundle = [/.*/v]

const buildViewCss = () => {
  const cssOutputPath = `${DIST_ROOT}/global.css`
  if (fs.existsSync(cssOutputPath)) return // we only need to build the CSS once

  execSync(`tailwindcss -i ${VIEWS_ROOT}/global.css -o ${cssOutputPath}`, {
    stdio: ["inherit", "inherit", "inherit"],
  })
}

const pluginConfig = tsdownBundleConfig({
  entry: `${PLUGIN_ROOT}/main.ts`,
  deps: { alwaysBundle },
  platform: "browser",
  define: {
    IINA_WINDOW_HTML_PATH: `"${getDistPath(VIEWS.window.htmlPath)}"`,
    IINA_SIDEBAR_HTML_PATH: `"${getDistPath(VIEWS.sidebar.htmlPath)}"`,
  },
})

const viewConfigs = Object.values(VIEWS).map((view) =>
  tsdownBundleConfig({
    entry: view.componentPath,
    outDir: getDistDir(view.componentPath),
    deps: { alwaysBundle },
    platform: "browser",
    minify: true,
    copy: [{ from: view.htmlPath, to: getDistDir(view.htmlPath) }],
    hooks: { "build:done": buildViewCss },
  }),
)

export default defineConfig([pluginConfig, ...viewConfigs])
