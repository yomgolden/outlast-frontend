import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getEventFeed } from "../api/api";
import { useMatch } from "../context/MatchContext";

const ROUND_DELAY = 3000;

const THEMES = {
  mushin_nightmare: {
    css: "theme-mushin",
    bg: "radial-gradient(ellipse 60% 40% at 30% 0%, rgba(255,140,20,0.06) 0%, transparent 60%)"
  },
  blackout_yaba: {
    css: "theme-yaba",
    bg: "radial-gradient(ellipse 60% 50% at 50% 20%, rgba(40,80,200,0.05) 0%, transparent 70%)"
  },
  ajegunle_warzone: {
    css: "theme-ajegunle",
    bg: "radial-gradient(ellipse 80% 30% at 50% 100%, rgba(0,30,5,0.8) 0%, transparent 70%)"
  },
  evil_forest: {
    css: "theme-forest",
    bg: "radial-gradient(ellipse 100% 50% at 50% 100%, rgba(10,30,5,0.9) 0%, transparent 70%)"
  }
};

function RoundCard({ roundData, eventType }) {
  const theme = THEMES[eventType] || THEMES.evil_forest;

  if (roundData.type === "INTRO") {
    return (
      <div className="round-card round-card-intro">
        {roundData.events.map((ev, i) => (
          <div key={i} style={{
            fontFamily: "Bebas Neue, sans-serif",
            fontSize: i === 0 ? 22 : 16,
            letterSpacing: i === 0 ? 3 : 1,
            color: i === 0 ? "var(--accent, #90d870)" : "rgba(200,190,160,0.6)",
            marginBottom: 6,
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
        <div style={{ fontSize: 36, textAlign: "center", marginBottom: 10 }}>☠</div>
        <div style={{
          fontFamily: "Bebas Neue, sans-serif",
          fontSize: 26,
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
      {/* Round header */}
      <div className="round-header">
        <span className="round-number">— ROUND {roundData.round} —</span>
        <span className="round-count">{roundData.aliveCount} remain</span>
      </div>

      {/* 1st person narration */}
      {roundData.narration && (
        <div className="round-narration">{roundData.narration}</div>
      )}

      {/* Events sequence — kills + world events mixed */}
      <div className="feed-sequence">
        {roundData.events.map((ev, i) => {
          if (ev.type === "WORLD_EVENT") {
            return (
              <div key={i} className="feed-world">
                <div className="feed-world-dot" />
                <span>{ev.message}</span>
              </div>
            );
          }

          if (ev.type === "SURVIVAL") {
            return (
              <div key={i} className="feed-survival">
                <span className="feed-icon">✓</span>
                <span className="feed-text" dangerouslySetInnerHTML={{
                  __html: ev.message.replace(
                    ev.message.split(" ")[0],
                    `<span class="ns">${ev.message.split(" ")[0]}</span>`
                  )
                }} />
              </div>
            );
          }

          if (ev.type === "FUNNY_DEATH") {
            return (
              <div key={i} className="feed-funny">
                <span className="feed-icon">💀</span>
                <span className="feed-text" dangerouslySetInnerHTML={{
                  __html: ev.victim
                    ? ev.message.replace(ev.victim, `<span class="nv">${ev.victim}</span>`)
                    : ev.message
                }} />
              </div>
            );
          }

          if (ev.type === "ELIMINATION") {
            let html = ev.message;
            if (ev.killer) html = html.replace(new RegExp(ev.killer, 'g'), `<span class="nk">${ev.killer}</span>`);
            if (ev.victim) html = html.replace(new RegExp(ev.victim, 'g'), `<span class="nv">${ev.victim}</span>`);
            return (
              <div key={i} className="feed-kill">
                <span className="feed-icon">☠</span>
                <span className="feed-text" dangerouslySetInnerHTML={{ __html: html }} />
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

export default function Match() {
  const navigate = useNavigate();
  const { match, setResults, clearMatch } = useMatch();

  const [visibleRounds, setVisibleRounds] = useState([]);
  const [allRounds, setAllRounds] = useState([]);
  const [alive, setAlive] = useState(20);
  const [currentRound, setCurrentRound] = useState(0);
  const [starting, setStarting] = useState(true);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState("");

  const startedRef = useRef(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [visibleRounds]);

  useEffect(() => {
    if (!match?.eventId) { navigate("/", { replace: true }); return; }
    if (startedRef.current) return;
    startedRef.current = true;

    const load = async () => {
      try {
        // Poll until match is ready
        let data;
        let attempts = 0;
        while (attempts < 30) {
          data = await getEventFeed(match.eventId);
          if (data?.storyRounds?.length > 0) break;
          await new Promise(r => setTimeout(r, 1000));
          attempts++;
        }

        if (!data?.storyRounds?.length) {
          setError("Match data unavailable");
          setTimeout(() => { clearMatch(); navigate("/", { replace: true }); }, 2000);
          return;
        }

        // Already watched?
        const seen = localStorage.getItem(`match_seen_${match.eventId}`);
        if (seen && data.status === "ENDED" && data.finalResults) {
          setResults({ results: data.finalResults });
          navigate("/results", { replace: true });
          return;
        }

        setStarting(false);
        setAllRounds(data.storyRounds);

        // Stream round cards one by one
        for (let i = 0; i < data.storyRounds.length; i++) {
          const round = data.storyRounds[i];

          setVisibleRounds(prev => [...prev, round]);
          setCurrentRound(round.round || 0);
          if (round.aliveCount !== undefined) setAlive(round.aliveCount);

          if (round.type === "MATCH_END") {
            setResults({ results: data.finalResults || [] });
            setComplete(true);
            localStorage.setItem(`match_seen_${match.eventId}`, "true");
            break;
          }

          await new Promise(r => setTimeout(r, ROUND_DELAY));
        }

      } catch (err) {
        console.error("MATCH ERROR:", err);
        setError(err.message || "Failed to load match");
        setTimeout(() => { clearMatch(); navigate("/", { replace: true }); }, 2000);
      }
    };

    load();
  }, []);

  const eventType = match?.eventType || "evil_forest";
  const theme = THEMES[eventType] || THEMES.evil_forest;

  const dangerColor = match?.danger === "EXTREME" ? "var(--red)" :
                      match?.danger === "HIGH" ? "var(--orange)" : "var(--gold)";

  return (
    <div className={`page match-page ${theme.css}`}>

      {/* Atmospheric bg overlay */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 0,
        background: theme.bg,
        pointerEvents: "none"
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ marginBottom: 16 }}>
          <div style={{
            fontFamily: "Bebas Neue, sans-serif",
            fontSize: 30,
            letterSpacing: 3,
            marginBottom: 10
          }}>
            {match?.theme || "OUTLAST"}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span className="badge badge-blue">📍 {match?.location}</span>
            <span className="badge badge-purple">
              {currentRound > 0 ? `ROUND ${currentRound}` : "STARTING"}
            </span>
            <span className="badge badge-red">☠ {alive} ALIVE</span>
          </div>
        </div>

        {/* Danger strip */}
        <div className="card" style={{ marginBottom: 16, padding: "12px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 3 }}>
                Danger Level
              </div>
              <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: 18, letterSpacing: 2, color: dangerColor }}>
                {match?.danger || "HIGH"}
              </div>
            </div>
            <div style={{ fontSize: 12, color: "var(--text3)", fontStyle: "italic", textAlign: "right", maxWidth: "55%" }}>
              {match?.tagline || "Survivors are trapped inside the district."}
            </div>
          </div>
        </div>

        {/* Starting state */}
        {starting && !error && (
          <div className="card" style={{ textAlign: "center", padding: "32px 16px" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>⚡</div>
            <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: 20, letterSpacing: 2, marginBottom: 8 }}>
              Arena Opening...
            </div>
            <div style={{ color: "var(--text3)", fontSize: 13 }}>
              Survivors are entering the district.
            </div>
            <div className="loader-dot" style={{ justifyContent: "center", marginTop: 16 }}>
              <span /><span /><span />
            </div>
          </div>
        )}

        {/* Error */}
        {error && <div className="error-card">{error}</div>}

        {/* Round cards */}
        {visibleRounds.map((round, i) => (
          <RoundCard
            key={i}
            roundData={round}
            eventType={eventType}
          />
        ))}

        {/* Scroll anchor */}
        <div ref={bottomRef} />

        {/* Complete buttons */}
        {complete && (
          <div style={{ marginTop: 8 }}>
            <button
              className="btn-primary"
              onClick={() => navigate("/results", { replace: true })}
              style={{ marginBottom: 8 }}
            >
              VIEW RESULTS
            </button>
            <button
              className="btn-secondary"
              onClick={() => { clearMatch(); navigate("/", { replace: true }); }}
            >
              RETURN HOME
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
