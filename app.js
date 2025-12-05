// Wait until the HTML is ready
document.addEventListener("DOMContentLoaded", () => {
  console.log("EquiSync app.js loaded");

  // Get all tab buttons and tab sections
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

        // MANUAL FORM LOGIC (Step 1: stop reload + log values)
const manualForm = document.getElementById("manual-horse-form");

if (manualForm) {
  manualForm.addEventListener("submit", (event) => {
    event.preventDefault(); // STOP page reload

    console.log("Manual form submitted.");

    // Get each field value
    const name = document.getElementById("manual-name").value.trim();
    const id = document.getElementById("manual-id").value.trim();
    const url = document.getElementById("manual-url").value.trim();
    const sex = document.getElementById("manual-sex").value.trim();
    const breed = document.getElementById("manual-breed").value.trim();
    const owner = document.getElementById("manual-owner").value.trim();
    const breeder = document.getElementById("manual-breeder").value.trim();
    const notes = document.getElementById("manual-notes").value.trim();

    console.log("Collected horse data:", {
      name,
      id,
      url,
      sex,
      breed,
      owner,
      breeder,
      notes
      });
    });
  });
});
