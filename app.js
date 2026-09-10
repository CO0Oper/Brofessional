const API_URL = "https://plainly-linkedin-speak.developercoooper.workers.dev";

const el = {
  translator: document.querySelector(".translator"),
  outputPanel: document.querySelector(".output-panel"),
  message: document.querySelector("#message"),
  output: document.querySelector("#output"),
  status: document.querySelector("#status"),
  count: document.querySelector("#character-count"),
  send: document.querySelector("#send-button"),
  copy: document.querySelector("#copy-button"),
  swap: document.querySelector("#swap-button"),
  clear: document.querySelector("#clear-button"),
  outputLabel: document.querySelector("#output-label"),
  followupForm: document.querySelector("#followup-form"),
  followup: document.querySelector("#followup"),
};

let direction = "to-linkedin";
let history = [];

function renderHistory() {
  el.output.replaceChildren(...history.map(({ role, content }) => {
    const turn = document.createElement("div");
    turn.className = `turn ${role}`;
    const label = document.createElement("span");
    label.textContent = role === "user" ? "You" : el.outputLabel.textContent;
    const text = document.createElement("p");
    text.textContent = content;
    turn.append(label, text);
    return turn;
  }));
  el.copy.disabled = !history.some(({ role }) => role === "assistant");
  el.followupForm.hidden = !history.length;
  el.output.scrollTop = el.output.scrollHeight;
}

function resetOutput() {
  el.output.innerHTML = '<div class="empty-state"><span class="quote-mark" aria-hidden="true">“</span><p>Your professionally polished translation will appear here.</p></div>';
  el.copy.disabled = true;
  el.followupForm.hidden = true;
  el.status.textContent = "";
  el.status.className = "status";
}

function setLoading(loading) {
  el.send.disabled = loading;
  el.message.disabled = loading;
  el.followup.disabled = loading;
  el.followupForm.querySelector("button").disabled = loading;
  el.outputPanel.setAttribute("aria-busy", String(loading));
  el.send.querySelector("span").textContent = loading ? "Translating…" : "Translate";
  if (loading) el.status.textContent = "Finding the professionally aligned version…";
  el.translator.classList.toggle("transferring", loading);
}

async function translate(message = el.message.value.trim()) {
  if (!message) {
    el.message.focus();
    el.status.textContent = "Write something first, then translate it.";
    el.status.className = "status error";
    return;
  }

  setLoading(true);
  el.status.className = "status";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, direction, history }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Translation failed.");
    history.push({ role: "user", content: message }, { role: "assistant", content: data.reply });
    renderHistory();
    el.status.textContent = "Translation ready. Refine it below or copy the result.";
  } catch (error) {
    el.status.textContent = error.message === "Failed to fetch"
      ? "The translator is not connected yet. Check the deployment configuration."
      : error.message;
    el.status.className = "status error";
  } finally {
    setLoading(false);
  }
}

el.message.addEventListener("input", () => {
  el.count.textContent = `${el.message.value.length.toLocaleString()} / 2,000`;
});

el.message.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") translate();
});

el.send.addEventListener("click", () => translate());

el.swap.addEventListener("click", () => {
  direction = direction === "to-linkedin" ? "from-linkedin" : "to-linkedin";
  const decoding = direction === "from-linkedin";
  el.swap.setAttribute("aria-pressed", String(decoding));
  document.querySelector('label[for="message"]').textContent = decoding ? "LinkedIn Speak" : "Plain English";
  el.outputLabel.textContent = decoding ? "Plain English" : "LinkedIn Speak";
  el.message.placeholder = decoding
    ? "I’m excited to announce that I’m embarking on a new chapter…"
    : "My colleague keeps scheduling meetings that should have been emails…";
  resetOutput();
  history = [];
  el.message.focus();
});

el.copy.addEventListener("click", async () => {
  const latest = history.findLast(({ role }) => role === "assistant");
  await navigator.clipboard.writeText(latest?.content || "");
  el.copy.querySelector("span").textContent = "Copied";
  setTimeout(() => { el.copy.querySelector("span").textContent = "Copy"; }, 1400);
});

el.clear.addEventListener("click", () => {
  el.message.value = "";
  history = [];
  el.count.textContent = "0 / 2,000";
  resetOutput();
  el.message.focus();
});

el.followupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const request = el.followup.value.trim();
  if (!request) return el.followup.focus();
  el.followup.value = "";
  await translate(request);
});

document.querySelectorAll("[data-prompt]").forEach((button) => {
  button.addEventListener("click", () => {
    el.message.value = button.dataset.prompt;
    el.message.dispatchEvent(new Event("input"));
    el.message.focus();
  });
});
