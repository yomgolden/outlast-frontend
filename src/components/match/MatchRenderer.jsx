import { useEffect, useRef, useState } from "react";
import RoundCard from "./RoundCard";

export default function MatchRenderer({
  rounds = [],
  roundDelay = 6000,
  autoPlay = true,
  onComplete
}) {
  const [visibleRounds, setVisibleRounds] = useState([]);
  const bottomRef = useRef(null);

  // AUTO SCROLL
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({
        behavior: "smooth"
      });
    }
  }, [visibleRounds]);

  // RENDER SEQUENCE
  useEffect(() => {
    if (!rounds.length) return;

    // RESET FIRST
    setVisibleRounds([]);

    if (!autoPlay) {
      setVisibleRounds(rounds);
      return;
    }

    let mounted = true;

    const play = async () => {
      for (let i = 0; i < rounds.length; i++) {
        if (!mounted) return;

        setVisibleRounds((prev) => {
          // Prevent duplicates
          if (prev.find((r) => r.round === rounds[i].round)) {
            return prev;
          }

          return [...prev, rounds[i]];
        });

        // STOP AT MATCH END
        if (rounds[i].type === "MATCH_END") {
          onComplete?.();
          return;
        }

        await new Promise((resolve) =>
          setTimeout(resolve, roundDelay)
        );
      }
    };

    play();

    return () => {
      mounted = false;
    };
  }, [rounds, roundDelay, autoPlay, onComplete]);

  return (
    <>
      {visibleRounds.map((round, i) => (
        <RoundCard key={i} roundData={round} />
      ))}

      <div ref={bottomRef} />
    </>
  );
}
