// client/src/pages/QuestionBank.jsx

import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  BookOpen,
  Calculator,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  RotateCcw,
  Search,
  Sparkles,
  Shuffle,
  CheckCircle2,
  List,
  LayoutGrid,
  GraduationCap,
  Building2,
  Zap,
  Award,
  ExternalLink,
  Edit3,
} from "lucide-react";
import {
  questionBankData,
  examCategoryOptions,
  topicList,
} from "../data/questionBankData";

const typeOptions = ["All Types", "Theory", "Numerical"];
const difficultyOptions = ["All Levels", "Easy", "Medium", "Hard"];

export default function QuestionBank() {
  // Filter States
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Competitive Exams");
  const [topic, setTopic] = useState("All Topics");
  const [type, setType] = useState("All Types");
  const [difficulty, setDifficulty] = useState("All Levels");

  // Navigation & View Mode States
  const [viewMode, setViewMode] = useState("focus"); // 'focus' | 'list'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState({});
  const [allRevealed, setAllRevealed] = useState(false);
  const [showScratchpad, setShowScratchpad] = useState(false);
  const [scratchpadText, setScratchpadText] = useState({});

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    const term = search.trim().toLowerCase();

    return questionBankData.filter((q) => {
      const matchesSearch =
        !term ||
        q.title.toLowerCase().includes(term) ||
        q.question.toLowerCase().includes(term) ||
        q.topic.toLowerCase().includes(term) ||
        (q.paper && q.paper.toLowerCase().includes(term)) ||
        (q.year && q.year.toLowerCase().includes(term)) ||
        (q.exam && q.exam.toLowerCase().includes(term)) ||
        (q.category && q.category.toLowerCase().includes(term)) ||
        (q.questionNo && q.questionNo.toLowerCase().includes(term)) ||
        q.answer.toLowerCase().includes(term);

      const matchesCategory =
        category === "All Competitive Exams" ||
        q.category === category ||
        (category === "GATE CSE" && (q.category === "GATE CSE" || (q.exam && q.exam.startsWith("GATE")))) ||
        q.exam === category;

      const matchesTopic = topic === "All Topics" || q.topic === topic;
      const matchesType = type === "All Types" || q.type === type;
      const matchesDifficulty =
        difficulty === "All Levels" || q.difficulty === difficulty;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesTopic &&
        matchesType &&
        matchesDifficulty
      );
    });
  }, [search, category, topic, type, difficulty]);

  // Keep currentIndex in bounds when filteredQuestions changes
  useEffect(() => {
    if (currentIndex >= filteredQuestions.length) {
      setCurrentIndex(0);
    }
  }, [filteredQuestions.length, currentIndex]);

  // Auto-scroll the active question button into view in the square navigator
  useEffect(() => {
    if (viewMode === "focus") {
      const el = document.getElementById(`qb-jump-${currentIndex}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [currentIndex, viewMode]);

  // Exam Counts
  const gateCount = useMemo(
    () => questionBankData.filter((q) => q.category === "GATE CSE" || (q.exam && q.exam.startsWith("GATE"))).length,
    []
  );
  const ugcCount = useMemo(
    () => questionBankData.filter((q) => q.category === "UGC-NET CS" || q.exam === "UGC-NET CS").length,
    []
  );
  const isroCount = useMemo(
    () => questionBankData.filter((q) => q.category === "ISRO CSE" || q.exam === "ISRO CSE").length,
    []
  );
  const psuCount = useMemo(
    () => questionBankData.filter((q) => q.category === "BARC & PSU Exams" || q.exam === "BARC & PSU Exams").length,
    []
  );

  // Theory & Numerical Counts
  const theoryCount = useMemo(
    () => filteredQuestions.filter((q) => q.type === "Theory").length,
    [filteredQuestions]
  );
  const numericalCount = useMemo(
    () => filteredQuestions.filter((q) => q.type === "Numerical").length,
    [filteredQuestions]
  );

  // Active question in focus mode
  const currentQuestion = filteredQuestions[currentIndex] || null;
  const isCurrentRevealed = Boolean(
    currentQuestion && revealed[currentQuestion.id]
  );

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, filteredQuestions.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const handleRandom = useCallback(() => {
    if (filteredQuestions.length <= 1) return;
    let nextIdx;
    do {
      nextIdx = Math.floor(Math.random() * filteredQuestions.length);
    } while (nextIdx === currentIndex && filteredQuestions.length > 1);
    setCurrentIndex(nextIdx);
  }, [currentIndex, filteredQuestions.length]);

  const toggleAnswer = (id) => {
    setRevealed((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleAllAnswers = () => {
    const nextValue = !allRevealed;
    setAllRevealed(nextValue);
    setRevealed((prev) => {
      const updated = { ...prev };
      filteredQuestions.forEach((q) => {
        updated[q.id] = nextValue;
      });
      return updated;
    });
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("All Competitive Exams");
    setTopic("All Topics");
    setType("All Types");
    setDifficulty("All Levels");
    setCurrentIndex(0);
  };

  // Keyboard navigation listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA" ||
        e.target.isContentEditable
      ) {
        return;
      }

      if (viewMode === "focus") {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          handleNext();
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          handlePrev();
        } else if (e.key === " " || e.key === "a" || e.key === "A") {
          if (currentQuestion) {
            e.preventDefault();
            toggleAnswer(currentQuestion.id);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, handleNext, handlePrev, currentQuestion]);

  const getDifficultyClass = (diff) => {
    const d = (diff || "").toLowerCase();
    if (d === "easy") return "pill-easy";
    if (d === "medium") return "pill-medium";
    if (d === "hard") return "pill-hard";
    return "";
  };

  const getCategoryIcon = (cat) => {
    const c = cat || "";
    if (c.includes("GATE")) return <GraduationCap size={15} />;
    if (c.includes("UGC")) return <Building2 size={15} />;
    if (c.includes("ISRO")) return <Zap size={15} />;
    if (c.includes("BARC") || c.includes("PSU") || c.includes("NIELIT") || c.includes("DRDO") || c.includes("TIFR") || c.includes("CMI"))
      return <Award size={15} />;
    return <GraduationCap size={15} />;
  };

  return (
    <main
      style={{
        maxWidth: 1240,
        margin: "0 auto",
        padding: "32px 20px 60px",
        color: "var(--text-primary)",
      }}
    >
      {/* Hero Header */}
      <section className="qb-hero-banner">
        <div className="qb-eyebrow">
          <Sparkles size={14} />
          HashLab · Competitive Exam Question Bank
        </div>

        <h1 className="qb-page-title">Competitive Exam Question Bank</h1>

        <p className="qb-lead-text">
          Targeted practice for GATE CSE, UGC-NET CS, ISRO Scientist/Engineer,
          and BARC/PSU technical exams. Every question is cited with its exact examination paper, year,
          and verified step-by-step mathematical derivation.
        </p>

        {/* Quick Exam Category Selector Tabs */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            marginTop: 22,
          }}
        >
          <button
            type="button"
            className={`qb-exam-quick-pill ${
              category === "All Competitive Exams" ? "active" : ""
            }`}
            onClick={() => setCategory("All Competitive Exams")}
          >
            🏆 All Competitive Exams ({questionBankData.length})
          </button>
          <button
            type="button"
            className={`qb-exam-quick-pill ${
              category === "GATE CSE" ? "active" : ""
            }`}
            onClick={() => setCategory("GATE CSE")}
          >
            🎓 GATE CSE / IT / DA ({gateCount})
          </button>
          <button
            type="button"
            className={`qb-exam-quick-pill ${
              category === "UGC-NET CS" ? "active" : ""
            }`}
            onClick={() => setCategory("UGC-NET CS")}
          >
            🏛️ UGC-NET CS ({ugcCount})
          </button>
          <button
            type="button"
            className={`qb-exam-quick-pill ${
              category === "ISRO CSE" ? "active" : ""
            }`}
            onClick={() => setCategory("ISRO CSE")}
          >
            🚀 ISRO CSE ({isroCount})
          </button>
          <button
            type="button"
            className={`qb-exam-quick-pill ${
              category === "BARC & PSU Exams" ? "active" : ""
            }`}
            onClick={() => setCategory("BARC & PSU Exams")}
          >
            ⚡ BARC & PSUs ({psuCount})
          </button>
        </div>
      </section>

      {/* Summary Stat Cards */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div className="qb-stat-card">
          <BookOpen size={24} color="#3b82f6" />
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "13px",
              fontWeight: 700,
              margin: "8px 0 2px",
            }}
          >
            Theory Questions
          </p>
          <strong
            style={{
              fontSize: "clamp(26px, 3.5vw, 32px)",
              color: "var(--text-primary)",
              display: "block",
            }}
          >
            {theoryCount}
          </strong>
        </div>

        <div className="qb-stat-card">
          <Calculator size={24} color="#10b981" />
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "13px",
              fontWeight: 700,
              margin: "8px 0 2px",
            }}
          >
            Numerical Problems
          </p>
          <strong
            style={{
              fontSize: "clamp(26px, 3.5vw, 32px)",
              color: "var(--text-primary)",
              display: "block",
            }}
          >
            {numericalCount}
          </strong>
        </div>

        <div className="qb-stat-card">
          <Search size={24} color="#8b5cf6" />
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "13px",
              fontWeight: 700,
              margin: "8px 0 2px",
            }}
          >
            Matching Active Filter
          </p>
          <strong
            style={{
              fontSize: "clamp(26px, 3.5vw, 32px)",
              color: "var(--text-primary)",
              display: "block",
            }}
          >
            {filteredQuestions.length}
          </strong>
        </div>
      </section>

      {/* Search and Filter Panel (Sub-tag dropdown removed; direct exam categories) */}
      <section className="qb-card" style={{ padding: "24px 28px", marginBottom: 24 }}>
        <h2
          style={{
            fontSize: "18px",
            fontWeight: 800,
            marginTop: 0,
            marginBottom: 18,
            color: "var(--text-primary)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Search size={18} color="var(--accent-primary)" />
          Filter Questions by Exam, Topic & Difficulty
        </h2>

        <div className="qb-filter-grid-clean">
          <label>
            <span className="qb-filter-label">Search Query</span>
            <input
              className="hash-input"
              style={{ width: "100%" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Keywords, formulas, year, paper (e.g. 2021, Double Hashing)..."
            />
          </label>

          <label>
            <span className="qb-filter-label">Competitive Examination</span>
            <select
              className="hash-select"
              style={{ width: "100%" }}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {examCategoryOptions.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </label>

          <label>
            <span className="qb-filter-label">Hashing Topic</span>
            <select
              className="hash-select"
              style={{ width: "100%" }}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            >
              {topicList.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>

          <label>
            <span className="qb-filter-label">Question Type</span>
            <select
              className="hash-select"
              style={{ width: "100%" }}
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {typeOptions.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </label>

          <label>
            <span className="qb-filter-label">Difficulty Level</span>
            <select
              className="hash-select"
              style={{ width: "100%" }}
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              {difficultyOptions.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </label>
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginTop: 18,
            alignItems: "center",
          }}
        >
          <button className="qb-btn-secondary" onClick={resetFilters}>
            <RotateCcw size={16} /> Reset Filters
          </button>

          {viewMode === "list" && (
            <button className="qb-btn-primary" onClick={toggleAllAnswers}>
              {allRevealed ? <EyeOff size={16} /> : <Eye size={16} />}
              {allRevealed ? "Hide All Answers" : "Reveal All Answers"}
            </button>
          )}

          <span
            style={{
              marginLeft: "auto",
              fontSize: "13px",
              color: "var(--text-muted)",
              fontWeight: 600,
            }}
          >
            Showing {filteredQuestions.length} of {questionBankData.length} competitive questions
          </span>
        </div>
      </section>

      {/* View Mode Toggle Bar */}
      <div className="qb-view-toggle-bar">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
            Study Mode:
          </span>
          <div className="qb-segmented-control">
            <button
              className={`qb-segment-btn ${viewMode === "focus" ? "active" : ""}`}
              onClick={() => setViewMode("focus")}
              title="Step-by-step card navigation with Next/Prev"
            >
              <LayoutGrid size={15} />
              Focus Mode (One Question)
            </button>
            <button
              className={`qb-segment-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
              title="Show all questions in a scrollable list"
            >
              <List size={15} />
              Browse All List
            </button>
          </div>
        </div>

        {viewMode === "focus" && filteredQuestions.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              className="qb-btn-secondary"
              style={{ padding: "6px 14px", fontSize: "13px" }}
              onClick={handleRandom}
              title="Jump to a random question"
            >
              <Shuffle size={14} /> Random Question
            </button>

            <span className="qb-shortcut-hint">
              <span className="qb-kbd">←</span> <span className="qb-kbd">→</span> Navigate
            </span>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {filteredQuestions.length === 0 ? (
        <section
          className="qb-card"
          style={{ padding: "48px 24px", textAlign: "center" }}
        >
          <BookOpen
            size={42}
            color="var(--accent-primary)"
            style={{ margin: "0 auto 14px" }}
          />
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 700,
              margin: "0 0 8px",
              color: "var(--text-primary)",
            }}
          >
            No matching questions found
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "14px",
              margin: "0 0 20px",
            }}
          >
            No questions matched your active filters. Try resetting the exam category
            or search query.
          </p>
          <button className="qb-btn-primary" onClick={resetFilters}>
            <RotateCcw size={16} /> Reset All Filters
          </button>
        </section>
      ) : viewMode === "focus" ? (
        /* ========================================================
           FOCUS MODE: MAIN QUESTION CARD + RIGHT-CORNER SQUARE NAV
           ======================================================== */
        <div className="qb-focus-layout">
          {/* Left Column: Progress Bar, Question Card, Actions */}
          <div className="qb-focus-main">
            {/* Progress Indicator */}
            <div className="qb-focus-topbar">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--accent-primary)" }}>
                  Question {currentIndex + 1} of {filteredQuestions.length}
                </span>
                <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>
                  {Math.round(((currentIndex + 1) / filteredQuestions.length) * 100)}% through filtered set
                </span>
              </div>

              <div className="qb-progress-container">
                <div
                  className="qb-progress-fill"
                  style={{
                    width: `${((currentIndex + 1) / filteredQuestions.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Active Question Focus Card */}
            {currentQuestion && (
              <article
                className="qb-card qb-question-card"
                style={{
                  padding: 0,
                  overflow: "hidden",
                  border: "1.5px solid var(--border-main)",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
                }}
              >
                <div style={{ padding: "30px 32px" }}>
                  {/* Prominent Official Exam Provenance Header Bar */}
                  <div className="qb-exam-provenance-bar">
                    <div className="qb-exam-provenance-tags">
                      <span className="qb-exam-badge">
                        {getCategoryIcon(currentQuestion.exam || currentQuestion.category)}
                        <span>{currentQuestion.exam || currentQuestion.category}</span>
                      </span>
                      <span className="qb-paper-badge">
                        <span className="qb-provenance-label">Paper:</span>
                        <strong>{currentQuestion.paper}</strong>
                      </span>
                      <span className="qb-year-badge">
                        <span className="qb-provenance-label">Year:</span>
                        <strong>{currentQuestion.year}</strong>
                      </span>
                      {currentQuestion.questionNo && (
                        <span className="qb-qno-badge">
                          <strong>{currentQuestion.questionNo}</strong>
                        </span>
                      )}
                    </div>

                    {currentQuestion.sourceUrl && (
                      <a
                        href={currentQuestion.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="qb-source-link"
                        title="Official question source & discussion"
                      >
                        <ExternalLink size={13} />
                        <span>Official Source</span>
                      </a>
                    )}
                  </div>

                  {/* Secondary Topic & Type Meta Pills */}
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      flexWrap: "wrap",
                      alignItems: "center",
                      marginBottom: 18,
                    }}
                  >
                    <span className="qb-pill qb-pill-accent" style={{ fontWeight: 800 }}>
                      Q{currentIndex + 1}
                    </span>
                    <span className="qb-pill">{currentQuestion.topic}</span>
                    <span
                      className={`qb-pill ${getDifficultyClass(
                        currentQuestion.difficulty
                      )}`}
                    >
                      {currentQuestion.difficulty}
                    </span>
                    <span className="qb-pill">{currentQuestion.type}</span>
                  </div>

                  {/* Question Title & Statement */}
                  <h2
                    style={{
                      fontSize: "22px",
                      fontWeight: 800,
                      margin: "0 0 16px",
                      lineHeight: 1.4,
                      color: "var(--text-primary)",
                    }}
                  >
                    {currentQuestion.title}
                  </h2>

                  <p
                    style={{
                      fontSize: "16px",
                      lineHeight: 1.85,
                      marginBottom: 24,
                      color: "var(--text-secondary)",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {currentQuestion.question}
                  </p>

                  {/* Action Buttons: Scratchpad & Reveal Answer */}
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                    <button
                      type="button"
                      onClick={() => toggleAnswer(currentQuestion.id)}
                      className={isCurrentRevealed ? "qb-btn-secondary" : "qb-btn-primary"}
                      style={{ fontSize: "14.5px", padding: "10px 20px" }}
                    >
                      {isCurrentRevealed ? <EyeOff size={17} /> : <BookOpen size={17} />}
                      {isCurrentRevealed ? "Hide Answer & Derivation" : "Reveal Answer & Derivation"}
                    </button>

                    <button
                      type="button"
                      className="qb-btn-secondary"
                      style={{ fontSize: "14px", padding: "9px 16px" }}
                      onClick={() => setShowScratchpad(!showScratchpad)}
                      title="Toggle rough calculation pad"
                    >
                      <Edit3 size={15} />
                      {showScratchpad ? "Close Scratchpad" : "Open Rough Scratchpad"}
                    </button>
                  </div>

                  {/* Optional Scratchpad area for student work */}
                  {showScratchpad && (
                    <div
                      style={{
                        marginTop: 20,
                        padding: "16px 18px",
                        borderRadius: 12,
                        background: "var(--bg-card-muted)",
                        border: "1px dashed var(--border-main)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 8,
                        }}
                      >
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: 700,
                            color: "var(--text-primary)",
                          }}
                        >
                          Scratchpad for Q{currentIndex + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setScratchpadText((prev) => ({
                              ...prev,
                              [currentQuestion.id]: "",
                            }))
                          }
                          style={{
                            background: "none",
                            border: "none",
                            fontSize: "12px",
                            color: "var(--text-muted)",
                            cursor: "pointer",
                          }}
                        >
                          Clear
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        value={scratchpadText[currentQuestion.id] || ""}
                        onChange={(e) =>
                          setScratchpadText((prev) => ({
                            ...prev,
                            [currentQuestion.id]: e.target.value,
                          }))
                        }
                        placeholder="Write your calculations, remainder steps, or key notes here..."
                        style={{
                          width: "100%",
                          padding: "10px 14px",
                          borderRadius: 8,
                          background: "var(--bg-main)",
                          border: "1px solid var(--border-main)",
                          color: "var(--text-primary)",
                          fontFamily: "monospace",
                          fontSize: "13.5px",
                          resize: "vertical",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Reveal Answer Tray */}
                {isCurrentRevealed && (
                  <div className="qb-answer-tray">
                    <h3 style={{ marginTop: 0 }}>
                      <BookOpen size={18} color="var(--accent-primary)" />
                      Model Answer
                    </h3>
                    <div
                      style={{
                        lineHeight: 1.8,
                        fontSize: "15.5px",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        margin: "8px 0 20px",
                        padding: "14px 18px",
                        background: "rgba(59, 130, 246, 0.08)",
                        borderLeft: "4px solid var(--accent-primary, #3b82f6)",
                        borderRadius: "0 10px 10px 0",
                      }}
                    >
                      {currentQuestion.answer}
                    </div>

                    {currentQuestion.formula && (
                      <div
                        style={{
                          padding: "12px 16px",
                          marginBottom: 20,
                          borderRadius: 8,
                          background: "rgba(16, 185, 129, 0.08)",
                          borderLeft: "4px solid #10b981",
                          fontSize: "14px",
                          fontFamily: "monospace",
                          color: "var(--text-primary)",
                        }}
                      >
                        <strong>Formula: </strong> {currentQuestion.formula}
                      </div>
                    )}

                    <h3>
                      <Sparkles size={18} color="#10b981" />
                      Step-by-Step Mathematical Derivation & Proof
                    </h3>
                    <ol
                      style={{
                        paddingLeft: 22,
                        lineHeight: 1.95,
                        fontSize: "14.5px",
                        color: "var(--text-secondary)",
                        margin: "10px 0 0",
                      }}
                    >
                      {currentQuestion.steps.map((step, sIdx) => (
                        <li key={sIdx} style={{ marginBottom: 8 }}>
                          {step}
                        </li>
                      ))}
                    </ol>

                    {currentQuestion.tip && (
                      <div
                        style={{
                          marginTop: 20,
                          padding: "12px 16px",
                          borderRadius: 8,
                          background: "rgba(245, 158, 11, 0.08)",
                          borderLeft: "4px solid #f59e0b",
                          fontSize: "13.5px",
                          color: "var(--text-secondary)",
                        }}
                      >
                        <strong>💡 Key Exam Takeaway: </strong> {currentQuestion.tip}
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation Actions Bar */}
                <div style={{ padding: "0 32px 28px" }}>
                  <div className="qb-nav-actions-bar">
                    <button
                      className="qb-nav-btn qb-nav-btn-prev"
                      onClick={handlePrev}
                      disabled={currentIndex === 0}
                      title="Previous question (ArrowLeft)"
                    >
                      <ChevronLeft size={18} />
                      Previous Question
                    </button>

                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span className="qb-shortcut-hint">
                        Shortcut: <span className="qb-kbd">Space</span> toggle answer · <span className="qb-kbd">←</span> <span className="qb-kbd">→</span> navigate
                      </span>
                    </div>

                    <button
                      className="qb-nav-btn qb-nav-btn-next"
                      onClick={handleNext}
                      disabled={currentIndex === filteredQuestions.length - 1}
                      title="Next question (ArrowRight)"
                    >
                      Next Question
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </article>
            )}
          </div>

          {/* Right Column: Compact Square Question Jump Navigator */}
          <aside className="qb-square-nav-corner">
            <div className="qb-square-nav-card">
              <div className="qb-square-nav-header">
                <div className="qb-square-nav-title">
                  <LayoutGrid size={15} />
                  <span>Jump to Question</span>
                </div>
                <span className="qb-square-nav-counter">
                  {currentIndex + 1} / {filteredQuestions.length}
                </span>
              </div>

              <div className="qb-square-nav-scroll" id="qb-square-nav-scroll">
                <div className="qb-square-nav-grid">
                  {filteredQuestions.map((q, idx) => {
                    const isActive = idx === currentIndex;
                    const isRev = Boolean(revealed[q.id]);
                    return (
                      <button
                        key={q.id}
                        id={`qb-jump-${idx}`}
                        className={`qb-square-btn ${isActive ? "active" : ""} ${
                          isRev ? "revealed" : ""
                        }`}
                        onClick={() => setCurrentIndex(idx)}
                        title={`Q${idx + 1}: ${q.paper} (Year: ${q.year}) · ${q.title}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="qb-square-nav-footer">
                <div className="qb-square-legend">
                  <span className="qb-dot-indicator active" /> Active
                  <span className="qb-dot-indicator revealed" style={{ marginLeft: 6 }} /> Solved
                </div>
                <button
                  type="button"
                  className="qb-square-random-btn"
                  onClick={handleRandom}
                  title="Pick a random question"
                >
                  <Shuffle size={12} /> Random
                </button>
              </div>
            </div>
          </aside>
        </div>
      ) : (
        /* ========================================================
           LIST MODE: SCROLLABLE LIST OF ALL FILTERED QUESTIONS
           ======================================================== */
        <section style={{ display: "grid", gap: 20 }}>
          {filteredQuestions.map((q, index) => {
            const isOpen = Boolean(revealed[q.id]);

            return (
              <article
                key={q.id}
                className="qb-card"
                style={{ padding: 0, overflow: "hidden" }}
              >
                <div style={{ padding: "26px" }}>
                  {/* Official Exam Provenance Header Bar */}
                  <div className="qb-exam-provenance-bar">
                    <div className="qb-exam-provenance-tags">
                      <span className="qb-exam-badge">
                        {getCategoryIcon(q.exam || q.category)}
                        <span>{q.exam || q.category}</span>
                      </span>
                      <span className="qb-paper-badge">
                        <span className="qb-provenance-label">Paper:</span>
                        <strong>{q.paper}</strong>
                      </span>
                      <span className="qb-year-badge">
                        <span className="qb-provenance-label">Year:</span>
                        <strong>{q.year}</strong>
                      </span>
                      {q.questionNo && (
                        <span className="qb-qno-badge">
                          <strong>{q.questionNo}</strong>
                        </span>
                      )}
                    </div>

                    {q.sourceUrl && (
                      <a
                        href={q.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="qb-source-link"
                        title="Official question source & discussion"
                      >
                        <ExternalLink size={13} />
                        <span>Official Source</span>
                      </a>
                    )}
                  </div>

                  {/* Secondary Topic & Type Meta Pills */}
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      flexWrap: "wrap",
                      marginBottom: 14,
                    }}
                  >
                    <span className="qb-pill qb-pill-accent">Q{index + 1}</span>
                    <span className="qb-pill">{q.topic}</span>
                    <span className={`qb-pill ${getDifficultyClass(q.difficulty)}`}>
                      {q.difficulty}
                    </span>
                    <span className="qb-pill">{q.type}</span>
                  </div>

                  <h2
                    style={{
                      fontSize: "20px",
                      fontWeight: 700,
                      margin: "0 0 12px",
                      color: "var(--text-primary)",
                    }}
                  >
                    {q.title}
                  </h2>

                  <p
                    style={{
                      lineHeight: 1.8,
                      marginBottom: 20,
                      color: "var(--text-secondary)",
                      fontSize: "15px",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {q.question}
                  </p>

                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => toggleAnswer(q.id)}
                    className={isOpen ? "qb-btn-secondary" : "qb-btn-primary"}
                  >
                    {isOpen ? <EyeOff size={16} /> : <BookOpen size={16} />}
                    {isOpen ? "Hide Answer" : "Reveal Answer & Steps"}
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>

                {isOpen && (
                  <div className="qb-answer-tray">
                    <h3 style={{ marginTop: 0 }}>
                      <BookOpen size={18} color="var(--accent-primary)" />
                      Model Answer
                    </h3>
                    <p
                      style={{
                        lineHeight: 1.8,
                        fontSize: "15px",
                        color: "var(--text-primary)",
                        margin: "8px 0 20px",
                        fontWeight: 600,
                      }}
                    >
                      {q.answer}
                    </p>

                    {q.formula && (
                      <div
                        style={{
                          padding: "10px 14px",
                          marginBottom: 18,
                          borderRadius: 8,
                          background: "rgba(16, 185, 129, 0.08)",
                          borderLeft: "4px solid #10b981",
                          fontSize: "13.5px",
                          fontFamily: "monospace",
                          color: "var(--text-primary)",
                        }}
                      >
                        <strong>Formula: </strong> {q.formula}
                      </div>
                    )}

                    <h3 style={{ marginTop: 18 }}>
                      <Sparkles size={18} color="#10b981" />
                      Step-by-Step Derivation & Proof
                    </h3>
                    <ol
                      style={{
                        paddingLeft: 22,
                        lineHeight: 1.9,
                        fontSize: "14.5px",
                        color: "var(--text-secondary)",
                        margin: "8px 0 0",
                      }}
                    >
                      {q.steps.map((step, stepIndex) => (
                        <li key={stepIndex} style={{ marginBottom: "6px" }}>
                          {step}
                        </li>
                      ))}
                    </ol>

                    {q.tip && (
                      <div
                        style={{
                          marginTop: 18,
                          padding: "10px 14px",
                          borderRadius: 8,
                          background: "rgba(245, 158, 11, 0.08)",
                          borderLeft: "4px solid #f59e0b",
                          fontSize: "13px",
                          color: "var(--text-secondary)",
                        }}
                      >
                        <strong>💡 Key Exam Takeaway: </strong> {q.tip}
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </section>
      )}

      <footer
        style={{
          color: "var(--text-muted)",
          fontSize: 12.5,
          marginTop: 40,
          lineHeight: 1.7,
          textAlign: "center",
          borderTop: "1px solid var(--border-main)",
          paddingTop: 20,
        }}
      >
        HashLab Competitive Question Bank · Authentic past exam questions from GATE CSE, UGC-NET CS, ISRO, and BARC/PSUs with verified citations.
      </footer>
    </main>
  );
}