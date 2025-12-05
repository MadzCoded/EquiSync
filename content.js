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

// ---- Scrape basic horse info from the page ----
function scrapeHorseBasic() {
  const id = getHorseId();
  if (!id) return null;

  let name = null;
  let sex = null;
  let breed = null;

  // Name lives in #summary-info #name on the new layout
  const nameEl = document.querySelector("#summary-info #name");
  if (nameEl) {
    // sometimes there is an icon inside; take the first text node if possible
    const firstNode = nameEl.childNodes[0];
    if (firstNode && firstNode.nodeType === Node.TEXT_NODE) {
      name = firstNode.textContent.trim();
    } else {
      name = nameEl.textContent.trim();
    }
  }

  // Sex & breed have dedicated ids in the snippet you showed
  const sexEl = document.getElementById("sex");
  if (sexEl) {
    sex = sexEl.textContent.trim();
  }

  const breedEl = document.getElementById("breed");
  if (breedEl) {
    breed = breedEl.textContent.trim();
  }

  return {
    id,
    name,
    sex,
    breed
  };
}

// ---- Storage: save horse OBJECT into chrome.storage.local ----

function saveHorse(horse) {
  chrome.storage.local.get([STORAGE_KEY], (data) => {
    let existing = Array.isArray(data[STORAGE_KEY]) ? data[STORAGE_KEY] : [];

    // migrate any old "string-only" entries into { id } objects
    existing = existing.map((item) => {
      if (typeof item === "string") {
        return { id: item };
      }
      return item;
    });

    if (existing.some((h) => h.id === horse.id)) {
      console.log("EquiSync: horse already saved:", horse.id);
      return;
    }

    existing.push(horse);

    chrome.storage.local.set({ [STORAGE_KEY]: existing }, () => {
      console.log("EquiSync: horse saved:", horse);
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

    const horse = scrapeHorseBasic();
    if (!horse) {
      console.warn("EquiSync: could not scrape horse data.");
      return;
    }

    saveHorse(horse);
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
