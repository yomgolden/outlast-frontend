import {
  useEffect,
  useState
} from "react";

export default function History() {

  const [
    matches,
    setMatches
  ] = useState([]);

  /*
  =====================================
  LOAD HISTORY
  =====================================
  */

  useEffect(() => {

    const saved =
      JSON.parse(
        localStorage.getItem(
          "outlast_history"
        ) || "[]"
      );

    setMatches(saved);

  }, []);

  return (

    <div className="page">

      <div
        className="game-title"
        style={{
          fontSize: 34,
          marginBottom: 20
        }}
      >

        HISTORY

      </div>

      {
        matches.length === 0 && (

          <div className="card">

            <h3>

              No Match History

            </h3>

            <p
              style={{
                marginTop: 10,
                color:
                  "var(--text2)"
              }}
            >

              Completed matches
              will appear here.

            </p>

          </div>
        )
      }

      {
        matches.map(
          (
            match,
            index
          ) => (

            <div
              key={index}
              className="card"
              style={{
                marginBottom: 16
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

                <h3>

                  {match.theme}

                </h3>

                <span className="badge badge-red">

                  {match.danger}

                </span>

              </div>

              <p
                style={{
                  marginTop: 12
                }}
              >

                📍 {match.location}

              </p>

              <p
                style={{
                  marginTop: 6
                }}
              >

                Winner:
                {" "}
                @{match.winner}

              </p>

              <p
                style={{
                  marginTop: 6
                }}
              >

                Survivors:
                {" "}
                {match.totalPlayers}

              </p>

              <p
                style={{
                  marginTop: 6
                }}
              >

                {match.date}

              </p>

            </div>
          )
        )
      }

    </div>
  );
}
