import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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

const algorithmOptions = [
  { id: "separate", name: "Separate Chaining" },
  { id: "linear-probing", name: "Linear Probing" },
  { id: "quadratic-probing", name: "Quadratic Probing" },
  { id: "double-hashing", name: "Double Hashing" },
  { id: "rehashing", name: "Rehashing" },
  { id: "extendible", name: "Extendible Hashing" },
  { id: "linear-hashing", name: "Linear Hashing" },
];

function createAlgorithm(id, bucketCount, bucketCapacity) {
  const m = Math.max(2, Number(bucketCount) || 7);
  const cap = Math.max(1, Number(bucketCapacity) || 2);
  const initialDepth = Math.max(1, Math.min(5, Math.floor(Math.log2(m))));

  switch (id) {
    case "separate":
      return new SeparateChaining(m);

    case "linear-probing":
      return new LinearProbing(m);

    case "quadratic-probing":
      return new QuadraticProbing(m);

    case "double-hashing":
      return new DoubleHashing(m);

    case "rehashing":
      return new Rehashing(m, cap, 0.7);

    case "extendible":
      return new ExtendibleHash(cap, initialDepth);

    case "linear-hashing":
      return new LinearHash(m, cap);

    default:
      return null;
  }
}

/* -------------------------------------------------------
   REPORT HELPERS
------------------------------------------------------- */

function getBucketCount(state) {
  return (
    state.bucketCount ??
    state.directorySize ??
    state.buckets?.length ??
    0
  );
}

function getMetricRows(experiment) {
  const state = experiment.state;

  return [
    ["Algorithm", experiment.algorithmName],
    ["Generated", experiment.generatedAt],
    ["Input Keys", experiment.inputKeys.join(", ")],
    ["Bucket Capacity", experiment.bucketCapacity],
    ["Bucket / Directory Size", getBucketCount(state)],
    ["Total Keys", state.totalKeys ?? 0],
    ["Insertions", state.totalInsertions ?? 0],
    ["Searches", state.totalSearches ?? 0],
    ["Deletes", state.totalDeletes ?? 0],
    ["Collisions", state.totalCollisions ?? 0],
    [
      "Load Factor",
      `${((state.loadFactor ?? 0) * 100).toFixed(1)}%`,
    ],
    ["Splits", state.totalSplits ?? 0],
    ["Rehashes", state.totalRehashes ?? 0],
    [
      "Directory Doublings",
      state.totalDirectoryDoublings ?? 0,
    ],
  ];
}

function getOperations(experiment) {
  return Array.isArray(experiment.state.operations)
    ? experiment.state.operations
    : [];
}

/* -------------------------------------------------------
   TXT REPORT
------------------------------------------------------- */

function generateTxtReport(experiment) {
  const state = experiment.state;
  const metrics = getMetricRows(experiment);
  const operations = getOperations(experiment);

  let report = "";

  report += "====================================================\n";
  report += "                 HASHLAB REPORT\n";
  report += "       Hash Index Simulation & Performance Lab\n";
  report += "====================================================\n\n";

  report += "1. PROJECT INFORMATION\n";
  report += "----------------------------------------------------\n";
  report += "Project: Hash Index Simulator\n";
  report += "Domain: DBMS & DSA\n";
  report += "Application: Interactive Hashing Simulator\n\n";

  report += "2. EXPERIMENT CONFIGURATION\n";
  report += "----------------------------------------------------\n";

  metrics.forEach(([label, value]) => {
    report += `${label}: ${value}\n`;
  });

  report += "\n3. INPUT DATA\n";
  report += "----------------------------------------------------\n";
  report += `Keys: ${experiment.inputKeys.join(", ")}\n`;

  report += "\n4. PROCESSING / OPERATION LOG\n";
  report += "----------------------------------------------------\n";

  if (operations.length === 0) {
    report += "No operations recorded.\n";
  } else {
    operations.forEach((operation, index) => {
      report += `${index + 1}. ${operation.type}`;

      if (operation.key !== undefined) {
        report += ` | Key: ${operation.key}`;
      }

      if (operation.status) {
        report += ` | Status: ${operation.status}`;
      }

      if (operation.message) {
        report += ` | ${operation.message}`;
      }

      report += "\n";
    });
  }

  report += "\n5. FINAL BUCKET DISTRIBUTION\n";
  report += "----------------------------------------------------\n";

  if (Array.isArray(state.buckets)) {
    state.buckets.forEach((bucket) => {
      report += `Bucket ${bucket.id}`;

      if (bucket.localDepth !== undefined) {
        report += ` | Local Depth: ${bucket.localDepth}`;
      }

      report += " | Keys: ";

      if (Array.isArray(bucket.keys) && bucket.keys.length > 0) {
        report += bucket.keys.join(", ");
      } else {
        report += "Empty";
      }

      report += "\n";
    });
  }

  report += "\n6. PERFORMANCE SUMMARY\n";
  report += "----------------------------------------------------\n";
  report += `Total Keys: ${state.totalKeys ?? 0}\n`;
  report += `Total Collisions: ${state.totalCollisions ?? 0}\n`;
  report += `Load Factor: ${((state.loadFactor ?? 0) * 100).toFixed(1)}%\n`;
  report += `Total Splits: ${state.totalSplits ?? 0}\n`;
  report += `Total Rehashes: ${state.totalRehashes ?? 0}\n`;
  report += `Directory Doublings: ${state.totalDirectoryDoublings ?? 0}\n`;

  report += "\n====================================================\n";
  report += "                 END OF REPORT\n";
  report += "====================================================\n";

  return report;
}

/* -------------------------------------------------------
   CSV REPORT
------------------------------------------------------- */

function generateCsvReport(experiment) {
  const state = experiment.state;

  const rows = [
    ["Metric", "Value"],
    ["Project", "Hash Index Simulator"],
    ["Algorithm", experiment.algorithmName],
    ["Generated", experiment.generatedAt],
    ["Input Keys", experiment.inputKeys.join(" | ")],
    ["Bucket Capacity", experiment.bucketCapacity],
    ["Bucket / Directory Size", getBucketCount(state)],
    ["Total Keys", state.totalKeys ?? 0],
    ["Insertions", state.totalInsertions ?? 0],
    ["Searches", state.totalSearches ?? 0],
    ["Deletes", state.totalDeletes ?? 0],
    ["Collisions", state.totalCollisions ?? 0],
    [
      "Load Factor",
      `${((state.loadFactor ?? 0) * 100).toFixed(1)}%`,
    ],
    ["Splits", state.totalSplits ?? 0],
    ["Rehashes", state.totalRehashes ?? 0],
    [
      "Directory Doublings",
      state.totalDirectoryDoublings ?? 0,
    ],
    [],
    ["Bucket ID", "Local Depth", "Keys"],
  ];

  if (Array.isArray(state.buckets)) {
    state.buckets.forEach((bucket) => {
      rows.push([
        bucket.id,
        bucket.localDepth ?? "",
        Array.isArray(bucket.keys)
          ? bucket.keys.join(" | ")
          : "",
      ]);
    });
  }

  rows.push([]);
  rows.push(["Operation", "Key", "Status", "Message"]);

  getOperations(experiment).forEach((operation) => {
    rows.push([
      operation.type ?? "",
      operation.key ?? "",
      operation.status ?? "",
      operation.message ?? "",
    ]);
  });

  return rows
    .map((row) =>
      row
        .map((value) => {
          const text = String(value ?? "");
          return `"${text.replaceAll('"', '""')}"`;
        })
        .join(",")
    )
    .join("\n");
}
/* -------------------------------------------------------
   REPORT SVG CHARTS
------------------------------------------------------- */

function createBarChartSvg(data, title, valueLabel) {
  const width = 720;
  const height = 320;

  const chartLeft = 70;
  const chartTop = 55;
  const chartRight = 30;
  const chartBottom = 70;

  const chartWidth = width - chartLeft - chartRight;
  const chartHeight = height - chartTop - chartBottom;

  const values = data.map((item) => Number(item.value) || 0);

  const maxValue = Math.max(...values, 1);

  const barGap = 16;

  const barWidth =
    data.length > 0
      ? Math.max(
          20,
          (chartWidth - barGap * (data.length + 1)) /
            data.length
        )
      : 40;

  const bars = data
    .map((item, index) => {
      const value = Number(item.value) || 0;

      const barHeight =
        (value / maxValue) * chartHeight;

      const x =
        chartLeft +
        barGap +
        index * (barWidth + barGap);

      const y =
        chartTop +
        chartHeight -
        barHeight;

      const label =
        String(item.label).length > 12
          ? `${String(item.label).slice(0, 12)}…`
          : String(item.label);

      return `
        <rect
          x="${x}"
          y="${y}"
          width="${barWidth}"
          height="${barHeight}"
          rx="4"
          fill="#0077b6"
        />

        <text
          x="${x + barWidth / 2}"
          y="${y - 8}"
          text-anchor="middle"
          font-size="12"
          fill="#172033"
        >
          ${value}
        </text>

        <text
          x="${x + barWidth / 2}"
          y="${chartTop + chartHeight + 25}"
          text-anchor="middle"
          font-size="11"
          fill="#667085"
        >
          ${label}
        </text>
      `;
    })
    .join("");

  const gridLines = [0, 0.25, 0.5, 0.75, 1]
    .map((ratio) => {
      const y =
        chartTop +
        chartHeight -
        ratio * chartHeight;

      const value = (maxValue * ratio).toFixed(
        maxValue % 1 === 0 ? 0 : 1
      );

      return `
        <line
          x1="${chartLeft}"
          y1="${y}"
          x2="${width - chartRight}"
          y2="${y}"
          stroke="#e4e7ec"
          stroke-width="1"
        />

        <text
          x="${chartLeft - 10}"
          y="${y + 4}"
          text-anchor="end"
          font-size="11"
          fill="#667085"
        >
          ${value}
        </text>
      `;
    })
    .join("");

  return `
    <div class="chart-card">
      <h3>${title}</h3>

      <svg
        viewBox="0 0 ${width} ${height}"
        width="100%"
        role="img"
        aria-label="${title}"
      >

        ${gridLines}

        <line
          x1="${chartLeft}"
          y1="${chartTop}"
          x2="${chartLeft}"
          y2="${chartTop + chartHeight}"
          stroke="#98a2b3"
        />

        <line
          x1="${chartLeft}"
          y1="${chartTop + chartHeight}"
          x2="${width - chartRight}"
          y2="${chartTop + chartHeight}"
          stroke="#98a2b3"
        />

        ${bars}

        <text
          x="${width / 2}"
          y="${height - 10}"
          text-anchor="middle"
          font-size="12"
          fill="#667085"
        >
          ${valueLabel}
        </text>

      </svg>
    </div>
  `;
}

function generateHtmlReport(experiment) {
  const state = experiment.state;

  const metrics = getMetricRows(experiment);
  const operations = getOperations(experiment);

  /* ---------------------------------------------
     CHART DATA
  --------------------------------------------- */

  const collisionChart = createBarChartSvg(
    [
      {
        label: "Collisions",
        value: state.totalCollisions ?? 0,
      },
    ],
    "Collision Analysis",
    "Collision Count"
  );

  const loadFactorChart = createBarChartSvg(
    [
      {
        label: "Load Factor",
        value: Number(
          ((state.loadFactor ?? 0) * 100).toFixed(1)
        ),
      },
    ],
    "Load Factor",
    "Load Factor (%)"
  );

  const bucketChart = createBarChartSvg(
    Array.isArray(state.buckets)
      ? state.buckets.map((bucket) => ({
          label: `B${bucket.id}`,
          value: Array.isArray(bucket.keys)
            ? bucket.keys.length
            : 0,
        }))
      : [],
    "Bucket Distribution",
    "Keys per Bucket"
  );

  const dynamicChart = createBarChartSvg(
    [
      {
        label: "Splits",
        value: state.totalSplits ?? 0,
      },
      {
        label: "Rehashes",
        value: state.totalRehashes ?? 0,
      },
      {
        label: "Doublings",
        value: state.totalDirectoryDoublings ?? 0,
      },
    ],
    "Dynamic Operations",
    "Operation Count"
  );

  /* ---------------------------------------------
     TABLE DATA
  --------------------------------------------- */

  const metricRows = metrics
    .map(
      ([label, value]) => `
        <tr>
          <td>${label}</td>
          <td>${value}</td>
        </tr>
      `
    )
    .join("");

  const bucketRows = Array.isArray(state.buckets)
    ? state.buckets
        .map(
          (bucket) => `
            <tr>
              <td>Bucket ${bucket.id}</td>

              <td>
                ${bucket.localDepth ?? "-"}
              </td>

              <td>
                ${
                  Array.isArray(bucket.keys) &&
                  bucket.keys.length
                    ? bucket.keys.join(", ")
                    : "Empty"
                }
              </td>
            </tr>
          `
        )
        .join("")
    : "";

  const operationRows = operations
    .map(
      (operation, index) => `
        <tr>
          <td>${index + 1}</td>

          <td>
            ${operation.type ?? ""}
          </td>

          <td>
            ${operation.key ?? ""}
          </td>

          <td>
            ${operation.status ?? ""}
          </td>

          <td>
            ${operation.message ?? ""}
          </td>
        </tr>
      `
    )
    .join("");

  /* ---------------------------------------------
     FINAL HTML REPORT
  --------------------------------------------- */

  return `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8" />

<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0"
/>

<title>HashLab Project Report</title>

<style>

body {
  font-family:
    Arial,
    Helvetica,
    sans-serif;

  margin: 40px;

  color: #172033;

  line-height: 1.5;

  background: #ffffff;
}

h1 {
  margin-bottom: 5px;
}

h2 {
  margin-top: 35px;

  border-bottom:
    2px solid #d0d5dd;

  padding-bottom: 8px;
}

h3 {
  margin-top: 0;
}

p {
  margin: 8px 0;
}

.subtitle {
  color: #667085;

  font-size: 17px;
}

.cover {
  padding-bottom: 25px;

  border-bottom:
    3px solid #172033;
}

table {
  width: 100%;

  border-collapse:
    collapse;

  margin-top: 15px;
}

th,
td {
  border:
    1px solid #d0d5dd;

  padding: 10px;

  text-align: left;

  vertical-align: top;
}

th {
  font-weight: 700;

  background: #f2f4f7;
}

.chart-grid {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 20px;

  margin-top: 20px;
}

.chart-card {
  border:
    1px solid #d0d5dd;

  border-radius: 10px;

  padding: 18px;

  background: #ffffff;
}

.chart-card h3 {
  margin-bottom: 5px;
}

.chart-card svg {
  display: block;

  width: 100%;

  height: auto;
}

.footer {
  margin-top: 50px;

  color: #667085;

  font-size: 13px;

  border-top:
    1px solid #d0d5dd;

  padding-top: 15px;
}

@media (max-width: 800px) {

  body {
    margin: 20px;
  }

  .chart-grid {
    grid-template-columns: 1fr;
  }

}

@media print {

  body {
    margin: 20px;
  }

  .chart-card {
    break-inside: avoid;
  }

  table {
    break-inside: auto;
  }

  tr {
    break-inside: avoid;
  }

}

</style>

</head>

<body>

<div class="cover">

  <h1>HashLab</h1>

  <div class="subtitle">
    Hash Index Simulation & Performance Laboratory
  </div>

  <p>
    <strong>Project:</strong>
    Hash Index Simulator
  </p>

  <p>
    <strong>Domain:</strong>
    DBMS & DSA
  </p>

  <p>
    <strong>Algorithm:</strong>
    ${experiment.algorithmName}
  </p>

  <p>
    <strong>Generated:</strong>
    ${experiment.generatedAt}
  </p>

</div>


<h2>1. Experiment Configuration</h2>

<table>

  <thead>
    <tr>
      <th>Parameter</th>
      <th>Value</th>
    </tr>
  </thead>

  <tbody>
    ${metricRows}
  </tbody>

</table>


<h2>2. Input Data</h2>

<p>

  <strong>Keys:</strong>

  ${experiment.inputKeys.join(", ")}

</p>


<h2>3. Processing / Operation Log</h2>

<table>

  <thead>

    <tr>
      <th>#</th>
      <th>Operation</th>
      <th>Key</th>
      <th>Status</th>
      <th>Message</th>
    </tr>

  </thead>

  <tbody>

    ${operationRows}

  </tbody>

</table>


<h2>4. Visual Analytics</h2>

<p>
The following figures are generated directly from
the results of this simulation.
</p>

<div class="chart-grid">

  ${collisionChart}

  ${loadFactorChart}

  ${bucketChart}

  ${dynamicChart}

</div>


<h2>5. Final Bucket Distribution</h2>

<table>

  <thead>

    <tr>
      <th>Bucket</th>
      <th>Local Depth</th>
      <th>Keys</th>
    </tr>

  </thead>

  <tbody>

    ${bucketRows}

  </tbody>

</table>


<h2>6. Performance Summary</h2>

<table>

  <thead>

    <tr>
      <th>Metric</th>
      <th>Result</th>
    </tr>

  </thead>

  <tbody>

    <tr>
      <td>Total Keys</td>
      <td>${state.totalKeys ?? 0}</td>
    </tr>

    <tr>
      <td>Collisions</td>
      <td>${state.totalCollisions ?? 0}</td>
    </tr>

    <tr>
      <td>Load Factor</td>
      <td>
        ${((state.loadFactor ?? 0) * 100).toFixed(1)}%
      </td>
    </tr>

    <tr>
      <td>Splits</td>
      <td>${state.totalSplits ?? 0}</td>
    </tr>

    <tr>
      <td>Rehashes</td>
      <td>${state.totalRehashes ?? 0}</td>
    </tr>

    <tr>
      <td>Directory Doublings</td>
      <td>
        ${state.totalDirectoryDoublings ?? 0}
      </td>
    </tr>

  </tbody>

</table>


<div class="footer">

  Generated by HashLab —
  Hash Index Simulator

</div>

</body>

</html>
  `;
}

/* -------------------------------------------------------
   MAIN COMPONENT
------------------------------------------------------- */

function Download() {
  const [algorithm, setAlgorithm] = useState("extendible");

  const [inputText, setInputText] = useState(
    "10,20,30,40,50,60,70,80,90,100"
  );

  const [bucketCount, setBucketCount] = useState(5);
  const [bucketCapacity, setBucketCapacity] = useState(2);

  const [experiment, setExperiment] = useState(null);

  const parsedKeys = useMemo(() => {
    return inputText
      .split(",")
      .map((value) => Number(value.trim()))
      .filter((value) => Number.isInteger(value));
  }, [inputText]);

  const runExperiment = () => {
    if (parsedKeys.length === 0) {
      alert("Please enter at least one valid integer key.");
      return;
    }

    const instance = createAlgorithm(
      algorithm,
      Number(bucketCount),
      Number(bucketCapacity)
    );

    if (!instance) return;

    parsedKeys.forEach((key) => {
      instance.insert(key);
    });

    const state = instance.getState();

    setExperiment({
      algorithmName:
        algorithmOptions.find((item) => item.id === algorithm)?.name ||
        algorithm,
      inputKeys: [...parsedKeys],
      bucketCount: Number(bucketCount),
      bucketCapacity: Number(bucketCapacity),
      state,
      generatedAt: new Date().toLocaleString(),
    });
  };

  const resetReport = () => {
    setExperiment(null);
  };

  const downloadTxt = () => {
    if (!experiment) return;

    const content = generateTxtReport(experiment);

    downloadFile(
      content,
      "HashLab-Experiment-Report.txt",
      "text/plain"
    );
  };

  const downloadCsv = () => {
    if (!experiment) return;

    const content = generateCsvReport(experiment);

    downloadFile(
      content,
      "HashLab-Experiment-Data.csv",
      "text/csv"
    );
  };

  const downloadHtml = () => {
    if (!experiment) return;

    const content = generateHtmlReport(experiment);

    downloadFile(
      content,
      "HashLab-Experiment-Report.html",
      "text/html"
    );
  };

  const printPdf = () => {
    if (!experiment) return;

    const reportHtml = generateHtmlReport(experiment);

    const printWindow = window.open(
      "",
      "_blank",
      "width=1000,height=800"
    );

    if (!printWindow) {
      alert(
        "The browser blocked the report window. Please allow pop-ups for HashLab."
      );
      return;
    }

    printWindow.document.write(reportHtml);
    printWindow.document.close();

    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <main className="simulator-page">

      <div className="simulator-header">
        <div>
          <span className="eyebrow">REPORT GENERATOR</span>

          <h1>Download Project Report</h1>

          <p>
            Run an experiment and generate downloadable reports from
            the actual HashLab simulation results.
          </p>
        </div>
      </div>

      <section className="simulator-controls">

        <div className="control-card">

          <h2>Experiment Configuration</h2>

          <p className="control-description">
            Choose an algorithm and provide the input keys for the
            experiment.
          </p>

          <div className="form-grid">

            <label>
              <span>Hashing Algorithm</span>

              <select
                value={algorithm}
                onChange={(event) =>
                  setAlgorithm(event.target.value)
                }
              >
                {algorithmOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Initial Bucket Count</span>

              <input
                type="number"
                min="2"
                value={bucketCount}
                onChange={(event) =>
                  setBucketCount(event.target.value)
                }
                disabled={
                  algorithm === "extendible" ||
                  algorithm === "linear-hashing"
                }
              />
            </label>

            <label>
              <span>Bucket Capacity</span>

              <input
                type="number"
                min="1"
                value={bucketCapacity}
                onChange={(event) =>
                  setBucketCapacity(event.target.value)
                }
              />
            </label>

            <label className="form-full">
              <span>Input Keys</span>

              <textarea
                value={inputText}
                onChange={(event) =>
                  setInputText(event.target.value)
                }
                rows="4"
                placeholder="Example: 10,20,30,40,50"
              />
            </label>

          </div>

          <div className="control-actions">

            <button
              className="primary-button"
              onClick={runExperiment}
            >
              Generate Experiment
            </button>

            <button
              className="secondary-button"
              onClick={resetReport}
            >
              Reset
            </button>

          </div>

        </div>

      </section>

      {experiment && (
        <>
          <section className="metrics-grid">

            <div className="metric-card">
              <span>Algorithm</span>
              <strong>{experiment.algorithmName}</strong>
            </div>

            <div className="metric-card">
              <span>Total Keys</span>
              <strong>
                {experiment.state.totalKeys ?? 0}
              </strong>
            </div>

            <div className="metric-card">
              <span>Collisions</span>
              <strong>
                {experiment.state.totalCollisions ?? 0}
              </strong>
            </div>

            <div className="metric-card">
              <span>Load Factor</span>
              <strong>
                {(
                  (experiment.state.loadFactor ?? 0) * 100
                ).toFixed(1)}
                %
              </strong>
            </div>

          </section>

          {/* DOWNLOAD SECTION */}

          <section className="hash-table-section">

            <div className="section-heading">

              <div>
                <span className="eyebrow">
                  EXPORT REPORT
                </span>

                <h2>Download Your Experiment</h2>

                <p>
                  Export the current experiment using the formats
                  below.
                </p>
              </div>

            </div>

            <div className="control-actions">

              <button
                className="primary-button"
                onClick={downloadTxt}
              >
                Download TXT
              </button>

              <button
                className="secondary-button"
                onClick={downloadCsv}
              >
                Download CSV
              </button>

              <button
                className="secondary-button"
                onClick={downloadHtml}
              >
                Download HTML
              </button>

              <button
                className="secondary-button"
                onClick={printPdf}
              >
                Print / Save PDF
              </button>

            </div>

            <p
              className="control-description"
              style={{ marginTop: "16px" }}
            >
              <strong>PDF:</strong> Clicking "Print / Save PDF"
              opens the formatted report. In the print dialog,
              choose "Save as PDF".
            </p>

          </section>
          {/* ANALYTICS GRAPHS */}

<section className="hash-table-section">

  <div className="section-heading">
    <div>
      <span className="eyebrow">VISUAL ANALYTICS</span>

      <h2>Experiment Graphs</h2>

      <p>
        Visual analysis generated from the actual simulation results.
      </p>
    </div>
  </div>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
      gap: "24px",
    }}
  >

    {/* COLLISION GRAPH */}

    <div className="control-card">

      <h3>Collision Analysis</h3>

      <div style={{ width: "100%", height: 280 }}>

        <ResponsiveContainer width="100%" height="100%">

          <BarChart
            data={[
              {
                name: experiment.algorithmName,
                collisions:
                  experiment.state.totalCollisions ?? 0,
              },
            ]}
          >

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis allowDecimals={false} />

            <Tooltip />

            <Bar
              dataKey="collisions"
              name="Collisions"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>

    {/* LOAD FACTOR */}

    <div className="control-card">

      <h3>Load Factor</h3>

      <div style={{ width: "100%", height: 280 }}>

        <ResponsiveContainer width="100%" height="100%">

          <BarChart
            data={[
              {
                name: experiment.algorithmName,
                loadFactor: Number(
                  (
                    (experiment.state.loadFactor ?? 0) *
                    100
                  ).toFixed(1)
                ),
              },
            ]}
          >

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis
              domain={[0, 100]}
              unit="%"
            />

            <Tooltip />

            <Bar
              dataKey="loadFactor"
              name="Load Factor (%)"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>

    {/* BUCKET DISTRIBUTION */}

    <div className="control-card">

      <h3>Bucket Distribution</h3>

      <div style={{ width: "100%", height: 280 }}>

        <ResponsiveContainer width="100%" height="100%">

          <BarChart
            data={
              Array.isArray(experiment.state.buckets)
                ? experiment.state.buckets.map(
                    (bucket) => ({
                      name: `B${bucket.id}`,
                      keys:
                        Array.isArray(bucket.keys)
                          ? bucket.keys.length
                          : 0,
                    })
                  )
                : []
            }
          >

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis allowDecimals={false} />

            <Tooltip />

            <Bar
              dataKey="keys"
              name="Keys"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>

    {/* DYNAMIC OPERATIONS */}

    <div className="control-card">

      <h3>Dynamic Operations</h3>

      <div style={{ width: "100%", height: 280 }}>

        <ResponsiveContainer width="100%" height="100%">

          <BarChart
            data={[
              {
                name: experiment.algorithmName,
                splits:
                  experiment.state.totalSplits ?? 0,
                rehashes:
                  experiment.state.totalRehashes ?? 0,
                doublings:
                  experiment.state.totalDirectoryDoublings ?? 0,
              },
            ]}
          >

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis allowDecimals={false} />

            <Tooltip />

            <Bar
              dataKey="splits"
              name="Splits"
            />

            <Bar
              dataKey="rehashes"
              name="Rehashes"
            />

            <Bar
              dataKey="doublings"
              name="Directory Doublings"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>

  </div>

</section>

          {/* SUMMARY */}

          <section className="hash-table-section">

            <div className="section-heading">

              <div>
                <span className="eyebrow">
                  EXPERIMENT SUMMARY
                </span>

                <h2>Final Simulation Result</h2>
              </div>

            </div>

            <div className="report-summary-grid">

              <div className="report-summary-item">
                <span>Generated</span>
                <strong>
                  {experiment.generatedAt}
                </strong>
              </div>

              <div className="report-summary-item">
                <span>Input Keys</span>
                <strong>
                  {experiment.inputKeys.join(", ")}
                </strong>
              </div>

              <div className="report-summary-item">
                <span>Bucket Capacity</span>
                <strong>
                  {experiment.bucketCapacity}
                </strong>
              </div>

              <div className="report-summary-item">
                <span>Bucket / Directory Size</span>
                <strong>
                  {getBucketCount(experiment.state)}
                </strong>
              </div>

              <div className="report-summary-item">
                <span>Insertions</span>
                <strong>
                  {experiment.state.totalInsertions ?? 0}
                </strong>
              </div>

              <div className="report-summary-item">
                <span>Searches</span>
                <strong>
                  {experiment.state.totalSearches ?? 0}
                </strong>
              </div>

              <div className="report-summary-item">
                <span>Deletes</span>
                <strong>
                  {experiment.state.totalDeletes ?? 0}
                </strong>
              </div>

              <div className="report-summary-item">
                <span>Splits</span>
                <strong>
                  {experiment.state.totalSplits ?? 0}
                </strong>
              </div>

              <div className="report-summary-item">
                <span>Rehashes</span>
                <strong>
                  {experiment.state.totalRehashes ?? 0}
                </strong>
              </div>

              <div className="report-summary-item">
                <span>Directory Doublings</span>
                <strong>
                  {experiment.state.totalDirectoryDoublings ?? 0}
                </strong>
              </div>

            </div>

          </section>

          {/* OPERATION LOG */}

          <section className="operation-log-section">

            <div className="section-heading">

              <div>
                <span className="eyebrow">
                  PROCESSING
                </span>

                <h2>Operation Log</h2>
              </div>

            </div>

            <div className="operation-log">
              <div className="download-log-header">
                <span style={{ width: "50px" }}>STEP</span>
                <span style={{ minWidth: "220px" }}>OPERATION & TARGET</span>
                <span style={{ width: "110px" }}>STATUS</span>
                <span style={{ flex: 1 }}>EXECUTION DETAILS</span>
              </div>

              {Array.isArray(experiment.state.operations) &&
              experiment.state.operations.length > 0 ? (
                experiment.state.operations.map(
                  (operation, index) => {
                    const typeLower = (operation.type || "unknown")
                      .toLowerCase()
                      .replace(/_/g, "-");
                    const statusLower = (operation.status || "ok").toLowerCase();

                    return (
                      <div
                        className="download-log-row"
                        key={index}
                      >
                        <div className="download-log-step">
                          #{String(index + 1).padStart(2, "0")}
                        </div>

                        <div className="download-log-type-wrap">
                          <span
                            className={`download-badge download-badge-${typeLower}`}
                          >
                            {operation.type}
                          </span>

                          {operation.key !== undefined && (
                            <span className="download-key-pill">
                              Key: {operation.key}
                            </span>
                          )}
                        </div>

                        <div className="download-log-status-wrap">
                          <span className={`download-status-chip status-${statusLower}`}>
                            {operation.status || "COMPLETED"}
                          </span>
                        </div>

                        <div className="download-log-msg">
                          {operation.message ||
                            `${
                              operation.status ||
                              "COMPLETED"
                            } operation executed.`}
                        </div>
                      </div>
                    );
                  }
                )
              ) : (
                <div className="empty-bucket">
                  No operations recorded.
                </div>
              )}
            </div>
          </section>

          {/* BUCKET DISTRIBUTION */}

          <section className="hash-table-section">

            <div className="section-heading">

              <div>
                <span className="eyebrow">
                  FINAL OUTPUT
                </span>

                <h2>Bucket Distribution</h2>
              </div>

            </div>

            <div className="bucket-grid">

              {Array.isArray(experiment.state.buckets) &&
              experiment.state.buckets.length > 0 ? (
                experiment.state.buckets.map(
                  (bucket) => (
                    <div
                      className="bucket-card"
                      key={bucket.id}
                    >

                      <div className="bucket-header">

                        <strong>
                          Bucket {bucket.id}
                        </strong>

                        {bucket.localDepth !==
                          undefined && (
                          <span className="bucket-hash">
                            Local Depth:{" "}
                            {bucket.localDepth}
                          </span>
                        )}

                      </div>

                      <div className="bucket-keys">

                        {Array.isArray(bucket.keys) &&
                        bucket.keys.length > 0 ? (
                          bucket.keys.map(
                            (key, index) => (
                              <span
                                className="key-chip"
                                key={`${key}-${index}`}
                              >
                                {key}
                              </span>
                            )
                          )
                        ) : (
                          <span className="empty-bucket">
                            Empty
                          </span>
                        )}

                      </div>

                    </div>
                  )
                )
              ) : (
                <div className="empty-bucket">
                  No bucket data available.
                </div>
              )}

            </div>

          </section>
        </>
      )}

      {!experiment && (
        <section className="hash-table-section">

          <div className="empty-state-card">

            <h2>
              No experiment generated yet
            </h2>

            <p>
              Configure the experiment above and click{" "}
              <strong>
                Generate Experiment
              </strong>{" "}
              to create a report.
            </p>

          </div>

        </section>
      )}

    </main>
  );
}

export default Download;