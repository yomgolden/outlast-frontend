import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL,

  timeout: 60000
});

/*
==================================
RESPONSE INTERCEPTOR
==================================
*/

api.interceptors.response.use(

  response => response,

  error => {

    if (!error.response) {

      return Promise.reject({
        message:
          "Network error"
      });
    }

    return Promise.reject(
      error.response.data
    );
  }
);

/*
==================================
AUTH
==================================
*/

export const authTelegram =
  async (
    telegramData
  ) => {

    const res =
      await api.post(
        "/auth/telegram",
        telegramData
      );

    return res.data;
  };

/*
==================================
USER
==================================
*/

export const getUser =
  async (
    userId
  ) => {

    const res =
      await api.get(
        `/user/${userId}`
      );

    return res.data;
  };

/*
==================================
JOIN MATCH
==================================
*/

export const joinMatch =
  async (
    userId
  ) => {

    const res =
      await api.post(
        "/match/join",
        { userId }
      );

    return res.data;
  };

/*
==================================
MATCH STATUS
==================================
*/

export const getMatchStatus =
  async (
    matchId
  ) => {

    const res =
      await api.get(
        `/match/${matchId}/status`
      );

    return res.data;
  };

/*
==================================
MATCH FEED
==================================
*/

export const getMatchFeed =
  async (
    matchId
  ) => {

    const res =
      await api.get(
        `/match/${matchId}/feed`
      );

    return res.data;
  };

/*
==================================
START SIMULATION
==================================
*/

export const startSimulation =
  async (
    matchId
  ) => {

    const res =
      await api.post(
        `/simulation/${matchId}/start`
      );

    return res.data;
  };

/*
==================================
LIVE SIMULATION FEED
==================================
*/

export const getSimulationFeed =
  async (
    matchId
  ) => {

    const res =
      await api.get(
        `/simulation/${matchId}/feed`
      );

    return res.data;
  };

/*
==================================
EQUIP TOOLS
==================================
*/

export const equipTools =
  async (
    userId,
    tools
  ) => {

    const res =
      await api.post(
        `/user/${userId}/equip`,
        { tools }
      );

    return res.data;
  };

/*
==================================
LEADERBOARD
==================================
*/

export const getLeaderboard =
  async () => {

    const res =
      await api.get(
        "/leaderboard"
      );

    return res.data;
  };

export default api;
