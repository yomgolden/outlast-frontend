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
  ========================================
  LOAD DATA
  ========================================
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

          console.error(err);
        }
      };

    load();

    const poll =
      setInterval(
        load,
        3000
      );

    return () =>
      clearInterval(
        poll
      );

  }, []);

  /*
  ========================================
  CREATE EVENT
  ========================================
  */

  const handleCreate =
    async () => {

      try {

        setCreating(true);

        setJoinError("");

        const data =
          await createEvent(
            user._id,
            user.username
          );

        setMatch(data);

        navigate("/queue");

      } catch (err) {

        setJoinError(
          err.message ||
          "Failed to create event"
        );

      } finally {

        setCreating(false);
      }
    };

  /*
  ========================================
  JOIN EVENT
  ========================================
  */

  const handleJoin =
    async (
      eventId
    ) => {

      try {

        setJoinError("");

        const data =
          await joinEvent(
            eventId,
            user._id,
            user.username
          );

        setMatch(data);

        navigate("/queue");

      } catch (err) {

        setJoinError(
          err.message ||
          "Failed to join event"
        );
      }
    };

  if (loading)
    return <Loader />;

  return (

    <div className="app-container">

      <h1 className="title">
        OUTLAST
      </h1>

      {error && (

        <div className="card">
          {error}
        </div>

      )}

      {/* USER CARD */}

      <div className="card">

        <h3>
          @{user?.username}
        </h3>

        <p>
          Gold:
          <span className="gold">
            {" "}
            {user?.gold}
          </span>
        </p>

        <p>
          Gems:
          {" "}
          {user?.gems}
        </p>

        <p>
          Level:
          {" "}
          {user?.level}
        </p>

        <p>
          XP:
          {" "}
          {user?.xp}
        </p>

      </div>

      {/* CREATE EVENT */}

      <button
        className="primary-btn"
        disabled={creating}
        onClick={handleCreate}
      >

        {
          creating
            ? "CREATING..."
            : "START SURVIVAL EVENT"
        }

      </button>

      {/* ERRORS */}

      {joinError && (

        <div
          className="card"
          style={{
            marginTop: 10
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

        <h3>
          Active Survival Events
        </h3>

        {
          events.length === 0 && (
            <p>
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
                    "1px solid #333"
                }}
              >

                <h4>
                  {event.theme}
                </h4>

                <p>
                  Host:
                  {" "}
                  @{event.host}
                </p>

                <p>
                  Location:
                  {" "}
                  {event.location}
                </p>

                <p>
                  Danger:
                  {" "}
                  {event.danger}
                </p>

                <p>
                  Players:
                  {" "}
                  {
                    event.players
                      ?.length
                  }
                  /
                  {
                    event.maxPlayers
                  }
                </p>

                <p>
                  Starts In:
                  {" "}
                  {
                    event.countdown
                  }
                  s
                </p>

                <button
                  className="primary-btn"
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

        <h3>
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
                  marginTop: 10
                }}
              >
                #{index + 1}
                {" "}
                {player.userId}
              </div>
            )
          )
        }

      </div>

    </div>
  );
}
