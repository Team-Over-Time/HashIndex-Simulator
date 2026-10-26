import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  SeparateChaining,
  LinearProbing,
  QuadraticProbing,
  DoubleHashing,
  evaluateHashExpr,
} from "../algorithms/CollisionStrategies.js";
import { Rehashing } from "../algorithms/Rehashing.js";
import { ExtendibleHash } from "../algorithms/ExtendibleHash.js";
import { LinearHash } from "../algorithms/LinearHash.js";
import {
  Activity, BookOpen, CheckCircle2, ChevronDown, ChevronRight,
  CircleAlert, RotateCcw, Play, Pause, SkipForward, Trash2, Search,
  Database, Hash, Layers3, Gauge, Link2, Zap, ListTree
} from "lucide-react";

const ALGORITHMS = [
  { id: "separate", label: "Separate Chaining", group: "Open Hashing", formula: "h(k) = k mod m" },
  { id: "linear", label: "Linear Probing", group: "Closed Hashing", formula: "h(k, i) = (h(k) + i × c) mod m" },
  { id: "quadratic", label: "Quadratic Probing", group: "Closed Hashing", formula: "h(k, i) = (h(k) + c₁i + c₂i²) mod m" },
  { id: "double", label: "Double Hashing", group: "Closed Hashing", formula: "h(k, i) = (h₁(k) + i × h₂(k)) mod m" },
  { id: "rehashing", label: "Rehashing", group: "Dynamic Hashing", formula: "Resize when load threshold is reached" },
  { id: "extendible", label: "Extendible Hashing", group: "Dynamic Hashing", formula: "Directory + local/global depth" },
  { id: "linear-hashing", label: "Linear Hashing", group: "Dynamic Hashing", formula: "Incremental bucket splitting" },
];

const initialAlgorithm = (value) => ALGORITHMS.some((a) => a.id === value) ? value : "separate";
const mod = (n, m) => m > 0 ? ((n % m) + m) % m : 0;
const styles = `
.hashlab-sim {
  color: var(--text-primary, #0f172a);
  padding: 24px 20px 60px;
  max-width: 1540px;
  margin: 0 auto;
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
}
.hashlab-sim * { box-sizing: border-box; }
.hl-muted { color: var(--text-muted, #64748b); }

/* Panels & Cards */
.hl-panel {
  background: var(--bg-card, #ffffff);
  border: 1.5px solid var(--border-main, #e2e8f0);
  border-radius: 16px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
  transition: all 0.25s ease;
}

[data-theme="dark"] .hl-panel,
.dark-theme .hl-panel,
.dark .hl-panel {
  background: #111827 !important;
  border: 1.5px solid #1f2937 !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.55) !important;
}

.hl-layout {
  display: grid;
  grid-template-columns: 290px minmax(0, 1fr) 330px;
  gap: 16px;
  align-items: stretch;
  margin-top: 12px;
}

@media (max-width: 1280px) {
  .hl-layout {
    grid-template-columns: 270px minmax(0, 1fr) 300px;
    gap: 12px;
  }
}

@media (max-width: 1040px) {
  .hl-layout {
    grid-template-columns: 270px minmax(0, 1fr);
  }
  .hl-rightdock {
    grid-column: 1 / -1;
  }
}

@media (max-width: 768px) {
  .hl-layout {
    grid-template-columns: 1fr;
    height: auto;
  }
  .hl-sidebar, .hl-tablepanel, .hl-rightdock {
    height: auto !important;
    max-height: none !important;
  }
}

/* Left Sidebar Controls */
.hl-sidebar {
  padding: 18px;
  height: calc(100vh - 170px);
  min-height: 480px;
  max-height: 760px;
  overflow-y: auto;
}

/* Center Hash Table Panel (Middle Component) */
.hl-tablepanel {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 170px);
  min-height: 480px;
  max-height: 760px;
  padding: 18px;
  overflow: hidden;
}

.hl-tablepanel-header {
  margin-bottom: 12px;
  flex-shrink: 0;
}

.hl-tablepanel .hl-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: auto;
  border-radius: 10px;
}

.hl-tablepanel .hl-legend {
  margin-top: 12px;
  flex-shrink: 0;
}

/* Right Dock: Step Traces & Live Metrics */
.hl-rightdock {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: calc(100vh - 170px);
  min-height: 480px;
  max-height: 760px;
}

.hl-traces-panel {
  flex: 1.15;
  overflow: hidden;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.hl-traces-scroll {
  flex: 1;
  overflow-y: auto;
  padding-right: 2px;
}

.hl-metricpanel {
  flex: 0.85;
  overflow-y: auto;
  padding: 16px;
}


/* Titles & Section Headers */
.hl-title {
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  font-size: clamp(24px, 2.8vw, 34px);
  font-weight: 800;
  letter-spacing: -0.025em;
  color: var(--text-primary, #0f172a);
  margin: 6px 0 6px;
}

[data-theme="dark"] .hl-title,
.dark-theme .hl-title,
.dark .hl-title {
  color: #f8fafc !important;
}

.hl-subtitle {
  margin: 0;
  color: var(--text-secondary, #334155);
  font-size: 14.5px;
  line-height: 1.6;
}

[data-theme="dark"] .hl-subtitle,
.dark-theme .hl-subtitle,
.dark .hl-subtitle {
  color: #94a3b8 !important;
}

.hl-sectionhead {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  font-size: 15px;
  margin: 0 0 16px;
  color: var(--text-primary, #0f172a);
}

[data-theme="dark"] .hl-sectionhead,
.dark-theme .hl-sectionhead,
.dark .hl-sectionhead {
  color: #f8fafc !important;
}

.hl-icon {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  color: #ffffff;
  background: linear-gradient(135deg, #2563eb, #38bdf8);
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.35);
  flex-shrink: 0;
}

/* Chips & Badges */
.hl-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid var(--border-main, #e2e8f0);
  border-radius: 999px;
  padding: 5px 12px;
  font-size: 11.5px;
  font-weight: 700;
  background: var(--bg-card-muted, #f1f5f9);
  color: var(--text-secondary, #334155);
}

[data-theme="dark"] .hl-chip,
.dark-theme .hl-chip,
.dark .hl-chip {
  background: rgba(30, 41, 59, 0.8) !important;
  border: 1px solid rgba(56, 189, 248, 0.25) !important;
  color: #38bdf8 !important;
}

.hl-label {
  display: block;
  font-size: 12px;
  font-weight: 800;
  margin: 16px 0 7px;
  color: var(--text-secondary, #334155);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

[data-theme="dark"] .hl-label,
.dark-theme .hl-label,
.dark .hl-label {
  color: #cbd5e1 !important;
}

/* Form Controls */
.hl-input,
.hl-select {
  width: 100%;
  min-height: 42px;
  border: 1.5px solid var(--border-main, #dbe5f5);
  border-radius: 10px;
  background: var(--bg-input, #ffffff);
  color: var(--text-primary, #0f172a);
  padding: 9px 12px;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 600;
  outline: none;
  transition: all 0.2s ease;
}

.hl-input:focus,
.hl-select:focus {
  border-color: var(--accent-primary, #2563eb);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.25);
}

[data-theme="dark"] .hl-input,
[data-theme="dark"] .hl-select,
.dark-theme .hl-input,
.dark-theme .hl-select,
.dark .hl-input,
.dark .hl-select {
  background: #0f172a !important;
  border: 1.5px solid #1f2937 !important;
  color: #f8fafc !important;
}

[data-theme="dark"] .hl-input:focus,
[data-theme="dark"] .hl-select:focus,
.dark-theme .hl-input:focus,
.dark-theme .hl-select:focus,
.dark .hl-input:focus,
.dark .hl-select:focus {
  border-color: #38bdf8 !important;
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.25) !important;
}

[data-theme="dark"] .hl-select option,
.dark-theme .hl-select option,
.dark .hl-select option {
  background-color: #111827 !important;
  color: #f8fafc !important;
}

/* Action Buttons */
.hl-btn {
  border: 1.5px solid var(--border-main, #dbe5f5);
  border-radius: 9px;
  background: var(--bg-card, #ffffff);
  color: var(--text-primary, #0f172a);
  padding: 10px 14px;
  display: inline-flex;
  gap: 7px;
  align-items: center;
  justify-content: center;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.18s ease;
}

.hl-btn:hover {
  transform: translateY(-1.5px);
  filter: brightness(1.05);
}

.hl-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
}

[data-theme="dark"] .hl-btn,
.dark-theme .hl-btn,
.dark .hl-btn {
  background: #1e293b !important;
  border: 1.5px solid #334155 !important;
  color: #f8fafc !important;
}

[data-theme="dark"] .hl-btn:hover,
.dark-theme .hl-btn:hover,
.dark .hl-btn:hover {
  background: #273549 !important;
  border-color: #38bdf8 !important;
  color: #38bdf8 !important;
}

.hl-primary {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%) !important;
  color: #ffffff !important;
  border-color: transparent !important;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35) !important;
}

.hl-primary:hover {
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.5) !important;
  filter: brightness(1.1) !important;
}

.hl-danger {
  color: #ef4444 !important;
  background: #fef2f2 !important;
  border-color: #fecaca !important;
}

[data-theme="dark"] .hl-danger,
.dark-theme .hl-danger,
.dark .hl-danger {
  color: #f87171 !important;
  background: rgba(239, 68, 68, 0.18) !important;
  border-color: rgba(248, 113, 113, 0.35) !important;
}

.hl-btnrow {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 10px;
}

/* System Message Banner */
.hl-message {
  margin-top: 16px;
  padding: 12px 16px;
  border-radius: 12px;
  background: #eff6ff;
  border: 1.5px solid #bfdbfe;
  color: #1e40af;
  font-size: 13.5px;
  line-height: 1.6;
}

[data-theme="dark"] .hl-message,
.dark-theme .hl-message,
.dark .hl-message {
  background: rgba(14, 165, 233, 0.12) !important;
  border: 1.5px solid rgba(56, 189, 248, 0.3) !important;
  color: #e0f2fe !important;
}

/* Main Workspace Grid */
.hl-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(280px, 0.75fr);
  gap: 16px;
  margin-top: 20px;
}

.hl-traces,
.hl-tablepanel,
.hl-logpanel,
.hl-metricpanel {
  padding: 18px;
  min-width: 0;
}

/* Trace Cards (Calculation Steps) */
.hl-trace {
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  padding: 13px 15px;
  margin: 10px 0;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  transition: all 0.2s ease;
}

[data-theme="dark"] .hl-trace,
.dark-theme .hl-trace,
.dark .hl-trace {
  background: linear-gradient(145deg, #111a2e 0%, #0d1527 100%) !important;
  border: 1.5px solid #1f2937 !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.45) !important;
}

.hl-trace.collision {
  border-color: #fed7aa;
  background: linear-gradient(135deg, #fffbeb 0%, #fff7ed 100%);
}

[data-theme="dark"] .hl-trace.collision,
.dark-theme .hl-trace.collision,
.dark .hl-trace.collision {
  border-color: rgba(245, 158, 11, 0.4) !important;
  background: linear-gradient(145deg, rgba(245, 158, 11, 0.1) 0%, #0d1527 100%) !important;
}

.hl-trace.success {
  border-color: #bbf7d0;
}

[data-theme="dark"] .hl-trace.success,
.dark-theme .hl-trace.success,
.dark .hl-trace.success {
  border-color: rgba(52, 211, 153, 0.35) !important;
}

.hl-tracehead {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.hl-step {
  width: 26px;
  height: 26px;
  flex: none;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #2563eb, #38bdf8);
  color: #ffffff;
  font-size: 12px;
  font-weight: 800;
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.35);
}

.hl-status {
  font-size: 10.5px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 999px;
  background: #dcfce7;
  color: #15803d;
  white-space: nowrap;
}

[data-theme="dark"] .hl-status,
.dark-theme .hl-status,
.dark .hl-status {
  background: rgba(16, 185, 129, 0.18) !important;
  color: #34d399 !important;
  border: 1px solid rgba(52, 211, 153, 0.35) !important;
}

.hl-status.warn {
  background: #fef3c7;
  color: #b45309;
}

[data-theme="dark"] .hl-status.warn,
.dark-theme .hl-status.warn,
.dark .hl-status.warn {
  background: rgba(245, 158, 11, 0.18) !important;
  color: #fbbf24 !important;
  border: 1px solid rgba(251, 191, 36, 0.35) !important;
}

.hl-math {
  font: 12.5px/1.8 ui-monospace, SFMono-Regular, Menlo, monospace;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  margin: 10px 0 0 36px;
  padding: 10px 14px;
  border-radius: 8px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: #1e3a8a;
}

[data-theme="dark"] .hl-math,
.dark-theme .hl-math,
.dark .hl-math {
  background: #090e1a !important;
  border: 1px solid #1f2937 !important;
  color: #93c5fd !important;
}

/* Premium Hash Table Styling */
.hl-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 13px;
  border: 1.5px solid var(--border-main, #dbe5f5);
  border-radius: 12px;
  overflow: hidden;
  background: var(--bg-card, #ffffff);
}

[data-theme="dark"] .hl-table,
.dark-theme .hl-table,
.dark .hl-table {
  border-color: #1f2937 !important;
  background: #0b1120 !important;
}

.hl-table th {
  background: #f8fafc;
  color: var(--text-primary, #0f172a);
  font-weight: 800;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 11px 14px;
  border-bottom: 1.5px solid var(--border-main, #dbe5f5);
  text-align: left;
}

[data-theme="dark"] .hl-table th,
.dark-theme .hl-table th,
.dark .hl-table th {
  background: #0f172a !important;
  color: #f8fafc !important;
  border-bottom: 1.5px solid #1f2937 !important;
}

.hl-table td {
  padding: 10px 14px;
  border-bottom: 1px solid var(--border-main, #e2e8f0);
  color: var(--text-secondary, #334155);
  vertical-align: middle;
  transition: background 0.15s ease;
}

[data-theme="dark"] .hl-table td,
.dark-theme .hl-table td,
.dark .hl-table td {
  border-bottom: 1px solid #1f2937 !important;
  color: #cbd5e1 !important;
}

.hl-table tbody tr:hover td {
  background: rgba(241, 245, 249, 0.65);
}

[data-theme="dark"] .hl-table tbody tr:hover td,
.dark-theme .hl-table tbody tr:hover td,
.dark .hl-table tbody tr:hover td {
  background: rgba(30, 41, 59, 0.45) !important;
}

.hl-table tr:last-child td {
  border-bottom: 0;
}

/* Active Row Highlight */
.hl-table tr.active-row td {
  background: rgba(59, 130, 246, 0.06);
}

[data-theme="dark"] .hl-table tr.active-row td {
  background: rgba(56, 189, 248, 0.1) !important;
}

.hl-table tr.active-row td:first-child {
  border-left: 3.5px solid #3b82f6;
}

/* Slot Badge */
.hl-slot-badge {
  display: inline-flex;
  flex-direction: column;
  gap: 2px;
}

.hl-slot-idx {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13.5px;
  font-weight: 850;
  color: var(--text-primary, #0f172a);
}

[data-theme="dark"] .hl-slot-idx {
  color: #f8fafc !important;
}

.hl-slot-formula {
  font-size: 10px;
  font-family: 'JetBrains Mono', monospace;
  color: var(--text-muted, #64748b);
  letter-spacing: -0.01em;
}

/* Status Badges */
.hl-status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;
}

.hl-status-pill.empty {
  background: var(--bg-card-muted, #f1f5f9);
  color: var(--text-muted, #64748b);
  border: 1px solid var(--border-main, #dbe5f5);
}

[data-theme="dark"] .hl-status-pill.empty {
  background: #1e293b !important;
  color: #94a3b8 !important;
  border-color: #334155 !important;
}

.hl-status-pill.occupied {
  background: rgba(16, 185, 129, 0.12);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.25);
}

[data-theme="dark"] .hl-status-pill.occupied {
  background: rgba(16, 185, 129, 0.18) !important;
  color: #34d399 !important;
  border-color: rgba(52, 211, 153, 0.35) !important;
}

.hl-status-pill.chained {
  background: rgba(245, 158, 11, 0.12);
  color: #b45309;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

[data-theme="dark"] .hl-status-pill.chained {
  background: rgba(245, 158, 11, 0.2) !important;
  color: #fbbf24 !important;
  border-color: rgba(251, 191, 36, 0.4) !important;
}

.hl-status-pill.tombstone {
  background: rgba(239, 68, 68, 0.12);
  color: #dc2626;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

[data-theme="dark"] .hl-status-pill.tombstone {
  background: rgba(239, 68, 68, 0.2) !important;
  color: #f87171 !important;
  border-color: rgba(248, 113, 113, 0.4) !important;
}

/* Empty Pill in cell */
.hl-empty-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--text-muted, #94a3b8);
  font-size: 12px;
  font-style: italic;
}

/* =========================================================
   LINKED LIST CHAIN REPRESENTATION (2+ KEYS IN SAME BUCKET)
========================================================= */

.hl-ll-chain {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;
  max-width: 100%;
  overflow-x: auto;
  padding: 3px 2px;
}

.hl-ll-head-ptr {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 7px;
  border-radius: 6px;
  background: rgba(59, 130, 246, 0.12);
  border: 1px solid rgba(59, 130, 246, 0.3);
  font-size: 10px;
  font-weight: 850;
  color: #2563eb;
  letter-spacing: 0.04em;
  flex-shrink: 0;
}

[data-theme="dark"] .hl-ll-head-ptr {
  background: rgba(56, 189, 248, 0.18) !important;
  border-color: rgba(56, 189, 248, 0.35) !important;
  color: #38bdf8 !important;
}

.hl-ll-head-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #2563eb;
}

[data-theme="dark"] .hl-ll-head-dot {
  background: #38bdf8;
}

.hl-ll-arrow {
  color: #94a3b8;
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
}

.hl-ll-node {
  display: inline-flex;
  align-items: stretch;
  border-radius: 8px;
  border: 1.5px solid #10b981;
  background: #ecfdf5;
  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.12);
  overflow: hidden;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

[data-theme="dark"] .hl-ll-node {
  background: #042419 !important;
  border-color: #059669 !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4) !important;
}

.hl-ll-node.collision-node {
  border-color: #f59e0b;
  background: #fffbeb;
  box-shadow: 0 2px 6px rgba(245, 158, 11, 0.15);
}

[data-theme="dark"] .hl-ll-node.collision-node {
  background: #241604 !important;
  border-color: rgba(245, 158, 11, 0.6) !important;
}

.hl-ll-node.pulse-node {
  border-color: #3b82f6 !important;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.35) !important;
}

[data-theme="dark"] .hl-ll-node.pulse-node {
  border-color: #38bdf8 !important;
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.4) !important;
}

.hl-node-data {
  padding: 5px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-right: 1px solid rgba(0, 0, 0, 0.08);
}

[data-theme="dark"] .hl-node-data {
  border-right: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.hl-node-val {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13.5px;
  font-weight: 850;
  color: var(--text-primary, #0f172a);
}

[data-theme="dark"] .hl-node-val {
  color: #f8fafc !important;
}

.hl-node-tag {
  font-size: 9px;
  font-weight: 800;
  margin-top: 1px;
}

.hl-node-tag.head {
  color: #059669;
}

[data-theme="dark"] .hl-node-tag.head {
  color: #34d399 !important;
}

.hl-node-tag.col {
  color: #b45309;
}

[data-theme="dark"] .hl-node-tag.col {
  color: #fbbf24 !important;
}

.hl-node-next {
  padding: 5px 7px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.03);
}

[data-theme="dark"] .hl-node-next {
  background: rgba(255, 255, 255, 0.04) !important;
}

.hl-next-txt {
  font-size: 8px;
  font-weight: 800;
  color: var(--text-muted, #64748b);
  text-transform: uppercase;
}

[data-theme="dark"] .hl-next-txt {
  color: #94a3b8 !important;
}

.hl-next-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #3b82f6;
  margin-top: 2px;
}

[data-theme="dark"] .hl-next-dot {
  background: #38bdf8;
}

.hl-null-pill {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 7px;
  border-radius: 6px;
  border: 1px dashed #cbd5e1;
  background: #f8fafc;
  color: var(--text-muted, #64748b);
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  font-weight: 800;
  flex-shrink: 0;
}

[data-theme="dark"] .hl-null-pill {
  border-color: #334155 !important;
  background: #111827 !important;
  color: #64748b !important;
}

/* Open Addressing Key Pill */
.hl-oa-key-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 8px;
  background: rgba(16, 185, 129, 0.12);
  border: 1.5px solid rgba(16, 185, 129, 0.35);
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  font-weight: 850;
  color: #059669;
}

[data-theme="dark"] .hl-oa-key-pill {
  background: rgba(16, 185, 129, 0.18) !important;
  border-color: rgba(52, 211, 153, 0.4) !important;
  color: #34d399 !important;
}

.hl-oa-tombstone-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 8px;
  background: rgba(245, 158, 11, 0.12);
  border: 1.5px dashed rgba(245, 158, 11, 0.45);
  font-size: 12px;
  font-weight: 800;
  color: #b45309;
}

[data-theme="dark"] .hl-oa-tombstone-pill {
  background: rgba(245, 158, 11, 0.18) !important;
  color: #fbbf24 !important;
  border-color: rgba(251, 191, 36, 0.4) !important;
}
/* Legend */
.hl-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  font-size: 11px;
  font-weight: 700;
  color: var(--text-secondary, #334155);
  margin-top: 14px;
}

[data-theme="dark"] .hl-legend,
.dark-theme .hl-legend,
.dark .hl-legend {
  color: #94a3b8 !important;
}

.hl-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 3px;
  margin-right: 5px;
  vertical-align: -1px;
}

/* Bottom Split: Log & Metrics */
.hl-bottom {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(280px, 0.75fr);
  gap: 16px;
  margin-top: 16px;
}

.hl-scroll {
  overflow: auto;
}

.hl-log {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  min-width: 440px;
}

.hl-log th,
.hl-log td {
  padding: 8px 12px;
  border-bottom: 1px solid var(--border-main, #dbe5f5);
  text-align: left;
}

[data-theme="dark"] .hl-log th,
[data-theme="dark"] .hl-log td,
.dark-theme .hl-log th,
.dark-theme .hl-log td,
.dark .hl-log th,
.dark .hl-log td {
  border-bottom: 1px solid #1f2937 !important;
}

.hl-log th {
  background: #f1f5f9;
  font-weight: 800;
  color: var(--text-primary, #0f172a);
}

[data-theme="dark"] .hl-log th,
.dark-theme .hl-log th,
.dark .hl-log th {
  background: #0f172a !important;
  color: #f8fafc !important;
}

/* Key Metrics Grid */
.hl-metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.hl-metric {
  padding: 14px 12px;
  border-radius: 12px;
  border: 1.5px solid #e2e8f0;
  background: #f8fafc;
  text-align: center;
  transition: all 0.2s ease;
}

.hl-metric:nth-child(1) { border-top: 3px solid #3b82f6; }
.hl-metric:nth-child(2) { border-top: 3px solid #8b5cf6; }
.hl-metric:nth-child(3) { border-top: 3px solid #10b981; }
.hl-metric:nth-child(4) { border-top: 3px solid #f59e0b; }
.hl-metric:nth-child(5) { border-top: 3px solid #06b6d4; }
.hl-metric:nth-child(6) { border-top: 3px solid #ec4899; }

[data-theme="dark"] .hl-metric,
.dark-theme .hl-metric,
.dark .hl-metric {
  background: linear-gradient(180deg, #111a2e 0%, #0d1527 100%) !important;
  border: 1.5px solid rgba(56, 189, 248, 0.2) !important;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.45) !important;
}

[data-theme="dark"] .hl-metric:nth-child(1) { border-top: 3px solid #38bdf8 !important; }
[data-theme="dark"] .hl-metric:nth-child(2) { border-top: 3px solid #a78bfa !important; }
[data-theme="dark"] .hl-metric:nth-child(3) { border-top: 3px solid #34d399 !important; }
[data-theme="dark"] .hl-metric:nth-child(4) { border-top: 3px solid #fbbf24 !important; }
[data-theme="dark"] .hl-metric:nth-child(5) { border-top: 3px solid #22d3ee !important; }
[data-theme="dark"] .hl-metric:nth-child(6) { border-top: 3px solid #f472b6 !important; }

.hl-metric small {
  display: block;
  font-size: 11px;
  font-weight: 800;
  color: var(--text-muted, #64748b);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

[data-theme="dark"] .hl-metric small,
.dark-theme .hl-metric small,
.dark .hl-metric small {
  color: #94a3b8 !important;
}

.hl-metric strong {
  display: block;
  font-size: 24px;
  margin-top: 4px;
  font-weight: 800;
  color: var(--text-primary, #0f172a);
  font-family: 'JetBrains Mono', monospace;
}

[data-theme="dark"] .hl-metric strong,
.dark-theme .hl-metric strong,
.dark .hl-metric strong {
  color: #f8fafc !important;
}

/* Formula Callout Card */
.hl-formula-box {
  margin-top: 14px;
  border: 1.5px solid #bfdbfe;
  background: #eff6ff;
  border-radius: 12px;
  padding: 14px;
  font-size: 12.5px;
  line-height: 1.6;
}

[data-theme="dark"] .hl-formula-box,
.dark-theme .hl-formula-box,
.dark .hl-formula-box {
  background: rgba(37, 99, 235, 0.12) !important;
  border: 1.5px solid rgba(56, 189, 248, 0.3) !important;
}

.hl-formula-title {
  display: flex;
  gap: 7px;
  align-items: center;
  color: #1d4ed8;
  font-weight: 800;
  margin-bottom: 6px;
}

[data-theme="dark"] .hl-formula-title,
.dark-theme .hl-formula-title,
.dark .hl-formula-title {
  color: #38bdf8 !important;
}

.hl-formula-code {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  color: #1e3a8a;
  padding: 4px 8px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.6);
  display: inline-block;
}

[data-theme="dark"] .hl-formula-code,
.dark-theme .hl-formula-code,
.dark .hl-formula-code {
  background: #090e1a !important;
  border: 1px solid #1f2937 !important;
  color: #93c5fd !important;
}

/* Empty State */
.hl-empty {
  padding: 32px 20px;
  text-align: center;
  color: var(--text-muted, #64748b);
  font-size: 13.5px;
  line-height: 1.6;
}

[data-theme="dark"] .hl-empty,
.dark-theme .hl-empty,
.dark .hl-empty {
  color: #94a3b8 !important;
}

/* Compact Table Mini-chain */
.hl-mini-chain { display: flex; align-items: center; gap: 5px; justify-content: center; flex-wrap: wrap; }
.hl-mini-node-wrap { display: inline-flex; align-items: center; gap: 5px; }

.hl-mini-node {
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 6px;
  background: #d7f5e9;
  color: #065f46;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11.5px;
  font-family: 'JetBrains Mono', monospace;
}

[data-theme="dark"] .hl-mini-node,
.dark-theme .hl-mini-node,
.dark .hl-mini-node {
  background: rgba(16, 185, 129, 0.18) !important;
  color: #34d399 !important;
  border: 1px solid rgba(52, 211, 153, 0.35) !important;
}

.hl-mini-node.collision {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
}

[data-theme="dark"] .hl-mini-node.collision,
.dark-theme .hl-mini-node.collision,
.dark .hl-mini-node.collision {
  background: rgba(245, 158, 11, 0.18) !important;
  color: #fbbf24 !important;
  border: 1px solid rgba(251, 191, 36, 0.35) !important;
}

.hl-mini-arrow { color: #94a3b8; font-weight: 800; font-size: 11px; }
.hl-mini-null { font-size: 10px; font-weight: 800; color: #94a3b8; font-family: 'JetBrains Mono', monospace; }

@media (max-width: 1000px) {
  .hl-layout { grid-template-columns: 1fr; }
  .hl-sidebar { position: static; }
  .hl-workspace, .hl-bottom { grid-template-columns: 1fr; }
}
@media (max-width: 560px) {
  .hashlab-sim { padding: 12px; }
  .hl-main, .hl-sidebar { padding: 14px; }
  .hl-btnrow .hl-btn { flex: 1; }
  .hl-title { font-size: 24px; }
}
`;

export default function Simulator() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [algorithm, setAlgorithm] = useState(() => initialAlgorithm(searchParams.get("algorithm")));
  const [tableSize, setTableSize] = useState("7");
  const [showLog, setShowLog] = useState(false);
  const [bucketCapacity, setBucketCapacity] = useState(2);
  const [globalDepth, setGlobalDepth] = useState(1);
  const [linearBuckets, setLinearBuckets] = useState(2);
  const [linearStep, setLinearStep] = useState(1);
  const [c1, setC1] = useState(0);
  const [c2, setC2] = useState(1);
  const [h1Expr, setH1Expr] = useState("k % m");
  const [h2Expr, setH2Expr] = useState("5 - (k % 5)");
  const [keyText, setKeyText] = useState("");
  const [batchText, setBatchText] = useState("");
  const [state, setState] = useState(null);
  const [trace, setTrace] = useState([]);
  const [activity, setActivity] = useState([]);
  const [message, setMessage] = useState("Ready! Enter a key on the left to insert, search, or delete.");
  const [expanded, setExpanded] = useState({});
  const [playQueue, setPlayQueue] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(850);
  const [lastSlot, setLastSlot] = useState(null);

  const hashTable = useMemo(() => {
    const parsedSize = Number(tableSize);
    if (!Number.isInteger(parsedSize) || parsedSize < 1 || parsedSize > 90) return null;
    if (algorithm === "separate") return new SeparateChaining(parsedSize, h1Expr);
    if (algorithm === "linear") return new LinearProbing(parsedSize, linearStep, h1Expr);
    if (algorithm === "quadratic") return new QuadraticProbing(parsedSize, c1, c2, h1Expr);
    if (algorithm === "double") return new DoubleHashing(parsedSize, h1Expr, h2Expr);
    if (algorithm === "rehashing") return new Rehashing(parsedSize, bucketCapacity, 0.7);
    if (algorithm === "extendible") return new ExtendibleHash(bucketCapacity, globalDepth);
    return new LinearHash(parsedSize, bucketCapacity);
  }, [algorithm, tableSize, bucketCapacity, globalDepth, linearBuckets, linearStep, c1, c2, h1Expr, h2Expr]);

  useEffect(() => {
    setState(hashTable?.getState?.() ?? null);
    setTrace([]); setActivity([]); setLastSlot(null); setPlaying(false); setPlayQueue([]);
  }, [hashTable]);

  const selected = ALGORITHMS.find((item) => item.id === algorithm) || ALGORITHMS[0];
  const currentBuckets = Array.isArray(state?.buckets) ? state.buckets : [];
  const totalKeys = typeof state?.totalKeys === "number" ? state.totalKeys : currentBuckets.reduce((sum, b) => sum + (Array.isArray(b?.keys) ? b.keys.length : b?.occupied ? 1 : 0), 0);
  const loadFactor = typeof state?.loadFactor === "number" ? state.loadFactor : (Number(tableSize) > 0 ? totalKeys / Number(tableSize) : 0);
  const totalCollisions = state?.totalCollisions ?? activity.reduce((sum, row) => sum + row.collisions, 0);
  const totalProbes = state?.totalProbes ?? activity.reduce((sum, row) => sum + row.probes, 0);
  const parseKeys = (text) => text.split(/[\s,;]+/).map((value) => value.trim()).filter(Boolean).map(Number).filter(Number.isSafeInteger);

  function describeOperation(numericKey, result, action, previousState) {
    const operations = Array.isArray(result?.operations) ? result.operations : [];
    const op = operations[operations.length - 1] || {};
    const m = algorithm === "extendible" ? (result?.directorySize || result?.directory?.length || 2) : tableSize;
    const home = mod(evaluateHashExpr(h1Expr, numericKey, m, false), m);
    const slot = typeof op.bucket === "number" ? op.bucket : (typeof op.index === "number" ? op.index : home);
    const probes = Math.max(1, op.probes ?? op.probeCount ?? 1);
    const lines = [];
    if (action === "insert") {
      lines.push(`h(${numericKey}) = ${h1Expr} = ${home} (table size m = ${m})`);
      if (algorithm === "linear") {
        for (let i = 0; i < Math.min(probes, 10); i++) lines.push(`i = ${i}: (${home} + ${i} × ${linearStep}) mod ${m} = ${mod(home + i * linearStep, m)}${i === probes - 1 ? " ← selected slot" : i > 0 ? " ← probe" : ""}`);
      } else if (algorithm === "quadratic") {
        for (let i = 0; i < Math.min(probes, 10); i++) lines.push(`i = ${i}: (${home} + ${c1}×${i} + ${c2}×${i}²) mod ${m} = ${mod(home + c1 * i + c2 * i * i, m)}${i === probes - 1 ? " ← selected slot" : i > 0 ? " ← probe" : ""}`);
      } else if (algorithm === "double") {
        const step = mod(evaluateHashExpr(h2Expr, numericKey, m, true), m) || 1;
        for (let i = 0; i < Math.min(probes, 10); i++) lines.push(`i = ${i}: (${home} + ${i} × ${step}) mod ${m} = ${mod(home + i * step, m)}${i === probes - 1 ? " ← selected slot" : i > 0 ? " ← probe" : ""}`);
      } else if (algorithm === "separate") {
        const oldBucket = previousState?.buckets?.find((bucket) => bucket?.id === home);
        lines.push(oldBucket?.keys?.length ? `Bucket ${home} already contains ${oldBucket.keys.join(", ")} → append ${numericKey} to the chain.` : `Bucket ${home} is empty → insert ${numericKey}.`);
      } else {
        lines.push(op.message || `Insert ${numericKey}; final bucket/index is ${slot}.`);
        if (algorithm === "rehashing") lines.push("The table may grow when its configured load threshold is reached.");
        if (algorithm === "extendible") lines.push(`Directory global depth: ${result?.globalDepth ?? globalDepth}; directory entries: ${result?.directory?.length ?? "shown in table"}.`);
        if (algorithm === "linear-hashing") lines.push(`Linear hashing level: ${result?.level ?? 0}; split pointer: ${result?.splitPointer ?? 0}.`);
      }
    } else {
      lines.push(op.message || `${action === "search" ? "Search" : "Delete"} key ${numericKey}.`);
      if (action === "search") lines.push(`Start from the home address h(${numericKey}) = ${home}; follow the selected algorithm's lookup rule.`);
      if (action === "delete") lines.push("The table state after deletion is shown on the right.");
    }
    const collision = /collision/i.test(`${op.message || ""} ${lines.join(" ")}`) || probes > 1;
    return { id: `${Date.now()}-${Math.random()}`, key: numericKey, action, lines, slot, probes, collisions: collision ? Math.max(1, probes - 1) : 0, status: op.status || (collision ? "Collision handled" : "Success"), message: op.message || `${action} operation completed for key ${numericKey}.`, tableSize: m };
  }

  function perform(action, value = keyText) {
    if (!String(value).trim()) { setMessage("Enter an integer key first."); return; }
    const numericKey = Number(String(value).trim());
    if (!Number.isSafeInteger(numericKey)) { setMessage("Please enter a valid whole-number key."); return; }
    if (!hashTable) { setMessage("Enter a table size between 1 and 90 before performing operations."); return; }
    const previous = hashTable.getState?.() ?? state;
    let result;
    try {
      if (action === "insert") result = hashTable.insert(numericKey);
      else if (action === "search") result = hashTable.search(numericKey);
      else result = hashTable.delete(numericKey);
    } catch (error) {
      setMessage(error?.message || "The operation could not be completed."); return;
    }
    setState(result ?? hashTable.getState?.() ?? null);
    const row = describeOperation(numericKey, result, action, previous);
    setTrace((items) => [...items, row]);
    setActivity((items) => [...items, { ...row, step: items.length + 1 }]);
    setExpanded((items) => ({ ...items, [row.id]: true }));
    setLastSlot(row.slot);
    setMessage(row.message);
    if (action !== "insert") setKeyText(""); else setKeyText("");
  }

  function handleAlgorithmChange(value) {
    setAlgorithm(value);
    setSearchParams({ algorithm: value });
    setTrace([]); setActivity([]); setLastSlot(null); setMessage("Algorithm changed. Enter a key to begin a new simulation."); setPlaying(false); setPlayQueue([]);
  }

  function resetTable() {
    try { const result = hashTable?.reset?.(); setState(result ?? hashTable?.getState?.() ?? null); }
    catch { setState(hashTable?.getState?.() ?? null); }
    setTrace([]); setActivity([]); setLastSlot(null); setKeyText(""); setBatchText(""); setPlayQueue([]); setPlaying(false); setExpanded({}); setMessage("Table reset. Enter your own key values to begin again.");
  }

  function loadBatch() {
    const values = parseKeys(batchText);
    if (!Number.isInteger(Number(tableSize)) || Number(tableSize) < 1 || Number(tableSize) > 90) { setMessage("Enter a table size between 1 and 90 before loading keys."); return; }
    if (!values.length) { setMessage("Enter one or more integer keys separated by commas or spaces."); return; }
    setPlayQueue(values); setPlaying(false); setMessage(`${values.length} user-entered keys loaded into the operation queue.`);
  }
  function stepBatch() {
    if (!playQueue.length) { setMessage("The queue is empty. Enter your own keys and select Load Queue."); return; }
    const [next, ...rest] = playQueue;
    setPlayQueue(rest); perform("insert", String(next));
  }
  useEffect(() => {
    if (!playing || playQueue.length === 0) {
      if (playing && playQueue.length === 0) { setPlaying(false); setMessage("Playback complete. All queued keys have been processed."); }
      return undefined;
    }
    const timer = setTimeout(() => {
      const [next, ...rest] = playQueue;
      setPlayQueue(rest);
      perform("insert", String(next));
    }, speed);
    return () => clearTimeout(timer);
    // perform reads current algorithm instance and state; queue/speed drive playback.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, playQueue, speed]);

  function renderBuckets() {
    if (algorithm === "extendible" && Array.isArray(state?.directory) && state.directory.length) {
      return (
        <table className="hl-table">
          <thead>
            <tr>
              <th style={{ width: "22%" }}>Directory Index</th>
              <th style={{ width: "22%" }}>Binary (Global D)</th>
              <th style={{ width: "24%" }}>Target Bucket</th>
              <th>Bucket Records</th>
            </tr>
          </thead>
          <tbody>
            {state.directory.map((entry, index) => {
              const bucketId = entry?.bucketId ?? entry?.bucket?.id ?? index;
              const bucket = currentBuckets.find((b) => b?.id === bucketId) || entry?.bucket;
              const keys = Array.isArray(bucket?.keys) ? bucket.keys : [];
              return (
                <tr key={`${entry?.index ?? index}-${index}`}>
                  <td>
                    <div className="hl-slot-badge">
                      <span className="hl-slot-idx">Dir [{entry?.index ?? index}]</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, padding: "2px 8px", borderRadius: "5px", background: "var(--bg-card-muted)", border: "1px solid var(--border-main)" }}>
                      {index.toString(2).padStart(state?.globalDepth ?? globalDepth, "0")}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 750, color: "var(--accent-primary)" }}>
                      ➔ Bucket #{bucketId}
                    </span>
                  </td>
                  <td>
                    {keys.length === 0 ? (
                      <span className="hl-empty-pill">— Empty Bucket —</span>
                    ) : keys.length === 1 ? (
                      <div className="hl-oa-key-pill" style={{ padding: "3px 10px", fontSize: "13px" }}>
                        Key: {keys[0]}
                      </div>
                    ) : (
                      <div className="hl-ll-chain">
                        {keys.map((k, i) => (
                          <React.Fragment key={i}>
                            <span className="hl-oa-key-pill" style={{ padding: "3px 8px", fontSize: "12.5px" }}>
                              {k}
                            </span>
                            {i < keys.length - 1 && <span className="hl-ll-arrow">,</span>}
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      );
    }

    const buckets = currentBuckets.length ? currentBuckets : Array.from({ length: Number(tableSize) || 0 }, (_, id) => ({ id, keys: [], occupied: false }));

    return (
      <table className="hl-table">
        <thead>
          <tr>
            <th style={{ width: "22%" }}>Slot / Bucket</th>
            <th>Contents & Pointer Chain</th>
            <th style={{ width: "24%", textAlign: "right" }}>Slot Status</th>
          </tr>
        </thead>
        <tbody>
          {buckets.map((bucket, index) => {
            const id = bucket?.id ?? index;
            const keys = Array.isArray(bucket?.keys) ? bucket.keys : [];
            const isOpenAddressing = ["linear", "quadratic", "double"].includes(algorithm);
            const occupied = isOpenAddressing ? !!bucket?.occupied : keys.length > 0;
            const isCurrent = Number(lastSlot) === Number(id);

            return (
              <tr key={`${id}-${index}`} className={isCurrent ? "active-row" : ""}>
                {/* Column 1: Slot / Bucket */}
                <td>
                  <div className="hl-slot-badge">
                    <span className="hl-slot-idx">Slot [{id}]</span>
                    <span className="hl-slot-formula">h(k) ≡ {id}</span>
                  </div>
                </td>

                {/* Column 2: Contents & Linked List Representation */}
                <td>
                  {isOpenAddressing ? (
                    bucket?.deleted ? (
                      <span className="hl-oa-tombstone-pill">† DEL (Tombstone)</span>
                    ) : bucket?.occupied ? (
                      <span className="hl-oa-key-pill">
                        Key: {bucket?.key}
                      </span>
                    ) : (
                      <span className="hl-empty-pill">— Empty Slot —</span>
                    )
                  ) : keys.length === 0 ? (
                    <span className="hl-empty-pill">
                      <span style={{ fontSize: "12px", marginRight: "3px" }}>⏚</span> NULL (Empty)
                    </span>
                  ) : keys.length === 1 ? (
                    /* 1 key: single clean node linking to NULL */
                    <div className="hl-ll-chain">
                      <div className="hl-ll-head-ptr">
                        <span>HEAD</span>
                        <span className="hl-ll-head-dot" />
                      </div>
                      <span className="hl-ll-arrow">
                        <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
                          <line x1="0" y1="6" x2="13" y2="6" stroke="currentColor" strokeWidth="2" />
                          <polygon points="12,2 17,6 12,10" fill="currentColor" />
                        </svg>
                      </span>
                      <div className={`hl-ll-node ${isCurrent ? "pulse-node" : ""}`}>
                        <div className="hl-node-data">
                          <span className="hl-node-val">{keys[0]}</span>
                          <span className="hl-node-tag head">Key</span>
                        </div>
                        <div className="hl-node-next">
                          <span className="hl-next-txt">next</span>
                          <span className="hl-next-dot" />
                        </div>
                      </div>
                      <span className="hl-ll-arrow">
                        <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
                          <line x1="0" y1="6" x2="13" y2="6" stroke="currentColor" strokeWidth="2" />
                          <polygon points="12,2 17,6 12,10" fill="currentColor" />
                        </svg>
                      </span>
                      <div className="hl-null-pill">⏚ NULL</div>
                    </div>
                  ) : (
                    /* 2 or MORE keys: FULL LINKED LIST REPRESENTATION */
                    <div className="hl-ll-chain">
                      <div className="hl-ll-head-ptr" title="Head pointer for this bucket">
                        <span>HEAD</span>
                        <span className="hl-ll-head-dot" />
                      </div>
                      <span className="hl-ll-arrow">
                        <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
                          <line x1="0" y1="6" x2="13" y2="6" stroke="currentColor" strokeWidth="2" />
                          <polygon points="12,2 17,6 12,10" fill="currentColor" />
                        </svg>
                      </span>
                      {keys.map((keyVal, nodeIdx) => (
                        <React.Fragment key={`node-${id}-${nodeIdx}-${keyVal}`}>
                          <div
                            className={`hl-ll-node ${nodeIdx > 0 ? "collision-node" : ""} ${isCurrent && nodeIdx === keys.length - 1 ? "pulse-node" : ""}`}
                            title={nodeIdx > 0 ? `Collision Node #${nodeIdx} at Bucket ${id}` : `Head Node of Bucket ${id}`}
                          >
                            <div className="hl-node-data">
                              <span className="hl-node-val">{keyVal}</span>
                              {nodeIdx === 0 ? (
                                <span className="hl-node-tag head">Head Node</span>
                              ) : (
                                <span className="hl-node-tag col">⚡ Col #{nodeIdx}</span>
                              )}
                            </div>
                            <div className="hl-node-next">
                              <span className="hl-next-txt">next</span>
                              <span className="hl-next-dot" />
                            </div>
                          </div>
                          <span className="hl-ll-arrow">
                            <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
                              <line x1="0" y1="6" x2="13" y2="6" stroke="currentColor" strokeWidth="2" />
                              <polygon points="12,2 17,6 12,10" fill="currentColor" />
                            </svg>
                          </span>
                        </React.Fragment>
                      ))}
                      <div className="hl-null-pill" title="End of chain">⏚ NULL</div>
                    </div>
                  )}
                </td>

                {/* Column 3: Slot Status */}
                <td style={{ textAlign: "right" }}>
                  {isOpenAddressing ? (
                    bucket?.deleted ? (
                      <span className="hl-status-pill tombstone">
                        <CircleAlert size={12} /> Deleted (Tombstone)
                      </span>
                    ) : bucket?.occupied ? (
                      <span className="hl-status-pill occupied">
                        <CheckCircle2 size={12} /> Occupied (1 key)
                      </span>
                    ) : (
                      <span className="hl-status-pill empty">Empty Slot</span>
                    )
                  ) : keys.length === 0 ? (
                    <span className="hl-status-pill empty">Empty Slot</span>
                  ) : keys.length === 1 ? (
                    <span className="hl-status-pill occupied">
                      <CheckCircle2 size={12} /> Occupied (1 key)
                    </span>
                  ) : (
                    <span className="hl-status-pill chained">
                      <Zap size={12} /> {keys.length} Keys Chained
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
  return (
    <main className="hashlab-sim">
      <style>{styles}</style>

      {/* Top Header */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
        <div>
          <div className="hl-chip" style={{ marginBottom: 4 }}>HASHLAB · INTERACTIVE SIMULATOR</div>
          <h1 className="hl-title" style={{ margin: "2px 0 2px" }}>{selected.group}: {selected.label}</h1>
          <p className="hl-subtitle" style={{ fontSize: "13.5px" }}>
            Watch your keys flow through the hash formula, handle collisions, and update the table in real time.
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <span className="hl-chip">
            {algorithm === "extendible" ? `Global depth: ${state?.globalDepth ?? globalDepth}` : `Capacity: ${state?.bucketCount ?? state?.buckets?.length ?? (tableSize || "—")} slots`}
          </span>
          <span className="hl-chip" style={{ background: "rgba(16, 185, 129, 0.12)", color: "#10b981", borderColor: "rgba(16, 185, 129, 0.3)" }}>
            Load: {Number(loadFactor * (loadFactor <= 1 ? 100 : 1)).toFixed(1)}%
          </span>
        </div>
      </header>

      {message && <div className="hl-message" style={{ margin: "6px 0 10px" }}><strong>{message}</strong></div>}

      {/* 3-COLUMN STUDIO LAYOUT: Left Controls | CENTER Hash Table | Right Traces & Metrics */}
      <div className="hl-layout">
        {/* COLUMN 1: LEFT CONTROLS DOCK */}
        <aside className="hl-panel hl-sidebar">
          <h2 className="hl-sectionhead"><span className="hl-icon"><Hash size={16}/></span> Simulator Setup</h2>

          <label className="hl-label" htmlFor="hl-algorithm">Select Hashing Technique</label>
          <select id="hl-algorithm" className="hl-select" value={algorithm} onChange={(e) => handleAlgorithmChange(e.target.value)}>
            {ALGORITHMS.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}
          </select>
          <div className="hl-chip" style={{ marginTop: 8 }}>{selected.group}</div>

          <label className="hl-label" htmlFor="hl-table-size">Table Size (m)</label>
          <input
            id="hl-table-size"
            className="hl-input"
            type="number"
            min="1"
            max="90"
            value={tableSize}
            onChange={(e) => { const v = e.target.value; setTableSize(v === "" ? "" : Math.max(1, Math.min(90, Number(v)))); }}
            placeholder="Enter table size (1–90)"
          />

          {(algorithm === "rehashing" || algorithm === "extendible" || algorithm === "linear-hashing") && (
            <>
              <label className="hl-label" htmlFor="hl-capacity">Bucket Capacity</label>
              <input id="hl-capacity" className="hl-input" type="number" min="1" max="10" value={bucketCapacity} onChange={(e) => setBucketCapacity(Math.max(1, Math.min(10, Number(e.target.value) || 1)))}/>
            </>
          )}
          {algorithm === "extendible" && (
            <>
              <label className="hl-label" htmlFor="hl-depth">Initial Global Depth</label>
              <input id="hl-depth" className="hl-input" type="number" min="1" max="5" value={globalDepth} onChange={(e) => setGlobalDepth(Math.max(1, Math.min(5, Number(e.target.value) || 1)))}/>
            </>
          )}
          {algorithm === "linear-hashing" && (
            <>
              <label className="hl-label" htmlFor="hl-linear-buckets">Initial Bucket Count</label>
              <input id="hl-linear-buckets" className="hl-input" type="number" min="2" max="12" value={linearBuckets} onChange={(e) => setLinearBuckets(Math.max(2, Math.min(12, Number(e.target.value) || 2)))}/>
            </>
          )}
          {algorithm === "linear" && (
            <>
              <label className="hl-label" htmlFor="hl-step">Linear Probe Step</label>
              <input id="hl-step" className="hl-input" type="number" min="1" max="10" value={linearStep} onChange={(e) => setLinearStep(Math.max(1, Number(e.target.value) || 1))}/>
            </>
          )}
          {algorithm === "quadratic" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div><label className="hl-label" htmlFor="hl-c1">c₁</label><input id="hl-c1" className="hl-input" type="number" min="0" max="5" value={c1} onChange={(e) => setC1(Number(e.target.value) || 0)}/></div>
              <div><label className="hl-label" htmlFor="hl-c2">c₂</label><input id="hl-c2" className="hl-input" type="number" min="1" max="5" value={c2} onChange={(e) => setC2(Math.max(1, Number(e.target.value) || 1))}/></div>
            </div>
          )}
          {!["rehashing", "extendible", "linear-hashing"].includes(algorithm) && (
            <>
              <label className="hl-label" htmlFor="hl-h1">Primary Hash Function</label>
              <input id="hl-h1" className="hl-input" value={h1Expr} onChange={(e) => setH1Expr(e.target.value)} placeholder="k % m"/>
              <small className="hl-muted">k = key, m = table size</small>
            </>
          )}
          {algorithm === "double" && (
            <>
              <label className="hl-label" htmlFor="hl-h2">Secondary Hash Function</label>
              <input id="hl-h2" className="hl-input" value={h2Expr} onChange={(e) => setH2Expr(e.target.value)} placeholder="5 - (k % 5)"/>
            </>
          )}

          {/* Key Operations Box */}
          <div style={{ borderTop: "1px solid var(--border-main,#dbe5f5)", marginTop: 14, paddingTop: 6 }}>
            <label className="hl-label" htmlFor="hl-key">Single Key Operation</label>
            <input
              id="hl-key"
              className="hl-input"
              type="number"
              value={keyText}
              onChange={(e) => setKeyText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") perform("insert"); }}
              placeholder="Enter integer key (e.g. 42)"
            />
            <div className="hl-btnrow">
              <button className="hl-btn hl-primary" onClick={() => perform("insert")}><Database size={13}/> Insert</button>
              <button className="hl-btn" onClick={() => perform("search")}><Search size={13}/> Search</button>
              <button className="hl-btn hl-danger" onClick={() => perform("delete")}><Trash2 size={13}/> Delete</button>
            </div>
          </div>

          {/* Batch Multiple Keys Queue */}
          <div style={{ borderTop: "1px solid var(--border-main,#dbe5f5)", marginTop: 14, paddingTop: 6 }}>
            <label className="hl-label" htmlFor="hl-batch">Multiple Keys Queue</label>
            <textarea
              id="hl-batch"
              className="hl-input"
              rows={2}
              value={batchText}
              onChange={(e) => setBatchText(e.target.value)}
              placeholder="e.g. 29, 18, 43, 72, 15"
              style={{ resize: "vertical" }}
            />
            <div className="hl-btnrow">
              <button className="hl-btn" onClick={loadBatch}>Load Queue ({playQueue.length})</button>
              <button className="hl-btn" onClick={stepBatch} disabled={!playQueue.length || playing}><SkipForward size={13}/> Step</button>
            </div>
            <div className="hl-btnrow">
              <button className="hl-btn hl-primary" onClick={() => { if (!playQueue.length) loadBatch(); else setPlaying((value) => !value); }}>
                {playing ? <Pause size={13}/> : <Play size={13}/>} {playing ? "Pause" : "Play Queue"}
              </button>
              <select aria-label="Playback speed" className="hl-select" style={{ flex: 1, width: "auto" }} value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>
                <option value={1400}>Slow</option>
                <option value={850}>Normal</option>
                <option value={300}>Fast</option>
              </select>
            </div>
          </div>

          <button className="hl-btn" style={{ width: "100%", marginTop: 14 }} onClick={resetTable}>
            <RotateCcw size={14}/> Reset Simulation
          </button>
        </aside>

        {/* COLUMN 2 (CENTER / MIDDLE): HASH TABLE */}
        <section className="hl-panel hl-tablepanel">
          <div className="hl-tablepanel-header">
            <h2 className="hl-sectionhead" style={{ margin: 0, fontSize: 16 }}>
              <span className="hl-icon"><Database size={16}/></span>
              Hash Table {algorithm === "extendible" ? "Directory" : `(Size ${state?.buckets?.length ?? (tableSize || "—")})`}
            </h2>
          </div>

          <div className="hl-scroll">
            {renderBuckets()}
          </div>

          <div className="hl-legend">
            <span><i className="hl-dot" style={{ background: "var(--accent-success, #10b981)" }}/> Key present</span>
            <span><i className="hl-dot" style={{ background: "var(--bg-card-muted, #f8fafc)", border: "1px solid var(--border-main, #dbe5f5)" }}/> Empty slot</span>
            <span><i className="hl-dot" style={{ background: "var(--accent-primary, #3b82f6)" }}/> Last operation</span>
            {["linear", "quadratic", "double"].includes(algorithm) && (
              <span><i className="hl-dot" style={{ background: "var(--accent-warning, #f59e0b)" }}/> Tombstone (DEL)</span>
            )}
          </div>
        </section>

        {/* COLUMN 3: RIGHT DOCK (STEP CALCULATION + METRICS) */}
        <div className="hl-rightdock">
          {/* Step-by-Step Calculation Trace */}
          <section className="hl-panel hl-traces-panel">
            <h2 className="hl-sectionhead" style={{ margin: "0 0 10px", fontSize: 15 }}>
              <span className="hl-icon"><BookOpen size={15}/></span> Step Calculation
            </h2>
            <div className="hl-traces-scroll">
              {!trace.length ? (
                <div className="hl-empty" style={{ padding: "24px 12px" }}>
                  <Activity size={22} style={{ marginBottom: 6, opacity: 0.6 }}/>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>Calculation trace will appear here.</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                    Perform an insert, search, or delete to see modulo math and probe sequences.
                  </div>
                </div>
              ) : (
                trace.slice().reverse().map((row, index) => (
                  <article className={`hl-trace ${row.collisions ? "collision" : "success"}`} key={row.id}>
                    <div
                      className="hl-tracehead"
                      role="button"
                      tabIndex={0}
                      onClick={() => setExpanded((items) => ({ ...items, [row.id]: !items[row.id] }))}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setExpanded((items) => ({ ...items, [row.id]: !items[row.id] })); }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                        <span className="hl-step" style={{ width: 22, height: 22, fontSize: 11 }}>{trace.length - index}</span>
                        <strong style={{ fontSize: 12.5 }}>{row.action[0].toUpperCase() + row.action.slice(1)} {row.key}</strong>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span className={`hl-status ${row.collisions ? "warn" : ""}`}>{row.status}</span>
                        {expanded[row.id] ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                      </div>
                    </div>
                    {expanded[row.id] && <div className="hl-math" style={{ fontSize: 11.5, margin: "8px 0 0 28px", padding: "8px 10px" }}>{row.lines.join("\n")}{`\nResult: ${row.message}`}</div>}
                  </article>
                ))
              )}
            </div>
          </section>

          {/* Key Metrics & Formula */}
          <section className="hl-panel hl-metricpanel">
            <h2 className="hl-sectionhead" style={{ margin: "0 0 10px", fontSize: 15 }}>
              <span className="hl-icon"><Gauge size={15}/></span> Live Metrics
            </h2>
            <div className="hl-metrics">
              <div className="hl-metric"><small>Total Keys</small><strong>{totalKeys}</strong></div>
              <div className="hl-metric"><small>Table Size</small><strong>{state?.buckets?.length ?? (tableSize || "—")}</strong></div>
              <div className="hl-metric"><small>Load Factor</small><strong>{Number(loadFactor * (loadFactor <= 1 ? 100 : 1)).toFixed(1)}{loadFactor <= 1 ? "%" : ""}</strong></div>
              <div className="hl-metric"><small>Collisions</small><strong>{totalCollisions}</strong></div>
              <div className="hl-metric"><small>Total Probes</small><strong>{totalProbes}</strong></div>
              <div className="hl-metric"><small>Operations</small><strong>{activity.length}</strong></div>
            </div>
            <div className="hl-formula-box" style={{ marginTop: 10, padding: 10 }}>
              <strong className="hl-formula-title" style={{ fontSize: 11.5 }}><Layers3 size={13}/> Active Formula</strong>
              <div className="hl-formula-code" style={{ fontSize: 11, padding: "5px 8px" }}>{selected.formula}</div>
            </div>
          </section>
        </div>
      </div>

      {/* FULL-WIDTH COLLAPSIBLE OPERATION HISTORY LOG BELOW */}
      <div style={{ marginTop: 16 }}>
        <button
          type="button"
          onClick={() => setShowLog(!showLog)}
          className="hl-btn"
          style={{ width: "100%", justifyContent: "space-between", padding: "12px 18px", borderRadius: 12, background: "var(--bg-card)" }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800 }}>
            <Activity size={16} color="var(--accent-primary)" />
            Operation History Log ({activity.length} operations recorded)
          </span>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {showLog ? "▲ Hide Log Table" : "▼ Click to Expand Full Log"}
          </span>
        </button>

        {showLog && (
          <section className="hl-panel" style={{ marginTop: 10, padding: 18 }}>
            {!activity.length ? (
              <div className="hl-empty" style={{ padding: "30px 10px" }}>No operations yet. Perform an insert, search, or delete to see history.</div>
            ) : (
              <div className="hl-scroll" style={{ maxHeight: 260 }}>
                <table className="hl-log">
                  <thead>
                    <tr><th>Step</th><th>Operation</th><th>Key</th><th>Calculation Summary</th><th>Result</th></tr>
                  </thead>
                  <tbody>
                    {activity.map((row) => (
                      <tr key={row.id}>
                        <td>{row.step}</td>
                        <td>{row.action}</td>
                        <td><strong>{row.key}</strong></td>
                        <td>{row.lines[0]}</td>
                        <td style={{ color: row.collisions ? "var(--accent-warning, #f59e0b)" : "var(--accent-success, #10b981)", fontWeight: 800 }}>{row.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
