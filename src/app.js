/**
 * Adeyemi Federal University of Education (AFUED), Ondo
 * Continuous Assessment & CBT Examination Portal
 * Core Vanilla JavaScript Architecture (Pure HTML5, CSS3, & Vanilla JS)
 */

// Initial University State
const DEFAULT_SESSION = "2024/2025";

const STUDENTS = [
  {
    matric: "AFUED/2021/CSC/0481",
    name: "Babatunde Adewale Samuel",
    school: "School of Science",
    department: "Computer Science",
    level: "300 Level",
    programme: "B.Sc. (Ed) Computer Science",
    gender: "Male"
  },
  {
    matric: "AFUED/2021/CSC/0482",
    name: "Olawale Joy Chioma",
    school: "School of Science",
    department: "Computer Science",
    level: "300 Level",
    programme: "B.Sc. (Ed) Computer Science",
    gender: "Female"
  },
  {
    matric: "AFUED/2021/CSC/0485",
    name: "Adegoke Emmanuel Tosin",
    school: "School of Science",
    department: "Computer Science",
    level: "300 Level",
    programme: "B.Sc. (Ed) Computer Science",
    gender: "Male"
  }
];

const INITIAL_ASSESSMENTS = [
  {
    id: "csc301-ca1",
    code: "CSC 301",
    title: "Structured Programming & Algorithms",
    type: "Continuous Assessment Test 1",
    durationMinutes: 10,
    totalMarks: 15,
    dueDate: "Tomorrow, 4:00 PM",
    lecturer: "Dr. (Mrs) K. E. Adeleke",
    status: "Available",
    questions: [
      {
        text: "In modular programming, which of the following best describes top-down design methodology?",
        options: [
          "Breaking a complex problem into smaller, manageable sub-problems or functions.",
          "Writing low-level hardware drivers before designing the user interface.",
          "Iterating over recursive data types without base cases.",
          "Compiling all source files into a single flat binary."
        ],
        correct: 0
      },
      {
        text: "Which data structure follows the Last-In, First-Out (LIFO) principle in algorithmic execution?",
        options: [
          "Queue",
          "Binary Search Tree",
          "Stack",
          "Doubly Linked List"
        ],
        correct: 2
      },
      {
        text: "What is the worst-case time complexity of standard QuickSort with poor pivot selection?",
        options: [
          "O(n log n)",
          "O(n²)",
          "O(n)",
          "O(log n)"
        ],
        correct: 1
      },
      {
        text: "In C and structured languages, what is the effect of the 'static' keyword on a local function variable?",
        options: [
          "It makes the variable accessible outside its declaring file.",
          "It preserves the variable's value across multiple invocations of the function.",
          "It allocates the variable on the dynamic garbage-collected heap.",
          "It converts the variable into a read-only constant."
        ],
        correct: 1
      },
      {
        text: "Which asymptotic notation specifies an asymptotically tight bound on algorithm running time?",
        options: [
          "Big-O (O)",
          "Big-Omega (Ω)",
          "Big-Theta (Θ)",
          "Little-o (o)"
        ],
        correct: 2
      }
    ]
  },
  {
    id: "csc303-ca1",
    code: "CSC 303",
    title: "Database Design & Management Systems",
    type: "Mid-Semester Assessment",
    durationMinutes: 12,
    totalMarks: 15,
    dueDate: "In 3 Days",
    lecturer: "Prof. O. M. Fashola",
    status: "Available",
    questions: [
      {
        text: "Which normal form requires the elimination of all transitive dependencies in relational tables?",
        options: [
          "First Normal Form (1NF)",
          "Second Normal Form (2NF)",
          "Third Normal Form (3NF)",
          "Boyce-Codd Normal Form (BCNF)"
        ],
        correct: 2
      },
      {
        text: "What does the 'I' in the ACID properties of database transactions represent?",
        options: [
          "Integrity",
          "Isolation",
          "Idempotence",
          "Indexability"
        ],
        correct: 1
      },
      {
        text: "In SQL, which clause is specifically used to filter aggregate groups returned by GROUP BY?",
        options: [
          "WHERE",
          "HAVING",
          "ORDER BY",
          "DISTINCT"
        ],
        correct: 1
      },
      {
        text: "Which type of join returns all rows from the left table and matched rows from the right table?",
        options: [
          "LEFT OUTER JOIN",
          "INNER JOIN",
          "CROSS JOIN",
          "FULL JOIN"
        ],
        correct: 0
      }
    ]
  },
  {
    id: "edu311-ca1",
    code: "EDU 311",
    title: "Educational Technology & Instructional Delivery",
    type: "Continuous Assessment 1",
    durationMinutes: 15,
    totalMarks: 20,
    dueDate: "Next Week",
    lecturer: "Dr. P. A. Ogundipe",
    status: "Available",
    questions: [
      {
        text: "According to Edgar Dale's Cone of Experience, which learning activity yields the highest retention?",
        options: [
          "Reading printed instructional manuals",
          "Listening to verbal lectures",
          "Simulating real experiences or direct purposeful doing",
          "Viewing educational slides"
        ],
        correct: 2
      },
      {
        text: "In modern curriculum design, the acronym ASSURE is primarily used as:",
        options: [
          "A model for planning and conducting technology-integrated instruction.",
          "A standardized grading scale for tertiary colleges of education.",
          "A security encryption standard for CBT examinations.",
          "A budget allocation formula for school laboratories."
        ],
        correct: 0
      }
    ]
  }
];

// Initial Gradebook Records
const INITIAL_GRADES = [
  { code: "CSC 301", title: "Structured Programming", ca1: 13, ca2: 12, totalCa: 25, exam: 58, total: 83, grade: "A", status: "Verified" },
  { code: "CSC 303", title: "Database Systems", ca1: 14, ca2: 11, totalCa: 25, exam: 52, total: 77, grade: "A", status: "Verified" },
  { code: "CSC 305", title: "Operating Systems", ca1: 12, ca2: 13, totalCa: 25, exam: 48, total: 73, grade: "A", status: "Verified" },
  { code: "EDU 311", title: "Educational Technology", ca1: 11, ca2: 12, totalCa: 23, exam: 45, total: 68, grade: "B", status: "Verified" },
  { code: "GST 301", title: "Peace & Conflict Resolution", ca1: 14, ca2: 14, totalCa: 28, exam: 54, total: 82, grade: "A", status: "Verified" }
];

// Application State
const state = {
  currentRole: "student", // 'student' | 'lecturer' | 'admin'
  activeSession: localStorage.getItem("afued_session") || DEFAULT_SESSION,
  activeView: "overview", // 'overview' | 'assessments' | 'gradebook' | 'lecturer' | 'admin'
  currentUser: STUDENTS[0],
  assessments: JSON.parse(localStorage.getItem("afued_assessments") || JSON.stringify(INITIAL_ASSESSMENTS)),
  grades: JSON.parse(localStorage.getItem("afued_grades") || JSON.stringify(INITIAL_GRADES)),
  
  // CBT Exam Execution State
  activeExam: null,
  currentQuestionIndex: 0,
  userAnswers: {},
  flaggedQuestions: new Set(),
  examTimerInterval: null,
  secondsRemaining: 0,
  isExamSubmitted: false,
  examScoreResult: null
};

// Resilient Application Bootstrap
function initApp() {
  setupNavigation();
  setupRoleSwitcher();
  setupSessionManager();
  setupCbtControls();
  setupPrintSlipControls();
  setupLecturerControls();
  setupAdminControls();
  setupKeyboardShortcuts();
  
  renderSessionInfo();
  renderStudentView();
  renderLecturerView();
  renderAdminView();
  updateViewVisibility();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

// Setup navigation & tab triggers
function setupNavigation() {
  const navButtons = document.querySelectorAll("[data-nav-target]");
  navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetView = btn.getAttribute("data-nav-target");
      if (targetView) {
        state.activeView = targetView;
        updateViewVisibility();
      }
    });
  });
}

// Role Switching System
function setupRoleSwitcher() {
  const roleButtons = document.querySelectorAll("[data-role]");
  roleButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const role = btn.getAttribute("data-role");
      setRole(role);
    });
  });
}

function setRole(role) {
  state.currentRole = role;
  
  // Update role switcher UI buttons
  document.querySelectorAll("[data-role]").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-role") === role);
  });

  const profileBadge = document.getElementById("header-user-badge");
  
  if (role === "student") {
    state.currentUser = STUDENTS[0];
    state.activeView = "overview";
    if (profileBadge) {
      profileBadge.innerHTML = `
        <div class="user-avatar-tiny">BA</div>
        <span><strong>${state.currentUser.name}</strong> (${state.currentUser.matric})</span>
      `;
    }
  } else if (role === "lecturer") {
    state.currentUser = {
      name: "Dr. (Mrs) K. E. Adeleke",
      staffId: "AFUED/STF/0892",
      department: "Department of Computer Science",
      role: "Senior Lecturer & Course Coordinator"
    };
    state.activeView = "lecturer";
    if (profileBadge) {
      profileBadge.innerHTML = `
        <div class="user-avatar-tiny" style="background:#b45309">KA</div>
        <span><strong>${state.currentUser.name}</strong> (${state.currentUser.staffId})</span>
      `;
    }
  } else if (role === "admin") {
    state.currentUser = {
      name: "Prof. O. M. Fashola",
      staffId: "AFUED/ADMIN/001",
      department: "Directorate of Information & Communication Technology",
      role: "Director of ICT & Chief Exam Officer"
    };
    state.activeView = "admin";
    if (profileBadge) {
      profileBadge.innerHTML = `
        <div class="user-avatar-tiny" style="background:#0369a1">OF</div>
        <span><strong>${state.currentUser.name}</strong> (ICT Directorate)</span>
      `;
    }
  }

  updateViewVisibility();
}

// Update Active Session Display across all badges & slips
function renderSessionInfo() {
  const sessionBadges = document.querySelectorAll(".current-session-label");
  sessionBadges.forEach(el => {
    el.textContent = state.activeSession + " Academic Session";
  });
  
  const shortSessionBadges = document.querySelectorAll(".current-session-short");
  shortSessionBadges.forEach(el => {
    el.textContent = state.activeSession;
  });
}

function setupSessionManager() {
  const editBtn = document.getElementById("edit-session-btn");
  if (editBtn) {
    editBtn.addEventListener("click", () => {
      openSessionModal();
    });
  }
}

function openSessionModal() {
  const newSession = prompt("Set Active Academic Session for AFUED (e.g. 2024/2025, 2025/2026):", state.activeSession);
  if (newSession && newSession.trim() !== "") {
    state.activeSession = newSession.trim();
    localStorage.setItem("afued_session", state.activeSession);
    renderSessionInfo();
    renderStudentView();
    renderAdminView();
    alert(`Academic Session successfully updated to: ${state.activeSession}`);
  }
}

// Update View Visibility
function updateViewVisibility() {
  document.querySelectorAll(".view-section").forEach(sec => {
    sec.classList.remove("active");
  });

  const activeSec = document.getElementById(`view-${state.activeView}`);
  if (activeSec) {
    activeSec.classList.add("active");
  }

  // Update nav button highlight states
  document.querySelectorAll("[data-nav-target]").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-nav-target") === state.activeView);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ==========================================================================
   Student Portal & CBT Exam Engine
   ========================================================================== */
function renderStudentView() {
  const container = document.getElementById("available-assessments-grid");
  if (!container) return;

  container.innerHTML = "";

  state.assessments.forEach(ass => {
    const isCompleted = state.grades.some(g => g.code === ass.code && g.status === "Verified");
    
    const card = document.createElement("div");
    card.className = "assessment-item";
    card.innerHTML = `
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
          <span class="badge ${isCompleted ? 'badge-green' : 'badge-gold'}">
            ${isCompleted ? 'Completed & Scored' : ass.type}
          </span>
          <span style="font-size:0.75rem; color:var(--slate-500); font-weight:600;">${ass.durationMinutes} Mins</span>
        </div>
        <h3 style="font-size:1.15rem; font-weight:800; color:var(--afued-green); margin-bottom:0.25rem;">
          ${ass.code}: ${ass.title}
        </h3>
        <p style="font-size:0.8rem; color:var(--slate-600); margin-bottom:1rem;">
          Instructor: ${ass.lecturer} | Weight: ${ass.totalMarks} Marks
        </p>
      </div>
      <div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.75rem; padding-top:0.75rem; border-top:1px solid var(--slate-100);">
          <span style="font-size:0.75rem; color:var(--slate-500);">Due: ${ass.dueDate}</span>
          <button class="btn btn-sm ${isCompleted ? 'btn-secondary' : 'btn-primary'}" id="btn-start-${ass.id}">
            ${isCompleted ? 'Retake Practice' : 'Start CBT Test'}
          </button>
        </div>
      </div>
    `;

    container.appendChild(card);

    const startBtn = card.querySelector(`#btn-start-${ass.id}`);
    startBtn.addEventListener("click", () => {
      startCbtExam(ass);
    });
  });

  renderStudentGradebook();
}

function renderStudentGradebook() {
  const tbody = document.getElementById("student-gradebook-body");
  if (!tbody) return;

  tbody.innerHTML = "";
  let totalScoreSum = 0;
  let count = 0;

  state.grades.forEach(g => {
    totalScoreSum += g.total;
    count++;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${g.code}</strong></td>
      <td>${g.title}</td>
      <td style="text-align:center;">${g.ca1}/15</td>
      <td style="text-align:center;">${g.ca2}/15</td>
      <td style="text-align:center; font-weight:700; color:var(--afued-green);">${g.totalCa}/30</td>
      <td style="text-align:center;">${g.exam}/70</td>
      <td style="text-align:center; font-weight:800;">${g.total}/100</td>
      <td style="text-align:center;"><span class="badge ${g.grade === 'A' ? 'badge-green' : 'badge-blue'}">${g.grade}</span></td>
      <td><span class="badge badge-green">Senate Approved</span></td>
    `;
    tbody.appendChild(tr);
  });

  const avg = count > 0 ? (totalScoreSum / count).toFixed(1) : "0.0";
  const avgEl = document.getElementById("student-standing-average");
  if (avgEl) avgEl.textContent = avg + "%";
}

/* ==========================================================================
   CBT Real-Time Test Simulation
   ========================================================================== */
function startCbtExam(assessment) {
  state.activeExam = assessment;
  state.currentQuestionIndex = 0;
  state.userAnswers = {};
  state.flaggedQuestions = new Set();
  state.isExamSubmitted = false;
  state.examScoreResult = null;
  state.secondsRemaining = assessment.durationMinutes * 60;

  const modal = document.getElementById("cbt-exam-modal");
  if (!modal) return;

  modal.classList.remove("hidden");
  document.getElementById("exam-modal-title").textContent = `${assessment.code} - ${assessment.title}`;

  // Start Countdown Timer
  if (state.examTimerInterval) clearInterval(state.examTimerInterval);
  updateTimerDisplay();
  state.examTimerInterval = setInterval(() => {
    state.secondsRemaining--;
    updateTimerDisplay();
    if (state.secondsRemaining <= 0) {
      clearInterval(state.examTimerInterval);
      alert("Exam time elapsed! Submitting your answers automatically.");
      submitCbtExam();
    }
  }, 1000);

  renderQuestion();
  renderPalette();
}

function updateTimerDisplay() {
  const timerBox = document.getElementById("exam-timer-display");
  if (!timerBox) return;

  const mins = Math.floor(state.secondsRemaining / 60);
  const secs = state.secondsRemaining % 60;
  timerBox.textContent = `⏱ ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  
  if (state.secondsRemaining <= 120) {
    timerBox.classList.add("warning");
  } else {
    timerBox.classList.remove("warning");
  }
}

function renderQuestion() {
  const q = state.activeExam.questions[state.currentQuestionIndex];
  if (!q) return;

  document.getElementById("current-q-index-badge").textContent = 
    `Question ${state.currentQuestionIndex + 1} of ${state.activeExam.questions.length}`;

  const qText = document.getElementById("exam-question-text");
  qText.textContent = q.text;

  const optionsWrap = document.getElementById("exam-options-container");
  optionsWrap.innerHTML = "";

  const letters = ["A", "B", "C", "D", "E"];
  q.options.forEach((opt, idx) => {
    const isSelected = state.userAnswers[state.currentQuestionIndex] === idx;
    const label = document.createElement("label");
    label.className = `option-label ${isSelected ? 'selected' : ''}`;
    label.innerHTML = `
      <input type="radio" name="cbt_option" value="${idx}" ${isSelected ? 'checked' : ''} style="display:none;" />
      <span class="option-letter">${letters[idx]}</span>
      <span class="option-text">${opt}</span>
    `;

    label.addEventListener("click", () => {
      state.userAnswers[state.currentQuestionIndex] = idx;
      renderQuestion();
      renderPalette();
    });

    optionsWrap.appendChild(label);
  });

  // Prev / Next button states
  const prevBtn = document.getElementById("btn-exam-prev");
  const nextBtn = document.getElementById("btn-exam-next");
  if (prevBtn) prevBtn.disabled = state.currentQuestionIndex === 0;
  if (nextBtn) {
    if (state.currentQuestionIndex === state.activeExam.questions.length - 1) {
      nextBtn.textContent = "Review Palette";
    } else {
      nextBtn.textContent = "Next Question →";
    }
  }

  // Flag toggle button
  const flagBtn = document.getElementById("btn-exam-flag");
  if (flagBtn) {
    const isFlagged = state.flaggedQuestions.has(state.currentQuestionIndex);
    flagBtn.textContent = isFlagged ? "🚩 Flagged (Remove)" : "🏳 Flag for Review";
    flagBtn.classList.toggle("btn-accent", isFlagged);
  }
}

function renderPalette() {
  const paletteContainer = document.getElementById("exam-palette-container");
  if (!paletteContainer) return;

  paletteContainer.innerHTML = "";
  state.activeExam.questions.forEach((_, idx) => {
    const btn = document.createElement("button");
    const isAnswered = state.userAnswers[idx] !== undefined;
    const isActive = state.currentQuestionIndex === idx;
    const isFlagged = state.flaggedQuestions.has(idx);

    btn.className = `palette-btn ${isActive ? 'active' : ''} ${isAnswered ? 'answered' : ''}`;
    if (isFlagged) {
      btn.style.borderColor = "var(--gold)";
      btn.style.boxShadow = "0 0 0 2px var(--gold)";
    }
    btn.textContent = idx + 1;

    btn.addEventListener("click", () => {
      state.currentQuestionIndex = idx;
      renderQuestion();
      renderPalette();
    });

    paletteContainer.appendChild(btn);
  });
}

// CBT Examination Listeners Setup
function setupCbtControls() {
  document.getElementById("btn-exam-prev")?.addEventListener("click", () => {
    if (state.currentQuestionIndex > 0) {
      state.currentQuestionIndex--;
      renderQuestion();
      renderPalette();
    }
  });

  document.getElementById("btn-exam-next")?.addEventListener("click", () => {
    if (state.currentQuestionIndex < state.activeExam.questions.length - 1) {
      state.currentQuestionIndex++;
      renderQuestion();
      renderPalette();
    }
  });

  document.getElementById("btn-exam-flag")?.addEventListener("click", () => {
    if (state.flaggedQuestions.has(state.currentQuestionIndex)) {
      state.flaggedQuestions.delete(state.currentQuestionIndex);
    } else {
      state.flaggedQuestions.add(state.currentQuestionIndex);
    }
    renderQuestion();
    renderPalette();
  });

  document.getElementById("btn-exam-submit")?.addEventListener("click", () => {
    const answeredCount = Object.keys(state.userAnswers).length;
    const total = state.activeExam.questions.length;
    const confirmMsg = `You have answered ${answeredCount} of ${total} questions. Are you sure you want to submit your assessment?`;
    if (confirm(confirmMsg)) {
      submitCbtExam();
    }
  });

  document.getElementById("btn-exam-close")?.addEventListener("click", () => {
    if (confirm("Are you sure you want to exit? Your exam progress will be lost.")) {
      closeCbtModal();
    }
  });
}

function closeCbtModal() {
  if (state.examTimerInterval) clearInterval(state.examTimerInterval);
  document.getElementById("cbt-exam-modal")?.classList.add("hidden");
}

function submitCbtExam() {
  if (state.examTimerInterval) clearInterval(state.examTimerInterval);

  let correctCount = 0;
  state.activeExam.questions.forEach((q, idx) => {
    if (state.userAnswers[idx] === q.correct) {
      correctCount++;
    }
  });

  const totalQuestions = state.activeExam.questions.length;
  const scaledScore = Math.round((correctCount / totalQuestions) * state.activeExam.totalMarks);

  // Update or insert into continuous assessment gradebook
  const existingGradeIndex = state.grades.findIndex(g => g.code === state.activeExam.code);
  if (existingGradeIndex >= 0) {
    state.grades[existingGradeIndex].ca1 = scaledScore;
    state.grades[existingGradeIndex].totalCa = state.grades[existingGradeIndex].ca1 + state.grades[existingGradeIndex].ca2;
    state.grades[existingGradeIndex].total = state.grades[existingGradeIndex].totalCa + state.grades[existingGradeIndex].exam;
    state.grades[existingGradeIndex].status = "Verified";
  } else {
    state.grades.push({
      code: state.activeExam.code,
      title: state.activeExam.title,
      ca1: scaledScore,
      ca2: 12,
      totalCa: scaledScore + 12,
      exam: 50,
      total: scaledScore + 12 + 50,
      grade: "A",
      status: "Verified"
    });
  }

  localStorage.setItem("afued_grades", JSON.stringify(state.grades));

  alert(`CBT Assessment Complete!\n\nCandidate: ${state.currentUser.name}\nScore: ${correctCount} / ${totalQuestions} Correct\nMarks Awarded: ${scaledScore} / ${state.activeExam.totalMarks} Marks\n\nYour score has been registered in the Senate Gradebook.`);
  
  closeCbtModal();
  renderStudentView();
  state.activeView = "gradebook";
  updateViewVisibility();
}

// Keyboard shortcuts for testing environment
function setupKeyboardShortcuts() {
  window.addEventListener("keydown", (e) => {
    const modal = document.getElementById("cbt-exam-modal");
    if (!modal || modal.classList.contains("hidden") || !state.activeExam) return;

    if (e.key === "ArrowLeft") {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex--;
        renderQuestion();
        renderPalette();
      }
    } else if (e.key === "ArrowRight") {
      if (state.currentQuestionIndex < state.activeExam.questions.length - 1) {
        state.currentQuestionIndex++;
        renderQuestion();
        renderPalette();
      }
    } else if (e.key === "1" || e.key.toLowerCase() === "a") {
      state.userAnswers[state.currentQuestionIndex] = 0;
      renderQuestion();
      renderPalette();
    } else if (e.key === "2" || e.key.toLowerCase() === "b") {
      state.userAnswers[state.currentQuestionIndex] = 1;
      renderQuestion();
      renderPalette();
    } else if (e.key === "3" || e.key.toLowerCase() === "c") {
      state.userAnswers[state.currentQuestionIndex] = 2;
      renderQuestion();
      renderPalette();
    } else if (e.key === "4" || e.key.toLowerCase() === "d") {
      state.userAnswers[state.currentQuestionIndex] = 3;
      renderQuestion();
      renderPalette();
    } else if (e.key.toLowerCase() === "f") {
      if (state.flaggedQuestions.has(state.currentQuestionIndex)) {
        state.flaggedQuestions.delete(state.currentQuestionIndex);
      } else {
        state.flaggedQuestions.add(state.currentQuestionIndex);
      }
      renderQuestion();
      renderPalette();
    }
  });
}

/* ==========================================================================
   Printable Official Result Slip Generator
   ========================================================================== */
function setupPrintSlipControls() {
  const printBtn = document.getElementById("btn-open-print-slip");
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      openPrintSlipModal();
    });
  }

  document.getElementById("btn-trigger-print")?.addEventListener("click", () => {
    window.print();
  });

  document.getElementById("btn-close-print-slip")?.addEventListener("click", () => {
    document.getElementById("print-slip-modal")?.classList.add("hidden");
  });
}

function openPrintSlipModal() {
  const modal = document.getElementById("print-slip-modal");
  if (!modal) return;

  modal.classList.remove("hidden");

  // Populate candidate metadata
  document.getElementById("slip-student-name").textContent = state.currentUser.name;
  document.getElementById("slip-student-matric").textContent = state.currentUser.matric;
  document.getElementById("slip-student-dept").textContent = state.currentUser.department;
  document.getElementById("slip-student-school").textContent = state.currentUser.school;
  document.getElementById("slip-student-level").textContent = state.currentUser.level;
  document.getElementById("slip-student-session").textContent = state.activeSession;
  document.getElementById("slip-date-printed").textContent = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  // Generate verification code
  const hash = "AFUED-" + Math.random().toString(36).substring(2, 9).toUpperCase() + "-" + Date.now().toString(36).toUpperCase();
  document.getElementById("slip-verification-hash").textContent = hash;

  // Render Grade Rows
  const slipTbody = document.getElementById("slip-grades-tbody");
  if (slipTbody) {
    slipTbody.innerHTML = "";
    state.grades.forEach(g => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td style="padding:6px 10px; border:1px solid #cbd5e1; font-weight:700;">${g.code}</td>
        <td style="padding:6px 10px; border:1px solid #cbd5e1;">${g.title}</td>
        <td style="padding:6px 10px; border:1px solid #cbd5e1; text-align:center;">${g.totalCa} / 30</td>
        <td style="padding:6px 10px; border:1px solid #cbd5e1; text-align:center;">${g.exam} / 70</td>
        <td style="padding:6px 10px; border:1px solid #cbd5e1; text-align:center; font-weight:800;">${g.total}</td>
        <td style="padding:6px 10px; border:1px solid #cbd5e1; text-align:center; font-weight:800; color:#0B532E;">${g.grade}</td>
      `;
      slipTbody.appendChild(row);
    });
  }
}

/* ==========================================================================
   Lecturer Portal: Create Assessment & Enter Scores
   ========================================================================== */
function setupLecturerControls() {
  document.getElementById("btn-submit-scores-senate")?.addEventListener("click", () => {
    alert("Continuous Assessment Marksheet successfully published to Senate Directorate & Student Portals for " + state.activeSession + "!");
  });

  document.getElementById("btn-open-create-assessment")?.addEventListener("click", () => {
    document.getElementById("create-assessment-modal")?.classList.remove("hidden");
  });

  document.getElementById("btn-close-create-modal")?.addEventListener("click", () => {
    document.getElementById("create-assessment-modal")?.classList.add("hidden");
  });

  document.getElementById("form-create-assessment")?.addEventListener("submit", (e) => {
    e.preventDefault();

    const code = document.getElementById("new-ass-code").value.trim().toUpperCase();
    const title = document.getElementById("new-ass-title").value.trim();
    const type = document.getElementById("new-ass-type").value;
    const duration = parseInt(document.getElementById("new-ass-duration").value) || 10;
    const marks = parseInt(document.getElementById("new-ass-marks").value) || 15;
    const q1Text = document.getElementById("new-q1-text").value.trim();
    const optA = document.getElementById("new-q1-a").value.trim();
    const optB = document.getElementById("new-q1-b").value.trim();
    const optC = document.getElementById("new-q1-c").value.trim();
    const optD = document.getElementById("new-q1-d").value.trim();
    const correct = parseInt(document.getElementById("new-q1-correct").value);

    if (!code || !title || !q1Text) {
      alert("Please fill in the course code, title, and question text.");
      return;
    }

    const newAss = {
      id: `${code.toLowerCase().replace(/\s+/g, '')}-${Date.now()}`,
      code,
      title,
      type,
      durationMinutes: duration,
      totalMarks: marks,
      dueDate: "Next Week",
      lecturer: state.currentUser.name || "Course Lecturer",
      status: "Available",
      questions: [
        {
          text: q1Text,
          options: [optA, optB, optC, optD],
          correct
        }
      ]
    };

    state.assessments.unshift(newAss);
    localStorage.setItem("afued_assessments", JSON.stringify(state.assessments));

    alert(`New CBT Continuous Assessment for ${code} successfully published!`);
    document.getElementById("create-assessment-modal")?.classList.add("hidden");
    document.getElementById("form-create-assessment").reset();
    renderStudentView();
    renderLecturerView();
  });
}

function renderLecturerView() {
  const container = document.getElementById("lecturer-assessments-list");
  if (!container) return;

  container.innerHTML = "";

  state.assessments.forEach(ass => {
    const item = document.createElement("div");
    item.className = "card";
    item.style.marginBottom = "1rem";
    item.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem;">
        <div>
          <div style="display:flex; gap:0.5rem; align-items:center; margin-bottom:0.35rem;">
            <span class="badge badge-green">${ass.code}</span>
            <span class="badge badge-gold">${ass.type}</span>
            <span style="font-size:0.75rem; color:var(--slate-500);">${ass.durationMinutes} Minutes | ${ass.questions.length} Questions</span>
          </div>
          <h3 style="font-size:1.15rem; font-weight:800; color:var(--slate-900);">${ass.title}</h3>
          <p style="font-size:0.8rem; color:var(--slate-500);">Allocated Continuous Assessment Marks: ${ass.totalMarks} Marks</p>
        </div>
        <div style="display:flex; gap:0.5rem;">
          <button class="btn btn-sm btn-secondary" onclick="alert('Viewing question bank for ${ass.code}')">Preview Questions</button>
          <button class="btn btn-sm btn-primary" onclick="alert('Assessment ${ass.code} is active for students in ${state.activeSession}')">Active in Portal</button>
        </div>
      </div>
    `;
    container.appendChild(item);
  });

  renderLecturerScoreTable();
}

function renderLecturerScoreTable() {
  const tbody = document.getElementById("lecturer-score-table-body");
  if (!tbody) return;

  tbody.innerHTML = "";

  STUDENTS.forEach((std, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${std.matric}</strong></td>
      <td>${std.name}</td>
      <td style="width:110px;">
        <input type="number" min="0" max="30" value="${idx === 0 ? 25 : (22 + idx)}" class="form-input score-input-ca" style="padding:0.35rem; text-align:center;" />
      </td>
      <td style="width:110px;">
        <input type="number" min="0" max="70" value="${idx === 0 ? 58 : (50 + idx * 2)}" class="form-input score-input-exam" style="padding:0.35rem; text-align:center;" />
      </td>
      <td style="text-align:center; font-weight:800; color:var(--afued-green);" class="row-total-score">
        ${idx === 0 ? 83 : (72 + idx * 3)}
      </td>
      <td style="text-align:center;">
        <span class="badge badge-green">Ready</span>
      </td>
    `;

    const caInput = tr.querySelector(".score-input-ca");
    const examInput = tr.querySelector(".score-input-exam");
    const totalEl = tr.querySelector(".row-total-score");

    const recalc = () => {
      const caVal = parseFloat(caInput.value) || 0;
      const examVal = parseFloat(examInput.value) || 0;
      totalEl.textContent = (caVal + examVal).toFixed(0);
    };

    caInput.addEventListener("input", recalc);
    examInput.addEventListener("input", recalc);

    tbody.appendChild(tr);
  });
}

/* ==========================================================================
   Admin View: ICT Directorate & Academic Session Management
   ========================================================================== */
function setupAdminControls() {
  document.getElementById("btn-admin-save-session")?.addEventListener("click", () => {
    const sessionInput = document.getElementById("admin-session-input");
    if (sessionInput && sessionInput.value.trim() !== "") {
      state.activeSession = sessionInput.value.trim();
      localStorage.setItem("afued_session", state.activeSession);
      renderSessionInfo();
      renderStudentView();
      alert(`Academic Session successfully set to: ${state.activeSession}. All student result slips and course registries updated.`);
    }
  });
}

function renderAdminView() {
  const sessionInput = document.getElementById("admin-session-input");
  if (sessionInput) {
    sessionInput.value = state.activeSession;
  }
}
