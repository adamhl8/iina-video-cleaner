import path from "node:path"

import { tsdownBundleConfig } from "@adamhl8/configs"
import { $ } from "bun"
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

const buildCss = async () => {
  await $`bun tailwindcss --input ${VIEWS_ROOT}/global.css --output ${DIST_ROOT}/global.css`
}

// Every view build triggers this hook, but the CSS is shared, so memoize to build it only once.
let viewCssBuild: Promise<void> | undefined
const buildViewCss = async () => {
  viewCssBuild ??= buildCss()
  await viewCssBuild
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
