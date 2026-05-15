import FeedEvent from “./FeedEvent”;

export default function RoundCard({ roundData }) {
// ========================================
// INTRO CARD
// ========================================
if (roundData.type === “INTRO”) {
return (
<div className="round-card round-card-intro">
{roundData.events.map((ev, i) => (
<div
key={i}
style={{
fontFamily: “Bebas Neue, sans-serif”,
fontSize: i === 0 ? 22 : 16,
letterSpacing: i === 0 ? 3 : 1,
color:
i === 0
? “var(–accent, #90d870)”
: “rgba(200,190,160,0.6)”,
marginBottom: 6,
textAlign: “center”
}}
>
{ev.message}
</div>
))}
</div>
);
}

// ========================================
// MATCH END CARD
// ========================================
if (roundData.type === “MATCH_END”) {
return (
<div className="round-card round-card-end">
<div
style={{
fontFamily: “Bebas Neue, sans-serif”,
fontSize: 26,
letterSpacing: 5,
textAlign: “center”,
color: “rgba(230,200,180,0.9)”,
marginBottom: 6
}}
>
MATCH COMPLETE
</div>

```
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
```

}

// ========================================
// REGULAR ROUND CARD
// ========================================
return (
<div className="round-card">
{/* HEADER - Round number + count */}
<div className="round-header">
<span className="round-number">— ROUND {roundData.round} —</span>
<span className="round-count">{roundData.aliveCount} remain</span>
</div>

```
  {/* NARRATION - optional atmosphere */}
  {roundData.narration && (
    <div className="round-narration">
      {roundData.narration}
    </div>
  )}

  {/* EVENTS SEQUENCE */}
  <div className="feed-sequence">
    {roundData.events.map((event, i) => (
      <FeedEvent key={i} event={event} />
    ))}
  </div>

  {/* ELIMINATED PLAYERS - ALWAYS AT BOTTOM */}
  {roundData.eliminated && roundData.eliminated.length > 0 && (
    <div className="elim-footer">
      {roundData.eliminated.map((name, i) => (
        <span key={i} className="elim-name">
          {name}
        </span>
      ))}
    </div>
  )}
</div>
```

);
}
