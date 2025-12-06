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

  // ---------- STABLE DATA ----------
  // Array of horse objects coming from the extension
  let horses = []; // { id, name, sex, breed, ownerUser, ownerFarm }

  function renderStable() {
    console.log("renderStable called. horses =", horses);

    const listEl = document.getElementById("stable-list");
    const emptyEl = document.getElementById("stable-empty");

    if (!listEl || !emptyEl) {
      console.warn("Stable elements not found in DOM.");
      return;
    }

    listEl.innerHTML = "";

    if (!horses.length) {
      emptyEl.style.display = "block";
      return;
    }

    emptyEl.style.display = "none";

    horses.forEach((item) => {
      // Support older string-only entries as fallback
      const isString = typeof item === "string";
      const id = isString ? item : item.id;
      const name = isString ? null : item.name;
      const sex = isString ? null : item.sex;
      const breed = isString ? null : item.breed;
      const ownerUser = isString ? null : item.ownerUser;
      const ownerFarm = isString ? null : item.ownerFarm;

      const li = document.createElement("li");
      li.className = "stable-item";

      // Main line: name + ID
      const main = document.createElement("span");
      if (name) {
        main.textContent = `${name} (#${id})`;
      } else {
        main.textContent = `Horse #${id}`;
      }
      li.appendChild(main);

      // Sub line:
      // 1) Prefer OwnerUser + OwnerFarm
      // 2) Fallback to Sex · Breed
      // 3) Fallback to "(from extension)"
      const sub = document.createElement("small");
      let text = "(from extension)";

      if (ownerUser || ownerFarm) {
        const parts = [];
        if (ownerUser) parts.push(ownerUser);
        if (ownerFarm) parts.push(ownerFarm);
        text = parts.join(" – ");
      } else {
        const meta = [];
        if (sex) meta.push(sex);
        if (breed) meta.push(breed);
        if (meta.length) {
          text = meta.join(" · ");
        }
      }

      sub.textContent = text;
      li.appendChild(sub);

      listEl.appendChild(li);
    });
  }

  // Initial empty render
  renderStable();

  // ---------- EXTENSION MESSAGE LISTENER ----------
  window.addEventListener("message", (event) => {
    if (!event.data || event.data.source !== "EquiSyncExtension") return;

    console.log(
      "EquiSync webtool received horses from extension:",
      event.data.horses
    );

    if (Array.isArray(event.data.horses)) {
      horses = event.data.horses.slice(); // copy
      renderStable();
    }
  });
});
