import {
  createContext,
  useContext,
  useState
} from "react";

const MatchContext =
  createContext();

export const MatchProvider = ({
  children
}) => {

  const [match, setMatch] =
    useState(null);

  const [feed, setFeed] =
    useState([]);

  const [results, setResults] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

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
        setLoading
      }}
    >
      {children}
    </MatchContext.Provider>
  );
};

export const useMatch = () =>
  useContext(MatchContext);
