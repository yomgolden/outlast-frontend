import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  joinMatch,
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
    joining,
    setJoining
  ] = useState(false);

  const [
    joinError,
    setJoinError
  ] = useState("");

  useEffect(() => {

    const load =
      async () => {

        try {

          const data =
            await getLeaderboard();

          setLeaderboard(
            data.slice(0, 5)
          );

        } catch (err) {

          console.error(err);
        }
      };

    load();

  }, []);

  const handleJoin =
    async () => {

      try {

        setJoining(true);

        setJoinError("");

        const data =
          await joinMatch(
            user._id
          );

        setMatch(data);

        navigate("/queue");

      } catch (err) {

        setJoinError(
          err.message ||
          "Failed to join match"
        );

      } finally {

        setJoining(false);
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

      <button
        className="primary-btn"
        disabled={joining}
        onClick={handleJoin}
      >
        {
          joining
            ? "JOINING..."
            : "JOIN MATCH"
        }
      </button>

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

      <div
        className="card"
        style={{
          marginTop: 20
        }}
      >

        <h3>
          Top Survivors
        </h3>

        {leaderboard.map(
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
        )}

      </div>

    </div>
  );
}
