import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  simulateMatch,
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

    let poll;

    const startMatch =
      async () => {

        try {

          await simulateMatch(
            match.matchId
          );

          poll = setInterval(
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

                  navigate("/results");
                }

              } catch (err) {

                console.error(err);

                setError(
                  "Failed to load match updates"
                );
              }

            },
            2000
          );

        } catch (err) {

          console.error(err);

          setError(
            "Simulation failed"
          );
        }
      };

    startMatch();

    return () => {
      if (poll)
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
          (item, index) => (

            <div
              key={index}
              className="card"
              style={{
                marginTop: 10
              }}
            >
              {item.message}
            </div>
          )
        )}

      </div>

    </div>
  );
}
