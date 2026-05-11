import React from "react";

import ReactDOM from "react-dom/client";

import App from "./App";

import "./styles/global.css";

import {
  UserProvider
} from "./context/UserContext";

import {
  MatchProvider
} from "./context/MatchContext";

import ErrorBoundary from "./components/ErrorBoundary";

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <React.StrictMode>

    <ErrorBoundary>

      <UserProvider>

        <MatchProvider>

          <App />

        </MatchProvider>

      </UserProvider>

    </ErrorBoundary>

  </React.StrictMode>
);
