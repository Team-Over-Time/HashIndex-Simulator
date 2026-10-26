import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Sun, Moon } from "lucide-react";

const navigation = [
  { label: "Home", path: "/" },
  { label: "Learn", path: "/learn" },
  { label: "Simulator", path: "/simulator" },
  { label: "Question Bank", path: "/question-bank" },
  { label: "Quiz", path: "/quiz" },
  { label: "Games", path: "/games" },
  { label: "Compare", path: "/compare" },
  { label: "Analytics", path: "/analytics" },
  { label: "Help", path: "/help" },
  { label: "Developed By", path: "/developed-by" },
  { label: "Download", path: "/download" },
  { label: "References", path: "/references" },
];

function Navbar() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("hashlab_theme");
      if (saved === "dark" || saved === "light") return saved;
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    } catch {
      // fallback
    }
    return "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.body.setAttribute("data-theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark-theme");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark-theme");
    }
    try {
      localStorage.setItem("hashlab_theme", theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="brand">
          <span className="brand-icon">#</span>

          <span className="brand-text">
            <strong>HASHLAB</strong>
            <small>Hash Index Simulator</small>
          </span>
        </NavLink>

        <nav className="nav-links">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="theme-button"
          type="button"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          {theme === "dark" ? (
            <Sun size={19} color="#fbbf24" />
          ) : (
            <Moon size={18} color="#2563eb" />
          )}
        </button>
      </div>
    </header>
  );
}

export default Navbar;
