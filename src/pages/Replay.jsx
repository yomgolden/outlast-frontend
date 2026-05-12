import {
  useEffect,
  useState,
  useRef
} from "react";

import {
  useParams,
  useNavigate
} from "react-router-dom";

const FEED_SPEED = 1800;

function FeedItem({ item }) {

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

  return (

    <div className={getClass()}>

      {item.message}

    </div>
  );
}

export default function Replay() {

  const {
    id
  } = useParams();

  const navigate =
    useNavigate();

  const [
    match,
    setMatch
  ] = useState(null);

  const [
    visibleFeed,
    setVisibleFeed
  ] = useState([]);

  const [
    loading,
    setLoading
  ] = useState(true);

  const feedRef =
    useRef(null);

  /*
  =====================================
  AUTO SCROLL
  =====================================
  */

  useEffect(() => {

    if (
      feedRef.current
    ) {

      feedRef.current.scrollTop =
        feedRef.current.scrollHeight;
    }

  }, [visibleFeed]);

  /*
  =====================================
  LOAD REPLAY
  =====================================
  */

  useEffect(() => {

    const history =
      JSON.parse(
        localStorage.getItem(
          "outlast_history"
        ) || "[]"
      );

    const selected =
      history[id];

    if (!selected) {

      navigate(
        "/history"
      );

      return;
    }

    setMatch(selected);

    const replay =
      async () => {

        setLoading(false);

        let current =
          [];

        for (
          let i = 0;
          i <
          selected.feed.length;
          i++
        ) {

          current = [
            ...current,
            selected.feed[i]
          ];

          setVisibleFeed(
            current
          );

          await new Promise(
            resolve =>
              setTimeout(
                resolve,
                FEED_SPEED
              )
          );
        }
      };

    replay();

  }, []);

  if (
    loading ||
    !match
  ) {

    return (

      <div className="page">

        <div className="card">

          Loading replay...

        </div>

      </div>
    );
  }

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

          REPLAY

        </h1>

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap"
          }}
        >

          <span className="badge badge-blue">

            📍 {match.location}

          </span>

          <span className="badge badge-red">

            {match.danger}

          </span>

        </div>

      </div>

      {/* MATCH INFO */}

      <div className="card">

        <h3>

          {match.theme}

        </h3>

        <p
          style={{
            marginTop: 10
          }}
        >

          Winner:
          {" "}
          @{match.winner}

        </p>

        <p
          style={{
            marginTop: 6
          }}
        >

          Survivors:
          {" "}
          {match.totalPlayers}

        </p>

        <p
          style={{
            marginTop: 6
          }}
        >

          Rounds:
          {" "}
          {match.rounds}

        </p>

      </div>

      {/* FEED */}

      <div ref={feedRef}>

        {
          visibleFeed.map(
            (
              item,
              index
            ) => (

              <FeedItem
                key={index}
                item={item}
              />

            )
          )
        }

      </div>

      {/* BUTTON */}

      <button
        className="btn-secondary"
        style={{
          marginTop: 20
        }}
        onClick={() =>
          navigate(
            "/history"
          )
        }
      >

        BACK TO HISTORY

      </button>

    </div>
  );
}
