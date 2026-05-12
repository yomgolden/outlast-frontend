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
    user
  } = useUser();

  return (

    <div className="app-container">

      <h1 className="title">
        SHOP
      </h1>

      <div className="card">

        <p>
          Gold:
          {" "}

          <span className="gold">
            {user?.gold}
          </span>

        </p>

        <p>
          Shop system is currently
          under reconstruction.
        </p>

      </div>

      {
        TOOLS.map(tool => (

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
              disabled
            >

              COMING SOON

            </button>

          </div>
        ))
      }

    </div>
  );
}
