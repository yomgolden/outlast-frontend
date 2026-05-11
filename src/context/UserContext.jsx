import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import {
  authTelegram,
  getUser
} from "../api/api";

const UserContext =
  createContext();

export const UserProvider = ({
  children
}) => {

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  const persistUser = (data) => {

    localStorage.setItem(
      "outlast_user",
      JSON.stringify(data)
    );

    setUser(data);
  };

  const loadUser = async (
    userId
  ) => {

    try {

      const data =
        await getUser(userId);

      persistUser(data);

    } catch (err) {

      setError(
        err.message ||
        "Failed to load user"
      );
    }
  };

  useEffect(() => {

    const bootstrap =
      async () => {

        try {

          const cached =
            localStorage.getItem(
              "outlast_user"
            );

          if (cached) {

            const parsed =
              JSON.parse(cached);

            setUser(parsed);

            await loadUser(
              parsed._id
            );

            setLoading(false);

            return;
          }

          const telegram =
            window.Telegram
              ?.WebApp
              ?.initDataUnsafe
              ?.user;

          const telegramUser = {
            id:
              telegram?.id ||
              Date.now().toString(),

            username:
              telegram?.username ||
              "Player"
          };

          const auth =
            await authTelegram(
              telegramUser
            );

          persistUser(auth);

        } catch (err) {

          setError(
            err.message ||
            "Authentication failed"
          );

        } finally {

          setLoading(false);
        }
      };

    bootstrap();

  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser:
          persistUser,
        loadUser,
        loading,
        error
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () =>
  useContext(UserContext);
