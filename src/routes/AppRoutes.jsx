import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Home from "../pages/Home";
import Queue from "../pages/Queue";
import Match from "../pages/Match";
import Results from "../pages/Results";
import Leaderboard from "../pages/Leaderboard";
import Profile from "../pages/Profile";
import Shop from "../pages/Shop";

export default function AppRoutes() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
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
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/shop"
          element={<Shop />}
        />

      </Routes>

    </BrowserRouter>
  );
}
