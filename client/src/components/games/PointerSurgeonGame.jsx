import React, { useState, useEffect } from "react";
import {
  Scissors,
  Zap,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Search,
  ShieldCheck,
  Star,
  Layers
} from "lucide-react";
import { sounds } from "../../utils/soundEffects.js";

const MISSIONS = [
  {
    id: 1,
    title: "LEVEL 1: Connect Number to Chain",
    subtitle: "Incoming Key 27 collided at Slot [2]. Connect the wire from the tail to attach Key 27!",
    bucketSlot: 2,
    initialNodes: [
      { id: "node-12", key: 12, addr: "0x1A0", next: "node-17" },
      { id: "node-17", key: 17, addr: "0x2B4", next: null },
    ],
    incomingNode: { id: "node-27", key: 27, addr: "0x3F8", next: null },
    steps: [
      "1. Select 'Wire Tool'",
      "2. Click Node 17, then click Node 27 to link them",
      "3. Switch to 'NULL Plug' tool and click Node 27 to cap the end!",
    ],
    checkSolved: (nodes, incomingConnected, incomingNextNull) => {
      const node17 = nodes.find((n) => n.id === "node-17");
      return node17?.next === "node-27" && incomingConnected && incomingNextNull;
    },
    educationalLesson:
      "Separate Chaining connects collided items into a linked list. In code: `tail->next = new_node; new_node->next = NULL;`.",
  },
  {
    id: 2,
    title: "LEVEL 2: Delete Item Safely",
    subtitle: "Remove Key 15 from Slot [1] without breaking the chain or causing a memory leak!",
    bucketSlot: 1,
    initialNodes: [
      { id: "node-6", key: 6, addr: "0x100", next: "node-15" },
      { id: "node-15", key: 15, addr: "0x180", next: "node-21", isCorrupted: true },
      { id: "node-21", key: 21, addr: "0x220", next: null },
    ],
    incomingNode: null,
    steps: [
      "1. Select 'Wire Tool', click Node 6, then click Node 21 (bypass Node 15)",
      "2. Select 'Scissors' tool and click Node 15 to safely remove it!",
    ],
    checkSolved: (nodes, _, __, deletedNodeId) => {
      const node6 = nodes.find((n) => n.id === "node-6");
      return node6?.next === "node-21" && deletedNodeId === "node-15";
    },
    educationalLesson:
      "When deleting an item in a linked list, you MUST point the previous item directly to the next item (`prev->next = target->next`) before freeing memory. Otherwise the rest of the list gets lost!",
  },
  {
    id: 3,
    title: "LEVEL 3: Search Query Hop Trace",
    subtitle: "Query: SELECT * WHERE key = 34. Watch how the computer hops through memory!",
    bucketSlot: 4,
    initialNodes: [
      { id: "node-9", key: 9, addr: "0x400", next: "node-14" },
      { id: "node-14", key: 14, addr: "0x480", next: "node-24" },
      { id: "node-24", key: 24, addr: "0x520", next: "node-34" },
      { id: "node-34", key: 34, addr: "0x610", next: null, isTarget: true },
    ],
    incomingNode: null,
    isTracerMission: true,
    targetKey: 34,
    steps: [
      "Click 'Hop to Next Pointer' below to trace addresses until you reach 34!",
    ],
    educationalLesson:
      "Linked lists require pointer hopping. Reaching an item deep in a chain takes multiple memory jumps. This is why long chains slow down lookups from O(1) toward O(N)!",
  },
  {
    id: 4,
    title: "LEVEL 4: Insert at Front (O(1) Speed)",
    subtitle: "Instead of walking to the back, insert Key 45 right at the FRONT (Head) in 1 quick step!",
    bucketSlot: 0,
    initialNodes: [
      { id: "node-10", key: 10, addr: "0x700", next: "node-20" },
      { id: "node-20", key: 20, addr: "0x780", next: null },
    ],
    incomingNode: { id: "node-45", key: 45, addr: "0x890", next: null },
    isHeadPrepend: true,
    steps: [
      "1. Select 'Wire Tool', click Head -> click Node 45",
      "2. Then click Node 45 -> click Node 10!",
    ],
    checkSolved: (nodes, incomingConnected, _, __, headPointsTo) => {
      const node45 = nodes.find((n) => n.id === "node-45");
      return headPointsTo === "node-45" && node45?.next === "node-10";
    },
    educationalLesson:
      "Inserting at the FRONT of a list takes strictly 1 step (O(1) time), no matter how long the list is!",
  },
];

export default function PointerSurgeonGame({ awardXp, onCelebrate }) {
  const [missionIdx, setMissionIdx] = useState(0);
  const [activeTool, setActiveTool] = useState("wire"); // "wire" | "scalpel" | "null"
  const [wireSource, setWireSource] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [incomingPlaced, setIncomingPlaced] = useState(false);
  const [incomingTerminated, setIncomingTerminated] = useState(false);
  const [deletedNodeId, setDeletedNodeId] = useState(null);
  const [headPointsTo, setHeadPointsTo] = useState(null);
  const [traceStep, setTraceStep] = useState(0);
  const [isSolved, setIsSolved] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const mission = MISSIONS[missionIdx];

  useEffect(() => {
    resetMission();
  }, [missionIdx]);

  function resetMission() {
    const m = MISSIONS[missionIdx];
    const initialCopy = m.initialNodes.map((n) => ({ ...n }));
    if (m.incomingNode) {
      initialCopy.push({ ...m.incomingNode });
    }
    setNodes(initialCopy);
    setWireSource(null);
    setIncomingPlaced(false);
    setIncomingTerminated(false);
    setDeletedNodeId(null);
    setHeadPointsTo(m.initialNodes[0]?.id || null);
    setTraceStep(0);
    setIsSolved(false);
    setFeedbackMsg("");
  }

  function handlePortClick(sourceId) {
    if (isSolved) return;

    if (activeTool === "scalpel") {
      sounds.playCut();
      setNodes((prev) =>
        prev.map((n) => (n.id === sourceId ? { ...n, next: null } : n))
      );
      setFeedbackMsg(`Cut outgoing pointer wire from [${sourceId}]!`);
      return;
    }

    if (activeTool === "null") {
      sounds.playZap();
      setNodes((prev) =>
        prev.map((n) => (n.id === sourceId ? { ...n, next: null } : n))
      );
      if (sourceId === mission.incomingNode?.id) {
        setIncomingTerminated(true);
      }
      setFeedbackMsg(`Capped [${sourceId}] pointer with NULL (End of list).`);
      checkVictory(nodes, incomingPlaced, true, deletedNodeId, headPointsTo);
      return;
    }

    // Wiring tool
    if (!wireSource) {
      setWireSource(sourceId);
      sounds.playClick();
      setFeedbackMsg(`Selected [${sourceId}]. Now click the box you want to connect to!`);
    } else {
      if (wireSource === sourceId) {
        setWireSource(null);
        return;
      }
      sounds.playZap();
      const newNodes = nodes.map((n) =>
        n.id === wireSource ? { ...n, next: sourceId } : n
      );
      setNodes(newNodes);

      let placed = incomingPlaced;
      if (sourceId === mission.incomingNode?.id || wireSource === mission.incomingNode?.id) {
        placed = true;
        setIncomingPlaced(true);
      }

      setFeedbackMsg(`Connected: [${wireSource}] ──► [${sourceId}]`);
      setWireSource(null);
      checkVictory(newNodes, placed, incomingTerminated, deletedNodeId, headPointsTo);
    }
  }

  function handleHeadClick() {
    if (isSolved || !mission.isHeadPrepend) return;

    if (wireSource) {
      setHeadPointsTo(wireSource);
      sounds.playZap();
      setWireSource(null);
      setFeedbackMsg(`Head now points to [${wireSource}]!`);
      checkVictory(nodes, true, incomingTerminated, deletedNodeId, wireSource);
    } else {
      setWireSource("HEAD");
      sounds.playClick();
      setFeedbackMsg("Head selected. Click the box to connect!");
    }
  }

  function handleNodeBodyClick(nodeId) {
    if (isSolved) return;

    if (activeTool === "scalpel" && mission.id === 2 && nodeId === "node-15") {
      sounds.playCut();
      setDeletedNodeId("node-15");
      setFeedbackMsg("Safely removed Key 15 from memory!");
      checkVictory(nodes, incomingPlaced, incomingTerminated, "node-15", headPointsTo);
      return;
    }

    if (wireSource) {
      if (wireSource === "HEAD") {
        setHeadPointsTo(nodeId);
        sounds.playZap();
        setWireSource(null);
        setFeedbackMsg(`Head linked to Node [${nodeId}]!`);
        checkVictory(nodes, true, incomingTerminated, deletedNodeId, nodeId);
      } else {
        sounds.playZap();
        const newNodes = nodes.map((n) =>
          n.id === wireSource ? { ...n, next: nodeId } : n
        );
        setNodes(newNodes);

        let placed = incomingPlaced;
        if (nodeId === mission.incomingNode?.id || wireSource === mission.incomingNode?.id) {
          placed = true;
          setIncomingPlaced(true);
        }

        setFeedbackMsg(`Connected [${wireSource}] ──► [${nodeId}]`);
        setWireSource(null);
        checkVictory(newNodes, placed, incomingTerminated, deletedNodeId, headPointsTo);
      }
    }
  }

  function handleTraceStep() {
    if (isSolved || !mission.isTracerMission) return;

    sounds.playWhoosh();
    const nextStep = traceStep + 1;
    setTraceStep(nextStep);

    if (nextStep === 1) {
      setFeedbackMsg("Hop 1: Head -> Checked Node 9. Not 34! Moving next...");
    } else if (nextStep === 2) {
      setFeedbackMsg("Hop 2: Node 9 -> Checked Node 14. Not 34! Moving next...");
    } else if (nextStep === 3) {
      setFeedbackMsg("Hop 3: Node 14 -> Checked Node 24. Not 34! Almost there...");
    } else if (nextStep === 4) {
      setFeedbackMsg("Hop 4: TARGET 34 FOUND! It took 4 hops to reach.");
      setIsSolved(true);
      sounds.playCelebration();
      awardXp(50);
      if (onCelebrate) onCelebrate();
    }
  }

  function checkVictory(curNodes, placed, terminated, delId, headPtr) {
    if (mission.checkSolved && mission.checkSolved(curNodes, placed, terminated, delId, headPtr)) {
      setIsSolved(true);
      sounds.playCelebration();
      awardXp(50);
      if (onCelebrate) onCelebrate();
    }
  }

  return (
    <div className="ice-panel">
      {/* 3 Golden Stars */}
      <div className="ice-stars-crown">
        <Star size={34} fill="#fbbd23" color="#78350f" className="ice-crown-star star-left" />
        <Star size={44} fill="#fbbd23" color="#78350f" className="ice-crown-star star-mid" />
        <Star size={34} fill="#fbbd23" color="#78350f" className="ice-crown-star star-right" />
      </div>

      {/* Header */}
      <div className="ice-panel-header">
        <h2 className="ice-panel-title">{mission.title}</h2>
        <p className="ice-panel-desc">{mission.subtitle}</p>
      </div>

      {/* Level Selection Tabs */}
      <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "20px", flexWrap: "wrap" }}>
        {MISSIONS.map((m, idx) => (
          <button
            key={m.id}
            type="button"
            className={`ice-diff-btn ${missionIdx === idx ? "active" : ""}`}
            style={{ fontSize: "12px", minWidth: "120px", padding: "8px 14px" }}
            onClick={() => {
              sounds.playClick();
              setMissionIdx(idx);
            }}
          >
            Level {m.id}
          </button>
        ))}
      </div>

      {/* Mission Instructions Box */}
      <div className="ice-helper-card">
        <div className="ice-helper-header">
          <span className="ice-helper-title">🎯 LEVEL OBJECTIVE:</span>
        </div>
        <div style={{ fontSize: "13px", fontWeight: 700, color: "#064e3b", lineHeight: 1.5 }}>
          {mission.steps.map((st, i) => (
            <div key={i} style={{ marginBottom: "4px" }}>{st}</div>
          ))}
        </div>
      </div>

      {/* Tool Selector */}
      {!mission.isTracerMission && (
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "20px", flexWrap: "wrap" }}>
          <button
            type="button"
            className={`ice-diff-btn ${activeTool === "wire" ? "active" : ""}`}
            style={{ minWidth: "140px" }}
            onClick={() => {
              sounds.playClick();
              setActiveTool("wire");
              setWireSource(null);
            }}
          >
            <Zap size={16} /> Wire Tool
          </button>
          <button
            type="button"
            className={`ice-diff-btn ${activeTool === "scalpel" ? "active" : ""}`}
            style={{ minWidth: "140px" }}
            onClick={() => {
              sounds.playClick();
              setActiveTool("scalpel");
              setWireSource(null);
            }}
          >
            <Scissors size={16} /> Scissors (Cut)
          </button>
          <button
            type="button"
            className={`ice-diff-btn ${activeTool === "null" ? "active" : ""}`}
            style={{ minWidth: "140px" }}
            onClick={() => {
              sounds.playClick();
              setActiveTool("null");
              setWireSource(null);
            }}
          >
            <ShieldCheck size={16} /> NULL Plug (End)
          </button>
        </div>
      )}

      {/* Memory Board */}
      <div className="ice-wire-board">
        {feedbackMsg && (
          <div style={{ textAlign: "center", color: "#67e8f9", fontWeight: 800, fontSize: "14px", marginBottom: "16px" }}>
            {feedbackMsg}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "16px", overflowX: "auto", padding: "10px 4px" }}>
          {/* Head Box */}
          <div
            className="ice-wire-node-card"
            style={{
              borderColor: wireSource === "HEAD" ? "#f59e0b" : "#38bdf8",
              cursor: mission.isHeadPrepend ? "pointer" : "default"
            }}
            onClick={handleHeadClick}
          >
            <div style={{ fontSize: "10px", fontWeight: 900, color: "#0369a1" }}>
              SLOT [{mission.bucketSlot}] HEAD
            </div>
            <div style={{ fontSize: "11px", color: "#0d3858", fontWeight: 800 }}>
              Points to: {headPointsTo || "NULL"}
            </div>
            {mission.isHeadPrepend && (
              <small style={{ fontSize: "9px", color: "#0284c7", fontWeight: 900 }}>Click to link</small>
            )}
          </div>

          <span style={{ color: "#38bdf8", fontWeight: 900, fontSize: "18px" }}>──►</span>

          {/* Nodes */}
          {nodes
            .filter((n) => n.id !== deletedNodeId)
            .map((node, idx) => {
              const isTargetNode = node.isTarget;
              const isCorrupted = node.isCorrupted;
              const isBeingTraced = mission.isTracerMission && traceStep > 0 && traceStep >= idx + 1;

              return (
                <div
                  key={node.id}
                  className={`ice-wire-node-card ${isTargetNode ? "is-target-node" : ""}`}
                  style={{
                    borderColor: isBeingTraced ? "#10b981" : isCorrupted ? "#ef4444" : "#0d3d63"
                  }}
                  onClick={() => handleNodeBodyClick(node.id)}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", fontWeight: 900, color: "#0369a1" }}>
                    <span>{node.id}</span>
                    <span>{node.addr}</span>
                  </div>

                  <div style={{ fontSize: "22px", fontWeight: 900, textAlign: "center", color: "#0d3858", margin: "4px 0" }}>
                    {node.key}
                  </div>

                  <div
                    className="ice-wire-port-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePortClick(node.id);
                    }}
                  >
                    <span>next:</span>
                    <span>{node.next ? `-> ${node.next}` : "NULL"}</span>
                  </div>

                  {isCorrupted && (
                    <small style={{ color: "#dc2626", fontWeight: 900, fontSize: "9px", textAlign: "center" }}>
                      DELETE ME
                    </small>
                  )}
                  {isTargetNode && (
                    <small style={{ color: "#d97706", fontWeight: 900, fontSize: "9px", textAlign: "center" }}>
                      TARGET
                    </small>
                  )}
                </div>
              );
            })}
        </div>

        {/* Tracer Button */}
        {mission.isTracerMission && !isSolved && (
          <div style={{ textAlign: "center", marginTop: "18px" }}>
            <button
              type="button"
              onClick={handleTraceStep}
              className="ice-action-btn"
            >
              <Search size={18} /> HOP TO NEXT POINTER ({traceStep + 1} OF 4)
            </button>
          </div>
        )}
      </div>

      {/* Solved Banner with OK Button */}
      {isSolved && (
        <div className="ice-feedback-popup success">
          <div>
            <h4 className="ice-feedback-title">LEVEL SOLVED!</h4>
            <p className="ice-feedback-text">{mission.educationalLesson}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (missionIdx < MISSIONS.length - 1) {
                setMissionIdx((i) => i + 1);
              } else {
                resetMission();
              }
            }}
            className="ice-action-btn btn-green"
          >
            OK
          </button>
        </div>
      )}
    </div>
  );
}
