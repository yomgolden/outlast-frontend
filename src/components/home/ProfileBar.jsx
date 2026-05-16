import { useNavigate } from "react-router-dom";

export default function ProfileBar({ user }) {

  const navigate = useNavigate();

  return (

    <div
      onClick={() => navigate("/profile")}
      style={{
        marginBottom: 24,
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",

        background:
          "linear-gradient(135deg, rgba(10,20,50,0.96), rgba(5,10,25,0.96))",

        border:
          "1px solid rgba(59,130,246,0.18)",

        borderRadius: 24,

        padding: 18,

        boxShadow:
          "0 10px 30px rgba(0,0,0,0.35)"
      }}
    >

      {/* BG GLOW */}
      <div
        style={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 140,
          height: 140,
          borderRadius: "50%",

          background:
            "rgba(59,130,246,0.12)",

          filter: "blur(40px)"
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          position: "relative",
          zIndex: 1
        }}
      >

        {/* AVATAR */}
        {
          user?.photoUrl ? (

            <img
              src={user.photoUrl}
              alt={user.username}
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                objectFit: "cover",

                border:
                  "2px solid rgba(255,255,255,0.08)",

                boxShadow:
                  "0 0 25px rgba(59,130,246,0.25)"
              }}
            />

          ) : (

            <div
              className="avatar"
              style={{
                width: 72,
                height: 72,
                fontSize: 28
              }}
            >
              {(user?.username || "?")[0].toUpperCase()}
            </div>

          )
        }

        {/* USER INFO */}
        <div style={{ flex: 1 }}>

          <div
            style={{
              fontSize: 34,
              lineHeight: 1,
              marginBottom: 8
            }}
          >
            ☠
          </div>

          <div
            style={{
              fontWeight: 800,
              fontSize: 20,
              color: "#f8fafc"
            }}
          >

            {user?.firstName || "Survivor"}

          </div>

          <div
            style={{
              color: "var(--text2)",
              marginTop: 4,
              fontSize: 14
            }}
          >

            @{user?.username}

          </div>

        </div>

        {/* GOLD */}
        <div
          style={{
            textAlign: "right"
          }}
        >

          <div
            style={{
              fontSize: 13,
              color: "var(--text3)",
              marginBottom: 4,
              letterSpacing: 1
            }}
          >
            CREDITS
          </div>

          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "var(--gold)"
            }}
          >

            🪙 {user?.gold || 0}

          </div>

        </div>

      </div>

    </div>
  );
}
