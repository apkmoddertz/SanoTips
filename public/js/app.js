const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menu-toggle");
menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("show");
});

// Example static predictions
const predictions = [
  { league: "Premier League", home: "Liverpool", away: "Man Utd", date: "2026-02-20", prediction: "Home Win", category: "free", status: "pending" },
  { league: "La Liga", home: "Real Madrid", away: "Barcelona", date: "2026-02-21", prediction: "Away Win", category: "safe", status: "pending" }
];

const predictionsContainer = document.getElementById("predictions");

function renderPredictions(category) {
  predictionsContainer.innerHTML = "";
  const filtered = predictions.filter(p => p.category === category);
  filtered.forEach(p => {
    const card = document.createElement("div");
    card.className = "prediction-card";
    card.innerHTML = `
      <h3>${p.league}: ${p.home} vs ${p.away}</h3>
      <p>Date: ${p.date}</p>
      <p>Prediction: ${p.prediction}</p>
      <p>Status: ${p.status}</p>
    `;
    predictionsContainer.appendChild(card);
  });
}

// Default view
renderPredictions("free");

// Bottom menu click
document.querySelectorAll(".bottom-menu button").forEach(btn => {
  btn.addEventListener("click", () => renderPredictions(btn.dataset.category));
});

// Sidebar click
document.querySelectorAll(".sidebar li").forEach(li => {
  li.addEventListener("click", () => {
    renderPredictions(li.dataset.category);
    sidebar.classList.remove("show");
  });
});
