// content.js

function insertEquiSyncButton() {
  // Avoid duplicates
  if (document.getElementById("equisync-tab-button")) {
    return true;
  }

  // Look for something that visibly says "Edit" in the tab bar area
  const allElements = Array.from(document.querySelectorAll("*"));

  const editTab = allElements.find((el) => {
    const text = el.textContent.trim();
    if (!text.includes("Edit")) return false;

    // Only consider visible elements
    const style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") {
      return false;
    }

    // We also want it to be clickable (link or button or looks like a tab)
    const tag = el.tagName.toLowerCase();
    if (tag === "a" || tag === "button") return true;

    // Or has a role of tab/button
    const role = el.getAttribute("role");
    if (role === "tab" || role === "button") return true;

    return false;
  });

  if (!editTab) {
    return false; // not yet found
  }

  const btn = document.createElement("button");
  btn.id = "equisync-tab-button";
  btn.textContent = "EquiSync";

  // Simple styling to sit beside Edit
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

  btn.addEventListener("click", () => {
    const horseUrl = window.location.href;
    alert("EquiSync clicked for:\n" + horseUrl);
    // later: open your site or send data somewhere
  });

  // Insert right after the Edit tab in its parent container
  const parent = editTab.parentElement || editTab;
  parent.insertBefore(btn, editTab.nextSibling);

  return true;
}

function setup() {
  let attempts = 0;
  const maxAttempts = 12;

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
