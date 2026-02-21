import { db, auth } from "./firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const userDiv = document.getElementById("user-info");

auth.onAuthStateChanged(async user => {
  if (!user) return;
  
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    userDiv.innerHTML = "<p>User data not found!</p>";
    return;
  }

  const data = userSnap.data();
  
  const today = new Date();
  const expiryDate = new Date(data.expires);

  const isExpired = today > expiryDate;

  userDiv.innerHTML = `
    <h3>Welcome, ${user.email}</h3>
    <p>Subscription: ${data.subscription} (${data.plan})</p>
    <p>Status: ${isExpired ? "Expired" : data.status}</p>
    <p>Expires on: ${data.expires}</p>
    <p>Price: $${data.price}</p>
  `;
});