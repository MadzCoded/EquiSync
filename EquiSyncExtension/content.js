// content.js

// ---------- Helpers ----------

function onHorseReality() {
  return (
    location.hostname === "horsereality.com" ||
    location.hostname === "www.horsereality.com"
  );
}

function onEquiSyncSite() {
  return (
    location.hostname === "madzcoded.github.io" &&
    location.pathname.startsWith("/EquiSync")
  );
}

const STORAGE_KEY = "equisyncStable";

// ---------- HORSE REALITY MODE ----------

function insertEquiSyncButton() {
  if (!onHorseReality()) return false;

  // Avoid duplicates
  if (document.getElementById("equisync-floating-button")) {
    return true;
  }

  const btn = document.createElement("button");
  btn.id = "equisync-floating-button";
  btn.textContent = "EquiSync";

  // Floating bottom-right styling
  btn.style.position = "fixed";
  btn.style.right = "20px";
  btn.style.bottom = "20px";
  btn.style.zIndex = "9999";
  btn.style.padding = "10px 16px";
  btn.style.borderRadius = "999px";
  btn.style.border = "1px solid rgba(255,255,255,0.4)";
  btn.style.background = "linear-gradient(135deg, #f97316, #facc15)";
  btn.style.color = "#111827";
  btn.style.fontSize = "13px";
  btn.style.fontWeight = "600";
  btn.style.cursor = "pointer";
  btn.style.boxShadow = "0 8px 20px rgba(0,0,0,0.4)";
  btn.style.fontFamily =
    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

  btn.addEventListener("mouseover", () => {
    btn.style.transform = "translateY(-1px)";
    btn.style.boxShadow = "0 10px 24px rgba(0,0,0,0.5)";
  });

  btn.addEventListener("mouseout", () => {
    btn.style.transform = "translateY(0)";
    btn.style.boxShadow = "0 8px 20px rgba(0,0,0,0.4)";
  });

  btn.addEventListener("click", () => {
    // 1) Extract lifenumber from URL, e.g. /horses/22238866/
    const match = window.location.href.match(/horses\/(\d+)/i);
    if (!match) {
      alert("EquiSync couldn't find this horse's lifenumber in the URL.");
      return;
    }
    const lifeNumber = match[1];

    // 2) Extract horse name from the page title
    let horseName = "Unknown";
    const title = document.title || "";

    if (title) {
      horseName = title.replace(/\s*-\s*Horse Reality\s*$/i, "").trim();
      if (!horseName || horseName === title) {
        horseName = title.split(" - ")[0].trim();
      }
      if (!horseName) {
        horseName = title.trim();
      }
    }

    if (!horseName) {
      horseName = `Horse #${lifeNumber}`;
    }

    // 3) Extract sex from the small icon (RealTools-style)
    // Example: <img class="icon16" alt="Mare"> or "Stallion" / "Gelding"
    let sex = null;
    const sexImg = document.querySelector("img.icon16");
    if (sexImg && sexImg.alt) {
      sex = sexImg.alt.trim(); // "Mare", "Stallion", "Gelding", etc.
    }

    const horse = {
      id: lifeNumber,
      name: horseName,
      sex: sex,                 // ✅ NEW FIELD
      url: window.location.href,
      addedAt: Date.now()
    };

    // 4) Save into chrome.storage as a "buffer"
    chrome.storage.local.get({ [STORAGE_KEY]: [] }, (data) => {
      const existing = Array.isArray(data[STORAGE_KEY])
        ? data[STORAGE_KEY]
        : [];

      if (existing.some((h) => h.id === horse.id)) {
        alert("This horse is already in your EquiSync stable.");
        return;
      }

      existing.push(horse);

      chrome.storage.local.set({ [STORAGE_KEY]: existing }, () => {
        // silent success
      });
    });
  });

  document.body.appendChild(btn);
  return true;
}

// ---------- EQUISYNC SITE MODE ----------

// Bridge: send extension buffer → page via window.postMessage
function sendBufferToEquiSyncPage() {
  if (!onEquiSyncSite()) return;

  chrome.storage.local.get({ [STORAGE_KEY]: [] }, (data) => {
    const horses = Array.isArray(data[STORAGE_KEY]) ? data[STORAGE_KEY] : [];
    if (!horses.length) return;

    // Post message into the page context
    window.postMessage(
      {
        source: "EquiSyncExtension",
        type: "EQUISYNC_HORSES",
        horses
      },
      "*"
    );

    // Clear the buffer so they don't get re-injected next time
    chrome.storage.local.set({ [STORAGE_KEY]: [] });
  });
}

// ---------- Setup ----------

function setup() {
  if (onHorseReality()) {
    let attempts = 0;
    const maxAttempts = 12;

    const interval = setInterval(() => {
      attempts++;
      const ok = insertEquiSyncButton();
      if (ok || attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 500);
  }

  if (onEquiSyncSite()) {
    sendBufferToEquiSyncPage();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setup);
} else {
  setup();
}
