export default function LeaderboardSection({
  leaderboard = []
}) {

  if (
    leaderboard.length === 0
  ) {

    return null;
  }

  return (

    <div>

      <div className="section-title">
        Top Survivors
      </div>

      <div className="card">

        {leaderboard.map(
          (
            player,
            i
          ) => (

            <div
              key={i}
              className="stat-row"
            >

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10
                }}
              >

                <span
                  style={{
                    fontFamily:
                      "Bebas Neue, sans-serif",

                    fontSize: 18,

                    minWidth: 28
                  }}

                  className={
                    i === 0

                      ? "rank-1"

                      : i === 1

                      ? "rank-2"

                      : i === 2

                      ? "rank-3"

                      : ""
                  }
                >

                  {
                    i < 3

                      ? [
                          "🥇",
                          "🥈",
                          "🥉"
                        ][i]

                      : `#${i + 1}`
                  }

                </span>

                <span
                  style={{
                    fontWeight: 600
                  }}
                >

                  @{player.username}

                </span>

              </div>

              <div
                style={{
                  display: "flex",
                  gap: 6
                }}
              >

                <span className="badge badge-gold">

                  {player.wins}W

                </span>

                <span className="badge badge-purple">

                  L{player.level}

                </span>

              </div>

            </div>
          )
        )}

      </div>

    </div>
  );
}
