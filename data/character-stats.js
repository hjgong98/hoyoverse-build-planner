// /data/character-stats.js

// optional: update this to add more charas and their base stats
// only if this data gets used for future updates
// otherwise don't worry about this file

export const CHARACTER_STATS = {
  // Genshin Example
  Ayaka: {
    game: "genshin",
    baseHP: 12158,
    baseATK: 349,
    baseDEF: 782,
    critRate: 0.05,
    critDMG: 0.50,
    // Add scaling later: talents, constellations
    maxStats: {
      level90: {
        HP: 14041,
        ATK: 684,
        DEF: 868,
        critRate: 19.2,
        critDMG: 155.2,
      },
    },
  },
  HuTao: {
    game: "genshin",
    baseHP: 12907,
    baseATK: 572,
    baseDEF: 683,
    critRate: 0.05,
    critDMG: 1.552,
    maxStats: {
      level90: {
        HP: 14903,
        ATK: 949,
        DEF: 772,
        critRate: 19.2,
        critDMG: 155.2,
        // HP% scaling → talent-based
      },
    },
  },
  // Honkai: Star Rail
  Seele: {
    game: "hsr",
    baseSPD: 118,
    baseATK: 120,
    baseHP: 320,
    baseDEF: 90,
    maxStats: {
      level80: {
        SPD: 138,
        ATK: 400,
        HP: 1100,
        DEF: 300,
        critRate: 12.0,
        critDMG: 192,
      },
    },
  },
  // Zenless Zone Zero
  AnbyDemara: {
    game: "zzz",
    baseATK: 350,
    baseHP: 800,
    baseDEF: 200,
    maxStats: {
      level60: {
        ATK: 1300,
        HP: 2800,
        DEF: 700,
        critRate: 18.0,
        critDMG: 144,
      },
    },
  },
};
