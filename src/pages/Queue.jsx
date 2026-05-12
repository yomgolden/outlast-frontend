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

const ATMOSPHERE = [
  "District unstable. Power grid failure detected.",
  "Survivors are entering the zone.",
  "Security systems offline.",
  "Unknown movement detected nearby.",
  "Emergency broadcasts have stopped.",
  "Riots spreading across the district.",
  "No evacuation routes remain open.",
  "Something is moving in the dark."
];

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

  const [
    atmosphere,
    setAtmosphere
  ] = useState(
    ATMOSPHERE[0]
  );

  const [
    starting,
    setStarting
  ] = useState(false);

  /*
  =====================================
  ROTATING ATMOSPHERE
  =====================================
  */

  useEffect(() => {

    const interval =
      setInterval(() => {

        const random =
          Math.floor(
            Math.random() *
            ATMOSPHERE.length
          );

        setAtmosphere(
          ATMOSPHERE[random]
        );

      }, 4000);

    return () =>
      clearInterval(interval);

  }, []);

  /*
  =====================================
  POLLING
  =====================================
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
            =====================================
            MATCH START
            =====================================
            */

            if (
              data.status ===
              "STARTED"
            ) {

              clearInterval(
                poll
              );

              setStarting(true);

              setTimeout(() => {

                navigate(
                  "/match",
                  {
                    replace: true
                  }
                );

              }, 1500);
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

  /*
  =====================================
  DANGER STYLE
  =====================================
  */

  const getDangerClass =
    () => {

      switch (
        match?.danger
      ) {

        case "EXTREME":
          return "badge badge-red";

        case "HIGH":
          return "badge badge-orange";

        default:
          return "badge badge-gold";
      }
    };

  return (

    <div
      className="page"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >

      {/* HEADER */}

      <div
        style={{
          textAlign: "center",
          marginBottom: 24
        }}
      >

        <div
          className="game-title"
          style={{
            fontSize: 34
          }}
        >

          {match?.theme ||
            "SURVIVAL EVENT"}

        </div>

        <div
          style={{
            marginTop: 10,
            display: "flex",
            gap: 8,
            justifyContent: "center",
            flexWrap: "wrap"
          }}
        >

          <span className="badge badge-blue">

            📍 {match?.location}

          </span>

          <span
            className={
              getDangerClass()
            }
          >

            ⚠ {match?.danger}

          </span>

        </div>

      </div>

      {/* COUNTDOWN */}

      <div
        className="card"
        style={{
          width: "100%",
          textAlign: "center"
        }}
      >

        <div
          style={{
            fontSize: 12,
            letterSpacing: 2,
            color:
              "var(--text3)",
            marginBottom: 10
          }}
        >

          MATCH BEGINS IN

        </div>

        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "var(--red)",
            lineHeight: 1
          }}
        >

          {countdown}

        </div>

        <div
          style={{
            marginTop: 14,
            display: "flex",
            justifyContent:
              "center",
            gap: 8,
            flexWrap: "wrap"
          }}
        >

          <span className="badge badge-purple">

            ☠ {players.length}/20

          </span>

          <span className="badge badge-green">

            {status}

          </span>

        </div>

      </div>

      {/* STARTING */}

      {starting && (

        <div
          className="card"
          style={{
            width: "100%",
            textAlign: "center",
            marginTop: 16,
            border:
              "1px solid rgba(239,68,68,0.4)"
          }}
        >

          <h2>

            MATCH STARTING

          </h2>

          <p
            style={{
              marginTop: 10,
              color:
                "var(--text2)"
            }}
          >

            Entering the district...

          </p>

        </div>

      )}

      {/* ATMOSPHERE */}

      <div
        className="card"
        style={{
          width: "100%",
          marginTop: 16
        }}
      >

        <div
          style={{
            color:
              "var(--text2)",
            fontStyle:
              "italic",
            textAlign:
              "center",
            minHeight: 40,
            display: "flex",
            alignItems: "center",
            justifyContent:
              "center"
          }}
        >

          "{atmosphere}"

        </div>

      </div>

      {/* PLAYER LIST */}

      <div
        className="card"
        style={{
          width: "100%",
          marginTop: 16
        }}
      >

        <h3
          style={{
            marginBottom: 16
          }}
        >

          Survivors Entering

        </h3>

        {
          players.length === 0 && (

            <p
              style={{
                color:
                  "var(--text3)"
              }}
            >

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
                  display: "flex",
                  alignItems:
                    "center",
                  gap: 12,
                  padding: "10px 0",
                  borderBottom:
                    index !==
                    players.length - 1
                      ? "1px solid var(--border)"
                      : "none"
                }}
              >

                {/* AVATAR */}

                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius:
                      "50%",
                    background:
                      "var(--surface2)",
                    display: "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                    fontWeight: 700,
                    border:
                      "1px solid var(--border2)"
                  }}
                >

                  {
                    player.username?.[
                      0
                    ]?.toUpperCase()
                  }

                </div>

                {/* INFO */}

                <div
                  style={{
                    flex: 1
                  }}
                >

                  <div
                    style={{
                      fontWeight: 700
                    }}
                  >

                    @{player.username}

                  </div>

                  <div
                    style={{
                      fontSize: 11,
                      color:
                        "var(--text3)",
                      marginTop: 2
                    }}
                  >

                    {
                      player.bot
                        ? "BOT SURVIVOR"
                        : "PLAYER"
                    }

                  </div>

                </div>

                {/* STATUS */}

                <span className="badge badge-green">

                  READY

                </span>

              </div>
            )
          )
        }

      </div>

    </div>
  );
}
