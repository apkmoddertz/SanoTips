// Firebase configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC0BSUvubGtHxeHZ_pnh776bzoGKGxXNbU",
  authDomain: "voltflow-35a0b.firebaseapp.com",
  databaseURL: "https://voltflow-35a0b-default-rtdb.firebaseio.com",
  projectId: "voltflow-35a0b",
  storageBucket: "voltflow-35a0b.appspot.com",
  messagingSenderId: "241701625823",
  appId: "1:241701625823:web:d4d7d9362e0207e5a32e6a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fetch matches from Firestore
export async function getMatches() {
  try {
    const snapshot = await getDocs(collection(db, "matches"));
    const matches = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      matches.push({
        id: doc.id,
        league: data.league || "",
        homeTeam: data.homeTeam || "",
        awayTeam: data.awayTeam || "",
        date: data.date instanceof Object && data.date.toDate ? data.date.toDate() : new Date(data.date),
        prediction: data.prediction || "",
        odds: data.odds || 0,
        category: (data.category || "free").toLowerCase(),
        status: data.status || "pending",
        analysis: data.analysis || ""
      });
    });
    return matches;
  } catch (err) {
    console.error("Error fetching matches:", err);
    return [];
  }
}
