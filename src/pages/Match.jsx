import {
  useEffect,
  useState,
  useRef
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  getEventFeed
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

    const loadMatch =
      async () => {

        try {

          /*
          ===================================
          GET FULL FEED
          ===================================
          */

          const data =
            await getEventFeed(
              match.eventId
            );

          setStarting(false);

          /*
          ===================================
          STREAM FEED LOCALLY
          ===================================
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
            ===================================
            ROUND
            ===================================
            */

            if (
              item.round
            ) {

              setRound(
                item.round
              );
            }

            /*
            ===================================
            ALIVE
            ===================================
            */

            if (
              typeof item.aliveCount ===
              "number"
            ) {

              setAlive(
                item.aliveCount
              );
            }

            /*
            ===================================
            FEED SPEED
            ===================================
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
          ===================================
          RESULTS
          ===================================
          */

          setResults({
            results:
              data.finalResults || []
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

          console.error(
            err
          );

          setError(
            "Failed to load match"
          );
        }
      };

    loadMatch();

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
