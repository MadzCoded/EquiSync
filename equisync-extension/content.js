// ====== CONFIG ======
const HORSE_NAME_SELECTORS = [
  "#name", // confirmed selector on Horse Reality
  "h1"     // fallback
];

const INSERT_TARGET_SELECTORS = [
  "#name",          // try next to the actual name first
  ".horse-header",  // if the page has a dedicated header
  ".page-header",
  "h1",
  "body"
];

const BUTTON_ID = "equisync-grab-horse-btn";
// =====================

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
