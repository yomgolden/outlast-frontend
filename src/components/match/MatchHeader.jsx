export default function MatchHeader({
  theme,
  location,
  currentRound,
  alive,
  danger,
  tagline
}) {

  const dangerColor =
    danger === "EXTREME"

      ? "var(--red)"

      : danger === "HIGH"

      ? "var(--orange)"

      : "var(--gold)";

  return (

    <>
      {/* HEADER */}

      <div
        style={{
          marginBottom: 16
        }}
      >

        <div
          style={{
            fontFamily:
              "Bebas Neue, sans-serif",

            fontSize: 30,

            letterSpacing: 3,

            marginBottom: 10
          }}
        >
          {theme || "OUTLAST"}
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap"
          }}
        >

          <span className="badge badge-blue">
            📍 {location}
          </span>

          <span className="badge badge-purple">
            {currentRound > 0
              ? `ROUND ${currentRound}`
              : "STARTING"}
          </span>

          <span className="badge badge-red">
            ⚔️ {alive} ALIVE
          </span>

        </div>

      </div>

      {/* DANGER */}

      <div
        className="card"
        style={{
          marginBottom: 16,
          padding: "12px 16px"
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

          <div>

            <div
              style={{
                fontSize: 10,
                color:
                  "var(--text3)",

                textTransform:
                  "uppercase",

                letterSpacing: 1.5,

                marginBottom: 3
              }}
            >
              Danger Level
            </div>

            <div
              style={{
                fontFamily:
                  "Bebas Neue, sans-serif",

                fontSize: 18,

                letterSpacing: 2,

                color:
                  dangerColor
              }}
            >
              {danger || "HIGH"}
            </div>

          </div>

          <div
            style={{
              fontSize: 12,
              color:
                "var(--text3)",

              fontStyle:
                "italic",

              textAlign:
                "right",

              maxWidth: "55%"
            }}
          >
            {tagline ||
              "Survivors are trapped inside the district."}
          </div>

        </div>

      </div>
    </>
  );
}
