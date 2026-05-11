import {
  createContext,
  useContext,
  useState
} from "react";

const MatchContext = createContext();

export const MatchProvider = ({
  children
}) => {

  const [match, setMatch] = useState(null);

  return (
    <MatchContext.Provider
      value={{
        match,
        setMatch
      }}
    >
      {children}
    </MatchContext.Provider>
  );
};

export const useMatch = () =>
  useContext(MatchContext);
