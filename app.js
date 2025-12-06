// Wait until the HTML is ready
document.addEventListener("DOMContentLoaded", () => {
  console.log("EquiSync app.js loaded");

  // ---------- STABLE DATA ----------
  // Array of horse objects coming from the extension
  let horses = []; // { id, name, sex, breed, ownerUser, ownerFarm, url }

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
      const url = isString
        ? `https://www.horsereality.com/horses/${id}/`
        : (item.url || `https://www.horsereality.com/horses/${id}/`);

      const li = document.createElement("li");
      li.className = "stable-item";

      // Left side: name + owner line
      const left = document.createElement("div");
      left.className = "stable-main";

      const main = document.createElement("span");
      if (name) {
        main.textContent = `${name} (#${id})`;
      } else {
        main.textContent = `Horse #${id}`;
      }
      left.appendChild(main);

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
      left.appendChild(sub);

      li.appendChild(left);

      // Right side: link to HR horse page
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Open";
      link.className = "stable-link";

      li.appendChild(link);

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
