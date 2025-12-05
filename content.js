// EquiSync minimal content script

const STORAGE_KEY = "equisyncHorses";

// Detect if we are on Horse Reality
function onHorsePage() {
  return location.hostname.includes("horsereality.com") && location.pathname.includes("/horses/");
}

// Detect if we are on your webtool
function onEquiSync() {
  return location.hostname === "madzcoded.github.io" && location.pathname.includes("EquiSync");
}

// Extract horse ID from URL
function getHorseId() {
  const match = location.href.match(/horses\/(\d+)/);
  return match ? match[1] : null;
}

// When button is clicked → save horse ID
function saveHorse(id) {
  chrome.storage.local.get([STORAGE_KEY], (data) => {
    const existing = Array.isArray(data[STORAGE_KEY]) ? data[STORAGE_KEY] : [];

    if (existing.includes(id)) {
      console.log("Already saved:", id);
      return;
    }

    existing.push(id);

    chrome.storage.local.set({ [STORAGE_KEY]: existing }, () => {
      console.log("Horse saved:", id);
    });
  });
}

// Insert floating button on horse pages
function injectButton() {
  if (!onHorsePage()) return;
  if (document.getElementById("equisync-btn")) return;

  const btn = document.createElement("button");
  btn.id = "equisync-btn";
  btn.textContent = "Save to EquiSync";

  Object.assign(btn.style, {
    position: "fixed",
    right: "20px",
    bottom: "20px",
    padding: "12px 18px",
    background: "#ff9d3c",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    zIndex: 999999
  });

  btn.onclick = () => {
    const id = getHorseId();
    if (id) saveHorse(id);
  };

  document.body.appendChild(btn);
}

// Send stored horses to your webtool
function sendHorsesToWebtool() {
  if (!onEquiSync()) return;

  chrome.storage.local.get([STORAGE_KEY], (data) => {
    const horses = Array.isArray(data[STORAGE_KEY]) ? data[STORAGE_KEY] : [];

    window.postMessage({
      source: "EquiSyncExtension",
      horses: horses
    }, "*");
  });
}

injectButton();
sendHorsesToWebtool();
