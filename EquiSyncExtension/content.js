// content.js

function insertEquiSyncButton() {
  // Avoid duplicates
  if (document.getElementById("equisync-floating-button")) {
    return true;
  }

  const btn = document.createElement("button");
  btn.id = "equisync-floating-button";
  btn.textContent = "EquiSync";

  // Floating bottom-right styling
  btn.style.position = "fixed";
  btn.style.right = "20px";
  btn.style.bottom = "20px";
  btn.style.zIndex = "9999";
  btn.style.padding = "10px 16px";
  btn.style.borderRadius = "999px";
  btn.style.border = "1px solid rgba(255,255,255,0.4)";
  btn.style.background = "linear-gradient(135deg, #f97316, #facc15)";
  btn.style.color = "#111827";
  btn.style.fontSize = "13px";
  btn.style.fontWeight = "600";
  btn.style.cursor = "pointer";
  btn.style.boxShadow = "0 8px 20px rgba(0,0,0,0.4)";
  btn.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

  btn.addEventListener("mouseover", () => {
    btn.style.transform = "translateY(-1px)";
    btn.style.boxShadow = "0 10px 24px rgba(0,0,0,0.5)";
  });

  btn.addEventListener("mouseout", () => {
    btn.style.transform = "translateY(0)";
    btn.style.boxShadow = "0 8px 20px rgba(0,0,0,0.4)";
  });

  btn.addEventListener("click", () => {
    // Extract lifenumber from URL, e.g. /horses/22238866/
    const match = window.location.href.match(/horses\/(\d+)/i);
    if (!match) {
      alert("EquiSync couldn't find this horse's lifenumber in the URL.");
      return;
    }

    const lifeNumber = match[1];

    // Extract horse name from the page: <h1 id="name">Horse Name</h1>
// Get <h1 id="name"> that contains the horse's name
const nameEl = document.querySelector("h1#name");

// Extract ONLY the text node (exclude icons)
let horseName = "Unknown";
if (nameEl) {
  // Find the first real text node inside the element
  const textNode = Array.from(nameEl.childNodes)
    .find(n => n.nodeType === Node.TEXT_NODE);

  if (textNode) {
    horseName = textNode.textContent.trim();
  }
}

    // Your EquiSync site URL with lifenumber + name attached
    const equiSyncUrl =
      "https://madzcoded.github.io/EquiSync/?id=" +
      encodeURIComponent(lifeNumber) +
      "&name=" +
      encodeURIComponent(horseName);

    // Open EquiSync in a new tab
    window.open(equiSyncUrl, "_blank");
  });

  document.body.appendChild(btn);
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
