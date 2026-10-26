
import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import Simulator from "./pages/Simulator.jsx";
import Games from "./pages/Games.jsx";
import QuestionBank from "./pages/QuestionBank.jsx";
import Quiz from "./pages/Quiz.jsx";
import Compare from "./pages/Compare.jsx";
import Analytics from "./pages/Analytics.jsx";
import Learn from "./pages/Learn.jsx";
import Help from "./pages/Help.jsx";
import DevelopedBy from "./pages/DevelopedBy.jsx";
import Download from "./pages/Download.jsx";
import References from "./pages/References.jsx";
import Test from "./pages/Test.jsx";

import CollisionBusterPage from "./pages/games/CollisionBusterPage.jsx";
import HashDetectivePage from "./pages/games/HashDetectivePage.jsx";
import RehashRescuePage from "./pages/games/RehashRescuePage.jsx";
import HashEscapeRoomPage from "./pages/games/HashEscapeRoomPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/simulator" element={<Simulator />} />
        <Route path="/question-bank" element={<QuestionBank />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/games" element={<Games />} />
        <Route path="/games/collision-buster" element={<CollisionBusterPage />} />
        <Route path="/games/hash-detective" element={<HashDetectivePage />} />
        <Route path="/games/rehash-rescue" element={<RehashRescuePage />} />
        <Route path="/games/hash-escape-room" element={<HashEscapeRoomPage />} />
        <Route path="/games/*" element={<Navigate to="/games" replace />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/help" element={<Help />} />
        <Route path="/developed-by" element={<DevelopedBy />} />
        <Route path="/download" element={<Download />} />
        <Route path="/references" element={<References />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function PlaceholderPage({ title }) {
  return (
    <div className="placeholder-page">
      <div className="placeholder-card">

        <span className="section-label">
          HASHLAB
        </span>

        <h1>{title}</h1>

        <p>
          This section will be developed in the next stage
          of the project.
        </p>

        <NavBack />
      </div>
    </div>
  );
}

function NavBack() {
  return (
    <a href="/">
      ← Back to Home
    </a>
  );
}

export default App;
