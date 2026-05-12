import {
  useEffect
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  useMatch
} from "../context/MatchContext";

import {
  useUser
} from "../context/UserContext";

export default function Results() {

  const navigate =
    useNavigate();

  const {
    results,
    clearMatch
  } = useMatch();

  const {
    user,
    loadUser
  } = useUser();

  /*
  =====================================
  REFRESH USER DATA
  =====================================
  */

  useEffect(() => {

    if (user?._id) {

      loadUser(
        user._id
      );
    }

  }, []);

  /*
  =====================================
  PLAY AGAIN
  =====================================
  */

  const handlePlayAgain =
    () => {

      clearMatch();

      navigate("/", {
        replace: true
      });
    };

  return (

    <div className="page">

      {/* HEADER */}

      <div
        style={{
          marginBottom: 24
        }}
      >

        <div
          className="game-title"
          style={{
            fontSize: 32
          }}
        >

          RESULTS

        </div>

        <div
          style={{
            color:
              "var(--text3)",
            marginTop: 6,
            fontSize: 13
          }}
        >

          District cleared

        </div>

      </div>

      {/* RESULTS */}

      {
        results?.results?.map(
          (
            player,
            index
          ) => {

            const top3 =
              player.placement <= 3;

            return (

              <div
                className="card"
                key={index}
                style={{
                  border:
                    top3
                      ? "1px solid rgba(234,179,8,0.3)"
                      : "1px solid var(--border)",

                  background:
                    top3
                      ? "linear-gradient(135deg, rgba(234,179,8,0.08), rgba(234,179,8,0.03))"
                      : "var(--surface)"
                }}
              >

                {/* PLAYER */}

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
                        fontWeight: 800,
                        fontSize: 18
                      }}
                    >

                      #{player.placement}
                      {" "}
                      @{player.username}

                    </div>

                    <div
                      style={{
                        color:
                          "var(--text3)",
                        fontSize: 12,
                        marginTop: 4
                      }}
                    >

                      Survivor Ranking

                    </div>

                  </div>

                  <div
                    style={{
                      textAlign:
                        "right"
                    }}
                  >

                    <div
                      style={{
                        color:
                          "var(--gold)",
                        fontWeight: 800,
                        fontSize: 18
                      }}
                    >

                      +{player.goldEarned}

                    </div>

                    <div
                      style={{
                        color:
                          "var(--purple)",
                        fontWeight: 700,
                        marginTop: 4,
                        fontSize: 14
                      }}
                    >

                      +{player.xpEarned} XP

                    </div>

                  </div>

                </div>

              </div>
            );
          }
        )
      }

      {/* ACTIONS */}

      <button
        className="btn-primary"
        onClick={
          handlePlayAgain
        }
        style={{
          marginTop: 10,
          marginBottom: 10
        }}
      >

        ⚡ PLAY AGAIN

      </button>

      <button
        className="btn-secondary"
        onClick={() =>
          navigate(
            "/leaderboard",
            {
              replace: true
            }
          )
        }
      >

        VIEW LEADERBOARD

      </button>

    </div>
  );
}
