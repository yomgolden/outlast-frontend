const RANKS = [

  {
    name: "Rookie",
    color: "#9ca3af",
    glow: "rgba(156,163,175,0.45)"
  },

  {
    name: "Survivor",
    color: "#3b82f6",
    glow: "rgba(59,130,246,0.45)"
  },

  {
    name: "Hunter",
    color: "#a855f7",
    glow: "rgba(168,85,247,0.45)"
  },

  {
    name: "Slayer",
    color: "#ef4444",
    glow: "rgba(239,68,68,0.45)"
  },

  {
    name: "Master",
    color: "#dc2626",
    glow: "rgba(220,38,38,0.45)"
  },

  {
    name: "Grandmaster",
    color: "#ff0033",
    glow: "rgba(255,0,51,0.5)"
  },

  {
    name: "Legend",
    color: "#ffffff",
    glow: "rgba(255,255,255,0.6)"
  }
];

export default function RankPill({
  rank = 0,
  size = "sm"
}) {

  const current =
    RANKS[rank] || RANKS[0];

  const small =
    size === "sm";

  return (

    <div
      style={{

        padding:
          small
            ? "6px 12px"
            : "8px 16px",

        borderRadius: 999,

        fontSize:
          small
            ? 11
            : 13,

        fontWeight: 800,

        letterSpacing: 1,

        textTransform: "uppercase",

        color: current.color,

        border: `1px solid ${current.color}`,

        background: `
          linear-gradient(
            135deg,
            ${current.glow},
            rgba(0,0,0,0.15)
          )
        `,

        boxShadow: `
          0 0 18px ${current.glow}
        `,

        backdropFilter: "blur(10px)",

        fontFamily:
          "Rajdhani, sans-serif"
      }}
    >

      {current.name}

    </div>
  );
}
