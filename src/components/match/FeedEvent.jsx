export default function FeedEvent({ event }) {
  // Helper to format names with Bold/Strikethrough
  const formatText = (text, killer, victim) => {
    if (!text) return "";
    let formatted = text;

    // 1. Bold the Killer/Player (Safe from weird characters)
    if (killer) {
      const escapedKiller = killer.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const killerRegex = new RegExp(`(${escapedKiller})`, "g");
      formatted = formatted.replace(killerRegex, "<strong>$1</strong>");
    }

    // 2. Bold and Strikethrough the Victim
    if (victim) {
      const escapedVictim = victim.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const victimRegex = new RegExp(`(${escapedVictim})`, "g");
      formatted = formatted.replace(victimRegex, "<strong><del>$1</del></strong>");
    }

    return formatted;
  };

  const getStyle = () => {
    // Matching your backend's UPPERCASE types
    switch (event.type) {
      case "NARRATION":
        return "text-zinc-500 italic font-light text-[16px]";
      case "WORLD_EVENT":
        return "text-zinc-400 font-medium tracking-tight";
      case "SYSTEM":
        return "text-zinc-600 text-xs uppercase tracking-[0.2em] text-center py-4";
      default:
        return "text-zinc-200 font-normal";
    }
  };

  // Ignore the ROUND markers in the feed (Handled by Card)
  if (event.type === "ROUND") return null;

  return (
    <div className="mb-4 last:mb-0 animate-fadeIn">
      <p 
        className={`text-[17px] leading-relaxed tracking-tight ${getStyle()}`}
        dangerouslySetInnerHTML={{
          __html: formatText(event.text || event.message, event.killer, event.victim)
        }}
      />
    </div>
  );
}
