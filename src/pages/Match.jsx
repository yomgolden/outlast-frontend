import {
  useEffect,
  useState,
  useRef
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  getEventFeed
} from "../api/api";

import {
  useMatch
} from "../context/MatchContext";

import MatchRenderer from "../components/match/MatchRenderer";

const ROUND_DELAY = 6000;

const THEMES = {

  mushin_nightmare: {

    css: "theme-mushin",

    bg:
      "radial-gradient(ellipse 60% 40% at 30% 0%, rgba(255,140,20,0.06) 0%, transparent 60%)"
  },

  blackout_yaba: {

    css: "theme-yaba",

    bg:
      "radial-gradient(ellipse 60% 50% at 50% 20%, rgba(40,80,200,0.05) 0%, transparent 70%)"
  },

  ajegunle_warzone: {

    css: "theme-ajegunle",

    bg:
      "radial-gradient(ellipse 80% 30% at 50% 100%, rgba(0,30,5,0.8) 0%, transparent 70%)"
  },

  evil_forest: {

    css: "theme-forest",

    bg:
      "radial-gradient(ellipse 100% 50% at 50% 100%, rgba(10,30,5,0.9) 0%, transparent 70%)"
  }
};

export default function Match() {

  const navigate =
    useNavigate();

  const {
    match,
    setResults,
    clearMatch
  } = useMatch();

  const [storyRounds, setStoryRounds] =
    useState([]);

  const [alive, setAlive] =
    useState(20);

  const [currentRound, setCurrentRound] =
    useState(0);

  const [starting, setStarting] =
    useState(true);

  const [complete, setComplete] =
    useState(false);

  const [error, setError] =
    useState("");

  const startedRef =
    useRef(false);

  /*
  =====================================
  LOAD MATCH
  =====================================
  */

  useEffect(() => {

    if (!match?.eventId) {

      navigate("/", {
        replace: true
      });

      return;
    }

    if (startedRef.current)
      return;

    startedRef.current = true;

    const load =
      async () => {

        try {

          let data;

          let attempts = 0;

          /*
          =====================================
          POLL FOR MATCH DATA
          =====================================
          */

          while (attempts < 30) {

            data =
              await getEventFeed(
                match.eventId
              );

            if (
              data?.storyRounds?.length > 0
            ) break;

            await new Promise(
              r => setTimeout(r, 1000)
            );

            attempts++;
          }

          /*
          =====================================
          NO MATCH DATA
          =====================================
          */

          if (
            !data?.storyRounds?.length
          ) {

            setError(
              "Match data unavailable"
            );

            setTimeout(() => {

              clearMatch();

              navigate("/", {
                replace: true
              });

            }, 2000);

            return;
          }

          /*
          =====================================
          ALREADY WATCHED
          =====================================
          */

          const seen =
            localStorage.getItem(
              `match_seen_${match.eventId}`
            );

          if (
            seen &&
            data.status === "ENDED" &&
            data.finalResults
          ) {

            setResults({
              results:
                data.finalResults
            });

            navigate(
              "/results",
              {
                replace: true
              }
            );

            return;
          }

          /*
          =====================================
          START MATCH
          =====================================
          */

          setStarting(false);

          setStoryRounds(
            data.storyRounds || []
          );

          /*
          =====================================
          TRACK FINAL ROUND INFO
          =====================================
          */

          const finalRound =
            data.storyRounds[
              data.storyRounds.length - 1
            ];

          if (
            finalRound?.aliveCount !==
            undefined
          ) {

            setAlive(
              finalRound.aliveCount
            );
          }

          const lastPlayableRound =
            [...data.storyRounds]
              .reverse()
              .find(
                r =>
                  r.type === "ROUND"
              );

          if (
            lastPlayableRound?.round
          ) {

            setCurrentRound(
              lastPlayableRound.round
            );
          }

          /*
          =====================================
          SAVE RESULTS
          =====================================
          */

          setResults({
            results:
              data.finalResults || []
          });

        } catch (err) {

          console.error(
            "MATCH ERROR:",
            err
          );

          setError(
            err.message ||
            "Failed to load match"
          );

          setTimeout(() => {

            clearMatch();

            navigate("/", {
              replace: true
            });

          }, 2000);
        }
      };

    load();

  }, []);

  /*
  =====================================
  MATCH COMPLETE
  =====================================
  */

  const handleComplete =
    () => {

      if (!storyRounds.length)
        return;

      /*
      =====================================
      SAVE HISTORY
      =====================================
      */

      const history = JSON.parse(
        localStorage.getItem(
          "outlast_history"
        ) || "[]"
      );

      history.unshift({

        theme:
          match?.theme,

        location:
          match?.location,

        danger:
          match?.danger,

        winner:
          storyRounds.find(
            r =>
              r.type === "MATCH_END"
          )?.winner || "Unknown",

        totalPlayers:
          20,

        date:
          new Date()
            .toLocaleString(),

        storyRounds
      });

      localStorage.setItem(
        "outlast_history",
        JSON.stringify(
          history.slice(0, 20)
        )
      );

      localStorage.setItem(
        `match_seen_${match.eventId}`,
        "true"
      );

      setComplete(true);
    };

  /*
  =====================================
  THEME
  =====================================
  */

  const eventType =
    match?.eventType ||
    "evil_forest";

  const theme =
    THEMES[eventType] ||
    THEMES.evil_forest;

  const dangerColor =
    match?.danger === "EXTREME"

      ? "var(--red)"

      : match?.danger === "HIGH"

      ? "var(--orange)"

      : "var(--gold)";

  return (

    <div
      className={`page match-page ${theme.css}`}
    >

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

      <div
        style={{
          position: "relative",
          zIndex: 1
        }}
      >

        {/* HEADER */}

        <div
          style={{
            marginBottom: 16
          }}
        >

          <div
            style={{
              fontFamily:
                "Bebas Neue, sans-serif",

              fontSize: 30,

              letterSpacing: 3,

              marginBottom: 10
            }}
          >
            {match?.theme || "OUTLAST"}
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap"
            }}
          >

            <span className="badge badge-blue">
              📍 {match?.location}
            </span>

            <span className="badge badge-purple">
              {currentRound > 0
                ? `ROUND ${currentRound}`
                : "STARTING"}
            </span>

            <span className="badge badge-red">
              ⚔️ {alive} ALIVE
            </span>

          </div>

        </div>

        {/* DANGER */}

        <div
          className="card"
          style={{
            marginBottom: 16,
            padding: "12px 16px"
          }}
        >

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",

              alignItems:
                "center"
            }}
          >

            <div>

              <div
                style={{
                  fontSize: 10,
                  color:
                    "var(--text3)",

                  textTransform:
                    "uppercase",

                  letterSpacing: 1.5,

                  marginBottom: 3
                }}
              >
                Danger Level
              </div>

              <div
                style={{
                  fontFamily:
                    "Bebas Neue, sans-serif",

                  fontSize: 18,

                  letterSpacing: 2,

                  color:
                    dangerColor
                }}
              >
                {match?.danger || "HIGH"}
              </div>

            </div>

            <div
              style={{
                fontSize: 12,
                color:
                  "var(--text3)",

                fontStyle:
                  "italic",

                textAlign:
                  "right",

                maxWidth: "55%"
              }}
            >
              {match?.tagline ||
                "Survivors are trapped inside the district."}
            </div>

          </div>

        </div>

        {/* STARTING */}

        {starting && !error && (

          <div
            className="card"
            style={{
              textAlign: "center",
              padding: "32px 16px"
            }}
          >

            <div
              style={{
                fontSize: 36,
                marginBottom: 12
              }}
            >
              ⚡
            </div>

            <div
              style={{
                fontFamily:
                  "Bebas Neue, sans-serif",

                fontSize: 20,

                letterSpacing: 2,

                marginBottom: 8
              }}
            >
              Arena Opening...
            </div>

            <div
              style={{
                color:
                  "var(--text3)",

                fontSize: 13
              }}
            >
              Survivors are entering the district.
            </div>

          </div>

        )}

        {/* ERROR */}

        {error && (

          <div className="error-card">
            {error}
          </div>

        )}

        {/* MATCH RENDERER */}

        {!starting &&
          !error &&
          storyRounds.length > 0 && (

          <MatchRenderer
            rounds={storyRounds}
            roundDelay={ROUND_DELAY}
            onComplete={
              handleComplete
            }
          />

        )}

        {/* COMPLETE */}

        {complete && (

          <div
            style={{
              marginTop: 8
            }}
          >

            <button
              className="btn-primary"
              onClick={() =>
                navigate(
                  "/results",
                  {
                    replace: true
                  }
                )
              }
              style={{
                marginBottom: 8
              }}
            >
              VIEW RESULTS
            </button>

            <button
              className="btn-secondary"
              onClick={() => {

                clearMatch();

                navigate("/", {
                  replace: true
                });

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
