import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  createEvent,
  joinEvent,
  getEvents,
  getLeaderboard
} from "../api/api";

import {
  useUser
} from "../context/UserContext";

import {
  useMatch
} from "../context/MatchContext";

import Loader from "../components/Loader";

export default function Home() {

  const navigate =
    useNavigate();

  const {
    user,
    loading,
    error
  } = useUser();

  const {
    match,
    setMatch
  } = useMatch();

  const [
    leaderboard,
    setLeaderboard
  ] = useState([]);

  const [
    events,
    setEvents
  ] = useState([]);

  const [
    creating,
    setCreating
  ] = useState(false);

  const [
    joinError,
    setJoinError
  ] = useState("");

  /*
  =====================================
  RETURN TO ACTIVE MATCH
  =====================================
  */

  useEffect(() => {

    if (
      match?.eventId
    ) {

      navigate(
        "/match",
        {
          replace: true
        }
      );
    }

  }, []);

  /*
  =====================================
  LOAD DATA
  =====================================
  */

  useEffect(() => {

    const load =
      async () => {

        try {

          const board =
            await getLeaderboard();

          setLeaderboard(
            board.slice(0, 5)
          );

          const liveEvents =
            await getEvents();

          setEvents(
            liveEvents
          );

        } catch (err) {

          console.error(
            err
          );
        }
      };

    load();

    const poll =
      setInterval(
        load,
        5000
      );

    return () =>
      clearInterval(
        poll
      );

  }, []);

  /*
  =====================================
  CREATE EVENT
  =====================================
  */

  const handleCreate =
    async () => {

      try {

        setCreating(
          true
        );

        setJoinError(
          ""
        );

        const data =
          await createEvent(
            user._id,
            user.username
          );

        setMatch(
          data
        );

        navigate(
          "/queue",
          {
            replace: true
          }
        );

      } catch (err) {

        setJoinError(
          err.message ||
          "Failed to create event"
        );

      } finally {

        setCreating(
          false
        );
      }
    };

  /*
  =====================================
  JOIN EVENT
  =====================================
  */

  const handleJoin =
    async (
      eventId
    ) => {

      try {

        setJoinError(
          ""
        );

        const data =
          await joinEvent(
            eventId,
            user._id,
            user.username
          );

        setMatch(
          data
        );

        navigate(
          "/queue",
          {
            replace: true
          }
        );

      } catch (err) {

        setJoinError(
          err.message ||
          "Failed to join event"
        );
      }
    };

  /*
  =====================================
  LOADING
  =====================================
  */

  if (loading)
    return <Loader />;

  return (

    <div className="page">

      {/* HEADER */}

      <div
        style={{
          marginBottom: 24
        }}
      >

        <div
          className="game-title"
        >

          OUTLAST

        </div>

        <div
          style={{
            color:
              "var(--text3)",
            marginTop: 6,
            fontSize: 13
          }}
        >

          Nigerian survival simulator

        </div>

      </div>

      {/* ERROR */}

      {error && (

        <div className="error-card">

          {error}

        </div>

      )}

      {/* USER */}

      <div className="card">

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            marginBottom: 14
          }}
        >

          <div>

            <h3>

              @{user?.username}

            </h3>

            <div
              style={{
                color:
                  "var(--text3)",
                fontSize: 12,
                marginTop: 4
              }}
            >

              Survivor Profile

            </div>

          </div>

          <span className="badge badge-purple">

            LVL {user?.level}

          </span>

        </div>

        <p>

          Gold:
          {" "}

          <span
            style={{
              color:
                "var(--gold)"
            }}
          >

            {user?.gold}

          </span>

        </p>

        <p>

          Gems:
          {" "}

          {user?.gems}

        </p>

        <p>

          XP:
          {" "}

          {user?.xp}

        </p>

      </div>

      {/* CREATE */}

      <button
        className="btn-primary"
        disabled={creating}
        onClick={handleCreate}
      >

        {
          creating
            ? "CREATING..."
            : "⚡ START SURVIVAL EVENT"
        }

      </button>

      {/* JOIN ERROR */}

      {joinError && (

        <div
          className="error-card"
          style={{
            marginTop: 12
          }}
        >

          {joinError}

        </div>

      )}

      {/* ACTIVE EVENTS */}

      <div
        className="card"
        style={{
          marginTop: 20
        }}
      >

        <h3
          style={{
            marginBottom: 16
          }}
        >

          Active Survival Events

        </h3>

        {
          events.length === 0 && (

            <p
              style={{
                color:
                  "var(--text3)"
              }}
            >

              No active events

            </p>
          )
        }

        {
          events.map(
            (
              event,
              index
            ) => (

              <div
                key={index}
                style={{
                  marginTop: 20,
                  paddingBottom: 20,
                  borderBottom:
                    "1px solid var(--border)"
                }}
              >

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "center"
                  }}
                >

                  <h4>

                    {event.theme}

                  </h4>

                  <span className="badge badge-red">

                    {event.danger}

                  </span>

                </div>

                <p
                  style={{
                    marginTop: 10
                  }}
                >

                  📍 {event.location}

                </p>

                <p>

                  Host:
                  {" "}
                  @{event.host}

                </p>

                <p>

                  Survivors:
                  {" "}
                  {event.playerCount}
                  /
                  {event.maxPlayers}

                </p>

                <p>

                  Starts In:
                  {" "}
                  {event.countdown}s

                </p>

                <button
                  className="btn-primary"
                  style={{
                    marginTop: 14
                  }}
                  onClick={() =>
                    handleJoin(
                      event.eventId
                    )
                  }
                  disabled={
                    event.status !==
                    "WAITING"
                  }
                >

                  {
                    event.status ===
                    "WAITING"

                      ? "JOIN EVENT"

                      : "STARTED"
                  }

                </button>

              </div>
            )
          )
        }

      </div>

      {/* LEADERBOARD */}

      <div
        className="card"
        style={{
          marginTop: 20
        }}
      >

        <h3
          style={{
            marginBottom: 14
          }}
        >

          Top Survivors

        </h3>

        {
          leaderboard.map(
            (
              player,
              index
            ) => (

              <div
                key={index}
                style={{
                  marginTop: 12,
                  display: "flex",
                  justifyContent:
                    "space-between"
                }}
              >

                <span>

                  #{index + 1}
                  {" "}
                  @{player.username}

                </span>

                <span
                  style={{
                    color:
                      "var(--gold)"
                  }}
                >

                  {player.wins || 0}W

                </span>

              </div>
            )
          )
        }

      </div>

    </div>
  );
}
