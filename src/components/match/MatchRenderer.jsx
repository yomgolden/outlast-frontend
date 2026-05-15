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
    if (!autoPlay) {
      setVisibleRounds(rounds);
      return;
    }

    let mounted = true;

    const play = async () => {
      for (let i = 0; i < rounds.length; i++) {
        if (!mounted) return;

        setVisibleRounds((prev) => [...prev, rounds[i]]);

        if (rounds[i].type === "MATCH_END") {
          onComplete?.();
          break;
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
