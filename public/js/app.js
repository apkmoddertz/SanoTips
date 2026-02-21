// js/app.js
import { getMatches } from "./firebase.js";

const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menu-toggle");
const predictionsContainer = document.getElementById("predictions");

menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("show");
});

// Current category
let currentCategory = "free";

// Fetch and render predictions from Firestore
async function renderPredictions(category) {
  currentCategory = category;
  predictionsContainer.innerHTML = "<p>Loading...</p>";
  
  const predictions = await getMatches(); // Fetch from Firestore
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
      <h3>${p.league}: ${p.homeTeam || p.home} vs ${p.awayTeam || p.away}</h3>
      <p>Date: ${new Date(p.date).toLocaleString()}</p>
      <p>Prediction: ${p.prediction}</p>
      <p>Status: ${p.status}</p>
    `;
    predictionsContainer.appendChild(card);
  });
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
