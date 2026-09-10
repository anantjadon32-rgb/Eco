const ECO_AUTH_KEY = "eco_demo_user";
const ECO_SESSION_KEY = "eco_demo_session";

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(ECO_AUTH_KEY) || "null");
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  return localStorage.getItem(ECO_SESSION_KEY) === "true";
}

export function signup(name, email, password) {
  if (!name || !email || !password) {
    return { ok: false, message: "Please fill all fields." };
  }

  const user = {
    id: "eco_" + Date.now(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    createdAt: new Date().toISOString()
  };

  localStorage.setItem(ECO_AUTH_KEY, JSON.stringify(user));
  localStorage.setItem(ECO_SESSION_KEY, "true");

  return { ok: true, user };
}

export function login(email) {
  const user = getUser();

  if (!user) {
    return { ok: false, message: "No ECO ID found. Create an account first." };
  }

  if (user.email !== email.trim().toLowerCase()) {
    return { ok: false, message: "Email does not match the demo account." };
  }

  localStorage.setItem(ECO_SESSION_KEY, "true");

  return { ok: true, user };
}

export function logout() {
  localStorage.removeItem(ECO_SESSION_KEY);
}

export function updateUser(updates) {
  const current = getUser();

  if (!current) return null;

  const updated = {
    ...current,
    ...updates
  };

  localStorage.setItem(ECO_AUTH_KEY, JSON.stringify(updated));

  return updated;
}
