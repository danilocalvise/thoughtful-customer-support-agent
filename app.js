const qaPairs = [
  {
    question: "What does the eligibility verification agent (EVA) do?",
    answer:
      "EVA automates the process of verifying a patient’s eligibility and benefits information in real-time, eliminating manual data entry errors and reducing claim rejections.",
  },
  {
    question: "What does the claims processing agent (CAM) do?",
    answer:
      "CAM streamlines the submission and management of claims, improving accuracy, reducing manual intervention, and accelerating reimbursements.",
  },
  {
    question: "How does the payment posting agent (PHIL) work?",
    answer:
      "PHIL automates the posting of payments to patient accounts, ensuring fast, accurate reconciliation of payments and reducing administrative burden.",
  },
  {
    question: "Tell me about Thoughtful AI's Agents.",
    answer:
      "Thoughtful AI provides a suite of AI-powered automation agents designed to streamline healthcare processes. These include Eligibility Verification (EVA), Claims Processing (CAM), and Payment Posting (PHIL), among others.",
  },
  {
    question: "What are the benefits of using Thoughtful AI's agents?",
    answer:
      "Using Thoughtful AI's Agents can significantly reduce administrative costs, improve operational efficiency, and reduce errors in critical processes like claims management and payment posting.",
  },
];

const fallbackResponses = [
  "I can help with Thoughtful AI basics. Try asking about EVA, CAM, or PHIL.",
  "Could you share more details? I can answer questions about Thoughtful AI agents.",
  "I'm here to help with Thoughtful AI. Ask about eligibility verification, claims, or payment posting.",
];

const chatLog = document.querySelector("#chatLog");
const chatForm = document.querySelector("#chatForm");
const userInput = document.querySelector("#userInput");

function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function scoreSimilarity(inputTokens, candidateTokens) {
  if (!inputTokens.length || !candidateTokens.length) return 0;
  const inputSet = new Set(inputTokens);
  const candidateSet = new Set(candidateTokens);
  let overlap = 0;
  inputSet.forEach((token) => {
    if (candidateSet.has(token)) overlap += 1;
  });
  return overlap / Math.sqrt(inputSet.size * candidateSet.size);
}

function getBestAnswer(inputText) {
  const inputTokens = normalizeText(inputText);
  let bestScore = 0;
  let bestAnswer = null;

  qaPairs.forEach((pair) => {
    const candidateTokens = normalizeText(pair.question);
    const score = scoreSimilarity(inputTokens, candidateTokens);
    if (score > bestScore) {
      bestScore = score;
      bestAnswer = pair.answer;
    }
  });

  if (bestScore >= 0.35) return bestAnswer;
  const randomIndex = Math.floor(Math.random() * fallbackResponses.length);
  return fallbackResponses[randomIndex];
}

function createMessageElement(role, text) {
  const wrapper = document.createElement("div");
  wrapper.className = `message ${role}`;

  const meta = document.createElement("span");
  meta.className = "meta";
  meta.textContent = role === "user" ? "You" : "Thoughtful AI";

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;

  wrapper.append(meta, bubble);
  return wrapper;
}

function appendMessage(role, text) {
  const message = createMessageElement(role, text);
  chatLog.appendChild(message);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function handleSubmit(event) {
  event.preventDefault();
  const inputValue = userInput.value.trim();
  if (!inputValue) {
    appendMessage("agent", "Please enter a question so I can help.");
    return;
  }

  appendMessage("user", inputValue);
  const answer = getBestAnswer(inputValue);
  appendMessage("agent", answer);
  userInput.value = "";
  userInput.focus();
}

appendMessage(
  "agent",
  "Hi! I'm the Thoughtful AI support agent. How can I help you today?"
);
chatForm.addEventListener("submit", handleSubmit);
