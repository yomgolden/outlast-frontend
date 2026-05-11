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

  useEffect(() => {

    let feedPoll;

    const run =
      async () => {

        try {

          const result =
            await simulateMatch(
              match.matchId
            );

          setResults(result);

          feedPoll =
            setInterval(
              async () => {

                const feedData =
                  await getMatchFeed(
                    match.matchId
                  );

                const status =
                  await getMatchStatus(
                    match.matchId
                  );

                setFeed(
                  feedData
                );

                setRound(
                  status.round
                );

                setAlive(
                  status
                    .alivePlayers
                    .length
                );

                if (
                  status.status ===
                  "ENDED"
                ) {

                  clearInterval(
                    feedPoll
                  );

                  navigate(
                    "/results"
                  );
                }

              },
              1000
            );

        } catch (err) {

          console.error(err);
        }
      };

    run();

    return () => {

      if (feedPoll)
        clearInterval(
          feedPoll
        );
    };

  }, []);

  return (
    <div className="app-container">

      <h1 className="title">
        LIVE MATCH
      </h1>

      <div className="card">

        <p>
          Round:
          {" "}
          {round}
        </p>

        <p>
          Alive:
          {" "}
          {alive}
        </p>

      </div>

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
