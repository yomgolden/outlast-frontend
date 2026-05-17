import RankPill from "../RankPill";

const getRankFromRp = (rp) => {

  if (rp >= 10000) return 6;
  if (rp >= 7000) return 5;
  if (rp >= 4500) return 4;
  if (rp >= 2500) return 3;
  if (rp >= 1200) return 2;
  if (rp >= 500) return 1;

  return 0;
};

export default function LeaderboardSection({
  leaderboard = []
}) {

  if (
    leaderboard.length === 0
  ) {

    return null;
  }

  return (

    <div
      style={{
        marginBottom: 24
      }}
    >

      <style>{`

        .home-lb-title {

          font-family:
            "Bebas Neue",
            sans-serif;

          font-size: 28px;

          letter-spacing: 2px;

          color: #f8fafc;

          margin-bottom: 16px;

          text-transform: uppercase;
        }

        .home-lb-list {

          display: flex;

          flex-direction: column;

          gap: 10px;
        }

        .home-lb-row {

          position: relative;

          overflow: hidden;

          display: flex;

          align-items: center;

          justify-content: space-between;

          padding: 9px 14px;

          border-radius: 18px;

          backdrop-filter: blur(10px);

          transition:
            transform 0.2s ease,
            border 0.2s ease;

          border: 1px solid rgba(255,255,255,0.05);
        }

        .home-lb-row:active {

          transform: scale(0.985);
        }

        /*
        ================================
        TOP 1
        ================================
        */

        .home-lb-row.top-1 {

          background:
            linear-gradient(
              135deg,
              rgba(255,215,0,0.24),
              rgba(120,70,0,0.18)
            );

          border:
            1px solid rgba(255,215,0,0.35);

          box-shadow:
            0 0 30px rgba(255,215,0,0.10);
        }

        /*
        ================================
        TOP 2
        ================================
        */

        .home-lb-row.top-2 {

          background:
            linear-gradient(
              135deg,
              rgba(170,170,255,0.18),
              rgba(70,70,140,0.14)
            );

          border:
            1px solid rgba(180,180,255,0.24);

          box-shadow:
            0 0 26px rgba(120,120,255,0.08);
        }

        /*
        ================================
        TOP 3
        ================================
        */

        .home-lb-row.top-3 {

          background:
            linear-gradient(
              135deg,
              rgba(255,120,0,0.18),
              rgba(120,40,0,0.12)
            );

          border:
            1px solid rgba(255,140,0,0.24);

          box-shadow:
            0 0 24px rgba(255,120,0,0.08);
        }

        /*
        ================================
        NORMAL
        ================================
        */

        .home-lb-row.normal {

          background:
            linear-gradient(
              135deg,
              rgba(18,24,40,0.95),
              rgba(10,16,30,0.92)
            );

          border:
            1px solid rgba(80,120,255,0.08);
        }

        .home-lb-left {

          display: flex;

          align-items: center;

          gap: 12px;

          min-width: 0;
        }

        .home-lb-rank {

          width: 36px;

          display: flex;

          align-items: center;

          justify-content: center;

          font-size: 24px;

          font-weight: 800;

          color: white;

          flex-shrink: 0;
        }

        .home-lb-avatar {

          width: 38px;

          height: 38px;

          border-radius: 50%;

          display: flex;

          align-items: center;

          justify-content: center;

          font-weight: 700;

          font-size: 15px;

          color: white;

          flex-shrink: 0;

          border: 2px solid rgba(255,255,255,0.08);

          background:
            linear-gradient(
              135deg,
              rgba(30,40,70,1),
              rgba(15,20,40,1)
            );
        }

        .home-lb-avatar.top-1 {

          border:
            2px solid rgba(255,215,0,0.65);

          box-shadow:
            0 0 18px rgba(255,215,0,0.28);
        }

        .home-lb-avatar.top-2 {

          border:
            2px solid rgba(180,180,255,0.55);

          box-shadow:
            0 0 18px rgba(120,120,255,0.22);
        }

        .home-lb-avatar.top-3 {

          border:
            2px solid rgba(255,120,0,0.55);

          box-shadow:
            0 0 18px rgba(255,120,0,0.20);
        }

        .home-lb-user {

          min-width: 0;
        }

        .home-lb-name {

          font-size: 15px;

          font-weight: 700;

          color: #f8fafc;

          white-space: nowrap;

          overflow: hidden;

          text-overflow: ellipsis;
        }

        .home-lb-rp {

          display: flex;

          align-items: center;

          gap: 10px;

          flex-shrink: 0;
        }

        .home-lb-rp-value {

          font-size: 16px;

          font-weight: 800;

          color: #f8fafc;

          letter-spacing: 0.5px;
        }

      </style>

      <div className="home-lb-title">
        ⚔ TOP SURVIVORS
      </div>

      <div className="home-lb-list">

        {leaderboard.map(
          (
            player,
            i
          ) => {

            const rank =
              getRankFromRp(
                player.weeklyRp || 0
              );

            const topClass =
              i === 0
                ? "top-1"
                : i === 1
                ? "top-2"
                : i === 2
                ? "top-3"
                : "normal";

            return (

              <div
                key={i}
                className={`home-lb-row ${topClass}`}
              >

                <div className="home-lb-left">

                  <div className="home-lb-rank">

                    {
                      i === 0
                        ? "🥇"
                        : i === 1
                        ? "🥈"
                        : i === 2
                        ? "🥉"
                        : `#${i + 1}`
                    }

                  </div>

                  <div
                    className={`home-lb-avatar ${topClass}`}
                  >

                    {
                      (
                        player.username ||
                        "S"
                      )[0].toUpperCase()
                    }

                  </div>

                  <div className="home-lb-user">

                    <div className="home-lb-name">

                      @{
                        player.firstname ||
                        player.username ||
                        "Survivor"
                      }

                    </div>

                  </div>

                </div>

                <div className="home-lb-rp">

                  <RankPill
                    rank={rank}
                    size="sm"
                  />

                  <div className="home-lb-rp-value">

                    {(
                      player.weeklyRp || 0
                    ).toLocaleString()}

                  </div>

                </div>

              </div>
            );
          }
        )}

      </div>
    
   </div>
  );
}
