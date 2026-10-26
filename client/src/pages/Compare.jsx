import React, { useMemo, useState } from "react";
import { runComparison } from "../utils/CompareEngine.js";
import { Trophy, Zap, Sparkles } from "lucide-react";

function Compare() {
  const [keys, setKeys] = useState("10, 20, 30, 40, 50");
  const [bucketCount, setBucketCount] = useState(7);
  const [bucketCapacity, setBucketCapacity] = useState(2);
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");

  const handleCompare = () => {
    const parsedKeys = keys
      .split(",")
      .map((value) => Number(value.trim()))
      .filter((value) => Number.isInteger(value));

    if (parsedKeys.length === 0) {
      setMessage("Please enter valid integer keys.");
      setResults([]);
      return;
    }

    const comparisonResults = runComparison(
      parsedKeys,
      bucketCount,
      bucketCapacity
    );

    setResults(comparisonResults);
    setMessage(
      `Comparison complete: Tested ${comparisonResults.length} algorithms with ${parsedKeys.length} keys (Table Size m = ${bucketCount}, Bucket Capacity C = ${bucketCapacity}).`
    );
  };

  /*
   * Performance Winners Calculation
   */
  const winners = useMemo(() => {
    if (results.length === 0) return null;

    const minCollisions = Math.min(...results.map((r) => r.collisions));
    const lowestCollisionAlgorithms = results
      .filter((r) => r.collisions === minCollisions)
      .map((r) => r.name);

    const validLoadFactors = results
      .map((r) => r.loadFactor)
      .filter((l) => l > 0 && l <= 1);
    const optimalLoad =
      validLoadFactors.length > 0 ? Math.max(...validLoadFactors) : 0;
    const bestLoadAlgorithm = results.find(
      (r) => r.loadFactor === optimalLoad
    );

    return {
      minCollisions,
      lowestCollisionAlgorithms,
      bestLoadAlgorithm: bestLoadAlgorithm?.name || "N/A",
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
        <span className="section-label">HASHLAB • COMPARE ARENA</span>

        <h1>Compare Hashing Algorithms</h1>

        <p>
          Subject all 7 hashing strategies to the exact same workload, table size,
          and bucket capacity. Observe how collisions, load factors, and dynamic expansions differ.
        </p>

        {/* INPUT CONFIGURATION */}
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
                htmlFor="compare-keys"
                style={{
                  display: "block",
                  fontWeight: 700,
                  marginBottom: "8px",
                  fontSize: "14px",
                }}
              >
                Enter Workload Keys (Comma-Separated)
              </label>

              <input
                id="compare-keys"
                type="text"
                value={keys}
                onChange={(event) => setKeys(event.target.value)}
                placeholder="e.g. 10, 20, 30, 40, 50"
                style={{ width: "100%" }}
              />
            </div>

            {/* USER-DEFINABLE TABLE SIZE */}
            <div>
              <label
                htmlFor="compare-bucket-count"
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
                id="compare-bucket-count"
                type="number"
                min="3"
                max="61"
                value={bucketCount}
                onChange={(event) =>
                  setBucketCount(Number(event.target.value) || 7)
                }
                style={{ width: "100%" }}
              />
            </div>

            {/* USER-DEFINABLE BUCKET CAPACITY */}
            <div>
              <label
                htmlFor="compare-bucket-capacity"
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
                id="compare-bucket-capacity"
                type="number"
                min="1"
                max="10"
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
              marginTop: "14px",
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: "12px", fontWeight: 700, opacity: 0.6 }}>
              Quick Workload Presets:
            </span>

            <button
              type="button"
              onClick={() => setKeys("14, 28, 42, 56, 70, 84, 98")}
              style={presetBtnStyle}
            >
              ⚡ Collision Heavy (Worst-Case)
            </button>

            <button
              type="button"
              onClick={() => setKeys("15, 33, 47, 82, 19, 64, 91, 28")}
              style={presetBtnStyle}
            >
              🎲 Uniform Random
            </button>

            <button
              type="button"
              onClick={() => setKeys("1, 2, 3, 4, 5, 6, 7, 8, 9, 10")}
              style={presetBtnStyle}
            >
              📈 Sequential Range
            </button>

            <button
              type="button"
              onClick={() => setKeys("10, 11, 12, 20, 21, 22, 30, 31, 32")}
              style={presetBtnStyle}
            >
              🔄 Clustered Data
            </button>
          </div>

          <button
            type="button"
            onClick={handleCompare}
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
              boxShadow: "0 4px 16px rgba(37, 99, 235, 0.3)",
            }}
          >
            ⚔️ Run Arena Comparison
          </button>
        </div>

        {/* STATUS MESSAGE */}
        {message && (
          <div
            style={{
              marginTop: "20px",
              padding: "14px",
              borderRadius: "10px",
              background: "rgba(239, 68, 68, 0.12)",
              color: "var(--accent-danger)",
              fontWeight: 600,
            }}
          >
            {message}
          </div>
        )}

        {/* WINNER CARDS */}
        {winners && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "16px",
              marginTop: "30px",
            }}
          >
            <div
              style={{
                padding: "20px",
                borderRadius: "14px",
                background: "rgba(16, 185, 129, 0.08)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#16a34a",
                  fontWeight: 800,
                  fontSize: "13px",
                  textTransform: "uppercase",
                }}
              >
                <Trophy size={18} />
                Fewest Collisions Winner
              </div>

              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  color: "#16a34a",
                  marginTop: "6px",
                }}
              >
                {winners.lowestCollisionAlgorithms.join(", ")}
              </div>

              <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>
                Encountered only <strong>{winners.minCollisions}</strong> collision(s).
              </div>
            </div>

            <div
              style={{
                padding: "20px",
                borderRadius: "14px",
                background: "rgba(37, 99, 235, 0.08)",
                border: "1px solid rgba(37, 99, 235, 0.3)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "var(--accent-primary)",
                  fontWeight: 800,
                  fontSize: "13px",
                  textTransform: "uppercase",
                }}
              >
                <Zap size={18} />
                Highest Storage Density
              </div>

              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 800,
                  color: "var(--accent-primary)",
                  marginTop: "6px",
                }}
              >
                {winners.bestLoadAlgorithm}
              </div>

              <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>
                Utilized memory space most compactly under this workload.
              </div>
            </div>
          </div>
        )}

        {/* RESULTS TABLE */}
        {results.length > 0 && (
          <div style={{ marginTop: "35px" }}>
            <h2>Comparison Matrix</h2>

            <div
              style={{
                overflowX: "auto",
                marginTop: "18px",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "850px",
                }}
              >
                <thead>
                  <tr>
                    <th style={headerStyle}>Algorithm</th>
                    <th style={headerStyle}>Total Keys</th>
                    <th style={headerStyle}>Collisions</th>
                    <th style={headerStyle}>Total Probes</th>
                    <th style={headerStyle}>Load Factor</th>
                    <th style={headerStyle}>Buckets</th>
                    <th style={headerStyle}>Splits</th>
                    <th style={headerStyle}>Rehashes</th>
                  </tr>
                </thead>

                <tbody>
                  {results.map((result) => (
                    <tr key={result.id}>
                      <td style={cellStyle}>
                        <strong>{result.name}</strong>
                      </td>
                      <td style={cellStyle}>{result.totalKeys}</td>
                      <td
                        style={{
                          ...cellStyle,
                          fontWeight: 700,
                          color: result.collisions > 0 ? "#dc2626" : "#16a34a",
                        }}
                      >
                        {result.collisions}
                      </td>
                      <td style={cellStyle}>{result.totalProbes}</td>
                      <td style={cellStyle}>
                        {(result.loadFactor * 100).toFixed(1)}%
                      </td>
                      <td style={cellStyle}>{result.bucketCount}</td>
                      <td style={cellStyle}>{result.splits}</td>
                      <td style={cellStyle}>{result.rehashes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VISUAL COLLISION BARS */}
        {results.length > 0 && (
          <div style={{ marginTop: "40px" }}>
            <h2>Collision Distribution Chart</h2>
            <p style={{ marginTop: "8px", opacity: 0.7 }}>
              Visual breakdown of collisions encountered by each algorithm with
              Table Size = {bucketCount} and Bucket Capacity = {bucketCapacity}.
            </p>

            <div
              style={{
                marginTop: "20px",
                display: "grid",
                gap: "14px",
              }}
            >
              {results.map((result) => {
                const maxCollisions = Math.max(
                  ...results.map((item) => item.collisions),
                  1
                );
                const width = (result.collisions / maxCollisions) * 100;

                return (
                  <div key={result.id}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "6px",
                        fontSize: "14px",
                      }}
                    >
                      <strong>{result.name}</strong>
                      <span
                        style={{
                          fontWeight: 700,
                          color:
                            result.collisions === 0 ? "#16a34a" : "#dc2626",
                        }}
                      >
                        {result.collisions} collision
                        {result.collisions === 1 ? "" : "s"}
                      </span>
                    </div>

                    <div
                      style={{
                        width: "100%",
                        height: "16px",
                        background: "#f1f5f9",
                        borderRadius: "999px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.max(width, result.collisions > 0 ? 4 : 0)}%`,
                          height: "100%",
                          background:
                            result.collisions === 0
                              ? "#10b981"
                              : "linear-gradient(90deg, #0077b6, #48cae4)",
                          borderRadius: "999px",
                          transition: "width 0.4s ease",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
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

const headerStyle = {
  padding: "14px",
  borderBottom: "2px solid var(--border-main)",
  textAlign: "left",
  whiteSpace: "nowrap",
  fontWeight: 750,
  background: "var(--bg-card-muted)",
  color: "var(--text-primary)",
};

const cellStyle = {
  padding: "14px",
  borderBottom: "1px solid var(--border-main)",
  textAlign: "left",
  color: "var(--text-primary)",
};

export default Compare;
