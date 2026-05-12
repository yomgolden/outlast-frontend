import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Events from "../pages/Events";
import Queue from "../pages/Queue";
import Match from "../pages/Match";
import Results from "../pages/Results";
import Leaderboard from "../pages/Leaderboard";
import Profile from "../pages/Profile";
import History from "../pages/History";

export default function AppRoutes() {

  return (

    <Routes>

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/events"
        element={<Events />}
      />

      <Route
        path="/queue"
        element={<Queue />}
      />

      <Route
        path="/match"
        element={<Match />}
      />

      <Route
        path="/results"
        element={<Results />}
      />

      <Route
        path="/leaderboard"
        element={<Leaderboard />}
      />

      <Route
        path="/history"
        element={<History />}
      />

      <Route
        path="/profile"
        element={<Profile />}
      />

    </Routes>
  );
}
