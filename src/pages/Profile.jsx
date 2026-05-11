import {
  useUser
} from "../context/UserContext";

export default function Profile() {

  const {
    user
  } = useUser();

  return (
    <div className="app-container">

      <h1 className="title">
        PROFILE
      </h1>

      <div className="card">

        <h3>
          @{user?.username}
        </h3>

        <p>
          Gold:
          {" "}
          {user?.gold}
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

        <p>
          Playstyle:
          {" "}
          {user?.playstyle}
        </p>

      </div>

    </div>
  );
}
