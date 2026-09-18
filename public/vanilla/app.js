/**
 * Adeyemi Federal University of Education (AFUED)
 * Continuous Assessment & CBT System
 * Pure Vanilla JavaScript Application Logic
 */

// Application State
const state = {
  activeSession: localStorage.getItem('afued_active_session') || '2024/2025',
  currentRole: 'student', // 'student' | 'lecturer' | 'admin'
  currentUser: {
    student: {
      name: 'Adewale T. Babatunde',
      matric: 'AFUED/2021/CSC/0481',
      programme: 'B.Sc. (Ed) Computer Science',
      level: '300 Level',
      faculty: 'School of Science',
      department: 'Computer Science'
    },
    lecturer: {
      name: 'Dr. (Mrs) K. E. Adeleke',
      staffId: 'AFUED/STF/0892',
      faculty: 'School of Science',
      department: 'Computer Science',
      assignedCourses: ['CSC 301', 'CSC 305']
    }
  },
  assessments: [
    {
      id: 'csc-301-ca1',
      code: 'CSC 301',
      title: 'Operating Systems & Concurrency',
      type: 'Continuous Assessment (CA)',
      totalMarks: 30,
      durationMinutes: 15,
      status: 'AVAILABLE',
      score: null,
      questions: [
        {
          id: 1,
          text: 'Which CPU scheduling algorithm gives the minimum average waiting time for a given set of processes?',
          options: ['First-Come, First-Served (FCFS)', 'Shortest Job First (SJF)', 'Round Robin (RR)', 'Priority Scheduling'],
          correct: 1
        },
        {
          id: 2,
          text: 'What is a critical section in concurrent programming?',
          options: [
            'A piece of code that accesses shared resources that must not be concurrently accessed by more than one thread',
            'The main bootloader code in the kernel',
            'A designated sector on secondary storage',
            'An error condition caused by integer overflow'
          ],
          correct: 0
        },
        {
          id: 3,
          text: 'Which of the following is NOT one of Coffman’s four necessary conditions for deadlock?',
          options: ['Mutual Exclusion', 'Hold and Wait', 'Preemption Allowed', 'Circular Wait'],
          correct: 2
        },
        {
          id: 4,
          text: 'Virtual memory is primarily implemented through which operating system mechanism?',
          options: ['Direct Cache Mapping', 'Paging and Segmentation', 'Bus Master Arbitration', 'DMA controllers'],
          correct: 1
        },
        {
          id: 5,
          text: 'What is the purpose of the TLB (Translation Lookaside Buffer)?',
          options: ['To speed up virtual address translation', 'To buffer audio output', 'To store disk blocks', 'To manage USB devices'],
          correct: 0
        }
      ]
    },
    {
      id: 'csc-305-ca2',
      code: 'CSC 305',
      title: 'Database Design & SQL Architecture',
      type: 'Mid-Semester Test',
      totalMarks: 30,
      durationMinutes: 20,
      status: 'AVAILABLE',
      score: null,
      questions: [
        {
          id: 1,
          text: 'Which normal form eliminates partial dependency on a composite candidate key?',
          options: ['First Normal Form (1NF)', 'Second Normal Form (2NF)', 'Third Normal Form (3NF)', 'Boyce-Codd Normal Form (BCNF)'],
          correct: 1
        },
        {
          id: 2,
          text: 'What SQL keyword is used to eliminate duplicate records from a query result?',
          options: ['UNIQUE', 'DISTINCT', 'DIFFERENT', 'ISOLATE'],
          correct: 1
        },
        {
          id: 3,
          text: 'What does ACID stand for in transaction processing?',
          options: [
            'Atomicity, Consistency, Isolation, Durability',
            'Accuracy, Control, Integrity, Data',
            'Availability, Concurrency, Indexing, Delivery',
            'Access, Cache, Interaction, Durability'
          ],
          correct: 0
        }
      ]
    },
    {
      id: 'edu-311-test',
      code: 'EDU 311',
      title: 'Educational Technology & Media',
      type: 'Test',
      totalMarks: 20,
      durationMinutes: 15,
      status: 'AVAILABLE',
      score: null,
      questions: [
        {
          id: 1,
          text: 'According to Edgar Dale’s Cone of Experience, which learning activity yields the highest retention rate?',
          options: ['Reading text', 'Hearing words', 'Direct purposeful experience / Simulation', 'Viewing static pictures'],
          correct: 2
        },
        {
          id: 2,
          text: 'In the ASSURE instructional model, what does the first "S" stand for?',
          options: ['State Objectives', 'Select Media', 'Standardize Testing', 'Synthesize Resources'],
          correct: 0
        }
      ]
    },
    {
      id: 'csc-303-exam',
      code: 'CSC 303',
      title: 'Algorithms & Complexity Analysis',
      type: 'Examination',
      totalMarks: 70,
      durationMinutes: 60,
      status: 'AVAILABLE',
      score: null,
      questions: [
        {
          id: 1,
          text: 'What is the tight worst-case time complexity of merge sort on an array of size n?',
          options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2^n)'],
          correct: 1
        },
        {
          id: 2,
          text: 'Which algorithm design paradigm does Dijkstra’s Single-Source Shortest Path algorithm employ?',
          options: ['Greedy Method', 'Dynamic Programming', 'Backtracking', 'Branch and Bound'],
          correct: 0
        }
      ]
    }
  ],
  activeExam: {
    assessment: null,
    currentQuestionIndex: 0,
    answers: {},
    timeRemainingSeconds: 0,
    timerInterval: null
  }
};

// DOM Elements
const el = {
  topSessionText: document.getElementById('top-session-text'),
  activeSessionBadge: document.getElementById('active-session-badge'),
  studentView: document.getElementById('student-view'),
  lecturerView: document.getElementById('lecturer-view'),
  adminView: document.getElementById('admin-view'),
  roleTabs: document.querySelectorAll('.role-tab'),
  examModal: document.getElementById('exam-modal'),
  resultModal: document.getElementById('result-modal'),
  cbtCourseTitle: document.getElementById('cbt-course-title'),
  cbtTimer: document.getElementById('cbt-timer'),
  cbtQuestionContainer: document.getElementById('cbt-question-container'),
  cbtPalette: document.getElementById('cbt-palette'),
  btnPrevQuestion: document.getElementById('btn-prev-question'),
  btnNextQuestion: document.getElementById('btn-next-question'),
  btnSubmitExam: document.getElementById('btn-submit-exam'),
  btnCloseExam: document.getElementById('btn-close-exam'),
  studentAssessmentsList: document.getElementById('student-assessments-list'),
  adminSessionInput: document.getElementById('admin-session-input'),
  adminSessionSaveBtn: document.getElementById('admin-session-save-btn')
};

// Initialize Application
function initApp() {
  updateSessionUI();
  setupRoleSwitching();
  renderStudentAssessments();
  setupAdminControls();
}

// Update Active Academic Session in UI
function updateSessionUI() {
  const sessionText = `${state.activeSession} Academic Session Continuous Assessment Portal Active`;
  if (el.topSessionText) el.topSessionText.textContent = sessionText;
  if (el.activeSessionBadge) el.activeSessionBadge.textContent = state.activeSession;
  
  const studentSessionElem = document.getElementById('student-current-session');
  if (studentSessionElem) studentSessionElem.textContent = state.activeSession;
}

// Role Switching Handler
function setupRoleSwitching() {
  el.roleTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const role = tab.getAttribute('data-role');
      state.currentRole = role;

      el.roleTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      if (el.studentView) el.studentView.style.display = role === 'student' ? 'block' : 'none';
      if (el.lecturerView) el.lecturerView.style.display = role === 'lecturer' ? 'block' : 'none';
      if (el.adminView) el.adminView.style.display = role === 'admin' ? 'block' : 'none';
    });
  });
}

// Render Student Assessments
function renderStudentAssessments() {
  if (!el.studentAssessmentsList) return;
  el.studentAssessmentsList.innerHTML = '';

  state.assessments.forEach(ass => {
    const card = document.createElement('div');
    card.className = 'assessment-item';
    const isCompleted = ass.score !== null;

    card.innerHTML = `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
          <span style="font-weight: 800; color: var(--afued-green); font-size: 1.1rem;">${ass.code}</span>
          <span class="badge ${isCompleted ? 'badge-green' : 'badge-gold'}">
            ${isCompleted ? 'COMPLETED' : 'AVAILABLE'}
          </span>
        </div>
        <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--slate-900); margin-bottom: 0.25rem;">
          ${ass.title}
        </h4>
        <p style="font-size: 0.75rem; color: var(--slate-600); margin-bottom: 0.75rem;">
          ${ass.type} • <strong>${ass.totalMarks} Marks</strong> • Duration: ${ass.durationMinutes} Mins
        </p>
      </div>
      <div style="border-top: 1px solid var(--slate-200); padding-top: 0.75rem; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 0.8rem; font-weight: 600; color: ${isCompleted ? 'var(--afued-green)' : 'var(--slate-600)'}">
          ${isCompleted ? `Score: ${ass.score} / ${ass.totalMarks}` : 'Not yet attempted'}
        </span>
        <button class="btn btn-sm ${isCompleted ? 'btn-secondary' : 'btn-primary'}" data-id="${ass.id}">
          ${isCompleted ? 'View Result' : 'Start CBT Test'}
        </button>
      </div>
    `;

    const actionBtn = card.querySelector('button');
    actionBtn.addEventListener('click', () => {
      if (isCompleted) {
        showResultSlip(ass);
      } else {
        startCBT(ass.id);
      }
    });

    el.studentAssessmentsList.appendChild(card);
  });
}

// Start CBT Exam
function startCBT(assessmentId) {
  const ass = state.assessments.find(a => a.id === assessmentId);
  if (!ass) return;

  state.activeExam.assessment = ass;
  state.activeExam.currentQuestionIndex = 0;
  state.activeExam.answers = {};
  state.activeExam.timeRemainingSeconds = ass.durationMinutes * 60;

  if (el.cbtCourseTitle) {
    el.cbtCourseTitle.textContent = `${ass.code} - ${ass.title} (${ass.type})`;
  }

  // Start Countdown Timer
  if (state.activeExam.timerInterval) clearInterval(state.activeExam.timerInterval);
  updateTimerDisplay();
  state.activeExam.timerInterval = setInterval(() => {
    state.activeExam.timeRemainingSeconds--;
    updateTimerDisplay();

    if (state.activeExam.timeRemainingSeconds <= 0) {
      clearInterval(state.activeExam.timerInterval);
      alert('Time has expired! Submitting your test automatically.');
      submitCBT();
    }
  }, 1000);

  renderQuestion();
  renderPalette();

  if (el.examModal) el.examModal.classList.remove('hidden');
}

// Update Timer Display
function updateTimerDisplay() {
  if (!el.cbtTimer) return;
  const m = Math.floor(state.activeExam.timeRemainingSeconds / 60);
  const s = state.activeExam.timeRemainingSeconds % 60;
  el.cbtTimer.textContent = `⏱ ${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// Render Question in CBT
function renderQuestion() {
  const ass = state.activeExam.assessment;
  const idx = state.activeExam.currentQuestionIndex;
  const q = ass.questions[idx];

  el.cbtQuestionContainer.innerHTML = `
    <div class="question-box">
      <div style="font-size: 0.8rem; font-weight: 700; color: var(--afued-green); margin-bottom: 0.25rem;">
        Question ${idx + 1} of ${ass.questions.length}
      </div>
      <div class="question-text">${q.text}</div>
      <div class="options-list">
        ${q.options.map((opt, optIdx) => {
          const isSelected = state.activeExam.answers[q.id] === optIdx;
          return `
            <div class="option-label ${isSelected ? 'selected' : ''}" data-opt="${optIdx}">
              <input type="radio" name="opt-${q.id}" ${isSelected ? 'checked' : ''} style="cursor: pointer;" />
              <span>${opt}</span>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  // Attach radio clicks
  el.cbtQuestionContainer.querySelectorAll('.option-label').forEach(label => {
    label.addEventListener('click', () => {
      const optVal = parseInt(label.getAttribute('data-opt'), 10);
      state.activeExam.answers[q.id] = optVal;
      renderQuestion();
      renderPalette();
    });
  });

  // Toggle prev/next button state
  if (el.btnPrevQuestion) el.btnPrevQuestion.disabled = idx === 0;
  if (el.btnNextQuestion) el.btnNextQuestion.disabled = idx === ass.questions.length - 1;
}

// Render Question Palette
function renderPalette() {
  if (!el.cbtPalette) return;
  el.cbtPalette.innerHTML = '';
  const ass = state.activeExam.assessment;

  ass.questions.forEach((q, i) => {
    const btn = document.createElement('button');
    btn.className = 'palette-btn';
    btn.textContent = i + 1;

    if (i === state.activeExam.currentQuestionIndex) {
      btn.classList.add('active');
    }
    if (state.activeExam.answers[q.id] !== undefined) {
      btn.classList.add('answered');
    }

    btn.addEventListener('click', () => {
      state.activeExam.currentQuestionIndex = i;
      renderQuestion();
      renderPalette();
    });

    el.cbtPalette.appendChild(btn);
  });
}

// Submit CBT Exam
function submitCBT() {
  if (state.activeExam.timerInterval) {
    clearInterval(state.activeExam.timerInterval);
  }

  const ass = state.activeExam.assessment;
  let correctCount = 0;

  ass.questions.forEach(q => {
    if (state.activeExam.answers[q.id] === q.correct) {
      correctCount++;
    }
  });

  const scaledScore = Math.round((correctCount / ass.questions.length) * ass.totalMarks);
  ass.score = scaledScore;

  if (el.examModal) el.examModal.classList.add('hidden');
  renderStudentAssessments();
  showResultSlip(ass);
}

// Show Printable Result Slip
function showResultSlip(ass) {
  const slipContainer = document.getElementById('slip-content');
  if (!slipContainer) return;

  const percentage = Math.round((ass.score / ass.totalMarks) * 100);
  const grade = percentage >= 70 ? 'A (Excellent)' : percentage >= 60 ? 'B (Very Good)' : percentage >= 50 ? 'C (Credit)' : 'F (Fail)';

  slipContainer.innerHTML = `
    <div id="printable-slip" style="padding: 1.5rem; border: 2px solid var(--afued-green); border-radius: 8px; background: white;">
      <div style="text-align: center; border-bottom: 2px solid var(--afued-green); padding-bottom: 1rem; margin-bottom: 1.5rem;">
        <h2 style="color: var(--afued-green); font-size: 1.3rem; font-weight: 800; text-transform: uppercase;">
          Adeyemi Federal University of Education, Ondo
        </h2>
        <p style="font-size: 0.8rem; font-weight: 700; color: var(--slate-700);">
          Directorate of Information & Communication Technology (DICT)
        </p>
        <p style="font-size: 0.85rem; font-weight: 800; color: #b45309; margin-top: 0.25rem;">
          OFFICIAL CONTINUOUS ASSESSMENT SCORE REPORT
        </p>
        <span style="font-size: 0.75rem; background: #ecfdf5; color: var(--afued-green); padding: 0.2rem 0.6rem; border-radius: 4px; font-weight: bold;">
          Academic Session: ${state.activeSession} • First Semester
        </span>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.85rem; margin-bottom: 1.5rem; background: var(--slate-50); padding: 1rem; border-radius: 6px;">
        <div><strong>Student Name:</strong> ${state.currentUser.student.name}</div>
        <div><strong>Matric Number:</strong> ${state.currentUser.student.matric}</div>
        <div><strong>Programme:</strong> ${state.currentUser.student.programme}</div>
        <div><strong>Level:</strong> ${state.currentUser.student.level}</div>
      </div>

      <table class="data-table" style="margin-bottom: 1.5rem;">
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Course Title</th>
            <th>Assessment Component</th>
            <th>Max Marks</th>
            <th>Score Obtained</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>${ass.code}</strong></td>
            <td>${ass.title}</td>
            <td>${ass.type}</td>
            <td>${ass.totalMarks}</td>
            <td style="font-weight: 800; color: var(--afued-green); font-size: 1.1rem;">${ass.score}</td>
            <td><strong>${grade}</strong></td>
          </tr>
        </tbody>
      </table>

      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 2rem; padding-top: 1rem; border-top: 1px dashed var(--slate-300); font-size: 0.75rem; color: var(--slate-600);">
        <div>
          <p>Generated: ${new Date().toLocaleString()}</p>
          <p>Portal Verification Hash: AFUED-VER-${Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
        </div>
        <div style="text-align: center;">
          <div style="width: 160px; border-bottom: 1px solid #000; margin-bottom: 4px;"></div>
          <p style="font-weight: 700;">HOD / Examiner Signature</p>
        </div>
      </div>
    </div>
  `;

  if (el.resultModal) el.resultModal.classList.remove('hidden');
}

// Setup Admin Academic Session Controller
function setupAdminControls() {
  if (el.adminSessionSaveBtn && el.adminSessionInput) {
    el.adminSessionInput.value = state.activeSession;

    el.adminSessionSaveBtn.addEventListener('click', () => {
      const newSession = el.adminSessionInput.value.trim();
      if (!newSession) return;

      state.activeSession = newSession;
      localStorage.setItem('afued_active_session', newSession);
      updateSessionUI();
      alert(`Academic session successfully updated to: ${newSession}`);
    });
  }

  // Next / Prev button wiring for CBT
  if (el.btnPrevQuestion) {
    el.btnPrevQuestion.addEventListener('click', () => {
      if (state.activeExam.currentQuestionIndex > 0) {
        state.activeExam.currentQuestionIndex--;
        renderQuestion();
        renderPalette();
      }
    });
  }

  if (el.btnNextQuestion) {
    el.btnNextQuestion.addEventListener('click', () => {
      const ass = state.activeExam.assessment;
      if (ass && state.activeExam.currentQuestionIndex < ass.questions.length - 1) {
        state.activeExam.currentQuestionIndex++;
        renderQuestion();
        renderPalette();
      }
    });
  }

  if (el.btnSubmitExam) {
    el.btnSubmitExam.addEventListener('click', () => {
      if (confirm('Are you sure you want to submit your assessment? Once submitted, your score is final.')) {
        submitCBT();
      }
    });
  }

  if (el.btnCloseExam) {
    el.btnCloseExam.addEventListener('click', () => {
      if (confirm('Closing this window will cancel your current exam attempt. Continue?')) {
        if (state.activeExam.timerInterval) clearInterval(state.activeExam.timerInterval);
        if (el.examModal) el.examModal.classList.add('hidden');
      }
    });
  }

  // Close Result Modal
  const closeResultBtn = document.getElementById('btn-close-result');
  if (closeResultBtn) {
    closeResultBtn.addEventListener('click', () => {
      if (el.resultModal) el.resultModal.classList.add('hidden');
    });
  }

  // Print Result Modal
  const printResultBtn = document.getElementById('btn-print-result');
  if (printResultBtn) {
    printResultBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

// Start on DOM ready
document.addEventListener('DOMContentLoaded', initApp);
