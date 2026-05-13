import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

const MatchContext =
  createContext();

export const MatchProvider = ({
  children
}) => {

  /*
  =========================
  LOAD SAVED DATA
  =========================
  */

  const savedMatch =
    localStorage.getItem(
      "outlast_match"
    );

  const savedFeed =
    localStorage.getItem(
      "outlast_feed"
    );

  const savedResults =
    localStorage.getItem(
      "outlast_results"
    );

  /*
  =========================
  STATES
  =========================
  */

  const [match, setMatch] =
    useState(
      savedMatch
        ? JSON.parse(savedMatch)
        : null
    );

  const [feed, setFeed] =
    useState(
      savedFeed
        ? JSON.parse(savedFeed)
        : []
    );

  const [results, setResults] =
    useState(
      savedResults
        ? JSON.parse(savedResults)
        : null
    );

  const [loading, setLoading] =
    useState(false);

  /*
  =========================
  SAVE MATCH
  =========================
  */

  useEffect(() => {

    if (match) {

      localStorage.setItem(
        "outlast_match",
        JSON.stringify(match)
      );

    } else {

      localStorage.removeItem(
        "outlast_match"
      );
    }

  }, [match]);

  /*
  =========================
  SAVE FEED
  =========================
  */

  useEffect(() => {

    if (
      feed &&
      feed.length > 0
    ) {

      localStorage.setItem(
        "outlast_feed",
        JSON.stringify(feed)
      );

    } else {

      localStorage.removeItem(
        "outlast_feed"
      );
    }

  }, [feed]);

  /*
  =========================
  SAVE RESULTS
  =========================
  */

  useEffect(() => {

    if (results) {

      localStorage.setItem(
        "outlast_results",
        JSON.stringify(results)
      );

    } else {

      localStorage.removeItem(
        "outlast_results"
      );
    }

  }, [results]);

  /*
  =========================
  CLEAR MATCH
  =========================
  */

  const clearMatch = () => {

    setMatch(null);

    setFeed([]);

    setResults(null);

    localStorage.removeItem(
      "outlast_match"
    );

    localStorage.removeItem(
      "outlast_feed"
    );

    localStorage.removeItem(
      "outlast_results"
    );
  };

  return (

    <MatchContext.Provider
      value={{

        match,
        setMatch,

        feed,
        setFeed,

        results,
        setResults,

        loading,
        setLoading,

        clearMatch
      }}
    >

      {children}

    </MatchContext.Provider>
  );
};

export const useMatch = () =>
  useContext(MatchContext);
