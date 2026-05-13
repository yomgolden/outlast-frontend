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
  FEED CLASS
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
  ICONS
  ===================================
  */

  const getIcon =
    () => {

      switch (item.type) {

        case "ELIMINATION":
          return "☠";

        case "FUNNY_DEATH":
          return "💀";

        case "SURVIVAL":
          return "✓";

        case "MATCH_END":
          return "🏆";

        default:
          return "";
      }
    };

  /*
  ===================================
  FEED FORMATTER
  ===================================
  */

  const formatMessage =
    (message) => {

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

          /\b([A-Z][a-zA-Z0-9]+)\b/g,

          `
          <span
            style="
              color: #ffffff;
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

          /\b(eliminated|killed|destroyed|attacked|ambushed|stabbed|crushed|died)\b/gi,

          `
          <span
            style="
              color: #ff4d4d;
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

          /\b(survived|escaped|hid|revived)\b/gi,

          `
          <span
            style="
              color: #22c55e;
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

          /\b(Ibadan|Makoko|Yaba|Aba|Lekki|Ajegunle|Surulere|Ikorodu|Mushin)\b/gi,

          `
          <span
            style="
              color: #f97316;
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

      <div
        className={getClass()}
        style={{
          animation:
            "fadeSlideIn 0.4s ease"
        }}
      >

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

    <div
      className={getClass()}
      style={{
        animation:
          "fadeSlideIn 0.4s ease"
      }}
    >

      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "flex-start"
        }}
      >

        <div
          style={{
            fontSize: 18,
            opacity: 0.9,
            marginTop: 2
          }}
        >

          {getIcon()}

        </div>

        <div
          style={{
            flex: 1,
            lineHeight: 1.8
          }}
          dangerouslySetInnerHTML={{
            __html:
              formatMessage(
                item.message
              )
          }}
        />

      </div>

    </div>
  );
}

/*
===================================
MATCH PAGE
===================================
*/

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
    NO MATCH
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
    PREVENT DOUBLE LOAD
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
          FETCH EVENT
          ===================================
          */

          const data =
            await getEventFeed(
              match.eventId
            );

          /*
          ===================================
          EVENT DELETED
          ===================================
          */

          if (
            !data ||
            data.error
          ) {

            clearMatch();

            navigate("/", {
              replace: true
            });

            return;
          }

          /*
          ===================================
          MATCH FINISHED
          ===================================
          */

          if (
            data.status === "ENDED" &&
            data.finalResults
          ) {

            setResults({
              results:
                data.finalResults
            });

            navigate(
              "/results",
              {
                replace: true
              }
            );

            return;
          }

          /*
          ===================================
          START MATCH
          ===================================
          */

          setStarting(false);

          /*
          ===================================
          STREAM FEED
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
            ALIVE COUNT
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
            DELAY
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
          RESULTS
          ===================================
          */

          setResults({
            results:
              data.finalResults || []
          });

          /*
          ===================================
          COMPLETE
          ===================================
          */

          setComplete(true);

        } catch (err) {

          console.error(
            "MATCH LOAD ERROR:",
            err
          );

          setError(
            "Failed to load match"
          );

          /*
          ===================================
          AUTO RETURN HOME
          ===================================
          */

          setTimeout(() => {

            clearMatch();

            navigate("/", {
              replace: true
            });

          }, 2000);
        }
      };

    loadMatch();

  }, []);

  /*
  ===================================
  UI
  ===================================
  */

  return (

    <div className="page">

      {/* HEADER */}

      <div
        style={{
          marginBottom: 20
        }}
      >

        <div
          className="game-title"
          style={{
            marginBottom: 12
          }}
        >

          {match?.theme ||
            "OUTLAST"}

        </div>

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

        <p
          style={{
            fontSize: 18,
            fontWeight: 700
          }}
        >

          Danger:
          {" "}

          <span
            style={{
              color:
                match?.danger ===
                "EXTREME"

                  ? "var(--red)"

                  : match?.danger ===
                    "HIGH"

                  ? "var(--orange)"

                  : "var(--gold)"
            }}
          >

            {match?.danger ||
              "HIGH"}

          </span>

        </p>

        <p
          style={{
            marginTop: 10,
            color: "var(--text2)",
            lineHeight: 1.7,
            fontStyle: "italic"
          }}
        >

          Survivors are trapped
          inside the district.

        </p>

      </div>

      {/* STARTING */}

      {starting && (

        <div
          className="card"
          style={{
            textAlign:
              "center"
          }}
        >

          <div
            style={{
              fontSize: 40,
              marginBottom: 10
            }}
          >

            ⚡

          </div>

          <h3>

            Arena Opening...

          </h3>

          <p
            style={{
              marginTop: 10,
              color:
                "var(--text2)"
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
            marginTop: 24
          }}
        >

          <div
            className="card"
            style={{
              textAlign:
                "center",

              background:
                "linear-gradient(135deg, rgba(239,68,68,0.12), rgba(168,85,247,0.08))",

              border:
                "1px solid rgba(239,68,68,0.25)"
            }}
          >

            <div
              style={{
                fontSize: 42,
                marginBottom: 10
              }}
            >

              ☠

            </div>

            <h2
              style={{
                fontSize: 28,
                letterSpacing: 3
              }}
            >

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
              marginTop: 14
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
