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

      const card = document.createElement("div");
      card.className = "prediction-card";

      card.innerHTML = `
        <div class="card-header">
          <span class="league">${p.league || "League"}</span>
          <span class="date">${formattedDate}</span>
        </div>

        <div class="teams">
          <div class="team">${p.homeTeam || "Home"}</div>
          <div class="vs">VS</div>
          <div class="team">${p.awayTeam || "Away"}</div>
        </div>

        <div class="prediction-box">
          <div>
            <small>Prediction</small>
            <div class="prediction-text">${p.prediction}</div>
          </div>
          <div class="odds">
            ${oddsValue.toFixed(2)}
          </div>
        </div>

        <div class="status ${p.status}">
          ${p.status || "pending"}
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
