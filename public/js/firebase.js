import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const db = getFirestore();

export async function getMatches() {
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
}
