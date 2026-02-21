import { getMatches } from "./firebase.js";

const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menu-toggle");
const predictionsContainer = document.getElementById("predictions");

// Toggle sidebar
menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("show");
});

// Current category
let currentCategory = "free";

// Render matches with card design
async function renderPredictions(category) {
  currentCategory = category;
  predictionsContainer.innerHTML = "<p>Loading...</p>";

  const predictions = await getMatches();

  // Filter by category
  const filtered = predictions.filter(p => p.category === category.toLowerCase());

  predictionsContainer.innerHTML = "";
  if (!filtered.length) {
    predictionsContainer.innerHTML = "<div class='empty-msg'>No predictions available.</div>";
    return;
  }

  filtered.forEach(pred => {
    const card = document.createElement("div");
    card.className = "prediction-card";

    // Determine status color
    let statusColor = "yellow";
    if (pred.status.toLowerCase() === "won") statusColor = "green";
    else if (pred.status.toLowerCase() === "lost") statusColor = "red";

    // Format date
    const dateStr = pred.date instanceof Date ? pred.date.toLocaleString() : pred.date;

    card.innerHTML = `
      <div class="card-header">
        <span class="league">${pred.league}</span>
        <span class="date">${dateStr}</span>
      </div>
      <div class="card-teams">
        <span class="home">${pred.homeTeam}</span>
        <span class="vs">VS</span>
        <span class="away">${pred.awayTeam}</span>
      </div>
      <div class="card-prediction">
        <span class="prediction">${pred.prediction}</span>
        <span class="odds">${pred.odds.toFixed(2)}</span>
        <span class="status ${statusColor}">${pred.status}</span>
      </div>
      ${pred.analysis ? `<div class="analysis">"${pred.analysis}"</div>` : ""}
    `;
    predictionsContainer.appendChild(card);
  });
}

// Sidebar navigation
document.querySelectorAll(".sidebar li").forEach(li => {
  li.addEventListener("click", () => {
    renderPredictions(li.dataset.category);
    sidebar.classList.remove("show");
  });
});

// Bottom menu navigation
document.querySelectorAll(".bottom-menu button").forEach(btn => {
  btn.addEventListener("click", () => renderPredictions(btn.dataset.category));
});

// Initial render
renderPredictions(currentCategory);
