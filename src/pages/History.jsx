import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function History() {

  const navigate = useNavigate();

  const [history, setHistory] = useState([]);

  // LOAD HISTORY
  useEffect(() => {

    const saved = JSON.parse(
      localStorage.getItem("outlast_history") || "[]"
    );

    // REMOVE OLD INVALID MATCHES
    const valid = saved.filter(
      match =>
        match.storyRounds &&
        match.storyRounds.length > 0
    );

    // UPDATE STORAGE
    if (valid.length !== saved.length) {

      localStorage.setItem(
        "outlast_history",
        JSON.stringify(valid)
      );
    }

    setHistory(valid);

  }, []);

  // CLEAR HISTORY
  const clearHistory = () => {

    localStorage.removeItem("outlast_history");

    setHistory([]);
  };

  // REPLAY
  const replayMatch = (index) => {

    const selected = history[index];

    // INVALID
    if (
      !selected ||
      !selected.storyRounds ||
      selected.storyRounds.length === 0
    ) {

      alert(
        "Replay data unavailable for this match."
      );

      return;
    }

    navigate(`/replay/${index}`);
  };

  return (

    <div className="page">

      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 20
        }}
      >

        <div>

          <div
            style={{
              fontFamily:
                "Bebas Neue, sans-serif",

              fontSize: 52,

              letterSpacing: 3,

              lineHeight: 1
            }}
          >
            HISTORY
          </div>

          <div
            style={{
              color: "var(--text3)",
              marginTop: 6
            }}
          >
            Last 20 completed arenas
          </div>

        </div>

        {history.length > 0 && (

          <button
            className="btn-secondary"
            style={{
              width: "auto",
              padding: "10px 14px"
            }}
            onClick={clearHistory}
          >
            CLEAR
          </button>

        )}

      </div>

      {/* EMPTY */}
      {history.length === 0 && (

        <div
          className="card"
          style={{
            textAlign: "center",
            padding: "32px 16px"
          }}
        >

          <div
            style={{
              fontSize: 42,
              marginBottom: 12
            }}
          >
            📜
          </div>

          <div
            style={{
              fontFamily:
                "Bebas Neue, sans-serif",

              fontSize: 24,

              letterSpacing: 2,

              marginBottom: 8
            }}
          >
            NO HISTORY
          </div>

          <div
            style={{
              color: "var(--text3)",
              fontSize: 14
            }}
          >
            Completed matches will appear here.
          </div>

        </div>

      )}

      {/* HISTORY LIST */}
      {history.map((match, index) => (

        <div
          key={index}
          className="card"
          style={{
            marginBottom: 18,
            position: "relative",
            overflow: "hidden"
          }}
        >

          {/* BG ORB */}
          <div
            style={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 160,
              height: 160,
              borderRadius: "50%",
              background:
                "rgba(255,200,50,0.05)",

              filter: "blur(10px)"
            }}
          />

          {/* TOP */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 18,
              position: "relative",
              zIndex: 1
            }}
          >

            <div>

              <div
                style={{
                  fontSize: 34,
                  marginBottom: 6
                }}
              >
                📍
              </div>

              {match.theme && (

                <div
                  style={{
                    fontFamily:
                      "Bebas Neue, sans-serif",

                    fontSize: 28,

                    letterSpacing: 2,

                    marginBottom: 6
                  }}
                >
                  {match.theme}
                </div>

              )}

              {match.location && (

                <div
                  style={{
                    color: "var(--text3)",
                    fontSize: 15
                  }}
                >
                  📍 {match.location}
                </div>

              )}

            </div>

            {match.danger && (

              <span className="badge badge-red">
                {match.danger}
              </span>

            )}

          </div>

          {/* DIVIDER */}
          <div
            style={{
              height: 1,
              background:
                "rgba(255,255,255,0.06)",

              marginBottom: 18
            }}
          />

          {/* GRID */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",

              gap: 20,

              marginBottom: 24,

              position: "relative",
              zIndex: 1
            }}
          >

            <div>

              <div
                style={{
                  color: "var(--text3)",
                  fontSize: 13,
                  marginBottom: 6
                }}
              >
                WINNER
              </div>

              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700
                }}
              >
                @{match.winner}
              </div>

            </div>

            <div>

              <div
                style={{
                  color: "var(--text3)",
                  fontSize: 13,
                  marginBottom: 6
                }}
              >
                PLAYERS
              </div>

              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700
                }}
              >
                {match.totalPlayers}
              </div>

            </div>

            <div>

              <div
                style={{
                  color: "var(--text3)",
                  fontSize: 13,
                  marginBottom: 6
                }}
              >
                ROUNDS
              </div>

              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700
                }}
              >
                {match.storyRounds?.filter(
                  r => r.type === "ROUND"
                ).length || 0}
              </div>

            </div>

            <div>

              <div
                style={{
                  color: "var(--text3)",
                  fontSize: 13,
                  marginBottom: 6
                }}
              >
                DATE
              </div>

              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600
                }}
              >
                {match.date}
              </div>

            </div>

          </div>

          {/* FOOTER */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              position: "relative",
              zIndex: 1
            }}
          >

            <div
              style={{
                color: "var(--text3)",
                fontSize: 14
              }}
            >
              Tap to replay match
            </div>

            <button
              className="btn-secondary"
              style={{
                width: "auto",
                padding: "10px 18px",
                borderRadius: 999
              }}
              onClick={() =>
                replayMatch(index)
              }
            >
              ▶ REPLAY
            </button>

          </div>

        </div>

      ))}

    </div>
  );
}
