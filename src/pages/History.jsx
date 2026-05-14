// MATCH END
if (round.type === "MATCH_END") {

  // SAVE HISTORY USING STREAMED ROUNDS
  console.log(
    "SAVING STORY ROUNDS:",
    visibleRounds
  );

  const history = JSON.parse(
    localStorage.getItem("outlast_history") || "[]"
  );

  history.unshift({
    theme: match?.theme,
    location: match?.location,
    danger: match?.danger,
    winner:
      data.finalResults?.[0]?.username || "Unknown",
    totalPlayers:
      data.finalResults?.length || 0,
    date: new Date().toLocaleString(),

    // IMPORTANT FIX
    storyRounds: [
      ...visibleRounds,
      round
    ],

    results: data.finalResults || []
  });

  localStorage.setItem(
    "outlast_history",
    JSON.stringify(history.slice(0, 20))
  );

  setResults({
    results: data.finalResults || []
  });

  setComplete(true);

  localStorage.setItem(
    `match_seen_${match.eventId}`,
    "true"
  );

  break;
}
