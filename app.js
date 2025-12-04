// Just to check the JS file is loading
console.log("EquiSync app.js loaded");

// 1. Grab all the tab buttons and tab sections
const tabButtons = document.querySelectorAll(".tabs button");
const tabSections = document.querySelectorAll(".tab");

// 2. For each button, listen for a click
tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Which tab should be shown? (read the data-tab attribute)
    const targetId = button.dataset.tab; // e.g. "stable", "info"

    // 3. Remove "active" class from all buttons
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    // and add it to the one we clicked
    button.classList.add("active");

    // 4. Hide all tab sections, then show the one we want
    tabSections.forEach((section) => {
      if (section.id === targetId) {
        section.classList.add("active");
      } else {
        section.classList.remove("active");
      }
    });
  });
});
