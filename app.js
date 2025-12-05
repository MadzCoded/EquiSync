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

  // ---------- EXTENSION MESSAGE LISTENER ----------
  // This runs on your EquiSync page when the extension calls window.postMessage(...)
  window.addEventListener("message", (event) => {
    // Basic safety check
    if (!event.data || event.data.source !== "EquiSyncExtension") return;

    console.log("EquiSync webtool received horses from extension:", event.data.horses);

    // Right now: just log the IDs.
    // Later: we'll turn these into horse entries in the Stable tab.
  });
});
