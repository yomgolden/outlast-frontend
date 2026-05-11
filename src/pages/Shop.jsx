import {
  useState
} from "react";

import {
  equipTools
} from "../api/api";

import {
  useUser
} from "../context/UserContext";

const TOOLS = [
  {
    name: "Knife",
    cost: 200
  },
  {
    name: "Shield",
    cost: 300
  },
  {
    name: "Smoke",
    cost: 200
  },
  {
    name: "Scanner",
    cost: 400
  }
];

export default function Shop() {

  const {
    user,
    loadUser
  } = useUser();

  const [
    error,
    setError
  ] = useState("");

  const buyTool =
    async (
      toolName,
      cost
    ) => {

      try {

        if (
          user.gold < cost
        ) {

          setError(
            "Not enough gold"
          );

          return;
        }

        await equipTools(
          user._id,
          [toolName]
        );

        await loadUser(
          user._id
        );

        setError("");

      } catch (err) {

        setError(
          err.message
        );
      }
    };

  return (
    <div className="app-container">

      <h1 className="title">
        SHOP
      </h1>

      {error && (
        <div className="card">
          {error}
        </div>
      )}

      {TOOLS.map(tool => (

        <div
          key={tool.name}
          className="card"
        >

          <h3>
            {tool.name}
          </h3>

          <p>
            Cost:
            {" "}
            <span className="gold">
              {tool.cost}
            </span>
          </p>

          <button
            className="primary-btn"
            onClick={() =>
              buyTool(
                tool.name,
                tool.cost
              )
            }
          >
            BUY
          </button>

        </div>
      ))}

    </div>
  );
}
