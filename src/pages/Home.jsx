import { useNavigate } from "react-router-dom";

import {
  joinMatch
} from "../api/api";

import {
  useUser
} from "../context/UserContext";

import {
  useMatch
} from "../context/MatchContext";

import LeaderboardPreview from "../components/LeaderboardPreview";

export default function Home() {

  const navigate = useNavigate();

  const { user } = useUser();

  const { setMatch } = useMatch();

  const handleJoin = async () => {

    const data = await joinMatch(
      user._id
    );

    setMatch(data);

    navigate("/queue");
  };

  return (
    <div className="app-container">

      <h1 className="title">
        OUTLAST
      </h1>

      <div className="card">
        <p>
          Gold:
          <span className="gold">
            {" "}
            {user?.gold || 0}
          </span>
        </p>

        <p>
          XP: {user?.xp || 0}
        </p>
      </div>

      <button
        className="primary-btn"
        onClick={handleJoin}
      >
        JOIN MATCH
      </button>

      <div style={{
        marginTop: 20
      }}>
        <LeaderboardPreview />
      </div>

    </div>
  );
}
