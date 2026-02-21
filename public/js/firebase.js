// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC0BSUvubGtHxeHZ_pnh776bzoGKGxXNbU",
  authDomain: "voltflow-35a0b.firebaseapp.com",
  projectId: "voltflow-35a0b",
  storageBucket: "voltflow-35a0b.appspot.com",
  messagingSenderId: "241701625823",
  appId: "1:241701625823:web:d4d7d9362e0207e5a32e6a",
  databaseURL: "https://voltflow-35a0b-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to get matches
export async function getMatches() {
  try {
    const querySnapshot = await getDocs(collection(db, "matches"));
    const matches = [];
    querySnapshot.forEach(doc => {
      matches.push({ id: doc.id, ...doc.data() });
    });
    return matches;
  } catch (err) {
    console.error("Error fetching matches:", err);
    return [];
  }
}
