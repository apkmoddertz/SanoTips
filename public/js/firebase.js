// public/js/firebase.js

// ------------------- Firebase Imports -------------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

// ------------------- Firebase Config -------------------
const firebaseConfig = {
  apiKey: "AIzaSyC0BSUvubGtHxeHZ_pnh776bzoGKGxXNbU",
  authDomain: "voltflow-35a0b.firebaseapp.com",
  projectId: "voltflow-35a0b",
  storageBucket: "voltflow-35a0b.firebasestorage.app",
  messagingSenderId: "241701625823",
  appId: "1:241701625823:web:d4d7d9362e0207e5a32e6a"
};

// ------------------- Initialize Firebase -------------------
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ------------------- Matches -------------------
export async function getMatches() {
  const querySnapshot = await getDocs(collection(db, "matches"));
  const matches = [];

  querySnapshot.forEach((doc) => {
    matches.push({
      id: doc.id,
      ...doc.data()
    });
  });

  return matches;
}

// ------------------- Authentication -------------------

// Register new user
export async function registerUser(email, password) {
  return await createUserWithEmailAndPassword(auth, email, password);
}

// Login existing user
export async function loginUser(email, password) {
  return await signInWithEmailAndPassword(auth, email, password);
}

// Logout user
export async function logoutUser() {
  return await signOut(auth);
}

// Get current logged-in user
export function getCurrentUser() {
  return auth.currentUser;
}

// Listen for auth state changes
export function onAuthChange(callback) {
  onAuthStateChanged(auth, callback);
}

// ------------------- Users in Firestore -------------------

// Add user info to Firestore (optional)
export async function addUserToFirestore(user) {
  try {
    const usersRef = collection(db, "users");
    await addDoc(usersRef, user);
  } catch (err) {
    console.error("Error adding user to Firestore:", err);
  }
}

// Fetch all users (admin)
export async function getUsers() {
  const querySnapshot = await getDocs(collection(db, "users"));
  const users = [];
  querySnapshot.forEach(doc => {
    users.push({ id: doc.id, ...doc.data() });
  });
  return users;
}
