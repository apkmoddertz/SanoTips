// js/app.js
import { getMatches } from "./firebase.js";

// Sidebar and menu toggle
const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menu-toggle");
const predictionsContainer = document.getElementById("predictions");

menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("show");
});

// Current category
let currentCategory = "free";

// Simulate VIP access (replace with real auth if you add login later)
const userProfile = {
  subscription: "free", // free / safe / fixed
  status: "active",
  expires: "2026-03-01"
};

// Function to check if a prediction is locked
function isLocked(pred) {
  if (pred.category.toLowerCase() === "free") return false;
  if (!userProfile || userProfile.status !== "active") return true;
  if (userProfile.expires && new Date(userProfile.expires) < new Date()) return true;
  if (pred.category.toLowerCase() === "safe" && !["safe","fixed"].includes(userProfile.subscription)) return true;
  if (pred.category.toLowerCase() === "fixed" && userProfile.subscription !== "fixed") return true;
  return false;
}

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

    filtered.forEach(pred => {
      const card = document.createElement("div");
      card.className = "prediction-card";

      if (isLocked(pred)) {
        // Locked card
        card.innerHTML = `
          <div class="locked-overlay">
            <div class="lock-icon">🔒</div>
            <h3>VIP Content Locked</h3>
            <p>Upgrade to ${pred.category} plan to see this prediction.</p>
            <button onclick="alert('Upgrade to VIP!')">Unlock Now</button>
          </div>
          <div class="blurred-card">
            <div class="card-header">
              <span>${pred.league}</span>
              <span>${new Date(pred.date).toLocaleString()}</span>
            </div>
            <div class="teams">
              <span>${pred.homeTeam}</span>
              <span>VS</span>
              <span>${pred.awayTeam}</span>
            </div>
            <div class="prediction-box">
              <span>Prediction: ${pred.prediction}</span>
              <span class="status">${pred.status}</span>
              <span>Odds: ${pred.odds.toFixed(2)}</span>
            </div>
          </div>
        `;
      } else {
        // Normal card
        card.innerHTML = `
          <div class="card-header">
            <span>${pred.league}</span>
            <span>${new Date(pred.date).toLocaleString()}</span>
          </div>
          <div class="teams">
            <span>${pred.homeTeam}</span>
            <span>VS</span>
            <span>${pred.awayTeam}</span>
          </div>
          <div class="prediction-box">
            <span>Prediction: ${pred.prediction}</span>
            <span class="status">${pred.status}</span>
            <span>Odds: ${pred.odds.toFixed(2)}</span>
          </div>
          ${pred.analysis ? `<div class="analysis">${pred.analysis}</div>` : ""}
        `;
      }

      predictionsContainer.appendChild(card);
    });

  } catch (err) {
    console.error("Error loading predictions:", err);
    predictionsContainer.innerHTML = "<div class='empty-msg'>Failed to load predictions.</div>";
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
