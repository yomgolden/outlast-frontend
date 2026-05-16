import { useEffect, useState } from "react";
import splash from "../assets/outlast-splash.jpg";

export default function SplashScreen({ onFinish }) {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setFade(true);
    }, 2200);

    const timer2 = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => {
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
    </div>
  );
}
