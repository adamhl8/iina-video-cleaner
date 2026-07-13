import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { Sidebar } from "#views/sidebar/Sidebar.tsx"

const root = document.querySelector("#root")
if (!root) throw new Error("Root element not found")

createRoot(root).render(
  <StrictMode>
    <Sidebar />
  </StrictMode>,
)
