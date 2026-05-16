import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createEvent } from "../../api/api";

import { useUser } from "../../context/UserContext";
import { useMatch } from "../../context/MatchContext";

import evilForestImg from "../../assets/evil-forest.jpg";

const DANGER_COLORS = {
  EXTREME: {
    badge: "badge-red",
    glow: "rgba(239,68,68,0.12)",
    border: "rgba(239,68,68,0.25)"
  },

  HIGH: {
    badge: "badge-orange",
    glow: "rgba(249,115,22,0.10)",
    border: "rgba(249,115,22,0.25)"
  },

  MEDIUM: {
    badge: "badge-gold",
    glow: "rgba(234,179,8,0.08)",
    border: "rgba(234,179,8,0.25)"
  }
};

const EVENT_BACKGROUNDS = {
  evil_forest: evilForestImg
};

export default function FeaturedCarousel({
  featured = []
}) {

  const navigate = useNavigate();

  const { user } = useUser();

  const { setMatch } = useMatch();

  const [activeSlide, setActiveSlide] =
    useState(0);

  const [joining, setJoining] =
    useState("");

  const autoSlideRef =
    useRef(null);

  const touchStartX =
    useRef(0);

  // AUTO SLIDE
  useEffect(() => {

    if (featured.length < 2)
      return;

    autoSlideRef.current =
      setInterval(() => {

        setActiveSlide(prev =>
          (prev + 1) %
          featured.length
        );

      }, 5000);

    return () =>
      clearInterval(
        autoSlideRef.current
      );

  }, [featured.length]);

  // PLAY EVENT
  const handlePlay =
    async (eventId) => {

      try {

        setJoining(eventId);

        const data =
          await createEvent(
            user._id,
            user.username,
            eventId
          );

        setMatch(data);

        navigate("/queue", {
          replace: true
        });

      } catch (err) {

        console.error(err);

      } finally {

        setJoining("");
      }
    };

  // TOUCH START
  const handleTouchStart =
    (e) => {

      touchStartX.current =
        e.touches[0].clientX;
    };

  // TOUCH END
  const handleTouchEnd =
    (e) => {

      const diff =
        touchStartX.current -
        e.changedTouches[0].clientX;

      if (Math.abs(diff) > 50) {

        clearInterval(
          autoSlideRef.current
        );

        if (diff > 0) {

          setActiveSlide(prev =>
            (prev + 1) %
            featured.length
          );

        } else {

          setActiveSlide(prev =>
            (prev - 1 + featured.length) %
            featured.length
          );
        }
      }
    };

  const currentEvent =
    featured[activeSlide];

  if (!currentEvent)
    return null;

  const dangerStyle =
    DANGER_COLORS[currentEvent.danger] ||
    DANGER_COLORS.HIGH;

  const hasBackground =
    EVENT_BACKGROUNDS[currentEvent.id];

  return (

    <div
      style={{
        marginBottom: 24
      }}
    >

      <div className="section-title">
        Featured Districts
      </div>

      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{

          background:
            hasBackground

              ? `
                linear-gradient(
                  rgba(0,0,0,0.72),
                  rgba(0,0,0,0.82)
                ),
                url(${EVENT_BACKGROUNDS[currentEvent.id]})
              `

              : `linear-gradient(
                  135deg,
                  ${dangerStyle.glow},
                  var(--surface)
                )`,

          backgroundSize: "cover",

          backgroundPosition: "center",

          border:
            `1px solid ${dangerStyle.border}`,

          borderRadius: 24,

          padding: 22,

          position: "relative",

          overflow: "hidden",

          minHeight: 250,

          transition:
            "all 0.4s ease"
        }}
      >

        {/* DARK ORB */}
        <div
          style={{
            position: "absolute",
            right: -50,
            top: "50%",
            transform:
              "translateY(-50%)",

            width: 180,
            height: 180,

            borderRadius: "50%",

            background:
              dangerStyle.glow,

            filter: "blur(40px)"
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1
          }}
        >

          {/* BADGES */}
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 16,
              flexWrap: "wrap"
            }}
          >

            <span
              className={`badge ${dangerStyle.badge}`}
            >
              ⚠ {currentEvent.danger}
            </span>

            <span className="badge badge-blue">
              📍 {currentEvent.location}
            </span>

          </div>

          {/* TITLE */}
          <div
            style={{
              fontFamily:
                "Bebas Neue, sans-serif",

              fontSize: 42,

              letterSpacing: 2,

              lineHeight: 0.95,

              marginBottom: 12,

              textShadow:
                "0 0 18px rgba(0,0,0,0.5)"
            }}
          >

            {currentEvent.name}

          </div>

          {/* TAGLINE */}
          <div
            style={{
              color: "rgba(255,255,255,0.72)",

              fontSize: 14,

              fontStyle: "italic",

              lineHeight: 1.6,

              marginBottom: 26,

              maxWidth: "90%"
            }}
          >

            "{currentEvent.tagline}"

          </div>

          {/* BUTTON */}
          <button
            className="btn-primary"
            onClick={() =>
              handlePlay(currentEvent.id)
            }
            disabled={!!joining}
            style={{
              fontSize: 15,
              padding: "16px 18px"
            }}
          >

            {
              joining === currentEvent.id

                ? "ENTERING..."

                : "⚡ START EVENT"
            }

          </button>

        </div>

      </div>

      {/* DOTS */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 8,
          marginTop: 12
        }}
      >

        {
          featured.map((_, i) => (

            <div
              key={i}
              onClick={() =>
                setActiveSlide(i)
              }
              style={{
                width:
                  i === activeSlide
                    ? 22
                    : 7,

                height: 7,

                borderRadius: 999,

                background:
                  i === activeSlide
                    ? "var(--red)"
                    : "rgba(255,255,255,0.12)",

                transition:
                  "all 0.3s ease"
              }}
            />

          ))
        }

      </div>

    </div>
  );
}
