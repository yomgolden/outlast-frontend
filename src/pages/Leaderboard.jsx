import {
  useEffect,
  useState
} from "react";

import {
  getWeeklyLeaderboard,
  getSeasonalLeaderboard
} from "../api/api";

export default function Leaderboard() {

  const [
    leaderboard,
    setLeaderboard
  ] = useState([]);

  const [
    tab,
    setTab
  ] = useState("weekly");

  /*
  =====================================
  LOAD LEADERBOARD
  =====================================
  */

  useEffect(() => {

    const load =
      async () => {

        try {

          let data = [];

          if (
            tab === "weekly"
          ) {

            data =
              await getWeeklyLeaderboard();

          } else {

            data =
              await getSeasonalLeaderboard();
          }

          setLeaderboard(
            data
          );

        } catch (err) {

          console.error(
            err
          );
        }
      };

    load();

  }, [tab]);

  return (

    <div className="app-container">

      <h1 className="title">
        LEADERBOARD
      </h1>

      {/* TABS */}

      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 20
        }}
      >

        <button
          onClick={() =>
            setTab("weekly")
          }
        >
          Weekly
        </button>

        <button
          onClick={() =>
            setTab("seasonal")
          }
        >
          Seasonal
        </button>

      </div>

      {/* PLAYERS */}

      {
        leaderboard.map(
          (
            player,
            index
          ) => (

            <div
              key={index}
              className="card"
            >

              <h3>
                #
                {index + 1}
              </h3>

              <p>
                @{player.username}
              </p>

              <p>
                Rank:
                {" "}
                {player.rank}
              </p>

              <p>

                {
                  tab === "weekly"
                    ? "Weekly RP"
                    : "Season RP"
                }

                :
                {" "}

                {
                  tab === "weekly"
                    ? player.weeklyRp
                    : player.seasonRp
                }

              </p>

            </div>
          )
        )
      }

    </div>
  );
}
