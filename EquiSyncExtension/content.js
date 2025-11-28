// content.js

// ---------- Helpers ----------
function onHorseReality() {
  return location.hostname && location.hostname.endsWith("horsereality.com");
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
  if (document.getElementById("equisync-floating-button")) return true;

  const btn = document.createElement("button");
  btn.id = "equisync-floating-button";
  btn.textContent = "EquiSync";

  // styling
  Object.assign(btn.style, {
    position: "fixed",
    right: "20px",
    bottom: "20px",
    zIndex: "9999",
    padding: "10px 16px",
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.4)",
    background: "linear-gradient(135deg, #f97316, #facc15)",
    color: "#111827",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  });

  btn.addEventListener("mouseover", () => {
    btn.style.transform = "translateY(-1px)";
    btn.style.boxShadow = "0 10px 24px rgba(0,0,0,0.5)";
  });
  btn.addEventListener("mouseout", () => {
    btn.style.transform = "translateY(0)";
    btn.style.boxShadow = "0 8px 20px rgba(0,0,0,0.4)";
  });

  btn.addEventListener("click", () => {
    // Extract life number
    const match = window.location.href.match(/horses\/(\d+)/i);
    if (!match) {
      alert("EquiSync couldn't find this horse's lifenumber in the URL.");
      return;
    }
    const lifeNumber = match[1];

    // Name from title
    let horseName = "Unknown";
    const title = document.title || "";
    if (title) {
      horseName = title.replace(/\s*-\s*Horse Reality\s*$/i, "").trim();
      if (!horseName || horseName === title) horseName = title.split(" - ")[0].trim();
      if (!horseName) horseName = title.trim();
    }
    if (!horseName) horseName = `Horse #${lifeNumber}`;

    // Sex from small icon
    let sex = null;
    const sexImg = document.querySelector("img.icon16");
    if (sexImg && sexImg.alt) sex = sexImg.alt.trim();

    // Breed detection (try several selectors)
    let breed = null;
    (function findBreed() {
      const selectors = ['#breed', 'p#breed', 'p[id="breed"]', '[data-breed]', '.breed'];
      for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el && el.textContent && el.textContent.trim()) { breed = el.textContent.trim(); return; }
      }
      // fallback: look for labels that say "Breed" and take neighbor text
      const labels = Array.from(document.querySelectorAll('label, .info_label, th, strong'));
      for (const lab of labels) {
        const txt = (lab.textContent || '').trim().toLowerCase();
        if (txt.startsWith('breed')) {
          const next = lab.nextElementSibling || lab.parentElement && lab.parentElement.querySelector('.info_item') || lab.parentElement && lab.parentElement.querySelector('p');
          if (next && next.textContent && next.textContent.trim()) { breed = next.textContent.trim(); return; }
        }
      }
    })();

    // Generic info parsing for Owner, Breeder, Birthday, Location
    let birthday = null, ownerUser = null, ownerFarm = null, breederUser = null, breederFarm = null, location = null;
    (function parseInfo() {
      // Prefer structured rows
      const rows = document.querySelectorAll('.info_table_row, table tr');
      if (rows && rows.length) {
        rows.forEach((row) => {
          const labelEl = row.querySelector('.info_label') || row.querySelector('th') || row.querySelector('td:first-child');
          const itemEl  = row.querySelector('.info_item')  || row.querySelector('td:nth-child(2)');
          if (!labelEl || !itemEl) return;
          const label = (labelEl.textContent || '').trim();
          const valueText = (itemEl.textContent || '').trim();
          if (/birthday|born/i.test(label)) birthday = valueText || null;
          else if (/location/i.test(label)) location = valueText || null;
          else if (/owner/i.test(label)) {
            const ownerLink = itemEl.querySelector('a');
            ownerUser = ownerLink ? ownerLink.textContent.trim() : null;
            const parts = valueText.split('·').map(s => s.trim()).filter(Boolean);
            if (parts.length > 1) ownerFarm = parts.slice(1).join(' · ');
          } else if (/breeder/i.test(label)) {
            const breederLink = itemEl.querySelector('a');
            breederUser = breederLink ? breederLink.textContent.trim() : null;
            const parts = valueText.split('·').map(s => s.trim()).filter(Boolean);
            if (parts.length > 1) breederFarm = parts.slice(1).join(' · ');
          }
        });
      }

      // If needed, scan .info_item / div variants
      if (!birthday && !ownerUser && !breederUser) {
        const items = document.querySelectorAll('.info_item, .info-item, .info');
        items.forEach(item => {
          const parent = item.parentElement;
          let labelEl = null;
          if (parent) labelEl = parent.querySelector('.info_label') || item.previousElementSibling || parent.querySelector('label');
          const label = (labelEl && labelEl.textContent) ? labelEl.textContent.trim() : '';
          const valueText = (item.textContent || '').trim();
          if (/birthday|born/i.test(label) && !birthday) birthday = valueText || null;
          else if (/location/i.test(label) && !location) location = valueText || null;
          else if (/owner/i.test(label) && !ownerUser) {
            const ownerLink = item.querySelector('a');
            ownerUser = ownerLink ? ownerLink.textContent.trim() : null;
            const parts = valueText.split('·').map(s => s.trim()).filter(Boolean);
            if (parts.length > 1) ownerFarm = parts.slice(1).join(' · ');
          } else if (/breeder/i.test(label) && !breederUser) {
            const breederLink = item.querySelector('a');
            breederUser = breederLink ? breederLink.textContent.trim() : null;
            const parts = valueText.split('·').map(s => s.trim()).filter(Boolean);
            if (parts.length > 1) breederFarm = parts.slice(1).join(' · ');
          }
        });
      }

      // Normalize breederFarm: remove word "Breeder" (so "Foundation Breeder" -> "Foundation")
      if (breederFarm) {
        breederFarm = breederFarm.replace(/\bBreeder\b/i, '').trim();
        if (!breederFarm) breederFarm = null;
      }
    })();

    // Build horse object
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

    // Save buffer to chrome.storage.local
    chrome.storage.local.get({ [STORAGE_KEY]: [] }, (data) => {
      const existing = Array.isArray(data[STORAGE_KEY]) ? data[STORAGE_KEY] : [];
      if (existing.some(h => h.id === horse.id)) {
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

// Send the extension buffer into the page via postMessage, then clear buffer
function sendBufferToEquiSyncPage() {
  if (!onEquiSyncSite()) return;
  chrome.storage.local.get({ [STORAGE_KEY]: [] }, (data) => {
    const horses = Array.isArray(data[STORAGE_KEY]) ? data[STORAGE_KEY] : [];
    if (!horses.length) return;

    // Post into the page context (page listens for this)
    window.postMessage({ source: "EquiSyncExtension", type: "EQUISYNC_HORSES", horses }, "*");

    // clear buffer so they aren't re-sent
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
      if (ok || attempts >= maxAttempts) clearInterval(interval);
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
