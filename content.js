// ========= CONFIG =========
const HORSE_NAME_SELECTOR = "#name"; // confirmed from your HR page
const BUTTON_ID = "equisync-export-button";
const PLANNER_URL = "https://madzcoded.github.io/EquiSync/";
// ==========================

function getHorseNameElement() {
  const el = document.querySelector(HORSE_NAME_SELECTOR);
  if (el && el.textContent.trim()) return el;
  return null;
}

function getHorseName() {
  const el = getHorseNameElement();
  if (!el) return null;
  return el.textContent.trim();
}

function createExportButton() {
  // Avoid duplicates
  if (document.getElementById(BUTTON_ID)) return;

  const btn = document.createElement("button");
  btn.id = BUTTON_ID;
  btn.title = "Send this horse to EquiSync";

  // Simple round icon button
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
  btn.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

  btn.addEventListener("click", () => {
    const name = getHorseName();
    if (!name) {
      alert("EquiSync: Couldn't find the horse name on this page.");
      return;
    }

    const url = PLANNER_URL + "?name=" + encodeURIComponent(name);
    console.log("[EquiSync] Opening planner with horse name:", name, url);
    window.open(url, "_blank");
  });

  document.body.appendChild(btn);
}

function initEquiSyncButton() {
  const nameEl = getHorseNameElement();
  if (nameEl) {
    createExportButton();
    return true;
  }
  return false;
}

function setupObserver() {
  // If #name is already there, we're done
  if (initEquiSyncButton()) return;

  // Otherwise, watch for DOM changes (useful if HR loads content dynamically)
  const observer = new MutationObserver(() => {
    if (initEquiSyncButton()) {
      observer.disconnect();
    }
  });

  observer.observe(document.documentElement || document.body, {
    childList: true,
    subtree: true
  });
}

// Run when page is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupObserver);
} else {
  setupObserver();
}
