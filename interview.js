// ---------------------------
// INTERVIEW SCRIPT (no 5/5 label + tidy chooser)
// ---------------------------

const interviewModal = document.getElementById("interview-modal-content");
const interview = document.getElementById("interview");
const closeBtn = document.querySelector(".Interview-close");
const interviewBtn = document.querySelector(".Interview-buttons");
const noBtn = document.getElementById("no-btn");
const yesBtn = document.getElementById("yes-btn");
const hintBox = document.getElementById("Interview_q"); // reused as hint panel
const chooseDifficulty = document.querySelector(".choose-difficulty");
const questionTitle = document.getElementById("question-title");
const easyBtn = document.getElementById("easy-btn");
const mediumBtn = document.getElementById("medium-btn");
const hardBtn = document.getElementById("hard-btn");
const titleEl = document.getElementById("interview-title");

let currentQuestion = 0;
let currentQuestions = [];
let selectedLevel = "";
let hintVisible = false;

// ---------------------------
// Question bank
// ---------------------------
const interviewQuestions = {
  easy: [
    "Tell me about yourself.",
    "What are your strengths?",
    "What are your weaknesses?",
    "Why do you want to work here?",
    "Where do you see yourself in five years?",
  ],
  medium: [
    "Describe a challenging work situation and how you overcame it.",
    "How do you handle stress and pressure?",
    "What is your greatest professional achievement?",
    "How do you prioritize your work?",
    "Can you describe a time when you had to work as part of a team?",
  ],
  hard: [
    "Describe a time when you had to make a difficult decision at work.",
    "How do you handle conflict in the workplace?",
    "What is your management style?",
    "How do you stay current with industry trends and developments?",
    "Can you give an example of a time when you had to lead a project?",
  ],
};

// ---------------------------
// Hints (aligned with questions order)
// ---------------------------
const hints = {
  easy: [
    `
    <strong>Use Present → Past → Future (60–90s):</strong>
    <ul>
      <li><b>Present:</b> current role or focus.</li>
      <li><b>Past:</b> 1–2 relevant achievements (numbers if possible).</li>
      <li><b>Future:</b> why this role/team excites you.</li>
    </ul>
    `,
    `
    <strong>Pick 2–3 strengths that match the role:</strong>
    <ul>
      <li>Name the strength (e.g., “data analysis”).</li>
      <li>Give proof: a quick example and result.</li>
      <li>Connect to the job you’re applying for.</li>
    </ul>
    `,
    `
    <strong>Be honest but safe:</strong>
    <ul>
      <li>Choose a real, <em>non-critical</em> weakness (not “poor teamwork”).</li>
      <li>Show actions you’re taking to improve.</li>
      <li>End with progress you’ve made.</li>
    </ul>
    `,
    `
    <strong>Show research + alignment:</strong>
    <ul>
      <li>Mention product/mission or recent company win.</li>
      <li>Match your skills to the team’s needs.</li>
      <li>Explain growth you’re seeking here.</li>
    </ul>
    `,
    `
    <strong>Share a realistic growth path:</strong>
    <ul>
      <li>Skills you want to deepen (tie to role).</li>
      <li>Impact you aim to deliver.</li>
      <li>Optional: mentorship/leadership aspiration.</li>
    </ul>
    `,
  ],
  medium: [
    `
    <strong>Use STAR:</strong>
    <ul>
      <li><b>S</b>ituation: brief context</li>
      <li><b>T</b>ask: your responsibility</li>
      <li><b>A</b>ction: 2–3 key steps you took</li>
      <li><b>R</b>esult: metrics, lessons</li>
    </ul>
    `,
    `
    <strong>Show your system:</strong>
    <ul>
      <li>Prioritize + break tasks into chunks.</li>
      <li>Use habits: focus blocks, checklists, timelines.</li>
      <li>Give an example when it worked.</li>
    </ul>
    `,
    `
    <strong>Pick one story with clear impact:</strong>
    <ul>
      <li>State goal and constraints.</li>
      <li>Actions you led.</li>
      <li>Outcome with numbers (time saved, revenue, quality).</li>
    </ul>
    `,
    `
    <strong>Explain your framework:</strong>
    <ul>
      <li>Deadlines &amp; impact (e.g., Eisenhower / MoSCoW).</li>
      <li>Stakeholder alignment &amp; re-prioritization cadence.</li>
      <li>Example proving it works.</li>
    </ul>
    `,
    `
    <strong>Team story (STAR):</strong>
    <ul>
      <li>Your role and collaboration methods.</li>
      <li>Handling disagreements.</li>
      <li>Team outcome and what you learned.</li>
    </ul>
    `,
  ],
  hard: [
    `
    <strong>Decision process:</strong>
    <ul>
      <li>Options you considered &amp; data used.</li>
      <li>Stakeholders consulted.</li>
      <li>Outcome, trade-offs, lesson.</li>
    </ul>
    `,
    `
    <strong>Conflict handling:</strong>
    <ul>
      <li>Listen &amp; restate the other view.</li>
      <li>Seek common goals &amp; facts.</li>
      <li>Agree on action &amp; follow-up.</li>
    </ul>
    `,
    `
    <strong>Style with example:</strong>
    <ul>
      <li>e.g., Situational/Servant/Coaching.</li>
      <li>How you set goals, give feedback, unblock.</li>
      <li>Result your team achieved.</li>
    </ul>
    `,
    `
    <strong>Staying current:</strong>
    <ul>
      <li>Sources (journals, blogs, communities).</li>
      <li>Practice (PoCs, side projects).</li>
      <li>How you bring trends into work.</li>
    </ul>
    `,
    `
    <strong>Leading a project (STAR):</strong>
    <ul>
      <li>Scope, timeline, stakeholders.</li>
      <li>Risks you managed.</li>
      <li>Outcome with impact.</li>
    </ul>
    `,
  ],
};

// ---------------------------
// Modal controls
// ---------------------------
function openModal() {
  interviewModal.classList.remove("is-closing");
  interviewModal.classList.add("is-open");
  resetModalState();
  document.addEventListener("keydown", escCloser);
}
function escCloser(e) { if (e.key === "Escape") closeModal(); }

function closeModal() {
  interviewModal.classList.add("is-closing");
  setTimeout(() => {
    interviewModal.classList.remove("is-open", "is-closing");
    cleanupCompletionPanel();
    resetButtons();
    document.removeEventListener("keydown", escCloser);
  }, 250);
}

function resetModalState() {
  titleEl.textContent = "Are you ready to start Answering some Interviews Questions?";
  titleEl.style.display = "block";
  showChooser(); // ensures label says "Choose Difficulty:"
  cleanupCompletionPanel();
  hideHint();
}

// Always use this to show the difficulty chooser
function showChooser() {
  chooseDifficulty.style.display = "flex";
  interviewBtn.style.display = "none";
  titleEl.style.display = "none";
  questionTitle.textContent = "Choose Difficulty:";
}

// ---------------------------
// Hint helpers
// ---------------------------
function hideHint() {
  hintVisible = false;
  hintBox.style.display = "none";
  hintBox.classList.add("hint-box");
  hintBox.innerHTML = "";
}
function renderHint() {
  const idx = currentQuestion;
  const levelHints = hints[selectedLevel] || [];
  const html = levelHints[idx] || `
    <strong>Tip:</strong> Structure your answer with <b>STAR</b> (Situation, Task, Action, Result) and be concise.
  `;
  hintBox.innerHTML = html;
  hintBox.style.display = "block";
  hintBox.style.animation = "fadeSlideIn .3s ease";
}

// ---------------------------
// Core logic
// ---------------------------
function showQuestion() {
  titleEl.textContent = currentQuestions[currentQuestion];
  titleEl.style.animation = "fadeSlideIn .35s ease";

  // NO progress fraction anymore
  questionTitle.textContent = `Stage: ${selectedLevel.toUpperCase()}`;

  // reset hint per question
  hideHint();
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function startInterview(level) {
  selectedLevel = level;
  currentQuestions = shuffle([...interviewQuestions[level]]);
  currentQuestion = 0;
  hideHint();

  chooseDifficulty.style.display = "none";
  interviewBtn.style.display = "flex";
  titleEl.style.display = "block";

  showQuestion();

  // Prev | Hint | Next
  interviewBtn.innerHTML = `
    <button id="prev-btn" class="btn-primary" style="display:none;">Prev</button>
    <button id="hint-btn" class="btn-secondary">Hint</button>
    <button id="next-btn" class="btn-primary">Next</button>
  `;

  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const hintBtn = document.getElementById("hint-btn");

  nextBtn.addEventListener("click", () => {
    if (currentQuestion < currentQuestions.length - 1) {
      currentQuestion++;
      showQuestion();
      if (currentQuestion > 0) prevBtn.style.display = "inline-block";
    } else {
      interactiveCompletion(); // hides nav + shows completion
    }
  });

  prevBtn.addEventListener("click", () => {
    if (currentQuestion > 0) {
      currentQuestion--;
      showQuestion();
    }
    if (currentQuestion === 0) prevBtn.style.display = "none";
  });

  hintBtn.addEventListener("click", () => {
    hintVisible = !hintVisible;
    if (hintVisible) renderHint();
    else hideHint();
  });
}

// ---------------------------
// Interactive completion screen
// ---------------------------
function interactiveCompletion() {
  titleEl.textContent = "Stage Complete!";
  titleEl.style.animation = "fadeSlideIn .35s ease";

  // Hide navigation and clear its contents
  interviewBtn.style.display = "none";
  interviewBtn.innerHTML = "";
  hideHint();

  const panel = document.createElement("div");
  panel.className = "completion-panel";
  panel.id = "completion-panel";
  panel.innerHTML = `
    <div class="completion-badge">Stage: ${selectedLevel.toUpperCase()}</div>
    <div class="completion-actions">
      ${nextStageExists() ? `<button id="next-stage-btn" class="btn-primary">Next Stage</button>` : `<button id="finish-btn" class="btn-primary">Finish</button>`}
      <button id="retry-stage-btn" class="btn-primary">Retry Stage</button>
      <button id="change-difficulty-btn" class="btn-primary">Change Difficulty</button>
    </div>
  `;

  const questionsArea = document.querySelector(".Interview-questions");
  cleanupCompletionPanel();
  questionsArea.appendChild(panel);

  const retryBtn = document.getElementById("retry-stage-btn");
  const changeBtn = document.getElementById("change-difficulty-btn");
  const nextBtn = document.getElementById("next-stage-btn");
  const finishBtn = document.getElementById("finish-btn");

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      cleanupCompletionPanel();
      startInterview(selectedLevel === "easy" ? "medium" : "hard");
    });
  }
  if (finishBtn) {
    finishBtn.addEventListener("click", () => {
      titleEl.textContent = "You’ve completed all stages!";
      burstConfetti(30);
      panel.querySelector(".completion-actions").innerHTML = `
        <button id="restart-btn" class="btn-primary">Start Over</button>
      `;
      document.getElementById("restart-btn").addEventListener("click", () => {
        cleanupCompletionPanel();
        resetButtons();
        showChooser(); // go back to difficulty chooser, label set properly
      });
    });
  }

  retryBtn.addEventListener("click", () => {
    cleanupCompletionPanel();
    startInterview(selectedLevel);
  });

  changeBtn.addEventListener("click", () => {
    cleanupCompletionPanel();
    showChooser(); // ensures "Choose Difficulty:" and hides any stage label
  });

  burstConfetti(20);
}

function nextStageExists() {
  if (selectedLevel === "easy") return true;
  if (selectedLevel === "medium") return true;
  return false; // hard is last
}

function cleanupCompletionPanel() {
  const old = document.getElementById("completion-panel");
  if (old) old.remove();
}

// Lightweight confetti burst
function burstConfetti(count = 20) {
  const colors = ["#ffcd33", "#5bb450", "#f3b800", "#3d8b31", "#ffd166", "#06d6a0"];
  const bounds = interviewModal.getBoundingClientRect();
  const baseX = bounds.width / 2;

  for (let i = 0; i < count; i++) {
    const bit = document.createElement("div");
    bit.className = "confetti-bit";
    bit.style.left = `${baseX + (Math.random() * 120 - 60)}px`;
    bit.style.top = `64px`;
    bit.style.background = colors[i % colors.length];
    bit.style.transform = `translateY(-10px) rotate(${Math.random() * 180}deg)`;
    bit.style.animation = `confettiFall ${800 + Math.random() * 600}ms ease-out forwards`;
    interviewModal.appendChild(bit);
    setTimeout(() => bit.remove(), 1600);
  }
}

// ---------------------------
// Reset & initial Yes/No
// ---------------------------
function resetButtons() {
  interviewBtn.innerHTML = `
    <button class="btn-primary" id="yes-btn">Yes</button>
    <button class="btn-primary" id="no-btn">No</button>
  `;
  interviewBtn.style.display = "flex";

  document.getElementById("yes-btn").addEventListener("click", showChooser);
  document.getElementById("no-btn").addEventListener("click", closeModal);
}

// ---------------------------
// Event Listeners
// ---------------------------
easyBtn.addEventListener("click", () => startInterview("easy"));
mediumBtn.addEventListener("click", () => startInterview("medium"));
hardBtn.addEventListener("click", () => startInterview("hard"));
interview.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);

// Initial Yes/No (for first render)
noBtn.addEventListener("click", closeModal);
yesBtn.addEventListener("click", showChooser);
