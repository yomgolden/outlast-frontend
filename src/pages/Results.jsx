import {
  useEffect
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  useMatch
} from "../context/MatchContext";

import {
  useUser
} from "../context/UserContext";

export default function Results() {

  const navigate =
    useNavigate();

  const {
    results
  } = useMatch();

  const {
    user,
    loadUser
  } = useUser();

  /*
  =====================================
  REFRESH USER DATA
  =====================================
  */

  useEffect(() => {

    if (user?._id) {

      loadUser(
        user._id
      );
    }

  }, []);

  return (

    <div className="app-container">

      <h1 className="title">
        RESULTS
      </h1>

      {
        results?.results?.map(
          (
            player,
            index
          ) => (

            <div
              className="card"
              key={index}
            >

              <h3>

                #
                {player.placement}
                {" "}
                @{player.username}

              </h3>

              <p>
                Gold:
                {" "}

                <span className="gold">

                  +
                  {player.goldEarned}

                </span>

              </p>

              <p>
                XP:
                {" "}
                +
                {player.xpEarned}
              </p>

            </div>
          )
        )
      }

      <button
        className="primary-btn"
        onClick={() =>
          navigate("/")
        }
      >

        PLAY AGAIN

      </button>

    </div>
  );
}
