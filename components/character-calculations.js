// /components/character-calculations.js

import { ASCENSION_MATERIALS } from "../data/ascension-mats.js";

export function calculateCharacterAscensionMaterials(
  character,
  currentLevel,
  targetLevel,
) {
  const requirements = {
    mora: 0,
    gems: [],
    local: [],
    common: [],
    boss: [],
    crown: 0,
  };

  // Define ALL ascension stages with their material requirements
  const ascensionStages = [
    {
      level: 20, // Ascension 0->1
      mora: 20000,
      gemTier: 2,
      gemCount: 1,
      localCount: 3,
      commonTier: 1,
      commonCount: 3,
    },
    {
      level: 40, // Ascension 1->2
      mora: 40000,
      gemTier: 3,
      gemCount: 3,
      localCount: 10,
      commonTier: 1,
      commonCount: 15,
      bossCount: 2,
    },
    {
      level: 50, // Ascension 2->3
      mora: 60000,
      gemTier: 3,
      gemCount: 6,
      localCount: 20,
      commonTier: 2,
      commonCount: 12,
      bossCount: 4,
    },
    {
      level: 60, // Ascension 3->4
      mora: 80000,
      gemTier: 4,
      gemCount: 3,
      localCount: 30,
      commonTier: 2,
      commonCount: 18,
      bossCount: 8,
    },
    {
      level: 70, // Ascension 4->5
      mora: 100000,
      gemTier: 4,
      gemCount: 6,
      localCount: 45,
      commonTier: 3,
      commonCount: 12,
      bossCount: 12,
    },
    {
      level: 80, // Ascension 5->6
      mora: 120000,
      gemTier: 5,
      gemCount: 6,
      localCount: 60,
      commonTier: 3,
      commonCount: 24,
      bossCount: 20,
    },
  ];

  // Determine which ascension stages we need based on current and target level
  const neededStages = ascensionStages.filter((stage) => {
    const stageMinLevel = stage.level - 10; // Stage applies to levels leading up to this
    return currentLevel <= stageMinLevel && targetLevel > stageMinLevel;
  });

  console.log(
    `Calculating materials from level ${currentLevel} to ${targetLevel}`,
  );
  console.log(`Needed stages:`, neededStages);

  // Aggregate materials for needed stages
  neededStages.forEach((stage) => {
    requirements.mora += stage.mora;

    // Add gem requirements
    requirements.gems.push({
      element: character.element.toLowerCase(),
      tier: stage.gemTier,
      count: stage.gemCount,
    });

    // Add local specialty
    if (character.local) {
      requirements.local.push({
        name: character.local,
        count: stage.localCount,
      });
    }

    // Add common materials
    if (character.common) {
      requirements.common.push({
        type: character.common,
        tier: stage.commonTier,
        count: stage.commonCount,
      });
    }

    // Add boss materials
    if (
      stage.bossCount && character.overworld && character.overworld !== "none"
    ) {
      requirements.boss.push({
        name: character.overworld,
        count: stage.bossCount,
      });
    }
  });

  console.log("Final requirements:", requirements);
  return requirements;
}

export function calculateTalentMaterials(
  character,
  talentType,
  currentLevel,
  targetLevel,
) {
  const requirements = {
    mora: 0,
    common: [],
    books: [],
    weekly: [],
    crown: 0,
  };

  // Return empty if no upgrade needed
  if (currentLevel >= targetLevel) {
    return requirements;
  }

  // Check if this is a Traveler character (special talent requirements)
  const isTraveler = character.name && character.name.includes("Traveler");

  if (isTraveler) {
    return calculateTravelerTalentMaterials(
      character,
      talentType,
      currentLevel,
      targetLevel,
    );
  }

  // Regular character talent upgrade costs by target level
  const talentCosts = [
    {
      level: 2,
      mora: 12500,
      commonTier: 1,
      commonCount: 6,
      bookTier: 2,
      bookCount: 3,
    },
    {
      level: 3,
      mora: 17500,
      commonTier: 2,
      commonCount: 3,
      bookTier: 3,
      bookCount: 2,
    },
    {
      level: 4,
      mora: 25000,
      commonTier: 2,
      commonCount: 4,
      bookTier: 3,
      bookCount: 4,
    },
    {
      level: 5,
      mora: 30000,
      commonTier: 2,
      commonCount: 6,
      bookTier: 3,
      bookCount: 6,
    },
    {
      level: 6,
      mora: 37500,
      commonTier: 2,
      commonCount: 9,
      bookTier: 3,
      bookCount: 9,
    },
    {
      level: 7,
      mora: 120000,
      commonTier: 3,
      commonCount: 4,
      bookTier: 4,
      bookCount: 4,
      weeklyCount: 1,
    },
    {
      level: 8,
      mora: 260000,
      commonTier: 3,
      commonCount: 6,
      bookTier: 4,
      bookCount: 6,
      weeklyCount: 1,
    },
    {
      level: 9,
      mora: 450000,
      commonTier: 3,
      commonCount: 12,
      bookTier: 4,
      bookCount: 12,
      weeklyCount: 2,
    },
    {
      level: 10,
      mora: 700000,
      commonTier: 3,
      commonCount: 16,
      bookTier: 4,
      bookCount: 16,
      weeklyCount: 2,
      crownCount: 1,
    },
  ];

  // Get only the levels we need to upgrade
  const neededLevels = talentCosts.filter((cost) =>
    cost.level > currentLevel && cost.level <= targetLevel
  );

  console.log(
    `Calculating talent ${talentType} from ${currentLevel} to ${targetLevel}`,
  );
  console.log(`Needed levels:`, neededLevels);

  neededLevels.forEach((cost) => {
    requirements.mora += cost.mora;

    // Add common materials
    if (character.common) {
      requirements.common.push({
        type: character.common,
        tier: cost.commonTier,
        count: cost.commonCount,
      });
    }

    // Add talent books
    if (character.type && character.type !== "Adaptive") {
      requirements.books.push({
        type: character.type,
        tier: cost.bookTier,
        count: cost.bookCount,
      });
    }

    // Add weekly boss materials
    if (
      cost.weeklyCount && character.weekly && character.weekly !== "Adaptive"
    ) {
      requirements.weekly.push({
        name: character.weekly,
        count: cost.weeklyCount,
      });
    }

    // Add crown
    if (cost.crownCount) {
      requirements.crown += cost.crownCount;
    }
  });

  console.log("Final talent requirements:", requirements);
  return requirements;
}

// Special function for Traveler talent calculations
function calculateTravelerTalentMaterials(
  character,
  talentType,
  currentLevel,
  targetLevel,
) {
  const requirements = {
    mora: 0,
    common: [],
    books: [],
    weekly: [],
    crown: 0,
  };

  // Determine Traveler element
  const travelerMatch = character.name.match(/Traveler \((.*?)\)/);
  const element = travelerMatch ? travelerMatch[1].toLowerCase() : "anemo";

  // Define Traveler talent costs by element
  const travelerTalentCosts = {
    anemo: [
      {
        level: 2,
        mora: 12500,
        commonTier: 1,
        commonCount: 6,
        bookType: "freedom",
        bookTier: 2,
        bookCount: 3,
      },
      {
        level: 3,
        mora: 17500,
        commonTier: 2,
        commonCount: 3,
        bookType: "resistance",
        bookTier: 3,
        bookCount: 2,
      },
      {
        level: 4,
        mora: 25000,
        commonTier: 2,
        commonCount: 4,
        bookType: "ballad",
        bookTier: 3,
        bookCount: 4,
      },
      {
        level: 5,
        mora: 30000,
        commonTier: 2,
        commonCount: 6,
        bookType: "freedom",
        bookTier: 3,
        bookCount: 6,
      },
      {
        level: 6,
        mora: 37500,
        commonTier: 2,
        commonCount: 9,
        bookType: "resistance",
        bookTier: 3,
        bookCount: 9,
      },
      {
        level: 7,
        mora: 120000,
        commonTier: 3,
        commonCount: 4,
        bookType: "ballad",
        bookTier: 4,
        bookCount: 4,
        weeklyCount: 1,
      },
      {
        level: 8,
        mora: 260000,
        commonTier: 3,
        commonCount: 6,
        bookType: "freedom",
        bookTier: 4,
        bookCount: 6,
        weeklyCount: 1,
      },
      {
        level: 9,
        mora: 450000,
        commonTier: 3,
        commonCount: 9,
        bookType: "resistance",
        bookTier: 4,
        bookCount: 12,
        weeklyCount: 2,
      },
      {
        level: 10,
        mora: 700000,
        commonTier: 3,
        commonCount: 12,
        bookType: "ballad",
        bookTier: 4,
        bookCount: 16,
        weeklyCount: 2,
        crownCount: 1,
      },
    ],
    geo: [
      {
        level: 2,
        mora: 12500,
        commonTier: 1,
        commonCount: 6,
        bookType: "freedom",
        bookTier: 2,
        bookCount: 3,
      },
      {
        level: 3,
        mora: 17500,
        commonTier: 2,
        commonCount: 3,
        bookType: "resistance",
        bookTier: 3,
        bookCount: 2,
      },
      {
        level: 4,
        mora: 25000,
        commonTier: 2,
        commonCount: 4,
        bookType: "ballad",
        bookTier: 3,
        bookCount: 4,
      },
      {
        level: 5,
        mora: 30000,
        commonTier: 2,
        commonCount: 6,
        bookType: "freedom",
        bookTier: 3,
        bookCount: 6,
      },
      {
        level: 6,
        mora: 37500,
        commonTier: 2,
        commonCount: 9,
        bookType: "resistance",
        bookTier: 3,
        bookCount: 9,
      },
      {
        level: 7,
        mora: 120000,
        commonTier: 3,
        commonCount: 4,
        bookType: "ballad",
        bookTier: 4,
        bookCount: 4,
        weeklyCount: 1,
      },
      {
        level: 8,
        mora: 260000,
        commonTier: 3,
        commonCount: 6,
        bookType: "freedom",
        bookTier: 4,
        bookCount: 6,
        weeklyCount: 1,
      },
      {
        level: 9,
        mora: 450000,
        commonTier: 3,
        commonCount: 9,
        bookType: "resistance",
        bookTier: 4,
        bookCount: 12,
        weeklyCount: 2,
      },
      {
        level: 10,
        mora: 700000,
        commonTier: 3,
        commonCount: 12,
        bookType: "ballad",
        bookTier: 4,
        bookCount: 16,
        weeklyCount: 2,
        crownCount: 1,
      },
    ],
    electro: [
      {
        level: 2,
        mora: 12500,
        commonTier: 1,
        commonCount: 6,
        bookType: "transience",
        bookTier: 2,
        bookCount: 3,
      },
      {
        level: 3,
        mora: 17500,
        commonTier: 2,
        commonCount: 3,
        bookType: "elegance",
        bookTier: 3,
        bookCount: 2,
      },
      {
        level: 4,
        mora: 25000,
        commonTier: 2,
        commonCount: 4,
        bookType: "light",
        bookTier: 3,
        bookCount: 4,
      },
      {
        level: 5,
        mora: 30000,
        commonTier: 2,
        commonCount: 6,
        bookType: "transience",
        bookTier: 3,
        bookCount: 6,
      },
      {
        level: 6,
        mora: 37500,
        commonTier: 2,
        commonCount: 9,
        bookType: "elegance",
        bookTier: 3,
        bookCount: 9,
      },
      {
        level: 7,
        mora: 120000,
        commonTier: 3,
        commonCount: 4,
        bookType: "light",
        bookTier: 4,
        bookCount: 4,
        weeklyCount: 1,
      },
      {
        level: 8,
        mora: 260000,
        commonTier: 3,
        commonCount: 6,
        bookType: "transience",
        bookTier: 4,
        bookCount: 6,
        weeklyCount: 1,
      },
      {
        level: 9,
        mora: 450000,
        commonTier: 3,
        commonCount: 9,
        bookType: "elegance",
        bookTier: 4,
        bookCount: 12,
        weeklyCount: 2,
      },
      {
        level: 10,
        mora: 700000,
        commonTier: 3,
        commonCount: 12,
        bookType: "light",
        bookTier: 4,
        bookCount: 16,
        weeklyCount: 2,
        crownCount: 1,
      },
    ],
    dendro: [
      {
        level: 2,
        mora: 12500,
        commonTier: 1,
        commonCount: 6,
        bookType: "admonition",
        bookTier: 2,
        bookCount: 3,
      },
      {
        level: 3,
        mora: 17500,
        commonTier: 2,
        commonCount: 3,
        bookType: "ingenuity",
        bookTier: 3,
        bookCount: 2,
      },
      {
        level: 4,
        mora: 25000,
        commonTier: 2,
        commonCount: 4,
        bookType: "praxis",
        bookTier: 3,
        bookCount: 4,
      },
      {
        level: 5,
        mora: 30000,
        commonTier: 2,
        commonCount: 6,
        bookType: "admonition",
        bookTier: 3,
        bookCount: 6,
      },
      {
        level: 6,
        mora: 37500,
        commonTier: 2,
        commonCount: 9,
        bookType: "ingenuity",
        bookTier: 3,
        bookCount: 9,
      },
      {
        level: 7,
        mora: 120000,
        commonTier: 3,
        commonCount: 4,
        bookType: "praxis",
        bookTier: 4,
        bookCount: 4,
        weeklyCount: 1,
      },
      {
        level: 8,
        mora: 260000,
        commonTier: 3,
        commonCount: 6,
        bookType: "admonition",
        bookTier: 4,
        bookCount: 6,
        weeklyCount: 1,
      },
      {
        level: 9,
        mora: 450000,
        commonTier: 3,
        commonCount: 9,
        bookType: "ingenuity",
        bookTier: 4,
        bookCount: 12,
        weeklyCount: 2,
      },
      {
        level: 10,
        mora: 700000,
        commonTier: 3,
        commonCount: 12,
        bookType: "praxis",
        bookTier: 4,
        bookCount: 16,
        weeklyCount: 2,
        crownCount: 1,
      },
    ],
    hydro: [
      {
        level: 2,
        mora: 12500,
        commonTier: 1,
        commonCount: 6,
        bookType: "equity",
        bookTier: 2,
        bookCount: 3,
      },
      {
        level: 3,
        mora: 17500,
        commonTier: 2,
        commonCount: 3,
        bookType: "justice",
        bookTier: 3,
        bookCount: 2,
      },
      {
        level: 4,
        mora: 25000,
        commonTier: 2,
        commonCount: 4,
        bookType: "order",
        bookTier: 3,
        bookCount: 4,
      },
      {
        level: 5,
        mora: 30000,
        commonTier: 2,
        commonCount: 6,
        bookType: "equity",
        bookTier: 3,
        bookCount: 6,
      },
      {
        level: 6,
        mora: 37500,
        commonTier: 2,
        commonCount: 9,
        bookType: "justice",
        bookTier: 3,
        bookCount: 9,
      },
      {
        level: 7,
        mora: 120000,
        commonTier: 3,
        commonCount: 4,
        bookType: "order",
        bookTier: 4,
        bookCount: 4,
        weeklyCount: 1,
      },
      {
        level: 8,
        mora: 260000,
        commonTier: 3,
        commonCount: 6,
        bookType: "equity",
        bookTier: 4,
        bookCount: 6,
        weeklyCount: 1,
      },
      {
        level: 9,
        mora: 450000,
        commonTier: 3,
        commonCount: 9,
        bookType: "justice",
        bookTier: 4,
        bookCount: 12,
        weeklyCount: 2,
      },
      {
        level: 10,
        mora: 700000,
        commonTier: 3,
        commonCount: 12,
        bookType: "order",
        bookTier: 4,
        bookCount: 16,
        weeklyCount: 2,
        crownCount: 1,
      },
    ],
    pyro: [
      {
        level: 2,
        mora: 12500,
        commonTier: 1,
        commonCount: 6,
        bookType: "contention",
        bookTier: 2,
        bookCount: 3,
      },
      {
        level: 3,
        mora: 17500,
        commonTier: 2,
        commonCount: 3,
        bookType: "kindling",
        bookTier: 3,
        bookCount: 2,
      },
      {
        level: 4,
        mora: 25000,
        commonTier: 2,
        commonCount: 4,
        bookType: "conflict",
        bookTier: 3,
        bookCount: 4,
      },
      {
        level: 5,
        mora: 30000,
        commonTier: 2,
        commonCount: 6,
        bookType: "contention",
        bookTier: 3,
        bookCount: 6,
      },
      {
        level: 6,
        mora: 37500,
        commonTier: 2,
        commonCount: 9,
        bookType: "kindling",
        bookTier: 3,
        bookCount: 9,
      },
      {
        level: 7,
        mora: 120000,
        commonTier: 3,
        commonCount: 4,
        bookType: "conflict",
        bookTier: 4,
        bookCount: 4,
        weeklyCount: 1,
      },
      {
        level: 8,
        mora: 260000,
        commonTier: 3,
        commonCount: 6,
        bookType: "contention",
        bookTier: 4,
        bookCount: 6,
        weeklyCount: 1,
      },
      {
        level: 9,
        mora: 450000,
        commonTier: 3,
        commonCount: 9,
        bookType: "kindling",
        bookTier: 4,
        bookCount: 12,
        weeklyCount: 2,
      },
      {
        level: 10,
        mora: 700000,
        commonTier: 3,
        commonCount: 12,
        bookType: "conflict",
        bookTier: 4,
        bookCount: 16,
        weeklyCount: 2,
        crownCount: 1,
      },
    ],
  };

  const talentCosts = travelerTalentCosts[element] || travelerTalentCosts.anemo;

  // Get only the levels we need to upgrade
  const neededLevels = talentCosts.filter((cost) =>
    cost.level > currentLevel && cost.level <= targetLevel
  );

  console.log(
    `Calculating Traveler (${element}) talent ${talentType} from ${currentLevel} to ${targetLevel}`,
  );
  console.log(`Needed levels:`, neededLevels);

  neededLevels.forEach((cost) => {
    requirements.mora += cost.mora;

    // Add common materials
    if (character.common) {
      requirements.common.push({
        type: character.common,
        tier: cost.commonTier,
        count: cost.commonCount,
      });
    }

    // Add talent books (Travelers use different books for each level)
    requirements.books.push({
      type: cost.bookType,
      tier: cost.bookTier,
      count: cost.bookCount,
    });

    // Add weekly boss materials
    if (
      cost.weeklyCount && character.weekly && character.weekly !== "Adaptive"
    ) {
      requirements.weekly.push({
        name: character.weekly,
        count: cost.weeklyCount,
      });
    }

    // Add crown
    if (cost.crownCount) {
      requirements.crown += cost.crownCount;
    }
  });

  console.log("Final traveler talent requirements:", requirements);
  return requirements;
}

// Function to find material by tags
export function findMaterialByTags(game, tagFilters) {
  const materials = ASCENSION_MATERIALS[game] || [];
  return materials.find((mat) => {
    return Object.entries(tagFilters).every(([key, value]) => {
      if (key === "tier") {
        return mat.tags && mat.tags[2] === value;
      }
      return mat.tags && mat.tags.includes(value);
    });
  });
}

// Function to get material image and name
export function getMaterialInfo(game, materialType, filters) {
  const material = findMaterialByTags(game, filters);
  if (material) {
    return {
      name: material.name,
      img: material.img,
      tier: material.tags[2] || 1,
    };
  }
  return null;
}
