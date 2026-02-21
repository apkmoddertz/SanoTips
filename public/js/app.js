async function renderPredictions(category) {
  currentCategory = category;
  predictionsContainer.innerHTML = "<p>Loading...</p>";

  try {
    const predictions = await getMatches();
    // Filter by category
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

      const status = (p.status || "pending").toLowerCase();
      const statusIcon = getStatusIcon(status);
      const vsBgColor = vsColors[status] || vsColors.pending;

      // Add date header if new date
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
              <td class="vs" style="background:${vsBgColor};">VS</td>
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
