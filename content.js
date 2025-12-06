// EquiSync content script

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

  // Start with a minimal object so even if scraping fails, we at least save the ID
  const horse = {
    id,
    name: null,
    sex: null,
    breed: null,
    ownerUser: null,
    ownerFarm: null,
    url: null
  };

  try {
    // ---------- Name ----------
    const nameEl = document.getElementById("name");
    if (nameEl) {
      const firstNode = nameEl.childNodes[0];
      if (firstNode && firstNode.nodeType === Node.TEXT_NODE) {
        horse.name = firstNode.textContent.trim();
      } else {
        horse.name = nameEl.textContent.trim();
      }
    }

    // Fallback: page title, like "AlleyCat Dunner - Horse Reality"
    if (!horse.name && document.title) {
      const m = document.title.match(/^(.*?)\s*-\s*Horse Reality/i);
      if (m) {
        horse.name = m[1].trim();
      } else {
        horse.name = document.title.trim();
      }
    }

    // ---------- Sex & breed ----------
    const sexEl = document.getElementById("sex");
    if (sexEl) {
      horse.sex = sexEl.innerText.trim();
    }

    const breedEl = document.getElementById("breed");
    if (breedEl) {
      horse.breed = breedEl.innerText.trim();
    }

    // ---------- Owner + farm ----------
    // Look for a table row whose label cell text is "Owner"
    const infoRows = document.querySelectorAll("#info tr, .info_table_row");

    infoRows.forEach((row) => {
      const labelCell =
        row.querySelector(".info_label") || row.querySelector("td:first-child");
      const valueCell =
        row.querySelector(".info_item") || row.querySelector("td:nth-child(2)");

      if (!labelCell || !valueCell) return;

      const labelText = (labelCell.textContent || "").trim().toLowerCase();
      if (labelText !== "owner") return;

      const fullText = (valueCell.textContent || "").trim();

      // Username usually is a link
      const link = valueCell.querySelector("a");
      if (link) {
        horse.ownerUser = link.textContent.trim();
      } else if (fullText) {
        horse.ownerUser = fullText;
      }

      // Farm name = whatever comes after the username, separated by "·" or "-"
      // Example: "ThistleHoof - Willowmere Stud"
      const parts = fullText
        .split(/[\u00b7-]/) // middle dot or dash
        .map((s) => s.trim())
        .filter(Boolean);

      if (parts.length > 1) {
        horse.ownerFarm = parts.slice(1).join(" - ");
      }
    });

    // Remember the exact page URL we scraped from
    horse.url = window.location.href;
  } catch (err) {
    console.error("EquiSync: error while scraping horse:", err);
    // We still return the partial horse object (at least has id and maybe name)
  }

  console.log("EquiSync: scraped horse basic:", horse);
  return horse;
}

// ---- Storage: save or UPDATE horse OBJECT in chrome.storage.local ----
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

    const index = existing.findIndex((h) => h.id === horse.id);

    if (index !== -1) {
      // Update existing entry (so old ones get new fields)
      existing[index] = { ...existing[index], ...horse };
      console.log("EquiSync: horse updated:", existing[index]);
    } else {
      existing.push(horse);
      console.log("EquiSync: horse saved:", horse);
    }

    chrome.storage.local.set({ [STORAGE_KEY]: existing }, () => {
      // done
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
