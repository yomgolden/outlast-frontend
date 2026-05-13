import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getFeaturedEvents, createEvent, getLeaderboard } from "../api/api";
import { useUser } from "../context/UserContext";
import { useMatch } from "../context/MatchContext";
import Loader from "../components/Loader";

const DANGER_COLORS = {
  EXTREME: { badge: "badge-red", glow: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.25)" },
  HIGH: { badge: "badge-orange", glow: "rgba(249,115,22,0.10)", border: "rgba(249,115,22,0.25)" },
  MEDIUM: { badge: "badge-gold", glow: "rgba(234,179,8,0.08)", border: "rgba(234,179,8,0.25)" }
};

const EVENT_ICONS = {
  mushin_nightmare: "🌆",
  blackout_yaba: "⚡",
  ajegunle_warzone: "🔴"
};

export default function Home() {
  const navigate = useNavigate();
  const { user, loading, error } = useUser();
  const { match, setMatch } = useMatch();

  const [featured, setFeatured] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [joining, setJoining] = useState("");
  const [joinError, setJoinError] = useState("");

  const autoSlideRef = useRef(null);
  const touchStartX = useRef(0);

  // Return to active match if exists
  useEffect(() => {
    if (match?.eventId) {
      navigate("/match", { replace: true });
    }
  }, []);

  // Load data
  useEffect(() => {
    const load = async () => {
      try {
        const [events, board] = await Promise.all([
          getFeaturedEvents(),
          getLeaderboard()
        ]);
        setFeatured(events);
        setLeaderboard(board.slice(0, 5));
      } catch (err) {
        console.error(err);
      }
    };

    load();
    const poll = setInterval(load, 5000);
    return () => clearInterval(poll);
  }, []);

  // Auto slide
  useEffect(() => {
    if (featured.length < 2) return;
    autoSlideRef.current = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % featured.length);
    }, 5000);
    return () => clearInterval(autoSlideRef.current);
  }, [featured.length]);

  const handlePlay = async (eventId) => {
    try {
      setJoining(eventId);
      setJoinError("");
      const data = await createEvent(user._id, user.username, eventId);
      setMatch(data);
      navigate("/queue", { replace: true });
    } catch (err) {
      setJoinError(err.message || "Failed to join");
    } finally {
      setJoining("");
    }
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      clearInterval(autoSlideRef.current);
      if (diff > 0) setActiveSlide(prev => (prev + 1) % featured.length);
      else setActiveSlide(prev => (prev - 1 + featured.length) % featured.length);
    }
  };

  if (loading) return <Loader />;

  const nextLevelXP = (user?.level || 1) * (user?.level || 1) * 50;
  const xpProgress = Math.min(100, Math.floor(((user?.xp || 0) / nextLevelXP) * 100));
  const reputation = (user?.wins || 0) >= 10 ? "FEARED" : (user?.wins || 0) >= 3 ? "KNOWN" : "UNKNOWN";
  const currentEvent = featured[activeSlide];
  const dangerStyle = currentEvent ? DANGER_COLORS[currentEvent.danger] : DANGER_COLORS.HIGH;

  return (
    <div className="page">

      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <div className="game-title">OUTLAST</div>
          <div style={{ color: "var(--text3)", fontSize: 12, marginTop: 2 }}>
            Nigerian survival simulator
          </div>
        </div>
        <span className="badge badge-gold">🪙 {user?.gold?.toLocaleString()}</span>
      </div>

      {error && <div className="error-card">{error}</div>}
      {joinError && <div className="error-card">{joinError}</div>}

      {/* FEATURED CAROUSEL */}
      {featured.length > 0 && currentEvent && (
        <div style={{ marginBottom: 20 }}>
          <div className="section-title">Featured Districts</div>

          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            style={{
              background: `linear-gradient(135deg, ${dangerStyle.glow}, var(--surface))`,
              border: `1px solid ${dangerStyle.border}`,
              borderRadius: 20,
              padding: 20,
              position: "relative",
              overflow: "hidden",
              minHeight: 210,
              transition: "all 0.4s ease"
            }}
          >
            {/* BG ICON */}
            <div style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 90,
              opacity: 0.07,
              pointerEvents: "none",
              userSelect: "none"
            }}>
              {EVENT_ICONS[currentEvent.id]}
            </div>

            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                <span className={`badge ${dangerStyle.badge}`}>⚠ {currentEvent.danger}</span>
                <span className="badge badge-blue">📍 {currentEvent.location}</span>
                {currentEvent.activePlayers > 0 && (
                  <span className="badge badge-green">🔴 {currentEvent.activePlayers} inside</span>
                )}
              </div>

              <div style={{
                fontFamily: "Bebas Neue, sans-serif",
                fontSize: 30,
                letterSpacing: 2,
                lineHeight: 1.1,
                marginBottom: 6
              }}>
                {currentEvent.name}
              </div>

              <div style={{
                color: "var(--text2)",
                fontSize: 13,
                fontStyle: "italic",
                marginBottom: 16,
                lineHeight: 1.5
              }}>
                "{currentEvent.tagline}"
              </div>

              {currentEvent.bestLobby ? (
                <div style={{
                  background: "rgba(0,0,0,0.25)",
                  borderRadius: 10,
                  padding: "8px 12px",
                  marginBottom: 12,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <span style={{ fontSize: 12, color: "var(--text2)" }}>
                    Active lobby · {currentEvent.bestLobby.playerCount}/20 survivors
                  </span>
                  <span className="badge badge-gold">{currentEvent.bestLobby.countdown}s</span>
                </div>
              ) : (
                <div style={{
                  background: "rgba(0,0,0,0.25)",
                  borderRadius: 10,
                  padding: "8px 12px",
                  marginBottom: 12
                }}>
                  <span style={{ fontSize: 12, color: "var(--text3)" }}>
                    No active lobby — you'll create one
                  </span>
                </div>
              )}

              <button
                className="btn-primary"
                onClick={() => handlePlay(currentEvent.id)}
                disabled={!!joining}
                style={{ fontSize: 14, padding: "14px 16px" }}
              >
                {joining === currentEvent.id
                  ? "ENTERING..."
                  : currentEvent.bestLobby
                    ? `⚡ JOIN (${currentEvent.bestLobby.playerCount}/20)`
                    : "⚡ START EVENT"}
              </button>
            </div>
          </div>

          {/* DOTS */}
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 10 }}>
            {featured.map((_, i) => (
              <div
                key={i}
                onClick={() => {
                  clearInterval(autoSlideRef.current);
                  setActiveSlide(i);
                }}
                style={{
                  width: i === activeSlide ? 20 : 6,
                  height: 6,
                  borderRadius: 3,
                  background: i === activeSlide ? "var(--red)" : "var(--border2)",
                  transition: "all 0.3s ease",
                  cursor: "pointer"
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* PLAYER CARD */}
      <div className="section-title">Your Profile</div>
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          <div className="avatar avatar-lg">
            {(user?.username || "?")[0].toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 17 }}>@{user?.username}</div>
            <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
              <span className="badge badge-purple">LVL {user?.level}</span>
              <span className="badge badge-orange">{reputation}</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "var(--green)" }}>
              {user?.wins || 0}
            </div>
            <div style={{ fontSize: 10, color: "var(--text3)", textTransform: "uppercase" }}>Wins</div>
          </div>
        </div>

        <div className="xp-bar-track">
          <div className="xp-bar-fill" style={{ width: `${xpProgress}%` }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text3)", marginTop: 4 }}>
          <span>{user?.xp} XP</span>
          <span>Next level: {nextLevelXP} XP</span>
        </div>
      </div>

      {/* TOP SURVIVORS */}
      {leaderboard.length > 0 && (
        <div>
          <div className="section-title">Top Survivors</div>
          <div className="card">
            {leaderboard.map((player, i) => (
              <div key={i} className="stat-row">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{
                    fontFamily: "Bebas Neue, sans-serif",
                    fontSize: 18,
                    minWidth: 28
                  }} className={i === 0 ? "rank-1" : i === 1 ? "rank-2" : i === 2 ? "rank-3" : ""}>
                    {i < 3 ? ["🥇","🥈","🥉"][i] : `#${i+1}`}
                  </span>
                  <span style={{ fontWeight: 600 }}>@{player.username}</span>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <span className="badge badge-gold">{player.wins}W</span>
                  <span className="badge badge-purple">L{player.level}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

