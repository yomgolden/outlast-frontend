import { useNavigate } from "react-router-dom";

export default function ProfileBar({
  user
}) {

  const navigate =
    useNavigate();

  const reputation =
    (user?.wins || 0) >= 10

      ? "FEARED"

      : (user?.wins || 0) >= 3

      ? "KNOWN"

      : "UNKNOWN";

  return (

    <div

      onClick={() =>
        navigate("/profile")
      }

      style={{

        display: "flex",

        alignItems: "center",

        justifyContent:
          "space-between",

        background:
          "rgba(13,20,36,0.92)",

        border:
          "1px solid var(--border)",

        borderRadius: 999,

        padding: "10px 14px",

        marginBottom: 22,

        cursor: "pointer"
      }}
    >

      {/* LEFT */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12
        }}
      >

        <div
          className="avatar"
          style={{
            width: 46,
            height: 46,
            fontSize: 18
          }}
        >

          {
            (user?.username || "?")[0]
            .toUpperCase()
          }

        </div>

        <div>

          <div
            style={{
              fontWeight: 700,
              fontSize: 18
            }}
          >

            @{user?.username}

          </div>

          <div
            style={{
              display: "flex",
              gap: 6,
              marginTop: 4,
              flexWrap: "wrap"
            }}
          >

            <span className="badge badge-purple">

              LVL {user?.level}

            </span>

            <span className="badge badge-orange">

              {reputation}

            </span>

          </div>

        </div>

      </div>

      {/* RIGHT */}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10
        }}
      >

        <span className="badge badge-gold">

          🪙
          {" "}
          {user?.gold?.toLocaleString()}

        </span>

        <div
          style={{
            fontSize: 22,
            color:
              "var(--text3)"
          }}
        >
          ›
        </div>

      </div>

    </div>
  );
}
