// public/js/app.js

import { getMatches } from "./firebase.js";

// --------------------- Authentication ---------------------
const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
  window.location.href = "/login.html";
}

// --------------------- DOM Elements ---------------------
const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menu-toggle");
const predictionsContainer = document.getElementById("predictions");
const bottomButtons = document.querySelectorAll(".bottom-menu button");
const sidebarItems = document.querySelectorAll(".sidebar li");

let currentCategory = "free"; // Default category for new visitors

// --------------------- Sidebar Toggle ---------------------
menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("show");
});

// --------------------- Status Icons ---------------------
const statusIcons = {
  pending: `<svg xmlns="http://www.w3.org/2000/svg" class="status-icon" viewBox="0 0 24 24" fill="none" stroke="#facc15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
  win: `<svg xmlns="http://www.w3.org/2000/svg" class="status-icon" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`,
  lose: `<svg xmlns="http://www.w3.org/2000/svg" class="status-icon" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
};

function getStatusIcon(status) {
  if (!status) return statusIcons.pending;
  const s = status.trim().toLowerCase();
  if (["win", "won", "winning"].includes(s)) return statusIcons.win;
  if (["lose", "lost", "losing"].includes(s)) return statusIcons.lose;
  return statusIcons.pending;
}

// --------------------- Permission Check ---------------------
function canViewMatch(user, category, status) {
  const isVipCategory = ["safe", "fixed"].includes(category.toLowerCase());
  const isPending = (status || "").toLowerCase() === "pending";

  // Free users see only 'free'
  if (user.subscription.toLowerCase() === "free" && category.toLowerCase() !== "free") {
    return false;
  }

  // VIP users: lock pending if subscription expired
  if (isVipCategory && isPending) {
    if (!user.billing || !user.expires) return false;
    const expireDate = new Date(user.expires);
    if (expireDate < new Date()) return false;
  }

  return true;
}

// --------------------- Render Matches ---------------------
async function renderPredictions(category) {
  currentCategory = category;
  predictionsContainer.innerHTML = `<div class="loading-spinner"></div>`;

  try {
    const predictions = await getMatches();
    let filtered = predictions.filter(p => (p.category || "").toLowerCase() === category.toLowerCase());

    // Sort by date descending
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    predictionsContainer.innerHTML = "";

    if (!filtered.length) {
      predictionsContainer.innerHTML = "<div class='empty-msg'>No predictions available.</div>";
      return;
    }

    let lastDate = null;

    filtered.forEach(p => {
      const oddsValue = Number(p.odds || p.odd || 0);
      const matchDate = new Date(p.date);
      const dateString =
        matchDate.getDate().toString().padStart(2, "0") +
        "/" +
        matchDate.toLocaleString("default", { month: "short" }).toUpperCase() +
        "/" +
        matchDate.getFullYear();
      const statusIcon = getStatusIcon(p.status);

      // Date header (top of first match card of that date)
      if (dateString !== lastDate) {
        const dateHeader = document.createElement("div");
        dateHeader.className = "date-header";
        dateHeader.textContent = dateString;
        predictionsContainer.appendChild(dateHeader);
        lastDate = dateString;
      }

      // --------------------- Prediction Card ---------------------
      const card = document.createElement("div");
      card.className = "prediction-card";

      const canView = canViewMatch(user, category, p.status);
      const isLocked = !canView;

      card.innerHTML = `
        <div class="card-header">
          <span class="league">${p.league || "-"}</span>
          <span class="date">${matchDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
        </div>

        <div class="teams-table">
          <table>
            <tr>
              <td class="team home">${p.homeTeam || "Home"}</td>
              <td class="vs">VS</td>
              <td class="team away">${p.awayTeam || "Away"}</td>
            </tr>
          </table>
        </div>

        <div class="prediction-box ${isLocked ? "locked" : ""}">
          <div class="prediction-left">
            <small class="prediction-label">Prediction</small>
            <div class="prediction-text">${isLocked ? "Subscribe to view" : p.prediction || "-"}</div>
          </div>
          <div class="prediction-right">
            ${statusIcon}
            <div class="odds">${isLocked ? "--" : oddsValue.toFixed(2)}</div>
          </div>
          ${isLocked ? `<button class="subscribe-btn">Subscribe</button>` : ""}
        </div>
      `;

      // Locked card opens subscription page
      if (isLocked) {
        const btn = card.querySelector(".subscribe-btn");
        btn?.addEventListener("click", e => {
          e.stopPropagation();
          window.location.href = "/subscribe.html";
        });
      }

      predictionsContainer.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading predictions:", err);
    predictionsContainer.innerHTML = "<div class='error-msg'>Error loading predictions.</div>";
  }
}

// --------------------- Sidebar Click ---------------------
sidebarItems.forEach(li => {
  li.addEventListener("click", () => {
    renderPredictions(li.dataset.category);
    sidebar.classList.remove("show");
  });
});

// --------------------- Bottom Menu Click ---------------------
bottomButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    renderPredictions(btn.dataset.category);
  });
});

// --------------------- Initial Load ---------------------
renderPredictions(currentCategory);
