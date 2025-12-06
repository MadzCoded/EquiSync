// EquiSync front-end script
document.addEventListener("DOMContentLoaded", () => {
  console.log("EquiSync app.js loaded");

  // ---------- TAB LOGIC ----------
  const tabButtons = document.querySelectorAll(".tabs button");
  const tabSections = document.querySelectorAll(".tab");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.dataset.tab;

      tabButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      tabSections.forEach((section) => {
        if (section.id === targetId) {
          section.classList.add("active");
        } else {
          section.classList.remove("active");
        }
      });
    });
  });

  // ---------- DATA MODEL ----------
  // Filled by the extension via window.postMessage
  let horses = [];
  let selectedHorseId = null;

  // ---------- RENDER: STABLE LIST ----------
  function renderStable() {
    const listEl = document.getElementById("stable-list");
    const emptyEl = document.getElementById("stable-empty");

    listEl.innerHTML = "";

    if (!horses.length) {
      emptyEl.style.display = "block";
      return;
    }

    emptyEl.style.display = "none";

    horses.forEach((horse) => {
      const li = document.createElement("li");
      li.className = "stable-item";

      // Clicking the row selects the horse
      li.addEventListener("click", () => {
        selectedHorseId = horse.id;
        renderStable();
        renderDetails();
      });

      const main = document.createElement("div");
      main.className = "stable-item-main";

      const nameLine = document.createElement("div");
      nameLine.className = "stable-item-name";
      nameLine.textContent = `${horse.name || "Unnamed horse"} (#${horse.id})`;
      main.appendChild(nameLine);

      const ownerLine = document.createElement("div");
      ownerLine.className = "stable-item-owner";
      const ownerParts = [];
      if (horse.ownerUser) ownerParts.push(horse.ownerUser);
      if (horse.ownerFarm) ownerParts.push(horse.ownerFarm);
      ownerLine.textContent = ownerParts.join(" – ") || "Owner unknown";
      main.appendChild(ownerLine);

      li.appendChild(main);

      const tag = document.createElement("div");
      tag.className = "stable-item-tag";
      tag.textContent = horse.sex || "";
      li.appendChild(tag);

      const link = document.createElement("a");
      link.href = horse.url || `https://www.horsereality.com/horses/${horse.id}/`;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = "Open";
      link.className = "open-link";
      li.appendChild(link);

      // Highlight selected horse
      if (horse.id === selectedHorseId) {
        li.style.borderColor = "#ff9d3c";
      }

      listEl.appendChild(li);
    });
  }

  // ---------- HELPERS ----------
  function getSelectedHorse() {
    if (!selectedHorseId) return null;
    return horses.find((h) => h.id === selectedHorseId) || null;
  }

  // ---------- RENDER: INFO / STATS / COLOUR ----------
  function renderInfoTab(horse) {
    const emptyEl = document.getElementById("info-empty");
    const panel = document.getElementById("info-panel");

    if (!horse) {
      emptyEl.style.display = "block";
      panel.hidden = true;
      return;
    }

    emptyEl.style.display = "none";
    panel.hidden = false;

    document.getElementById("info-name").textContent = horse.name || "Unnamed horse";
    document.getElementById("info-id").textContent = `#${horse.id}`;
    document.getElementById("info-age").textContent = horse.ageText || "Age unknown";

    document.getElementById("info-sex").textContent = horse.sex || "—";
    document.getElementById("info-breed").textContent = horse.breed || "—";

    const ownerParts = [];
    if (horse.ownerUser) ownerParts.push(horse.ownerUser);
    if (horse.ownerFarm) ownerParts.push(horse.ownerFarm);
    document.getElementById("info-owner").textContent = ownerParts.join(" – ") || "—";

    const breederParts = [];
    if (horse.breederUser) breederParts.push(horse.breederUser);
    if (horse.breederFarm) breederParts.push(horse.breederFarm);
    document.getElementById("info-breeder").textContent = breederParts.join(" – ") || "—";

    document.getElementById("info-location").textContent = horse.location || "—";
    document.getElementById("info-birthday").textContent = horse.birthday || "—";

    const link = document.getElementById("info-link");
    link.href = horse.url || `https://www.horsereality.com/horses/${horse.id}/`;

    // images
    const adultEl = document.getElementById("info-image-adult");
    const foalEl = document.getElementById("info-image-foal");

    adultEl.innerHTML = "";
    foalEl.innerHTML = "";

    const adultUrl = horse.images && horse.images.adult;
    const foalUrl = horse.images && horse.images.foal;

    if (adultUrl) {
      adultEl.innerHTML = `<img src="${adultUrl}" alt="${horse.name || ""} adult">`;
    } else {
      adultEl.textContent = "No image set";
    }

    if (foalUrl) {
      foalEl.innerHTML = `<img src="${foalUrl}" alt="${horse.name || ""} foal">`;
    } else {
      foalEl.textContent = "No image set";
    }
  }

  function renderStatsTab(horse) {
    const emptyEl = document.getElementById("stats-empty");
    const panel = document.getElementById("stats-panel");

    const gpBody = document.querySelector("#stats-gp-table tbody");
    const confoBody = document.querySelector("#stats-confo-table tbody");
    const healthBody = document.querySelector("#stats-health-table tbody");

    gpBody.innerHTML = "";
    confoBody.innerHTML = "";
    healthBody.innerHTML = "";

    if (!horse) {
      emptyEl.style.display = "block";
      panel.hidden = true;
      return;
    }

    emptyEl.style.display = "none";
    panel.hidden = false;

    // GP (if the extension ever fills these in)
    if (horse.gp) {
      Object.entries(horse.gp).forEach(([key, value]) => {
        const tr = document.createElement("tr");
        const tName = document.createElement("td");
        const tVal = document.createElement("td");

        const label = key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (c) => c.toUpperCase());

        tName.textContent = label;
        tVal.textContent = value ?? "—";

        tr.appendChild(tName);
        tr.appendChild(tVal);
        gpBody.appendChild(tr);
      });
    }

    // Conformation
    if (horse.confo) {
      Object.entries(horse.confo).forEach(([key, value]) => {
        const tr = document.createElement("tr");
        const tName = document.createElement("td");
        const tVal = document.createElement("td");

        const label = key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (c) => c.toUpperCase());

        tName.textContent = label;
        tVal.textContent = value ?? "—";

        tr.appendChild(tName);
        tr.appendChild(tVal);
        confoBody.appendChild(tr);
      });
    }

    // Health
    if (horse.health) {
      Object.entries(horse.health).forEach(([key, value]) => {
        const tr = document.createElement("tr");
        const tName = document.createElement("td");
        const tVal = document.createElement("td");

        const label = key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (c) => c.toUpperCase());

        tName.textContent = label;
        tVal.textContent = value ?? "—";

        tr.appendChild(tName);
        tr.appendChild(tVal);
        healthBody.appendChild(tr);
      });
    }
  }

  function renderColourTab(horse) {
    const emptyEl = document.getElementById("colour-empty");
    const panel = document.getElementById("colour-panel");

    if (!horse) {
      emptyEl.style.display = "block";
      panel.hidden = true;
      return;
    }

    emptyEl.style.display = "none";
    panel.hidden = false;

    const c = horse.colour || {};
    document.getElementById("colour-name").textContent = c.name || "Colour unknown";
    document.getElementById("colour-simplified").textContent = c.simplified || "—";
    document.getElementById("colour-extension").textContent = c.extension || "—";
    document.getElementById("colour-agouti").textContent = c.agouti || "—";
    document.getElementById("colour-grey").textContent = c.grey || "—";
    document.getElementById("colour-cream").textContent = c.cream || "—";
    document.getElementById("colour-dun").textContent = c.dun || "—";
    document.getElementById("colour-mitf").textContent = c.mitf || "—";
  }

  function renderDetails() {
    const horse = getSelectedHorse();
    renderInfoTab(horse);
    renderStatsTab(horse);
    renderColourTab(horse);
  }

  // ---------- EXTENSION MESSAGE LISTENER ----------
  window.addEventListener("message", (event) => {
    const data = event.data;
    if (!data || data.source !== "EquiSyncExtension") return;

    console.log("EquiSync webtool received horses from extension:", data.horses);

    if (Array.isArray(data.horses)) {
      horses = data.horses.slice();
      if (!selectedHorseId && horses.length) {
        selectedHorseId = horses[0].id;
      }
      renderStable();
      renderDetails();
    }
  });

  // Initial render (empty)
  renderStable();
  renderDetails();
});
