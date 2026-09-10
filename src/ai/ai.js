const app = document.querySelector("#eco-ai-app");

app.innerHTML = `
  <div class="eco-ai">

    <header class="ai-topbar">
      <div class="ai-brand">
        <div class="ai-logo">E</div>
        <div>
          <strong>ECO AI</strong>
          <span>Intelligence inside one ecosystem</span>
        </div>
      </div>

      <div>
        <a href="/" style="color:#9aa4af;text-decoration:none;font-size:13px;">
          Back to ECO
        </a>
      </div>
    </header>

    <div class="ai-layout">

      <aside class="ai-sidebar">
        <button class="new-chat" id="new-chat">
          + New Chat
        </button>

        <div class="history-title">
          Chat History
        </div>

        <div class="history-empty">
          Your conversations will appear here.
        </div>
      </aside>

      <main class="ai-main">
        <section class="ai-content">

          <div class="ai-hero">

            <div class="ai-eyebrow">
              ECO AI V1
            </div>

            <h1>
              Intelligence<br>
              inside ECO.
            </h1>

            <p>
              Ask questions, explore ideas, write code,
              understand information and build with AI —
              all inside one ecosystem.
            </p>

            <div class="quick-actions">

              <button class="quick-action"
                data-prompt="Explain this concept simply">
                Explain something
              </button>

              <button class="quick-action"
                data-prompt="Help me write code">
                Write code
              </button>

              <button class="quick-action"
                data-prompt="Help me brainstorm an idea">
                Brainstorm
              </button>

              <button class="quick-action"
                data-prompt="Help me study this topic">
                Study
              </button>

            </div>

            <div id="response-area"></div>

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
                type="submit">
                Send
              </button>

            </form>

          </div>

        </section>
      </main>

    </div>

  </div>
`;

const promptInput = document.querySelector("#prompt");
const composer = document.querySelector("#composer");
const sendButton = document.querySelector("#send-btn");
const responseArea = document.querySelector("#response-area");

function showResponse(text, type = "normal") {
  responseArea.innerHTML = `
    <div
      style="
        margin-top:24px;
        padding:20px;
        border:1px solid rgba(255,255,255,.10);
        border-radius:16px;
        background:rgba(255,255,255,.035);
        color:#dce3e8;
        line-height:1.7;
        text-align:left;
        white-space:pre-wrap;
      "
    >
      ${text}
    </div>
  `;
}

document.querySelectorAll(".quick-action").forEach((button) => {
  button.addEventListener("click", () => {
    promptInput.value = button.dataset.prompt;
    promptInput.focus();
  });
});

document.querySelector("#new-chat").addEventListener("click", () => {
  promptInput.value = "";
  responseArea.innerHTML = "";
  promptInput.focus();
});

composer.addEventListener("submit", async (event) => {
  event.preventDefault();

  const prompt = promptInput.value.trim();

  if (!prompt) {
    promptInput.focus();
    return;
  }

  sendButton.disabled = true;
  sendButton.textContent = "Thinking...";

  showResponse("ECO AI is thinking...");

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
      throw new Error(data.error || "ECO AI request failed.");
    }

    showResponse(data.reply || "ECO AI returned an empty response.");

    promptInput.value = "";

  } catch (error) {
    console.error("ECO AI Error:", error);

    showResponse(
      "ECO AI couldn't process your request right now. Please try again."
    );
  } finally {
    sendButton.disabled = false;
    sendButton.textContent = "Send";
  }
});