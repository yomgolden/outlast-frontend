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

/*
=====================================
CONTEXT
=====================================
*/

const UserContext =
  createContext();

/*
=====================================
PROVIDER
=====================================
*/

export const UserProvider = ({
  children
}) => {

  /*
  =====================================
  STATES
  =====================================
  */

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  /*
  =====================================
  SAVE USER
  =====================================
  */

  const persistUser =
    (data) => {

      localStorage.setItem(
        "outlast_user",
        JSON.stringify(data)
      );

      setUser(data);
    };

  /*
  =====================================
  REFRESH USER FROM BACKEND
  =====================================
  */

  const loadUser =
    async (userId) => {

      try {

        if (!userId) return;

        const data =
          await getUser(userId);

        persistUser(data);

        return data;

      } catch (err) {

        console.error(
          "LOAD USER ERROR:",
          err
        );
      }
    };

  /*
  =====================================
  TELEGRAM BOOTSTRAP
  =====================================
  */

  useEffect(() => {

    const bootstrap =
      async () => {

        try {

          /*
          ==============================
          CHECK SAVED USER
          ==============================
          */

          const cached =
            localStorage.getItem(
              "outlast_user"
            );

          if (cached) {

            const parsed =
              JSON.parse(cached);

            setUser(parsed);

            // Refresh latest backend data
            await loadUser(
              parsed._id
            );

            setLoading(false);

            return;
          }

          /*
          ==============================
          TELEGRAM WEBAPP
          ==============================
          */

          const tg =
            window.Telegram?.WebApp;

          // Expand telegram app
          tg?.expand?.();

          // Ready state
          tg?.ready?.();

          const telegramUser =
            tg?.initDataUnsafe?.user;

          /*
          ==============================
          FALLBACK GUEST
          ==============================
          */

          const payload = {

            id:
              telegramUser?.id
                ? String(
                    telegramUser.id
                  )
                : `guest_${Date.now()}`,

            username:
              telegramUser?.username ||

              telegramUser?.first_name ||

              "Player",

            first_name:
              telegramUser?.first_name ||

              "Player",

            last_name:
              telegramUser?.last_name ||

              "",

            photo_url:
              telegramUser?.photo_url ||

              null
          };

          /*
          ==============================
          AUTH BACKEND
          ==============================
          */

          const auth =
            await authTelegram(
              payload
            );

          persistUser(auth);

        } catch (err) {

          console.error(
            "AUTH ERROR:",
            err
          );

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

  /*
  =====================================
  LOGOUT
  =====================================
  */

  const logout = () => {

    localStorage.removeItem(
      "outlast_user"
    );

    setUser(null);
  };

  /*
  =====================================
  PROVIDER
  =====================================
  */

  return (

    <UserContext.Provider
      value={{

        user,

        setUser:
          persistUser,

        loadUser,

        loading,

        error,

        logout
      }}
    >

      {children}

    </UserContext.Provider>
  );
};

/*
=====================================
HOOK
=====================================
*/

export const useUser =
  () => useContext(
    UserContext
  );
