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

    const saved =
      JSON.parse(
        localStorage.getItem(
          "outlast_history"
        ) || "[]"
      );

    setMatches(saved);

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

        <div
          className="game-title"
          style={{
            fontSize: 34
          }}
        >

          HISTORY

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

      {/* EMPTY */}

      {
        matches.length === 0 && (

          <div className="card">

            <h3>

              No Match History

            </h3>

            <p
              style={{
                marginTop: 10,
                color:
                  "var(--text2)"
              }}
            >

              Completed matches
              will appear here.

            </p>

          </div>
        )
      }

      {/* HISTORY LIST */}

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
                navigate(
                  `/history/${index}`
                )
              }
              style={{
                marginBottom: 16,
                cursor: "pointer",
                transition:
                  "0.2s"
              }}
            >

              {/* TOP */}

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
                  gap: 10
                }}
              >

                <div>

                  <h3
                    style={{
                      marginBottom: 6
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

                <span className="badge badge-red">

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
                  gap: 12
                }}
              >

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

                <div>

                  <div
                    style={{
                      color:
                        "var(--text3)",
                      fontSize: 11,
                      marginBottom: 4
                    }}
                  >

                    SURVIVORS

                  </div>

                  <div
                    style={{
                      fontWeight: 700
                    }}
                  >

                    {match.totalPlayers}

                  </div>

                </div>

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
                      fontSize: 13
                    }}
                  >

                    {match.date}

                  </div>

                </div>

              </div>

              {/* REPLAY */}

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
