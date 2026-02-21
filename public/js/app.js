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

// Helper: format date
function formatDate(dateString) {
  const d = new Date(dateString);
  return d.toLocaleString("en-US", {
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    month: "short",
    day: "numeric"
  });
}

// Create prediction card
function createPredictionCard(pred, isLocked = false) {
  const card = document.createElement("div");
  card.className = "prediction-card";

  if (isLocked) {
    card.innerHTML = `
      <div class="locked-overlay">
        <div class="lock-icon">🔒</div>
        <h3>VIP Content Locked</h3>
        <p>Upgrade to ${pred.category} Plan to see this high-confidence prediction.</p>
        <button class="unlock-btn">Unlock Now</button>
      </div>
      <div class="blurred-content">
        <div class="header">
          <span>${pred.league}</span>
          <span>${formatDate(pred.date)}</span>
        </div>
        <div class="teams">
          <span>${pred.homeTeam || pred.home}</span>
          <span>VS</span>
          <span>${pred.awayTeam || pred.away}</span>
        </div>
        <div class="prediction-box">
          <div class="h-12"></div>
        </div>
      </div>
    `;
    // Unlock button click
    card.querySelector(".unlock-btn").addEventListener("click", () => {
      alert("Redirect to premium plan!");
    });
    return card;
  }

  // Normal card
  card.innerHTML = `
    <div class="card-header">
      <span class="league">${pred.league}</span>
      <span class="time">${formatDate(pred.date)}</span>
    </div>
    <div class="teams">
      <span class="home">${pred.homeTeam || pred.home}</span>
      <span class="vs">VS</span>
      <span class="away">${pred.awayTeam || pred.away}</span>
    </div>
    <div class="prediction-box">
      <div class="prediction-info">
        <div>
          <div class="label">Prediction</div>
          <div class="value">${pred.prediction}</div>
        </div>
        <div>
          <div class="label">Odds</div>
          <div class="value">${pred.odds ? pred.odds.toFixed(2) : "-"}</div>
        </div>
        <div class="status">
          ${pred.status === "Won" ? "✅" : pred.status === "Lost" ? "❌" : "⏳"}
        </div>
      </div>
      ${pred.analysis ? `<div class="analysis">"${pred.analysis}"</div>` : ""}
    </div>
  `;

  return card;
}

// Fetch and render predictions
async function renderPredictions(category) {
  currentCategory = category;
  predictionsContainer.innerHTML = "<p>Loading...</p>";

  const predictions = await getMatches(); // Fetch from Firestore
  const filtered = predictions.filter(
    p => (p.category || "").toLowerCase() === category.toLowerCase()
  );

  predictionsContainer.innerHTML = "";
  if (!filtered.length) {
    predictionsContainer.innerHTML =
      "<div class='empty-msg'>No predictions available.</div>";
    return;
  }

  filtered.forEach(pred => {
    // Lock content if safe/fixed and user has no access
    let isLocked = false;
    if ((category === "safe" || category === "fixed") && pred.status === "pending") {
      // You can add real user check here
      isLocked = false; // set true if user is not premium
    }

    const card = createPredictionCard(pred, isLocked);
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
