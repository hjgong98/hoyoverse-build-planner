// /saved/character-gear.js

import { CHARACTER_STATS } from "../data/character-stats.js";
import { ALL_CHARACTERS } from "../data/all-characters.js";
import { ALL_WEAPONS } from "../data/all-weapons.js";
import { getCharacterById, saveMyCharacters } from "./my-characters.js";

// Replace the createNavigation function in character-gear.js
function createNavigation(char) {
  return `
    <div style="margin-bottom: 20px;">
      <button onclick="window.navigateToCharacterDetails('${char.id}')" 
              style="padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; margin-right: 10px;">
        ← Back to Character Details
      </button>
      <button onclick="window.navigateToCharacterList()" 
              style="padding: 10px 20px; background: #95a5a6; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px;">
        ← Back to Character List
      </button>
    </div>
  `;
}

// Add these global navigation functions at the end of character-gear.js
window.navigateToCharacterDetails = (charId) => {
  const char = getCharacterById(charId);
  if (char) {
    // Close the current gear view and reopen character details modal
    const content = document.getElementById("page-content");
    if (content) {
      content.innerHTML = ""; // Clear the gear view
    }
    renderCharacterDetail(char); // This should reopen the character details modal
  }
};

window.navigateToCharacterList = () => {
  // Clear the current content and reinitialize the character list
  const content = document.getElementById("page-content");
  if (content) {
    content.innerHTML = ""; // Clear the gear view
  }
  // Reinitialize the characters scene to show the list
  if (window.initCharactersScene) {
    window.initCharactersScene();
  }
};

// Add gear level options function
function getGearLevelOptions() {
  return [90, 95, 100];
}

// Artifact set effects data
const ARTIFACT_SETS = {
  genshin: {
    "Gladiator's Finale": {
      "2pc": { atk: 18 },
      "4pc": { normalDmg: 35 },
    },
    "Wanderer's Troupe": {
      "2pc": { elementalMastery: 80 },
      "4pc": { chargedDmg: 35 },
    },
    "Crimson Witch of Flames": {
      "2pc": { pyroDmg: 15 },
      "4pc": { pyroReactionDmg: 40, pyroDmg: 15 },
    },
    // Add more sets as needed
  },
};

// Main stats options for artifacts with their values
const ARTIFACT_MAIN_STATS = {
  flower: ["HP"],
  plume: ["ATK"],
  sands: ["HP%", "ATK%", "DEF%", "Elemental Mastery", "Energy Recharge"],
  goblet: [
    "HP%",
    "ATK%",
    "DEF%",
    "Elemental Mastery",
    "Pyro DMG%",
    "Hydro DMG%",
    "Electro DMG%",
    "Cryo DMG%",
    "Anemo DMG%",
    "Geo DMG%",
    "Dendro DMG%",
    "Physical DMG%",
  ],
  circlet: [
    "HP%",
    "ATK%",
    "DEF%",
    "Elemental Mastery",
    "CRIT Rate",
    "CRIT DMG",
    "Healing Bonus",
  ],
};

// Artifact main stat values (max values at +20)
const ARTIFACT_MAIN_STAT_VALUES = {
  "HP": 4780,
  "ATK": 311,
  "HP%": 46.6,
  "ATK%": 46.6,
  "DEF%": 58.3,
  "Elemental Mastery": 187,
  "Energy Recharge": 51.8,
  "CRIT Rate": 31.1,
  "CRIT DMG": 62.2,
  "Healing Bonus": 35.9,
  "Pyro DMG%": 46.6,
  "Hydro DMG%": 46.6,
  "Electro DMG%": 46.6,
  "Cryo DMG%": 46.6,
  "Anemo DMG%": 46.6,
  "Geo DMG%": 46.6,
  "Dendro DMG%": 46.6,
  "Physical DMG%": 58.3,
};

// Function to format stat values for display
function formatStatValue(stat, value) {
  if (stat === "HP") return value.toLocaleString();
  if (stat === "ATK") return value.toLocaleString();
  if (
    stat.includes("%") || stat === "CRIT Rate" || stat === "CRIT DMG" ||
    stat === "Healing Bonus" || stat === "Energy Recharge"
  ) {
    return value.toFixed(1) + "%";
  }
  if (stat === "Elemental Mastery") return value.toLocaleString();
  return value.toFixed(1);
}

export function initCharacterGearScene(characterId) {
  const char = getCharacterById(characterId);
  if (!char) {
    console.error("Character not found:", characterId);
    return;
  }

  renderCharacterGear(char);
}

function renderCharacterGear(char) {
  const content = document.getElementById("page-content");
  if (!content) return;

  const charData = ALL_CHARACTERS[char.game]?.[char.name];

  // Initialize gear level if not exists (default to 90)
  if (!char.gearLevel) {
    char.gearLevel = 90;
    saveMyCharacters();
  }

  // Use the selected gear level for calculations
  const gearLevel = char.gearLevel;
  const stats = CHARACTER_STATS[char.game]?.[char.name]?.[gearLevel];

  console.log("Character stats for gear calculator:", {
    name: char.name,
    level: gearLevel,
    stats: stats,
    charData: charData,
  });

  // Initialize gear data if not exists
  if (!char.gear) {
    char.gear = {
      weapon: char.weaponName || "",
      artifactSet1: "",
      artifactSet2: "",
      artifacts: {
        flower: { mainStat: "HP", value: ARTIFACT_MAIN_STAT_VALUES["HP"] },
        plume: { mainStat: "ATK", value: ARTIFACT_MAIN_STAT_VALUES["ATK"] },
        sands: { mainStat: "HP%", value: ARTIFACT_MAIN_STAT_VALUES["HP%"] },
        goblet: { mainStat: "HP%", value: ARTIFACT_MAIN_STAT_VALUES["HP%"] },
        circlet: { mainStat: "HP%", value: ARTIFACT_MAIN_STAT_VALUES["HP%"] },
      },
      goalStats: {
        hp: 0,
        atk: 0,
        def: 0,
        elementalMastery: 0,
        critRate: 0,
        critDmg: 0,
        healingBonus: 0,
        energyRecharge: 0,
        elementalDmg: 0,
      },
    };
    saveMyCharacters();
  }

  content.innerHTML = `
    <div style="max-width: 1400px; margin: 0 auto; padding: 20px;">
      ${createNavigation(char)}
      <h2 style="color: #00ffff; margin-bottom: 25px;">${char.name} - ${
    getGearType(char.game)
  } Optimizer</h2>
      
      <!-- Character Level Selection -->
      <div style="background: #1c2b33; padding: 15px; border-radius: 12px; border: 2px solid #00ffff44; margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong style="color: #00ffff;">Gear Calculator Level:</strong>
            <select id="gear-level-select" onchange="updateGearLevel('${char.id}')" 
                    style="margin-left: 10px; padding: 8px 12px; background: #2c3e50; border: 2px solid #00ffff; border-radius: 6px; color: white; font-size: 16px; font-weight: bold;">
              ${
    getGearLevelOptions().map((level) =>
      `<option value="${level}" ${
        char.gearLevel === level ? "selected" : ""
      }>${level}</option>`
    ).join("")
  }
            </select>
          </div>
          <div style="color: #ccc; font-size: 14px;">
            Note: This level is only for gear calculations and won't affect your actual character level
          </div>
        </div>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-bottom: 25px;">
        
        <!-- Left Column: Current Stats -->
        <div style="background: #1c2b33; padding: 25px; border-radius: 16px; border: 2px solid #00ffff44;">
          <h3 style="color: #00ffff; margin-bottom: 20px;">Current Stats</h3>
          
          <div style="margin-bottom: 20px;">
            <strong>Weapon:</strong>
            <div style="display: flex; align-items: center; gap: 12px; margin-top: 8px;">
              ${
    char.gear.weapon
      ? `
                <img src="${
        getWeaponImageForGear(char)
      }" alt="${char.gear.weapon}" 
                    style="width: 40px; height: 40px; border-radius: 6px; object-fit: cover; border: 2px solid ${
        getRarityColorForGear(char)
      };">
                <div style="flex: 1;">
                  <div style="color: #00ffff; font-weight: bold; font-size: 14px;">${char.gear.weapon}</div>
                  <div style="color: #ccc; font-size: 11px;">${
        getWeaponRarityForGear(char)
      }</div>
                </div>
              `
      : `
                <div style="width: 40px; height: 40px; border-radius: 6px; background: #2c3e50; display: flex; align-items: center; justify-content: center; border: 2px dashed #ccc;">
                  <span style="color: #ccc; font-size: 16px;">?</span>
                </div>
                <div style="color: #ccc; font-size: 14px;">No weapon selected</div>
              `
  }
              <button onclick="openWeaponSelector('${char.id}')" 
                      style="padding: 6px 12px; background: #9b59b6; color: white; border: none; border-radius: 6px; font-size: 12px; cursor: pointer;">
                Change
              </button>
            </div>
          </div>
          
          <div id="current-stats" style="display: grid; gap: 12px;">
            ${
    stats
      ? renderCurrentStats(char, stats, charData)
      : '<div style="color: #e74c3c; text-align: center;">Character stats not found for level ' +
        gearLevel + "</div>"
  }
          </div>
        </div>
        
        <!-- Right Column: Goal Stats -->
        <div style="background: #1c2b33; padding: 25px; border-radius: 16px; border: 2px solid #00ffff44;">
          <h3 style="color: #00ffff; margin-bottom: 20px;">Goal Stats</h3>
          <div id="goal-stats" style="display: grid; gap: 12px;">
            ${renderGoalStats(char)}
          </div>
        </div>
      </div>
      
      <!-- Bottom: Artifacts Configuration -->
      <div style="background: #1c2b33; padding: 25px; border-radius: 16px; border: 2px solid #00ffff44;">
        <h3 style="color: #00ffff; margin-bottom: 20px;">Artifacts Configuration</h3>
        
        <!-- Artifact Set Selection -->
        <div style="margin-bottom: 25px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
            <div>
              <strong>2-Piece Set Effect:</strong>
              <select id="artifact-set-1" onchange="updateArtifactSet('${char.id}', 1)" 
                      style="width: 100%; padding: 10px; background: #2c3e50; border: 2px solid #00ffff; border-radius: 8px; color: white; margin-top: 8px;">
                <option value="">Choose set...</option>
                ${
    Object.keys(ARTIFACT_SETS[char.game] || {}).map((set) =>
      `<option value="${set}" ${
        char.gear.artifactSet1 === set ? "selected" : ""
      }>${set}</option>`
    ).join("")
  }
              </select>
            </div>
            <div>
              <strong>2-Piece Set Effect:</strong>
              <select id="artifact-set-2" onchange="updateArtifactSet('${char.id}', 2)" 
                      style="width: 100%; padding: 10px; background: #2c3e50; border: 2px solid #00ffff; border-radius: 8px; color: white; margin-top: 8px;">
                <option value="">Choose set...</option>
                ${
    Object.keys(ARTIFACT_SETS[char.game] || {}).map((set) =>
      `<option value="${set}" ${
        char.gear.artifactSet2 === set ? "selected" : ""
      }>${set}</option>`
    ).join("")
  }
              </select>
            </div>
          </div>
          
          <!-- 4-Piece Set Display -->
          <div id="four-piece-set" style="background: #2c3e50; padding: 15px; border-radius: 8px; margin-top: 15px; display: ${
    char.gear.artifactSet1 === char.gear.artifactSet2 && char.gear.artifactSet1
      ? "block"
      : "none"
  }">
            <strong style="color: #00ffff;">4-Piece Set Active:</strong> ${char.gear.artifactSet1}
          </div>
        </div>
        
        <!-- Artifact Main Stats -->
        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 15px;">
          ${
    ["flower", "plume", "sands", "goblet", "circlet"].map((slot) => {
      const artifact = char.gear.artifacts[slot];
      const currentValue = artifact.value ||
        ARTIFACT_MAIN_STAT_VALUES[artifact.mainStat] || 0;
      const formattedValue = formatStatValue(artifact.mainStat, currentValue);

      return `
            <div style="background: #2c3e50; padding: 15px; border-radius: 12px; text-align: center;">
              <div style="font-size: 24px; margin-bottom: 8px;">${
        getArtifactIcon(slot)
      }</div>
              <strong style="display: block; margin-bottom: 8px; color: #00ffff;">${
        slot.charAt(0).toUpperCase() + slot.slice(1)
      }</strong>
              <div style="margin-bottom: 8px; font-size: 12px; color: #00ffff; font-weight: bold; min-height: 20px;">
                ${formattedValue}
              </div>
              <select onchange="updateArtifactMainStat('${char.id}', '${slot}')" 
                      style="width: 100%; padding: 8px; background: #1c2b33; border: 2px solid #00ffff; border-radius: 6px; color: white; font-size: 12px;">
                ${
        ARTIFACT_MAIN_STATS[slot].map((stat) =>
          `<option value="${stat}" ${
            char.gear.artifacts[slot].mainStat === stat ? "selected" : ""
          }>${stat}</option>`
        ).join("")
      }
              </select>
            </div>
            `;
    }).join("")
  }
        </div>
        
        <!-- Stats Comparison - Replaced with empty placeholder for future content -->
        <div id="stats-comparison" style="margin-top: 25px; background: #2c3e50; padding: 20px; border-radius: 12px; min-height: 100px;">
          <div style="text-align: center; color: #888; font-style: italic;">
            Additional artifact optimization features coming soon...
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderCurrentStats(char, stats, charData) {
  const currentStats = calculateCurrentStats(char, stats, charData);

  const statsConfig = [
    { key: "hp", label: "HP", base: Math.round(currentStats.hp), suffix: "" },
    {
      key: "atk",
      label: "ATK",
      base: Math.round(currentStats.atk),
      suffix: "",
    },
    {
      key: "def",
      label: "DEF",
      base: Math.round(currentStats.def),
      suffix: "",
    },
    {
      key: "elementalMastery",
      label: "Elemental Mastery",
      base: Math.round(currentStats.elementalMastery),
      suffix: "",
    },
    {
      key: "critRate",
      label: "CRIT Rate",
      base: currentStats.critRate.toFixed(1),
      suffix: "%",
    },
    {
      key: "critDmg",
      label: "CRIT DMG",
      base: currentStats.critDmg.toFixed(1),
      suffix: "%",
    },
    {
      key: "healingBonus",
      label: "Healing Bonus",
      base: currentStats.healingBonus.toFixed(1),
      suffix: "%",
      condition: currentStats.healingBonus > 0,
    },
    {
      key: "energyRecharge",
      label: "Energy Recharge",
      base: currentStats.energyRecharge.toFixed(1),
      suffix: "%",
    },
    {
      key: "elementalDmg",
      label: `${charData?.element || "Elemental"} DMG Bonus`,
      base: currentStats.elementalDmg.toFixed(1),
      suffix: "%",
    },
  ];

  return statsConfig.map((stat) => {
    if (stat.condition === false) return "";
    return `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: #2c3e50; border-radius: 6px;">
        <span>${stat.label}:</span>
        <span style="font-weight: bold; color: #00ffff;">${stat.base}${stat.suffix}</span>
      </div>
    `;
  }).join("");
}

function renderGoalStats(char) {
  const goalStats = char.gear.goalStats;

  const statsConfig = [
    { key: "hp", label: "HP", suffix: "" },
    { key: "atk", label: "ATK", suffix: "" },
    { key: "def", label: "DEF", suffix: "" },
    { key: "elementalMastery", label: "Elemental Mastery", suffix: "" },
    { key: "critRate", label: "CRIT Rate", suffix: "%" },
    { key: "critDmg", label: "CRIT DMG", suffix: "%" },
    {
      key: "healingBonus",
      label: "Healing Bonus",
      suffix: "%",
      condition: goalStats.healingBonus > 0,
    },
    { key: "energyRecharge", label: "Energy Recharge", suffix: "%" },
    { key: "elementalDmg", label: "Elemental DMG Bonus", suffix: "%" },
  ];

  return statsConfig.map((stat) => {
    if (stat.condition === false) return "";
    return `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: #2c3e50; border-radius: 6px;">
        <span>${stat.label}:</span>
        <input type="number" 
               id="goal-${stat.key}" 
               value="${goalStats[stat.key] || 0}" 
               onchange="updateGoalStat('${char.id}', '${stat.key}')"
               style="width: 80px; padding: 4px; background: #1c2b33; border: 2px solid #00ffff; border-radius: 4px; color: white; text-align: center;">
        <span>${stat.suffix}</span>
      </div>
    `;
  }).join("");
}

function calculateCurrentStats(char, stats, charData) {
  if (!stats) {
    console.error("No stats found for character:", char.name);
    return getBaseStats();
  }

  console.log("Calculating stats with:", {
    baseHP: stats.baseHP,
    baseATK: stats.baseATK,
    baseDEF: stats.baseDEF,
    additionalStat: stats.additionalStat,
  });

  const baseStats = getBaseStats();

  // Get weapon stats
  const weaponStats = calculateWeaponStats(char);

  // Get artifact main stats
  const artifactStats = calculateArtifactMainStats(char);

  // Get artifact set effects
  const setEffects = calculateArtifactSetEffects(char);

  // Calculate HP: (base hp of character * (1 + percentage sum of artifacts)) + flat artifact
  const hpPercentBonus = artifactStats.hpPercent + (setEffects.hp || 0);
  const hpFlatBonus = artifactStats.hpFlat;
  baseStats.hp = (stats.baseHP * (1 + hpPercentBonus / 100)) + hpFlatBonus;

  // Calculate ATK: ((BASE * (1 + percentage sum of artifacts)) + sum of flat artifact increases) + (BASE * percent weapon increase) + flat weapon increase
  const atkPercentBonus = artifactStats.atkPercent + (setEffects.atk || 0);
  const atkFlatBonus = artifactStats.atkFlat;
  baseStats.atk = (stats.baseATK * (1 + atkPercentBonus / 100)) + atkFlatBonus +
    (stats.baseATK * (weaponStats.atkPercent || 0) / 100) +
    (weaponStats.atkFlat || 0);

  // Calculate DEF: (base def * (1 + percentage sum of artifacts)) + flat def rolls
  const defPercentBonus = artifactStats.defPercent + (setEffects.def || 0);
  const defFlatBonus = artifactStats.defFlat;
  baseStats.def = (stats.baseDEF * (1 + defPercentBonus / 100)) + defFlatBonus;

  // Apply additional stats from character ascension
  if (stats.additionalStat) {
    const additional = stats.additionalStat;
    switch (additional.type) {
      case "ATK":
        baseStats.atk += baseStats.atk * (additional.value / 100);
        break;
      case "HP":
        baseStats.hp += baseStats.hp * (additional.value / 100);
        break;
      case "DEF":
        baseStats.def += baseStats.def * (additional.value / 100);
        break;
      case "CRIT Rate":
        baseStats.critRate += additional.value;
        break;
      case "CRIT DMG":
        baseStats.critDmg += additional.value;
        break;
      case "Energy Recharge":
        baseStats.energyRecharge += additional.value;
        break;
      case "Elemental Mastery":
        baseStats.elementalMastery += additional.value;
        break;
      // Handle elemental DMG bonuses
      default:
        if (additional.type.includes("DMG Bonus")) {
          baseStats.elementalDmg += additional.value;
        }
        break;
    }
  }

  // Apply weapon additional stats
  if (weaponStats.additionalStat) {
    const weaponAdditional = weaponStats.additionalStat;
    switch (weaponAdditional.type) {
      case "ATK":
        baseStats.atk += baseStats.atk * (weaponAdditional.value / 100);
        break;
      case "HP":
        baseStats.hp += baseStats.hp * (weaponAdditional.value / 100);
        break;
      case "DEF":
        baseStats.def += baseStats.def * (weaponAdditional.value / 100);
        break;
      case "CRIT Rate":
        baseStats.critRate += weaponAdditional.value;
        break;
      case "CRIT DMG":
        baseStats.critDmg += weaponAdditional.value;
        break;
      case "Energy Recharge":
        baseStats.energyRecharge += weaponAdditional.value;
        break;
      case "Elemental Mastery":
        baseStats.elementalMastery += weaponAdditional.value;
        break;
      // Handle elemental DMG bonuses
      default:
        if (weaponAdditional.type.includes("DMG Bonus")) {
          baseStats.elementalDmg += weaponAdditional.value;
        }
        break;
    }
  }

  // Apply artifact set effects to other stats
  baseStats.elementalMastery += setEffects.elementalMastery || 0;
  baseStats.critRate += setEffects.critRate || 0;
  baseStats.critDmg += setEffects.critDmg || 0;
  baseStats.energyRecharge += setEffects.energyRecharge || 0;
  baseStats.healingBonus += setEffects.healingBonus || 0;
  baseStats.elementalDmg += setEffects.elementalDmg || 0;

  console.log("Final calculated stats:", baseStats);

  return baseStats;
}

function getBaseStats() {
  return {
    hp: 0,
    atk: 0,
    def: 0,
    elementalMastery: 0,
    critRate: 5, // Base crit rate
    critDmg: 50, // Base crit damage
    healingBonus: 0,
    energyRecharge: 100, // Base energy recharge
    elementalDmg: 0,
  };
}

function calculateWeaponStats(char) {
  const weaponName = char.gear.weapon;
  if (!weaponName) return { atkFlat: 0, atkPercent: 0 };

  const charData = ALL_CHARACTERS[char.game]?.[char.name];
  const weaponType = charData?.weapon;

  if (!weaponType) return { atkFlat: 0, atkPercent: 0 };

  const weapons = ALL_WEAPONS[char.game]?.[weaponType] || [];
  const weapon = weapons.find((w) => w.name === weaponName);

  if (!weapon) return { atkFlat: 0, atkPercent: 0 };

  const weaponStats = {
    atkFlat: weapon.baseATK || 0,
    atkPercent: 0,
    additionalStat: null,
  };

  // Parse weapon stat (e.g., "ATK, 10.5" or "CRIT Rate, 5.2")
  if (weapon.stat && typeof weapon.stat === "string") {
    const [statType, statValue] = weapon.stat.split(",").map((s) => s.trim());
    if (statType && statValue) {
      const value = parseFloat(statValue);
      if (!isNaN(value)) {
        weaponStats.additionalStat = {
          type: statType,
          value: value,
        };
      }
    }
  }

  return weaponStats;
}

function calculateArtifactMainStats(char) {
  const artifacts = char.gear.artifacts;
  const stats = {
    hpFlat: 0,
    hpPercent: 0,
    atkFlat: 0,
    atkPercent: 0,
    defFlat: 0,
    defPercent: 0,
    elementalMastery: 0,
    energyRecharge: 0,
    critRate: 0,
    critDmg: 0,
    healingBonus: 0,
    elementalDmg: 0,
  };

  Object.values(artifacts).forEach((artifact) => {
    const mainStat = artifact.mainStat;
    const value = artifact.value || ARTIFACT_MAIN_STAT_VALUES[mainStat] || 0;

    switch (mainStat) {
      case "HP":
        stats.hpFlat += value;
        break;
      case "ATK":
        stats.atkFlat += value;
        break;
      case "HP%":
        stats.hpPercent += value;
        break;
      case "ATK%":
        stats.atkPercent += value;
        break;
      case "DEF%":
        stats.defPercent += value;
        break;
      case "Elemental Mastery":
        stats.elementalMastery += value;
        break;
      case "Energy Recharge":
        stats.energyRecharge += value;
        break;
      case "CRIT Rate":
        stats.critRate += value;
        break;
      case "CRIT DMG":
        stats.critDmg += value;
        break;
      case "Healing Bonus":
        stats.healingBonus += value;
        break;
      default:
        // Handle elemental DMG bonuses
        if (mainStat.includes("DMG%")) {
          stats.elementalDmg += value;
        }
        break;
    }
  });

  return stats;
}

function calculateArtifactSetEffects(char) {
  const effects = {};
  const gear = char.gear;

  if (gear.artifactSet1 && ARTIFACT_SETS[char.game]?.[gear.artifactSet1]) {
    const set1 = ARTIFACT_SETS[char.game][gear.artifactSet1]["2pc"];
    Object.assign(effects, set1);
  }

  if (gear.artifactSet2 && ARTIFACT_SETS[char.game]?.[gear.artifactSet2]) {
    const set2 = ARTIFACT_SETS[char.game][gear.artifactSet2]["2pc"];
    Object.keys(set2).forEach((stat) => {
      effects[stat] = (effects[stat] || 0) + set2[stat];
    });
  }

  // 4-piece set effect
  if (gear.artifactSet1 === gear.artifactSet2 && gear.artifactSet1) {
    const fourPiece = ARTIFACT_SETS[char.game][gear.artifactSet1]["4pc"];
    Object.keys(fourPiece).forEach((stat) => {
      effects[stat] = (effects[stat] || 0) + fourPiece[stat];
    });
  }

  return effects;
}

function getArtifactIcon(slot) {
  const icons = {
    flower: "🌸",
    plume: "🪶",
    sands: "⏳",
    goblet: "🍶",
    circlet: "👑",
  };
  return icons[slot] || "📦";
}

function getGearType(game) {
  const gearTypes = {
    genshin: "Artifacts",
    hsr: "Relics",
    zzz: "Discs",
  };
  return gearTypes[game] || "Gear";
}

// Global functions for event handlers
window.openWeaponSelector = (charId) => {
  const char = getCharacterById(charId);
  const charData = ALL_CHARACTERS[char.game]?.[char.name];
  const weaponType = charData?.weapon;

  if (!weaponType) {
    alert("No weapon type found for this character!");
    return;
  }

  const allWeapons = ALL_WEAPONS[char.game]?.[weaponType] || [];

  const weaponOptions = allWeapons.length > 0
    ? allWeapons.map((weapon) => {
      const weaponImage = weapon.image ||
        `/assets/${char.game}/weapons/${weapon.name}.webp`;
      return `
        <option value="${weapon.name}" ${
        char.gear.weapon === weapon.name ? "selected" : ""
      }>
          ${weapon.name} ${weapon.rarity ? `(${weapon.rarity}★)` : ""}
        </option>
      `;
    }).join("")
    : `<option value="">No weapons available</option>`;

  window.openModal?.(`
    <div style="text-align: left; color: white; max-width: 500px;">
      <h3 style="color: #00ffff; margin-bottom: 20px;">Select Weapon</h3>
      
      <div style="margin-bottom: 25px;">
        <strong style="font-size: 16px;">Weapon:</strong><br>
        <select id="weapon-select" style="width: 100%; padding: 12px; background: #2c3e50; border: 2px solid #00ffff; border-radius: 8px; color: white; font-size: 16px; margin-top: 8px;">
          ${weaponOptions}
        </select>
      </div>
      
      <div style="display: flex; gap: 15px; justify-content: center;">
        <button onclick="saveWeaponSelection('${charId}')" 
                style="padding: 15px 25px; background: #2ecc71; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 16px;">
          💾 Save Weapon
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
    char.gear.weapon = weaponSelect.options[weaponSelect.selectedIndex]?.text ||
      weaponSelect.value;
    saveMyCharacters();
    renderCharacterGear(char);
    window.closeModal?.();
  }
};

window.updateArtifactSet = (charId, setNumber) => {
  const char = getCharacterById(charId);
  const select = document.getElementById(`artifact-set-${setNumber}`);

  if (select) {
    if (setNumber === 1) {
      char.gear.artifactSet1 = select.value;
    } else {
      char.gear.artifactSet2 = select.value;
    }
    saveMyCharacters();
    renderCharacterGear(char);
  }
};

window.updateArtifactMainStat = (charId, slot) => {
  const char = getCharacterById(charId);
  const select = document.querySelector(
    `select[onchange="updateArtifactMainStat('${charId}', '${slot}')"]`,
  );

  if (select) {
    char.gear.artifacts[slot].mainStat = select.value;
    // Update the value based on the new main stat
    char.gear.artifacts[slot].value = ARTIFACT_MAIN_STAT_VALUES[select.value] ||
      0;
    saveMyCharacters();
    renderCharacterGear(char);
  }
};

window.updateGoalStat = (charId, statKey) => {
  const char = getCharacterById(charId);
  const input = document.getElementById(`goal-${statKey}`);

  if (input) {
    char.gear.goalStats[statKey] = parseFloat(input.value) || 0;
    saveMyCharacters();
    renderCharacterGear(char);
  }
};

// Add gear level update function
window.updateGearLevel = (charId) => {
  const char = getCharacterById(charId);
  const select = document.getElementById("gear-level-select");

  if (select) {
    char.gearLevel = parseInt(select.value);
    saveMyCharacters();
    renderCharacterGear(char);
  }
};

// Add these helper functions to character-gear.js
function getWeaponImageForGear(char) {
  if (!char.gear.weapon) return "";

  const charData = ALL_CHARACTERS[char.game]?.[char.name];
  const weaponType = charData?.weapon;

  if (!weaponType) return "";

  const weapons = ALL_WEAPONS[char.game]?.[weaponType] || [];
  const weapon = weapons.find((w) => w.name === char.gear.weapon);

  if (weapon && weapon.image) {
    return weapon.image;
  }

  // Fallback image path
  return `/assets/${char.game}/weapons/${char.gear.weapon}.webp`;
}

function getRarityColorForGear(char) {
  if (!char.gear.weapon) return "#95a5a6";

  const charData = ALL_CHARACTERS[char.game]?.[char.name];
  const weaponType = charData?.weapon;

  if (!weaponType) return "#95a5a6";

  const weapons = ALL_WEAPONS[char.game]?.[weaponType] || [];
  const weapon = weapons.find((w) => w.name === char.gear.weapon);

  if (!weapon) return "#95a5a6";

  const rarity = weapon.rarity || weapon.rarity;
  switch (rarity) {
    case 5:
      return "#ffd700";
    case 4:
      return "#c0c0c0";
    case 3:
      return "#cd7f32";
    default:
      return "#95a5a6";
  }
}

function getWeaponRarityForGear(char) {
  if (!char.gear.weapon) return "";

  const charData = ALL_CHARACTERS[char.game]?.[char.name];
  const weaponType = charData?.weapon;

  if (!weaponType) return "";

  const weapons = ALL_WEAPONS[char.game]?.[weaponType] || [];
  const weapon = weapons.find((w) => w.name === char.gear.weapon);

  if (!weapon) return "";

  const rarity = weapon.rarity || weapon.rarity;
  return rarity ? `${rarity}★` : "";
}
