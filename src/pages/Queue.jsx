import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  getMatchStatus
} from "../api/api";

import {
  useMatch
} from "../context/MatchContext";

export default function Queue() {

  const navigate =
    useNavigate();

  const {
    match,
    setMatch
  } = useMatch();

  const [
    timer,
    setTimer
  ] = useState(120);

  const [
    playerCount,
    setPlayerCount
  ] = useState(0);

  useEffect(() => {

    if (!match?.matchId)
      return;

    const poll =
      setInterval(
        async () => {

          try {

            const status =
              await getMatchStatus(
                match.matchId
              );

            setPlayerCount(
              status
                .alivePlayers
                ?.length || 0
            );

            setMatch({
              ...match,
              status:
                status.status
            });

            if (
              status.status ===
              "STARTED"
            ) {

              navigate(
                "/match"
              );
            }

          } catch (err) {

            console.error(err);
          }

        },
        2000
      );

    const countdown =
      setInterval(() => {

        setTimer(prev => {

          if (prev <= 1)
            return 0;

          return prev - 1;
        });

      }, 1000);

    return () => {

      clearInterval(poll);

      clearInterval(
        countdown
      );
    };

  }, []);

  return (
    <div className="app-container center"
      style={{
        flexDirection: "column"
      }}
    >

      <h1 className="title">
        MATCHMAKING
      </h1>

      <div className="card">

        <h2>
          {timer}s
        </h2>

        <p>
          Players:
          {" "}
          {playerCount}/20
        </p>

        <p>
          Waiting for match
          start...
        </p>

      </div>

    </div>
  );
}
