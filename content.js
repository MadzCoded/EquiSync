// ========= CONFIG =========
const HORSE_NAME_SELECTORS = [
  "#name",                      // your original guess
  ".horse-name",                // common pattern
  ".horse-header h1",
  "h1"                           // fall back to first h1
];

const BUTTON_ID = "equisync-export-button";
const PLANNER_URL = "https://madzcoded.github.io/EquiSync/";
// ==========================

function getHorseNameFromPage() {
  for (const selector of HORSE_NAME_SELECTORS) {
    const el = document.querySelector(selector);
    if (el && el.textContent.trim()) {
      return el.textContent.trim();
    }
  }
  return null;
}

function createExportButton() {
  // Avoid duplicates
  if (document.getElementById(BUTTON_ID)) return;

  const btn = document.createElement("button");
  btn.id = BUTTON_ID;
  btn.title = "Send this horse to EquiSync";

  btn.textContent = "🐴";
  btn.style.position = "fixed";
  btn.style.bottom = "16px";
  btn.style.right = "16px";
  btn.style.width = "44px";
  btn.style.height = "44px";
  btn.style.borderRadius = "50%";
  btn.style.border = "none";
  btn.style.background = "#2563eb";
  btn.style.color = "#fff";
  btn.style.fontSize = "24px";
  btn.style.display = "flex";
  btn.style.alignItems = "center";
  btn.style.justifyContent = "center";
  btn.style.cursor = "pointer";
  btn.style.boxShadow = "0 6px 14px rgba(15, 23, 42, 0.35)";
  btn.style.zIndex = "999999";
  btn.style.padding = "0";
  btn.style.lineHeight = "1";
  btn.style.fontFamily =
    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

  btn.addEventListener("click", () => {
    let name = getHorseNameFromPage();

    if (!name) {
      const manual = window.prompt(
        "EquiSync couldn't automatically find the horse name.\n\nPlease type the horse's name:",
        ""
      );
      if (!manual) return;
      name = manual.trim();
      if (!name) return;
    }

    const url = PLANNER_URL + "?name=" + encodeURIComponent(name);
    console.log("[EquiSync] Opening planner with horse name:", name, url);
    window.open(url, "_blank");
  });

  document.body.appendChild(btn);
}

function initEquiSyncButton() {
  // Just create the button; it will try to read the name on click
  createExportButton();
}

// Run when page is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initEquiSyncButton);
} else {
  initEquiSyncButton();
}
