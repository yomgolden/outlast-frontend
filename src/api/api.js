import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

export const authTelegram = async (data) => {
  const res = await api.post(
    "/auth/telegram",
    data
  );

  return res.data;
};

export const joinMatch = async (userId) => {
  const res = await api.post(
    "/match/join",
    { userId }
  );

  return res.data;
};

export const getMatchStatus = async (matchId) => {
  const res = await api.get(
    `/match/${matchId}/status`
  );

  return res.data;
};

export const getMatchFeed = async (matchId) => {
  const res = await api.get(
    `/match/${matchId}/feed`
  );

  return res.data;
};

export const simulateMatch = async (matchId) => {
  const res = await api.post(
    `/simulation/${matchId}/simulate`
  );

  return res.data;
};

export default api;
