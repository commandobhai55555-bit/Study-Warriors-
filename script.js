/* ==========================================
   STUDY WARRIORS
   Main JavaScript Engine
   ========================================== */

"use strict";

/* ---------- WEBSITE SETTINGS ---------- */

const SW = {
    name: "STUDY WARRIORS",
    version: "1.0",
    language: "en",
    currentClass: 8,
    currentSubject: null,
    currentQuiz: [],
    currentQuestion: 0,
    score: 0,
    wrong: 0,
    answered: false
};

/* ---------- LANGUAGE CONTENT ---------- */

const SW_TEXT = {
    en: {
        home: "Home",
        classes: "Classes",
        subjects: "Subjects",
        mcq: "MCQ Test",
        important: "Important Questions",
        maths: "Mental Maths",
        reasoning: "Reasoning",
        start: "Start Test",
        next: "Next Question",
        retry: "Try Again",
        correct: "Correct Answer!",
        wrong: "Wrong Answer!",
        explanation: "Explanation",
        result: "Your Result",
        total: "Total Questions",
        right: "Correct Answers",
        incorrect: "Wrong Answers",
        score: "Your Score",
        finish: "Test Completed",
        choose: "Choose Your Class",
        chooseSubject: "Choose Your Subject"
    },

    hi: {
        home: "होम",
        classes: "कक्षाएँ",
        subjects: "विषय",
        mcq: "MCQ टेस्ट",
        important: "महत्वपूर्ण प्रश्न",
        maths: "मेंटल मैथ्स",
        reasoning: "रीजनिंग",
        start: "टेस्ट शुरू करें",
        next: "अगला प्रश्न",
        retry: "दोबारा टेस्ट दें",
        correct: "सही जवाब!",
        wrong: "गलत जवाब!",
        explanation: "व्याख्या",
        result: "आपका परिणाम",
        total: "कुल प्रश्न",
        right: "सही उत्तर",
        incorrect: "गलत उत्तर",
        score: "आपका स्कोर",
        finish: "टेस्ट पूरा हुआ",
        choose: "अपनी कक्षा चुनें",
        chooseSubject: "अपना विषय चुनें"
    }
};

/* ---------- CLASSES AND SUBJECTS ---------- */

const SW_CLASSES = {
    8: [
        "Mathematics",
        "Science",
        "English",
        "Hindi",
        "Social Science",
        "Sanskrit",
        "Computer Science"
    ],

    9: [
        "Mathematics",
        "Science",
        "English",
        "Hindi",
        "Social Science",
        "Sanskrit",
        "Computer Science"
    ],

    10: [
        "Mathematics",
        "Science",
        "English",
        "Hindi",
        "Social Science",
        "Sanskrit",
        "Computer Science"
    ]
};

/* ---------- QUESTION BANK ---------- */
/*
  यह शुरुआती नमूना डेटा है।
  हर विषय के लिए 50-100 प्रश्न
  आगे अलग-अलग जोड़ेंगे।
*/

const SW_QUESTIONS = {

    "8": {
        Mathematics: [
            {
                question: {
                    en: "What is 12 × 8?",
                    hi: "12 × 8 कितना होता है?"
                },
                options: ["86", "96", "106", "116"],
                answer: 1,
                explanation: {
                    en: "12 × 8 = 96.",
                    hi: "12 × 8 = 96 होता है।"
                }
            }
        ]
    },

    "9": {
        Mathematics: [
            {
                question: {
                    en: "What is the square of 12?",
                    hi: "12 का वर्ग कितना है?"
                },
                options: ["124", "144", "154", "164"],
                answer: 1,
                explanation: {
                    en: "12 × 12 = 144.",
                    hi: "12 × 12 = 144 होता है।"
                }
            }
        ]
    },

    "10": {
        Mathematics: [
            {
                question: {
                    en: "What is the value of 5²?",
                    hi: "5² का मान कितना है?"
                },
                options: ["10", "15", "20", "25"],
                answer: 3,
                explanation: {
                    en: "5 × 5 = 25.",
                    hi: "5 × 5 = 25 होता है।"
                }
            }
        ]
    }

};

/* ---------- LANGUAGE FUNCTION ---------- */

function SW_setLanguage(language) {

    if (!SW_TEXT[language]) return;

    SW.language = language;

    document.documentElement.lang =
        language === "hi" ? "hi" : "en";

    document.querySelectorAll("[data-sw-text]").forEach(element => {

        const key = element.dataset.swText;

        if (SW_TEXT[language][key]) {
            element.textContent = SW_TEXT[language][key];
        }

    });

    SW_renderApp();
}

/* ---------- MAIN APP CONTAINER ---------- */

function SW_createApp() {

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

/* ---------- CLASS SELECTION ---------- */

function SW_selectClass(classNumber) {

    if (!SW_CLASSES[classNumber]) return;

    SW.currentClass = Number(classNumber);
    SW.currentSubject = null;

    SW_renderApp();

}

/* ---------- SUBJECT SELECTION ---------- */

function SW_selectSubject(subject) {

    SW.currentSubject = subject;

    const questions =
        SW_QUESTIONS[SW.currentClass]?.[subject] || [];

    if (questions.length === 0) {

        alert(
            SW.language === "hi"
                ? "इस विषय के प्रश्न अभी तैयार किए जा रहे हैं।"
                : "Questions for this subject are being prepared."
        );

        return;
    }

    SW_startQuiz(questions);

}

/* ---------- START QUIZ ---------- */

function SW_startQuiz(questions) {

    SW.currentQuiz = [...questions];

    SW.currentQuestion = 0;
    SW.score = 0;
    SW.wrong = 0;
    SW.answered = false;

    SW_showQuestion();

}

/* ---------- SHOW QUESTION ---------- */

function SW_showQuestion() {

    const app = SW_createApp();

    const t = SW_TEXT[SW.language];

    const question =
        SW.currentQuiz[SW.currentQuestion];

    if (!question) {
        SW_showResult();
        return;
    }

    const questionText =
        question.question[SW.language];

    app.innerHTML = `
        <section class="quiz-box">

            <h2>${t.mcq}</h2>

            <p>
                ${t.total}:
                ${SW.currentQuiz.length}
            </p>

            <h3>
                ${SW.currentQuestion + 1}.
                ${questionText}
            </h3>

            <div id="sw-options"></div>

            <div id="sw-feedback"></div>

            <button
                id="sw-next"
                style="display:none;"
            >
                ${t.next}
            </button>

        </section>
    `;

    const optionsBox =
        document.getElementById("sw-options");

    question.options.forEach((option, index) => {

        const button = document.createElement("button");

        button.className = "quiz-option";
        button.textContent = option;

        button.addEventListener("click", () => {
            SW_checkAnswer(index);
        });

        optionsBox.appendChild(button);

    });

    document
        .getElementById("sw-next")
        .addEventListener("click", SW_nextQuestion);

}

/* ---------- CHECK ANSWER ---------- */

function SW_checkAnswer(selected) {

    if (SW.answered) return;

    SW.answered = true;

    const question =
        SW.currentQuiz[SW.currentQuestion];

    const buttons =
        document.querySelectorAll("#sw-options button");

    const feedback =
        document.getElementById("sw-feedback");

    const t = SW_TEXT[SW.language];

    buttons.forEach((button, index) => {

        button.disabled = true;

        if (index === question.answer) {
            button.classList.add("correct");
            button.textContent = "✓ " + button.textContent;
        }

        if (
            index === selected &&
            selected !== question.answer
        ) {
            button.classList.add("wrong");
            button.textContent = "✗ " + button.textContent;
        }

    });

    if (selected === question.answer) {

        SW.score++;

        feedback.innerHTML = `
            <h3 style="color:#20c878;">
                ✓ ${t.correct}
            </h3>
        `;

    } else {

        SW.wrong++;

        feedback.innerHTML = `
            <h3 style="color:#ff4d5e;">
                ✗ ${t.wrong}
            </h3>
        `;

    }

    const explanation =
        question.explanation[SW.language];

    const explanationBox =
        document.createElement("p");

    explanationBox.className = "explanation";

    explanationBox.textContent =
        t.explanation + ": " + explanation;

    feedback.appendChild(explanationBox);

    document.getElementById("sw-next").style.display =
        "inline-block";

}

/* ---------- NEXT QUESTION ---------- */

function SW_nextQuestion() {

    SW.currentQuestion++;
    SW.answered = false;

    if (SW.currentQuestion >= SW.currentQuiz.length) {

        SW_showResult();

    } else {

        SW_showQuestion();

    }

}

/* ---------- FINAL RESULT ---------- */

function SW_showResult() {

    const app = SW_createApp();

    const t = SW_TEXT[SW.language];

    const total = SW.currentQuiz.length;

    const percentage =
        total > 0
            ? Math.round((SW.score / total) * 100)
            : 0;

    app.innerHTML = `
        <section class="result-box">

            <h2>${t.finish}</h2>

            <h3>${t.result}</h3>

            <p>${t.total}: ${total}</p>

            <p style="color:#20c878;">
                ${t.right}: ${SW.score}
            </p>

            <p style="color:#ff4d5e;">
                ${t.incorrect}: ${SW.wrong}
            </p>

            <h2>${t.score}: ${percentage}%</h2>

            <button id="sw-retry">
                ${t.retry}
            </button>

        </section>
    `;

    document
        .getElementById("sw-retry")
        .addEventListener("click", () => {
            SW_startQuiz(SW.currentQuiz);
        });

}

/* ---------- MAIN WEBSITE VIEW ---------- */

function SW_renderApp() {

    const app = SW_createApp();

    const t = SW_TEXT[SW.language];

    let html = `
        <section id="sw-learning">

            <div class="language-switch">

                <button onclick="SW_setLanguage('en')">
                    English
                </button>

                <button onclick="SW_setLanguage('hi')">
                    हिंदी
                </button>

            </div>

            <h2>${t.choose}</h2>

            <div class="cards">
    `;

    [8, 9, 10].forEach(classNumber => {

        html += `
            <div class="card">

                <h3>Class ${classNumber}</h3>

                <button
                    onclick="SW_selectClass(${classNumber})"
                >
                    ${t.subjects}
                </button>

            </div>
        `;

    });

    html += `
            </div>

            <h2>${t.chooseSubject}: Class ${SW.currentClass}</h2>

            <div class="cards">
    `;

    SW_CLASSES[SW.currentClass].forEach(subject => {

        html += `
            <div class="card">

                <h3>${subject}</h3>

                <button
                    onclick="SW_selectSubject('${subject}')"
                >
                    ${t.start}
                </button>

            </div>
        `;

    });

    html += `
            </div>

        </section>
    `;

    app.innerHTML = html;

}

/* ---------- INITIALIZE ---------- */

document.addEventListener("DOMContentLoaded", () => {

    SW_renderApp();

    console.log("STUDY WARRIORS loaded successfully.");

});
