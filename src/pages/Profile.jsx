import {
  useUser
} from "../context/UserContext";

export default function Profile() {

  const {
    user
  } = useUser();

  const nextLevelXP =
    (user?.level || 1) * 500;

  const progress =
    Math.min(
      100,
      Math.floor(
        (
          (user?.xp || 0) /
          nextLevelXP
        ) * 100
      )
    );

  return (

    <div className="app-container">

      <h1 className="title">
        SURVIVOR PROFILE
      </h1>

      {/* PLAYER CARD */}

      <div className="card">

        <h2>
          @{user?.username}
        </h2>

        <p>
          Survivor Level:
          {" "}
          {user?.level}
        </p>

        <p>
          Current XP:
          {" "}
          {user?.xp}
        </p>

        <p>
          Next Rank:
          {" "}
          {nextLevelXP} XP
        </p>

        {/* XP BAR */}

        <div
          style={{
            marginTop: 15
          }}
        >

          <div
            style={{
              width: "100%",
              height: 10,
              background:
                "#222",
              borderRadius: 10,
              overflow:
                "hidden"
            }}
          >

            <div
              style={{
                width:
                  `${progress}%`,
                height: "100%",
                background:
                  "#ff3b30"
              }}
            />

          </div>

          <p
            style={{
              marginTop: 5,
              fontSize: 12
            }}
          >
            {progress}% Progress
          </p>

        </div>

      </div>

      {/* SURVIVAL STATS */}

      <div
        className="card"
        style={{
          marginTop: 20
        }}
      >

        <h3>
          Survival Resources
        </h3>

        <p>
          Gold:
          {" "}
          <span className="gold">
            {user?.gold}
          </span>
        </p>

        <p>
          Gems:
          {" "}
          {user?.gems}
        </p>

        <p>
          Playstyle:
          {" "}
          {
            user?.playstyle ||
            "BALANCED"
          }
        </p>

      </div>

      {/* SURVIVOR STATUS */}

      <div
        className="card"
        style={{
          marginTop: 20
        }}
      >

        <h3>
          Survivor Status
        </h3>

        <p>
          Status:
          {" "}
          ACTIVE
        </p>

        <p>
          Arena Reputation:
          {" "}
          UNKNOWN
        </p>

        <p>
          Threat Level:
          {" "}
          MEDIUM
        </p>

      </div>

      {/* FLAVOR */}

      <div
        className="card"
        style={{
          marginTop: 20
        }}
      >

        <h3>
          Arena Record
        </h3>

        <p>
          "{user?.username}"
          continues to survive
          the chaos spreading
          across the districts.
        </p>

      </div>

    </div>
  );
}
