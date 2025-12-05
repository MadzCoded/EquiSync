// Wait until the HTML is ready
document.addEventListener("DOMContentLoaded", () => {
  console.log("EquiSync app.js loaded");

  // ---------- TAB LOGIC ----------
  const tabButtons = document.querySelectorAll(".tabs button");
  const tabSections = document.querySelectorAll(".tab");

  console.log("Found tab buttons:", tabButtons.length);
  console.log("Found tab sections:", tabSections.length);

  // If we didn't find them, bail out
  if (!tabButtons.length || !tabSections.length) {
    console.warn("No tabs or sections found – check HTML structure.");
    return;
  }

  // Add click listeners
  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.dataset.tab; // "stable", "info", etc.
      console.log("Tab clicked:", targetId);

      // Update button active state
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Show the right section
      tabSections.forEach((section) => {
        if (section.id === targetId) {
          section.classList.add("active");
        } else {
          section.classList.remove("active");
        }
      });
    });
  });

  // ---------- STABLE FORM LOGIC (just logging for now) ----------
  const stableForm = document.getElementById("stable-horse-form");
  console.log("stableForm element found?", !!stableForm);

  if (stableForm) {
    stableForm.addEventListener("submit", (event) => {
      event.preventDefault(); // stop the page from reloading

      const name = document.getElementById("stable-name").value.trim();
      const id = document.getElementById("stable-id").value.trim();

      console.log("Stable form submitted. Horse data:", {
        name,
        id,
      });

      // later: we will add this horse to an array and render it
    });
  }
});
