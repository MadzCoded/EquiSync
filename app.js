// Wait until the HTML is ready
document.addEventListener("DOMContentLoaded", () => {
  console.log("EquiSync app.js loaded");

  // ---------- TAB LOGIC ----------
  const tabButtons = document.querySelectorAll(".tabs button");
  const tabSections = document.querySelectorAll(".tab");

  console.log("Found tab buttons:", tabButtons.length);
  console.log("Found tab sections:", tabSections.length);

  if (!tabButtons.length || !tabSections.length) {
    console.warn("No tabs or sections found – check HTML structure.");
    return;
  }

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.dataset.tab; // "stable", "info", etc.
      console.log("Tab clicked:", targetId);

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

  // ---------- SIMPLE HORSE DATA (IDs only for now) ----------
  let horses = []; // e.g. ["22227400", "12345678"]

  function renderStable() {
    const listEl = document.getElementById("stable-list");
    const emptyEl = document.getElementById("stable-empty");
    if (!listEl || !emptyEl) return;

    listEl.innerHTML = "";

    if (!horses.length) {
      emptyEl.style.display = "block";
      return;
    }

    emptyEl.style.display = "none";

    horses.forEach((id) => {
      const li = document.createElement("li");
      li.className = "stable-item";

      const main = document.createElement("span");
      main.textContent = `Horse #${id}`;
      li.appendChild(main);

      const sub = document.createElement("small");
      sub.textContent = "(from extension)";
      li.appendChild(sub);

      listEl.appendChild(li);
    });
  }

  // initial render (empty)
  renderStable();

  // ---------- EXTENSION MESSAGE LISTENER ----------
  window.addEventListener("message", (event) => {
    if (!event.data || event.data.source !== "EquiSyncExtension") return;

    console.log("EquiSync webtool received horses from extension:", event.data.horses);

    if (Array.isArray(event.data.horses)) {
      horses = event.data.horses.slice(); // copy array
      renderStable();
    }
  });
});
