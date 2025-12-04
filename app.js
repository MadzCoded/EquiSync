// Run only after the HTML has fully loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("EquiSync app.js loaded");

  // 1. Grab all the tab buttons and tab sections
  const tabButtons = document.querySelectorAll(".tabs button");
  const tabSections = document.querySelectorAll(".tab");

  console.log("Found tab buttons:", tabButtons.length);
  console.log("Found tab sections:", tabSections.length);

  // Safety: if something is wrong with HTML
  if (!tabButtons.length || !tabSections.length) {
    console.warn("No tabs or sections found – check HTML structure.");
    return;
  }

  // 2. For each button, listen for a click
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.dataset.tab; // e.g. "stable", "info"
      console.log("Tab clicked:", targetId);

      // 3. Remove "active" from all buttons, add to clicked one
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // 4. Hide all sections, show only the matching one
      tabSections.forEach((section) => {
        if (section.id === targetId) {
          section.classList.add("active");
        } else {
          section.classList.remove("active");
        }
      });
    });
  });
});
