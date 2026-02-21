// js/app.js

import { getMatches } from "./firebase.js";

const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menu-toggle");
const predictionsContainer = document.getElementById("predictions");

let currentCategory = "free";

// Toggle sidebar
menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("show");
});

// SVG icons
const statusIcons = {
  pending: `<svg xmlns="http://www.w3.org/2000/svg" class="status-icon pending" viewBox="0 0 24 24" fill="none" stroke="#facc15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M12 6v6l4 2"></path>
  </svg>`,
  win: `<svg xmlns="http://www.w3.org/2000/svg" class="status-icon win" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
    <path d="M20 6L9 17l-5-5"></path>
  </svg>`,
  lose: `<svg xmlns="http://www.w3.org/2000/svg" class="status-icon lose" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>`
};

// Get status icon based on match status
function getStatusIcon(status) {
  const s = (status || "pending").toLowerCase();
  return statusIcons[s] || statusIcons.pending;
}

// Render matches
async function renderPredictions(category) {
  currentCategory = category;
  predictionsContainer.innerHTML = "<p>Loading...</p>";

  try {
    const predictions = await getMatches();

    const filtered = predictions.filter(p =>
      (p.category || "").toLowerCase() === category.toLowerCase()
    );

    predictionsContainer.innerHTML = "";

    if (!filtered.length) {
      predictionsContainer.innerHTML =
        "<div class='empty-msg'>No predictions available.</div>";
      return;
    }

    filtered.forEach(p => {
      const oddsValue = Number(p.odds || p.odd || 0);
      const formattedDate = new Date(p.date).toLocaleString();
      const statusIcon = getStatusIcon(p.status);

      const card = document.createElement("div");
      card.className = "prediction-card";

      card.innerHTML = `
        <div class="card-header">
          <span class="league">${p.league || "League"}</span>
          <span class="date">${formattedDate}</span>
        </div>

        <!-- Teams Row -->
        <div class="teams">
          <div class="team home">${p.homeTeam || "Home"}</div>
          <div class="vs">VS</div>
          <div class="team away">${p.awayTeam || "Away"}</div>
        </div>

        <!-- Prediction Row -->
        <div class="prediction-box">
          <div class="prediction-left">
            <small class="prediction-label">Prediction</small>
            <div class="prediction-text">${p.prediction || "-"}</div>
          </div>

          <div class="prediction-right">
            ${statusIcon}
            <div class="odds">${oddsValue.toFixed(2)}</div>
          </div>
        </div>
      `;

      predictionsContainer.appendChild(card);
    });

  } catch (error) {
    console.error("Error loading predictions:", error);
    predictionsContainer.innerHTML =
      "<div class='error-msg'>Error loading predictions.</div>";
  }
}

// Sidebar click
document.querySelectorAll(".sidebar li").forEach(li => {
  li.addEventListener("click", () => {
    renderPredictions(li.dataset.category);
    sidebar.classList.remove("show");
  });
});

// Bottom menu click
document.querySelectorAll(".bottom-menu button").forEach(btn => {
  btn.addEventListener("click", () => {
    renderPredictions(btn.dataset.category);
  });
});

// Initial load
renderPredictions(currentCategory);
