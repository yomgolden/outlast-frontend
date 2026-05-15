export default function FeedEvent({ event }) {
  const getStyles = () => {
    switch (event.type) {
      case "round":
        return {
          border: "1px solid #444",
          background: "rgba(255,255,255,0.03)",
          glow: "0 0 25px rgba(255,255,255,0.08)",
          text: "text-white uppercase tracking-[0.3em] text-center",
        };

      case "narration":
        return {
          border: "1px solid #525252",
          background: "rgba(255,255,255,0.04)",
          glow: "0 0 25px rgba(255,255,255,0.05)",
          text: "italic text-zinc-300",
        };

      case "world":
        return {
          border: "1px solid #1e3a8a",
          background: "rgba(30,58,138,0.25)",
          glow: "0 0 25px rgba(59,130,246,0.25)",
          text: "text-blue-100",
        };

      case "elimination":
        return {
          border: "1px solid #7f1d1d",
          background: "rgba(127,29,29,0.25)",
          glow: "0 0 30px rgba(255,0,0,0.3)",
          text: "text-red-100",
        };

      case "survival":
        return {
          border: "1px solid #14532d",
          background: "rgba(20,83,45,0.25)",
          glow: "0 0 25px rgba(34,197,94,0.25)",
          text: "text-green-100",
        };

      case "funny":
        return {
          border: "1px solid #854d0e",
          background: "rgba(133,77,14,0.25)",
          glow: "0 0 25px rgba(234,179,8,0.2)",
          text: "text-yellow-100",
        };

      case "system":
        return {
          border: "1px solid #27272a",
          background: "rgba(39,39,42,0.4)",
          glow: "none",
          text: "text-zinc-400 text-sm text-center",
        };

      default:
        return {
          border: "1px solid #333",
          background: "#111",
          glow: "none",
          text: "text-white",
        };
    }
  };

  const styles = getStyles();

  return (
    <div
      className="rounded-2xl p-4 transition-all duration-700 animate-fadeIn"
      style={{
        border: styles.border,
        background: styles.background,
        boxShadow: styles.glow,
      }}
    >
      <p className={`leading-7 ${styles.text}`}>
        {event.text}
      </p>
    </div>
  );
}
