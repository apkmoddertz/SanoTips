// Path: public/js/admin.js
import { db, collection, addDoc, serverTimestamp } from './firebase.js';

const addMatchForm = document.getElementById('addMatchForm');

addMatchForm.addEventListener('submit', async e => {
  e.preventDefault();

  const data = {
    league: e.target.league.value,
    homeTeam: e.target.homeTeam.value,
    awayTeam: e.target.awayTeam.value,
    date: e.target.date.value,
    prediction: e.target.prediction.value,
    odds: parseFloat(e.target.odds.value),
    category: e.target.category.value,
    status: 'pending',
    createdBy: 'admin',
    createdAt: serverTimestamp()
  };

  try {
    await addDoc(collection(db, 'matches'), data);
    alert('Match added successfully!');
    addMatchForm.reset();
  } catch (err) {
    console.error(err);
    alert('Error adding match');
  }
});