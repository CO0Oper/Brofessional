const API_URL = "https://plainly-linkedin-speak.developercoooper.workers.dev";
const MESSAGE_LIMIT = 1000;

const el = {
  translator: document.querySelector(".translator"),
  outputPanel: document.querySelector(".output-panel"),
  message: document.querySelector("#message"),
  output: document.querySelector("#output"),
  status: document.querySelector("#status"),
  count: document.querySelector("#character-count"),
  examples: document.querySelector(".examples"),
  send: document.querySelector("#send-button"),
  tonePicker: document.querySelector("#tone-picker"),
  toneInputs: [...document.querySelectorAll('input[name="tone"]')],
  swap: document.querySelector("#swap-button"),
  copy: document.querySelector("#copy-button"),
  clear: document.querySelector("#clear-button"),
  outputLabel: document.querySelector("#output-label"),
  inputLabel: document.querySelector("#input-label"),
  languagePicker: document.querySelector("#language-picker"),
  targetLanguage: document.querySelector("#target-language"),
  history: document.querySelector("#history"),
  historyList: document.querySelector("#history-list"),
  historyCount: document.querySelector("#history-count"),
  followupForm: document.querySelector("#followup-form"),
  followup: document.querySelector("#followup"),
};

let direction = "to-linkedin";
let turns = [];

function selectedTone() {
  return el.toneInputs.find((input) => input.checked).value;
}

function renderHistoryList() {
  el.historyList.replaceChildren(...turns.slice().reverse().map((item) => {
    const pair = document.createElement("div");
    pair.className = "history-pair";
    const sourceLabel = document.createElement("span");
    sourceLabel.textContent = item.inputLabel;
    const source = document.createElement("p");
    source.textContent = item.original;
    const resultLabel = document.createElement("span");
    resultLabel.textContent = item.outputLabel;
    const result = document.createElement("p");
    result.textContent = item.translation;
    pair.append(sourceLabel, source, resultLabel, result);
    return pair;
  }));
  el.history.hidden = !turns.length;
  el.historyCount.textContent = turns.length;
}

function renderHistory() {
  const latest = turns.at(-1);
  if (!latest) return resetOutput();

  const turn = document.createElement("div");
  turn.className = "turn assistant";
  const label = document.createElement("span");
  label.textContent = latest.outputLabel;
  const text = document.createElement("p");
  text.textContent = latest.translation;
  turn.append(label, text);
  el.output.replaceChildren(turn);
  renderHistoryList();
  el.copy.disabled = false;
  el.followupForm.hidden = false;
}

function resetOutput(keepHistory = false) {
  const destination = direction === "to-linkedin"
    ? "professionally polished translation"
    : selectedTone() === "real" ? "blunt interpretation" : "natural-language translation";
  el.output.innerHTML = `<div class="empty-state"><span class="quote-mark" aria-hidden="true">“</span><p>Your ${destination} will appear here.</p></div>`;
  el.copy.disabled = true;
  el.followupForm.hidden = true;
  el.history.open = false;
  if (keepHistory) renderHistoryList();
  else el.history.hidden = true;
  el.status.textContent = "";
  el.status.className = "status";
}

function setLoading(loading) {
  el.send.disabled = loading;
  el.swap.disabled = loading;
  el.message.disabled = loading;
  el.targetLanguage.disabled = loading;
  el.toneInputs.forEach((input) => { input.disabled = loading; });
  el.followup.disabled = loading;
  el.followupForm.querySelector("button").disabled = loading;
  el.outputPanel.setAttribute("aria-busy", String(loading));
  el.send.querySelector("span").textContent = loading ? "Translating…" : "Translate";
  if (loading) el.status.textContent = direction === "to-linkedin"
    ? "Finding the professionally aligned version…"
    : selectedTone() === "real" ? "Reading between the lines…" : "Translating into natural language…";
  el.translator.classList.toggle("transferring", loading);
}

async function translate(message = el.message.value.trim()) {
  if (!message) {
    el.message.focus();
    el.status.textContent = "Write something first, then translate it.";
    el.status.className = "status error";
    return;
  }

  const tone = direction === "from-linkedin" ? selectedTone() : "normal";
  setLoading(true);
  el.status.className = "status";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        direction,
        tone,
        targetLanguage: direction === "from-linkedin" ? el.targetLanguage.value : undefined,
        history: turns.filter((turn) => turn.direction === direction && turn.tone === tone).slice(-4).flatMap((turn) => [
          { role: "user", content: turn.original },
          { role: "assistant", content: turn.translation },
        ]),
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Translation failed.");
    turns.push({
      direction,
      tone,
      original: message,
      translation: data.reply,
      inputLabel: el.inputLabel.textContent,
      outputLabel: direction === "to-linkedin"
        ? "LinkedIn Speak"
        : tone === "real" ? "Real meaning" : el.targetLanguage.selectedOptions[0].textContent,
    });
    renderHistory();
    const remaining = response.headers.get("X-RateLimit-Remaining");
    el.status.textContent = `Translation ready.${remaining === null ? "" : ` ${remaining} of 20 messages left.`}`;
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
  el.message.value = el.message.value.slice(0, MESSAGE_LIMIT);
  el.count.textContent = `${el.message.value.length.toLocaleString()} / ${MESSAGE_LIMIT.toLocaleString()}`;
});

el.message.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") translate();
});

el.send.addEventListener("click", () => translate());

el.swap.addEventListener("click", () => {
  direction = direction === "to-linkedin" ? "from-linkedin" : "to-linkedin";
  const latest = turns.at(-1);
  if (latest) {
    el.message.value = latest.translation.slice(0, MESSAGE_LIMIT);
    el.message.dispatchEvent(new Event("input"));
  }
  el.inputLabel.textContent = direction === "to-linkedin" ? "Detect language" : "LinkedIn Speak";
  el.outputLabel.textContent = direction === "to-linkedin" ? "LinkedIn Speak" : "Natural language";
  el.outputLabel.hidden = direction === "from-linkedin";
  el.languagePicker.hidden = direction === "to-linkedin";
  el.tonePicker.hidden = direction === "to-linkedin";
  el.examples.hidden = direction === "from-linkedin";
  el.message.placeholder = direction === "to-linkedin"
    ? "My colleague keeps scheduling meetings that should have been emails…"
    : "I’m grateful for the opportunity to embrace a new chapter…";
  el.swap.classList.toggle("reversed", direction === "from-linkedin");
  el.translator.classList.toggle("reversed", direction === "from-linkedin");
  resetOutput(true);
  el.message.focus();
});

el.toneInputs.forEach((input) => input.addEventListener("change", () => {
  resetOutput(true);
}));

el.copy.addEventListener("click", async () => {
  await navigator.clipboard.writeText(turns.at(-1)?.translation || "");
  el.copy.querySelector("span").textContent = "Copied";
  setTimeout(() => { el.copy.querySelector("span").textContent = "Copy"; }, 1400);
});

el.clear.addEventListener("click", () => {
  el.message.value = "";
  turns = [];
  el.count.textContent = `0 / ${MESSAGE_LIMIT.toLocaleString()}`;
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
