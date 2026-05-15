import "./FeedEvent.css";

export default function FeedEvent({ event }) {
  const getStyles = () => {
    switch (event.type) {
      case "ELIMINATION":
        return {
          color: "#ff8a8a"
        };

      case "FUNNY_DEATH":
        return {
          color: "#ffb86b"
        };

      case "SURVIVAL":
        return {
          color: "#9dff9d"
        };

      case "WORLD_EVENT":
        return {
          color: "#b8b8ff"
        };

      case "NARRATION":
        return {
          color: "#d4d4d4"
        };

      default:
        return {
          color: "#e8e8e8"
        };
    }
  };

  const styles = getStyles();

  const formatMessage = (message) => {
    if (!message) return "";

    let formatted = message;

    // Victim = strikethrough
    if (event.victim) {
      const escapedVictim = event.victim.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      const victimRegex = new RegExp(escapedVictim, "g");

      formatted = formatted.replace(
        victimRegex,
        `
        <span style="
          text-decoration: line-through;
          opacity: 0.55;
        ">
          ${event.victim}
        </span>
        `
      );
    }

    // Killer = bold
    if (event.killer) {
      const escapedKiller = event.killer.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      const killerRegex = new RegExp(escapedKiller, "g");

      formatted = formatted.replace(
        killerRegex,
        `<strong>${event.killer}</strong>`
      );
    }

    return formatted;
  };

  return (
    <div
      className="feed-event"
      style={{
        padding: "10px 0",
        marginBottom: "10px",
        color: styles.color,
        fontSize: "1.08rem",
        lineHeight: "1.8",
        letterSpacing: "0.02em",
        animation: "fadeIn 0.6s ease forwards"
      }}
    >
      <div
        dangerouslySetInnerHTML={{
          __html: formatMessage(event.message)
        }}
      />
    </div>
  );
}
