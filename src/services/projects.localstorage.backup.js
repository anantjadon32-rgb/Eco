const ECO_PROJECTS_KEY = "eco_projects";

function getProjects() {
  try {
    return JSON.parse(localStorage.getItem(ECO_PROJECTS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveProjects(projects) {
  localStorage.setItem(ECO_PROJECTS_KEY, JSON.stringify(projects));
}

export function getUserProjects(userId) {
  return getProjects().filter(project => project.userId === userId);
}

export function createProject(userId, name, description = "") {
  const cleanName = name.trim();

  if (!cleanName) {
    return {
      ok: false,
      message: "Project name is required."
    };
  }

  const projects = getProjects();

  const project = {
    id: "eco_project_" + Date.now(),
    userId,
    name: cleanName,
    description: description.trim(),
    createdAt: new Date().toISOString()
  };

  projects.push(project);
  saveProjects(projects);

  return {
    ok: true,
    project
  };
}

export function deleteProject(userId, projectId) {
  const projects = getProjects();

  const updated = projects.filter(
    project => !(project.id === projectId && project.userId === userId)
  );

  saveProjects(updated);

  return updated;
}
