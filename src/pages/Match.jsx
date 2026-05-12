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

const FEED_SPEED = 2200;

/*
===================================
FEED ITEM COMPONENT
===================================
*/

function FeedItem({ item }) {

  /*
  ===================================
  FEED STYLE
  ===================================
  */

  const getClass =
    () => {

      switch (item.type) {

        case "ELIMINATION":
          return "feed-item feed-item-elimination";

        case "FUNNY_DEATH":
          return "feed-item feed-item-funny";

        case "SURVIVAL":
          return "feed-item feed-item-survival";

        case "ROUND_START":
          return "feed-item feed-item-round";

        case "MATCH_END":
          return "feed-item feed-item-match-end";

        default:
          return "feed-item feed-item-narrator";
      }
    };

  /*
  ===================================
  FORMAT FEED TEXT
  ===================================
  */

  const formatMessage =
    message => {

      if (!message)
        return "";

      let formatted =
        message;

      /*
      ===================================
      PLAYER NAMES
      ===================================
      */

      formatted =
        formatted.replace(

          /@(\w+)/g,

          `
          <span
            style="
              color: var(--red);
              font-weight: 700;
            "
          >
            @$1
          </span>
          `
        );

      /*
      ===================================
      WEAPONS / TOOLS
      ===================================
      */

      formatted =
        formatted.replace(

          /\b(Knife|Shield|Smoke|Scanner|Machete|Bottle|Bat|Pistol|Rifle|Trap)\b/gi,

          `
          <span
            style="
              color: var(--purple);
              font-weight: 700;
            "
          >
            $1
          </span>
          `
        );

      /*
      ===================================
      LOCATIONS
      ===================================
      */

      formatted =
        formatted.replace(

          /\b(lake|bridge|market|hospital|street|rooftop|warehouse|slum|alley|station)\b/gi,

          `
          <span
            style="
              color: var(--orange);
              font-weight: 700;
            "
          >
            $1
          </span>
          `
        );

      /*
      ===================================
      ELIMINATION WORDS
      ===================================
      */

      formatted =
        formatted.replace(

          /\b(eliminated|killed|destroyed|attacked|ambushed|stabbed|crushed)\b/gi,

          `
          <span
            style="
              color: var(--red);
              font-weight: 800;
            "
          >
            $1
          </span>
          `
        );

      /*
      ===================================
      SURVIVAL WORDS
      ===================================
      */

      formatted =
        formatted.replace(

          /\b(survived|escaped|hid|healed|revived)\b/gi,

          `
          <span
            style="
              color: var(--green);
              font-weight: 700;
            "
          >
            $1
          </span>
          `
        );

      return formatted;
    };

  /*
  ===================================
  ROUND CARD
  ===================================
  */

  if (
    item.type ===
    "ROUND_START"
  ) {

    return (

      <div className={getClass()}>

        <div className="round-banner">

          {item.message}

        </div>

      </div>
    );
  }

  /*
  ===================================
  NORMAL FEED ITEM
  ===================================
  */

  return (

    <div className={getClass()}>

      <div
        dangerouslySetInnerHTML={{
          __html:
            formatMessage(
              item.message
            )
        }}
      />

    </div>
  );
}

export default function Match() {

  const navigate =
    useNavigate();

  const {
    match,
    feed,
    setFeed,
    setResults,
    clearMatch
  } = useMatch();

  const [
    round,
    setRound
  ] = useState(1);

  const [
    alive,
    setAlive
  ] = useState(
    match?.maxPlayers || 20
  );

  const [
    error,
    setError
  ] = useState("");

  const [
    starting,
    setStarting
  ] = useState(true);

  const [
    complete,
    setComplete
  ] = useState(false);

  const startedRef =
    useRef(false);

  const feedRef =
    useRef(null);

  /*
  ===================================
  AUTO SCROLL
  ===================================
  */

  useEffect(() => {

    if (
      feedRef.current
    ) {

      feedRef.current.scrollTop =
        feedRef.current.scrollHeight;
    }

  }, [feed]);

  /*
  ===================================
  LOAD MATCH
  ===================================
  */

  useEffect(() => {

    /*
    ===================================
    NO EVENT
    ===================================
    */

    if (!match?.eventId) {

      navigate("/", {
        replace: true
      });

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
                  FEED_SPEED
                )
            );
          }

          /*
          ===================================
          STORE RESULTS
          ===================================
          */

          setResults({
            results:
              data.finalResults || []
          });

          /*
          ===================================
          SAVE MATCH HISTORY
          ===================================
          */

          const history =
            JSON.parse(
              localStorage.getItem(
                "outlast_history"
              ) || "[]"
            );

          history.unshift({

            theme:
              match?.theme,

            location:
              match?.location,

            danger:
              match?.danger,

            winner:
              data.finalResults?.[0]
                ?.username ||
              "Unknown",

            totalPlayers:
              data.finalResults
                ?.length || 0,

            rounds:
              round,

            date:
              new Date()
                .toLocaleString(),

            feed:
              data.feed || [],

            results:
              data.finalResults || []

          });

          /*
          ===================================
          LIMIT HISTORY
          ===================================
          */

          localStorage.setItem(
            "outlast_history",
            JSON.stringify(
              history.slice(0, 20)
            )
          );

          /*
          ===================================
          MATCH COMPLETE
          ===================================
          */

          setComplete(true);

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

    <div className="page">

      {/* HEADER */}

      <div
        style={{
          marginBottom: 20
        }}
      >

        <h1
          className="title"
          style={{
            marginBottom: 12
          }}
        >

          {match?.theme ||
            "OUTLAST"}

        </h1>

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap"
          }}
        >

          <span className="badge badge-blue">

            📍 {match?.location}

          </span>

          <span className="badge badge-purple">

            ROUND {round}

          </span>

          <span className="badge badge-red">

            ☠ {alive} ALIVE

          </span>

        </div>

      </div>

      {/* MATCH INFO */}

      <div className="card">

        <p>

          Danger:
          {" "}

          {match?.danger ||
            "HIGH"}

        </p>

        <p
          style={{
            marginTop: 8,
            color: "var(--text2)"
          }}
        >

          Survivors are trapped
          inside the district.

        </p>

      </div>

      {/* STARTING */}

      {starting && (

        <div className="card">

          <h3>

            Arena Opening...

          </h3>

          <p
            style={{
              marginTop: 10
            }}
          >

            Survivors are entering
            the district.

          </p>

        </div>

      )}

      {/* ERROR */}

      {error && (

        <div className="error-card">

          {error}

        </div>

      )}

      {/* FEED */}

      <div ref={feedRef}>

        {feed.map(
          (
            item,
            index
          ) => (

            <FeedItem
              key={index}
              item={item}
            />

          )
        )}

      </div>

      {/* MATCH COMPLETE */}

      {complete && (

        <div
          style={{
            marginTop: 20
          }}
        >

          <div
            className="card"
            style={{
              textAlign:
                "center"
            }}
          >

            <h2>

              MATCH COMPLETE

            </h2>

            <p
              style={{
                marginTop: 10,
                color:
                  "var(--text2)"
              }}
            >

              The district has gone silent.

            </p>

          </div>

          <button
            className="btn-primary"
            style={{
              marginTop: 12
            }}
            onClick={() =>
              navigate(
                "/results",
                {
                  replace: true
                }
              )
            }
          >

            VIEW RESULTS

          </button>

          <button
            className="btn-secondary"
            style={{
              marginTop: 10
            }}
            onClick={() => {

              clearMatch();

              navigate(
                "/",
                {
                  replace: true
                }
              );

            }}
          >

            RETURN HOME

          </button>

        </div>

      )}

    </div>
  );
}
