/* ==========================================
   STUDY WARRIORS
   Complete Learning & Quiz Engine
   ========================================== */

"use strict";

/* ---------- SETTINGS ---------- */

const SW = {
    language: "en",
    currentClass: "8",
    board: "NCERT",
    subject: "",
    chapter: "",
    questions: [],
    currentQuestion: 0,
    answers: {},
    review: [],
    submitted: false,
    mode: "study"
};

/* ---------- LANGUAGE TEXT ---------- */

const SW_TEXT = {
    en: {
        home: "Home",
        classes: "Choose Class",
        board: "Choose Board",
        subject: "Choose Subject",
        chapter: "Choose Chapter",
        start: "Start Test",
        next: "Next",
        previous: "Previous",
        skip: "Skip",
        review: "Mark for Review",
        clear: "Clear Answer",
        submit: "Submit Test",
        correct: "Correct Answer!",
        wrong: "Wrong Answer!",
        explanation: "Explanation",
        result: "Test Result",
        total: "Total Questions",
        right: "Correct",
        incorrect: "Incorrect",
        unanswered: "Unanswered",
        score: "Percentage",
        retry: "Retry Test",
        back: "Back",
        noQuestions: "Questions are not available yet.",
        select: "Select",
        mentality: "Mentality Test",
        mentalMath: "Mental Maths",
        maths: "Mathematics Practice",
        reasoning: "Logical Reasoning",
        verbal: "Verbal Reasoning",
        nonverbal: "Non-Verbal Reasoning",
        puzzles: "Puzzles",
        speed: "Speed Test",
        iq: "IQ Practice",
        marked: "Marked for Review",
        completed: "Test Completed",
        question: "Question",
        of: "of"
    },

    hi: {
        home: "होम",
        classes: "कक्षा चुनें",
        board: "बोर्ड चुनें",
        subject: "विषय चुनें",
        chapter: "अध्याय चुनें",
        start: "टेस्ट शुरू करें",
        next: "अगला",
        previous: "पिछला",
        skip: "छोड़ें",
        review: "रिव्यू के लिए मार्क करें",
        clear: "उत्तर हटाएँ",
        submit: "टेस्ट जमा करें",
        correct: "सही उत्तर!",
        wrong: "गलत उत्तर!",
        explanation: "व्याख्या",
        result: "टेस्ट का परिणाम",
        total: "कुल प्रश्न",
        right: "सही उत्तर",
        incorrect: "गलत उत्तर",
        unanswered: "बिना उत्तर वाले",
        score: "प्रतिशत",
        retry: "दोबारा टेस्ट दें",
        back: "वापस",
        noQuestions: "अभी इस अध्याय के प्रश्न उपलब्ध नहीं हैं।",
        select: "चुनें",
        mentality: "मेंटलिटी टेस्ट",
        mentalMath: "मेंटल मैथ्स",
        maths: "मैथ्स प्रैक्टिस",
        reasoning: "लॉजिकल रीजनिंग",
        verbal: "वर्बल रीजनिंग",
        nonverbal: "नॉन-वर्बल रीजनिंग",
        puzzles: "पहेलियाँ",
        speed: "स्पीड टेस्ट",
        iq: "IQ प्रैक्टिस",
        marked: "रिव्यू के लिए मार्क किए गए",
        completed: "टेस्ट पूरा हुआ",
        question: "प्रश्न",
        of: "में से"
    }
};

const SW_MENTALITY = {
    "Mental Maths": "mentalMath",
    "Mathematics Practice": "maths",
    "Logical Reasoning": "reasoning",
    "Verbal Reasoning": "verbal",
    "Non-Verbal Reasoning": "nonverbal",
    "Puzzles": "puzzles",
    "Speed Test": "speed",
    "IQ Practice": "iq"
};

/* ---------- HELPERS ---------- */

function SW_t(key) {
    return SW_TEXT[SW.language][key] || key;
}

function SW_escape(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function SW_local(value) {
    if (typeof value === "string") return value;
    if (value && typeof value === "object") {
        return value[SW.language] || value.en || value.hi || "";
    }
    return "";
}

function SW_bank() {
    return window.SW_QUESTION_BANK || {};
}

function SW_app() {
    let app = document.getElementById("study-warriors-app");

    if (!app) {
        app = document.createElement("div");
        app.id = "study-warriors-app";

        const footer = document.querySelector("footer");

        if (footer) {
            document.body.insertBefore(app, footer);
        } else {
            document.body.appendChild(app);
        }
    }

    return app;
}

/* ---------- LANGUAGE ---------- */

function SW_setLanguage(language) {
    if (!SW_TEXT[language]) return;

    SW.language = language;
    document.documentElement.lang = language;

    SW_renderApp();
}

/* ---------- NAVIGATION ---------- */

function SW_selectClass(classNumber) {
    SW.currentClass = String(classNumber);
    SW.subject = "";
    SW.chapter = "";
    SW.mode = "study";

    SW_renderApp();
}

function SW_selectBoard(board) {
    SW.board = board;
    SW.subject = "";
    SW.chapter = "";

    SW_renderApp();
}

function SW_selectSubject(subject) {
    SW.subject = subject;
    SW.chapter = "";

    SW_renderApp();
}

function SW_selectChapter(chapter) {
    SW.chapter = chapter;

    const chapters =
        SW_bank()[SW.currentClass]?.[SW.board]?.[SW.subject];

    const questions = Array.isArray(chapters)
        ? chapters
        : chapters?.[chapter];

    if (!Array.isArray(questions) || questions.length === 0) {
        alert(SW_t("noQuestions"));
        return;
    }

    SW_startQuiz(questions, "study");
}

/* ---------- MENTALITY TEST ---------- */

function SW_openMentality() {
    SW.mode = "mentality";
    SW_renderApp();
}

function SW_startMentality(category) {
    const data = window.SW_MENTALITY_TESTS?.[category];

    let questions = [];

    if (Array.isArray(data)) {
        questions = data;
    } else if (data && typeof data === "object") {
        Object.values(data).forEach(value => {
            if (Array.isArray(value)) {
                questions.push(...value);
            }
        });
    }

    if (!questions.length) {
        alert(SW_t("noQuestions"));
        return;
    }

    SW_startQuiz(questions, "mentality");
}

/* ---------- START QUIZ ---------- */

function SW_startQuiz(questions, mode) {
    SW.questions = [...questions];
    SW.currentQuestion = 0;
    SW.answers = {};
    SW.review = [];
    SW.submitted = false;
    SW.mode = mode;

    SW_showQuestion();
}

/* ---------- SHOW QUESTION ---------- */

function SW_showQuestion() {
    const app = SW_app();
    const question = SW.questions[SW.currentQuestion];

    if (!question) {
        SW_showResult();
        return;
    }

    const total = SW.questions.length;
    const selected = SW.answers[SW.currentQuestion];
    const marked = SW.review.includes(SW.currentQuestion);

    const options = SW_local(question.options) ||
        question.options?.[SW.language] ||
        question.options?.en ||
        question.options?.hi ||
        [];

    let html = `
        <section class="quiz-box">

            <h2>${SW_t("question")} 
            ${SW.currentQuestion + 1} ${SW_t("of")} ${total}</h2>

            <p>${SW_t("marked")}: ${SW.review.length}</p>

            <h3>${SW_escape(SW_local(question.question))}</h3>

            <div id="sw-options">
    `;

    options.forEach((option, index) => {
        let className = "quiz-option";

        if (selected === index) className += " selected";

        if (SW.submitted) {
            if (index === question.answer) className += " correct";
            else if (selected === index) className += " wrong";
        }

        html += `
            <button
                class="${className}"
                data-option="${index}"
                ${SW.submitted ? "disabled" : ""}
            >
                ${SW_escape(option)}
            </button>
        `;
    });

    html += `
            </div>

            <div id="sw-feedback"></div>

            <div class="quiz-controls">

                <button id="sw-previous"
                    ${SW.currentQuestion === 0 ? "disabled" : ""}>
                    ${SW_t("previous")}
                </button>

                <button id="sw-skip" ${SW.submitted ? "disabled" : ""}>
                    ${SW_t("skip")}
                </button>

                <button id="sw-review" ${SW.submitted ? "disabled" : ""}>
                    ${marked ? "✓ " : ""}${SW_t("review")}
                </button>

                <button id="sw-clear" ${selected === undefined || SW.submitted ? "disabled" : ""}>
                    ${SW_t("clear")}
                </button>

                <button id="sw-next">
                    ${SW.currentQuestion === total - 1
                        ? SW_t("submit")
                        : SW_t("next")}
                </button>

            </div>

            <button id="sw-submit">
                ${SW_t("submit")}
            </button>

        </section>
    `;

    app.innerHTML = html;

    document.querySelectorAll("[data-option]").forEach(button => {
        button.addEventListener("click", () => {
            SW_selectAnswer(Number(button.dataset.option));
        });
    });

    document.getElementById("sw-previous")
        .addEventListener("click", SW_previous);

    document.getElementById("sw-next")
        .addEventListener("click", () => {
            if (SW.currentQuestion === total - 1) {
                SW_showResult();
            } else {
                SW_next();
            }
        });

    document.getElementById("sw-skip")
        .addEventListener("click", SW_next);

    document.getElementById("sw-review")
        .addEventListener("click", SW_toggleReview);

    document.getElementById("sw-clear")
        .addEventListener("click", SW_clearAnswer);

    document.getElementById("sw-submit")
        .addEventListener("click", SW_showResult);

    if (SW.submitted) {
        SW_showFeedback(question);
    }
}

/* ---------- ANSWER ---------- */

function SW_selectAnswer(index) {
    if (SW.submitted) return;

    SW.answers[SW.currentQuestion] = index;
    SW_showQuestion();
}

function SW_clearAnswer() {
    delete SW.answers[SW.currentQuestion];
    SW_showQuestion();
}

function SW_toggleReview() {
    const index = SW.currentQuestion;

    if (SW.review.includes(index)) {
        SW.review = SW.review.filter(item => item !== index);
    } else {
        SW.review.push(index);
    }

    SW_showQuestion();
}

/* ---------- QUESTION MOVEMENT ---------- */

function SW_next() {
    if (SW.currentQuestion < SW.questions.length - 1) {
        SW.currentQuestion++;
        SW_showQuestion();
    }
}

function SW_previous() {
    if (SW.currentQuestion > 0) {
        SW.currentQuestion--;
        SW_showQuestion();
    }
}

/* ---------- FEEDBACK ---------- */

function SW_showFeedback(question) {
    const feedback = document.getElementById("sw-feedback");
    if (!feedback) return;

    const selected = SW.answers[SW.currentQuestion];

    let html = "";

    if (selected === question.answer) {
        html += `<h3 style="color:#20c878">✓ ${SW_t("correct")}</h3>`;
    } else if (selected === undefined) {
        html += `<h3>${SW_t("unanswered")}</h3>`;
    } else {
        html += `<h3 style="color:#ff4d5e">✗ ${SW_t("wrong")}</h3>`;
    }

    html += `
        <p class="explanation">
            ${SW_t("explanation")}:
            ${SW_escape(SW_local(question.explanation))}
        </p>
    `;

    feedback.innerHTML = html;
}

/* ---------- RESULT ---------- */

function SW_showResult() {
    SW.submitted = true;

    let correct = 0;
    let wrong = 0;
    let unanswered = 0;

    SW.questions.forEach((question, index) => {
        if (SW.answers[index] === undefined) {
            unanswered++;
        } else if (SW.answers[index] === question.answer) {
            correct++;
        } else {
            wrong++;
        }
    });

    const total = SW.questions.length;
    const percentage = total
        ? Math.round(correct / total * 100)
        : 0;

    const app = SW_app();

    app.innerHTML = `
        <section class="result-box">

            <h2>${SW_t("completed")}</h2>
            <h3>${SW_t("result")}</h3>

            <p>${SW_t("total")}: ${total}</p>

            <p style="color:#20c878">
                ${SW_t("right")}: ${correct}
            </p>

            <p style="color:#ff4d5e">
                ${SW_t("incorrect")}: ${wrong}
            </p>

            <p>${SW_t("unanswered")}: ${unanswered}</p>

            <h2>${SW_t("score")}: ${percentage}%</h2>

            <button id="sw-retry">${SW_t("retry")}</button>

            <button id="sw-review-answers">
                ${SW_t("review")}
            </button>

        </section>
    `;

    document.getElementById("sw-retry")
        .addEventListener("click", () => {
            SW_startQuiz(SW.questions, SW.mode);
        });

    document.getElementById("sw-review-answers")
        .addEventListener("click", () => {
            SW.currentQuestion = 0;
            SW_showQuestion();
        });
}

/* ---------- MAIN SCREEN ---------- */

function SW_renderApp() {
    const app = SW_app();

    const bank = SW_bank();
    const t = SW_t;

    let html = `
        <section id="sw-learning">

            <div class="language-switch">
                <button id="sw-en">English</button>
                <button id="sw-hi">हिंदी</button>
            </div>

            <h2>STUDY WARRIORS</h2>

            <h3>${t("classes")}</h3>

            <div class="cards">
    `;

    ["8", "9", "10"].forEach(classNumber => {
        html += `
            <div class="card">
                <h3>Class ${classNumber}</h3>
                <button data-class="${classNumber}">
                    ${t("select")}
                </button>
            </div>
        `;
    });

    html += `
            </div>

            <h3>${t("board")}</h3>

            <div class="cards">
                <button data-board="NCERT">NCERT</button>
                <button data-board="BSEB">Bihar Board</button>
            </div>

            <h3>${t("subject")}: Class ${SW.currentClass}</h3>

            <div class="cards">
    `;

    const subjects = bank[SW.currentClass]?.[SW.board] || {};

    Object.keys(subjects).forEach(subject => {
        html += `
            <div class="card">
                <h3>${SW_escape(subject)}</h3>
                <button data-subject="${SW_escape(subject)}">
                    ${t("select")}
                </button>
            </div>
        `;
    });

    html += `</div>`;

    if (SW.subject) {
        const chapters = subjects[SW.subject] || {};

        html += `<h3>${t("chapter")}: ${SW_escape(SW.subject)}</h3>`;
        html += `<div class="cards">`;

        if (Array.isArray(chapters)) {
            html += `
                <button data-chapter="default">
                    ${t("start")}
                </button>
            `;
        } else {
            Object.keys(chapters).forEach(chapter => {
                html += `
                    <div class="card">
                        <h3>${SW_escape(chapter)}</h3>
                        <button data-chapter="${SW_escape(chapter)}">
                            ${t("start")}
                        </button>
                    </div>
                `;
            });
        }

        html += `</div>`;
    }

    html += `
            <hr>

            <h2>${t("mentality")}</h2>

            <div class="cards">
    `;

    Object.entries(SW_MENTALITY).forEach(([category, key]) => {
        html += `
            <div class="card">
                <h3>${t(key)}</h3>
                <button data-mentality="${SW_escape(category)}">
                    ${t("start")}
                </button>
            </div>
        `;
    });

    html += `
            </div>
        </section>
    `;

    app.innerHTML = html;

    document.getElementById("sw-en")
        .addEventListener("click", () => SW_setLanguage("en"));

    document.getElementById("sw-hi")
        .addEventListener("click", () => SW_setLanguage("hi"));

    document.querySelectorAll("[data-class]").forEach(button => {
        button.addEventListener("click", () => {
            SW_selectClass(button.dataset.class);
        });
    });

    document.querySelectorAll("[data-board]").forEach(button => {
        button.addEventListener("click", () => {
            SW_selectBoard(button.dataset.board);
        });
    });

    document.querySelectorAll("[data-subject]").forEach(button => {
        button.addEventListener("click", () => {
            SW_selectSubject(button.dataset.subject);
        });
    });

    document.querySelectorAll("[data-chapter]").forEach(button => {
        button.addEventListener("click", () => {
            SW_selectChapter(button.dataset.chapter);
        });
    });

    document.querySelectorAll("[data-mentality]").forEach(button => {
        button.addEventListener("click", () => {
            SW_startMentality(button.dataset.mentality);
        });
    });
}

/* ---------- START WEBSITE ---------- */

document.addEventListener("DOMContentLoaded", () => {
    SW_renderApp();
    console.log("Study Warriors loaded successfully!");
});
