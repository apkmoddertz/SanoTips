import { getMatches } from "./firebase.js";

const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menu-toggle");
const predictionsContainer = document.getElementById("predictions");

let currentCategory = "free";

// Toggle sidebar
menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("show");
});

// Bootstrap Icons for status
const statusIcons = {
  pending: `<i class="bi bi-hourglass-split text-warning"></i>`,
  win: `<i class="bi bi-check-circle-fill text-success"></i>`,
  lose: `<i class="bi bi-x-circle-fill text-danger"></i>`
};

// Normalize and map match status to icon
function getStatusIcon(status) {
  if (!status) return statusIcons.pending;

  const s = status.trim().toLowerCase(); // remove spaces + lowercase

  const winValues = ["win", "won", "winning"];
  const loseValues = ["lose", "lost", "losing"];

  if (winValues.includes(s)) return statusIcons.win;
  if (loseValues.includes(s)) return statusIcons.lose;

  return statusIcons.pending;
}

// Render matches
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
      const statusIcon = getStatusIcon(p.status);

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
