import { getMatches } from "./firebase.js";

const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menu-toggle");
const predictionsContainer = document.getElementById("predictions");

let currentCategory = "free";

// Toggle sidebar
menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("show");
});

// SVG icons for status
const statusIcons = {
  pending: `<svg xmlns="http://www.w3.org/2000/svg" class="status-icon" viewBox="0 0 24 24" fill="none" stroke="#facc15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
  win: `<svg xmlns="http://www.w3.org/2000/svg" class="status-icon" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>`,
  lose: `<svg xmlns="http://www.w3.org/2000/svg" class="status-icon" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
};

// Get icon based on match status
function getStatusIcon(status) {
  if (!status) return statusIcons.pending;
  const s = status.trim().toLowerCase();
  const winValues = ["win", "won", "winning"];
  const loseValues = ["lose", "lost", "losing"];
  if (winValues.includes(s)) return statusIcons.win;
  if (loseValues.includes(s)) return statusIcons.lose;
  return statusIcons.pending;
}

// Render matches grouped by date
async function renderPredictions(category) {
  currentCategory = category;
  predictionsContainer.innerHTML = "<p>Loading...</p>";

  try {
    const predictions = await getMatches();
    const filtered = predictions.filter(p => (p.category || "").toLowerCase() === category.toLowerCase());

    // Sort by date descending
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    predictionsContainer.innerHTML = "";

    if (!filtered.length) {
      predictionsContainer.innerHTML = "<div class='empty-msg'>No predictions available.</div>";
      return;
    }

    let lastDate = null;

    filtered.forEach(p => {
      const oddsValue = Number(p.odds || p.odd || 0);
      const matchDate = new Date(p.date);
      const dateString = matchDate.toLocaleDateString(); // "21/02/2026"
      const formattedDate = matchDate.toLocaleString();
      const statusIcon = getStatusIcon(p.status);

      // Add date header if it's a new date
      if (dateString !== lastDate) {
        const dateHeader = document.createElement("div");
        dateHeader.className = "date-header";
        dateHeader.textContent = dateString;
        predictionsContainer.appendChild(dateHeader);
        lastDate = dateString;
      }

      // Match card
      const card = document.createElement("div");
      card.className = "prediction-card";

      card.innerHTML = `
        <div class="card-header">
          <span class="league">${p.league || "-"}</span>
          <span class="date">${formattedDate}</span>
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
            ${statusIcon}
            <div class="odds">${oddsValue.toFixed(2)}</div>
          </div>
        </div>
      `;

      predictionsContainer.appendChild(card);
    });

  } catch (error) {
    console.error("Error loading predictions:", error);
    predictionsContainer.innerHTML = "<div class='error-msg'>Error loading predictions.</div>";
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
