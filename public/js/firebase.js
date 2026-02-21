// Firebase config
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, getDocs, serverTimestamp, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC0BSUvubGtHxeHZ_pnh776bzoGKGxXNbU",
  authDomain: "voltflow-35a0b.firebaseapp.com",
  databaseURL: "https://voltflow-35a0b-default-rtdb.firebaseio.com",
  projectId: "voltflow-35a0b",
  storageBucket: "voltflow-35a0b.appspot.com",
  messagingSenderId: "241701625823",
  appId: "1:241701625823:web:d4d7d9362e0207e5a32e6a"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Fetch all predictions
export async function getPredictions() {
  const querySnapshot = await getDocs(collection(db, "matches"));
  const data = [];
  querySnapshot.forEach(doc => {
    data.push({ id: doc.id, ...doc.data() });
  });
  return data;
}

// Add prediction (admin only)
export async function addPrediction(pred) {
  pred.createdAt = serverTimestamp();
  await addDoc(collection(db, "matches"), pred);
}
