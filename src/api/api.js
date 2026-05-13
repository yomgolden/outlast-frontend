 import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 60000
});

/*
=====================================
ERROR HANDLER
=====================================
*/

api.interceptors.response.use(

  (response) => response,

  (error) => {

    if (!error.response) {

      return Promise.reject({
        message: "Network error"
      });
    }

    return Promise.reject(
      error.response.data
    );
  }
);

/*
=====================================
AUTH
=====================================
*/

export const authTelegram =
  async (data) => {

    const res =
      await api.post(
        "/auth/telegram",
        data
      );

    return res.data;
  };

/*
=====================================
USER
=====================================
*/

export const getUser =
  async (userId) => {

    const res =
      await api.get(
        `/user/${userId}`
      );

    return res.data;
  };

/*
=====================================
EVENTS
=====================================
*/

export const getEvents =
  async () => {

    const res =
      await api.get(
        "/events"
      );

    return res.data;
  };

export const getFeaturedEvents =
  async () => {

    const res =
      await api.get(
        "/events/featured"
      );

    return res.data;
  };

export const createEvent =
  async (
    userId,
    username,
    eventType
  ) => {

    const res =
      await api.post(
        "/events/create",
        {
          userId,
          username,
          eventType
        }
      );

    return res.data;
  };

export const joinEvent =
  async (
    eventId,
    userId,
    username
  ) => {

    const res =
      await api.post(
        "/events/join",
        {
          eventId,
          userId,
          username
        }
      );

    return res.data;
  };

export const getEventStatus =
  async (eventId) => {

    const res =
      await api.get(
        `/events/${eventId}/status`
      );

    return res.data;
  };

export const getEventFeed =
  async (eventId) => {

    const res =
      await api.get(
        `/events/${eventId}/feed`
      );

    return res.data;
  };

/*
=====================================
LEADERBOARD
=====================================
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
