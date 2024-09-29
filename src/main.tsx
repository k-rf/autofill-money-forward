import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./App";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {
  console.warn("Failed to set chrome panel behavior");
});

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
