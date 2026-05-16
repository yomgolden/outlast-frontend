import { useNavigate } from "react-router-dom";

export default function ProfileBar({ user }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/profile")}
      style={{
        marginBottom: 16,
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        background:
          "linear-gradient(135deg, rgba(10,20,50,0.96), rgba(5,10,25,0.96))",
        border: "1px solid rgba(59,130,246,0.18)",
        borderRadius: 16,
        padding: "12px 14px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
        transition: "all 0.3s ease"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(59,130,246,0.35)";
        e.currentTarget.style.boxShadow =
          "0 15px 40px rgba(59,130,246,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(59,130,246,0.18)";
        e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.35)";
      }}
    >
      {/* ANIMATED BG GLOW */}
      <div
        style={{
          position: "absolute",
          top: -30,
          right: -30,
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: "rgba(59,130,246,0.12)",
          filter: "blur(35px)",
          animation: "pulse 4s ease-in-out infinite"
        }}
      />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
      `}</style>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          position: "relative",
          zIndex: 1
        }}
      >
        {/* COMPACT AVATAR */}
        <div
          style={{
            position: "relative",
            flexShrink: 0
          }}
        >
          {user?.photoUrl ? (
            <img
              src={user.photoUrl}
              alt={user.username}
              style={{
                width: 48,
                height: 48,
                borderRadius: 10,
                objectFit: "cover",
                border: "2px solid rgba(59,130,246,0.25)",
                boxShadow: "0 0 15px rgba(59,130,246,0.2)"
              }}
            />
          ) : (
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 10,
                background:
                  "linear-gradient(135deg, rgba(59,130,246,0.3), rgba(99,102,241,0.3))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                fontWeight: 800,
                color: "rgba(59,130,246,0.8)",
                border: "1.5px solid rgba(59,130,246,0.3)"
              }}
            >
              {(user?.username || "?")[0].toUpperCase()}
            </div>
          )}

          {/* ONLINE INDICATOR */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "#10b981",
              border: "2px solid rgba(10,20,50,0.96)",
              boxShadow: "0 0 8px rgba(16,185,129,0.6)"
            }}
          />
        </div>

        {/* USER INFO */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 16,
              color: "#f8fafc",
              lineHeight: 1.2
            }}
          >
            {user?.firstName || "User"}
          </div>
          <div
            style={{
              color: "rgba(59,130,246,0.7)",
              fontSize: 12,
              marginTop: 2
            }}
          >
            @{user?.username || "username"}
          </div>
        </div>

        {/* ACCENT ICON */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background:
              "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(99,102,241,0.2))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            border: "1px solid rgba(59,130,246,0.25)",
            flexShrink: 0
          }}
        >
          ⚡
        </div>
      </div>
    </div>
  );
}
