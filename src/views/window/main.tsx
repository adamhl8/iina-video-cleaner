import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { Window } from "#views/window/Window.tsx"

const root = document.querySelector("#root")
if (!root) throw new Error("Root element not found")

createRoot(root).render(
  <StrictMode>
    <Window />
  </StrictMode>,
)
