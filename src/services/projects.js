const API_BASE = "http://localhost:3000/api";

function getToken() {
  return localStorage.getItem("eco_local_token");
}

async function apiRequest(path, options = {}) {
  const token = getToken();

  const headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json"
  };

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

export async function getUserProjects(userId) {
  try {
    const { response, data } = await apiRequest("/projects");

    if (!response.ok || !data.ok) {
      console.error("ECO Projects Error:", data.message);
      return [];
    }

    return data.projects || [];
  } catch (error) {
    console.error("ECO Projects Error:", error);
    return [];
  }
}

export async function createProject(userId, name, description = "") {
  const cleanName = name.trim();

  if (!cleanName) {
    return {
      ok: false,
      message: "Project name is required."
    };
  }

  try {
    const { response, data } = await apiRequest("/projects", {
      method: "POST",
      body: JSON.stringify({
        name: cleanName,
        description: description.trim()
      })
    });

    if (!response.ok || !data.ok) {
      return {
        ok: false,
        message: data.message || "Could not create project."
      };
    }

    return {
      ok: true,
      project: data.project
    };
  } catch (error) {
    console.error("ECO Create Project Error:", error);

    return {
      ok: false,
      message: "Unable to connect to ECO Backend."
    };
  }
}

export async function deleteProject(userId, projectId) {
  try {
    const { response, data } = await apiRequest(
      `/projects/${encodeURIComponent(projectId)}`,
      {
        method: "DELETE"
      }
    );

    if (!response.ok || !data.ok) {
      return {
        ok: false,
        message: data.message || "Could not delete project."
      };
    }

    return {
      ok: true
    };
  } catch (error) {
    console.error("ECO Delete Project Error:", error);

    return {
      ok: false,
      message: "Unable to connect to ECO Backend."
    };
  }
}
