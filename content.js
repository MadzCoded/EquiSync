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

  // Start with minimal object
  const horse = {
    id,
    name: null,
    sex: null,
    breed: null,
    ownerUser: null,
    ownerFarm: null,
    breederUser: null,
    breederFarm: null,
    location: null,
    ageText: null,
    birthday: null,
    url: window.location.href,
    images: {
      adult: null,
      foal: null
    }
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

    // ---------- Sex, Breed, Age ----------
    const sexEl = document.getElementById("sex");
    if (sexEl) {
      // Often includes icon + text; innerText should give "Stallion"/"Mare"/etc
      horse.sex = sexEl.innerText.replace(/\s+/g, " ").trim();
    }

    const breedEl = document.getElementById("breed");
    if (breedEl) {
      horse.breed = breedEl.innerText.trim();
    }

    const ageEl = document.getElementById("age");
    if (ageEl) {
      // e.g. "8 years 10 months"
      horse.ageText = ageEl.innerText.trim();
    }

    // ---------- Owner / Breeder / Location / Birthday ----------
    // We try generic patterns so this works on multiple layouts.
    const infoRows = document.querySelectorAll("#info tr, .info_table_row");
    infoRows.forEach((row) => {
      const labelCell =
        row.querySelector(".info_label") || row.querySelector("td:first-child");
      const valueCell =
        row.querySelector(".info_item") || row.querySelector("td:nth-child(2)");

      if (!labelCell || !valueCell) return;

      const labelText = (labelCell.textContent || "").trim().toLowerCase();
      const fullText = (valueCell.textContent || "").trim();

      // Owner
      if (labelText.includes("owner")) {
        const link = valueCell.querySelector("a");
        if (link) {
          horse.ownerUser = link.textContent.trim();
        } else if (fullText) {
          horse.ownerUser = fullText;
        }

        // Attempt farm name: anything after username, split by · or -
        const parts = fullText
          .split(/[\u00b7-]/) // middle dot or dash
          .map((s) => s.trim())
          .filter(Boolean);

        if (parts.length > 1) {
          horse.ownerFarm = parts.slice(1).join(" - ");
        }
      }

      // Breeder
      if (labelText.includes("breeder")) {
        const link = valueCell.querySelector("a");
        if (link) {
          horse.breederUser = link.textContent.trim();
        } else if (fullText) {
          horse.breederUser = fullText;
        }

        const parts = fullText
          .split(/[\u00b7-]/)
          .map((s) => s.trim())
          .filter(Boolean);

        if (parts.length > 1) {
          horse.breederFarm = parts.slice(1).join(" - ");
        }
      }

      // Location
      if (labelText.includes("location")) {
        horse.location = fullText || null;
      }

      // Birthday (if shown as a date)
      if (labelText.includes("birthday") || labelText.includes("born")) {
        horse.birthday = fullText || null;
      }
    });

    // ---------- Image scraping (adult) ----------
    // This part may need tweaking depending on HR's HTML.
    // For now, we try some generic selectors.
    let adultUrl = null;

    const imgCandidates = document.querySelectorAll(
      "img.horse-image, #horse-image img, .horse img, img[src*='/horses/']"
    );

    for (const img of imgCandidates) {
      const src = img.getAttribute("src");
      if (!src) continue;
      adultUrl = src;
      break;
    }

    horse.images.adult = adultUrl || null;
    // We don't know foal image yet; leave null for now.

  } catch (err) {
    console.error("EquiSync: error while scraping horse:", err);
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
