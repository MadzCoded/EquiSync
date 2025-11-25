// ========= CONFIG =========
const BUTTON_ID = "equisync-export-button";
const PLANNER_URL = "https://madzcoded.github.io/EquiSync/";
// ==========================

function getHorseNameFromPage() {
  const rows = document.querySelectorAll(".info_table_row");

  for (const row of rows) {
    const label = row.querySelector(".info_label");
    if (!label) continue;

    const labelText = label.textContent.trim().toLowerCase();
    if (labelText === "name") {
      const item = row.querySelector(".info_item");
      if (item && item.textContent.trim()) {
        return item.textContent.trim();
      }
    }
  }

  // fallback to prompt
  return null;
}

function createExportButton() {
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

  btn.addEventListener("click", () => {
    let name = getHorseNameFromPage();

    if (!name) {
      name = prompt(
        "EquiSync couldn't find the horse name automatically.\n\nPlease type it manually:"
      );
      if (!name) return;
    }

    const url = PLANNER_URL + "?name=" + encodeURIComponent(name);
    window.open(url, "_blank");
  });

  document.body.appendChild(btn);
}

function initEquiSyncButton() {
  createExportButton();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initEquiSyncButton);
} else {
  initEquiSyncButton();
}
