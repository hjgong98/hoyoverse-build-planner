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
      level: "20/40",
      mora: 20000,
      gemTier: 2,
      gemCount: 1,
      localCount: 3,
      commonTier: 1,
      commonCount: 3,
    },
    {
      level: "40/50",
      mora: 40000,
      gemTier: 3,
      gemCount: 3,
      localCount: 10,
      commonTier: 1,
      commonCount: 15,
      bossCount: 2,
    },
    {
      level: "50/60",
      mora: 60000,
      gemTier: 3,
      gemCount: 6,
      localCount: 20,
      commonTier: 2,
      commonCount: 12,
      bossCount: 4,
    },
    {
      level: "60/70",
      mora: 80000,
      gemTier: 4,
      gemCount: 3,
      localCount: 30,
      commonTier: 2,
      commonCount: 18,
      bossCount: 8,
    },
    {
      level: "70/80",
      mora: 100000,
      gemTier: 4,
      gemCount: 6,
      localCount: 45,
      commonTier: 3,
      commonCount: 12,
      bossCount: 12,
    },
    {
      level: "80/90",
      mora: 120000,
      gemTier: 5,
      gemCount: 6,
      localCount: 60,
      commonTier: 3,
      commonCount: 24,
      bossCount: 20,
    },
  ];

  // Calculate which stages we need based on current and target level
  const currentAscension = Math.floor((currentLevel - 1) / 10);
  const targetAscension = Math.floor((targetLevel - 1) / 10);

  console.log(
    `Calculating materials from level ${currentLevel} to ${targetLevel}`,
  );
  console.log(
    `Current ascension: ${currentAscension}, Target ascension: ${targetAscension}`,
  );

  // Aggregate materials for ALL stages from current to target
  for (let i = currentAscension; i < targetAscension; i++) {
    if (i < ascensionStages.length) {
      const stage = ascensionStages[i];
      console.log(`Adding stage ${i}:`, stage);

      requirements.mora += stage.mora;

      // Add gem requirements - create separate entries for each tier
      requirements.gems.push({
        element: character.element.toLowerCase(),
        tier: stage.gemTier,
        count: stage.gemCount,
      });

      // Add local specialty
      requirements.local.push({
        name: character.local,
        count: stage.localCount,
      });

      // Add common materials - create separate entries for each tier
      requirements.common.push({
        type: character.common,
        tier: stage.commonTier,
        count: stage.commonCount,
      });

      // Add boss materials
      if (stage.bossCount && character.overworld) {
        requirements.boss.push({
          name: character.overworld,
          count: stage.bossCount,
        });
      }
    }
  }

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
    crown: 0, // Make sure crown is initialized
  };

  // Talent upgrade costs by level - FIXED to include all levels
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

  console.log(
    `Calculating talent ${talentType} from ${currentLevel} to ${targetLevel}`,
  );

  // Calculate which talent levels we need to upgrade
  for (let level = currentLevel + 1; level <= targetLevel; level++) {
    const cost = talentCosts.find((c) => c.level === level);
    if (cost) {
      console.log(`Adding talent level ${level}:`, cost);

      requirements.mora += cost.mora;

      // Add common materials
      requirements.common.push({
        type: character.common,
        tier: cost.commonTier,
        count: cost.commonCount,
      });

      // Add talent books
      requirements.books.push({
        type: character.type,
        tier: cost.bookTier,
        count: cost.bookCount,
      });

      // Add weekly boss materials (if applicable)
      if (cost.weeklyCount && character.weekly) {
        requirements.weekly.push({
          name: character.weekly,
          count: cost.weeklyCount,
        });
      }

      // Add crown (for level 10) - FIXED: properly handle crownCount
      if (cost.crownCount && level === 10) {
        requirements.crown += cost.crownCount;
      }
    }
  }

  console.log("Final talent requirements:", requirements);
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
