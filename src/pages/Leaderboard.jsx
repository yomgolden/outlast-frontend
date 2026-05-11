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

  useEffect(() => {

    const load =
      async () => {

        const data =
          await getLeaderboard();

        setLeaderboard(data);
      };

    load();

  }, []);

  return (
    <div className="app-container">

      <h1 className="title">
        LEADERBOARD
      </h1>

      {leaderboard.map(
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
              User:
              {" "}
              {player.userId}
            </p>

            <p>
              Wins:
              {" "}
              {player.wins}
            </p>

          </div>
        )
      )}

    </div>
  );
}
