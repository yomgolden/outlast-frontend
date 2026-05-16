import { useNavigate } from "react-router-dom";

export default function ProfileBar({ user }) {

  const navigate = useNavigate();

  return (

    <div
      onClick={() => navigate("/profile")}
      className="card"
      style={{
        marginBottom: 20,
        cursor: "pointer"
      }}
    >

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14
        }}
      >

        {/* AVATAR */}
        {
          user?.photoUrl ? (

            <img
              src={user.photoUrl}
              alt={user.username}
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                objectFit: "cover",
                border: "1px solid var(--border2)"
              }}
            />

          ) : (

            <div className="avatar avatar-lg">
              {(user?.username || "?")[0].toUpperCase()}
            </div>

          )
        }

        {/* USER INFO */}
        <div style={{ flex: 1 }}>

          <div
            style={{
              fontWeight: 700,
              fontSize: 17
            }}
          >

            {user?.firstName || "Survivor"}

          </div>

          <div
            style={{
              color: "var(--text3)",
              marginTop: 4,
              fontSize: 13
            }}
          >

            @{user?.username}

          </div>

        </div>

        {/* GOLD */}
        <div style={{ textAlign: "right" }}>

          <div
            style={{
              fontSize: 18,
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
