import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import {
  SeparateChaining,
  LinearProbing,
  QuadraticProbing,
  DoubleHashing,
} from "../algorithms/CollisionStrategies.js";

import { Rehashing } from "../algorithms/Rehashing.js";
import { ExtendibleHash } from "../algorithms/ExtendibleHash.js";
import { LinearHash } from "../algorithms/LinearHash.js";
import { BarChart3, Activity, Zap, TrendingUp, Award, Info } from "lucide-react";

function Analytics() {
  const [keys, setKeys] = useState("12, 25, 38, 14, 27, 40, 64, 53, 30, 77");
  const [bucketCount, setBucketCount] = useState(13);
  const [bucketCapacity, setBucketCapacity] = useState(2);
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");

  const runAnalytics = (overrideKeys = null, overrideM = null, overrideCap = null) => {
    const rawKeys = overrideKeys !== null ? overrideKeys : keys;
    const rawM = overrideM !== null ? overrideM : bucketCount;
    const rawCap = overrideCap !== null ? overrideCap : bucketCapacity;

    const parsedKeys = String(rawKeys)
      .split(",")
      .map((value) => Number(value.trim()))
      .filter((value) => Number.isInteger(value));

    if (parsedKeys.length === 0) {
      setMessage("Please enter valid integer keys.");
      setResults([]);
      return;
    }

    const m = Math.max(3, Number(rawM) || 13);
    const cap = Math.max(1, Number(rawCap) || 2);
    const initialDepth = Math.max(1, Math.min(5, Math.floor(Math.log2(m))));

    const algorithmDefinitions = [
      {
        name: "Separate Chaining",
        color: "#10b981",
        create: () => new SeparateChaining(m),
      },
      {
        name: "Linear Probing",
        color: "#6366f1",
        create: () => new LinearProbing(m),
      },
      {
        name: "Quadratic Probing",
        color: "#8b5cf6",
        create: () => new QuadraticProbing(m),
      },
      {
        name: "Double Hashing",
        color: "#ec4899",
        create: () => new DoubleHashing(m),
      },
      {
        name: "Rehashing",
        color: "#f59e0b",
        create: () => new Rehashing(m, cap, 0.7),
      },
      {
        name: "Extendible Hashing",
        color: "#06b6d4",
        create: () => new ExtendibleHash(cap, initialDepth),
      },
      {
        name: "Linear Hashing",
        color: "#3b82f6",
        create: () => new LinearHash(m, cap),
      },
    ];

    const analytics = algorithmDefinitions.map((definition) => {
      const algorithm = definition.create();

      parsedKeys.forEach((key) => {
        algorithm.insert(key);
      });

      const state = algorithm.getState();

      return {
        name: definition.name,
        color: definition.color,
        totalKeys: state.totalKeys ?? 0,
        collisions: state.totalCollisions ?? 0,
        probes: state.totalProbes ?? 0,
        loadFactorPercent: Number(((state.loadFactor ?? 0) * 100).toFixed(1)),
        buckets:
          state.bucketCount ??
          state.directorySize ??
          state.buckets?.length ??
          0,
        splits: state.totalSplits ?? 0,
        rehashes: state.totalRehashes ?? 0,
        directoryDoublings: state.totalDirectoryDoublings ?? 0,
      };
    });

    setResults(analytics);
    setMessage(
      `Analytics completed: Analyzed ${parsedKeys.length} keys across all 7 algorithms (Table Size m = ${m}, Bucket Capacity C = ${cap}, Initial Depth D = ${initialDepth}).`
    );
  };

  useEffect(() => {
    runAnalytics("12, 25, 38, 14, 27, 40, 64, 53, 30, 77", 13, 2);
  }, []);

  const applyPreset = (presetKeys, presetM = 13, presetCap = 2) => {
    setKeys(presetKeys);
    setBucketCount(presetM);
    setBucketCapacity(presetCap);
    runAnalytics(presetKeys, presetM, presetCap);
  };

  const summary = useMemo(() => {
    if (results.length === 0) {
      return {
        totalKeys: 0,
        totalCollisions: 0,
        totalProbes: 0,
        totalSplits: 0,
        totalRehashes: 0,
      };
    }

    return {
      totalKeys: Math.max(...results.map((item) => item.totalKeys)),
      totalCollisions: results.reduce((sum, item) => sum + item.collisions, 0),
      totalProbes: results.reduce((sum, item) => sum + item.probes, 0),
      totalSplits: results.reduce((sum, item) => sum + item.splits, 0),
      totalRehashes: results.reduce((sum, item) => sum + item.rehashes, 0),
    };
  }, [results]);

  return (
    <main className="placeholder-page">
      <div
        className="placeholder-card"
        style={{
          maxWidth: "1200px",
          width: "calc(100% - 40px)",
        }}
      >
        <span className="section-label">HASHLAB • ANALYTICS LAB</span>

        <h1>Hashing Performance Analytics</h1>

        <p>
          Measure collision frequencies, memory occupancy curves, and probing efficiency
          under customizable workloads, table sizes, and bucket capacities.
        </p>

        {/* CONTROLS */}
        <div style={{ marginTop: "28px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              alignItems: "end",
            }}
          >
            {/* WORKLOAD KEYS */}
            <div style={{ gridColumn: "span 2" }}>
              <label
                htmlFor="analytics-keys"
                style={{
                  display: "block",
                  fontWeight: 700,
                  marginBottom: "8px",
                  fontSize: "14px",
                }}
              >
                Test Workload Keys (Comma-Separated)
              </label>

              <input
                id="analytics-keys"
                type="text"
                value={keys}
                onChange={(event) => setKeys(event.target.value)}
                placeholder="e.g. 12, 25, 38, 14, 27, 40, 64"
                style={{ width: "100%" }}
              />
            </div>

            {/* TABLE SIZE */}
            <div>
              <label
                htmlFor="analytics-bucket-count"
                style={{
                  display: "block",
                  fontWeight: 700,
                  marginBottom: "8px",
                  fontSize: "14px",
                }}
              >
                Table Size (Bucket Count m)
              </label>

              <input
                id="analytics-bucket-count"
                type="number"
                min="3"
                max="61"
                value={bucketCount}
                onChange={(event) =>
                  setBucketCount(Number(event.target.value) || 13)
                }
                style={{ width: "100%" }}
              />
            </div>

            {/* BUCKET CAPACITY */}
            <div>
              <label
                htmlFor="analytics-capacity"
                style={{
                  display: "block",
                  fontWeight: 700,
                  marginBottom: "8px",
                  fontSize: "14px",
                }}
              >
                Bucket Capacity (Max Keys C)
              </label>

              <input
                id="analytics-capacity"
                type="number"
                min="1"
                max="8"
                value={bucketCapacity}
                onChange={(event) =>
                  setBucketCapacity(Number(event.target.value) || 2)
                }
                style={{ width: "100%" }}
              />
            </div>
          </div>

          {/* WORKLOAD PRESETS */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "16px",
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: "12px", fontWeight: 750, opacity: 0.7 }}>
              Workload Presets:
            </span>

            <button
              type="button"
              onClick={() =>
                applyPreset("12, 25, 38, 14, 27, 40, 64, 53, 30, 77", 13, 2)
              }
              style={presetBtnStyle}
            >
              ⚖️ Balanced Workload (Natural Clusters)
            </button>

            <button
              type="button"
              onClick={() =>
                applyPreset("13, 26, 39, 52, 65, 78, 91, 104", 13, 2)
              }
              style={presetBtnStyle}
            >
              ⚡ Collision Heavy (All k mod 13 = 0)
            </button>

            <button
              type="button"
              onClick={() =>
                applyPreset("17, 34, 51, 68, 85, 23, 46, 69, 92, 115", 13, 2)
              }
              style={presetBtnStyle}
            >
              🎲 Semi-Random Prime
            </button>

            <button
              type="button"
              onClick={() =>
                applyPreset("1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13", 13, 2)
              }
              style={presetBtnStyle}
            >
              📈 Sequential Range
            </button>

            <button
              type="button"
              onClick={() =>
                applyPreset("10, 11, 12, 13, 14, 20, 21, 22, 23, 24", 13, 2)
              }
              style={presetBtnStyle}
            >
              🔄 Clustered Intervals
            </button>

            <button
              type="button"
              onClick={() =>
                applyPreset("10, 20, 30, 40, 50, 60, 70, 80, 90, 100", 13, 2)
              }
              style={presetBtnStyle}
            >
              🔢 Multiples of 10 (Coprime Mod 13)
            </button>
          </div>

          <button
            type="button"
            onClick={() => runAnalytics()}
            style={{
              marginTop: "20px",
              padding: "13px 26px",
              borderRadius: "10px",
              background: "var(--gradient-primary)",
              color: "#ffffff",
              border: "none",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "15px",
              boxShadow: "0 4px 14px rgba(37, 99, 235, 0.3)",
            }}
          >
            📊 Run Performance Profiling
          </button>
        </div>

        {/* STATUS MESSAGE */}
        {message && (
          <div
            style={{
              marginTop: "20px",
              padding: "14px",
              borderRadius: "10px",
              background: "rgba(37, 99, 235, 0.08)",
              color: "var(--accent-primary)",
              fontWeight: 600,
            }}
          >
            {message}
          </div>
        )}

        {/* SUMMARY KPI CARDS */}
        {results.length > 0 && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "16px",
                marginTop: "35px",
              }}
            >
              <KpiCard
                title="Keys Processed"
                value={summary.totalKeys}
                icon={<Activity size={20} color="#3b82f6" />}
              />
              <KpiCard
                title="Total Collisions"
                value={summary.totalCollisions}
                icon={<Zap size={20} color="#ef4444" />}
              />
              <KpiCard
                title="Total Probes"
                value={summary.totalProbes}
                icon={<TrendingUp size={20} color="#8b5cf6" />}
              />
              <KpiCard
                title="Total Bucket Splits"
                value={summary.totalSplits}
                icon={<BarChart3 size={20} color="#06b6d4" />}
              />
              <KpiCard
                title="Total Rehashes"
                value={summary.totalRehashes}
                icon={<Award size={20} color="#f59e0b" />}
              />
            </div>

            {/* CHART 1: COLLISIONS BAR CHART */}
            <section style={{ marginTop: "45px" }}>
              <div style={{ marginBottom: "14px" }}>
                <h2>Collision Frequency by Algorithm</h2>
                <p style={{ opacity: 0.7, fontSize: "14px" }}>
                  Lower is better. Compares total collisions encountered under identical workload and initial table capacity.
                </p>
              </div>

              <div
                style={{
                  width: "100%",
                  height: "320px",
                  background: "var(--bg-card)",
                  padding: "20px 10px 10px 0",
                  borderRadius: "14px",
                  border: "1.5px solid var(--border-main)",
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={results}
                    margin={{ top: 10, right: 30, left: 0, bottom: 25 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis
                      dataKey="name"
                      angle={-15}
                      textAnchor="end"
                      tick={{ fontSize: 12, fill: "var(--text-secondary)" }}
                      interval={0}
                    />
                    <YAxis allowDecimals={false} tick={{ fill: "var(--text-secondary)" }} />
                    <Tooltip
                      contentStyle={{
                        background: "var(--bg-card)",
                        borderColor: "var(--border-main)",
                        borderRadius: "10px",
                        color: "var(--text-primary)",
                      }}
                      formatter={(value) => [`${value} collisions`, "Collisions"]}
                    />
                    <Bar dataKey="collisions" radius={[6, 6, 0, 0]}>
                      {results.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* COLLISION METRIC EXPLANATION GUIDE CARD */}
              <div
                style={{
                  marginTop: "16px",
                  padding: "18px 22px",
                  borderRadius: "12px",
                  background: "rgba(59, 130, 246, 0.06)",
                  border: "1px solid rgba(59, 130, 246, 0.2)",
                  fontSize: "13px",
                  lineHeight: "1.6",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontWeight: 800,
                    color: "var(--accent-primary)",
                    marginBottom: "10px",
                    fontSize: "14px",
                  }}
                >
                  <Info size={18} />
                  <span>Understanding How Collisions Are Measured Across Architectures</span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "12px",
                    marginTop: "10px",
                  }}
                >
                  <div
                    style={{
                      background: "var(--bg-card)",
                      padding: "12px 14px",
                      borderRadius: "10px",
                      border: "1px solid var(--border-main)",
                    }}
                  >
                    <strong style={{ color: "var(--accent-primary)", display: "block", marginBottom: "4px" }}>
                      1. Open Addressing (Linear, Quadratic, Double)
                    </strong>
                    Each slot holds exactly 1 key. A collision occurs whenever a key's computed primary slot h(k) is already occupied, requiring one or more probe iterations.
                  </div>

                  <div
                    style={{
                      background: "var(--bg-card)",
                      padding: "12px 14px",
                      borderRadius: "10px",
                      border: "1px solid var(--border-main)",
                    }}
                  >
                    <strong style={{ color: "#10b981", display: "block", marginBottom: "4px" }}>
                      2. Closed Addressing (Separate Chaining)
                    </strong>
                    Buckets hold linked chains. A collision is counted whenever a newly inserted key hashes to a bucket that already contains one or more keys.
                  </div>

                  <div
                    style={{
                      background: "var(--bg-card)",
                      padding: "12px 14px",
                      borderRadius: "10px",
                      border: "1px solid var(--border-main)",
                    }}
                  >
                    <strong style={{ color: "#06b6d4", display: "block", marginBottom: "4px" }}>
                      3. Dynamic Hashing (Extendible, Linear, Rehashing)
                    </strong>
                    Buckets hold up to capacity C. A collision/overflow occurs when a bucket reaches capacity C, triggering directory doubling, bucket splits, or table expansion.
                  </div>
                </div>

                <p
                  style={{
                    marginTop: "12px",
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                    marginBottom: 0,
                  }}
                >
                  💡 <strong>Modular Arithmetic Note:</strong> For table size m = 13, testing multiples of 10 (10, 20, 30...) produces distinct remainders mod 13 (10, 7, 4, 1, 11, 8, 5, 2, 12, 9) with 0 static collisions because 10 and 13 are coprime. Click the presets above (e.g. <em>⚡ Collision Heavy</em> or <em>⚖️ Balanced Workload</em>) to test real collision pressure!
                </p>
              </div>
            </section>

            {/* CHART 2: LOAD FACTOR UTILIZATION */}
            <section style={{ marginTop: "45px" }}>
              <div style={{ marginBottom: "14px" }}>
                <h2>Storage Utilization (Load Factor %)</h2>
                <p style={{ opacity: 0.7, fontSize: "14px" }}>
                  Percentage of total available bucket capacity occupied.
                </p>
              </div>

              <div
                style={{
                  width: "100%",
                  height: "320px",
                  background: "var(--bg-card)",
                  padding: "20px 10px 10px 0",
                  borderRadius: "14px",
                  border: "1.5px solid var(--border-main)",
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={results}
                    margin={{ top: 10, right: 30, left: 0, bottom: 25 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis
                      dataKey="name"
                      angle={-15}
                      textAnchor="end"
                      tick={{ fontSize: 12, fill: "var(--text-secondary)" }}
                      interval={0}
                    />
                    <YAxis unit="%" tick={{ fill: "var(--text-secondary)" }} />
                    <Tooltip
                      contentStyle={{
                        background: "var(--bg-card)",
                        borderColor: "var(--border-main)",
                        borderRadius: "10px",
                        color: "var(--text-primary)",
                      }}
                      formatter={(value) => [`${value}%`, "Load Factor"]}
                    />
                    <Bar
                      dataKey="loadFactorPercent"
                      fill="#00b4d8"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* DETAILED METRIC TABLE */}
            <section style={{ marginTop: "45px" }}>
              <h2>Performance Matrix</h2>
              <div style={{ overflowX: "auto", marginTop: "16px" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    minWidth: "850px",
                  }}
                >
                  <thead>
                    <tr>
                      <th style={tableHead}>Algorithm</th>
                      <th style={tableHead}>Keys</th>
                      <th style={tableHead}>Collisions</th>
                      <th style={tableHead}>Probes</th>
                      <th style={tableHead}>Load Factor</th>
                      <th style={tableHead}>Active Buckets</th>
                      <th style={tableHead}>Splits</th>
                      <th style={tableHead}>Rehashes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r) => (
                      <tr key={r.name}>
                        <td style={tableCell}>
                          <span
                            style={{
                              display: "inline-block",
                              width: "10px",
                              height: "10px",
                              borderRadius: "50%",
                              background: r.color,
                              marginRight: "8px",
                            }}
                          />
                          <strong>{r.name}</strong>
                        </td>
                        <td style={tableCell}>{r.totalKeys}</td>
                        <td
                          style={{
                            ...tableCell,
                            fontWeight: 700,
                            color: r.collisions > 0 ? "#dc2626" : "#16a34a",
                          }}
                        >
                          {r.collisions}
                        </td>
                        <td style={tableCell}>{r.probes}</td>
                        <td style={tableCell}>{r.loadFactorPercent}%</td>
                        <td style={tableCell}>{r.buckets}</td>
                        <td style={tableCell}>{r.splits}</td>
                        <td style={tableCell}>{r.rehashes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function KpiCard({ title, value, icon }) {
  return (
    <div
      style={{
        padding: "18px",
        borderRadius: "14px",
        background: "var(--bg-card)",
        border: "1.5px solid var(--border-main)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div>
        <span
          style={{
            fontSize: "12px",
            fontWeight: 800,
            opacity: 0.55,
            textTransform: "uppercase",
          }}
        >
          {title}
        </span>
        <div style={{ fontSize: "24px", fontWeight: 800, marginTop: "4px" }}>
          {value}
        </div>
      </div>
      <div
        style={{
          padding: "10px",
          borderRadius: "10px",
          background: "var(--bg-card-muted)",
        }}
      >
        {icon}
      </div>
    </div>
  );
}

const presetBtnStyle = {
  background: "var(--bg-card-muted)",
  border: "1px solid var(--border-main)",
  borderRadius: "8px",
  padding: "6px 12px",
  fontSize: "12px",
  cursor: "pointer",
  fontWeight: 700,
  color: "var(--text-secondary)",
  transition: "all 0.2s ease",
};

const tableHead = {
  padding: "14px",
  borderBottom: "2px solid var(--border-main)",
  textAlign: "left",
  fontWeight: 750,
  fontSize: "13px",
  background: "var(--bg-card-muted)",
  color: "var(--text-primary)",
};

const tableCell = {
  padding: "14px",
  borderBottom: "1px solid var(--border-main)",
  textAlign: "left",
  fontSize: "14px",
  color: "var(--text-primary)",
};

export default Analytics;
