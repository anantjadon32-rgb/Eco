import { signup, login, logout, getUser, isLoggedIn, updateUser } from "./services/auth.js";
import { getUserProjects } from "./services/projects.js";

const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach((el) => observer.observe(el));

/* CORE PARALLAX */
const core = document.querySelector(".core-stage");

if (core) {
  window.addEventListener("pointermove", (e) => {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;

    core.style.transform =
      `translate3d(${x * 8}px, ${y * 6}px, 0)`;
  }, { passive: true });
}

/* MOBILE MENU */
const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav");

if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    nav.classList.toggle("mobile-open");
    menuBtn.setAttribute(
      "aria-expanded",
      nav.classList.contains("mobile-open") ? "true" : "false"
    );
  });
}

/* SMOOTH NAVIGATION */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const target = document.querySelector(link.getAttribute("href"));

    if (target) {
      e.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      nav?.classList.remove("mobile-open");
    }
  });
});

/* =========================================================
   ECO ID
========================================================= */

function createEcoIdStyles() {
  if (document.querySelector("#eco-id-styles")) return;

  const style = document.createElement("style");
  style.id = "eco-id-styles";

  style.textContent = `
    .eco-id-btn {
      display:inline-flex;
      align-items:center;
      gap:9px;
      border:1px solid rgba(255,255,255,.12);
      background:rgba(255,255,255,.035);
      color:#fff;
      padding:10px 15px;
      border-radius:999px;
      cursor:pointer;
      font:inherit;
      transition:.25s ease;
    }

    .eco-id-btn:hover {
      border-color:rgba(77,163,255,.55);
      background:rgba(77,163,255,.08);
      transform:translateY(-1px);
    }

    .eco-id-dot {
      width:8px;
      height:8px;
      border-radius:50%;
      background:#4da3ff;
      box-shadow:0 0 14px #4da3ff;
    }

    .eco-overlay {
      position:fixed;
      inset:0;
      z-index:9999;
      display:flex;
      align-items:center;
      justify-content:center;
      padding:20px;
      background:rgba(0,0,0,.72);
      backdrop-filter:blur(18px);
      -webkit-backdrop-filter:blur(18px);
      opacity:0;
      pointer-events:none;
      transition:.25s ease;
    }

    .eco-overlay.open {
      opacity:1;
      pointer-events:auto;
    }

    .eco-auth {
      width:min(440px,100%);
      position:relative;
      padding:34px;
      border:1px solid rgba(255,255,255,.12);
      border-radius:28px;
      background:
        radial-gradient(circle at 50% 0%,rgba(77,163,255,.14),transparent 42%),
        linear-gradient(145deg,rgba(18,20,25,.97),rgba(6,8,12,.98));
      box-shadow:
        0 30px 100px rgba(0,0,0,.65),
        0 0 70px rgba(77,163,255,.08);
      transform:translateY(16px) scale(.98);
      transition:.3s ease;
    }

    .eco-overlay.open .eco-auth {
      transform:translateY(0) scale(1);
    }

    .eco-close {
      position:absolute;
      top:16px;
      right:16px;
      width:36px;
      height:36px;
      border-radius:50%;
      border:1px solid rgba(255,255,255,.1);
      background:rgba(255,255,255,.04);
      color:#fff;
      cursor:pointer;
      font-size:20px;
    }

    .eco-auth-brand {
      display:flex;
      align-items:center;
      gap:12px;
      margin-bottom:25px;
    }

    .eco-auth-mark {
      width:42px;
      height:42px;
      display:grid;
      place-items:center;
      border-radius:13px;
      background:#fff;
      color:#05070a;
      font-weight:800;
      box-shadow:0 0 30px rgba(77,163,255,.25);
    }

    .eco-auth-brand strong {
      font-size:18px;
      letter-spacing:.08em;
    }

    .eco-auth-eyebrow {
      color:#4da3ff;
      font-size:11px;
      font-weight:700;
      letter-spacing:.18em;
      margin-bottom:9px;
    }

    .eco-auth h2 {
      margin:0 0 9px;
      font-size:32px;
      letter-spacing:-.04em;
    }

    .eco-auth-sub {
      margin:0 0 24px;
      color:rgba(255,255,255,.58);
      line-height:1.6;
      font-size:14px;
    }

    .eco-auth-tabs {
      display:grid;
      grid-template-columns:1fr 1fr;
      padding:4px;
      border-radius:14px;
      background:rgba(255,255,255,.04);
      margin-bottom:22px;
    }

    .eco-auth-tabs button {
      border:0;
      background:transparent;
      color:rgba(255,255,255,.5);
      padding:11px;
      border-radius:10px;
      cursor:pointer;
      font:inherit;
      font-weight:600;
    }

    .eco-auth-tabs button.active {
      background:rgba(255,255,255,.1);
      color:#fff;
    }

    .eco-field {
      margin-bottom:15px;
    }

    .eco-field label {
      display:block;
      margin-bottom:7px;
      color:rgba(255,255,255,.68);
      font-size:12px;
      font-weight:600;
    }

    .eco-field input {
      width:100%;
      box-sizing:border-box;
      border:1px solid rgba(255,255,255,.1);
      border-radius:13px;
      background:rgba(255,255,255,.045);
      color:#fff;
      padding:13px 14px;
      outline:none;
      font:inherit;
      transition:.2s ease;
    }

    .eco-field input:focus {
      border-color:rgba(77,163,255,.7);
      box-shadow:0 0 0 3px rgba(77,163,255,.09);
    }

    .eco-submit {
      width:100%;
      margin-top:6px;
      border:0;
      border-radius:13px;
      padding:14px;
      background:#fff;
      color:#05070a;
      font:inherit;
      font-weight:800;
      cursor:pointer;
      transition:.2s ease;
    }

    .eco-submit:hover {
      transform:translateY(-1px);
      box-shadow:0 12px 35px rgba(255,255,255,.12);
    }

    .eco-message {
      min-height:20px;
      margin-top:13px;
      color:#4da3ff;
      font-size:12px;
      text-align:center;
    }

    .eco-profile {
      text-align:center;
    }

    .eco-avatar {
      width:78px;
      height:78px;
      display:grid;
      place-items:center;
      margin:0 auto 18px;
      border-radius:50%;
      background:
        radial-gradient(circle at 35% 25%,#fff,rgba(77,163,255,.8) 25%,#0a111c 70%);
      color:#fff;
      font-size:28px;
      font-weight:800;
      box-shadow:0 0 45px rgba(77,163,255,.2);
    }

    .eco-profile h2 {
      margin-bottom:5px;
    }

    .eco-profile-email {
      color:rgba(255,255,255,.48);
      font-size:13px;
      margin-bottom:25px;
    }

    .eco-profile-grid {
      display:grid;
      grid-template-columns:repeat(3,1fr);
      gap:9px;
      margin-bottom:22px;
    }

    .eco-profile-stat {
      padding:14px 8px;
      border:1px solid rgba(255,255,255,.08);
      border-radius:13px;
      background:rgba(255,255,255,.025);
    }

    .eco-profile-stat strong {
      display:block;
      font-size:18px;
    }

    .eco-profile-stat span {
      display:block;
      margin-top:4px;
      font-size:9px;
      color:rgba(255,255,255,.4);
      letter-spacing:.12em;
    }

    .eco-logout {
      width:100%;
      padding:12px;
      border-radius:12px;
      border:1px solid rgba(255,255,255,.12);
      background:transparent;
      color:#fff;
      cursor:pointer;
      font:inherit;
    }

    @media(max-width:700px) {
      .eco-auth {
        padding:27px 20px;
        border-radius:22px;
      }

      .eco-auth h2 {
        font-size:27px;
      }

      .eco-profile-grid {
        grid-template-columns:1fr 1fr 1fr;
      }
    }
  `;

  document.head.appendChild(style);
}

createEcoIdStyles();

function openEcoAuth(mode = "login") {
  let overlay = document.querySelector("#eco-auth-overlay");

  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "eco-auth-overlay";
    overlay.className = "eco-overlay";

    overlay.innerHTML = `
      <div class="eco-auth" role="dialog" aria-modal="true">
        <button class="eco-close" aria-label="Close">×</button>

        <div class="eco-auth-brand">
          <div class="eco-auth-mark">E</div>
          <strong>ECO ID</strong>
        </div>

        <div id="eco-auth-content"></div>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.classList.remove("open");
    });

    overlay.querySelector(".eco-close").addEventListener("click", () => {
      overlay.classList.remove("open");
    });
  }

  renderEcoAuth(mode);
  requestAnimationFrame(() => overlay.classList.add("open"));
}

function renderEcoAuth(mode) {
  const overlay = document.querySelector("#eco-auth-overlay");
  const content = document.querySelector("#eco-auth-content");

  if (!overlay || !content) return;

  if (isLoggedIn() && getUser()) {
    const user = getUser();
    const projectCount = getUserProjects(user.id).length;

    content.innerHTML = `
      <div class="eco-profile">
        <div class="eco-avatar">
          ${escapeHtml((user.name || "E").charAt(0).toUpperCase())}
        </div>

        <div class="eco-auth-eyebrow">ECO ID ACTIVE</div>

        <h2>${escapeHtml(user.name)}</h2>

        <div class="eco-profile-email">
          ${escapeHtml(user.email)}
        </div>

        <div class="eco-profile-grid">
          <div class="eco-profile-stat">
            <strong id="eco-profile-project-count">${projectCount}</strong>
              <span>PROJECTS</span>
          </div>

          <div class="eco-profile-stat">
            <strong>0</strong>
            <span>APPS</span>
          </div>

          <div class="eco-profile-stat">
            <strong>0</strong>
            <span>API KEYS</span>
          </div>
        </div>

        <button class="eco-dashboard-btn" id="eco-dashboard-btn">Open ECO Workspace →</button><button class="eco-logout" id="eco-logout">
          Log out of ECO ID
        </button>
      </div>
    `;

    document.querySelector("#eco-dashboard-btn").addEventListener("click", () => {
  window.location.href = "/dashboard/";
});
document.querySelector("#eco-logout").addEventListener("click", () => {
      logout();
      renderEcoAuth("login");
      updateEcoIdButton();
    });

    return;
  }

  const isSignup = mode === "signup";

  content.innerHTML = `
    <div class="eco-auth-eyebrow">ECO ID</div>

    <h2>${isSignup ? "Create your ECO ID." : "Welcome back."}</h2>

    <p class="eco-auth-sub">
      ${isSignup
        ? "Create your identity for the ECO ecosystem."
        : "Sign in to your ECO ecosystem identity."}
    </p>

    <div class="eco-auth-tabs">
      <button class="${!isSignup ? "active" : ""}" id="eco-login-tab">
        Login
      </button>

      <button class="${isSignup ? "active" : ""}" id="eco-signup-tab">
        Sign Up
      </button>
    </div>

    <form id="eco-auth-form">

      ${isSignup ? `
        <div class="eco-field">
          <label for="eco-name">Name</label>
          <input
            id="eco-name"
            type="text"
            autocomplete="name"
            placeholder="Your name"
            required
          />
        </div>
      ` : ""}

      <div class="eco-field">
        <label for="eco-email">Email</label>
        <input
          id="eco-email"
          type="email"
          autocomplete="email"
          placeholder="you@example.com"
          required
        />
      </div>

      <div class="eco-field">
        <label for="eco-password">Password</label>
        <input
          id="eco-password"
          type="password"
          autocomplete="${isSignup ? "new-password" : "current-password"}"
          placeholder="Demo password"
          required
        />
      </div>

      <button class="eco-submit" type="submit">
        ${isSignup ? "Create ECO ID" : "Continue"}
      </button>

      <div class="eco-message" id="eco-auth-message"></div>
    </form>
  `;

  document.querySelector("#eco-login-tab").addEventListener("click", () => {
    renderEcoAuth("login");
  });

  document.querySelector("#eco-signup-tab").addEventListener("click", () => {
    renderEcoAuth("signup");
  });

  document.querySelector("#eco-auth-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.querySelector("#eco-email").value;
    const password = document.querySelector("#eco-password").value;
    const message = document.querySelector("#eco-auth-message");

    let result;

    if (isSignup) {
      const name = document.querySelector("#eco-name").value;

      result = signup(name, email, password);

      if (result.ok) {
        message.textContent = "ECO ID created.";
        updateEcoIdButton();

        setTimeout(() => {
          renderEcoAuth("profile");
        }, 350);
      }
    } else {
      result = login(email);

      if (result.ok) {
        message.textContent = "Login successful.";
        updateEcoIdButton();

        setTimeout(() => {
          renderEcoAuth("profile");
        }, 350);
      }
    }

    if (!result.ok) {
      message.textContent = result.message;
    }
  });
}

function updateEcoIdButton() {
  const button = document.querySelector("#eco-id-trigger");

  if (!button) return;

  const user = getUser();
    const projectCount = getUserProjects(user.id).length;

  if (isLoggedIn() && user) {
    button.innerHTML = `
      <span class="eco-id-dot"></span>
      ${escapeHtml(user.name.split(" ")[0])}
    `;
  } else {
    button.innerHTML = `
      <span class="eco-id-dot"></span>
      ECO ID
    `;
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* ADD ECO ID BUTTON */
const navActions = document.querySelector(".nav-actions");

if (navActions && !document.querySelector("#eco-id-trigger")) {
  const ecoIdButton = document.createElement("button");

  ecoIdButton.id = "eco-id-trigger";
  ecoIdButton.className = "eco-id-btn";
  ecoIdButton.type = "button";

  navActions.prepend(ecoIdButton);

  ecoIdButton.addEventListener("click", () => {
    openEcoAuth(isLoggedIn() ? "profile" : "login");
  });

  updateEcoIdButton();
}

/* =========================================================
   SEARCH
========================================================= */

function createSearch() {
  const searchButton = document.querySelector(".icon-btn");

  if (!searchButton) return;

  searchButton.addEventListener("click", () => {
    if (document.querySelector("#eco-search-overlay")) return;

    const overlay = document.createElement("div");

    overlay.id = "eco-search-overlay";
    overlay.className = "eco-overlay";

    overlay.innerHTML = `
      <div class="eco-auth">
        <button class="eco-close" aria-label="Close">×</button>

        <div class="eco-auth-eyebrow">ECO SEARCH</div>
        <h2>Explore ECO.</h2>

        <p class="eco-auth-sub">
          Search products, platform, vision and roadmap.
        </p>

        <div class="eco-field">
          <input
            id="eco-search-input"
            type="search"
            placeholder="Search ECO..."
            autofocus
          />
        </div>

        <div id="eco-search-results"></div>
      </div>
    `;

    document.body.appendChild(overlay);

    requestAnimationFrame(() => overlay.classList.add("open"));

    const input = overlay.querySelector("#eco-search-input");
    const results = overlay.querySelector("#eco-search-results");

    const items = [
      ["ECO AI", "platform", "Intelligence for everything."],
      ["ECO Software", "ecosystem", "Tools for building and creating."],
      ["ECO Apps", "ecosystem", "Connected everyday experiences."],
      ["ECO Games", "ecosystem", "Interactive worlds."],
      ["ECO Web", "ecosystem", "A new internet layer."],
      ["ECO Cloud", "ecosystem", "Infrastructure for ECO."],
      ["Developer Platform", "developers", "API, SDK, Auth and Cloud."],
      ["ECO ID", "identity", "One identity across ECO."],
      ["Vision", "vision", "Evolution, Creation, Opportunity."],
      ["Roadmap", "roadmap", "The road ahead."]
    ];

    function renderResults(query = "") {
      const q = query.toLowerCase().trim();

      const filtered = items.filter(item =>
        item.join(" ").toLowerCase().includes(q)
      );

      results.innerHTML = filtered.length
        ? filtered.map(item => `
            <button
              class="eco-search-result"
              data-target="#${item[1]}"
              style="
                width:100%;
                text-align:left;
                display:block;
                padding:13px;
                margin:6px 0;
                border:1px solid rgba(255,255,255,.08);
                border-radius:12px;
                background:rgba(255,255,255,.025);
                color:#fff;
                cursor:pointer;
              "
            >
              <strong>${item[0]}</strong>
              <small style="display:block;color:rgba(255,255,255,.45);margin-top:4px">
                ${item[2]}
              </small>
            </button>
          `).join("")
        : `<div style="color:rgba(255,255,255,.45);padding:12px 0">No results.</div>`;

      results.querySelectorAll(".eco-search-result").forEach(btn => {
        btn.addEventListener("click", () => {
          const target = document.querySelector(btn.dataset.target);

          overlay.classList.remove("open");

          setTimeout(() => {
            overlay.remove();
            target?.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });
          }, 220);
        });
      });
    }

    renderResults();

    input.addEventListener("input", () => {
      renderResults(input.value);
    });

    overlay.querySelector(".eco-close").addEventListener("click", () => {
      overlay.classList.remove("open");
      setTimeout(() => overlay.remove(), 220);
    });

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.classList.remove("open");
        setTimeout(() => overlay.remove(), 220);
      }
    });
  });
}

createSearch();

/* =========================================================
   DEMO AI
========================================================= */

function openDemoAI(prompt = "") {
  const overlay = document.createElement("div");

  overlay.className = "eco-overlay";

  overlay.innerHTML = `
    <div class="eco-auth">
      <button class="eco-close" aria-label="Close">×</button>

      <div class="eco-auth-eyebrow">ECO AI · DEMO</div>
      <h2>What are you building?</h2>

      <p class="eco-auth-sub">
        This is the ECO AI frontend prototype. A real AI backend
        will be connected in the next phase.
      </p>

      <form id="eco-ai-form">
        <div class="eco-field">
          <input
            id="eco-ai-input"
            value="${escapeHtml(prompt)}"
            placeholder="Ask ECO anything..."
            autocomplete="off"
          />
        </div>

        <button class="eco-submit" type="submit">
          Ask ECO
        </button>
      </form>

      <div class="eco-message" id="eco-ai-answer"></div>
    </div>
  `;

  document.body.appendChild(overlay);

  requestAnimationFrame(() => overlay.classList.add("open"));

  const form = overlay.querySelector("#eco-ai-form");
  const input = overlay.querySelector("#eco-ai-input");
  const answer = overlay.querySelector("#eco-ai-answer");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!input.value.trim()) return;

    answer.textContent =
      "ECO AI is ready. Connect your AI backend to enable real responses.";

    input.select();
  });

  overlay.querySelector(".eco-close").addEventListener("click", () => {
    overlay.classList.remove("open");
    setTimeout(() => overlay.remove(), 220);
  });
}

/* AI PROMPT */
const promptBox = document.querySelector(".prompt-box");

if (promptBox) {
  promptBox.style.cursor = "text";

  promptBox.addEventListener("click", () => {
    openDemoAI("");
  });
}

/* AI CHIPS */
document.querySelectorAll(".chips span").forEach((chip) => {
  chip.style.cursor = "pointer";

  chip.addEventListener("click", () => {
    openDemoAI(chip.textContent);
  });
});

/* PRODUCT CARDS */
document.querySelectorAll(".product-card").forEach((card) => {
  card.setAttribute("tabindex", "0");

  card.addEventListener("click", () => {
    const title = card.querySelector("h3")?.textContent || "ECO Product";

    openDemoAI(`Tell me about ${title}`);
  });

  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      card.click();
    }
  });
});

/* KEYBOARD SHORTCUTS */
window.addEventListener("keydown", (e) => {
  if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
    e.preventDefault();
    document.querySelector(".icon-btn")?.click();
  }

  if (e.key === "Escape") {
    document.querySelectorAll(".eco-overlay.open").forEach((overlay) => {
      overlay.classList.remove("open");
    });
  }
});








