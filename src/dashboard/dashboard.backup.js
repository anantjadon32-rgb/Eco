import { getUser, isLoggedIn, logout } from "../services/auth.js";

const user = getUser();

if (!isLoggedIn() || !user) {
  window.location.href = "/";
}

const app = document.querySelector("#app");

if (app) {
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
              <span>PROJECTS</span>
              <strong>0</strong>
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
    button.addEventListener("click", () => {
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
          <span>PROJECTS</span>
          <strong>0</strong>
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
        <span>PROJECTS</span>
        <h2>Your projects</h2>
        <p>Create and manage everything you build inside ECO.</p>

        <button class="eco-primary-action" id="newProjectBtn">
          + Create Project
        </button>

        <div class="eco-empty-state">
          <div class="eco-empty-icon">+</div>
          <h4>No projects yet</h4>
          <p>Create your first ECO project to get started.</p>
        </div>
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

  document
    .querySelectorAll("[data-page]")
    .forEach(button => {
      button.addEventListener("click", () => {
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
