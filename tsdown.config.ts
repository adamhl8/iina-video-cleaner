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
/** Tsdown resolves `outDir` and `copy.to` as folders (it re-joins the source filename onto `to`). */
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

// Each view config is built by an explicit call rather than `Object.values(VIEWS).map(...)`. Mapping produces an
// `Array<MergedConfig<...>>`, and relating that element type to tsdown's `UserConfig` sends the checker into an
// unbounded type instantiation (tsc and tsgolint both hang). An array literal of individual calls stays cheap.
const sidebarConfig = tsdownBundleConfig({
  entry: VIEWS.sidebar.componentPath,
  outDir: getDistDir(VIEWS.sidebar.componentPath),
  deps: { alwaysBundle },
  platform: "browser",
  minify: true,
  copy: [{ from: VIEWS.sidebar.htmlPath, to: getDistDir(VIEWS.sidebar.htmlPath) }],
  hooks: { "build:done": buildViewCss },
})

const windowConfig = tsdownBundleConfig({
  entry: VIEWS.window.componentPath,
  outDir: getDistDir(VIEWS.window.componentPath),
  deps: { alwaysBundle },
  platform: "browser",
  minify: true,
  copy: [{ from: VIEWS.window.htmlPath, to: getDistDir(VIEWS.window.htmlPath) }],
  hooks: { "build:done": buildViewCss },
})

export default defineConfig([pluginConfig, sidebarConfig, windowConfig])
