export default function FeedEvent({ event }) {

  // WORLD EVENT
  if (event.type === "WORLD_EVENT") {

    return (
      <div
        className="feed-world"
        style={{ opacity: 0.72 }}
      >
        <div className="feed-world-dot" />

        <span>
          {event.message}
        </span>
      </div>
    );
  }

  // SURVIVAL
  if (event.type === "SURVIVAL") {

    const html =
      event.message.replace(
        event.message.split(" ")[0],
        `<span class="ns">${event.message.split(" ")[0]}</span>`
      );

    return (
      <div className="feed-survival">

        <span className="feed-icon">
          🌿
        </span>

        <span
          className="feed-text"
          dangerouslySetInnerHTML={{
            __html: html
          }}
        />

      </div>
    );
  }

  // FUNNY DEATH
  if (event.type === "FUNNY_DEATH") {

    let html = event.message;

    if (event.victim) {

      html = html.replace(
        new RegExp(event.victim, "g"),
        `<span class="nv">${event.victim}</span>`
      );
    }

    return (
      <div className="feed-funny">

        <span className="feed-icon">
          💀
        </span>

        <span
          className="feed-text"
          dangerouslySetInnerHTML={{
            __html: html
          }}
        />

      </div>
    );
  }

  // ELIMINATION
  if (event.type === "ELIMINATION") {

    let html = event.message;

    if (event.killer) {

      html = html.replace(
        new RegExp(event.killer, "g"),
        `<span class="nk">${event.killer}</span>`
      );
    }

    if (event.victim) {

      html = html.replace(
        new RegExp(event.victim, "g"),
        `<span class="nv">${event.victim}</span>`
      );
    }

    return (
      <div className="feed-kill">

        <span className="feed-icon">
          ⚔️
        </span>

        <span
          className="feed-text"
          dangerouslySetInnerHTML={{
            __html: html
          }}
        />

      </div>
    );
  }

  return null;
}
