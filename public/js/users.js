// Simplified auth check
export const currentUser = {
  email: "user@gmail.com", // replace with real Firebase auth
  role: "user",            // 'admin' can edit
  subscription: "safe",
  status: "active",
  expires: "2026-03-01"
};

export function isAdmin() {
  return currentUser.role === "admin";
}

export function hasAccess(category) {
  if (category === "free") return true;
  if (category === "safe") return ["safe", "fixed"].includes(currentUser.subscription) && currentUser.status === "active";
  if (category === "fixed") return currentUser.subscription === "fixed" && currentUser.status === "active";
  return false;
}
