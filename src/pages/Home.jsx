import { useEffect, useState } from "react";

import {
  getFeaturedEvents,
  getWeeklyLeaderboard
} from "../api/api";

import { useUser } from "../context/UserContext";
import { useMatch } from "../context/MatchContext";

import Loader from "../components/Loader";

import HomeHeader from "../components/home/HomeHeader";
import ProfileBar from "../components/home/ProfileBar";
import FeaturedCarousel from "../components/home/FeaturedCarousel";
import LeaderboardSection from "../components/home/LeaderboardSection";

export default function Home() {

  const { user, loading } =
    useUser();

  const { match } =
    useMatch();

  const [featured, setFeatured] =
    useState([]);

  const [leaderboard, setLeaderboard] =
    useState([]);

  useEffect(() => {

    const load =
      async () => {

        /*
        =========================
        FEATURED EVENTS
        =========================
        */

        try {

          const events =
            await getFeaturedEvents();

          setFeatured(
            events || []
          );

        } catch (err) {

          console.error(
            "EVENT ERROR:",
            err
          );
        }

        /*
        =========================
        WEEKLY LEADERBOARD
        =========================
        */

        try {

          const board =
            await getWeeklyLeaderboard();

          setLeaderboard(
            (board || []).slice(0, 5)
          );

        } catch (err) {

          console.error(
            "LEADERBOARD ERROR:",
            err
          );
        }
      };

    load();

  }, []);

  if (loading)
    return <Loader />;

  return (

    <div className="page">

      <HomeHeader />

      <ProfileBar user={user} />

      <FeaturedCarousel
        featured={featured}
      />

      <LeaderboardSection
        leaderboard={leaderboard}
      />

    </div>
  );
}
