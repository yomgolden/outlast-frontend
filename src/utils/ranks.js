export const RANKS = [

  {
    name: "Rookie",
    title: "Fresh Meat",
    minRp: 0,
    color: "#d1d5db"
  },

  {
    name: "Survivor",
    title: "Cursed Soul",
    minRp: 500,
    color: "#3b82f6"
  },

  {
    name: "Hunter",
    title: "Night Stalker",
    minRp: 1200,
    color: "#a855f7"
  },

  {
    name: "Slayer",
    title: "Entity Killer",
    minRp: 2500,
    color: "#ef4444"
  },

  {
    name: "Master",
    title: "Eternal Dread",
    minRp: 4500,
    color: "#991b1b"
  },

  {
    name: "Grandmaster",
    title: "Void Walker",
    minRp: 7000,
    color: "#ff1a1a"
  },

  {
    name: "Legend",
    title: "The Unkillable",
    minRp: 10000,
    color: "#ffffff"
  }

];

/*
=====================================
GET RANK FROM RP
=====================================
*/

export const getRankFromRp =
  (rp = 0) => {

    let current =
      RANKS[0];

    for (const rank of RANKS) {

      if (rp >= rank.minRp) {

        current = rank;
      }
    }

    return current;
  };
