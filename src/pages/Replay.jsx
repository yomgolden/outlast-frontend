import {
  useEffect,
  useState
} from "react";

import {
  useParams,
  useNavigate
} from "react-router-dom";

import MatchRenderer from "../components/match/MatchRenderer";

const ROUND_DELAY = 2000;

export default function Replay() {

  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const [match, setMatch] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  /*
  =====================================
  LOAD MATCH
  =====================================
  */

  useEffect(() => {

    const history = JSON.parse(
      localStorage.getItem(
        "outlast_history"
      ) || "[]"
    );

    const selected =
      history[parseInt(id)];

    if (!selected) {

      navigate("/history");

      return;
    }

    setMatch(selected);

    setLoading(false);

  }, []);

  /*
  =====================================
  LOADING
  =====================================
  */

  if (loading || !match) {

    return (

      <div className="page">

        <div
          className="card"
          style={{
            textAlign: "center",
            padding: "32px 16px"
          }}
        >

          <div
            style={{
              color: "var(--text3)"
            }}
          >
            Loading replay...
          </div>

        </div>

      </div>
    );
  }

  return (

    <div className="page">

      {/* HEADER */}

      <div
        style={{
          marginBottom: 16
        }}
      >

        <div
          style={{
            fontFamily:
              "Bebas Neue, sans-serif",

            fontSize: 14,

            letterSpacing: 3,

            color: "var(--text3)",

            marginBottom: 6
          }}
        >
          REPLAY
        </div>

        <div
          style={{
            fontFamily:
              "Bebas Neue, sans-serif",

            fontSize: 28,

            letterSpacing: 3,

            marginBottom: 10
          }}
        >
          {match.theme}
        </div>

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

          {match.winner && (

            <span className="badge badge-gold">
              🏆 {match.winner}
            </span>

          )}

        </div>

      </div>

      {/* MATCH RENDERER */}

      <MatchRenderer
        rounds={match.storyRounds || []}
        roundDelay={ROUND_DELAY}
      />

      {/* FOOTER */}

      <button
        className="btn-secondary"
        style={{
          marginTop: 16
        }}
        onClick={() =>
          navigate("/history")
        }
      >
        BACK TO HISTORY
      </button>

    </div>
  );
}
