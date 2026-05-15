import FeedEvent from "./FeedEvent";

export default function RoundCard({
  roundData
}) {

  // INTRO
  if (roundData.type === "INTRO") {

    return (

      <div className="round-card round-card-intro">

        {roundData.events.map((ev, i) => (

          <div
            key={i}
            style={{
              fontFamily: "Bebas Neue, sans-serif",
              fontSize: i === 0 ? 22 : 16,
              letterSpacing: i === 0 ? 3 : 1,
              color:
                i === 0
                  ? "var(--accent, #90d870)"
                  : "rgba(200,190,160,0.6)",
              marginBottom: 6,
              textAlign: "center"
            }}
          >
            {ev.message}
          </div>

        ))}

      </div>
    );
  }

  // MATCH END
  if (roundData.type === "MATCH_END") {

    return (

      <div className="round-card round-card-end">

        <div
          style={{
            fontFamily: "Bebas Neue, sans-serif",
            fontSize: 26,
            letterSpacing: 5,
            textAlign: "center",
            color: "rgba(230,200,180,0.9)",
            marginBottom: 6
          }}
        >
          MATCH COMPLETE
        </div>

        {roundData.winner && (

          <div
            style={{
              textAlign: "center",
              fontSize: 14,
              color: "rgba(180,160,140,0.5)",
              fontStyle: "italic"
            }}
          >
            {roundData.winner} survived.
          </div>

        )}

      </div>
    );
  }

  return (

    <div className="round-card">

      {/* HEADER */}
      <div className="round-header">

        <span className="round-number">
          — ROUND {roundData.round} —
        </span>

        <span className="round-count">
          {roundData.aliveCount} remain
        </span>

      </div>

      {/* NARRATION */}
      {roundData.narration && (

        <div
          className="round-narration"
          style={{
            fontWeight: 600,
            color: "rgba(220,210,190,0.72)"
          }}
        >
          {roundData.narration}
        </div>

      )}

      {/* EVENTS */}
      <div className="feed-sequence">

        {roundData.events.map((event, i) => (

          <FeedEvent
            key={i}
            event={event}
          />

        ))}

      </div>

      {/* ELIMINATED */}
      {roundData.eliminated?.length > 0 && (

        <div className="elim-footer">

          {roundData.eliminated.map((name, i) => (

            <span
              key={i}
              className="elim-name"
            >
              {name}
            </span>

          ))}

        </div>

      )}

    </div>
  );
}
