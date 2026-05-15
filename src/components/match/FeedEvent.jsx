import React from "react";

export default function FeedEvent({ event }) {
  // Skip ROUND markers (handled by RoundCard header)
  if (event.type === "ROUND" || event.type === "round") {
    return null;
  }

  // Skip duplicate narration
  if (event.type === "NARRATION" || event.type === "narration") {
    return null;
  }

  // Escape regex special chars
  const escapeRegex = (text) => {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  // ========================================
  // WORLD EVENT - blend with normal events
  // ========================================
  if (event.type === "WORLD_EVENT" || event.type === "world") {
    return (
      <div className="feed-event">
        <span className="feed-text">
          {event.message || event.text}
        </span>
      </div>
    );
  }

  // ========================================
  // SYSTEM (round end summary)
  // ========================================
  if (event.type === "SYSTEM" || event.type === "system") {
    return (
      <div className="feed-system">
        {event.message || event.text}
      </div>
    );
  }

  // ========================================
  // SURVIVAL - plain text
  // ========================================
  if (event.type === "SURVIVAL" || event.type === "survival") {
    let html = event.message || event.text;

    // Bold survivor
    if (event.victim) {
      const escapedName = escapeRegex(event.victim);

      html = html.replace(
        new RegExp(`\\b${escapedName}\\b`, "g"),
        `<strong>${event.victim}</strong>`
      );
    }

    return (
      <div className="feed-event">
        <span
          className="feed-text"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    );
  }

  // ========================================
  // FUNNY DEATH - strikethrough victim
  // ========================================
  if (event.type === "FUNNY_DEATH" || event.type === "funny") {
    let html = event.message || event.text;

    if (event.victim) {
      const escapedVictim = escapeRegex(event.victim);

      html = html.replace(
        new RegExp(`\\b${escapedVictim}\\b`, "g"),
        `<strong><strike>${event.victim}</strike></strong>`
      );
    }

    return (
      <div className="feed-event">
        <span
          className="feed-text"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    );
  }

  // ========================================
  // ELIMINATION - bold killer, strike victim
  // ========================================
  if (event.type === "ELIMINATION" || event.type === "elimination") {
    let html = event.message || event.text;

    // Bold killer
    if (event.killer) {
      const escapedKiller = escapeRegex(event.killer);

      html = html.replace(
        new RegExp(`\\b${escapedKiller}\\b`, "g"),
        `<strong>${event.killer}</strong>`
      );
    }

    // Strike victim
    if (event.victim) {
      const escapedVictim = escapeRegex(event.victim);

      html = html.replace(
        new RegExp(`\\b${escapedVictim}\\b`, "g"),
        `<strong><strike>${event.victim}</strike></strong>`
      );
    }

    return (
      <div className="feed-event">
        <span
          className="feed-text"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    );
  }

  // Fallback
  return null;
}
