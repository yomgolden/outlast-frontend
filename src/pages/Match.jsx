import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getEventFeed } from "../api/api";
import { useMatch } from "../context/MatchContext";
import MatchHeader from "../components/match/MatchHeader";
import MatchAtmosphere from "../components/match/MatchAtmosphere";
import MatchRenderer from "../components/match/MatchRenderer";

const ROUND_DELAY = 6000;

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

export default function Match() {
  const navigate = useNavigate();
  const { match, setResults, clearMatch } = useMatch();

  const [starting, setStarting] = useState(true);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState("");
  const [matchData, setMatchData] = useState(null);

  const startedRef = useRef(false);

  // LOAD MATCH DATA
  useEffect(() => {
    if (!match?.eventId) {
      navigate("/", { replace: true });
      return;
    }

    if (startedRef.current) return;
    startedRef.current = true;

    const load = async () => {
      try {
        let data;
        let attempts = 0;

        // POLL for match data
        while (attempts < 30) {
          data = await getEventFeed(match.eventId);

          if (data?.storyRounds?.length > 0) break;

          await new Promise(r => setTimeout(r, 1000));
          attempts++;
        }

        // ERROR
        if (!data?.storyRounds?.length) {
          setError("Match data unavailable");
          setTimeout(() => {
            clearMatch();
            navigate("/", { replace: true });
          }, 2000);
          return;
        }

        // CHECK if already seen
        const seen = localStorage.getItem(`match_seen_${match.eventId}`);

        if (seen && data.status === "ENDED" && data.finalResults) {
          setResults({ results: data.finalResults });
          navigate("/results", { replace: true });
          return;
        }

        setMatchData(data);
        setStarting(false);

      } catch (err) {
        console.error("MATCH ERROR:", err);
        setError(err.message || "Failed to load match");
        setTimeout(() => {
          clearMatch();
          navigate("/", { replace: true });
        }, 2000);
      }
    };

    load();
  }, []);

  // HANDLE MATCH COMPLETION
  const handleMatchComplete = () => {
    setComplete(true);

    if (matchData?.finalResults) {
      // SAVE TO HISTORY
      const history = JSON.parse(
        localStorage.getItem("outlast_history") || "[]"
      );

      history.unshift({
        theme: match?.theme,
        location: match?.location,
        danger: match?.danger,
        winner: matchData.finalResults[0]?.username || "Unknown",
        totalPlayers: matchData.finalResults.length,
        date: new Date().toLocaleString(),
        storyRounds: matchData.storyRounds || [],
        results: matchData.finalResults || []
      });

      localStorage.setItem(
        "outlast_history",
        JSON.stringify(history.slice(0, 20))
      );

      setResults({ results: matchData.finalResults });
      localStorage.setItem(`match_seen_${match.eventId}`, "true");
    }
  };

  const eventType = match?.eventType || "evil_forest";
  const theme = THEMES[eventType] || THEMES.evil_forest;

  return (
    <div className={`page match-page ${theme.css}`}>
      {/* BG */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          background: theme.bg,
          pointerEvents: "none"
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* HEADER */}
        <MatchHeader
          theme={match?.theme}
          location={match?.location}
          currentRound={0}
          alive={20}
          danger={match?.danger}
          tagline={match?.tagline}
        />

        {/* ATMOSPHERE */}
        <MatchAtmosphere starting={starting} error={error} />

        {/* MATCH RENDERER */}
        {matchData && (
          <MatchRenderer
            rounds={matchData.storyRounds}
            roundDelay={ROUND_DELAY}
            autoPlay={true}
            onComplete={handleMatchComplete}
          />
        )}

        {/* COMPLETE ACTION BUTTONS */}
        {complete && (
          <div style={{ marginTop: 16 }}>
            <button
              className="btn-primary"
              onClick={() =>
                navigate("/results", { replace: true })
              }
              style={{ marginBottom: 8 }}
            >
              VIEW RESULTS
            </button>

            <button
              className="btn-secondary"
              onClick={() => {
                clearMatch();
                navigate("/", { replace: true });
              }}
            >
              RETURN HOME
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
