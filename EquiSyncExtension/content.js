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

    // 3) Sex from the small icon (Mare/Stallion/Gelding)
    let sex = null;
    const sexImg = document.querySelector("img.icon16");
    if (sexImg && sexImg.alt) {
      sex = sexImg.alt.trim();
    }

    // 4) Extra info from the page (robustly)
    let breed = null;
    let birthday = null;
    let ownerUser = null;
    let ownerFarm = null;
    let breederUser = null;
    let breederFarm = null;
    let location = null;

    // --- Breed: try several selectors ---
    (function findBreed() {
      const selectors = [
        '#breed',
        'p#breed',
        'p[id="breed"]',
        '[data-breed]',
        '.breed', // fallback class if site changes
      ];
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el && el.textContent && el.textContent.trim()) {
          breed = el.textContent.trim();
          return;
        }
      }
      // final fallback: look for "Breed" label + next sibling text
      const labelEls = Array.from(document.querySelectorAll('label, .info_label, th, strong'));
      for (const lab of labelEls) {
        if ((lab.textContent || '').trim().toLowerCase().startsWith('breed')) {
          const next = lab.nextElementSibling || lab.parentElement.querySelector('.info_item') || lab.parentElement.querySelector('p');
          if (next && next.textContent && next.textContent.trim()) {
            breed = next.textContent.trim();
            return;
          }
        }
      }
    })();

    // --- Info items: support both table and div variants ---
    (function parseInfoItems() {
      // Prefer structured rows if available
      const tryRows = document.querySelectorAll('.info_table_row, table tr');
      if (tryRows && tryRows.length) {
        tryRows.forEach((row) => {
          const labelEl = row.querySelector('.info_label') || row.querySelector('th') || row.querySelector('td:first-child');
          const itemEl = row.querySelector('.info_item') || row.querySelector('td:nth-child(2)');
          if (!labelEl || !itemEl) return;
          const label = (labelEl.textContent || '').trim();
          const valueText = (itemEl.textContent || '').trim();

          if (/birthday|born/i.test(label)) {
            birthday = valueText || null;
          } else if (/location/i.test(label)) {
            location = valueText || null;
          } else if (/owner/i.test(label)) {
            const ownerLink = itemEl.querySelector('a');
            ownerUser = ownerLink ? ownerLink.textContent.trim() : null;
            // look for " · " separator for farm/stud name
            const parts = valueText.split('·').map(s=>s.trim()).filter(Boolean);
            if (parts.length > 1) ownerFarm = parts.slice(1).join(' · ');
            else ownerFarm = null;
          } else if (/breeder/i.test(label)) {
            const breederLink = itemEl.querySelector('a');
            breederUser = breederLink ? breederLink.textContent.trim() : null;
            const parts = valueText.split('·').map(s=>s.trim()).filter(Boolean);
            if (parts.length > 1) breederFarm = parts.slice(1).join(' · ');
            else breederFarm = null;
          }
        });
      }

      // If none of the structured rows matched, scan .info_item divs (some pages use div layout)
      if (!birthday && !ownerUser && !breederUser) {
        const items = document.querySelectorAll('.info_item, .info-item, .info');
        items.forEach((item) => {
          const parent = item.parentElement;
          // look for a label sibling
          let labelEl = null;
          if (parent) {
            labelEl = parent.querySelector('.info_label') || item.previousElementSibling || parent.querySelector('label');
          }
          const label = (labelEl && labelEl.textContent) ? labelEl.textContent.trim() : '';
          const valueText = (item.textContent || '').trim();

          if (/birthday|born/i.test(label) && !birthday) {
            birthday = valueText || null;
          } else if (/location/i.test(label) && !location) {
            location = valueText || null;
          } else if (/owner/i.test(label) && !ownerUser) {
            const ownerLink = item.querySelector('a');
            ownerUser = ownerLink ? ownerLink.textContent.trim() : null;
            const parts = valueText.split('·').map(s=>s.trim()).filter(Boolean);
            if (parts.length > 1) ownerFarm = parts.slice(1).join(' · ');
          } else if (/breeder/i.test(label) && !breederUser) {
            const breederLink = item.querySelector('a');
            breederUser = breederLink ? breederLink.textContent.trim() : null;
            const parts = valueText.split('·').map(s=>s.trim()).filter(Boolean);
            if (parts.length > 1) breederFarm = parts.slice(1).join(' · ');
          }
        });
      }

      // Normalize breederFarm if it contains the word "Breeder" (turn "Foundation Breeder" -> "Foundation")
      if (breederFarm) {
        breederFarm = breederFarm.replace(/\bBreeder\b/i, '').trim();
        if (!breederFarm) breederFarm = null;
      }
    })();

    // 5) Build the horse object with all fields
    const horse = {
      id: lifeNumber,
      name: horseName,
      sex,
      breed,
      birthday,
      ownerUser,
      ownerFarm,
      breederUser,
      breederFarm,
      location,
      url: window.location.href,
      addedAt: Date.now()
    };

    // 6) Save into chrome.storage as a "buffer"
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

    window.postMessage(
      {
        source: "EquiSyncExtension",
        type: "EQUISYNC_HORSES",
        horses
      },
      "*"
    );

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
