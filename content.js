// EquiSync minimal content script

const STORAGE_KEY = "equisyncHorses";

// ---- Helpers to detect where we are ----

// Horse Reality horse page
function onHorsePage() {
  return (
    location.hostname.includes("horsereality.com") &&
    location.pathname.includes("/horses/")
  );
}

// Your EquiSync webtool on GitHub Pages
function onEquiSync() {
  return (
    location.hostname === "madzcoded.github.io" &&
    location.pathname.includes("/EquiSync")
  );
}

// Extract horse ID from the URL, e.g. /horses/22227400/
function getHorseId() {
  const match = location.href.match(/horses\/(\d+)/);
  return match ? match[1] : null;
}

// ---- Storage: save horse ID into chrome.storage.local ----

function saveHorse(id) {
  chrome.storage.local.get([STORAGE_KEY], (data) => {
    const existing = Array.isArray(data[STORAGE_KEY]) ? data[STORAGE_KEY] : [];

    if (existing.includes(id)) {
      console.log("EquiSync: horse already saved:", id);
      return;
    }

    existing.push(id);

    chrome.storage.local.set({ [STORAGE_KEY]: existing }, () => {
      console.log("EquiSync: horse saved:", id);
    });
  });
}

// ---- Inject floating button on horse pages ----

function injectButton() {
  if (!onHorsePage()) return;
  if (document.getElementById("equisync-btn")) return;

  console.log("EquiSync: injecting button on horse page.");

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
    console.log("EquiSync: button clicked!");
    const id = getHorseId();
    if (!id) {
      console.warn("EquiSync: could not find horse ID in URL.");
      return;
    }
    saveHorse(id);
  };

  document.body.appendChild(btn);
}

// ---- Send stored horses into the EquiSync webtool page ----

function sendHorsesToWebtool() {
  if (!onEquiSync()) return;

  console.log("EquiSync: on EquiSync page, sending horses...");

  chrome.storage.local.get([STORAGE_KEY], (data) => {
    const horses = Array.isArray(data[STORAGE_KEY]) ? data[STORAGE_KEY] : [];

    console.log("EquiSync: posting horses to page:", horses);

    window.postMessage(
      {
        source: "EquiSyncExtension",
        horses: horses
      },
      "*"
    );
  });
}

// ---- Run appropriate logic depending on page ----

if (onHorsePage()) {
  injectButton();
}

if (onEquiSync()) {
  sendHorsesToWebtool();
}
