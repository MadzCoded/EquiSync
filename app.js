// ---------- SIMPLE HORSE DATA (objects now) ----------
let horses = []; // e.g. [{ id: "22227400", name: "AlleyCat Dunner", sex: "Stallion", breed: "Kathiawari Horse" }]

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
    // support old string-only entries as fallback
    const isString = typeof item === "string";
    const id = isString ? item : item.id;
    const name = isString ? null : item.name;
    const sex = isString ? null : item.sex;
    const breed = isString ? null : item.breed;

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

    // Sub line: sex · breed or generic text
    const sub = document.createElement("small");
    const meta = [];
    if (sex) meta.push(sex);
    if (breed) meta.push(breed);

    sub.textContent = meta.length ? meta.join(" · ") : "(from extension)";
    li.appendChild(sub);

    listEl.appendChild(li);
  });
}
