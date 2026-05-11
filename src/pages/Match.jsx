import {
  useEffect,
  useState,
  useRef
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  simulateMatch
} from "../api/api";

import {
  useMatch
} from "../context/MatchContext";

export default function Match() {

  const navigate = useNavigate();

  const {
    match,
    feed,
    setFeed,
    setResults
  } = useMatch();

  const [round, setRound] = useState(1);
  const [alive, setAlive] = useState(20);
  const [error, setError] = useState("");
  const [starting, setStarting] = useState(true);

  const startedRef = useRef(false);

  useEffect(() => {

    if (!match?.eventId) {
      navigate("/");
      return;
    }

    if (startedRef.current) return;
    startedRef.current = true;

    const startSimulation = async () => {
      try {

        const data = await simulateMatch(match.eventId);

        setStarting(false);

        let currentFeed = [];

        for (let i = 0; i < data.feed.length; i++) {

          const item = data.feed[i];

          currentFeed = [...currentFeed, item];
          setFeed(currentFeed);

          if (item.round) setRound(item.round);

          if (item.aliveCount) {
            setAlive(item.aliveCount);
          } else if (item.message?.includes("PLAYERS REMAIN")) {
            const number = parseInt(item.message);
            if (!isNaN(number)) setAlive(number);
          }

          await new Promise(resolve => setTimeout(resolve, 2500));
        }

        setResults({ results: data.results });

        setTimeout(() => navigate("/results"), 4000);

      } catch (err) {
        console.error(err);
        setError(err.message || "Simulation failed");
      }
    };

    startSimulation();

  }, []);

  return (
    <div className="app-container">

      <h1 className="title">
        {match?.theme || "OUTLAST"}
      </h1>

      <div className="card">
        <p>Location: {match?.location || "Unknown"}</p>
        <p>Danger: {match?.danger || "HIGH"}</p>
        <p>Round: {round}</p>
        <p>Survivors: {alive}</p>
      </div>

      {starting && (
        <div className="card">
          <h3>Arena Opening...</h3>
          <p>Survivors are entering the district.</p>
        </div>
      )}

      {error && (
        <div className="card">{error}</div>
      )}

      <div>
        {feed.map((item, index) => (
          <div key={index} className="feed-item">
            {item.message}
          </div>
        ))}
      </div>

    </div>
  );
}
