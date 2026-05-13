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
  SAVE MATCH HISTORY
  =====================================
  */

  useEffect(() => {

    if (
      !results?.results?.length
    ) return;

    try {

      const existing =
        JSON.parse(
          localStorage.getItem(
            "outlast_history"
          ) || "[]"
        );

      const historyMatch = {

        theme:
          results.theme,

        location:
          results.location,

        danger:
          results.danger,

        winner:
          results.results[0]
            ?.username || "Unknown",

        totalPlayers:
          results.results.length,

        rounds:
          results.feed?.filter(
            item =>
              item.type ===
              "ROUND_START"
          ).length || 0,

        date:
          new Date()
            .toLocaleString(),

        results:
          results.results,

        feed:
          results.feed
      };

      /*
      =====================================
      PREVENT DUPLICATE SAVES
      =====================================
      */

      const alreadyExists =
        existing.find(
          match =>
            match.date ===
            historyMatch.date
        );

      if (alreadyExists) return;

      /*
      =====================================
      KEEP ONLY LATEST 20
      =====================================
      */

      const updated = [
        historyMatch,
        ...existing
      ];

      const limited =
        updated.slice(0, 20);

      localStorage.setItem(
        "outlast_history",
        JSON.stringify(limited)
      );

    } catch (err) {

      console.error(
        "HISTORY SAVE ERROR:",
        err
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

  /*
  =====================================
  RETURN HOME
  =====================================
  */

  const handleHome =
    () => {

      clearMatch();

      navigate("/", {
        replace: true
      });
    };

  /*
  =====================================
  VIEW LEADERBOARD
  =====================================
  */

  const handleLeaderboard =
    () => {

      clearMatch();

      navigate(
        "/leaderboard",
        {
          replace: true
        }
      );
    };

  /*
  =====================================
  RESULTS FILTERING
  =====================================
  */

  const allResults =
    results?.results || [];

  /*
  =====================================
  TOP 3
  =====================================
  */

  const topThree =
    allResults.slice(0, 3);

  /*
  =====================================
  PLAYER RESULT
  =====================================
  */

  const myResult =
    allResults.find(
      player =>
        player.userId ===
        user?._id
    );

  /*
  =====================================
  SHOW EXTRA CARD
  =====================================
  */

  const showMyPlacement =
    myResult &&
    myResult.placement > 3;

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

      {/* TOP 3 */}

      <div
        className="section-title"
        style={{
          marginBottom: 12
        }}
      >

        Top Survivors

      </div>

      {
        topThree.map(
          (
            player,
            index
          ) => {

            const rankStyle =
              player.placement === 1
                ? "rgba(234,179,8,0.12)"
                : player.placement === 2
                ? "rgba(148,163,184,0.10)"
                : "rgba(249,115,22,0.10)";

            const borderStyle =
              player.placement === 1
                ? "rgba(234,179,8,0.35)"
                : player.placement === 2
                ? "rgba(148,163,184,0.30)"
                : "rgba(249,115,22,0.30)";

            return (

              <div
                className="card"
                key={index}
                style={{
                  border:
                    `1px solid ${borderStyle}`,

                  background:
                    `linear-gradient(135deg, ${rankStyle}, rgba(0,0,0,0.02))`
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
                        fontWeight: 800,
                        fontSize: 18
                      }}
                    >

                      {
                        player.placement === 1
                          ? "🥇"
                          : player.placement === 2
                          ? "🥈"
                          : "🥉"
                      }

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

                      Placement #
                      {player.placement}

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

      {/* YOUR PLACEMENT */}

      {
        showMyPlacement && (

          <>

            <div
              className="section-title"
              style={{
                marginTop: 24,
                marginBottom: 12
              }}
            >

              Your Placement

            </div>

            <div
              className="card"
              style={{
                border:
                  "1px solid rgba(99,102,241,0.30)",

                background:
                  "linear-gradient(135deg, rgba(99,102,241,0.10), rgba(99,102,241,0.03))"
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
                      fontWeight: 800,
                      fontSize: 18
                    }}
                  >

                    #
                    {myResult.placement}

                    {" "}

                    @{myResult.username}

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

                    +{myResult.goldEarned}

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

                    +{myResult.xpEarned} XP

                  </div>

                </div>

              </div>

            </div>

          </>
        )
      }

      {/* ACTIONS */}

      <button
        className="btn-primary"
        onClick={
          handlePlayAgain
        }
        style={{
          marginTop: 16,
          marginBottom: 10
        }}
      >

        ⚡ PLAY AGAIN

      </button>

      <button
        className="btn-secondary"
        onClick={
          handleLeaderboard
        }
        style={{
          marginBottom: 10
        }}
      >

        VIEW LEADERBOARD

      </button>

      <button
        className="btn-secondary"
        onClick={
          handleHome
        }
      >

        RETURN HOME

      </button>

    </div>
  );
}
