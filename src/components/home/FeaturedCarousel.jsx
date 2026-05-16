import {
  useEffect,
  useRef,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  createEvent
} from "../../api/api";

import {
  useUser
} from "../../context/UserContext";

import {
  useMatch
} from "../../context/MatchContext";

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

const EVENT_ICONS = {
  mushin_nightmare: "🌆",
  blackout_yaba: "⚡",
  ajegunle_warzone: "🔴"
};

export default function FeaturedCarousel({
  featured = []
}) {

  const navigate =
    useNavigate();

  const { user } =
    useUser();

  const { setMatch } =
    useMatch();

  const [
    activeSlide,
    setActiveSlide
  ] = useState(0);

  const [
    joining,
    setJoining
  ] = useState("");

  const autoSlideRef =
    useRef(null);

  const touchStartX =
    useRef(0);

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

        navigate(
          "/queue",
          { replace: true }
        );

      } catch (err) {

        console.error(err);

      } finally {

        setJoining("");
      }
    };

  const handleTouchStart =
    (e) => {

      touchStartX.current =
        e.touches[0].clientX;
    };

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
            (
              prev - 1 +
              featured.length
            ) %
            featured.length
          );
        }
      }
    };

  if (
    featured.length === 0
  ) {

    return null;
  }

  const currentEvent =
    featured[activeSlide];

  const dangerStyle =
    DANGER_COLORS[
      currentEvent.danger
    ] || DANGER_COLORS.HIGH;

  return (

    <div
      style={{
        marginBottom: 20
      }}
    >

      <div className="section-title">
        Featured Districts
      </div>

      <div

        onTouchStart={
          handleTouchStart
        }

        onTouchEnd={
          handleTouchEnd
        }

        style={{

          background:
            `linear-gradient(135deg, ${dangerStyle.glow}, var(--surface))`,

          border:
            `1px solid ${dangerStyle.border}`,

          borderRadius: 20,

          padding: 20,

          position: "relative",

          overflow: "hidden",

          minHeight: 210
        }}
      >

        {/* BG ICON */}

        <div
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform:
              "translateY(-50%)",

            fontSize: 90,

            opacity: 0.07,

            pointerEvents:
              "none"
          }}
        >

          {
            EVENT_ICONS[
              currentEvent.id
            ]
          }

        </div>

        <div
          style={{
            position: "relative",
            zIndex: 1
          }}
        >

          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 12,
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

          <div
            style={{
              fontFamily:
                "Bebas Neue, sans-serif",

              fontSize: 30,

              letterSpacing: 2,

              lineHeight: 1.1,

              marginBottom: 6
            }}
          >

            {currentEvent.name}

          </div>

          <div
            style={{
              color:
                "var(--text2)",

              fontSize: 13,

              fontStyle:
                "italic",

              marginBottom: 16,

              lineHeight: 1.5
            }}
          >

            "
            {currentEvent.tagline}
            "

          </div>

          <button
            className="btn-primary"

            onClick={() =>
              handlePlay(
                currentEvent.id
              )
            }

            disabled={!!joining}
          >

            {joining ===
            currentEvent.id

              ? "ENTERING..."

              : "⚡ START EVENT"}

          </button>

        </div>

      </div>

      {/* DOTS */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "center",

          gap: 6,

          marginTop: 10
        }}
      >

        {featured.map(
          (_, i) => (

            <div

              key={i}

              onClick={() => {

                clearInterval(
                  autoSlideRef.current
                );

                setActiveSlide(i);
              }}

              style={{

                width:
                  i === activeSlide
                    ? 20
                    : 6,

                height: 6,

                borderRadius: 3,

                background:
                  i === activeSlide

                    ? "var(--red)"

                    : "var(--border2)",

                transition:
                  "all 0.3s ease",

                cursor: "pointer"
              }}
            />

          )
        )}

      </div>

    </div>
  );
}
