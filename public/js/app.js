import { getMatches } from "./firebase.js";

const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menu-toggle");
const predictionsContainer = document.getElementById("predictions");

let currentCategory = "free";

// Toggle sidebar
menuToggle.addEventListener("click", () => sidebar.classList.toggle("show"));

// Animated SVG icons for status
const statusIcons = {
  pending: `<svg class="status-icon pending" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#facc15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
  win: `<svg class="status-icon win" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"><animate attributeName="stroke" values="#10b981;#34d399;#10b981" dur="1.5s" repeatCount="indefinite"/></path></svg>`,
  lose: `<svg class="status-icon lose" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
};

function getStatusIcon(status) {
  const s = (status || "pending").toLowerCase();
  return statusIcons[s] || statusIcons.pending;
}

// Render predictions
async function renderPredictions(category) {
  currentCategory = category;
  predictionsContainer.innerHTML = "<p>Loading...</p>";

  try {
    const predictions = await getMatches();
    const filtered = predictions.filter(p => (p.category || "").toLowerCase() === category.toLowerCase());
    predictionsContainer.innerHTML = "";

    if (!filtered.length) {
      predictionsContainer.innerHTML = "<div class='empty-msg'>No predictions available.</div>";
      return;
    }

    filtered.forEach(p => {
      const oddsValue = Number(p.odds || p.odd || 0);
      const formattedDate = new Date(p.date).toLocaleString();

      const card = document.createElement("div");
      card.className = "prediction-card";

      card.innerHTML = `
        <div class="card-header">
          <span class="league">${p.league || "-"}</span>
          <span class="date" onselectstart="return false;">${formattedDate}</span>
        </div>

        <div class="teams-table">
          <table>
            <tr>
              <td class="team home">${p.homeTeam || "Home"}</td>
              <td class="vs">VS</td>
              <td class="team away">${p.awayTeam || "Away"}</td>
            </tr>
          </table>
        </div>

        <div class="prediction-box">
          <div class="prediction-left">
            <small class="prediction-label">Prediction</small>
            <div class="prediction-text">${p.prediction || "-"}</div>
          </div>
          <div class="prediction-right">
            ${getStatusIcon(p.status)}
            <div class="odds">${oddsValue.toFixed(2)}</div>
          </div>
        </div>
      `;

      predictionsContainer.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    predictionsContainer.innerHTML = "<div class='error-msg'>Error loading predictions.</div>";
  }
}

// Sidebar & Bottom menu
document.querySelectorAll(".sidebar li").forEach(li => {
  li.addEventListener("click", () => {
    renderPredictions(li.dataset.category);
    sidebar.classList.remove("show");
  });
});
document.querySelectorAll(".bottom-menu button").forEach(btn => btn.addEventListener("click", () => renderPredictions(btn.dataset.category)));

// Initial load
renderPredictions(currentCategory);
