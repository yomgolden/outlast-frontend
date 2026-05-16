import { useUser } from "../../context/UserContext";

export default function HomeHeader() {

  const { user } = useUser();

  return (

    <div
      style={{
        marginBottom: 24,
        textAlign: "center",
        position: "relative"
      }}
    >

      {/* GOLD */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 8
        }}
      >

        <span className="badge badge-gold">
          🪙 {user?.gold?.toLocaleString()}
        </span>

      </div>

      {/* TITLE */}
      <div
        style={{
          fontFamily:
            "'Creepster', cursive",

          fontSize: 52,

          letterSpacing: 4,

          color: "#f8fafc",

          textShadow:
            `
            0 0 10px rgba(239,68,68,0.5),
            0 0 25px rgba(239,68,68,0.25),
            0 0 40px rgba(239,68,68,0.15)
            `,

          lineHeight: 1
        }}
      >

        OUTLAST

      </div>

      {/* SUBTEXT */}
      <div
        style={{
          color: "var(--text3)",
          fontSize: 12,
          marginTop: 8,
          letterSpacing: 2,
          textTransform: "uppercase"
        }}
      >

        Survival Simulation

      </div>

    </div>
  );
}
