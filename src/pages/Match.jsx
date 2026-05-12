import {
  useEffect,
  useState,
  useRef
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  startSimulation,
  getSimulationFeed
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

  const [
    starting,
    setStarting
  ] = useState(true);

  const startedRef =
    useRef(false);

  useEffect(() => {

    /*
    ===================================
    NO EVENT
    ===================================
    */

    if (!match?.eventId) {

      navigate("/");

      return;
    }

    /*
    ===================================
    PREVENT DOUBLE START
    ===================================
    */

    if (
      startedRef.current
    ) {

      return;
    }

    startedRef.current =
      true;

    let interval;

    const start =
      async () => {

        try {

          /*
          ===================================
          START BACKGROUND SIMULATION
          ===================================
          */

          await startSimulation(
            match.eventId
          );

          setStarting(false);

          /*
          ===================================
          POLL FEED
          ===================================
          */

          interval =
            setInterval(
              async () => {

                try {

                  const data =
                    await getSimulationFeed(
                      match.eventId
                    );

                  /*
                  ===================================
                  UPDATE FEED
                  ===================================
                  */

                  setFeed(
                    data.feed || []
                  );

                  /*
                  ===================================
                  LAST FEED ITEM
                  ===================================
                  */

                  const last =
                    data.feed?.[
                      data.feed.length - 1
                    ];

                  if (last) {

                    /*
                    ===================================
                    ROUND
                    ===================================
                    */

                    if (
                      last.round
                    ) {

                      setRound(
                        last.round
                      );
                    }

                    /*
                    ===================================
                    ALIVE COUNT
                    ===================================
                    */

                    if (
                      typeof last.aliveCount ===
                      "number"
                    ) {

                      setAlive(
                        last.aliveCount
                      );
                    }
                  }

                  /*
                  ===================================
                  MATCH COMPLETE
                  ===================================
                  */

                  if (
                    data.status ===
                    "ENDED"
                  ) {

                    clearInterval(
                      interval
                    );

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
                  }

                } catch (err) {

                  console.error(
                    err
                  );
                }

              },
              1000
            );

        } catch (err) {

          console.error(
            err
          );

          setError(
            "Failed to start simulation"
          );
        }
      };

    start();

    return () => {

      if (interval) {

        clearInterval(
          interval
        );
      }
    };

  }, []);

  return (

    <div className="app-container">

      <h1 className="title">
        {match?.theme ||
          "OUTLAST"}
      </h1>

      {/* MATCH INFO */}

      <div className="card">

        <p>
          Location:
          {" "}
          {
            match?.location ||
            "Unknown"
          }
        </p>

        <p>
          Danger:
          {" "}
          {
            match?.danger ||
            "HIGH"
          }
        </p>

        <p>
          Round:
          {" "}
          {round}
        </p>

        <p>
          Survivors:
          {" "}
          {alive}
        </p>

      </div>

      {/* STARTING */}

      {starting && (

        <div className="card">

          <h3>
            Arena Opening...
          </h3>

          <p>
            Survivors are entering
            the district.
          </p>

        </div>

      )}

      {/* ERROR */}

      {error && (

        <div className="card">

          {error}

        </div>

      )}

      {/* FEED */}

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
