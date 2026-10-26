import React from "react";
import {
  Users,
  GraduationCap,
  Code2,
  Database,
  BookOpen,
  UserRound,
  Sparkles,
} from "lucide-react";

const teamMembers = [
  {
    name: "Srimithra.D.V",
    registerNumber: "25BCE5198",
    role: "Student / Developer",
    photo: "/team_member_01.png",
    objectPosition: "center 20%",
  },
  {
    name: "Katakam Chakrrithaa",
    registerNumber: "25BCE5113",
    role: "Student / Developer",
    photo: "/team_member_02.jpg",
    objectPosition: "center 22%",
    transform: "scale(1.08)",
  },
];

function DevelopedBy() {
  return (
    <main className="placeholder-page">
      <div
        className="placeholder-card"
        style={{
          maxWidth: "1100px",
          width: "calc(100% - 40px)",
        }}
      >
        {/* ================= HEADER ================= */}

        <div
          style={{
            textAlign: "center",
            maxWidth: "780px",
            margin: "0 auto",
          }}
        >
          <span className="section-label">
            HASHLAB • PROJECT TEAM
          </span>

          <h1 style={{ marginTop: "10px" }}>
            Developed By
          </h1>

          {/* TEAM OVERTIME BADGE */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "14px",
              padding: "8px 22px",
              borderRadius: "999px",
              background: "linear-gradient(135deg, #0077b6, #00b4d8, #48cae4)",
              color: "#ffffff",
              fontWeight: 800,
              fontSize: "15px",
              letterSpacing: "0.06em",
              boxShadow: "0 6px 20px rgba(0, 119, 182, 0.35)",
              textTransform: "uppercase",
            }}
          >
            <Sparkles size={16} />
            Team Overtime
          </div>

          <p
            style={{
              marginTop: "14px",
              lineHeight: 1.7,
              opacity: 0.72,
            }}
          >
            HashLab — Interactive Hash Index Simulation &
            Performance Laboratory
          </p>
        </div>

        {/* ================= PROJECT INFO ================= */}

        <section
          style={{
            marginTop: "40px",
            padding: "25px",
            borderRadius: "18px",
            border: "1.5px solid var(--border-main)",
            background: "var(--bg-card)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <Database size={23} />

            <h2 style={{ margin: 0 }}>
              Project Information
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "14px",
              marginTop: "22px",
            }}
          >
            <InfoCard
              icon={<Users size={20} />}
              label="Team Name"
              value="Overtime"
            />

            <InfoCard
              icon={<BookOpen size={20} />}
              label="Project Title"
              value="Hash Index Simulator"
            />

            <InfoCard
              icon={<Code2 size={20} />}
              label="Domain"
              value="DBMS & DSA"
            />

            <InfoCard
              icon={<Database size={20} />}
              label="Application"
              value="Interactive Web Simulator"
            />

            <InfoCard
              icon={<Users size={20} />}
              label="Project Type"
              value="Academic Project"
            />
          </div>
        </section>

        {/* ================= TEAM ================= */}

        <section
          style={{
            marginTop: "30px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <Users size={23} />

            <h2 style={{ margin: 0 }}>
              Team Overtime — Student Developers
            </h2>
          </div>

          <p
            style={{
              marginTop: "8px",
              opacity: 0.68,
            }}
          >
            Project development team members
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            {teamMembers.map((member, index) => (
              <TeamMember
                key={member.registerNumber}
                member={member}
                index={index}
              />
            ))}
          </div>
        </section>

        {/* ================= GUIDE ================= */}

        <section
          style={{
            marginTop: "35px",
            padding: "30px",
            borderRadius: "18px",
            border: "1.5px solid var(--border-main)",
            background: "var(--bg-card)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "110px",
              height: "110px",
              borderRadius: "50%",
              margin: "0 auto",
              overflow: "hidden",
              border: "3.5px solid #2563eb",
              boxShadow: "0 6px 24px rgba(37, 99, 235, 0.28)",
              background: "var(--bg-card-muted)",
            }}
          >
            <img
              src="/project_guide.png"
              alt="Dr. Swaminathan A - Project Guide"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center 18%",
                display: "block",
              }}
            />
          </div>

          <span
            style={{
              display: "block",
              marginTop: "18px",
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "0.08em",
              opacity: 0.55,
            }}
          >
            PROJECT GUIDE
          </span>

          <h2 style={{ marginTop: "7px" }}>
            Dr. Swaminathan A
          </h2>

          <p
            style={{
              marginTop: "7px",
              opacity: 0.7,
            }}
          >
            Assistant Professor
          </p>
        </section>

        {/* ================= CONTRIBUTION ================= */}

        <section
          style={{
            marginTop: "30px",
            padding: "25px",
            borderRadius: "18px",
            border: "1.5px solid var(--border-main)",
            background: "var(--bg-card)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <Code2 size={22} />

            <h2 style={{ margin: 0 }}>
              Project Focus
            </h2>
          </div>

          <p
            style={{
              marginTop: "14px",
              lineHeight: 1.75,
              opacity: 0.72,
            }}
          >
            HashLab is designed to provide an interactive
            way to understand hash indexing and hashing
            algorithms. The simulator connects theoretical
            DBMS and Data Structures concepts with
            visual experimentation, operation tracking,
            collision analysis and dynamic hash-structure
            growth.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(210px, 1fr))",
              gap: "12px",
              marginTop: "20px",
            }}
          >
            <FocusItem text="Hash Tables" />
            <FocusItem text="Collision Resolution" />
            <FocusItem text="Static Hashing" />
            <FocusItem text="Dynamic Hashing" />
            <FocusItem text="Performance Metrics" />
            <FocusItem text="Interactive Visualization" />
          </div>
        </section>

        {/* ================= FOOTER ================= */}

        <div
          style={{
            textAlign: "center",
            marginTop: "30px",
            fontSize: "12px",
            opacity: 0.5,
          }}
        >
          HashLab • Hash Index Simulator • Team Overtime
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   TEAM MEMBER
========================================================= */

function TeamMember({ member, index }) {
  return (
    <div
      style={{
        padding: "25px",
        borderRadius: "18px",
        border: "1.5px solid var(--border-main)",
        background: "var(--bg-card)",
        textAlign: "center",
      }}
    >
      {member.photo ? (
        <div
          style={{
            width: "105px",
            height: "105px",
            borderRadius: "50%",
            margin: "0 auto",
            overflow: "hidden",
            border: "3.5px solid #2563eb",
            boxShadow: "0 6px 22px rgba(37, 99, 235, 0.28)",
            background: "var(--bg-card-muted)",
          }}
        >
          <img
            src={member.photo}
            alt={member.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: member.objectPosition || "center 20%",
              transform: member.transform || "none",
              display: "block",
            }}
          />
        </div>
      ) : (
        <div
          style={{
            width: "85px",
            height: "85px",
            borderRadius: "50%",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid currentColor",
          }}
        >
          <UserRound size={34} />
        </div>
      )}

      <h2
        style={{
          marginTop: "16px",
          fontSize: "21px",
        }}
      >
        {member.name}
      </h2>

      <div
        style={{
          marginTop: "12px",
          padding: "10px",
          borderRadius: "10px",
          background: "var(--bg-card-muted)",
        }}
      >
        <small
          style={{
            display: "block",
            opacity: 0.55,
            fontWeight: 700,
          }}
        >
          REGISTRATION NUMBER
        </small>

        <strong
          style={{
            display: "block",
            marginTop: "4px",
            fontSize: "16px",
          }}
        >
          {member.registerNumber}
        </strong>
      </div>

      <p
        style={{
          marginTop: "13px",
          fontSize: "13px",
          opacity: 0.65,
        }}
      >
        {member.role}
      </p>
    </div>
  );
}

/* =========================================================
   INFO CARD
========================================================= */

function InfoCard({
  icon,
  label,
  value,
}) {
  return (
    <div
      style={{
        padding: "17px",
        borderRadius: "13px",
        border: "1.5px solid var(--border-main)",
        background: "var(--bg-card)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "9px",
        }}
      >
        {icon}

        <span
          style={{
            fontSize: "12px",
            fontWeight: 800,
            opacity: 0.55,
          }}
        >
          {label}
        </span>
      </div>

      <strong
        style={{
          display: "block",
          marginTop: "10px",
        }}
      >
        {value}
      </strong>
    </div>
  );
}

/* =========================================================
   FOCUS ITEM
========================================================= */

function FocusItem({ text }) {
  return (
    <div
      style={{
        padding: "13px 15px",
        borderRadius: "11px",
        border: "1.5px solid var(--border-main)",
        background: "var(--bg-card)",
        fontWeight: 700,
        fontSize: "14px",
      }}
    >
      ✓ {text}
    </div>
  );
}

export default DevelopedBy;
