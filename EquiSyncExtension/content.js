// content.js

// Try to insert the button; return true if successful
function insertEquiSyncButton() {
  // Avoid adding it twice
  if (document.getElementById("equisync-tab-button")) {
    return true;
  }

  // Find an element whose text is exactly "Edit"
  const candidates = Array.from(document.querySelectorAll("a, button"));
  const editTab = candidates.find((el) => el.textContent.trim() === "Edit");

  if (!editTab) {
    // Edit tab not found yet
    return false;
  }

  // Create the new button
  const btn = document.createElement("button");
  btn.id = "equisync-tab-button";
  btn.textContent = "EquiSync";

  // Basic styling to blend in reasonably well
  btn.style.marginLeft = "8px";
  btn.style.padding = "4px 10px";
  btn.style.borderRadius = "4px";
  btn.style.border = "1px solid rgba(255,255,255,0.25)";
  btn.style.background = "linear-gradient(135deg, #f97316, #facc15)";
  btn.style.color = "#111";
  btn.style.fontSize = "12px";
  btn.style.fontWeight = "600";
  btn.style.cursor = "pointer";
  btn.style.whiteSpace = "nowrap";

  btn.addEventListener("mouseover", () => {
    btn.style.filter = "brightness(1.05)";
  });
  btn.addEventListener("mouseout", () => {
    btn.style.filter = "none";
  });

  // What happens when the user clicks it
  btn.addEventListener("click", () => {
    alert("EquiSync button clicked! (we’ll wire this up to your tracker next 💫)");
    // Later we can do something like:
    // const horseUrl = window.location.href;
    // window.open("https://madzcoded.github.io/EquiSync/?horse=" + encodeURIComponent(horseUrl), "_blank");
  });

  // Insert it right after the Edit tab in the same container
  const parent = editTab.parentElement || editTab;
  parent.insertBefore(btn, editTab.nextSibling);

  return true;
}

// Run after the page loads, and retry a few times in case the tabs load late
function setup() {
  let attempts = 0;
  const maxAttempts = 10;
  const interval = setInterval(() => {
    attempts++;
    const ok = insertEquiSyncButton();
    if (ok || attempts >= maxAttempts) {
      clearInterval(interval);
    }
  }, 500);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setup);
} else {
  setup();
}
