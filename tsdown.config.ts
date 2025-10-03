import { execSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import type { NormalizedUserConfig } from "tsdown"
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

/** Matches anything so *all* dependencies are bundled. */
const noExternal = [/.*/]

const pluginConfig = {
  entry: `${PLUGIN_ROOT}/index.ts`,
  noExternal,
  platform: "browser",
  target: false,
  define: {
    IINA_WINDOW_HTML_PATH: `"${getDistPath(VIEWS.window.htmlPath)}"`,
    IINA_SIDEBAR_HTML_PATH: `"${getDistPath(VIEWS.sidebar.htmlPath)}"`,
  },
} as const satisfies NormalizedUserConfig

const viewConfigs = Object.values(VIEWS).map((view) => {
  const outDir = path.dirname(getDistPath(view.componentPath))

  return {
    entry: view.componentPath,
    outDir,
    noExternal,
    platform: "browser",
    target: false,
    minify: true,
    copy: [
      {
        from: view.htmlPath,
        to: getDistPath(view.htmlPath),
      },
    ],
    hooks: {
      "build:done": buildViewCss,
    },
  } as const satisfies NormalizedUserConfig
})

function buildViewCss() {
  const cssOutputPath = `${DIST_ROOT}/global.css`
  if (fs.existsSync(cssOutputPath)) return // we only need to build the CSS once

  execSync(`tailwindcss -i ${VIEWS_ROOT}/global.css -o ${cssOutputPath}`, {
    stdio: ["inherit", "inherit", "inherit"],
  })
}

export default defineConfig([pluginConfig, ...viewConfigs])
