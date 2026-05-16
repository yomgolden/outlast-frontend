import { useUser } from "../../context/UserContext";

export default function HomeHeader() {

  const { user } = useUser();

  return (

    <div
      style={{
        marginBottom: 20,
      textAlign: "center",
        position: "relative"
      }}
    >

      {/* TITLE */}
      <div
        style={{
          fontFamily:
            "'Creepster', cursive",

          fontSize: 45,

          letterSpacing: 4,

          color: "#f8fafc",

          textShadow:
            `
            0 0 10px rgba(239,68,68,0.5),
            0 0 25px rgba(239,68,68,0.25),
            0 0 40px rgba(239,68,68,0.15)
            `,

          lineHeight: 2
        }}
      >

        OUTLAST

      </div>

      {/* SUBTEXT */}
      <div
        style={{
          color: "var(--text3)",
          fontSize: 10,
          marginTop: 5,
          letterSpacing: 2,
          textTransform: "uppercase"
        }}
      >

        Survival Simulation

      </div>

    </div>
  );
}
