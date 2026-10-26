import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CircleHelp,
  RotateCcw,
  Trophy,
  XCircle,
  HelpCircle,
  Layers,
  Sparkles,
} from "lucide-react";
import { quizQuestions } from "../data/quizQuestions.js";

function Quiz() {
  const [topic, setTopic] = useState("All Topics");
  const [difficulty, setDifficulty] = useState("All Levels");
  const [examTag, setExamTag] = useState("All Tags");

  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState({});
  const [finished, setFinished] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);

  const topics = useMemo(
    () => [...new Set(quizQuestions.map((q) => q.topic))],
    []
  );

  const tags = useMemo(
    () => [...new Set(quizQuestions.map((q) => q.tag))],
    []
  );

  const filteredQuestions = useMemo(
    () =>
      quizQuestions.filter(
        (q) =>
          (topic === "All Topics" || q.topic === topic) &&
          (difficulty === "All Levels" ||
            q.difficulty === difficulty) &&
          (examTag === "All Tags" || q.tag === examTag)
      ),
    [topic, difficulty, examTag]
  );

  const currentQuestion = filteredQuestions[currentIndex];

  const correctCount = filteredQuestions.filter(
    (q) => answers[q.id] === q.answer
  ).length;

  const attemptedCount = filteredQuestions.filter(
    (q) => answers[q.id] !== undefined
  ).length;

  const resetQuiz = () => {
    setStarted(false);
    setCurrentIndex(0);
    setAnswers({});
    setChecked({});
    setFinished(false);
    setReviewMode(false);
  };

  const changeFilter = (setter, value) => {
    setter(value);
    resetQuiz();
  };

  const startQuiz = () => {
    setCurrentIndex(0);
    setAnswers({});
    setChecked({});
    setFinished(false);
    setReviewMode(false);
    setStarted(true);
  };

  const chooseAnswer = (optionIndex) => {
    if (checked[currentQuestion.id]) return;

    setAnswers((previous) => ({
      ...previous,
      [currentQuestion.id]: optionIndex,
    }));
  };

  const checkAnswer = () => {
    if (answers[currentQuestion.id] === undefined) return;

    setChecked((previous) => ({
      ...previous,
      [currentQuestion.id]: true,
    }));
  };

  const nextQuestion = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((previous) => previous + 1);
    } else {
      setFinished(true);
      setReviewMode(false);
    }
  };

  const previousQuestion = () => {
    setCurrentIndex((previous) => Math.max(0, previous - 1));
  };

  const openReview = () => {
    setFinished(true);
    setReviewMode(true);
  };

  const scorePercent = filteredQuestions.length
    ? Math.round((correctCount / filteredQuestions.length) * 100)
    : 0;

  const getDifficultyClass = (diff) => {
    const d = (diff || "").toLowerCase();
    if (d === "easy") return "pill-easy";
    if (d === "medium") return "pill-medium";
    if (d === "hard") return "pill-hard";
    return "";
  };

  if (filteredQuestions.length === 0) {
    return (
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px 60px", color: "var(--text-primary)" }}>
        <section className="quiz-card" style={{ textAlign: "center", padding: "48px 24px" }}>
          <CircleHelp size={48} color="var(--accent-primary)" style={{ margin: "0 auto 16px" }} />
          <h1 className="quiz-page-title">No questions found</h1>
          <p className="quiz-lead-text" style={{ margin: "0 auto 24px" }}>
            Change the filters to see available questions.
          </p>
          <button className="quiz-btn-primary" onClick={resetQuiz}>
            <RotateCcw size={16} /> Reset Filters
          </button>
        </section>
      </main>
    );
  }

  if (finished) {
    return (
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px 60px", color: "var(--text-primary)" }}>
        <section className="quiz-hero-banner">
          <div className="quiz-eyebrow">
            <Sparkles size={14} />
            HashLab • Quiz Results
          </div>
          <h1 className="quiz-page-title">
            {reviewMode ? "Review your answers" : "Quiz completed"}
          </h1>
          <p className="quiz-lead-text">
            Review each question, its correct answer, and the step-by-step rationale.
          </p>
        </section>

        {!reviewMode && (
          <section className="quiz-card" style={{ marginBottom: 24, textAlign: "center", padding: "36px 24px" }}>
            <Trophy size={48} color="var(--accent-primary)" style={{ margin: "0 auto 12px" }} />

            <h2 style={{ fontSize: "clamp(32px, 5vw, 44px)", margin: "8px 0", fontWeight: 800, color: "var(--text-primary)" }}>
              {correctCount} / {filteredQuestions.length}
            </h2>

            <p style={{ color: "var(--text-secondary)", fontSize: "15px", marginBottom: 16 }}>
              Score: <strong style={{ color: "var(--accent-primary)" }}>{scorePercent}%</strong> · Attempted: {attemptedCount} · Unanswered: {filteredQuestions.length - attemptedCount}
            </p>

            <div
              style={{
                height: 10,
                borderRadius: 20,
                overflow: "hidden",
                background: "var(--bg-card-muted)",
                border: "1px solid var(--border-main)",
                maxWidth: 480,
                margin: "18px auto 24px",
              }}
            >
              <div
                style={{
                  width: `${scorePercent}%`,
                  height: "100%",
                  background: scorePercent >= 70 ? "linear-gradient(90deg, #10b981, #38bdf8)" : "linear-gradient(90deg, #f59e0b, #ef4444)",
                  transition: "width .35s ease",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="quiz-btn-primary" onClick={resetQuiz}>
                <RotateCcw size={16} /> Take Another Quiz
              </button>
              <button className="quiz-btn-secondary" onClick={() => setReviewMode(true)}>
                <BookOpen size={16} /> Review All Questions
              </button>
            </div>
          </section>
        )}

        <div style={{ display: "grid", gap: 16 }}>
          {filteredQuestions.map((q, index) => {
            const selected = answers[q.id];
            const isCorrect = selected === q.answer;

            return (
              <article key={q.id} className="quiz-card">
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                    marginBottom: 14,
                  }}
                >
                  <span className="quiz-pill quiz-pill-accent">Q{index + 1}</span>
                  <span className="quiz-pill">{q.topic}</span>
                  <span className={`quiz-pill ${getDifficultyClass(q.difficulty)}`}>{q.difficulty}</span>
                  <span className="quiz-pill">{q.tag}</span>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: 12, lineHeight: 1.6, margin: "0 0 12px" }}>
                  <strong>Source:</strong> {q.sourceType === "original-practice" ? "Original HashLab practice (created for this app; not a past-paper question)." : `${q.sourceName} · ${q.sourceYear} · ${q.sourcePaper} · Question ${q.sourceQuestionNumber} · ${q.sourceType === "adapted-past-paper" ? "Adapted practice variant" : "Past-paper question"}`} {q.sourceUrl && <a href={q.sourceUrl} target="_blank" rel="noreferrer">Open source</a>}
                </p>

                <h3 style={{ lineHeight: 1.6, fontSize: "17px", fontWeight: 700, margin: "0 0 12px", color: "var(--text-primary)" }}>
                  {q.question}
                </h3>

                <p style={{ color: "var(--text-secondary)", fontSize: "14px", margin: "6px 0" }}>
                  <strong>Your answer:</strong>{" "}
                  {selected === undefined
                    ? <span style={{ color: "var(--text-muted)" }}>Not attempted</span>
                    : q.options[selected]}
                </p>

                <p
                  style={{
                    color: selected === undefined ? "var(--text-muted)" : isCorrect ? "var(--accent-success)" : "var(--accent-danger)",
                    fontWeight: 700,
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    margin: "8px 0"
                  }}
                >
                  {selected === undefined ? (
                    <HelpCircle size={16} />
                  ) : isCorrect ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <XCircle size={16} />
                  )}
                  {selected === undefined
                    ? "Not answered"
                    : isCorrect
                    ? "Correct"
                    : "Incorrect"}
                </p>

                <p style={{ color: "var(--text-primary)", fontSize: "14px", margin: "6px 0 14px" }}>
                  <strong style={{ color: "var(--accent-success)" }}>Correct answer:</strong> {q.options[q.answer]}
                </p>

                <div
                  style={{
                    padding: "16px 18px",
                    borderRadius: 12,
                    background: "var(--bg-card-muted)",
                    border: "1px solid var(--border-main)",
                    lineHeight: 1.7,
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                  }}
                >
                  <strong style={{ display: "block", marginBottom: 4, color: "var(--text-primary)" }}>
                    Explanation
                  </strong>
                  <p style={{ margin: 0 }}>{q.explanation}</p>
                </div>
              </article>
            );
          })}
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginTop: 28,
          }}
        >
          <button className="quiz-btn-primary" onClick={resetQuiz}>
            <RotateCcw size={17} />
            Back to Quiz Setup
          </button>

          {reviewMode && (
            <button
              className="quiz-btn-secondary"
              onClick={() => setReviewMode(false)}
            >
              <Trophy size={16} /> View Score Card
            </button>
          )}
        </div>
      </main>
    );
  }

  if (!started) {
    return (
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px 60px", color: "var(--text-primary)" }}>
        <section className="quiz-hero-banner">
          <div className="quiz-eyebrow">
            <Sparkles size={14} />
            HashLab • Practice Centre
          </div>
          <h1 className="quiz-page-title">Test your hashing knowledge.</h1>
          <p className="quiz-lead-text">
            Practice hashing fundamentals, collision resolution, rehashing,
            extendible hashing, and linear hashing with original MCQs and
            step-by-step explanations.
          </p>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginTop: 22,
            }}
          >
            <span className="quiz-pill quiz-pill-accent">
              {quizQuestions.length} questions
            </span>
            <span className="quiz-pill">8 topic areas</span>
            <span className="quiz-pill">3 difficulty levels</span>
          </div>
        </section>

        <section className="quiz-card">
          <h2 style={{ marginTop: 0, fontSize: "20px", fontWeight: 800, marginBottom: 18, color: "var(--text-primary)" }}>
            Configure your quiz
          </h2>

          <div className="quiz-filter-grid">
            <div>
              <label className="quiz-filter-label">Topic</label>
              <select
                className="hash-select"
                style={{ width: "100%" }}
                value={topic}
                onChange={(e) =>
                  changeFilter(setTopic, e.target.value)
                }
              >
                <option>All Topics</option>
                {topics.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="quiz-filter-label">Difficulty</label>
              <select
                className="hash-select"
                style={{ width: "100%" }}
                value={difficulty}
                onChange={(e) =>
                  changeFilter(setDifficulty, e.target.value)
                }
              >
                <option>All Levels</option>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>

            <div>
              <label className="quiz-filter-label">Practice category</label>
              <select
                className="hash-select"
                style={{ width: "100%" }}
                value={examTag}
                onChange={(e) =>
                  changeFilter(setExamTag, e.target.value)
                }
              >
                <option>All Tags</option>
                {tags.map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </div>
          </div>

          <div
            style={{
              padding: "18px 20px",
              borderRadius: 12,
              background: "var(--bg-card-muted)",
              border: "1px solid var(--border-main)",
              marginBottom: 24,
            }}
          >
            <strong style={{ color: "var(--text-primary)", fontSize: "15px", display: "block", marginBottom: 4 }}>
              {filteredQuestions.length} questions selected
            </strong>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", margin: 0, lineHeight: 1.6 }}>
              Instant feedback with detailed rationales is available after each answer or upon quiz completion.
            </p>
          </div>

          <button className="quiz-btn-primary" onClick={startQuiz}>
            Start Quiz <ArrowRight size={17} />
          </button>

          <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 20, lineHeight: 1.6 }}>
            Questions identify their source on the question screen. Adapted questions state the changes; original HashLab practice is not attributed to an exam.
          </p>
        </section>
      </main>
    );
  }

  const selectedAnswer = answers[currentQuestion.id];
  const isChecked = Boolean(checked[currentQuestion.id]);

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px 60px", color: "var(--text-primary)" }}>
      <section className="quiz-hero-banner">
        <div className="quiz-eyebrow">
          <Sparkles size={14} />
          HashLab • Quiz in progress
        </div>
        <h1 className="quiz-page-title">Question {currentIndex + 1} of {filteredQuestions.length}</h1>
        <p className="quiz-lead-text">
          {currentQuestion.topic} · {currentQuestion.difficulty} difficulty
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            marginTop: 18,
          }}
        >
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span className="quiz-pill quiz-pill-accent">{currentQuestion.tag}</span>
            <span className={`quiz-pill ${getDifficultyClass(currentQuestion.difficulty)}`}>{currentQuestion.difficulty}</span>
          </div>
          <span className="quiz-pill" style={{ fontWeight: 800, color: "var(--accent-primary)" }}>
            {correctCount} correct so far
          </span>
        </div>

        <p style={{ color: "var(--text-muted)", fontSize: 12, lineHeight: 1.6, margin: "12px 0 0" }}>
          <strong>Source:</strong> {currentQuestion.sourceType === "original-practice" ? "Original HashLab practice (created for this app; not a past-paper question)." : `${currentQuestion.sourceName} · ${currentQuestion.sourceYear} · ${currentQuestion.sourcePaper} · Question ${currentQuestion.sourceQuestionNumber} · ${currentQuestion.sourceType === "adapted-past-paper" ? "Adapted practice variant" : "Past-paper question"}`} {currentQuestion.sourceUrl && <a href={currentQuestion.sourceUrl} target="_blank" rel="noreferrer">Open source</a>}
        </p>

        <div
          style={{
            height: 8,
            borderRadius: 20,
            background: "var(--bg-card-muted)",
            border: "1px solid var(--border-main)",
            overflow: "hidden",
            marginTop: 20,
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${((currentIndex + 1) / filteredQuestions.length) * 100}%`,
              background: "linear-gradient(90deg, #2563eb, #38bdf8)",
              transition: "width .25s ease",
            }}
          />
        </div>
      </section>

      <section className="quiz-card">
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
          }}
        >
          <CircleHelp size={26} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: 2 }} />
          <h2 style={{ marginTop: 0, lineHeight: 1.6, fontSize: "19px", fontWeight: 700, color: "var(--text-primary)" }}>
            {currentQuestion.question}
          </h2>
        </div>

        <div style={{ display: "grid", gap: 12, marginTop: 24 }}>
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectOption = currentQuestion.answer === index;

            let optionClass = "quiz-option-button";

            if (isChecked && isCorrectOption) {
              optionClass += " quiz-option-correct";
            } else if (isChecked && isSelected && !isCorrectOption) {
              optionClass += " quiz-option-incorrect";
            } else if (isSelected) {
              optionClass += " quiz-option-selected";
            }

            return (
              <button
                key={option}
                type="button"
                onClick={() => chooseAnswer(index)}
                disabled={isChecked}
                className={optionClass}
                style={{
                  cursor: isChecked ? "default" : "pointer",
                }}
              >
                <span className="quiz-opt-letter">
                  {String.fromCharCode(65 + index)}
                </span>
                <span style={{ flex: 1, paddingTop: 2 }}>{option}</span>
                {isChecked && isCorrectOption && (
                  <CheckCircle2 color="var(--accent-success)" size={22} style={{ flexShrink: 0 }} />
                )}
                {isChecked && isSelected && !isCorrectOption && (
                  <XCircle color="var(--accent-danger)" size={22} style={{ flexShrink: 0 }} />
                )}
              </button>
            );
          })}
        </div>

        {isChecked && (
          <div
            className={`quiz-feedback-box ${
              selectedAnswer === currentQuestion.answer
                ? "quiz-feedback-correct"
                : "quiz-feedback-incorrect"
            }`}
          >
            <strong style={{ fontSize: "15px", display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              {selectedAnswer === currentQuestion.answer ? (
                <>
                  <CheckCircle2 size={18} />
                  Correct answer!
                </>
              ) : (
                <>
                  <XCircle size={18} />
                  Not quite — review the explanation.
                </>
              )}
            </strong>
            <p style={{ margin: "6px 0", fontSize: "14px" }}>
              <strong>Correct Answer:</strong>{" "}
              {currentQuestion.options[currentQuestion.answer]}
            </p>
            <p style={{ margin: "8px 0 0", fontSize: "14px", lineHeight: 1.65 }}>
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "space-between",
            flexWrap: "wrap",
            marginTop: 26,
          }}
        >
          <button
            className="quiz-btn-secondary"
            onClick={previousQuestion}
            disabled={currentIndex === 0}
          >
            <ArrowLeft size={17} /> Previous
          </button>

          {!isChecked ? (
            <button
              className="quiz-btn-primary"
              disabled={selectedAnswer === undefined}
              onClick={checkAnswer}
            >
              <CheckCircle2 size={17} /> Check Answer
            </button>
          ) : (
            <button className="quiz-btn-primary" onClick={nextQuestion}>
              {currentIndex === filteredQuestions.length - 1
                ? "View Results"
                : "Next Question"}
              <ArrowRight size={17} />
            </button>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 8,
            marginTop: 22,
            paddingTop: 18,
            borderTop: "1px solid var(--border-main)",
          }}
        >
          <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>
            Answered: {attemptedCount} / {filteredQuestions.length}
          </span>

          <button
            type="button"
            onClick={openReview}
            style={{
              border: 0,
              padding: "6px 10px",
              background: "transparent",
              color: "var(--accent-primary)",
              fontWeight: 700,
              fontSize: "13px",
              cursor: "pointer",
              borderRadius: "6px",
              transition: "opacity 0.2s"
            }}
          >
            Finish and review
          </button>
        </div>
      </section>
    </main>
  );
}

export default Quiz;