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
  // For now, this is just demo data so you can see the UI working.
  // Later the extension will fill this with real horses.
  let horses = [
    {
      id: "22238866",
      name: "Sundown Jack",
      sex: "Stallion",
      breed: "Brumby Horse",
      ownerUser: "ThistleHoof",
      ownerFarm: "Willowmere Stud",
      breederUser: "HazelHorseman",
      breederFarm: "Australian Wildlife Park",
      location: "Australia",
      birthday: "10-03-2017",
      url: "https://www.horsereality.com/horses/22238866/",
      images: {
        adult: null,
        foal: null
      },
      gp: {
        acceleration: 72,
        agility: 68,
        balance: 70,
        bascule: 65,
        pullingPower: 60,
        speed: 71,
        sprint: 69,
        stamina: 73,
        strength: 66,
        surefootedness: 74
      },
      confo: {
        head: "Very Good",
        neck: "Good",
        back: "Average",
        shoulders: "Very Good",
        frontlegs: "Good",
        hindquarters: "Very Good",
        walk: "Good",
        trot: "Good",
        canter: "Very Good",
        gallop: "Very Good",
        socks: "Average",
        posture: "Good",
        revaal: "Good"
      },
      health: {
        colic: "Low risk",
        hooves: "Strong",
        back: "No issues noted",
        respiratory: "Healthy",
        lameness: "Low risk"
      },
      colour: {
        name: "Red Roan Brumby",
        simplified: "Red roan",
        extension: "Ee",
        agouti: "Aa",
        grey: "gg",
        cream: "nCr",
        dun: "Dd",
        mitf: "n/mitf"
      }
    },
    {
      id: "22154579",
      name: "AlleyCat Dunner",
      sex: "Stallion",
      breed: "Kathiawari Horse",
      ownerUser: "ThistleHoof",
      ownerFarm: "Willowmere Stud",
      breederUser: "Caroll",
      breederFarm: "Foundation Breeder",
      location: "Australia",
      birthday: "16-07-2025",
      url: "https://www.horsereality.com/horses/22154579/",
      images: {
        adult: null,
        foal: null
      },
      gp: {
        acceleration: 70,
        agility: 72,
        balance: 69,
        bascule: 71,
        pullingPower: 65,
        speed: 74,
        sprint: 73,
        stamina: 68,
        strength: 70,
        surefootedness: 72
      },
      confo: {
        head: "Very Good",
        neck: "Very Good",
        back: "Good",
        shoulders: "Good",
        frontlegs: "Good",
        hindquarters: "Very Good",
        walk: "Good",
        trot: "Very Good",
        canter: "Very Good",
        gallop: "Good",
        socks: "Average",
        posture: "Good",
        revaal: "Good"
      },
      health: {
        colic: "Average risk",
        hooves: "Good",
        back: "No issues noted",
        respiratory: "Healthy",
        lameness: "Average risk"
      },
      colour: {
        name: "Buckskin Dun Rabicano",
        simplified: "Buckskin dun rabicano",
        extension: "Ee",
        agouti: "Aa",
        grey: "gg",
        cream: "nCr",
        dun: "Dd",
        mitf: "n/mitf"
      }
    }
  ];

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
      nameLine.textContent = `${horse.name} (#${horse.id})`;
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

  function computeAgeText(birthdayStr) {
    if (!birthdayStr) return "Age unknown";

    // Expecting format DD-MM-YYYY
    const parts = birthdayStr.split("-");
    if (parts.length !== 3) return "Age unknown";

    const [dd, mm, yyyy] = parts.map((p) => parseInt(p, 10));
    if (!dd || !mm || !yyyy) return "Age unknown";

    const birthDate = new Date(yyyy, mm - 1, dd);
    const now = new Date();

    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    let days = now.getDate() - birthDate.getDate();

    if (days < 0) {
      months -= 1;
      days += 30; // rough
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    if (years < 0) return "Age unknown";

    const partsOut = [];
    if (years > 0) partsOut.push(`${years} year${years === 1 ? "" : "s"}`);
    if (months > 0) partsOut.push(`${months} month${months === 1 ? "" : "s"}`);

    if (!partsOut.length) return "Under 1 month old";
    return partsOut.join(" ");
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
    document.getElementById("info-age").textContent = computeAgeText(horse.birthday);

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

    // images – for now just placeholder text
    document.getElementById("info-image-adult").textContent =
      horse.images && horse.images.adult ? "[adult image here later]" : "No image set";
    document.getElementById("info-image-foal").textContent =
      horse.images && horse.images.foal ? "[foal image here later]" : "No image set";
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

    // GP
    if (horse.gp) {
      Object.entries(horse.gp).forEach(([key, value]) => {
        const tr = document.createElement("tr");
        const tName = document.createElement("td");
        const tVal = document.createElement("td");

        // nicer label
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

  // ---------- INITIAL RENDER ----------
  if (horses.length) {
    selectedHorseId = horses[0].id; // select first horse by default
  }

  renderStable();
  renderDetails();
});
