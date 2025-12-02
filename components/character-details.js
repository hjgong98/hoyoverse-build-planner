// /components/character-details.js

import { GAME_LIMITS } from "../data/game-limits.js";
import { getCharacterById, saveMyCharacters } from "../saved/my-characters.js";
import { ALL_CHARACTERS } from "../data/all-characters.js";
import { ALL_WEAPONS } from "../data/all-weapons.js";
import { ASCENSION_MATERIALS } from "../data/ascension-mats.js";
import {
  calculateCharacterAscensionMaterials,
  calculateTalentMaterials,
} from "../components/character-calculations.js";
import {
  calculateResinRequirements,
  formatTimeMinutes,
} from "./resin-calculations.js";

// =================================================================
// BASE PATH FOR GITHUB PAGES
// =================================================================
const BASE_PATH = "/hoyoverse-build-planner";

// =================================================================
// UTILITY FUNCTIONS
// =================================================================

function getFullGameName(gameKey) {
  const names = {
    genshin: "Genshin Impact",
    hsr: "Honkai Star Rail",
    zzz: "Zenless Zone Zero",
  };
  return names[gameKey] || gameKey;
}

function getGearType(game) {
  const gearTypes = {
    genshin: "Artifacts",
    hsr: "Relics",
    zzz: "Discs",
  };
  return gearTypes[game] || "Gear";
}

function getTalentName(game, characterName, index) {
  // First check if character has custom talent names
  const charData = ALL_CHARACTERS[game]?.[characterName];
  if (charData?.talentnames) {
    if (index === 0 && charData.talentnames.normal) {
      return charData.talentnames.normal;
    }
    if (index === 1 && charData.talentnames.skill) {
      return charData.talentnames.skill;
    }
    if (index === 2 && charData.talentnames.burst) {
      return charData.talentnames.burst;
    }
  }

  // Fallback to generic names
  const talentNames = {
    genshin: ["Normal Attack", "Elemental Skill", "Elemental Burst"],
    hsr: ["Basic Attack", "Skill", "Ultimate", "Talent"],
    zzz: ["Basic Attack", "Dodge", "Assist", "Special Attack", "Chain Attack"],
  };
  return talentNames[game]?.[index] || `Talent ${index + 1}`;
}

function getMilestoneOptions(game) {
  const gameMilestones = {
    genshin: [20, 40, 50, 60, 70, 80, 90],
    hsr: [20, 30, 40, 50, 60, 70, 80],
    zzz: [20, 30, 40, 50, 60],
  };
  return gameMilestones[game] || [20, 40, 50, 60, 70, 80, 90];
}

function getFuelName(game) {
  const fuelNames = {
    genshin: "Resin",
    hsr: "Trailblaze Power",
    zzz: "Battery Charge",
  };
  return fuelNames[game] || "Fuel";
}

function calculateOverallProgress(char, limits) {
  let totalWeight = 0;
  let completedWeight = 0;

  // Character Level (30% weight)
  const charMax = char.goalLevel || limits.maxCharLevel;
  const charProgress = ((char.currentLevel || 1) / charMax) * 100;
  totalWeight += 30;
  completedWeight += charProgress * 0.3;

  // Weapon Level (25% weight)
  const weaponMax = char.goalWeaponLevel || limits.maxWeaponLevel;
  const weaponProgress = ((char.currentWeaponLevel || 1) / weaponMax) * 100;
  totalWeight += 25;
  completedWeight += weaponProgress * 0.25;

  // Talents (35% weight)
  if (Array.isArray(char.talentsGoal)) {
    const talentWeight = 35 / char.talentsGoal.length;
    char.talentsGoal.forEach((goal, i) => {
      const current = char.talentsCurrent?.[i] || 1;
      const talentProgress = (current / goal) * 100;
      completedWeight += talentProgress * (talentWeight / 100);
    });
    totalWeight += 35;
  }

  // HSR Traces (10% weight)
  if (char.game === "hsr") {
    totalWeight += 10;
    if (char.majorTraces) completedWeight += 5;
    if (char.minorTraces) completedWeight += 5;
  }

  return Math.min(100, Math.round((completedWeight / totalWeight) * 100));
}

// =================================================================
// WEAPON IMAGE FUNCTIONS
// =================================================================

function getWeaponData(char) {
  if (!char.weaponName) return null;

  const charData = ALL_CHARACTERS[char.game]?.[char.name];
  const weaponType = charData?.weapon || charData?.path || charData?.role;

  if (!weaponType || !ALL_WEAPONS[char.game]?.[weaponType]) return null;

  const weapons = ALL_WEAPONS[char.game][weaponType];
  return weapons.find((w) => w.name === char.weaponName) || null;
}

function getWeaponImage(char) {
  const weaponData = getWeaponData(char);
  if (weaponData && weaponData.image) {
    let imagePath = weaponData.image;
    // Apply base path to weapon images
    if (imagePath.startsWith("/") && !imagePath.startsWith(BASE_PATH)) {
      imagePath = BASE_PATH + imagePath;
    }
    return imagePath;
  }
  return `${BASE_PATH}/assets/${char.game}/weapons/default.webp`; // fallback image
}

function getWeaponRarityColor(rarity) {
  switch (rarity) {
    case 5:
      return "#ffd700"; // gold
    case 4:
      return "#c0c0c0"; // silver
    case 3:
      return "#cd7f32"; // bronze
    case 2:
      return "#95a5a6"; // gray
    case 1:
      return "#95a5a6"; // gray
    default:
      return "#95a5a6"; // default gray
  }
}

function getWeaponRarityText(rarity) {
  if (!rarity) return "";
  return "★".repeat(rarity);
}

// =================================================================
// FIXED MATERIAL RENDERING FUNCTIONS - EXACT TAG STRUCTURE
// =================================================================

function normalizeMaterialName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function findMaterialByName(materialName, game) {
  const decodedName = decodeURIComponent(materialName);
  const normalizedSearch = normalizeMaterialName(decodedName);

  let material = ASCENSION_MATERIALS[game]?.find((m) => {
    const normalizedMaterial = normalizeMaterialName(m.name);
    return normalizedMaterial === normalizedSearch;
  });

  if (material) {
    let imagePath = material.img;

    // Apply base path
    if (imagePath) {
      // Remove leading ./ if present
      if (imagePath.startsWith("./")) {
        imagePath = imagePath.substring(2);
      }

      // If path starts with / but not the base path, prepend base path
      if (imagePath.startsWith("/") && !imagePath.startsWith(BASE_PATH)) {
        imagePath = BASE_PATH + imagePath;
      }

      // If path doesn't start with /, add base path and /
      if (!imagePath.startsWith("/") && !imagePath.startsWith("http")) {
        imagePath = BASE_PATH + "/" + imagePath;
      }
    }

    return { ...material, img: imagePath };
  }

  console.warn(`Material not found: ${materialName} for game: ${game}`);

  // Return a fallback material with the correct image path structure
  return {
    name: decodedName,
    img: `${BASE_PATH}/assets/genshin/mora.webp`, // Use base path for fallback
    tags: [],
  };
}

// FIXED: Exact tag matching based on your structure
function findMaterialByTags(game, tag1, tag2 = null, tag3 = null) {
  const materials = ASCENSION_MATERIALS[game] || [];

  const material = materials.find((mat) => {
    if (!mat.tags || mat.tags.length === 0) return false;

    // Check tag1 (required)
    if (mat.tags[0] !== tag1) return false;

    // Check tag2 if provided
    if (tag2 !== null && mat.tags[1] !== tag2) return false;

    // Check tag3 if provided
    if (tag3 !== null && mat.tags[2] !== tag3) return false;

    return true;
  });

  if (material) {
    let imagePath = material.img;

    // Apply base path
    if (imagePath) {
      // Remove leading ./ if present
      if (imagePath.startsWith("./")) {
        imagePath = imagePath.substring(2);
      }

      // If path starts with / but not the base path, prepend base path
      if (imagePath.startsWith("/") && !imagePath.startsWith(BASE_PATH)) {
        imagePath = BASE_PATH + imagePath;
      }

      // If path doesn't start with /, add base path and /
      if (!imagePath.startsWith("/") && !imagePath.startsWith("http")) {
        imagePath = BASE_PATH + "/" + imagePath;
      }
    }

    return { ...material, img: imagePath };
  }

  console.warn(
    `Material not found by tags: ${tag1}, ${tag2}, ${tag3} for game: ${game}`,
  );
  return {
    name: `${tag1}${tag2 ? ` ${tag2}` : ""}${tag3 ? ` ${tag3}` : ""}`,
    img: `${BASE_PATH}/assets/genshin/mora.webp`,
    tags: [tag1, tag2, tag3].filter((t) => t !== null),
  };
}

// SPECIFIC MATERIAL FINDERS USING EXACT TAG STRUCTURE
function findGemMaterial(character, tier) {
  return findMaterialByTags(
    character.game,
    "gem",
    character.element.toLowerCase(),
    tier,
  );
}

function findCommonMaterial(character, tier) {
  return findMaterialByTags(
    character.game,
    "common",
    character.common,
    tier,
  );
}

function findTalentBookMaterial(character, tier) {
  return findMaterialByTags(
    character.game,
    "talent",
    character.type,
    tier,
  );
}

function findLocalMaterial(character) {
  const charData = ALL_CHARACTERS[character.game]?.[character.name];
  if (!charData?.local) {
    console.warn(`No local material found for character: ${character.name}`);
    return {
      name: "Unknown Local Specialty",
      img: `${BASE_PATH}/assets/genshin/mora.webp`,
      tags: [],
    };
  }

  const localName = charData.local;

  // Search for material by name (not by tag)
  const materials = ASCENSION_MATERIALS[character.game] || [];
  const material = materials.find((mat) => {
    // Check if it's a local material and name matches
    return mat.tags && mat.tags[0] === "local" && mat.name === localName;
  });

  if (material) {
    let imagePath = material.img;

    // Apply base path
    if (imagePath) {
      if (imagePath.startsWith("./")) {
        imagePath = imagePath.substring(2);
      }

      if (imagePath.startsWith("/") && !imagePath.startsWith(BASE_PATH)) {
        imagePath = BASE_PATH + imagePath;
      }

      if (!imagePath.startsWith("/") && !imagePath.startsWith("http")) {
        imagePath = BASE_PATH + "/" + imagePath;
      }
    }

    return { ...material, img: imagePath };
  }

  // If not found, try case-insensitive search
  const materialCaseInsensitive = materials.find((mat) => {
    return mat.tags && mat.tags[0] === "local" &&
      mat.name.toLowerCase() === localName.toLowerCase();
  });

  if (materialCaseInsensitive) {
    let imagePath = materialCaseInsensitive.img;

    // Apply base path
    if (imagePath) {
      if (imagePath.startsWith("./")) {
        imagePath = imagePath.substring(2);
      }

      if (imagePath.startsWith("/") && !imagePath.startsWith(BASE_PATH)) {
        imagePath = BASE_PATH + imagePath;
      }

      if (!imagePath.startsWith("/") && !imagePath.startsWith("http")) {
        imagePath = BASE_PATH + "/" + imagePath;
      }
    }

    return { ...materialCaseInsensitive, img: imagePath };
  }

  console.warn(
    `Local material not found: ${localName} for character: ${character.name}`,
  );
  return {
    name: localName,
    img: `${BASE_PATH}/assets/genshin/mora.webp`,
    tags: ["local"],
  };
}

function findBossMaterial(character) {
  return findMaterialByName(character.overworld, character.game);
}

function findWeeklyMaterial(character) {
  return findMaterialByName(character.weekly, character.game);
}

function findCrownMaterial() {
  return findMaterialByTags("genshin", "other", "crown");
}

function findMoraMaterial() {
  return findMaterialByTags("genshin", "currency");
}

function calculateFuelEstimate(char) {
  const charData = ALL_CHARACTERS[char.game]?.[char.name];
  if (!charData) return "Unknown";

  const ascensionMats = calculateCharacterAscensionMaterials(
    charData,
    char.currentLevel || 1,
    char.goalLevel || GAME_LIMITS[char.game]?.maxCharLevel || 90,
  );

  const talentMats = calculateTalentMaterialsForCharacter(char);
  const resinResults = calculateResinRequirements(
    charData,
    ascensionMats,
    talentMats,
  );

  return `${resinResults.total.minResin}-${resinResults.total.maxResin} ${
    getFuelName(char.game)
  }`;
}

function calculateTimeEstimate(char) {
  const totalProgress = calculateOverallProgress(char, GAME_LIMITS[char.game]);
  if (totalProgress >= 100) return "🎉 Build Complete!";

  const charData = ALL_CHARACTERS[char.game]?.[char.name];
  if (!charData) return "Unknown";

  const ascensionMats = calculateCharacterAscensionMaterials(
    charData,
    char.currentLevel || 1,
    char.goalLevel || GAME_LIMITS[char.game]?.maxCharLevel || 90,
  );

  const talentMats = calculateTalentMaterialsForCharacter(char);
  const resinResults = calculateResinRequirements(
    charData,
    ascensionMats,
    talentMats,
  );

  return `${formatTimeMinutes(resinResults.total.minTime)} - ${
    formatTimeMinutes(resinResults.total.maxTime)
  }`;
}

function calculateTalentMaterialsForCharacter(char) {
  const charData = ALL_CHARACTERS[char.game]?.[char.name];
  let talentMats = { mora: 0, common: [], books: [], weekly: [], crown: 0 };

  if (Array.isArray(char.talentsCurrent) && Array.isArray(char.talentsGoal)) {
    char.talentsCurrent.forEach((currentTalent, i) => {
      const goalTalent = char.talentsGoal[i] || currentTalent;
      if (goalTalent > currentTalent) {
        const talentMat = calculateTalentMaterials(
          charData,
          i,
          currentTalent,
          goalTalent,
        );
        talentMats.mora += talentMat.mora;

        // Aggregate materials
        talentMat.common.forEach((talentCommon) => {
          const existing = talentMats.common.find((c) =>
            c.type === talentCommon.type && c.tier === talentCommon.tier
          );
          if (existing) existing.count += talentCommon.count;
          else talentMats.common.push({ ...talentCommon });
        });

        talentMat.books.forEach((talentBook) => {
          const existing = talentMats.books.find((b) =>
            b.type === talentBook.type && b.tier === talentBook.tier
          );
          if (existing) existing.count += talentBook.count;
          else talentMats.books.push({ ...talentBook });
        });

        talentMat.weekly.forEach((weeklyMat) => {
          const existing = talentMats.weekly.find((w) =>
            w.name === weeklyMat.name
          );
          if (existing) existing.count += weeklyMat.count;
          else talentMats.weekly.push({ ...weeklyMat });
        });

        if (talentMat.crown) talentMats.crown += talentMat.crown;
      }
    });
  }

  return talentMats;
}

function renderMaterialRequirements(char) {
  const charData = ALL_CHARACTERS[char.game]?.[char.name];
  if (!charData) {
    return '<div style="color: #ccc; text-align: center;">Character data not found</div>';
  }

  const charLevel = char.currentLevel || 1;
  const targetLevel = char.goalLevel || GAME_LIMITS[char.game]?.maxCharLevel ||
    90;
  const fullCharData = { ...charData, ...char };

  // Calculate materials
  const ascensionMaterials = calculateCharacterAscensionMaterials(
    fullCharData,
    charLevel,
    targetLevel,
  );

  const talentMaterials = calculateTalentMaterialsForCharacter(char);

  // Create material map
  const materialMap = new Map();

  // Helper function to add material to map
  function addToMaterialMap(key, material, count, type) {
    if (materialMap.has(key)) {
      materialMap.get(key).count += count;
    } else {
      materialMap.set(key, {
        material: material,
        count: count,
        type: type,
      });
    }
  }

  // Add Crown of Insight
  if (talentMaterials.crown > 0) {
    const crownMaterial = findCrownMaterial();
    addToMaterialMap(
      "CROWN_INSIGHT",
      crownMaterial,
      talentMaterials.crown,
      "crown",
    );
  }

  // Add Mora
  const totalMora = ascensionMaterials.mora + talentMaterials.mora;
  if (totalMora > 0) {
    const moraMaterial = findMoraMaterial();
    addToMaterialMap("MORA_CURRENCY", moraMaterial, totalMora, "mora");
  }

  // Add Gems - FIXED: Using exact tag structure
  ascensionMaterials.gems.forEach((gemReq) => {
    const gemMaterial = findGemMaterial(fullCharData, gemReq.tier);
    const key = `GEM_${gemReq.element}_${gemReq.tier}`;
    addToMaterialMap(key, gemMaterial, gemReq.count, "gem");
  });

  // Add Local Specialties - FIXED: Using exact tag structure
  ascensionMaterials.local.forEach((localReq) => {
    const localMaterial = findLocalMaterial(fullCharData);
    const key = `LOCAL_${localReq.name}`;
    addToMaterialMap(key, localMaterial, localReq.count, "local");
  });

  // Add Common Materials - FIXED: Using exact tag structure
  [...ascensionMaterials.common, ...talentMaterials.common].forEach(
    (commonReq) => {
      const commonMaterial = findCommonMaterial(fullCharData, commonReq.tier);
      const key = `COMMON_${commonReq.type}_${commonReq.tier}`;
      addToMaterialMap(key, commonMaterial, commonReq.count, "common");
    },
  );

  // Add Boss Materials
  ascensionMaterials.boss.forEach((bossReq) => {
    const bossMaterial = findBossMaterial(fullCharData);
    const key = `BOSS_${bossReq.name}`;
    addToMaterialMap(key, bossMaterial, bossReq.count, "boss");
  });

  // Add Talent Books - FIXED: Using exact tag structure
  talentMaterials.books.forEach((bookReq) => {
    const bookMaterial = findTalentBookMaterial(fullCharData, bookReq.tier);
    const key = `BOOK_${bookReq.type}_${bookReq.tier}`;
    addToMaterialMap(key, bookMaterial, bookReq.count, "book");
  });

  // Add Weekly Boss Materials
  talentMaterials.weekly.forEach((weeklyReq) => {
    const weeklyMaterial = findWeeklyMaterial(fullCharData);
    const key = `WEEKLY_${weeklyReq.name}`;
    addToMaterialMap(key, weeklyMaterial, weeklyReq.count, "weekly");
  });

  const allMaterials = Array.from(materialMap.values());

  if (allMaterials.length === 0) {
    return '<div style="color: #ccc; text-align: center; padding: 20px;">No materials required to reach goal</div>';
  }

  const borderColors = {
    mora: "#f1c40f",
    gem: "#3498db",
    local: "#2ecc71",
    common: "#95a5a6",
    boss: "#9b59b6",
    book: "#e67e22",
    weekly: "#e74c3c",
    crown: "#f39c12",
  };

  let materialsHTML = `
    <div style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; align-items: flex-start;">
  `;

  allMaterials.forEach((item) => {
    const borderColor = borderColors[item.type] || "#95a5a6";
    const displayCount = item.count > 999
      ? Math.floor(item.count / 1000) + "k"
      : item.count;

    materialsHTML += `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 70px;">
        <div style="position: relative;">
          <img 
            src="${item.material.img}" 
            alt="${item.material.name}" 
            style="
              width: 56px;
              height: 56px;
              border-radius: 8px;
              border: 2px solid ${borderColor};
              object-fit: cover;
              display: block;
            "
            onerror="this.onerror=null; this.src='${BASE_PATH}/assets/genshin/mora.webp';"
          >
          <div style="
            position: absolute;
            bottom: -6px;
            right: -6px;
            background: #e74c3c;
            color: white;
            border-radius: 50%;
            width: 22px;
            height: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: bold;
            border: 2px solid white;
          ">
            ${displayCount}
          </div>
        </div>
        <div style="
          font-size: 10px;
          text-align: center;
          margin-top: 6px;
          color: #ccc;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          line-height: 1.2;
        ">
          ${item.material.name}
        </div>
      </div>
    `;
  });

  materialsHTML += "</div>";
  return materialsHTML;
}

// =================================================================
// ACTION HANDLERS
// =================================================================

window.updateCharacterImage = (charId) => {
  const char = getCharacterById(charId);
  const imageUrl = document.getElementById("image-url-input")?.value;
  if (imageUrl) {
    char.imageUrl = imageUrl;
    saveMyCharacters();
    setTimeout(() => renderCharacterDetail(char), 100);
  }
};

window.openWeaponSelector = (charId) => {
  const char = getCharacterById(charId);
  const charData = ALL_CHARACTERS[char.game]?.[char.name];
  const weaponType = charData?.weapon || charData?.path || charData?.role;
  const weaponLabel = GAME_LIMITS[char.game]?.weaponLabel || "Weapon";

  if (!weaponType) {
    alert("No weapon type found for this character!");
    return;
  }

  const allWeapons = ALL_WEAPONS[char.game]?.[weaponType] || [];
  const weaponOptions = allWeapons.length > 0
    ? allWeapons.map((weapon) =>
      `<option value="${weapon.name}" ${
        char.weaponName === weapon.name ? "selected" : ""
      }>
          ${weapon.name}${weapon.rarity ? ` (${weapon.rarity}★)` : ""}
        </option>`
    ).join("")
    : `<option value="">No weapons available</option>`;

  window.openModal?.(`
    <div style="text-align: left; color: white; max-width: 500px;">
      <h3 style="color: #00ffff; margin-bottom: 20px; font-size: 24px;">Select ${weaponLabel}</h3>
      <div style="margin-bottom: 25px;">
        <strong style="font-size: 16px;">${weaponLabel}:</strong><br>
        <select id="weapon-select" style="width: 100%; padding: 12px; background: #2c3e50; border: 2px solid #00ffff; border-radius: 8px; color: white; font-size: 16px; margin-top: 8px;">
          ${weaponOptions}
        </select>
      </div>
      <div style="display: flex; gap: 15px; justify-content: center;">
        <button onclick="window.saveWeaponSelection('${charId}')" 
                style="padding: 15px 25px; background: #2ecc71; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 16px;">
          💾 Save ${weaponLabel}
        </button>
        <button onclick="window.closeModal?.()" 
                style="padding: 15px 25px; background: #95a5a6; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">
          Cancel
        </button>
      </div>
    </div>
  `);
};

window.saveWeaponSelection = (charId) => {
  const char = getCharacterById(charId);
  const weaponSelect = document.getElementById("weapon-select");

  if (weaponSelect && weaponSelect.value) {
    // Get the option text (which includes the rarity)
    const optionText = weaponSelect.options[weaponSelect.selectedIndex]?.text;

    // Extract just the weapon name without the rarity
    const weaponName = optionText.split("(")[0].trim();

    char.weaponName = weaponName;
    saveMyCharacters();
    window.closeModal?.();
    setTimeout(() => renderCharacterDetail(char), 100);
  }
};

window.completeAllUpgrades = (charId) => {
  const char = getCharacterById(charId);
  const limits = GAME_LIMITS[char.game];
  let updated = false;

  // Character Level
  const newCharLevel =
    parseInt(document.getElementById("char-new-level")?.value) ||
    char.currentLevel;
  if (newCharLevel > char.currentLevel && newCharLevel <= limits.maxCharLevel) {
    char.currentLevel = newCharLevel;
    updated = true;
  }

  // Weapon Level
  const newWeaponLevel =
    parseInt(document.getElementById("weapon-new-level")?.value) ||
    char.currentWeaponLevel;
  if (
    newWeaponLevel > char.currentWeaponLevel &&
    newWeaponLevel <= limits.maxWeaponLevel
  ) {
    char.currentWeaponLevel = newWeaponLevel;
    updated = true;
  }

  // Talents
  if (Array.isArray(char.talentsCurrent)) {
    char.talentsCurrent.forEach((current, i) => {
      const newTalentLevel =
        parseInt(document.getElementById(`talent-new-${i}`)?.value) || current;
      if (newTalentLevel > current && newTalentLevel <= limits.maxTalent) {
        char.talentsCurrent[i] = newTalentLevel;
        updated = true;
      }
    });
  }

  if (updated) {
    saveMyCharacters();
    setTimeout(() => renderCharacterDetail(char), 100);
  }
};

window.setGoalpost = (charId) => {
  const char = getCharacterById(charId);
  const limits = GAME_LIMITS[char.game];
  const milestones = getMilestoneOptions(char.game);
  const weaponLabel = GAME_LIMITS[char.game]?.weaponLabel || "Weapon";

  window.openModal?.(`
    <div style="text-align: left; color: white; max-width: 600px;">
      <h3 style="color: #00ffff; margin-bottom: 25px; font-size: 24px;">Set Final Goal - ${char.name}</h3>
      
      <div style="margin-bottom: 20px;">
        <strong style="font-size: 16px;">Final Character Level Goal:</strong><br>
        <select id="final-char-goal" 
                style="width: 160px; padding: 12px; background: #2c3e50; border: 2px solid #00ffff; border-radius: 8px; color: white; font-size: 16px; margin-top: 8px;">
          ${
    milestones.map((milestone) =>
      `<option value="${milestone}" ${
        char.goalLevel === milestone ? "selected" : ""
      }>${milestone}</option>`
    ).join("")
  }
        </select>
      </div>
      
      <div style="margin-bottom: 20px;">
        <strong style="font-size: 16px;">Final ${weaponLabel} Level Goal:</strong><br>
        <select id="final-weapon-goal" 
                style="width: 160px; padding: 12px; background: #2c3e50; border: 2px solid #00ffff; border-radius: 8px; color: white; font-size: 16px; margin-top: 8px;">
          ${
    milestones.map((milestone) =>
      `<option value="${milestone}" ${
        char.goalWeaponLevel === milestone ? "selected" : ""
      }>${milestone}</option>`
    ).join("")
  }
        </select>
      </div>
      
      <div style="margin-bottom: 30px;">
        <strong style="font-size: 16px;">Final Talent Goals:</strong><br>
        ${
    Array.isArray(char.talentsCurrent)
      ? char.talentsCurrent.map((current, i) => {
        const talentName = getTalentName(char.game, char.name, i);
        return `
                  <div style="margin-top: 15px; display: flex; justify-content: space-between; align-items: center; background: #2c3e50; padding: 12px; border-radius: 8px;">
                    <label style="font-size: 14px; color: #ccc;">${talentName}:</label>
                    <select id="final-talent-${i}" 
                            style="width: 120px; padding: 10px; background: #1c2b33; border: 2px solid #00ffff; border-radius: 6px; color: white; font-size: 14px;">
                      ${
          Array.from({ length: limits.maxTalent - current + 1 }, (_, j) => {
            const level = current + j;
            return `<option value="${level}" ${
              char.talentsGoal?.[i] === level ? "selected" : ""
            }>${level}</option>`;
          }).join("")
        }
                    </select>
                  </div>
                `;
      }).join("")
      : ""
  }
      </div>
      
      <div style="display: flex; gap: 15px; justify-content: center;">
        <button onclick="window.saveFinalGoals('${charId}')" 
                style="padding: 15px 25px; background: #2ecc71; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 16px;">
          💾 Save Final Goals
        </button>
        <button onclick="window.closeModal?.()" 
                style="padding: 15px 25px; background: #95a5a6; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">
          Cancel
        </button>
      </div>
    </div>
  `);
};

window.saveFinalGoals = (charId) => {
  const char = getCharacterById(charId);
  const limits = GAME_LIMITS[char.game];

  // Update final character goal
  const finalCharGoal =
    parseInt(document.getElementById("final-char-goal")?.value) ||
    limits.maxCharLevel;
  char.goalLevel = Math.min(finalCharGoal, limits.maxCharLevel);

  // Update final weapon goal
  const finalWeaponGoal =
    parseInt(document.getElementById("final-weapon-goal")?.value) ||
    limits.maxWeaponLevel;
  char.goalWeaponLevel = Math.min(finalWeaponGoal, limits.maxWeaponLevel);

  // Update final talent goals
  if (Array.isArray(char.talentsCurrent)) {
    char.talentsGoal = char.talentsCurrent.map((current, i) => {
      const finalTalentGoal =
        parseInt(document.getElementById(`final-talent-${i}`)?.value) ||
        limits.maxTalent;
      return Math.min(finalTalentGoal, limits.maxTalent);
    });
  }

  saveMyCharacters();
  window.closeModal?.();
  setTimeout(() => renderCharacterDetail(char), 100);
};

window.openGearCalculator = (charId) => {
  const char = getCharacterById(charId);
  const gearType = getGearType(char.game);
  console.log(`Opening gear calculator for ${char.name} in character-gear.js`);

  // Close the current modal first
  window.closeModal?.();

  // Import and initialize the character gear scene
  import("../saved/character-gear.js")
    .then((module) => {
      // Check if the module has an init function
      if (module.initCharacterGearScene) {
        module.initCharacterGearScene(charId);
      } else if (module.default) {
        // If it uses default export
        module.default(charId);
      } else {
        console.error(
          "character-gear.js does not export initCharacterGearScene or default function",
        );
        alert("Gear calculator is not available at the moment.");
      }
    })
    .catch((error) => {
      console.error("Failed to load character-gear.js:", error);
      // Fallback: try to redirect or show a message
      alert(
        "Gear calculator is currently unavailable. Please try again later.",
      );
    });
};

// =================================================================
// MAIN RENDER FUNCTION
// =================================================================

export function renderCharacterDetail(char) {
  const limits = GAME_LIMITS[char.game];
  const weaponLabel = limits?.weaponLabel || "Item";
  const fullGameName = getFullGameName(char.game);
  const gearType = getGearType(char.game);

  const charData = ALL_CHARACTERS[char.game]?.[char.name];
  let currentPicture = char.imageUrl || charData?.picture;

  // Apply base path to character image
  if (
    currentPicture && currentPicture.startsWith("/") &&
    !currentPicture.startsWith(BASE_PATH)
  ) {
    currentPicture = BASE_PATH + currentPicture;
  }

  const totalProgress = calculateOverallProgress(char, limits);
  const fuelEstimate = calculateFuelEstimate(char);
  const timeEstimate = calculateTimeEstimate(char);
  const milestones = getMilestoneOptions(char.game);

  window.openModal?.(`
  <div style="display: flex; flex-direction: column; max-height: 95vh; width: 100%;">
    <div style="flex: 1; overflow-y: auto; padding: 20px;">
      <div style="text-align: left; font-size: 14px; line-height: 1.5; color: white; max-width: 1200px;">
        
        <!-- Header -->
        <div style="margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <h2 style="margin: 0; color: #00ffff; font-size: 28px;">${
    char.name || "Unknown"
  }</h2>
            <span style="background: #1c3b5a; padding: 8px 16px; border-radius: 20px; font-size: 16px; font-weight: bold;">
              ${fullGameName}
            </span>
          </div>
          <div style="background: #1c2b33; padding: 20px; border-radius: 12px; border: 2px solid #00ffff44;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
              <strong style="font-size: 16px;">Progress Tracking (towards final goals)</strong>
              <span style="font-size: 16px; font-weight: bold; color: #00ffff;">${totalProgress}%</span>
            </div>
            <div style="width: 100%; height: 24px; background: #2c3e50; border-radius: 12px; overflow: hidden;">
              <div style="width: ${totalProgress}%; height: 100%; background: linear-gradient(90deg, #00ffff, #3498db); transition: width 0.3s;"></div>
            </div>
          </div>
        </div>

        <!-- Main Content Grid -->
        <div style="display: grid; grid-template-columns: 300px 1fr; gap: 25px; margin-bottom: 25px;">
          
          <!-- Left Column -->
          <div>
            <!-- Character Image -->
            <div style="background: #1c2b33; padding: 25px; border-radius: 16px; text-align: center; margin-bottom: 20px; border: 2px solid #00ffff44;">
              <div id="character-image-container" style="width: 220px; height: 300px; margin: 0 auto; background: #2c3e50; border-radius: 12px; overflow: hidden; border: 2px solid #00ffff44;">
                <img src="${currentPicture}" alt="${char.name}" 
                     style="width: 100%; height: 100%; object-fit: cover;"
                     onerror="this.onerror=null; this.src='${BASE_PATH}/assets/fallback-character.jpg';">
              </div>
              <div style="margin-top: 15px;">
                <input type="text" id="image-url-input" placeholder="Paste custom image URL" 
                       value="${char.imageUrl || ""}" 
                       style="width: 100%; padding: 12px; background: #2c3e50; border: 2px solid #00ffff; border-radius: 8px; color: white; font-size: 14px;" />
                <button onclick="window.updateCharacterImage('${char.id}')" 
                        style="margin-top: 12px; padding: 10px 16px; background: #3498db; color: white; border: none; border-radius: 8px; font-size: 14px; cursor: pointer; width: 100%; font-weight: bold;">
                    Update Image
                </button>
              </div>
            </div>

            <!-- Weapon Info -->
            <div style="background: #1c2b33; padding: 20px; border-radius: 12px; border: 2px solid #00ffff44;">
              <strong style="font-size: 16px;">${weaponLabel}:</strong>
              <div style="margin-top: 12px; margin-bottom: 15px;">
                ${
    char.weaponName
      ? `
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="position: relative;">
                      <img 
                        src="${getWeaponImage(char)}" 
                        alt="${char.weaponName}"
                        style="
                          width: 56px;
                          height: 56px;
                          border-radius: 8px;
                          border: 2px solid ${
        getWeaponData(char)
          ? getWeaponRarityColor(getWeaponData(char).rarity)
          : "#95a5a6"
      };
                          object-fit: cover;
                        "
                        onerror="this.onerror=null; this.src='${BASE_PATH}/assets/${char.game}/weapons/default.webp';"
                      >
                      ${
        getWeaponData(char)?.rarity
          ? `
                        <div style="
                          position: absolute;
                          top: -8px;
                          right: -8px;
                          background: ${
            getWeaponData(char).rarity === 5
              ? "#ffd700"
              : getWeaponData(char).rarity === 4
              ? "#c0c0c0"
              : getWeaponData(char).rarity === 3
              ? "#cd7f32"
              : "#95a5a6"
          };
                          color: black;
                          border-radius: 50%;
                          width: 20px;
                          height: 20px;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          font-size: 10px;
                          font-weight: bold;
                          border: 2px solid #1c2b33;
                        ">
                          ${getWeaponRarityText(getWeaponData(char).rarity)}
                        </div>
                        `
          : ""
      }
                    </div>
                    <div>
                      <div style="color: #00ffff; font-weight: bold; font-size: 14px;">${char.weaponName}</div>
                      ${
        getWeaponData(char)?.baseATK
          ? `<div style="color: #ccc; font-size: 12px;">Base ATK: ${
            getWeaponData(char).baseATK
          }</div>`
          : ""
      }
                      ${
        getWeaponData(char)?.stat?.type &&
          getWeaponData(char).stat.type !== "none"
          ? `<div style="color: #ccc; font-size: 12px;">${
            getWeaponData(char).stat.type
          }: ${getWeaponData(char).stat.value}</div>`
          : ""
      }
                    </div>
                  </div>
                  `
      : '<div style="color: #ccc; font-size: 14px; text-align: center; padding: 10px;">No weapon selected</div>'
  }
              </div>
              <button onclick="window.openWeaponSelector('${char.id}')" 
                      style="padding: 12px 16px; background: #9b59b6; color: white; border: none; border-radius: 8px; font-size: 14px; cursor: pointer; width: 100%; font-weight: bold;">
                Change ${weaponLabel}
              </button>
            </div>
          </div>

          <!-- Right Column -->
          <div style="background: #1c2b33; padding: 25px; border-radius: 16px; border: 2px solid #00ffff44;">
            <h4 style="margin: 0 0 20px 0; color: #00ffff; font-size: 22px;">Upgrade Progress</h4>
            
            <!-- Character Level -->
            <div style="margin-bottom: 20px; background: #2c3e50; padding: 20px; border-radius: 12px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <strong style="font-size: 16px;">Character Level</strong>
                <div style="display: flex; align-items: center; gap: 12px;">
                  <span style="font-size: 16px; color: #ccc; font-weight: bold;">${
    char.currentLevel || 1
  }</span>
                  <span style="font-size: 18px;">→</span>
                  <input type="number" 
                         id="char-new-level" 
                         value="${char.newLevel || char.currentLevel + 1}" 
                         min="${char.currentLevel || 1}" 
                         max="${limits.maxCharLevel}"
                         style="width: 80px; padding: 8px; background: #1c2b33; border: 2px solid #00ffff; border-radius: 6px; color: white; text-align: center; font-size: 16px; font-weight: bold;">
                </div>
              </div>
            </div>

            <!-- Weapon Level -->
            <div style="margin-bottom: 20px; background: #2c3e50; padding: 20px; border-radius: 12px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <strong style="font-size: 16px;">${weaponLabel} Level</strong>
                <div style="display: flex; align-items: center; gap: 12px;">
                  <span style="font-size: 16px; color: #ccc; font-weight: bold;">${
    char.currentWeaponLevel || 1
  }</span>
                  <span style="font-size: 18px;">→</span>
                  <input type="number" 
                         id="weapon-new-level" 
                         value="${
    char.newWeaponLevel || char.currentWeaponLevel + 1
  }" 
                         min="${char.currentWeaponLevel || 1}" 
                         max="${limits.maxWeaponLevel}"
                         style="width: 80px; padding: 8px; background: #1c2b33; border: 2px solid #00ffff; border-radius: 6px; color: white; text-align: center; font-size: 16px; font-weight: bold;">
                </div>
              </div>
            </div>

            <!-- Talents -->
            <div style="margin-bottom: 20px;">
              <h5 style="margin: 0 0 15px 0; color: #00ffff; font-size: 18px;">Talents</h5>
              ${
    Array.isArray(char.talentsCurrent)
      ? char.talentsCurrent.map((current, i) => {
        const talentName = getTalentName(char.game, char.name, i);
        const newLevel = char.talentsNew?.[i] || current + 1;

        return `
                      <div style="background: #2c3e50; padding: 15px; border-radius: 8px; margin-bottom: 12px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                          <strong style="font-size: 14px;">${talentName}</strong>
                          <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 14px; color: #ccc; font-weight: bold;">${current}</span>
                            <span style="font-size: 16px;">→</span>
                            <input type="number" 
                                   id="talent-new-${i}" 
                                   value="${newLevel}" 
                                   min="${current}" 
                                   max="${limits.maxTalent}"
                                   style="width: 70px; padding: 6px; background: #1c2b33; border: 2px solid #00ffff; border-radius: 6px; color: white; text-align: center; font-size: 14px;">
                          </div>
                        </div>
                      </div>
                    `;
      }).join("")
      : '<div style="color: #ccc; text-align: center; padding: 20px;">No talents set</div>'
  }
            </div>

            <!-- Complete Button -->
            <button onclick="window.completeAllUpgrades('${char.id}')" 
                    style="padding: 15px 25px; background: #27ae60; color: white; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; font-weight: bold; width: 100%; margin-top: 10px;">
              🚀 Complete All Upgrades
            </button>
          </div>
        </div>

        <!-- Bottom Section -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; border-top: 3px solid #00ffff; padding-top: 25px;">
          
          <!-- Materials Needed -->
          <div style="background: #1c2b33; padding: 25px; border-radius: 16px; border: 2px solid #00ffff44;">
            <h4 style="margin: 0 0 20px 0; color: #00ffff; font-size: 20px;">Materials Needed</h4>
            <div style="max-height: 400px; overflow-y: auto; text-align: left;">
              ${renderMaterialRequirements(char)}
            </div>
            <button onclick="window.setGoalpost('${char.id}')" 
                    style="margin-top: 20px; padding: 12px; background: #f39c12; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; width: 100%; font-size: 14px;">
              🎯 Change Goalpost
            </button>
          </div>

          <!-- Resources & Actions -->
          <div style="background: #1c2b33; padding: 25px; border-radius: 16px; border: 2px solid #00ffff44;">
            <h4 style="margin: 0 0 20px 0; color: #00ffff; font-size: 20px;">Resources & Actions</h4>
            <div style="color: #ccc; margin-bottom: 30px;">
              <div style="display: grid; gap: 20px;">
                <div style="background: #2c3e50; padding: 20px; border-radius: 12px;">
                  <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
                    <div style="font-size: 24px;">⛽</div>
                    <div>
                      <strong style="color: #00ffff; font-size: 18px;">Fuel Needed</strong><br>
                      <span style="color: #ccc; font-size: 16px; font-weight: bold;">${fuelEstimate}</span>
                    </div>
                  </div>
                  <div style="font-size: 12px; color: #888; margin-top: 8px;">
                    Based on current material requirements
                  </div>
                </div>
                <div style="background: #2c3e50; padding: 20px; border-radius: 12px;">
                  <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 10px;">
                    <div style="font-size: 24px;">⏰</div>
                    <div>
                      <strong style="color: #00ffff; font-size: 18px;">Time Needed</strong><br>
                      <span style="color: #ccc; font-size: 16px; font-weight: bold;">${timeEstimate}</span>
                    </div>
                  </div>
                  <div style="font-size: 12px; color: #888; margin-top: 8px;">
                    Natural regeneration time
                  </div>
                </div>
              </div>
            </div>
            <button onclick="window.openGearCalculator('${char.id}')" 
                    style="padding: 15px 20px; background: #9b59b6; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; width: 100%; font-size: 16px; margin-top: 10px;">
              🎯 Calculate ${gearType}
            </button>
            <div style="font-size: 12px; color: #888; text-align: center; margin-top: 10px;">
              Optimize your ${gearType.toLowerCase()} build for ${char.name}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Close Button -->
    <div style="flex-shrink: 0; text-align: center; padding: 20px; background: #1c2b33; border-top: 2px solid #00ffff44;">
      <button onclick="window.closeModal?.()" 
              style="padding: 15px 30px; background: #95a5a6; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold;">
        Close
      </button>
    </div>
  </div>
`);
}

// Setup level change listeners
function setupLevelChangeListeners(charId) {
  const char = getCharacterById(charId);
  const charLevelInput = document.getElementById("char-new-level");
  if (charLevelInput) {
    charLevelInput.addEventListener("change", () => {
      const char = getCharacterById(charId);
      setTimeout(() => renderCharacterDetail(char), 100);
    });
  }

  if (Array.isArray(char.talentsCurrent)) {
    char.talentsCurrent.forEach((_, i) => {
      const talentInput = document.getElementById(`talent-new-${i}`);
      if (talentInput) {
        talentInput.addEventListener("change", () => {
          const char = getCharacterById(charId);
          setTimeout(() => renderCharacterDetail(char), 100);
        });
      }
    });
  }
}

window.setupCharacterDetailListeners = setupLevelChangeListeners;
