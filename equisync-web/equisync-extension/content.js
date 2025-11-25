// ====== CONFIG: tweak these selectors once you see the real page ======
const HORSE_NAME_SELECTORS = [
  "#name",   // your confirmed selector
  "h1"       // fallback
];

// Where to insert the button. We'll try a few common places:
const INSERT_TARGET_SELECTORS = [
  ".horse-header",  // if the page has a dedicated header for the horse
  ".page-header",
  "h1",             // next to the main heading
  "body"            // absolute fallback
];

const BUTTON_ID = "equisync-grab-horse-btn";

// =====================================================================

function findHorseNameElement() {
  for (const selector of HORSE_NAME_SELECTORS) {
    const el = document.querySelector(selector);
    if (el && el.textContent.trim()) {
      return el;
    }
  }
  return null;
}

function getHorseName() {
  const el = findHorseNameElement();
  if (!el) return null;
  return el.textContent.trim();
}

function findInsertTarget() {
  for (const selector of INSERT_TARGET_SELECTORS) {
    const el = document.querySelector(selector);
    if (el) return el;
  }
  return document.body;
}

function createButton() {
  // Avoid adding multiple buttons if the script runs again
  if (document.getElementById(BUTTON_ID)) return;

  const button = document.createElement("button");
  button.id = BUTTON_ID;
  button.textContent = "Sync horse to EquiSync";

  // Basic styling so it doesn't look horrible
  button.style.padding = "6px 10px";
  button.style.marginLeft = "8px";
  button.style.borderRadius = "999px";
  button.style.border = "none";
  button.style.fontSize = "12px";
  button.style.cursor = "pointer";
  button.style.backgroundColor = "#2563eb";
  button.style.color = "#fff";
  button.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";

  button.addEventListener("click", () => {
    const name = getHorseName();

    if (!name) {
      alert("EquiSync: Couldn’t find the horse name on this page. You may need to adjust the selector in content.js.");
      return;
    }

    // For v1: just show it + log it
    console.log("[EquiSync] Horse name:", name);
    alert("EquiSync captured horse name:\n\n" + name);

    // Later: send this to your planner / storage instead of alert()
  });

  const target = findInsertTarget();

  // If target is a heading, put the button after it; otherwise just append
  if (target.tagName && target.tagName.toLowerCase().startsWith("h")) {
    target.insertAdjacentElement("afterend", button);
  } else {
    target.appendChild(button);
  }
}

function initEquiSync() {
  // Only add the button on pages that look like a horse page (have a horse name)
  const nameElement = findHorseNameElement();
  if (!nameElement) {
    // No obvious horse name found → probably not a specific horse page
    return;
  }
  createButton();
}

// Run when the page is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initEquiSync);
} else {
  initEquiSync();
}
