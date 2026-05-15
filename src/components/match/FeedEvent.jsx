import React from “react”;

export default function FeedEvent({ event }) {
// Skip ROUND markers (handled by RoundCard header)
if (event.type === “ROUND” || event.type === “round”) {
return null;
}

// ========================================
// NARRATION - italic, muted
// ========================================
if (event.type === “NARRATION” || event.type === “narration”) {
return (
<div className="feed-narration">
{event.message || event.text}
</div>
);
}

// ========================================
// WORLD EVENT - small, centered dot
// ========================================
if (event.type === “WORLD_EVENT” || event.type === “world”) {
return (
<div className="feed-world">
<div className="feed-world-dot" />
<span>{event.message || event.text}</span>
</div>
);
}

// ========================================
// SYSTEM (round end summary)
// ========================================
if (event.type === “SYSTEM” || event.type === “system”) {
return (
<div className="feed-system">
{event.message || event.text}
</div>
);
}

// ========================================
// SURVIVAL - green highlight
// ========================================
if (event.type === “SURVIVAL” || event.type === “survival”) {
let html = event.message || event.text;
// Bold the survivor name
if (event.victim) {
const escapedName = event.victim.replace(/[.*+?^${}()|[]\]/g, “\$&”);
html = html.replace(
new RegExp(`\\b${escapedName}\\b`, “g”),
`<span class="ns">${event.victim}</span>`
);
}
return (
<div className="feed-survival">
<span className="feed-icon">🌿</span>
<span className=“feed-text” dangerouslySetInnerHTML={{ __html: html }} />
</div>
);
}

// ========================================
// FUNNY DEATH - orange, strikethrough victim
// ========================================
if (event.type === “FUNNY_DEATH” || event.type === “funny”) {
let html = event.message || event.text;
if (event.victim) {
const escapedVictim = event.victim.replace(/[.*+?^${}()|[]\]/g, “\$&”);
html = html.replace(
new RegExp(`\\b${escapedVictim}\\b`, “g”),
`<span class="nv">${event.victim}</span>`
);
}
return (
<div className="feed-funny">
<span className="feed-icon">💀</span>
<span className=“feed-text” dangerouslySetInnerHTML={{ __html: html }} />
</div>
);
}

// ========================================
// ELIMINATION - red killer, strikethrough victim
// ========================================
if (event.type === “ELIMINATION” || event.type === “elimination”) {
let html = event.message || event.text;

```
// Bold killer (red)
if (event.killer) {
  const escapedKiller = event.killer.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  html = html.replace(
    new RegExp(`\\b${escapedKiller}\\b`, "g"),
    `<span class="nk">${event.killer}</span>`
  );
}

// Strikethrough victim
if (event.victim) {
  const escapedVictim = event.victim.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  html = html.replace(
    new RegExp(`\\b${escapedVictim}\\b`, "g"),
    `<span class="nv">${event.victim}</span>`
  );
}

return (
  <div className="feed-kill">
    <span className="feed-icon">⚔️</span>
    <span className="feed-text" dangerouslySetInnerHTML={{ __html: html }} />
  </div>
);
```

}

// Fallback - shouldn’t reach here
return null;
}
