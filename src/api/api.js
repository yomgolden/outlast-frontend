import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000
});

api.interceptors.response.use(
  (response) => response,
  (error) => {

    if (!error.response) {
      return Promise.reject({
        message: "Network error"
      });
    }

    return Promise.reject(error.response.data);
  }
);

export const authTelegram = async (
  telegramData
) => {
  const res = await api.post(
    "/auth/telegram",
    telegramData
  );

  return res.data;
};

export const getUser = async (
  userId
) => {
  const res = await api.get(
    `/user/${userId}`
  );

  return res.data;
};

export const joinMatch = async (
  userId
) => {
  const res = await api.post(
    "/match/join",
    { userId }
  );

  return res.data;
};

export const getMatchStatus = async (
  matchId
) => {
  const res = await api.get(
    `/match/${matchId}/status`
  );

  return res.data;
};

export const getMatchFeed = async (
  matchId
) => {
  const res = await api.get(
    `/match/${matchId}/feed`
  );

  return res.data;
};

export const simulateMatch = async (
  matchId
) => {
  const res = await api.post(
    `/simulation/${matchId}/simulate`
  );

  return res.data;
};

export const equipTools = async (
  userId,
  tools
) => {

  const res = await api.post(
    `/user/${userId}/equip`,
    { tools }
  );

  return res.data;
};

export const getLeaderboard =
  async () => {

    const res = await api.get(
      "/leaderboard"
    );

    return res.data;
  };

export default api;
