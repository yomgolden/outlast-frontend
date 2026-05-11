import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  useMatch
} from "../context/MatchContext";

export default function Queue() {

  const navigate = useNavigate();

  const { match } = useMatch();

  const [timer, setTimer] =
    useState(120);

  useEffect(() => {

    const interval =
      setInterval(() => {

        setTimer(prev => {

          if (prev <= 1) {

            clearInterval(interval);

            navigate("/match");

            return 0;
          }

          return prev - 1;
        });

      }, 1000);

    return () =>
      clearInterval(interval);

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
        <h2>{timer}s</h2>

        <p>
          Waiting for players...
        </p>

        <p>
          Match ID:
          {match?.matchId}
        </p>
      </div>

    </div>
  );
}
