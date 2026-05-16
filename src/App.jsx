import { useEffect } from "react";

import { useEffect, useState } from "react";
import SplashScreen from "./components/SplashScreen";
import AppRoutes from "./routes/AppRoutes";
import BottomNav from "./components/BottomNav";

/*
=====================================
TELEGRAM WEB APP
=====================================
*/

const tg =
  window.Telegram?.WebApp;

export default function App() {

  useEffect(() => {

    if (tg) {

      // READY
      tg.ready();

      // EXPAND FULLSCREEN
      tg.expand();

      // OPTIONAL COLORS
      tg.setHeaderColor("#050816");

      tg.setBackgroundColor("#050816");

      // REMOVE VERTICAL SWIPE CLOSE
      if (tg.disableVerticalSwipes) {
        tg.disableVerticalSwipes();
      }

      // LOG USER
      console.log(
        "TELEGRAM USER:",
        tg.initDataUnsafe?.user
      );
    }

  }, []);

  return (

    <div className="shell">

      <AppRoutes />

      <BottomNav />

    </div>
  );
}
