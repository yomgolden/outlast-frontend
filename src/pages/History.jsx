import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

export default function History() {

  const navigate =
    useNavigate();

  const [
    matches,
    setMatches
  ] = useState([]);

  /*
  =====================================
  LOAD HISTORY
  =====================================
  */

  useEffect(() => {

    try {

      const saved =
        JSON.parse(
          localStorage.getItem(
            "outlast_history"
          ) || "[]"
        );

      // Keep latest 20 only
      const limited =
        saved.slice(0, 20);

      setMatches(limited);

    } catch {

      setMatches([]);
    }

  }, []);

  /*
  =====================================
  CLEAR HISTORY
  =====================================
  */

  const clearHistory =
    () => {

      localStorage.removeItem(
        "outlast_history"
      );

      setMatches([]);
    };

  /*
  =====================================
  OPEN REPLAY
  =====================================
  */

  const openReplay =
    (index) => {

      navigate(
        `/history/${index}`
      );
    };

  return (

    <div className="page">

      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
          marginBottom: 20
        }}
      >

        <div>

          <div
            className="game-title"
            style={{
              fontSize: 34
            }}
          >

            HISTORY

          </div>

          <div
            style={{
              color:
                "var(--text3)",
              fontSize: 12,
              marginTop: 4
            }}
          >

            Last 20 completed arenas

          </div>

        </div>

        {
          matches.length > 0 && (

            <button
              className="btn-secondary"
              style={{
                width: "auto",
                padding:
                  "10px 14px",
                fontSize: 12
              }}
              onClick={
                clearHistory
              }
            >

              CLEAR

            </button>
          )
        }

      </div>

      {/* EMPTY STATE */}

      {
        matches.length === 0 && (

          <div
            className="card"
            style={{
              textAlign:
                "center",
              padding:
                "36px 20px"
            }}
          >

            <div
              style={{
                fontSize: 42,
                marginBottom: 14
              }}
            >

              📜

            </div>

            <h3
              style={{
                marginBottom: 10
              }}
            >

              No Match History

            </h3>

            <p
              style={{
                color:
                  "var(--text2)",
                lineHeight: 1.6,
                fontSize: 14
              }}
            >

              Completed matches
              will appear here
              after every arena.

            </p>

          </div>
        )
      }

      {/* MATCH LIST */}

      {
        matches.map(
          (
            match,
            index
          ) => (

            <div
              key={index}
              className="card"
              onClick={() =>
                openReplay(index)
              }
              style={{
                marginBottom: 16,
                cursor: "pointer",
                transition:
                  "0.2s",
                position:
                  "relative",
                overflow:
                  "hidden"
              }}
            >

              {/* BG GLOW */}

              <div
                style={{
                  position:
                    "absolute",
                  right: -20,
                  top: -20,
                  width: 120,
                  height: 120,
                  borderRadius:
                    "50%",
                  background:
                    match.danger ===
                    "EXTREME"
                      ? "rgba(239,68,68,0.08)"
                      : match.danger ===
                        "HIGH"
                      ? "rgba(249,115,22,0.06)"
                      : "rgba(234,179,8,0.05)"
                }}
              />

              {/* TOP */}

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "flex-start",
                  gap: 10,
                  position:
                    "relative",
                  zIndex: 1
                }}
              >

                <div>

                  <h3
                    style={{
                      marginBottom: 6,
                      fontSize: 20
                    }}
                  >

                    {match.theme}

                  </h3>

                  <div
                    style={{
                      color:
                        "var(--text3)",
                      fontSize: 12
                    }}
                  >

                    📍 {match.location}

                  </div>

                </div>

                <span
                  className={
                    match.danger ===
                    "EXTREME"
                      ? "badge badge-red"
                      : match.danger ===
                        "HIGH"
                      ? "badge badge-orange"
                      : "badge badge-gold"
                  }
                >

                  {match.danger}

                </span>

              </div>

              {/* DIVIDER */}

              <div
                style={{
                  height: 1,
                  background:
                    "var(--border)",
                  margin:
                    "16px 0"
                }}
              />

              {/* STATS */}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: 14
                }}
              >

                {/* WINNER */}

                <div>

                  <div
                    style={{
                      color:
                        "var(--text3)",
                      fontSize: 11,
                      marginBottom: 4
                    }}
                  >

                    WINNER

                  </div>

                  <div
                    style={{
                      fontWeight: 700
                    }}
                  >

                    @{match.winner}

                  </div>

                </div>

                {/* PLAYERS */}

                <div>

                  <div
                    style={{
                      color:
                        "var(--text3)",
                      fontSize: 11,
                      marginBottom: 4
                    }}
                  >

                    PLAYERS

                  </div>

                  <div
                    style={{
                      fontWeight: 700
                    }}
                  >

                    {match.totalPlayers}

                  </div>

                </div>

                {/* ROUNDS */}

                <div>

                  <div
                    style={{
                      color:
                        "var(--text3)",
                      fontSize: 11,
                      marginBottom: 4
                    }}
                  >

                    ROUNDS

                  </div>

                  <div
                    style={{
                      fontWeight: 700
                    }}
                  >

                    {match.rounds}

                  </div>

                </div>

                {/* DATE */}

                <div>

                  <div
                    style={{
                      color:
                        "var(--text3)",
                      fontSize: 11,
                      marginBottom: 4
                    }}
                  >

                    DATE

                  </div>

                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 13,
                      lineHeight: 1.4
                    }}
                  >

                    {match.date}

                  </div>

                </div>

              </div>

              {/* FOOTER */}

              <div
                style={{
                  marginTop: 18,
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center"
                }}
              >

                <div
                  style={{
                    color:
                      "var(--text3)",
                    fontSize: 12
                  }}
                >

                  Tap to replay match

                </div>

                <span className="badge badge-purple">

                  ▶ REPLAY

                </span>

              </div>

            </div>
          )
        )
      }

    </div>
  );
}
