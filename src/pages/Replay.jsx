import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ROUND_DELAY = 2000;

function RoundCard({ roundData }) {

  if (roundData.type === "INTRO") {
    return (
      <div className="round-card round-card-intro">
        {roundData.events.map((ev, i) => (
          <div key={i} style={{
            fontFamily: "Bebas Neue, sans-serif",
            fontSize: i === 0 ? 20 : 15,
            letterSpacing: i === 0 ? 3 : 1,
            color: i === 0 ? "var(--accent, #90d870)" : "rgba(200,190,160,0.55)",
            marginBottom: 5,
            textAlign: "center"
          }}>
            {ev.message}
          </div>
        ))}
      </div>
    );
  }

  if (roundData.type === "MATCH_END") {
    return (
      <div className="round-card round-card-end">
        <div style={{
          fontFamily: "Bebas Neue, sans-serif",
          fontSize: 24,
          letterSpacing: 5,
          textAlign: "center",
          color: "rgba(230,200,180,0.9)",
          marginBottom: 6
        }}>
          MATCH COMPLETE
        </div>
        {roundData.winner && (
          <div style={{
            textAlign: "center",
            fontSize: 14,
            color: "rgba(180,160,140,0.5)",
            fontStyle: "italic"
          }}>
            {roundData.winner} survived.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="round-card">
      <div className="round-header">
        <span className="round-number">— ROUND {roundData.round} —</span>
        <span className="round-count">{roundData.aliveCount} remain</span>
      </div>

      {/* 1st person narration — bold, dimmed */}
      {roundData.narration && (
        <div className="round-narration" style={{ fontWeight: 600 }}>
          {roundData.narration}
        </div>
      )}

      {/* Events */}
      <div className="feed-sequence">
        {roundData.events?.map((ev, i) => {

          if (ev.type === "WORLD_EVENT") {
            return (
              <div key={i} className="feed-world">
                <span style={{ flex: 1 }}>{ev.message}</span>
              </div>
            );
          }

          if (ev.type === "SURVIVAL") {
            const parts = ev.message.split(" ");
            const name = parts[0];
            const rest = parts.slice(1).join(" ");
            return (
              <div key={i} className="feed-survival">
                <span className="feed-text">
                  <span className="ns" style={{ color: "#90d870", fontWeight: 700 }}>{name}</span>
                  {" "}{rest}
                </span>
              </div>
            );
          }

          if (ev.type === "FUNNY_DEATH") {
            let html = ev.message;
            if (ev.victim) {
              html = html.replace(
                new RegExp(`\\b${ev.victim}\\b`, "g"),
                `<span style="text-decoration:line-through;text-decoration-color:rgba(220,80,60,0.5);color:rgba(255,255,255,0.85);font-weight:700">${ev.victim}</span>`
              );
            }
            return (
              <div key={i} className="feed-funny">
                <span className="feed-text" style={{ color: "rgba(255,255,255,0.88)" }}
                  dangerouslySetInnerHTML={{ __html: html }} />
              </div>
            );
          }

          if (ev.type === "ELIMINATION") {
            let html = ev.message;
            if (ev.killer) {
              html = html.replace(
                new RegExp(`\\b${ev.killer}\\b`, "g"),
                `<span style="color:#e07060;font-weight:700">${ev.killer}</span>`
              );
            }
            if (ev.victim) {
              html = html.replace(
                new RegExp(`\\b${ev.victim}\\b`, "g"),
                `<span style="text-decoration:line-through;text-decoration-color:rgba(220,80,60,0.5);color:rgba(255,255,255,0.85);font-weight:700">${ev.victim}</span>`
              );
            }
            return (
              <div key={i} className="feed-kill">
                <span className="feed-text" style={{ color: "rgba(255,255,255,0.88)" }}
                  dangerouslySetInnerHTML={{ __html: html }} />
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* Eliminated roster */}
      {roundData.eliminated?.length > 0 && (
        <div className="elim-footer">
          {roundData.eliminated.map((name, i) => (
            <span key={i} className="elim-name">{name}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Replay() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [match, setMatch] = useState(null);
  const [visibleRounds, setVisibleRounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [visibleRounds]);

  useEffect(() => {
    const history = JSON.parse(
      localStorage.getItem("outlast_history") || "[]"
    );

    const selected = history[parseInt(id)];

    if (!selected) {
      navigate("/history");
      return;
    }

    setMatch(selected);
    setLoading(false);

    const replay = async () => {
      const rounds = selected.storyRounds || [];

      for (let i = 0; i < rounds.length; i++) {
        setVisibleRounds(prev => [...prev, rounds[i]]);

        if (rounds[i].type === "MATCH_END") break;

        await new Promise(r => setTimeout(r, ROUND_DELAY));
      }
    };

    replay();
  }, []);

  if (loading || !match) {
    return (
      <div className="page">
        <div className="card" style={{ textAlign: "center", padding: "32px 16px" }}>
          <div style={{ color: "var(--text3)" }}>Loading replay...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">

      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <div style={{
          fontFamily: "Bebas Neue, sans-serif",
          fontSize: 14,
          letterSpacing: 3,
          color: "var(--text3)",
          marginBottom: 6
        }}>
          REPLAY
        </div>
        <div style={{
          fontFamily: "Bebas Neue, sans-serif",
          fontSize: 28,
          letterSpacing: 3,
          marginBottom: 10
        }}>
          {match.theme}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span className="badge badge-blue">📍 {match.location}</span>
          <span className="badge badge-red">{match.danger}</span>
          {match.winner && (
            <span className="badge badge-gold">🏆 {match.winner}</span>
          )}
        </div>
      </div>

      {/* Round cards */}
      {visibleRounds.map((round, i) => (
        <RoundCard key={i} roundData={round} />
      ))}

      <div ref={bottomRef} />

      <button
        className="btn-secondary"
        style={{ marginTop: 16 }}
        onClick={() => navigate("/history")}
      >
        BACK TO HISTORY
      </button>

    </div>
  );
}
