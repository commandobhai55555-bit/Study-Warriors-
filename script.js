/* =========================================================
   STUDY WARRIORS — QUIZ ENGINE V2
   ========================================================= */

"use strict";

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
    mode: "study",
    important: [],
    view: "home"
};

const SW_TEXT = {
    en: {
        classes: "Choose Class",
        board: "Choose Board",
        subject: "Choose Subject",
        chapter: "Choose Chapter",
        start: "Start Test",
        next: "Next",
        previous: "Previous",
        skip: "Skip",
        mark: "Mark for Review",
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
        marked: "Marked for Review",
        completed: "Test Completed",
        question: "Question",
        of: "of",
        important: "Important Questions & Answers",
        showImportant: "Important Q&A",
        answer: "Answer",
        reviewAnswers: "Review Answers",
        home: "Home",
        noImportant: "Important Q&A are not available yet."
    },

    hi: {
        classes: "कक्षा चुनें",
        board: "बोर्ड चुनें",
        subject: "विषय चुनें",
        chapter: "अध्याय चुनें",
        start: "टेस्ट शुरू करें",
        next: "अगला",
        previous: "पिछला",
        skip: "छोड़ें",
        mark: "रिव्यू के लिए मार्क करें",
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
        noQuestions: "अभी प्रश्न उपलब्ध नहीं हैं।",
        select: "चुनें",
        mentality: "मेंटलिटी टेस्ट",
        marked: "रिव्यू के लिए मार्क",
        completed: "टेस्ट पूरा हुआ",
        question: "प्रश्न",
        of: "में से",
        important: "महत्वपूर्ण प्रश्न और उत्तर",
        showImportant: "महत्वपूर्ण प्रश्न",
        answer: "उत्तर",
        reviewAnswers: "उत्तर देखें",
        home: "होम",
        noImportant: "अभी महत्वपूर्ण प्रश्न-उत्तर उपलब्ध नहीं हैं।"
    }
};

const SW_MENTALITY = {
    "Mental Maths": "Mental Maths",
    "Mathematics Practice": "Mathematics Practice",
    "Logical Reasoning": "Logical Reasoning",
    "Verbal Reasoning": "Verbal Reasoning",
    "Non-Verbal Reasoning": "Non-Verbal Reasoning",
    "Puzzles": "Puzzles",
    "Speed Test": "Speed Test",
    "IQ Practice": "IQ Practice"
};

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
        return value[SW.language] ?? value.en ?? value.hi ?? "";
    }

    return "";
}

function SW_bank() {
    return window.SW_QUESTION_BANK || {};
}

function SW_app() {
    let app = document.getElementById("study-warriors-app");

    if (!app) {
        app = document.createElement("main");
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

/* LANGUAGE */

function SW_setLanguage(language) {
    if (!SW_TEXT[language]) return;

    SW.language = language;
    document.documentElement.lang = language;

    if (SW.view === "quiz") {
        SW_showQuestion();
    } else if (SW.view === "result") {
        SW_showResult();
    } else if (SW.view === "important") {
        SW_showImportant();
    } else {
        SW_renderApp();
    }
}

/* NAVIGATION */

function SW_selectClass(number) {
    SW.currentClass = String(number);
    SW.subject = "";
    SW.chapter = "";
    SW.view = "home";

    SW_renderApp();
}

function SW_selectBoard(board) {
    SW.board = board;
    SW.subject = "";
    SW.chapter = "";
    SW.view = "home";

    SW_renderApp();
}

function SW_selectSubject(subject) {
    SW.subject = subject;
    SW.chapter = "";
    SW.view = "home";

    SW_renderApp();
}

function SW_selectChapter(chapter) {
    SW.chapter = chapter;

    const entry =
        SW_bank()[SW.currentClass]?.[SW.board]?.[SW.subject];

    const chapterData = Array.isArray(entry)
        ? entry
        : entry?.[chapter];

    const questions = Array.isArray(chapterData)
        ? chapterData
        : Array.isArray(chapterData?.questions)
            ? chapterData.questions
            : [];

    SW.important = Array.isArray(chapterData?.important)
        ? chapterData.important
        : [];

    if (!questions.length) {
        alert(SW_t("noQuestions"));
        return;
    }

    SW_startQuiz(questions, "study");
}

/* MENTALITY TEST */

function SW_openMentality() {
    SW.view = "mentality";
    SW_renderApp();
}

function SW_startMentality(category) {
    const raw = window.SW_MENTALITY_TESTS?.[category];

    let questions = [];

    if (Array.isArray(raw)) {
        questions = raw;
    } else if (raw && typeof raw === "object") {
        Object.values(raw).forEach(items => {
            if (Array.isArray(items)) {
                questions.push(...items);
            }
        });
    }

    if (!questions.length) {
        alert(SW_t("noQuestions"));
        return;
    }

    SW_startQuiz(questions, "mentality");
}

/* START QUIZ */

function SW_startQuiz(questions, mode) {
    SW.questions = questions.slice();
    SW.currentQuestion = 0;
    SW.answers = {};
    SW.review = [];
    SW.submitted = false;
    SW.mode = mode;
    SW.view = "quiz";

    SW_showQuestion();
}

/* OPTIONS */

function SW_optionList(question) {
    const options = question.options;

    if (Array.isArray(options)) return options;

    if (options && Array.isArray(options[SW.language])) {
        return options[SW.language];
    }

    if (options && Array.isArray(options.en)) {
        return options.en;
    }

    if (options && Array.isArray(options.hi)) {
        return options.hi;
    }

    return [];
}

/* SHOW QUESTION */

function SW_showQuestion() {
    SW.view = "quiz";

    const app = SW_app();
    const question = SW.questions[SW.currentQuestion];

    if (!question) {
        SW_showResult();
        return;
    }

    const total = SW.questions.length;
    const selected = SW.answers[SW.currentQuestion];
    const options = SW_optionList(question);

    let html = `
        <section class="quiz-box">

            <h2>
                ${SW_t("question")}
                ${SW.currentQuestion + 1}
                ${SW_t("of")}
                ${total}
            </h2>

            <p>
                ${SW_t("marked")}: ${SW.review.length}
            </p>

            <h3>
                ${SW_escape(SW_local(question.question))}
            </h3>

            <div id="sw-options">
    `;

    options.forEach((option, index) => {
        let className = "quiz-option";

        if (selected === index) {
            className += " selected";
        }

        if (SW.submitted && index === question.answer) {
            className += " correct";
        } else if (SW.submitted && selected === index) {
            className += " wrong";
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

                <button id="sw-skip"
                    ${SW.submitted ? "disabled" : ""}>
                    ${SW_t("skip")}
                </button>

                <button id="sw-review"
                    ${SW.submitted ? "disabled" : ""}>
                    ${SW.review.includes(SW.currentQuestion) ? "✓ " : ""}
                    ${SW_t("mark")}
                </button>

                <button id="sw-clear"
                    ${(selected === undefined || SW.submitted) ? "disabled" : ""}>
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

            <button id="sw-home">
                ${SW_t("home")}
            </button>

        </section>
    `;

    app.innerHTML = html;

    app.querySelectorAll("[data-option]").forEach(button => {
        button.addEventListener("click", () => {
            if (!SW.submitted) {
                SW.answers[SW.currentQuestion] =
                    Number(button.dataset.option);

                SW_showQuestion();
            }
        });
    });

    document.getElementById("sw-previous").onclick = () => {
        if (SW.currentQuestion > 0) {
            SW.currentQuestion--;
            SW_showQuestion();
        }
    };

    document.getElementById("sw-next").onclick = () => {
        if (SW.currentQuestion === total - 1) {
            SW_showResult();
        } else {
            SW.currentQuestion++;
            SW_showQuestion();
        }
    };

    document.getElementById("sw-skip").onclick = () => {
        if (SW.currentQuestion < total - 1) {
            SW.currentQuestion++;
            SW_showQuestion();
        } else {
            SW_showResult();
        }
    };

    document.getElementById("sw-review").onclick = () => {
        const index = SW.currentQuestion;

        SW.review = SW.review.includes(index)
            ? SW.review.filter(item => item !== index)
            : [...SW.review, index];

        SW_showQuestion();
    };

    document.getElementById("sw-clear").onclick = () => {
        delete SW.answers[SW.currentQuestion];
        SW_showQuestion();
    };

    document.getElementById("sw-submit").onclick = SW_showResult;

    document.getElementById("sw-home").onclick = () => {
        SW.view = "home";
        SW_renderApp();
    };

    if (SW.submitted) {
        SW_showFeedback(question);
    }
}

/* FEEDBACK */

function SW_showFeedback(question) {
    const feedback = document.getElementById("sw-feedback");

    if (!feedback) return;

    const selected = SW.answers[SW.currentQuestion];

    let message;

    if (selected === undefined) {
        message = SW_t("unanswered");
    } else if (selected === question.answer) {
        message = SW_t("correct");
    } else {
        message = SW_t("wrong");
    }

    feedback.innerHTML = `
        <h3>${SW_escape(message)}</h3>

        <p class="explanation">
            <b>${SW_t("explanation")}:</b>
            ${SW_escape(SW_local(question.explanation))}
        </p>
    `;
}

/* RESULTS */

function SW_showResult() {
    SW.submitted = true;
    SW.view = "result";

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
        ? Math.round((correct / total) * 100)
        : 0;

    const app = SW_app();

    app.innerHTML = `
        <section class="result-box">

            <h2>${SW_t("completed")}</h2>

            <h3>${SW_t("result")}</h3>

            <p>${SW_t("total")}: ${total}</p>

            <p class="correct">
                ${SW_t("right")}: ${correct}
            </p>

            <p class="wrong">
                ${SW_t("incorrect")}: ${wrong}
            </p>

            <p>
                ${SW_t("unanswered")}: ${unanswered}
            </p>

            <h2>
                ${SW_t("score")}: ${percentage}%
            </h2>

            <button id="sw-retry">
                ${SW_t("retry")}
            </button>

            <button id="sw-review-all">
                ${SW_t("reviewAnswers")}
            </button>

            <button id="sw-result-home">
                ${SW_t("home")}
            </button>

        </section>
    `;

    document.getElementById("sw-retry").onclick = () => {
        SW_startQuiz(SW.questions, SW.mode);
    };

    document.getElementById("sw-review-all").onclick = () => {
        SW.currentQuestion = 0;
        SW_showQuestion();
    };

    document.getElementById("sw-result-home").onclick = () => {
        SW.view = "home";
        SW_renderApp();
    };
}

/* IMPORTANT QUESTIONS & ANSWERS */

function SW_showImportant() {
    SW.view = "important";

    const items = SW.important;

    let html = `
        <section class="quiz-box">

            <h2>${SW_t("important")}</h2>
    `;

    if (!items.length) {
        html += `<p>${SW_t("noImportant")}</p>`;
    }

    items.forEach((item, index) => {
        html += `
            <article class="card">

                <h3>
                    ${index + 1}.
                    ${SW_escape(SW_local(item.question))}
                </h3>

                <p>
                    <b>${SW_t("answer")}:</b>
                    ${SW_escape(SW_local(item.answer))}
                </p>

            </article>
        `;
    });

    html += `
            <button id="sw-important-back">
                ${SW_t("back")}
            </button>

        </section>
    `;

    SW_app().innerHTML = html;

    document.getElementById("sw-important-back").onclick = () => {
        SW.view = "home";
        SW_renderApp();
    };
}

/* MAIN SCREEN */

function SW_renderApp() {
    const bank = SW_bank();

    const subjects =
        bank[SW.currentClass]?.[SW.board] || {};

    let html = `
        <section id="sw-learning">

            <div class="language-switch">
                <button id="sw-en">English</button>
                <button id="sw-hi">हिंदी</button>
            </div>

            <h2>STUDY WARRIORS</h2>

            <h3>${SW_t("classes")}</h3>

            <div class="cards">
    `;

    ["8", "9", "10"].forEach(number => {
        html += `
            <div class="card">

                <h3>Class ${number}</h3>

                <button data-class="${number}">
                    ${SW_t("select")}
                </button>

            </div>
        `;
    });

    html += `
            </div>

            <h3>${SW_t("board")}</h3>

            <div class="cards">

                <button data-board="NCERT">NCERT</button>

                <button data-board="BSEB">Bihar Board</button>

            </div>

            <h3>
                ${SW_t("subject")}: ${SW.currentClass}
            </h3>

            <div class="cards">
    `;

    Object.keys(subjects).forEach(subject => {
        html += `
            <div class="card">

                <h3>${SW_escape(subject)}</h3>

                <button data-subject="${SW_escape(subject)}">
                    ${SW_t("select")}
                </button>

            </div>
        `;
    });

    html += `</div>`;

    if (SW.subject) {
        const chapters = subjects[SW.subject] || {};

        html += `
            <h3>
                ${SW_t("chapter")}: ${SW_escape(SW.subject)}
            </h3>

            <div class="cards">
        `;

        if (Array.isArray(chapters)) {
            html += `
                <button data-chapter="default">
                    ${SW_t("start")}
                </button>
            `;
        } else {
            Object.keys(chapters).forEach(chapter => {
                html += `
                    <div class="card">

                        <h3>${SW_escape(chapter)}</h3>

                        <button data-chapter="${SW_escape(chapter)}">
                            ${SW_t("start")}
                        </button>

                    </div>
                `;
            });
        }

        html += `</div>`;

        if (SW.chapter && SW.important.length) {
            html += `
                <button id="sw-open-important">
                    ${SW_t("showImportant")}
                </button>
            `;
        }
    }

    html += `
            <hr>

            <h2>${SW_t("mentality")}</h2>

            <div class="cards">
    `;

    Object.keys(SW_MENTALITY).forEach(category => {
        html += `
            <div class="card">

                <h3>${SW_escape(category)}</h3>

                <button data-mental="${SW_escape(category)}">
                    ${SW_t("start")}
                </button>

            </div>
        `;
    });

    html += `
            </div>

        </section>
    `;

    SW_app().innerHTML = html;

    document.getElementById("sw-en").onclick = () => {
        SW_setLanguage("en");
    };

    document.getElementById("sw-hi").onclick = () => {
        SW_setLanguage("hi");
    };

    document.querySelectorAll("[data-class]").forEach(button => {
        button.onclick = () => {
            SW_selectClass(button.dataset.class);
        };
    });

    document.querySelectorAll("[data-board]").forEach(button => {
        button.onclick = () => {
            SW_selectBoard(button.dataset.board);
        };
    });

    document.querySelectorAll("[data-subject]").forEach(button => {
        button.onclick = () => {
            SW_selectSubject(button.dataset.subject);
        };
    });

    document.querySelectorAll("[data-chapter]").forEach(button => {
        button.onclick = () => {
            SW_selectChapter(button.dataset.chapter);
        };
    });

    document.querySelectorAll("[data-mental]").forEach(button => {
        button.onclick = () => {
            SW_startMentality(button.dataset.mental);
        };
    });

    const importantButton =
        document.getElementById("sw-open-important");

    if (importantButton) {
        importantButton.onclick = SW_showImportant;
    }
}

/* START WEBSITE */

document.addEventListener("DOMContentLoaded", () => {
    SW_renderApp();

    console.log("Study Warriors Quiz Engine V2 loaded.");
});
