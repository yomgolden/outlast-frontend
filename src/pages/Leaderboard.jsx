import {
  useEffect,
  useState
} from "react";

import {
  getLeaderboard
} from "../api/api";

export default function Leaderboard() {

  const [
    leaderboard,
    setLeaderboard
  ] = useState([]);

  /*
  =====================================
  LOAD LEADERBOARD
  =====================================
  */

  useEffect(() => {

    const load =
      async () => {

        try {

          const data =
            await getLeaderboard();

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

  }, []);

  return (

    <div className="app-container">

      <h1 className="title">
        LEADERBOARD
      </h1>

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
                Survivor:
                {" "}
                @{player.username}
              </p>

              <p>
                Wins:
                {" "}
                {player.wins}
              </p>

              <p>
                Level:
                {" "}
                {player.level}
              </p>

              <p>
                XP:
                {" "}
                {player.xp}
              </p>

            </div>
          )
        )
      }

    </div>
  );
}
