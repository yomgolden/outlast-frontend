import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  getMatchFeed,
  getMatchStatus
} from "../api/api";

import {
  useMatch
} from "../context/MatchContext";

export default function Match() {

  const navigate =
    useNavigate();

  const {
    match,
    feed,
    setFeed,
    setResults
  } = useMatch();

  const [
    round,
    setRound
  ] = useState(1);

  const [
    alive,
    setAlive
  ] = useState(20);

  const [
    error,
    setError
  ] = useState("");

  useEffect(() => {

    if (!match?.matchId) {
      navigate("/");
      return;
    }

    const poll = setInterval(
      async () => {

        try {

          const feedData =
            await getMatchFeed(
              match.matchId
            );

          const status =
            await getMatchStatus(
              match.matchId
            );

          setFeed(feedData);

          setRound(
            status.round || 1
          );

          setAlive(
            status.alivePlayers
              ?.length || 0
          );

          /*
          ============================
          MATCH ENDED
          ============================
          */

          if (
            status.status ===
            "ENDED"
          ) {

            setResults({
              results: [
                {
                  player: "Shadow",
                  placement: 1,
                  goldEarned: 300,
                  xpEarned: 100
                },
                {
                  player: "Nova",
                  placement: 2,
                  goldEarned: 200,
                  xpEarned: 80
                },
                {
                  player: "Viper",
                  placement: 3,
                  goldEarned: 100,
                  xpEarned: 60
                }
              ]
            });

            clearInterval(poll);

            navigate(
              "/results"
            );
          }

        } catch (err) {

          setError(
            "Failed to load match"
          );

          console.error(err);
        }

      },
      2000
    );

    return () => {
      clearInterval(poll);
    };

  }, []);

  return (
    <div className="app-container">

      <h1 className="title">
        LIVE MATCH
      </h1>

      <div className="card">

        <p>
          Round: {round}
        </p>

        <p>
          Alive: {alive}
        </p>

      </div>

      {error && (
        <div className="card">
          {error}
        </div>
      )}

      <div>

        {feed.map(
          (
            item,
            index
          ) => (

            <div
              key={index}
              className="feed-item"
            >
              {item.message}
            </div>

          )
        )}

      </div>

    </div>
  );
}
