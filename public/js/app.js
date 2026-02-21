// Path: public/js/app.js
import { db, collection, getDocs, query, orderBy, serverTimestamp } from './firebase.js';

const predictionsContainer = document.getElementById('predictions');

async function loadPredictions() {
  predictionsContainer.innerHTML = 'Loading...';

  try {
    const q = query(collection(db, 'matches'), orderBy('date', 'asc'));
    const snapshot = await getDocs(q);

    predictionsContainer.innerHTML = '';
    snapshot.forEach(doc => {
      const data = doc.data();
      const div = document.createElement('div');
      div.className = 'prediction-card';
      div.innerHTML = `
        <strong>${data.league}</strong>: ${data.homeTeam} VS ${data.awayTeam} <br>
        Prediction: ${data.prediction} | Odds: ${data.odds.toFixed(2)} | Status: ${data.status} <br>
        Date: ${new Date(data.date).toLocaleString()}
      `;
      predictionsContainer.appendChild(div);
    });
  } catch (err) {
    predictionsContainer.innerHTML = 'Error loading predictions';
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', loadPredictions);