const API_BASE = "http://localhost:3000/api";

const TOKEN_KEY = "eco_local_token";
const USER_KEY = "eco_local_user";

function saveAuth(data) {
  if (data?.token) {
    localStorage.setItem(TOKEN_KEY, data.token);
  }

  if (data?.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  }
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function normalizeUser(user) {
  if (!user) return null;

  return {
    id: user.id,
    name: user.name || user.email?.split("@")[0] || "ECO User",
    email: user.email || "",
    createdAt: user.createdAt || user.created_at || ""
  };
}

async function apiRequest(path, options = {}) {
  const headers = {
    ...(options.headers || {})
  };

  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const token = getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {
      ok: false,
      message: "Invalid server response."
    };
  }

  return {
    response,
    data
  };
}

export async function getUser() {
  const token = getToken();

  if (!token) {
    return null;
  }

  try {
    const { response, data } = await apiRequest("/auth/me");

    if (!response.ok || !data.ok || !data.user) {
      clearAuth();
      return null;
    }

    const user = normalizeUser(data.user);

    localStorage.setItem(USER_KEY, JSON.stringify(user));

    return user;
  } catch (error) {
    console.error("ECO Auth /me Error:", error);
    return null;
  }
}

export async function isLoggedIn() {
  const user = await getUser();
  return !!user;
}

export async function signup(name, email, password) {
  if (!name || !email || !password) {
    return {
      ok: false,
      message: "Please fill all fields."
    };
  }

  try {
    const { response, data } = await apiRequest("/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password
      })
    });

    if (!response.ok || !data.ok) {
      return {
        ok: false,
        message: data.message || "Account could not be created."
      };
    }

    const user = normalizeUser(data.user);

    saveAuth({
      token: data.token,
      user
    });

    return {
      ok: true,
      user
    };
  } catch (error) {
    console.error("ECO Signup Error:", error);

    return {
      ok: false,
      message: "Unable to connect to ECO Backend."
    };
  }
}

export async function login(email, password) {
  if (!email || !password) {
    return {
      ok: false,
      message: "Email and password are required."
    };
  }

  try {
    const { response, data } = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        password
      })
    });

    if (!response.ok || !data.ok) {
      return {
        ok: false,
        message: data.message || "Login failed."
      };
    }

    const user = normalizeUser(data.user);

    saveAuth({
      token: data.token,
      user
    });

    return {
      ok: true,
      user
    };
  } catch (error) {
    console.error("ECO Login Error:", error);

    return {
      ok: false,
      message: "Unable to connect to ECO Backend."
    };
  }
}

export async function logout() {
  const token = getToken();

  if (!token) {
    clearAuth();

    return {
      ok: true,
      message: "Logged out successfully."
    };
  }

  try {
    const { response, data } = await apiRequest("/auth/logout", {
      method: "POST"
    });

    clearAuth();

    return {
      ok: response.ok && data.ok,
      message: data.message || ""
    };
  } catch (error) {
    console.error("ECO Logout Error:", error);

    clearAuth();

    return {
      ok: true,
      message: "Logged out locally."
    };
  }
}

export async function updateUser(updates) {
  const currentUser = await getUser();

  if (!currentUser) {
    return null;
  }

  const updatedUser = {
    ...currentUser,
    ...updates
  };

  localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));

  return updatedUser;
}

export function getAuthToken() {
  return getToken();
}
