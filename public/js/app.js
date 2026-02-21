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

// Get status icon
function getStatusIcon(status) {
  const s = (status || "pending").toLowerCase();

  if (s === "won" || s === "win") {
    return `<div class="status-icon win">✔</div>`;
  }

  if (s === "lost" || s === "lose") {
    return `<div class="status-icon lose">✖</div>`;
  }

  return `<div class="status-icon pending">⏳</div>`;
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
