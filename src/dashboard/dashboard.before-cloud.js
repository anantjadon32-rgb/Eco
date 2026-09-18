import { getUser, isLoggedIn, logout } from "../services/auth.js";
import { getUserProjects, createProject, deleteProject } from "../services/projects.js";


let user = null;

async function initDashboard() {
  const loggedIn = await isLoggedIn();
  user = await getUser();

  if (!loggedIn || !user) {
    window.location.href = "/";
    return;
  }

  const app = document.querySelector("#app");

  if (!app) return;

  renderDashboard(app);
}

function renderDashboard(app) {
  app.innerHTML = `
    <div class="eco-dashboard">

      <aside class="eco-sidebar">
        <div class="eco-side-brand">
          <div class="eco-mini-logo">E</div>
          <span>ECO</span>
        </div>

        <nav class="eco-side-nav">
          <button class="active" data-page="overview">Overview</button>
          <button data-page="projects">Projects</button>
          <button data-page="ai">ECO AI</button>
          <button data-page="cloud">ECO Cloud</button>
          <button data-page="developers">Developers</button>
          <button data-page="settings">Settings</button>
        </nav>

        <button class="eco-logout" id="logoutBtn">
          Logout
        </button>
      </aside>

      <main class="eco-dashboard-main">

        <header class="eco-dashboard-header">
          <div>
            <div class="eco-eyebrow">ECO WORKSPACE</div>
            <h1>Welcome back, ${user.name.split(" ")[0]}.</h1>
            <p>Your ecosystem starts here.</p>
          </div>

          <div class="eco-user-chip">
            <div class="eco-avatar">
              ${user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <strong>${user.name}</strong>
              <small>${user.email}</small>
            </div>
          </div>
        </header>

        <section class="eco-dashboard-content" id="dashboardContent">

          <div class="eco-stats-grid">
            <div class="eco-stat-card">
              <span>PROJECTS</span><strong id="projectsStat">0</strong>
              <small>No projects yet</small>
            </div>

            <div class="eco-stat-card">
              <span>AI USAGE</span>
              <strong>0</strong>
              <small>Demo environment</small>
            </div>

            <div class="eco-stat-card">
              <span>CLOUD</span>
              <strong>0 GB</strong>
              <small>Storage used</small>
            </div>

            <div class="eco-stat-card">
              <span>API KEYS</span>
              <strong>0</strong>
              <small>No keys created</small>
            </div>
          </div>

          <div class="eco-dashboard-grid">

            <section class="eco-panel eco-hero-panel">
              <div class="eco-panel-top">
                <span class="eco-live-dot"></span>
                ECO SYSTEM
              </div>

              <h2>Build something<br><span>extraordinary.</span></h2>

              <p>
                Create projects, explore ECO AI, connect APIs,
                deploy applications and build inside one ecosystem.
              </p>

              <button class="eco-primary-action" data-page="projects">
                Create Project →
              </button>
            </section>

            <section class="eco-panel">
              <div class="eco-panel-heading">
                <div>
                  <span>QUICK ACCESS</span>
                  <h3>Launch</h3>
                </div>
              </div>

              <div class="eco-launch-grid">

                <button class="eco-launch-card" data-page="ai">
                  <b>AI</b>
                  <span>ECO AI</span>
                  <small>Chat, Code & Create</small>
                </button>

                <button class="eco-launch-card" data-page="cloud">
                  <b>☁</b>
                  <span>ECO Cloud</span>
                  <small>Projects & deployment</small>
                </button>

                <button class="eco-launch-card" data-page="developers">
                  <b>⌘</b>
                  <span>Developer</span>
                  <small>APIs & SDKs</small>
                </button>

                <button class="eco-launch-card" data-page="projects">
                  <b>+</b>
                  <span>New Project</span>
                  <small>Start building</small>
                </button>

              </div>
            </section>

          </div>

          <section class="eco-panel eco-activity-panel">
            <div class="eco-panel-heading">
              <div>
                <span>ACTIVITY</span>
                <h3>Recent activity</h3>
              </div>
            </div>

            <div class="eco-empty-state">
              <div class="eco-empty-icon">◎</div>
              <h4>No activity yet</h4>
              <p>
                Your projects, AI sessions and developer activity
                will appear here.
              </p>
            </div>
          </section>

        </section>

      </main>
    </div>
  `;

  const logoutButton = document.querySelector("#logoutBtn");

  logoutButton?.addEventListener("click", () => {
    logout();
    window.location.href = "/";
  });

  const navigationButtons = document.querySelectorAll("[data-page]");

  navigationButtons.forEach(button => {
    button.addEventListener("click", async () => {
      const page = button.dataset.page;

      navigationButtons.forEach(item => {
        if (item.closest(".eco-side-nav")) {
          item.classList.toggle(
            "active",
            item.dataset.page === page
          );
        }
      });

      loadPage(page);
    });
  });
}

function loadPage(page) {
  const content = document.querySelector("#dashboardContent");

  if (!content) return;

  const pages = {

    overview: `
      <div class="eco-stats-grid">
        <div class="eco-stat-card">
          <span>PROJECTS</span><strong id="projectsStat">0</strong>
          <small>No projects yet</small>
        </div>
        <div class="eco-stat-card">
          <span>AI USAGE</span>
          <strong>0</strong>
          <small>Demo environment</small>
        </div>
        <div class="eco-stat-card">
          <span>CLOUD</span>
          <strong>0 GB</strong>
          <small>Storage used</small>
        </div>
        <div class="eco-stat-card">
          <span>API KEYS</span>
          <strong>0</strong>
          <small>No keys created</small>
        </div>
      </div>

      <section class="eco-panel eco-page-panel">
        <span>OVERVIEW</span>
        <h2>Your ECO workspace</h2>
        <p>
          This is the central control layer for your ECO ecosystem.
          More services will connect here as the platform grows.
        </p>
      </section>
    `,

    projects: `
      <section class="eco-panel eco-page-panel">
        <div class="eco-page-heading">
          <div>
            <span>PROJECTS</span>
            <h2>Your projects</h2>
            <p>Create and manage everything you build inside ECO.</p>
          </div>

          <button class="eco-primary-action" id="newProjectBtn">
            + Create Project
          </button>
        </div>

        <div id="projectsContainer"></div>
      </section>
    `,

    ai: `
      <section class="eco-panel eco-page-panel">
        <span>ECO AI</span>
        <h2>Your AI workspace</h2>
        <p>
          Chat, code, create, research and build with ECO AI.
        </p>

        <div class="eco-feature-list">
          <div>✦ Chat</div>
          <div>⌘ Code</div>
          <div>◉ Vision</div>
          <div>▣ Files</div>
          <div>✧ Research</div>
          <div>◆ Create</div>
        </div>

        <button class="eco-primary-action">
          Launch ECO AI →
        </button>
      </section>
    `,

    cloud: `
      <section class="eco-panel eco-page-panel">
        <span>ECO CLOUD</span>
        <h2>Cloud workspace</h2>
        <p>
          Deploy applications, manage projects and use ECO infrastructure.
        </p>

        <div class="eco-feature-list">
          <div>☁ Storage</div>
          <div>⚡ Deployments</div>
          <div>◈ Projects</div>
          <div>▣ Environments</div>
        </div>

        <button class="eco-primary-action">
          Open Cloud →
        </button>
      </section>
    `,

    developers: `
      <section class="eco-panel eco-page-panel">
        <span>DEVELOPER PLATFORM</span>
        <h2>Build with ECO</h2>
        <p>
          APIs, SDKs, authentication and developer tools will live here.
        </p>

        <div class="eco-code-box">
          <div>const eco = require("eco");</div>
          <div>eco.connect();</div>
          <div>eco.ai.generate();</div>
        </div>

        <button class="eco-primary-action">
          Developer Console →
        </button>
      </section>
    `,

    settings: `
      <section class="eco-panel eco-page-panel">
        <span>ACCOUNT</span>
        <h2>Settings</h2>
        <p>Manage your ECO ID and workspace preferences.</p>

        <div class="eco-settings-row">
          <strong>Name</strong>
          <span>${user.name}</span>
        </div>

        <div class="eco-settings-row">
          <strong>Email</strong>
          <span>${user.email}</span>
        </div>

        <div class="eco-settings-row">
          <strong>Account ID</strong>
          <span>${user.id}</span>
        </div>
      </section>
    `
  };

  content.innerHTML = pages[page] || pages.overview;

    if (page === "projects") {
      renderProjects();
    }

  document
    .querySelectorAll("[data-page]")
    .forEach(button => {
      button.addEventListener("click", async () => {
        const target = button.dataset.page;

        document
          .querySelectorAll(".eco-side-nav [data-page]")
          .forEach(item => {
            item.classList.toggle(
              "active",
              item.dataset.page === target
            );
          });

        loadPage(target);
      });
    });
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function renderProjects() {
  const container = document.querySelector("#projectsContainer");
  if (!container) return;

  const projects = await getUserProjects(user.id);

  if (!projects.length) {
    container.innerHTML = `
      <div class="eco-empty-state">
        <div class="eco-empty-icon">+</div>
        <h4>No projects yet</h4>
        <p>Create your first ECO project to get started.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="eco-project-grid">
      ${projects.map(project => `
        <article class="eco-project-card">

          <div class="eco-project-top">
            <div class="eco-project-icon">E</div>
            <span class="eco-project-status">ACTIVE</span>
          </div>

          <h3>${escapeHtml(project.name)}</h3>

          <p>
            ${escapeHtml(project.description || "No description added.")}
          </p>

          <div class="eco-project-meta">
            Created ${new Date(project.createdAt).toLocaleDateString()}
          </div>

          <div class="eco-project-actions">

            <button
              class="eco-secondary-action open-project-btn"
              data-project-id="${project.id}">
              Open
            </button>

            <button
              class="eco-danger-action delete-project-btn"
              data-project-id="${project.id}">
              Delete
            </button>

          </div>

        </article>
      `).join("")}
    </div>
  `;

  document.querySelectorAll(".delete-project-btn").forEach(button => {
    button.addEventListener("click", async () => {

      const projectId = button.dataset.projectId;
      const project = projects.find(item => item.id === projectId);

      if (!project) return;

      if (!confirm(`Delete "${project.name}"?`)) return;

      const result = await deleteProject(user.id, projectId);

        if (!result.ok) {
          alert(result.message || "Could not delete project.");
          return;
        }

      renderProjects();
      updateDashboardStats();
    });
  });

  document.querySelectorAll(".open-project-btn").forEach(button => {
    button.addEventListener("click", async () => {

      const projectId = button.dataset.projectId;
      const project = projects.find(item => item.id === projectId);

      if (!project) return;

      alert(
        `ECO Project\n\n${project.name}\n\n${
          project.description || "No description added."
        }\n\nProject ID: ${project.id}`
      );
    });
  });
}

async function openCreateProjectModal() {

  if (document.querySelector("#projectModal")) return;

  const modal = document.createElement("div");

  modal.id = "projectModal";
  modal.className = "eco-modal-backdrop";

  modal.innerHTML = `
    <div class="eco-modal">

      <button
        class="eco-modal-close"
        id="closeProjectModal">
        ×
      </button>

      <span>NEW PROJECT</span>

      <h2>Create an ECO project</h2>

      <p>
        Start something new inside your ECO workspace.
      </p>

      <form id="createProjectForm">

        <label>
          Project name

          <input
            id="projectName"
            type="text"
            placeholder="My first project"
            maxlength="60"
            required
            autocomplete="off">
        </label>

        <label>
          Description

          <textarea
            id="projectDescription"
            placeholder="What are you building?"
            maxlength="200"
            rows="4"></textarea>
        </label>

        <div id="projectFormMessage"></div>

        <button
          class="eco-primary-action"
          type="submit">
          Create Project
        </button>

      </form>

    </div>
  `;

  document.body.appendChild(modal);

  const form = document.querySelector("#createProjectForm");
  const closeButton = document.querySelector("#closeProjectModal");
  const nameInput = document.querySelector("#projectName");
  const message = document.querySelector("#projectFormMessage");

  nameInput.focus();

  closeButton.addEventListener("click", () => {
    modal.remove();
  });

  modal.addEventListener("click", event => {
    if (event.target === modal) {
      modal.remove();
    }
  });

  form.addEventListener("submit", async event => {

    event.preventDefault();

    const name =
      document.querySelector("#projectName").value;

    const description =
      document.querySelector("#projectDescription").value;

    const result = await createProject(
      user.id,
      name,
      description
    );

    if (!result.ok) {

      message.textContent = result.message;
      message.className = "eco-form-error";

      return;
    }

    modal.remove();

    renderProjects();
    updateDashboardStats();
  });
}

async function updateDashboardStats() {

  const projects = await getUserProjects(user.id);

  const projectStat =
    document.querySelector("#projectsStat");

  if (projectStat) {
    projectStat.textContent = projects.length;
  }
}

document.addEventListener("click", event => {

  const createButton =
    event.target.closest("#newProjectBtn");

  if (createButton) {
    openCreateProjectModal();
  }

});






initDashboard();






