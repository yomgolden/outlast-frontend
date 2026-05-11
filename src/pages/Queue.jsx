import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  getEventStatus
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
    countdown,
    setCountdown
  ] = useState(60);

  const [
    players,
    setPlayers
  ] = useState([]);

  const [
    status,
    setStatus
  ] = useState("WAITING");

  /*
  =======================================
  POLLING
  =======================================
  */

  useEffect(() => {

    if (!match?.eventId)
      return;

    const poll =
      setInterval(
        async () => {

          try {

            const data =
              await getEventStatus(
                match.eventId
              );

            setPlayers(
              data.players || []
            );

            setCountdown(
              data.countdown || 0
            );

            setStatus(
              data.status
            );

            setMatch({
              ...match,
              ...data
            });

            /*
            =======================================
            MATCH START
            =======================================
            */

            if (
              data.status ===
              "STARTED"
            ) {

              clearInterval(
                poll
              );

              navigate(
                "/match"
              );
            }

          } catch (err) {

            console.error(
              err
            );
          }

        },
        2000
      );

    return () => {

      clearInterval(
        poll
      );
    };

  }, []);

  return (

    <div
      className="app-container center"
      style={{
        flexDirection:
          "column"
      }}
    >

      <h1 className="title">
        {match?.theme ||
          "SURVIVAL EVENT"}
      </h1>

      {/* EVENT INFO */}

      <div className="card">

        <h2>
          {countdown}s
        </h2>

        <p>
          Location:
          {" "}
          {
            match?.location
          }
        </p>

        <p>
          Danger:
          {" "}
          {
            match?.danger
          }
        </p>

        <p>
          Survivors:
          {" "}
          {
            players.length
          }
          /
          {
            match?.maxPlayers ||
            20
          }
        </p>

        <p>
          Status:
          {" "}
          {status}
        </p>

      </div>

      {/* SURVIVOR LIST */}

      <div
        className="card"
        style={{
          marginTop: 20,
          width: "100%"
        }}
      >

        <h3>
          Survivors Entering
        </h3>

        {
          players.length === 0 && (
            <p>
              Waiting for survivors...
            </p>
          )
        }

        {
          players.map(
            (
              player,
              index
            ) => (

              <div
                key={index}
                style={{
                  marginTop: 10
                }}
              >
                @{player.username}
              </div>
            )
          )
        }

      </div>

      {/* ATMOSPHERE */}

      <div
        className="card"
        style={{
          marginTop: 20
        }}
      >

        <p>
          Survivors are gathering
          inside the district.
        </p>

        <p>
          Match begins when the
          countdown ends or the
          arena becomes full.
        </p>

      </div>

    </div>
  );
}
