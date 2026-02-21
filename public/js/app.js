// public/js/app.js
import { getMatches } from "./firebase.js";

const user = JSON.parse(localStorage.getItem("user"));
if (!user) window.location.href = "/login.html";

const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menu-toggle");
const predictionsContainer = document.getElementById("predictions");
const bottomButtons = document.querySelectorAll(".bottom-menu button");
const sidebarItems = document.querySelectorAll(".sidebar li");

let currentCategory = "free";

menuToggle.addEventListener("click", () => sidebar.classList.toggle("show"));

const statusIcons = {
  pending: `<svg ...>...</svg>`,
  win: `<svg ...>...</svg>`,
  lose: `<svg ...>...</svg>`
};

// Check subscription
function hasActiveSubscription(user, category){
  if(category === "free") return true;
  if(!user.subscription || !user.expires) return false;
  if(user.subscription.toLowerCase() !== category.toLowerCase()) return false;
  return new Date(user.expires) > new Date();
}

async function renderPredictions(category){
  currentCategory = category;
  predictionsContainer.innerHTML = `<div class="loading-spinner"></div>`;

  try {
    const predictions = await getMatches();

    let filtered = predictions.filter(p => {
      const cat = (p.category || "").toLowerCase();
      if(user.subscription === "free") return cat === "free"; // free user only sees free
      return cat === category.toLowerCase();
    });

    filtered.sort((a,b) => new Date(b.date)-new Date(a.date));
    predictionsContainer.innerHTML = "";

    if(!filtered.length){
      predictionsContainer.innerHTML = "<div class='empty-msg'>No predictions available.</div>";
      return;
    }

    let lastDate = null;

    filtered.forEach(p => {
      const oddsValue = Number(p.odd || p.odds || 0);
      const matchDate = new Date(p.date);
      const dateString = matchDate.getDate().toString().padStart(2,'0') + "/" + matchDate.toLocaleString('default',{month:'short'}).toUpperCase() + "/" + matchDate.getFullYear();
      const statusIcon = statusIcons[p.status?.toLowerCase()] || statusIcons.pending;

      if(dateString !== lastDate){
        const dateHeader = document.createElement("div");
        dateHeader.className = "date-header";
        dateHeader.textContent = dateString;
        predictionsContainer.appendChild(dateHeader);
        lastDate = dateString;
      }

      const card = document.createElement("div");
      card.className = "prediction-card";

      // Locked logic: Free users or VIP without subscription
      const isVipCategory = ["safe","fixed"].includes((p.category||"").toLowerCase());
      const isPending = (p.status||"").toLowerCase() === "pending";
      const isLocked = (user.subscription==="free" && isVipCategory) || (isVipCategory && isPending && !hasActiveSubscription(user,p.category));

      card.innerHTML = `
        <div class="card-header">
          <span class="league">${p.league||"-"}</span>
          <span class="date">${matchDate.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</span>
        </div>
        <div class="teams-table">
          <table>
            <tr>
              <td class="team home">${p.homeTeam||"Home"}</td>
              <td class="vs">VS</td>
              <td class="team away">${p.awayTeam||"Away"}</td>
            </tr>
          </table>
        </div>
        <div class="prediction-box ${isLocked ? "locked" : ""}">
          <div class="prediction-left">
            <small class="prediction-label">Prediction</small>
            <div class="prediction-text">${isLocked ? "Subscribe to view" : p.prediction||"-"}</div>
          </div>
          <div class="prediction-right">
            ${statusIcon}
            <div class="odds">${isLocked ? "--" : oddsValue.toFixed(2)}</div>
          </div>
        </div>
      `;

      if(isLocked){
        card.addEventListener("click", ()=> window.location.href="/subscribe.html");
      }

      predictionsContainer.appendChild(card);
    });

  } catch(err){
    console.error(err);
    predictionsContainer.innerHTML = "<div class='error-msg'>Error loading predictions.</div>";
  }
}

// Sidebar & Bottom
sidebarItems.forEach(li => li.addEventListener("click",()=>{renderPredictions(li.dataset.category); sidebar.classList.remove("show");}));
bottomButtons.forEach(btn => btn.addEventListener("click",()=>renderPredictions(btn.dataset.category)));

renderPredictions(currentCategory);
