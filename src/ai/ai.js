const app = document.querySelector("#eco-ai-app");

app.innerHTML = `
  <div class="eco-ai">

    <header class="ai-topbar">
      <div class="ai-brand">
        <div class="ai-logo">E</div>
        <div class="ai-brand-text">
          <strong>ECO AI</strong>
          <span>Intelligence inside one ecosystem</span>
        </div>
      </div>

      <a class="back-link" href="/">
        Back to ECO
      </a>
    </header>

    <div class="ai-layout">

      <aside class="ai-sidebar">

        <button class="new-chat" id="new-chat">
          <span>＋</span>
          New Chat
        </button>

        <div class="history-section">
          <div class="history-title">Recent</div>

          <div id="history-list" class="history-list">
            <div class="history-empty">
              No conversations yet
            </div>
          </div>
        </div>

        <div class="sidebar-bottom">
          <div class="eco-status">
            <span class="status-dot"></span>
            ECO AI Online
          </div>
        </div>

      </aside>

      <main class="ai-main">

        <section class="chat-shell">

          <div id="welcome" class="welcome">

            <div class="welcome-badge">
              <span></span>
              ECO AI V1
            </div>

            <h1>
              Intelligence<br>
              <span>inside ECO.</span>
            </h1>

            <p>
              Ask questions, explore ideas, write code,
              understand information and build with AI —
              all inside one ecosystem.
            </p>

            <div class="quick-actions">

              <button class="quick-action"
                data-prompt="Explain this concept simply">
                <span class="quick-icon">✦</span>
                <div>
                  <strong>Explain something</strong>
                  <small>Make complex ideas simple</small>
                </div>
              </button>

              <button class="quick-action"
                data-prompt="Help me write code">
                <span class="quick-icon">&lt;/&gt;</span>
                <div>
                  <strong>Write code</strong>
                  <small>Build and debug faster</small>
                </div>
              </button>

              <button class="quick-action"
                data-prompt="Help me brainstorm an idea">
                <span class="quick-icon">⌁</span>
                <div>
                  <strong>Brainstorm</strong>
                  <small>Turn ideas into possibilities</small>
                </div>
              </button>

              <button class="quick-action"
                data-prompt="Help me study this topic">
                <span class="quick-icon">◇</span>
                <div>
                  <strong>Study</strong>
                  <small>Learn with clear explanations</small>
                </div>
              </button>

            </div>

          </div>

          <div id="messages" class="messages"></div>

          <div id="typing" class="typing hidden">
            <div class="ai-avatar">E</div>
            <div class="typing-bubble">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          <form class="composer" id="composer">

            <input
              id="prompt"
              type="text"
              placeholder="Ask ECO anything..."
              autocomplete="off"
            >

            <button
              class="send-btn"
              id="send-btn"
              type="submit"
              aria-label="Send message">
              <span>↑</span>
            </button>

          </form>

          <div class="composer-note">
            ECO AI can make mistakes. Check important information.
          </div>

        </section>

      </main>

    </div>

  </div>
`;

const promptInput = document.querySelector("#prompt");
const composer = document.querySelector("#composer");
const sendButton = document.querySelector("#send-btn");
const messages = document.querySelector("#messages");
const welcome = document.querySelector("#welcome");
const typing = document.querySelector("#typing");
const newChatButton = document.querySelector("#new-chat");
const historyList = document.querySelector("#history-list");

let conversations = [];

function escapeHTML(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function addMessage(role, text) {
  const message = document.createElement("div");

  message.className = `message ${role}`;

  const avatar = role === "assistant"
    ? `<div class="message-avatar">E</div>`
    : `<div class="message-avatar user-avatar">U</div>`;

  message.innerHTML = `
    ${avatar}
    <div class="message-content">
      <div class="message-name">
        ${role === "assistant" ? "ECO AI" : "You"}
      </div>
      <div class="message-text">
        ${escapeHTML(text)}
      </div>
    </div>
  `;

  messages.appendChild(message);

  message.scrollIntoView({
    behavior: "smooth",
    block: "end"
  });
}

function setTyping(show) {
  typing.classList.toggle("hidden", !show);
}

function startConversation(prompt) {
  welcome.classList.add("hidden");

  if (!conversations.length) {
    conversations.push({
      title: prompt.length > 32
        ? `${prompt.slice(0, 32)}...`
        : prompt
    });

    renderHistory();
  }
}

function renderHistory() {
  if (!conversations.length) {
    historyList.innerHTML = `
      <div class="history-empty">
        No conversations yet
      </div>
    `;
    return;
  }

  historyList.innerHTML = conversations
    .map(
      (conversation) => `
        <button class="history-item">
          <span>◌</span>
          ${escapeHTML(conversation.title)}
        </button>
      `
    )
    .join("");
}

async function sendPrompt(prompt) {
  if (!prompt || sendButton.disabled) return;

  startConversation(prompt);

  addMessage("user", prompt);

  promptInput.value = "";

  sendButton.disabled = true;
  promptInput.disabled = true;

  setTyping(true);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "ECO AI request failed."
      );
    }

    setTyping(false);

    addMessage(
      "assistant",
      data.reply || "ECO AI returned an empty response."
    );

  } catch (error) {

    console.error("ECO AI Error:", error);

    setTyping(false);

    addMessage(
      "assistant",
      "ECO AI couldn't process your request right now. Please try again."
    );

  } finally {

    sendButton.disabled = false;
    promptInput.disabled = false;
    promptInput.focus();

  }
}

document.querySelectorAll(".quick-action").forEach((button) => {

  button.addEventListener("click", () => {

    promptInput.value = button.dataset.prompt;

    promptInput.focus();

  });

});

composer.addEventListener("submit", (event) => {

  event.preventDefault();

  const prompt = promptInput.value.trim();

  sendPrompt(prompt);

});

newChatButton.addEventListener("click", () => {

  messages.innerHTML = "";

  welcome.classList.remove("hidden");

  setTyping(false);

  promptInput.value = "";

  promptInput.disabled = false;

  sendButton.disabled = false;

  promptInput.focus();

});

promptInput.addEventListener("keydown", (event) => {

  if (event.key === "Enter" && !event.shiftKey) {

    event.preventDefault();

    composer.requestSubmit();

  }

});

renderHistory();