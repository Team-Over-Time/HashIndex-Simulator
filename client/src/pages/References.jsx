// client/src/pages/References.jsx

import React, { useState } from "react";
import { ExternalLink, Copy, Check } from "lucide-react";
import { referencesData } from "../data/referencesData";

export default function References() {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyCitation = (ref) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(ref.citation);
      setCopiedId(ref.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <main
      style={{
        maxWidth: 960,
        margin: "0 auto",
        padding: "40px 20px 80px",
        color: "var(--text-primary)",
      }}
    >
      {/* Clean Header */}
      <div style={{ marginBottom: 32, borderBottom: "1.5px solid var(--border-main)", paddingBottom: 20 }}>
        <h1
          style={{
            fontSize: "clamp(26px, 3.5vw, 32px)",
            fontWeight: 800,
            margin: "0 0 8px",
            color: "var(--text-primary)",
          }}
        >
          References & Bibliography
        </h1>
        <p
          style={{
            fontSize: "15px",
            lineHeight: 1.6,
            color: "var(--text-secondary)",
            margin: 0,
          }}
        >
          Academic textbooks, research publications, official documentation, and exam repositories referenced in the development of HashLab.
        </p>
      </div>

      {/* Clean Citations List */}
      <ol
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {referencesData.map((ref, index) => {
          const isCopied = copiedId === ref.id;

          return (
            <li
              key={ref.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 16,
                padding: "18px 20px",
                borderRadius: 12,
                background: "var(--bg-card)",
                border: "1px solid var(--border-main)",
                transition: "border-color 0.2s ease, background 0.2s ease",
              }}
            >
              {/* Citation Index Badge */}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: 36,
                  height: 32,
                  borderRadius: 8,
                  background: "rgba(37, 99, 235, 0.1)",
                  color: "#2563eb",
                  fontWeight: 800,
                  fontSize: "13px",
                  flexShrink: 0,
                  border: "1px solid rgba(37, 99, 235, 0.25)",
                }}
              >
                [{index + 1}]
              </span>

              {/* Citation Details */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    margin: "0 0 8px",
                    fontSize: "14.5px",
                    lineHeight: 1.65,
                    color: "var(--text-primary)",
                  }}
                >
                  <strong>{ref.authors}</strong> ({ref.year}).{" "}
                  <span style={{ fontStyle: "italic", fontWeight: 600 }}>{ref.title}</span>.{" "}
                  {ref.venue}. {ref.isbn && <span style={{ color: "var(--text-muted)" }}>{ref.isbn}.</span>}
                </p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    flexWrap: "wrap",
                    fontSize: "13px",
                  }}
                >
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      color: "var(--accent-primary, #3b82f6)",
                      textDecoration: "none",
                      fontWeight: 600,
                      wordBreak: "break-all",
                    }}
                  >
                    <span>{ref.url}</span>
                    <ExternalLink size={13} style={{ flexShrink: 0 }} />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleCopyCitation(ref)}
                    title="Copy citation"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "3px 9px",
                      borderRadius: 6,
                      border: "1px solid var(--border-main)",
                      background: isCopied ? "rgba(16, 185, 129, 0.15)" : "var(--bg-card-muted)",
                      color: isCopied ? "#10b981" : "var(--text-muted)",
                      fontSize: "11.5px",
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {isCopied ? <Check size={12} /> : <Copy size={12} />}
                    <span>{isCopied ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </main>
  );
}
