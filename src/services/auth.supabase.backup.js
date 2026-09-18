import { supabase } from "./supabase.js";

export async function getUser() {
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  return {
    id: user.id,
    name:
      user.user_metadata?.name ||
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      "ECO User",
    email: user.email || "",
    createdAt: user.created_at
  };
}

export async function isLoggedIn() {
  const {
    data: { session }
  } = await supabase.auth.getSession();

  return !!session;
}

export async function signup(name, email, password) {
  if (!name || !email || !password) {
    return {
      ok: false,
      message: "Please fill all fields."
    };
  }

  const {
    data,
    error
  } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      data: {
        name: name.trim()
      }
    }
  });

  if (error) {
    return {
      ok: false,
      message: error.message
    };
  }

  if (!data.user) {
    return {
      ok: false,
      message: "Account could not be created."
    };
  }

  return {
    ok: true,
    user: {
      id: data.user.id,
      name: name.trim(),
      email: data.user.email || email.trim().toLowerCase(),
      createdAt: data.user.created_at
    }
  };
}

export async function login(email, password) {
  if (!email || !password) {
    return {
      ok: false,
      message: "Email and password are required."
    };
  }

  const {
    data,
    error
  } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password
  });

  if (error) {
    return {
      ok: false,
      message: error.message
    };
  }

  if (!data.user) {
    return {
      ok: false,
      message: "Login failed."
    };
  }

  return {
    ok: true,
    user: {
      id: data.user.id,
      name:
        data.user.user_metadata?.name ||
        data.user.email?.split("@")[0] ||
        "ECO User",
      email: data.user.email || "",
      createdAt: data.user.created_at
    }
  };
}

export async function logout() {
  const { error } = await supabase.auth.signOut();

  return {
    ok: !error,
    message: error?.message || ""
  };
}

export async function updateUser(updates) {
  const { data, error } = await supabase.auth.updateUser({
    data: updates
  });

  if (error || !data.user) {
    return null;
  }

  return {
    id: data.user.id,
    name:
      data.user.user_metadata?.name ||
      data.user.email?.split("@")[0] ||
      "ECO User",
    email: data.user.email || "",
    createdAt: data.user.created_at
  };
}
