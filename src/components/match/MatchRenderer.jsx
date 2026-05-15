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

  // PREVENT DOUBLE PLAYBACK
  const startedRef = useRef(false);

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

    // STOP STRICT MODE DOUBLE RUN
    if (startedRef.current) return;

    startedRef.current = true;

    // RESET
    setVisibleRounds([]);

    if (!autoPlay) {
      setVisibleRounds(rounds);
      return;
    }

    let mounted = true;

    const play = async () => {
      for (let i = 0; i < rounds.length; i++) {
        if (!mounted) return;

        setVisibleRounds((prev) => [
          ...prev,
          rounds[i]
        ]);

        // MATCH COMPLETE
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
  }, []);

  return (
    <>
      {visibleRounds.map((round, i) => (
        <RoundCard
          key={i}
          roundData={round}
        />
      ))}

      <div ref={bottomRef} />
    </>
  );
}
