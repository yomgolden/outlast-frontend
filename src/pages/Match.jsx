import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  simulateMatch
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

    const startSimulation =
      async () => {

        try {

          /*
          ===========================
          START REAL SIMULATION
          ===========================
          */

          const data =
            await simulateMatch(
              match.matchId
            );

          /*
          ===========================
          STREAM FEED EVENTS
          ===========================
          */

          let currentFeed =
            [];

          for (
            let i = 0;
            i <
            data.feed.length;
            i++
          ) {

            const item =
              data.feed[i];

            currentFeed = [
              ...currentFeed,
              item
            ];

            setFeed(
              currentFeed
            );

            /*
            ===========================
            ROUND TRACKING
            ===========================
            */

            if (
              item.round
            ) {

              setRound(
                item.round
              );
            }

            /*
            ===========================
            ALIVE TRACKING
            ===========================
            */

            if (
              item.message?.includes(
                "PLAYERS REMAIN"
              )
            ) {

              const number =
                parseInt(
                  item.message
                );

              if (
                !isNaN(
                  number
                )
              ) {

                setAlive(
                  number
                );
              }
            }

            /*
            ===========================
            FEED SPEED
            ===========================
            */

            await new Promise(
              resolve =>
                setTimeout(
                  resolve,
                  2500
                )
            );
          }

          /*
          ===========================
          SHOW RESULTS
          ===========================
          */

          setResults({
            results:
              data.results
          });

          setTimeout(
            () => {

              navigate(
                "/results"
              );

            },
            3000
          );

        } catch (err) {

          setError(
            "Simulation failed"
          );

          console.error(
            err
          );
        }
      };

    startSimulation();

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
