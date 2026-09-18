const API_BASE = "http://localhost:3000/api";

function getToken() {
  return localStorage.getItem("eco_local_token");
}

async function apiRequest(path, options = {}) {
  const token = getToken();

  const headers = {
    ...(options.headers || {})
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
    data = {};
  }

  return {
    response,
    data
  };
}

export async function getFiles() {
  try {
    const { response, data } = await apiRequest("/files");

    if (!response.ok || !data.ok) {
      return {
        ok: false,
        files: [],
        message: data.message || "Could not load files."
      };
    }

    return {
      ok: true,
      files: data.files || []
    };
  } catch (error) {
    console.error("ECO Files Error:", error);

    return {
      ok: false,
      files: [],
      message: "Unable to connect to ECO Backend."
    };
  }
}

export async function uploadFile(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const token = getToken();

    const headers = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}/files/upload`, {
      method: "POST",
      headers,
      body: formData
    });

    let data = {};

    try {
      data = await response.json();
    } catch {
      data = {};
    }

    return {
      ok: response.ok && data.ok,
      file: data.file || null,
      message: data.message || ""
    };
  } catch (error) {
    console.error("ECO File Upload Error:", error);

    return {
      ok: false,
      file: null,
      message: "Unable to connect to ECO Backend."
    };
  }
}

export async function deleteFile(fileId) {
  try {
    const { response, data } = await apiRequest(
      `/files/${encodeURIComponent(fileId)}`,
      {
        method: "DELETE"
      }
    );

    return {
      ok: response.ok && data.ok,
      message: data.message || ""
    };
  } catch (error) {
    console.error("ECO File Delete Error:", error);

    return {
      ok: false,
      message: "Unable to connect to ECO Backend."
    };
  }
}

export function getFileDownloadUrl(fileId) {
  const token = getToken();

  const url =
    `${API_BASE}/files/${encodeURIComponent(fileId)}/download`;

  return {
    url,
    token
  };
}
