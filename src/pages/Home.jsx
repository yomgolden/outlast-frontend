import { useEffect, useState } from "react";

import {
  getFeaturedEvents,
  getLeaderboard
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

        const [
          events,
          board
        ] = await Promise.all([

          getFeaturedEvents(),

          getLeaderboard()
        ]);

        setFeatured(events);

        setLeaderboard(
          board.slice(0, 5)
        );
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
