import { useEffect, useState } from "react";
import splash from "../assets/outlast-splash.jpeg";

export default function SplashScreen({ onFinish }) {
  const [fade, setFade] = useState(false);

  const [loadingText, setLoadingText] = useState(
    "Loading districts"
  );

  useEffect(() => {
    const texts = [
      "Loading districts",
      "Preparing arena",
      "Engaging threats"
    ];

    let index = 0;

    const textInterval = setInterval(() => {
      index = (index + 1) % texts.length;
      setLoadingText(texts[index]);
    }, 700);

    const timer1 = setTimeout(() => {
      setFade(true);
    }, 2200);

    const timer2 = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => {
      clearInterval(textInterval);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onFinish]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        opacity: fade ? 0 : 1,
        transition: "opacity 0.3s ease"
      }}
    >
      <img
        src={splash}
        alt="OUTLAST"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover"
        }}
      />

      {/* LOADING TEXT */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          width: "100%",
          textAlign: "center",
          color: "#9ca3af",
          fontSize: 11,
          letterSpacing: 3,
          textTransform: "uppercase",
          fontWeight: 600
        }}
      >
        {loadingText}
      </div>
    </div>
  );
}
