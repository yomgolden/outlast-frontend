import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getEvents,
  joinEvent
} from "../api/api";

import { useUser } from "../context/UserContext";
import { useMatch } from "../context/MatchContext";

export default function Events() {
  const navigate = useNavigate();

  const { user } = useUser();
  const { setMatch } = useMatch();

  const [events, setEvents] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        console.error(err);
      }
    };

    load();

    const poll = setInterval(load, 3000);

    return () => clearInterval(poll);
  }, []);

  const handleJoin = async (eventId) => {
    try {
      const data = await joinEvent(
        eventId,
        user._id,
        user.username
      );

      setMatch(data);

      navigate("/queue");

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page">

      <div className="game-title">
        EVENTS
      </div>

      <div style={{ marginTop: 20 }}>

        {events.length === 0 && (
          <div className="card">
            No active events
          </div>
        )}

        {events.map(event => (

          <div
            key={event.eventId}
            className="card"
          >

            <h3>{event.theme}</h3>

            <p>
              📍 {event.location}
            </p>

            <p>
              ⚠ {event.danger}
            </p>

            <p>
              Survivors:
              {" "}
              {event.playerCount}/20
            </p>

            <p>
              Starts in:
              {" "}
              {event.countdown}s
            </p>

            <button
              className="btn-primary"
              onClick={() =>
                handleJoin(event.eventId)
              }
              style={{ marginTop: 12 }}
            >
              JOIN EVENT
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}
