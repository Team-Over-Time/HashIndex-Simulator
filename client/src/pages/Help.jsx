import React, { useState } from "react";
import {
  BookOpen,
  Play,
  Search,
  Trash2,
  BarChart3,
  GitCompare,
  Lightbulb,
  AlertCircle,
  ChevronDown,
  Hash,
  Database,
  Activity,
  RotateCcw,
  ArrowRight,
  Sparkles,
  Layers,
  Sliders,
  Moon,
  Code2,
  CheckCircle2,
} from "lucide-react";

const sections = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: Play,
  },
  {
    id: "simulator",
    title: "Using the Simulator",
    icon: Database,
  },
  {
    id: "custom-formulas",
    title: "Custom Math Formulas & Expression Syntax",
    icon: Sparkles,
  },
  {
    id: "batch-autoplay",
    title: "Batch Auto-Play & Stepper Runner",
    icon: Layers,
  },
  {
    id: "table-tuning",
    title: "Table Size (m) & Bucket Capacity (C) Tuning",
    icon: Sliders,
  },
  {
    id: "algorithms",
    title: "Hashing Algorithms Reference",
    icon: Hash,
  },
  {
    id: "operations",
    title: "Insert, Search & Delete Operations",
    icon: Activity,
  },
  {
    id: "metrics",
    title: "Understanding Performance Metrics",
    icon: BarChart3,
  },
  {
    id: "compare",
    title: "Compare Arena & Workloads",
    icon: GitCompare,
  },
  {
    id: "analytics",
    title: "Analytics & Chart Profiler",
    icon: BarChart3,
  },
  {
    id: "learn",
    title: "Learn Page & Mathematical Cards",
    icon: BookOpen,
  },
  {
    id: "dark-mode",
    title: "Theme & Dark Mode",
    icon: Moon,
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting & FAQs",
    icon: AlertCircle,
  },
  {
    id: "demo",
    title: "Project Demo & Viva Workflow",
    icon: Lightbulb,
  },
];

const algorithmData = [
  {
    name: "Separate Chaining",
    type: "Closed Addressing (Open Hashing)",
    description:
      "Stores multiple colliding keys inside an overflow chain / list within the same bucket. The table size m never restricts the number of keys.",
    formula: "Bucket Index = h(k) mod m",
    example:
      "If keys 14 and 28 both evaluate to index 0 mod 7, both keys reside sequentially in Bucket 0.",
  },
  {
    name: "Linear Probing",
    type: "Open Addressing (Closed Hashing)",
    description:
      "When a collision occurs at index h(k), the algorithm steps forward sequentially with a fixed stride step (default 1) until an empty slot is encountered.",
    formula: "h(k, i) = [h₁(k) + step × i] mod m, where i = 0, 1, 2, ...",
    example:
      "If slot 3 is occupied, the algorithm probes slot 4, then slot 5, wrapping around modulo m.",
  },
  {
    name: "Quadratic Probing",
    type: "Open Addressing",
    description:
      "Avoids primary clustering by stepping away from collision sites using a quadratic polynomial in probe index i.",
    formula: "h(k, i) = [h₁(k) + c₁ × i + c₂ × i²] mod m",
    example:
      "With c₁=0 and c₂=1, probe locations from base slot s are s, (s+1) mod m, (s+4) mod m, (s+9) mod m.",
  },
  {
    name: "Double Hashing",
    type: "Open Addressing",
    description:
      "Uses two independent hash functions: primary hash h₁(k) determines initial placement, and secondary hash h₂(k) calculates the key-dependent probe step.",
    formula: "h(k, i) = [h₁(k) + i × h₂(k)] mod m, where h₂(k) > 0 and gcd(h₂(k), m) = 1",
    example:
      "If key 26 has h₁(26) = 5 mod 7 and h₂(26) = 5 - (26 mod 5) = 4, the probe sequence is 5, (5+4)=2, (5+8)=6, ... mod 7.",
  },
  {
    name: "Rehashing",
    type: "Dynamic Hashing",
    description:
      "Monitors table load factor α = N / m. When α exceeds a threshold (e.g. 75%), a larger table of prime capacity is allocated and all keys are rehashed.",
    formula: "New Size m' = 2m + 1 (next prime), New Index = h(k) mod m'",
    example:
      "Table of size 7 automatically expands to 17 or 19 when saturated, redistributing clustered keys.",
  },
  {
    name: "Extendible Hashing",
    type: "Dynamic Hashing",
    description:
      "Uses a directory array indexed by the d most significant (or least significant) bits of the hash. Buckets maintain their own local depth d_local and split independently.",
    formula: "Directory Index = HashBits(k, GlobalDepth d)",
    example:
      "When a bucket with local depth equal to global depth overflows, the directory doubles (d becomes d + 1) without rehashing all buckets.",
  },
  {
    name: "Linear Hashing",
    type: "Dynamic Hashing",
    description:
      "Grows the hash table one bucket at a time in round-robin order using a split pointer (ptr) and hashing levels h_level(k) and h_{level+1}(k).",
    formula: "h_lvl(k) = k mod (N × 2^level), if index < ptr then h_{lvl+1}(k) = k mod (N × 2^{level+1})",
    example:
      "Buckets split predictably regardless of where overflow occurred, maintaining balanced disk block allocations.",
  },
];

const metricData = [
  {
    name: "Total Keys (N)",
    description:
      "The exact count of distinct keys currently stored inside the hash table.",
  },
  {
    name: "Table Size (m)",
    description:
      "The number of primary buckets/slots in the table. Configurable in HashLab between 2 and 31.",
  },
  {
    name: "Bucket Capacity (C)",
    description:
      "Maximum number of keys a bucket can hold before overflow, chaining, or split triggers.",
  },
  {
    name: "Load Factor (α)",
    description:
      "Ratio of total keys to total table capacity (α = N / m or N / (m × C)). Crucial metric for predicting collisions.",
  },
  {
    name: "Collisions",
    description:
      "Count of insertions where the primary hash slot was already occupied, requiring resolution.",
  },
  {
    name: "Probes Required",
    description:
      "Total number of slot inspections performed to find an empty slot or locate an existing key.",
  },
  {
    name: "Bucket Splits",
    description:
      "In dynamic hashing (Extendible & Linear Hashing), counts bucket partition events when capacity is exceeded.",
  },
  {
    name: "Directory Doublings",
    description:
      "In Extendible Hashing, records when the directory doubles in size (Global Depth increments).",
  },
  {
    name: "Linear Hashing Level & Pointer",
    description:
      "Tracks the progressive table expansion cycle and the current split candidate bucket index.",
  },
];

function Help() {
  const [openSection, setOpenSection] = useState("getting-started");

  const toggleSection = (id) => {
    setOpenSection((current) => (current === id ? "" : id));
  };

  return (
    <main className="placeholder-page">
      <div
        className="placeholder-card"
        style={{
          maxWidth: "1200px",
          width: "calc(100% - 40px)",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            textAlign: "center",
            maxWidth: "840px",
            margin: "0 auto",
          }}
        >
          <span className="section-label">
            HASHLAB • COMPLETE USER MANUAL & DOCUMENTATION
          </span>

          <h1>Help & Documentation</h1>

          <p
            style={{
              marginTop: "14px",
              lineHeight: 1.7,
              fontSize: "15px",
            }}
          >
            Welcome to the <strong>HashLab Laboratory Manual</strong>. Explore how to type custom
            mathematical expressions, run automated step-by-step simulations, tune Table Size ($m$)
            and Bucket Capacity ($C$), profile algorithms in the Compare Arena, and present your project.
          </p>
        </div>

        {/* QUICK START CARDS */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: "15px",
            marginTop: "35px",
          }}
        >
          <QuickCard
            icon={<BookOpen size={22} />}
            number="01"
            title="Learn & Formulas"
            text="Read lessons with explicit mathematical equation cards for all 7 techniques."
          />

          <QuickCard
            icon={<Database size={22} />}
            number="02"
            title="Simulate & Auto-Play"
            text="Type custom hash formulas, set m and C, and watch automated step-by-step executions."
          />

          <QuickCard
            icon={<GitCompare size={22} />}
            number="03"
            title="Compare Arena"
            text="Inject uniform, clustered, or prime stride workloads simultaneously across all algorithms."
          />

          <QuickCard
            icon={<BarChart3 size={22} />}
            number="04"
            title="Analytics Charts"
            text="Compare collision distributions and load factors using interactive Recharts bar visuals."
          />
        </section>

        {/* HELP TOPICS ACCORDION */}
        <section
          style={{
            marginTop: "40px",
            padding: "24px",
            borderRadius: "16px",
            border: "1.5px solid var(--border-main)",
            background: "var(--bg-card)",
          }}
        >
          <h2>Help Topics & Guides</h2>

          <p
            style={{
              marginTop: "7px",
              color: "var(--text-secondary)",
            }}
          >
            Click any section below to expand its step-by-step instructions.
          </p>

          <div
            style={{
              display: "grid",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            {sections.map((section) => {
              const Icon = section.icon;
              const isOpen = openSection === section.id;

              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "15px",
                    width: "100%",
                    padding: "15px 17px",
                    borderRadius: "12px",
                    border: isOpen
                      ? "2px solid var(--accent-primary)"
                      : "1.5px solid var(--border-main)",
                    background: isOpen ? "rgba(99, 102, 241, 0.12)" : "var(--bg-card)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <Icon size={19} color={isOpen ? "var(--accent-primary)" : "var(--text-muted)"} />

                    <span
                      style={{
                        fontWeight: 750,
                        color: isOpen ? "var(--accent-primary)" : "var(--text-primary)",
                      }}
                    >
                      {section.title}
                    </span>
                  </span>

                  <ChevronDown
                    size={18}
                    color={isOpen ? "var(--accent-primary)" : "var(--text-muted)"}
                    style={{
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                    }}
                  />
                </button>
              );
            })}
          </div>
        </section>

        {/* EXPANDABLE CONTENT PANELS */}
        <div
          style={{
            marginTop: "25px",
          }}
        >
          {/* GETTING STARTED */}
          {openSection === "getting-started" && (
            <HelpPanel
              title="Getting Started with HashLab"
              subtitle="Get up and running with your first hashing simulation in under 60 seconds."
            >
              <Step
                number="1"
                title="Launch Simulator"
                text="Click 'Simulator' in the navigation bar to enter the live interactive laboratory."
              />
              <Step
                number="2"
                title="Choose an Algorithm"
                text="Select from Separate Chaining, Linear Probing, Quadratic Probing, Double Hashing, Rehashing, Extendible Hashing, or Linear Hashing."
              />
              <Step
                number="3"
                title="Customize Table Size (m) & Bucket Capacity (C)"
                text="Choose the table size m (e.g. 7 or 11) and bucket capacity C (e.g. 2 or 4) to suit your experiment."
              />
              <Step
                number="4"
                title="Type or Preview Custom Formulas"
                text="For Open Addressing algorithms, type your custom primary hash h₁(k) and secondary step h₂(k) directly."
              />
              <Step
                number="5"
                title="Insert Keys or Run Batch Auto-Play"
                text="Insert keys individually, or switch to 'Batch Auto-Play' to watch automated step-by-step playback of whole key sequences."
              />
              <Step
                number="6"
                title="Inspect Visual Buckets & Activity Log"
                text="Follow the probe calculations, step counts, collision statuses, and load factors updated in real time."
              />
            </HelpPanel>
          )}

          {/* SIMULATOR */}
          {openSection === "simulator" && (
            <HelpPanel
              title="Using the HashLab Simulator"
              subtitle="Deep dive into all simulator controls, visual buckets, and mathematical displays."
            >
              <InstructionCard
                title="Algorithm Selector"
                text="Switches between the 7 hashing implementations. Changing algorithms automatically displays the mathematical formula box tailored to that technique."
              />
              <InstructionCard
                title="Mathematical Expression Editors"
                text="Type any mathematical expression using key 'k' and table size 'm'. For Double Hashing, you have dedicated fields for primary h₁(k) and secondary step h₂(k) with live calculation previews."
              />
              <InstructionCard
                title="Interactive Table & Bucket Grid"
                text="Displays each bucket slot with live occupied counts, local depth (Extendible), level (Linear Hashing), and glowing chip tags for stored keys."
              />
              <InstructionCard
                title="Dual-Formula Activity Log Table"
                text="Every successful insertion is recorded with its key, initial hash slot h₁(k), secondary step h₂(k), total collision steps, and final resolved slot."
              />
              <InstructionCard
                title="Live Statistics Cards"
                text="Monitors Current Keys, Capacity, Load Factor (%), Total Collisions, and dynamic events (Directory Depth, Splits, Rehashes)."
              />
            </HelpPanel>
          )}

          {/* CUSTOM FORMULAS */}
          {openSection === "custom-formulas" && (
            <HelpPanel
              title="Custom Math Formulas & Expression Syntax"
              subtitle="How to type custom mathematical expressions using variables 'k' and 'm'."
            >
              <div
                style={{
                  padding: "18px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #0077b6, #072130)",
            color: "#f8faf9",
                  marginBottom: "20px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#48cae4", fontWeight: 700 }}>
                  <Code2 size={20} />
                  <span>SUPPORTED VARIABLES & OPERATORS:</span>
                </div>
                <div style={{ marginTop: "10px", lineHeight: 1.7, fontSize: "14px", fontFamily: "monospace" }}>
                  <div>• <strong>k</strong> : The inserted integer key (e.g. 42, 75, 108)</div>
                  <div>• <strong>m</strong> : The active Table Size (e.g. 7, 11, 13)</div>
                  <div>• <strong>%</strong> or <strong>mod</strong> : Modulo remainder operator</div>
                  <div>• <strong>+ , - , * , /</strong> : Standard arithmetic operations</div>
                  <div>• <strong>( ... )</strong> : Grouping parentheses for precedence</div>
                </div>
              </div>

              <InstructionCard
                title="Primary Hash Expression h₁(k)"
                text="Determines the initial bucket index. Example inputs: 'k % m', '(2*k + 3) % m', 'k % 7', '(k * 13) % m'. Evaluated safely in integer arithmetic."
              />

              <InstructionCard
                title="Secondary Step Size h₂(k) for Double Hashing"
                text="Specifies the stride distance between probes when a collision occurs. Example inputs: '5 - (k % 5)', '7 - (k % 7)', '1 + (k % (m - 1))'. The evaluator ensures step size is strictly positive."
              />

              <InstructionCard
                title="Quadratic Probing Polynomial (c₁ & c₂)"
                text="Controls the quadratic probe formula h(k, i) = [h₁(k) + c₁×i + c₂×i²] mod m. You can adjust linear constant c₁ (default 0) and quadratic constant c₂ (default 1) directly."
              />

              <InstructionCard
                title="Linear Probing Step Size"
                text="Configures the step stride for linear scans: h(k, i) = [h₁(k) + step × i] mod m. Default is 1 (sequential adjacent probing)."
              />

              <div
                style={{
                  marginTop: "15px",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  background: "#f8fafc",
                }}
              >
                <strong>💡 Mathematical Tip for Double Hashing:</strong>
                <p style={{ marginTop: "6px", fontSize: "14px", lineHeight: 1.6, opacity: 0.8 }}>
                  To ensure that the probe sequence visits all <em>m</em> buckets in the table without getting stuck in an infinite cycle,
                  always ensure that gcd(h₂(k), m) = 1. Choosing a prime table size (such as m = 7, 11, 13) and a secondary formula like R - (k mod R) where R &lt; m is a prime is the textbook best practice!
                </p>
              </div>
            </HelpPanel>
          )}

          {/* BATCH AUTO-PLAY */}
          {openSection === "batch-autoplay" && (
            <HelpPanel
              title="Batch Auto-Play & Stepper Runner"
              subtitle="Automate sequential simulations with play, pause, speed control, and step-forward inspection."
            >
              <InstructionCard
                title="1. Switch to 'Batch Auto-Play' Mode"
                text="In the Simulator control panel, click the 'Batch Auto-Play' tab next to 'Single Key'. This reveals the batch player controls."
              />

              <InstructionCard
                title="2. Enter Key Sequence or Select a Preset"
                text="Type a comma-separated list of keys (e.g. '12, 19, 26, 33, 40, 47') or click one of the quick preset buttons: 'Clustered mod 7', 'Uniform Spread', or 'Fibonacci Run'."
              />

              <InstructionCard
                title="3. Play / Pause Controls"
                text="Click '▶ Auto Play' to begin automatic sequential insertion. The player inserts one key per interval and pauses automatically when all keys are processed or table capacity is reached."
              />

              <InstructionCard
                title="4. Step Forward (⏭ Step Next)"
                text="Want to analyze a collision at your own pace? Click '⏭ Step Next' to execute exactly one insertion from the queue and observe the bucket transition."
              />

              <InstructionCard
                title="5. Adjustable Playback Speeds"
                text="Select between 0.5x (Slow, 1600ms per step), 1.0x (Normal, 800ms), or 2.0x (Fast, 350ms) for rapid large workload testing."
              />
            </HelpPanel>
          )}

          {/* TABLE TUNING */}
          {openSection === "table-tuning" && (
            <HelpPanel
              title="Table Size (m) & Bucket Capacity (C) Tuning"
              subtitle="Full user control over primary table sizing and slot capacity across all simulator modes."
            >
              <Step
                number="m"
                title="Table Size (m) Control"
                text="Select table sizes ranging from 2 up to 31 (e.g. 5, 7, 11, 13, 17). Sizing directly alters the modulo hashing domain and load factor thresholds."
              />

              <Step
                number="C"
                title="Bucket Capacity (C) Control"
                text="Controls how many keys can sit in a single bucket slot (ranging from 1 to 6). In Separate Chaining and dynamic algorithms, buckets hold up to C keys before overflow or splits occur."
              />

              <Step
                number="Dyn"
                title="Dynamic Hashing Initialization"
                text="For Extendible Hashing, you can configure Initial Global Depth (1, 2, or 3). For Linear Hashing, you can configure Initial Buckets (2, 4, 8) and Bucket Capacity."
              />

              <div
                style={{
                  marginTop: "18px",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  background: "#f8fafc",
                }}
              >
                <strong>Cross-Application Sizing:</strong>
                <p style={{ marginTop: "6px", fontSize: "14px", lineHeight: 1.6, opacity: 0.8 }}>
                  Table Size ($m$) and Bucket Capacity ($C$) controls are also available in the <strong>Compare Arena</strong> and <strong>Analytics</strong> pages, allowing you to test how algorithms perform at different capacities with identical workloads!
                </p>
              </div>
            </HelpPanel>
          )}

          {/* ALGORITHMS REFERENCE */}
          {openSection === "algorithms" && (
            <HelpPanel
              title="Hashing Algorithms Reference"
              subtitle="Comprehensive mathematical formulation and behavioral characteristics of all 7 techniques."
            >
              <div style={{ display: "grid", gap: "16px" }}>
                {algorithmData.map((algo) => (
                  <AlgorithmCard key={algo.name} {...algo} />
                ))}
              </div>
            </HelpPanel>
          )}

          {/* OPERATIONS */}
          {openSection === "operations" && (
            <HelpPanel
              title="Insert, Search & Delete Operations"
              subtitle="Step-by-step mechanics of the three primary hash index operations."
            >
              <OperationGuide
                icon={<ArrowRight size={20} color="#4f46e5" />}
                title="Insert Operation"
                text="Calculates primary hash h₁(k). If the target slot is vacant (or has available bucket capacity), the key is stored immediately. If occupied, the collision resolution sequence executes until an available slot or split condition is reached."
              />

              <OperationGuide
                icon={<Search size={20} color="#2563eb" />}
                title="Search Operation"
                text="Calculates h₁(k) and follows the exact same probe sequence used during insertion. The search succeeds (HIT) if key k is found, or terminates with MISS when an empty slot or end of chain is encountered."
              />

              <OperationGuide
                icon={<Trash2 size={20} color="#dc2626" />}
                title="Delete Operation"
                text="Finds the target key and removes it. In open-addressing implementations, slots are flagged or cleared to preserve subsequent probe continuity."
              />

              <OperationGuide
                icon={<RotateCcw size={20} color="#64748b" />}
                title="Reset Operation"
                text="Instantly clears the table structure, resets metrics, empties operation history, and returns all internal pointers to their initial state."
              />
            </HelpPanel>
          )}

          {/* METRICS */}
          {openSection === "metrics" && (
            <HelpPanel
              title="Understanding Performance Metrics"
              subtitle="How to interpret and analyze the metrics tracked by HashLab."
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "14px",
                }}
              >
                {metricData.map((metric) => (
                  <div
                    key={metric.name}
                    style={{
                      padding: "18px",
                      borderRadius: "14px",
                      border: "1px solid #e5e7eb",
                      background: "#ffffff",
                    }}
                  >
                    <strong style={{ color: "#0077b6" }}>{metric.name}</strong>
                    <p
                      style={{
                        marginTop: "8px",
                        lineHeight: 1.55,
                        fontSize: "14px",
                        opacity: 0.72,
                      }}
                    >
                      {metric.description}
                    </p>
                  </div>
                ))}
              </div>
            </HelpPanel>
          )}

          {/* COMPARE ARENA */}
          {openSection === "compare" && (
            <HelpPanel
              title="Compare Arena & Benchmark Workloads"
              subtitle="Evaluate collision resistance and storage efficiency under identical workload sequences."
            >
              <Step
                number="1"
                title="Configure Arena Table Parameters"
                text="Set your preferred Table Size (m) and Bucket Capacity (C) at the top of the Compare page."
              />
              <Step
                number="2"
                title="Select Workload Preset or Enter Custom Keys"
                text="Click 'Clustered Collisions', 'Uniform Distribution', or 'Prime Stride', or type your own comma-separated key string."
              />
              <Step
                number="3"
                title="Execute Multi-Algorithm Benchmark"
                text="Click '⚡ Run Live Arena Comparison' to inject the workload into all 7 algorithms in parallel."
              />
              <Step
                number="4"
                title="Inspect Winner Card & Collisions"
                text="The arena instantly highlights the 'Lowest Collisions Winner' and renders visual collision bars for side-by-side comparison."
              />
            </HelpPanel>
          )}

          {/* ANALYTICS */}
          {openSection === "analytics" && (
            <HelpPanel
              title="Analytics & Interactive Chart Profiler"
              subtitle="Visual bar charts and deep metric profiling powered by Recharts."
            >
              <InstructionCard
                title="Interactive Recharts Bar Charts"
                text="Visualizes Collisions Count and Load Factor (%) across all algorithms with hover tooltips and colored metric bars."
              />
              <InstructionCard
                title="Executive KPI Summaries"
                text="Highlights Total Algorithms Profiled, Benchmark Keys Count, Lowest Collisions Leader, and Average Table Load Factor."
              />
              <InstructionCard
                title="Dynamic Growth Breakdown Table"
                text="Inspects Extendible Hashing Directory Doublings, Linear Hashing Splits and Level, and Rehashing table expansion factors."
              />
            </HelpPanel>
          )}

          {/* LEARN PAGE */}
          {openSection === "learn" && (
            <HelpPanel
              title="Learn Page & Concept Animations"
              subtitle="13 structured interactive lessons with mathematical cards and animated players."
            >
              <Step
                number="01"
                title="Explore the 13 Lessons"
                text="Lessons cover everything from basic Hash Tables and Modulo Arithmetic to Double Hashing and Linear Hashing."
              />
              <Step
                number="02"
                title="Mathematical Formula Cards"
                text="Every lesson features a dedicated, high-contrast Formula Box showing explicit equations for index calculation, probe step, and modular constraints."
              />
              <Step
                number="03"
                title="Interactive Concept Animations"
                text="Use Play, Pause, Next Step, and Previous Step to watch animated key insertion flows."
              />
              <Step
                number="04"
                title="Direct Bridge to Simulator"
                text="Click 'Open in Simulator' from any lesson to immediately test that technique with live inputs."
              />
            </HelpPanel>
          )}

          {/* DARK MODE */}
          {openSection === "dark-mode" && (
            <HelpPanel
              title="Theme & Dark Mode"
              subtitle="High-contrast dark mode tailored for late-night laboratory analysis."
            >
              <InstructionCard
                title="Top Navbar Sun / Moon Toggle"
                text="Click the circular theme icon (☼ / ☾) on the top right of the navigation bar to toggle between Light Mode and Dark Mode at any time."
              />
              <InstructionCard
                title="Persistent Preference"
                text="Your chosen theme is automatically saved to browser localStorage, so HashLab stays in your preferred mode across all pages and sessions."
              />
              <InstructionCard
                title="System Preference Auto-Detection"
                text="When you visit HashLab for the first time, it automatically detects whether your operating system prefers dark mode."
              />
            </HelpPanel>
          )}

          {/* TROUBLESHOOTING */}
          {openSection === "troubleshooting" && (
            <HelpPanel
              title="Troubleshooting & FAQs"
              subtitle="Quick solutions to common operational questions."
            >
              <Trouble
                problem="How do I make custom mathematical formulas work?"
                solution="Use variable 'k' for key and 'm' for table size. For example: 'k % m' or '5 - (k % 5)'. The simulator automatically substitutes the current key and table size."
              />

              <Trouble
                problem="Why did Double Hashing report an infinite loop warning?"
                solution="If h₂(k) evaluates to 0 or shares a common factor with table size m, the probe sequence cannot visit all buckets. Ensure h₂(k) > 0 and gcd(h₂(k), m) = 1 (e.g. choose prime table size m)."
              />

              <Trouble
                problem="Batch Auto-Play stopped before processing all keys"
                solution="Open addressing tables cannot hold more keys than their total capacity (m). When an open addressing table becomes 100% full, the simulator safely halts to prevent infinite probe loops."
              />

              <Trouble
                problem="Can I change Table Size and Bucket Capacity simultaneously?"
                solution="Yes! In the Simulator, Compare Arena, and Analytics, use the respective Table Size (m) and Capacity (C) dropdowns or inputs. The data structures immediately reinitialize."
              />

              <Trouble
                problem="How do I verify the team name for project submission?"
                solution="Visit the 'Developed By' page via the top navigation bar. Team 'Overtime' and all developer credentials and responsibilities are prominently displayed."
              />
            </HelpPanel>
          )}

          {/* DEMO WORKFLOW */}
          {openSection === "demo" && (
            <HelpPanel
              title="Project Demo & Viva Workflow"
              subtitle="Recommended 9-step presentation structure for lab evaluations and viva voce."
            >
              <div style={{ display: "grid", gap: "15px" }}>
                <DemoStep
                  number="01"
                  title="Introduction & Team Overtime"
                  text="Introduce the HashLab project and Team Overtime, outlining the goal of bridging DBMS hashing index concepts with interactive visual simulations."
                />
                <DemoStep
                  number="02"
                  title="Learn Page & Mathematical Formulas"
                  text="Show the Learn page with its 13 lessons, explicit mathematical formula cards, and concept animation player."
                />
                <DemoStep
                  number="03"
                  title="Custom Math Formulas in Simulator"
                  text="Demonstrate typing a custom hash expression (e.g. 'k % m') and secondary formula for Double Hashing ('5 - (k % 5)') with live previews."
                />
                <DemoStep
                  number="04"
                  title="Batch Auto-Play Demonstration"
                  text="Load a clustered key sequence, start Auto-Play at 1.0x speed, and highlight the dual-formula activity log recording probe steps."
                />
                <DemoStep
                  number="05"
                  title="Collision Resolution Analysis"
                  text="Compare how Linear Probing, Quadratic Probing, and Double Hashing resolve collisions differently from Separate Chaining."
                />
                <DemoStep
                  number="06"
                  title="Dynamic Hashing (Splits & Doubling)"
                  text="Insert keys into Extendible Hashing to trigger a directory doubling, and into Linear Hashing to demonstrate the split pointer advancing."
                />
                <DemoStep
                  number="07"
                  title="Compare Arena Showdown"
                  text="Run a benchmark in the Compare Arena, showing how identical workloads produce distinct collision counts, highlighting the winner."
                />
                <DemoStep
                  number="08"
                  title="Analytics Profiler & Recharts"
                  text="Present the Analytics bar charts comparing collision frequency and load factors across all algorithms."
                />
                <DemoStep
                  number="09"
                  title="Dark Mode & Download"
                  text="Demonstrate the Dark Mode toggle and show the Download page for accessing project documentation and report."
                />
              </div>
            </HelpPanel>
          )}
        </div>

        {/* QUICK REFERENCE */}
        <section
          style={{
            marginTop: "35px",
            padding: "25px",
            borderRadius: "16px",
            border: "1px solid #e5e7eb",
            background: "#ffffff",
          }}
        >
          <h2>Quick Reference Guide</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
              gap: "12px",
              marginTop: "18px",
            }}
          >
            <ReferenceItem
              title="Learn"
              text="13 interactive lessons with explicit mathematical formula cards."
            />
            <ReferenceItem
              title="Simulator"
              text="User-typed formulas, table sizing, and batch auto-play runner."
            />
            <ReferenceItem
              title="Compare"
              text="Run benchmark workloads across all 7 algorithms simultaneously."
            />
            <ReferenceItem
              title="Analytics"
              text="Interactive Recharts bar graphs for collisions and load factors."
            />
            <ReferenceItem
              title="Developed By"
              text="Team Overtime credits, project architecture, and system specs."
            />
            <ReferenceItem
              title="Dark Mode"
              text="High-contrast dark theme toggle with persistent storage."
            />
          </div>
        </section>

        {/* FOOTER */}
        <div
          style={{
            textAlign: "center",
            marginTop: "35px",
            fontSize: "13px",
            opacity: 0.55,
          }}
        >
          HashLab • Developed by Team Overtime • Interactive Hash Index Simulation & Performance Laboratory
        </div>
      </div>
    </main>
  );
}

/* HELPER SUBCOMPONENTS */

function QuickCard({ icon, number, title, text }) {
  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "15px",
        border: "1.5px solid var(--border-main)",
        background: "var(--bg-card)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ color: "var(--accent-primary)" }}>{icon}</span>
        <small style={{ fontWeight: 800, color: "var(--text-muted)" }}>{number}</small>
      </div>

      <h3 style={{ marginTop: "16px" }}>{title}</h3>

      <p
        style={{
          marginTop: "7px",
          fontSize: "14px",
          lineHeight: 1.55,
          color: "var(--text-secondary)",
        }}
      >
        {text}
      </p>
    </div>
  );
}

function HelpPanel({ title, subtitle, children }) {
  return (
    <section
      style={{
        padding: "28px",
        borderRadius: "16px",
        border: "1.5px solid var(--border-main)",
        background: "var(--bg-card)",
      }}
    >
      <h2>{title}</h2>
      <p style={{ marginTop: "7px", color: "var(--text-secondary)" }}>{subtitle}</p>

      <div style={{ marginTop: "25px" }}>{children}</div>
    </section>
  );
}

function Step({ number, title, text }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "15px",
        padding: "16px 0",
        borderBottom: "1px solid var(--border-main)",
      }}
    >
      <div
        style={{
          minWidth: "38px",
          height: "38px",
          borderRadius: "50%",
          background: "rgba(99, 102, 241, 0.12)",
          color: "var(--accent-primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800,
          fontSize: "13px",
        }}
      >
        {number}
      </div>

      <div>
        <strong>{title}</strong>
        <p
          style={{
            marginTop: "5px",
            lineHeight: 1.6,
            color: "var(--text-secondary)",
            fontSize: "14px",
          }}
        >
          {text}
        </p>
      </div>
    </div>
  );
}

function InstructionCard({ title, text }) {
  return (
    <div
      style={{
        padding: "18px",
        borderRadius: "13px",
        border: "1.5px solid var(--border-main)",
        background: "var(--bg-card)",
        marginBottom: "12px",
      }}
    >
      <strong style={{ color: "var(--accent-primary)" }}>{title}</strong>
      <p
        style={{
          marginTop: "7px",
          lineHeight: 1.6,
          color: "var(--text-secondary)",
          fontSize: "14px",
        }}
      >
        {text}
      </p>
    </div>
  );
}

function AlgorithmCard({ name, type, description, formula, example }) {
  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "14px",
        border: "1.5px solid var(--border-main)",
        background: "var(--bg-card)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "10px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <h3>{name}</h3>
        <span
          style={{
            padding: "5px 10px",
            borderRadius: "999px",
            background: "rgba(99, 102, 241, 0.12)",
            color: "var(--accent-primary)",
            fontSize: "11px",
            fontWeight: 750,
          }}
        >
          {type}
        </span>
      </div>

      <p
        style={{
          marginTop: "9px",
          lineHeight: 1.6,
          color: "var(--text-secondary)",
          fontSize: "14px",
        }}
      >
        {description}
      </p>

      {formula && (
        <div
          style={{
            marginTop: "12px",
            padding: "10px 14px",
            borderRadius: "8px",
            background: "linear-gradient(135deg, #0077b6, #072130)",
                      color: "#48cae4",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "13px",
            fontWeight: 700,
          }}
        >
          📐 Formula: {formula}
        </div>
      )}

      <div
        style={{
          marginTop: "10px",
          padding: "12px",
          borderRadius: "10px",
          background: "var(--bg-card-muted)",
          fontSize: "13px",
          lineHeight: 1.55,
          color: "var(--text-secondary)",
        }}
      >
        <strong>Example: </strong>
        {example}
      </div>
    </div>
  );
}

function OperationGuide({ icon, title, text }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "15px",
        padding: "18px",
        borderRadius: "13px",
        border: "1.5px solid var(--border-main)",
        background: "var(--bg-card)",
        marginBottom: "12px",
      }}
    >
      <div style={{ marginTop: "2px" }}>{icon}</div>

      <div>
        <h3>{title}</h3>
        <p
          style={{
            marginTop: "6px",
            lineHeight: 1.6,
            color: "var(--text-secondary)",
            fontSize: "14px",
          }}
        >
          {text}
        </p>
      </div>
    </div>
  );
}

function Trouble({ problem, solution }) {
  return (
    <div
      style={{
        padding: "18px",
        borderRadius: "13px",
        border: "1.5px solid var(--border-main)",
        background: "var(--bg-card)",
        marginBottom: "12px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "9px",
        }}
      >
        <AlertCircle size={18} color="var(--accent-danger)" />
        <strong>{problem}</strong>
      </div>

      <p
        style={{
          marginTop: "8px",
          lineHeight: 1.6,
          color: "var(--text-secondary)",
          fontSize: "14px",
        }}
      >
        {solution}
      </p>
    </div>
  );
}

function DemoStep({ number, title, text }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "55px 1fr",
        gap: "15px",
        alignItems: "start",
        padding: "17px",
        borderRadius: "13px",
        border: "1.5px solid var(--border-main)",
        background: "var(--bg-card)",
      }}
    >
      <div
        style={{
          fontWeight: 900,
          fontSize: "14px",
          color: "var(--accent-primary)",
          background: "rgba(99, 102, 241, 0.12)",
          padding: "6px 10px",
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        {number}
      </div>

      <div>
        <strong>{title}</strong>
        <p
          style={{
            marginTop: "6px",
            lineHeight: 1.6,
            color: "var(--text-secondary)",
            fontSize: "14px",
          }}
        >
          {text}
        </p>
      </div>
    </div>
  );
}

function ReferenceItem({ title, text }) {
  return (
    <div
      style={{
        padding: "15px",
        borderRadius: "11px",
        border: "1.5px solid var(--border-main)",
        background: "var(--bg-card)",
      }}
    >
      <strong style={{ color: "var(--accent-primary)" }}>{title}</strong>
      <p
        style={{
          marginTop: "5px",
          fontSize: "13px",
          color: "var(--text-secondary)",
        }}
      >
        {text}
      </p>
    </div>
  );
}

export default Help;
