import {
  useNavigate
} from "react-router-dom";

export default function Results() {

  const navigate = useNavigate();

  const result = {
    placement: 1,
    gold: 250,
    xp: 100
  };

  return (
    <div className="app-container">

      <h1 className="title">
        MATCH RESULTS
      </h1>

      <div className="card">

        <h2>
          Placement:
          #{result.placement}
        </h2>

        <p className="gold">
          +{result.gold} Gold
        </p>

        <p>
          +{result.xp} XP
        </p>

      </div>

      <button
        className="primary-btn"
        onClick={() => navigate("/")}
      >
        PLAY AGAIN
      </button>

    </div>
  );
}
