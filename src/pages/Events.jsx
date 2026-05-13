import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFeaturedEvents, createEvent } from "../api/api";
import { useUser } from "../context/UserContext";
import { useMatch } from "../context/MatchContext";

const DANGER_COLORS = {
  EXTREME: { badge: "badge-red", left: "var(--red)" },
  HIGH: { badge: "badge-orange", left: "var(--orange)" },
  MEDIUM: { badge: "badge-gold", left: "var(--gold)" }
};

const EVENT_ICONS = {
  mushin_nightmare: "🌆",
  blackout_yaba: "⚡",
  ajegunle_warzone: "🔴"
};

export default function Events() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { setMatch } = useMatch();
  const [featured, setFeatured] = useState([]);
  const [joining, setJoining] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = () => getFeaturedEvents().then(setFeatured).catch(() => {});
    load();
    const poll = setInterval(load, 3000);
    return () => clearInterval(poll);
  }, []);

  const handlePlay = async (eventId) => {
    try {
      setJoining(eventId);
      setError("");
      const data = await createEvent(user._id, user.username, eventId);
      setMatch(data);
      navigate("/queue", { replace: true });
    } catch (err) {
      setError(err.message || "Failed to join");
    } finally {
      setJoining("");
    }
  };

  return (
    <div className="page">
      <div className="page-title">DISTRICTS</div>

      {error && <div className="error-card">{error}</div>}

      <div className="section-title">Choose Your Arena</div>

      {featured.length === 0 && (
        <div className="card" style={{ textAlign: "center", padding: "32px 16px" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🌆</div>
          <div style={{ color: "var(--text2)" }}>Loading districts...</div>
        </div>
      )}

      {featured.map((event, i) => {
        const colors = DANGER_COLORS[event.danger] || DANGER_COLORS.HIGH;
        return (
          <div
            key={i}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderLeft: `3px solid ${colors.left}`,
              borderRadius: 16,
              padding: 18,
              marginBottom: 14,
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* BG ICON */}
            <div style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 70,
              opacity: 0.05,
              pointerEvents: "none"
            }}>
              {EVENT_ICONS[event.id]}
            </div>

            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{
                  fontFamily: "Bebas Neue, sans-serif",
                  fontSize: 24,
                  letterSpacing: 2,
                  lineHeight: 1
                }}>
                  {event.name}
                </div>
                <span className={`badge ${colors.badge}`}>{event.danger}</span>
              </div>

              <div style={{ color: "var(--text3)", fontSize: 12, fontStyle: "italic", marginBottom: 12 }}>
                "{event.tagline}"
              </div>

              <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
                <span className="badge badge-blue">📍 {event.location}</span>
                {event.activePlayers > 0
                  ? <span className="badge badge-green">🔴 {event.activePlayers} inside</span>
                  : <span style={{ fontSize: 11, color: "var(--text3)" }}>No active lobby</span>
                }
                {event.bestLobby && (
                  <span className="badge badge-gold">⏱ {event.bestLobby.countdown}s</span>
                )}
              </div>

              <button
                className="btn-primary"
                onClick={() => handlePlay(event.id)}
                disabled={!!joining}
                style={{ fontSize: 13, padding: "13px 16px" }}
              >
                {joining === event.id
                  ? "ENTERING..."
                  : event.bestLobby
                    ? `⚡ JOIN LOBBY (${event.bestLobby.playerCount}/20)`
                    : "⚡ PLAY"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
