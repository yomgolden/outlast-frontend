import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Home from "../pages/Home";
import Queue from "../pages/Queue";
import Match from "../pages/Match";
import Results from "../pages/Results";

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

      </Routes>

    </BrowserRouter>
  );
}
