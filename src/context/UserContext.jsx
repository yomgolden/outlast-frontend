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
          TELEGRAM WEBAPP
          ==============================
          */

          const tg =
            window.Telegram?.WebApp;

          tg?.expand?.();

          tg?.ready?.();

          const telegramUser =
            tg?.initDataUnsafe?.user;

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

            /*
            ==========================
            IGNORE OLD GUEST USERS
            ==========================
            */

            const isGuest =
              parsed?.telegramId?.startsWith(
                "guest_"
              );

            if (!isGuest) {

              setUser(parsed);

              await loadUser(
                parsed._id
              );

              setLoading(false);

              return;
            }

            /*
            ==========================
            REMOVE OLD GUEST CACHE
            ==========================
            */

            localStorage.removeItem(
              "outlast_user"
            );
          }

          /*
          ==============================
          TELEGRAM PAYLOAD
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

          console.log(
            "TELEGRAM USER:",
            payload
          );

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
