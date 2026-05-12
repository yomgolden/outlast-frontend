import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 60000
});

api.interceptors.response.use(
  response => response,
  error => {
    if (!error.response) {
      return Promise.reject({ message: "Network error" });
    }
    return Promise.reject(error.response.data);
  }
);

export const authTelegram = async (data) => {
  const res = await api.post("/auth/telegram", data);
  return res.data;
};

export const getUser = async (userId) => {
  const res = await api.get(`/user/${userId}`);
  return res.data;
};

export const createEvent = async (userId, username) => {
  const res = await api.post("/match/create", { userId, username });
  return res.data;
};

export const joinEvent = async (eventId, userId, username) => {
  const res = await api.post("/match/join", { eventId, userId, username });
  return res.data;
};

export const getEvents = async () => {
  const res = await api.get("/match/events");
  return res.data;
};

export const getEventStatus = async (eventId) => {
  const res = await api.get(`/match/${eventId}/status`);
  return res.data;
};

export const startSimulation = async (matchId) => {
  const res = await api.post(`/simulation/${matchId}/start`);
  return res.data;
};

export const getSimulationFeed = async (matchId) => {
  const res = await api.get(`/simulation/${matchId}/feed`);
  return res.data;
};

export const getLeaderboard = async () => {
  const res = await api.get("/leaderboard");
  return res.data;
};

export const equipTools = async (userId, tools) => {
  const res = await api.post(`/user/${userId}/equip`, { tools });
  return res.data;
};

export default api;
