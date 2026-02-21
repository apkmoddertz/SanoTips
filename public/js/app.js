import { getPredictions } from "./firebase.js";
import { hasAccess, isAdmin } from "./users.js";

const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menu-toggle");
const predictionsContainer = document.getElementById("predictions");
const premiumModal = document.getElementById("premium-modal");

menuToggle.addEventListener("click", () => sidebar.classList.toggle("show"));

let currentCategory = "free";

// Render predictions
async function renderPredictions(category) {
  currentCategory = category;
  predictionsContainer.innerHTML = "<p>Loading...</p>";
  const allPredictions = await getPredictions();
  const filtered = allPredictions.filter(p => p.category.toLowerCase() === category.toLowerCase());

  if (!filtered.length) {
    predictionsContainer.innerHTML = `<div class="empty-msg">No predictions available.</div>`;
    return;
  }

  predictionsContainer.innerHTML = "";
  filtered.forEach(p => {
    const card = document.createElement("div");
    card.className = "prediction-card";

    let locked = !hasAccess(p.category);
    card.innerHTML = `
      <h3>${p.league}: ${p.homeTeam} vs ${p.awayTeam}</h3>
      <p>Date: ${new Date(p.date).toLocaleString()}</p>
      <p>Prediction: ${locked ? "🔒 Premium" : p.prediction}</p>
      <p>Status: ${p.status}</p>
      ${isAdmin() ? `<button class="edit-btn" data-id="${p.id}">Edit</button>` : ""}
    `;
    predictionsContainer.appendChild(card);
  });
}

// Sidebar buttons
document.querySelectorAll(".sidebar li, .bottom-menu button").forEach(el => {
  el.addEventListener("click", () => renderPredictions(el.dataset.category));
});

// Initial render
renderPredictions(currentCategory);
