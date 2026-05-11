import {
  useEffect,
  useState
} from "react";

import {
  getMatchFeed,
  simulateMatch
} from "../api/api";

import {
  useMatch
} from "../context/MatchContext";

import FeedCard from "../components/FeedCard";

export default function Match() {

  const { match } = useMatch();

  const [feed, setFeed] =
    useState([]);

  const [round, setRound] =
    useState(1);

  useEffect(() => {

    const start = async () => {

      await simulateMatch(
        match.matchId
      );

      const feedData =
        await getMatchFeed(
          match.matchId
        );

      setFeed(feedData);
    };

    start();

  }, []);

  return (
    <div className="app-container">

      <h1 className="title">
        LIVE MATCH
      </h1>

      <div className="card">
        <p>Round: {round}</p>
      </div>

      <div>
        {feed.map((item, index) => (
          <FeedCard
            key={index}
            message={item.message}
          />
        ))}
      </div>

    </div>
  );
}
