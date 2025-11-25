// EquiSync - Horse Reality Helper
// Content script injected into horsereality.com horse pages

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
        const name = item.textContent.trim();
        console.log("[EquiSync] Found horse name:", name);
        return name;
      }
    }
  }

  console.log("[EquiSync] Could not automatically find horse name.");
  return null;
}

function getHorseSexFromPage() {
  const sexEl = document.querySelector("p#sex");
  if (!sexEl) {
    console.log("[EquiSync] No #sex element found.");
    return null;
  }

  const raw = sexEl.textContent || "";
  const lower = raw.toLowerCase();

  if (lower.includes("gelding")) {
    console.log("[EquiSync] Found horse sex: Gelding");
    return "Gelding";
  }
  if (lower.includes("stallion")) {
    console.log("[EquiSync] Found horse sex: Stallion");
    return "Stallion";
  }
  if (lower.includes("mare")) {
    console.log("[EquiSync] Found horse sex: Mare");
    return "Mare";
  }

  console.log("[EquiSync] Could not normalize sex from text:", raw);
  return null;
}

function buildPlannerUrl(name, sex) {
  const params = new URLSearchParams();
  if (name) params.set("name", name);
  if (sex) params.set("sex", sex);

  const url = PLANNER_URL + "?" + params.toString();
  console.log("[EquiSync] Planner URL:", url);
  return url;
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

    const sex = getHorseSexFromPage();
    const url = buildPlannerUrl(name, sex);

    window.open(url, "_blank");
  });

  document.body.appendChild(btn);
  console.log("[EquiSync] Export button added.");
}

function initEquiSyncButton() {
  try {
    createExportButton();
  } catch (err) {
    console.error("[EquiSync] Failed to initialize button:", err);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initEquiSyncButton);
} else {
  initEquiSyncButton();
}
