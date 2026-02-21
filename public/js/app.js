// public/js/app.js
import { getMatches } from "./firebase.js";

const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menu-toggle");
const predictionsContainer = document.getElementById("predictions");

menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("show");
});

let currentCategory = "free";

// Render predictions
async function renderPredictions(category) {
  currentCategory = category;
  predictionsContainer.innerHTML = "<p>Loading...</p>";

  try {
    const predictions = await getMatches();
    const filtered = predictions.filter(p => p.category.toLowerCase() === category.toLowerCase());

    predictionsContainer.innerHTML = "";

    if (!filtered.length) {
      predictionsContainer.innerHTML = "<div class='empty-msg'>No predictions available.</div>";
      return;
    }

    filtered.forEach(p => {
      const card = document.createElement("div");
      card.className = "prediction-card";
      card.innerHTML = `
        <div class="card-header">
          <span class="league">${p.league}</span>
          <span class="date">${new Date(p.date).toLocaleString()}</span>
        </div>
        <div class="card-body">
          <div class="teams">
            <span class="home">${p.homeTeam}</span>
            <span class="vs">VS</span>
            <span class="away">${p.awayTeam}</span>
          </div>
          <div class="prediction">
            <strong>Prediction:</strong> ${p.prediction}
          </div>
          <div class="status">
            <strong>Status:</strong> ${p.status}
          </div>
          <div class="odds">
            <strong>Odds:</strong> ${p.odds.toFixed(2)}
          </div>
        </div>
      `;
      predictionsContainer.appendChild(card);
    });
  } catch (err) {
    predictionsContainer.innerHTML = `<div class='error-msg'>Error loading predictions: ${err.message}</div>`;
    console.error(err);
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
  btn.addEventListener("click", () => renderPredictions(btn.dataset.category));
});

// Initial render
renderPredictions(currentCategory);
