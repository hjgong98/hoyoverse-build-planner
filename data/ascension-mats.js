// /data/ascension-mats.js

// todo list:
// - add all the ascension materials (separated by types)
// - add images for each material

export const ASCENSION_MATERIALS = {
  genshin: [
    { name: "Mora", img: "/genshin/mora.webp", tags: ["currency"] },
    {
      name: "Firm Arrowhead",
      img: "/genshin/Item_Firm_Arrowhead.webp",
      tags: ["common", "arrowhead", 1],
    },
    {
      name: "Sharp Arrowhead",
      img: "/genshin/Item_Sharp_Arrowhead.webp",
      tags: ["common", "arrowhead", 2],
    },
    {
      name: "Weathered Arrowhead",
      img: "/genshin/Item_Weathered_Arrowhead.png",
      tags: ["common", "arrowhead", 3],
    },
    {
      name: "Teachings of Freedom",
      img: "/genshin/Item_Teachings_of_Freedom.png",
      tags: ["talent books", "freedom", 1],
    },
    {
      name: "Guide to Freedom",
      img: "/genshin/Item_Guide_to_Freedom.webp",
      tags: ["talent books", "freedom", 2],
    },
    {
      name: "Philosophies of Freedom",
      img: "/genshin/Item_Philosophies_of_Freedom.webp",
      tags: ["talent books", "freedom", 3],
    },
  ],
  hsr: [
    {
      name: "Credit",
      img: "/honkai star rail/Item_Credit.webp",
      tags: ["currency"],
    },
  ],
  zzz: [
    {
      name: "Dennies",
      img: "/zenless zone zero/Item_Denny.webp",
      tags: ["currency"],
    },
    {
      name: "Basic Shock CHip",
      img: "/zenless zone zero/Item_Basic_Shock_Chip.webp",
      tags: ["chip", "shock"],
    },
  ],
};
