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

// Artifact main stats options
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

// Artifact main stat values (separate for 5-star and 4-star)
const ARTIFACT_MAIN_STAT_VALUES = {
  "5star": {
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
  },
  "4star": {
    "HP": 3571,
    "ATK": 232,
    "HP%": 35.2,
    "ATK%": 35.2,
    "DEF%": 44.1,
    "Elemental Mastery": 139,
    "Energy Recharge": 39.0,
    "CRIT Rate": 23.4,
    "CRIT DMG": 46.8,
    "Healing Bonus": 26.9,
    "Pyro DMG%": 35.2,
    "Hydro DMG%": 35.2,
    "Electro DMG%": 35.2,
    "Cryo DMG%": 35.2,
    "Anemo DMG%": 35.2,
    "Geo DMG%": 35.2,
    "Dendro DMG%": 35.2,
    "Physical DMG%": 44.1,
  },
};

// ====================================================================
// ARTIFACT SETS DATA - ADD MORE SETS HERE FOLLOWING THE SAME FORMAT
// ====================================================================
const ARTIFACT_SETS = {
  genshin: {
    "Gladiator's Finale": {
      "2pc": { type: "stat", value: 18, stat: "atk" },
      "4pc": {
        type: "stat",
        value: 35,
        stat: "normalDmg",
        description: "Increases Normal Attack DMG by 35%.",
      },
      images: {
        flower: "/assets/genshin/artifacts/gladiators_flower.webp",
        plume: "/assets/genshin/artifacts/gladiators_plume.webp",
        sands: "/assets/genshin/artifacts/gladiators_sands.webp",
        goblet: "/assets/genshin/artifacts/gladiators_goblet.webp",
        circlet: "/assets/genshin/artifacts/gladiators_circlet.webp",
      },
      rarity: 5,
    },
    "Wanderer's Troupe": {
      "2pc": { type: "stat", value: 80, stat: "elementalMastery" },
      "4pc": {
        type: "stat",
        value: 35,
        stat: "chargedDmg",
        description: "Increases Charged Attack DMG by 35%.",
      },
      images: {
        flower: "/assets/genshin/artifacts/wanderers_flower.webp",
        plume: "/assets/genshin/artifacts/wanderers_plume.webp",
        sands: "/assets/genshin/artifacts/wanderers_sands.webp",
        goblet: "/assets/genshin/artifacts/wanderers_goblet.webp",
        circlet: "/assets/genshin/artifacts/wanderers_circlet.webp",
      },
      rarity: 5,
    },
    "Crimson Witch of Flames": {
      "2pc": { type: "stat", value: 15, stat: "pyroDmg" },
      "4pc": {
        type: "mixed",
        value: 40,
        stat: "pyroReactionDmg",
        description:
          "Increases Overloaded, Burning, and Burgeon DMG by 40%. Increases Vaporize and Melt DMG by 15%.",
      },
      images: {
        flower: "/assets/genshin/artifacts/crimson_flower.webp",
        plume: "/assets/genshin/artifacts/crimson_plume.webp",
        sands: "/assets/genshin/artifacts/crimson_sands.webp",
        goblet: "/assets/genshin/artifacts/crimson_goblet.webp",
        circlet: "/assets/genshin/artifacts/crimson_circlet.webp",
      },
      rarity: 5,
    },
    "Retracing Bolide": {
      "2pc": { type: "stat", value: 35, stat: "shieldStrength" },
      "4pc": {
        type: "description",
        description:
          "While protected by a shield, gain an additional 40% Normal and Charged Attack DMG.",
        value: 40,
        stat: "normalDmg",
      },
      images: {
        flower: "/assets/genshin/artifacts/retracing_flower.webp",
        plume: "/assets/genshin/artifacts/retracing_plume.webp",
        sands: "/assets/genshin/artifacts/retracing_sands.webp",
        goblet: "/assets/genshin/artifacts/retracing_goblet.webp",
        circlet: "/assets/genshin/artifacts/retracing_circlet.webp",
      },
      rarity: 5,
    },
    "Berserker": {
      "2pc": { type: "stat", value: 12, stat: "critRate" },
      "4pc": {
        type: "stat",
        value: 24,
        stat: "critRate",
        description:
          "When HP is below 70%, CRIT Rate increases by an additional 24%.",
      },
      images: {
        flower: "/assets/genshin/artifacts/berserker_flower.webp",
        plume: "/assets/genshin/artifacts/berserker_plume.webp",
        sands: "/assets/genshin/artifacts/berserker_sands.webp",
        goblet: "/assets/genshin/artifacts/berserker_goblet.webp",
        circlet: "/assets/genshin/artifacts/berserker_circlet.webp",
      },
      rarity: 4,
    },
    // ====================================================================
    // ADD MORE ARTIFACT SETS HERE FOLLOWING THE SAME FORMAT:
    //
    // "Set Name": {
    //   "2pc": { type: "stat", value: XX, stat: "statType" },
    //   "4pc": {
    //     type: "stat"/"description"/"mixed",
    //     value: XX, // if applicable
    //     stat: "statType", // if applicable
    //     description: "Effect description" // if applicable
    //   },
    //   images: {
    //     flower: "path/to/flower.webp",
    //     plume: "path/to/plume.webp",
    //     sands: "path/to/sands.webp",
    //     goblet: "path/to/goblet.webp",
    //     circlet: "path/to/circlet.webp"
    //   },
    //   rarity: 5 // or 4
    // },
    // ====================================================================
  },
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

// Function to get artifact main stat value based on rarity
function getArtifactMainStatValue(mainStat, rarity = "5star") {
  const rarityKey = rarity === 5 ? "5star" : "4star";
  return ARTIFACT_MAIN_STAT_VALUES[rarityKey]?.[mainStat] || 0;
}

// Function to get artifact set rarity
function getArtifactSetRarity(char, setName) {
  const artifactSet = ARTIFACT_SETS[char.game]?.[setName];
  if (artifactSet && artifactSet.rarity) {
    return artifactSet.rarity === 5 ? "5star" : "4star";
  }
  return "5star"; // Default to 5-star
}

// Function to get artifact set options with rarity indicator
// Function to get artifact set options with proper selection
function getArtifactSetOptions(
  game,
  currentSet1 = "",
  currentSet2 = "",
  setNumber = 0,
) {
  const sets = ARTIFACT_SETS[game] || {};
  return Object.keys(sets).map((set) => {
    const setData = sets[set];
    const rarityStars = "★".repeat(setData.rarity);

    // Only select if this set matches the current set for this specific dropdown
    let isSelected = false;
    if (setNumber === 1) {
      isSelected = set === currentSet1;
    } else if (setNumber === 2) {
      isSelected = set === currentSet2;
    }

    return `<option value="${set}" ${
      isSelected ? "selected" : ""
    }>${set} (${rarityStars})</option>`;
  }).join("");
}

// Check if an artifact's rarity is locked by set effects
function isArtifactRarityLocked(char, slot) {
  const set1 = char.gear.artifactSet1;
  const set2 = char.gear.artifactSet2;

  if (!set1 && !set2) return false; // No sets, not locked

  // Check if this slot is part of a 4-star set
  if (set1 && ARTIFACT_SETS[char.game]?.[set1]) {
    const set1Rarity = getArtifactSetRarity(char, set1);
    if (set1Rarity === "4star") {
      // First set: Flower and Plume are locked to 4-star
      if (slot === "flower" || slot === "plume") return true;
    }
  }

  if (set2 && ARTIFACT_SETS[char.game]?.[set2]) {
    const set2Rarity = getArtifactSetRarity(char, set2);
    if (set2Rarity === "4star") {
      if (set1 === set2) {
        // Same set: All except Sands are locked to 4-star
        if (slot !== "sands") return true;
      } else {
        // Different set: Goblet and Circlet are locked to 4-star
        if (slot === "goblet" || slot === "circlet") return true;
      }
    }
  }

  return false;
}

// Function to update artifact rarities based on set combinations
function updateArtifactRarities(char) {
  const set1 = char.gear.artifactSet1;
  const set2 = char.gear.artifactSet2;

  // Default all to 5-star
  Object.keys(char.gear.artifacts).forEach((slot) => {
    char.gear.artifacts[slot].rarity = "5star";
  });

  // If we have 4-star sets, update the appropriate artifacts
  if (set1 && ARTIFACT_SETS[char.game]?.[set1]) {
    const set1Rarity = getArtifactSetRarity(char, set1);
    if (set1Rarity === "4star") {
      // Set Flower and Plume to 4-star for this set (keep Sands as 5★)
      char.gear.artifacts["flower"].rarity = "4star";
      char.gear.artifacts["plume"].rarity = "4star";
    }
  }

  if (set2 && ARTIFACT_SETS[char.game]?.[set2]) {
    const set2Rarity = getArtifactSetRarity(char, set2);
    if (set2Rarity === "4star") {
      if (set1 === set2) {
        // Same set - all artifacts except Sands become 4-star
        char.gear.artifacts["flower"].rarity = "4star";
        char.gear.artifacts["plume"].rarity = "4star";
        char.gear.artifacts["goblet"].rarity = "4star";
        char.gear.artifacts["circlet"].rarity = "4star";
        // Sands stays as 5★ for better Energy Recharge
      } else {
        // Different set - set Goblet and Circlet to 4-star (keep Sands as 5★)
        char.gear.artifacts["goblet"].rarity = "4star";
        char.gear.artifacts["circlet"].rarity = "4star";
      }
    }
  }

  // Update artifact values based on their individual rarities
  Object.keys(char.gear.artifacts).forEach((slot) => {
    const artifact = char.gear.artifacts[slot];
    artifact.value = getArtifactMainStatValue(
      artifact.mainStat,
      artifact.rarity,
    );
  });
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
        flower: {
          mainStat: "HP",
          value: getArtifactMainStatValue("HP", "5star"),
          rarity: "5star", // Individual rarity
        },
        plume: {
          mainStat: "ATK",
          value: getArtifactMainStatValue("ATK", "5star"),
          rarity: "5star",
        },
        sands: {
          mainStat: "HP%",
          value: getArtifactMainStatValue("HP%", "5star"),
          rarity: "5star",
        },
        goblet: {
          mainStat: "HP%",
          value: getArtifactMainStatValue("HP%", "5star"),
          rarity: "5star",
        },
        circlet: {
          mainStat: "HP%",
          value: getArtifactMainStatValue("HP%", "5star"),
          rarity: "5star",
        },
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
              <strong>First 2-Piece Set:</strong>
              <select id="artifact-set-1" onchange="updateArtifactSet('${char.id}', 1)" 
                      style="width: 100%; padding: 10px; background: #2c3e50; border: 2px solid #00ffff; border-radius: 8px; color: white; margin-top: 8px;">
                <option value="">Choose set...</option>
                ${
    getArtifactSetOptions(
      char.game,
      char.gear.artifactSet1,
      char.gear.artifactSet2,
      1,
    )
  }
              </select>
            </div>
            <div>
              <strong>Second 2-Piece Set:</strong>
              <select id="artifact-set-2" onchange="updateArtifactSet('${char.id}', 2)" 
                      style="width: 100%; padding: 10px; background: #2c3e50; border: 2px solid #00ffff; border-radius: 8px; color: white; margin-top: 8px;">
                <option value="">Choose set...</option>
                ${
    getArtifactSetOptions(
      char.game,
      char.gear.artifactSet1,
      char.gear.artifactSet2,
      2,
    )
  }
              </select>
            </div>
          </div>
          
          <!-- Artifact Set Effects Display -->
          <div id="artifact-set-effects" style="background: #2c3e50; padding: 15px; border-radius: 8px; margin-top: 15px;">
            <strong style="color: #00ffff;">Active Set Effects:</strong>
            <div id="set-effects-content" style="margin-top: 10px;">
              ${renderArtifactSetEffects(char)}
            </div>
          </div>
        </div>
        
        <!-- Artifact Main Stats with Individual Rarity Controls -->
        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 15px;">
          ${
    ["flower", "plume", "sands", "goblet", "circlet"].map((slot, index) => {
      const artifact = char.gear.artifacts[slot];
      const currentValue = artifact.value ||
        getArtifactMainStatValue(artifact.mainStat, artifact.rarity);
      const formattedValue = formatStatValue(artifact.mainStat, currentValue);
      const isLocked = isArtifactRarityLocked(char, slot);

      return `
            <div style="background: #2c3e50; padding: 15px; border-radius: 12px; text-align: center; position: relative;">
              <!-- Rarity Badge -->
              <div style="position: absolute; top: 8px; right: 8px; background: ${
        artifact.rarity === "5star" ? "#ffd700" : "#c0c0c0"
      }; color: black; padding: 2px 6px; border-radius: 10px; font-size: 10px; font-weight: bold;">
                ${artifact.rarity === "5star" ? "5★" : "4★"}
              </div>
              
              <div style="font-size: 24px; margin-bottom: 8px;">${
        getArtifactIcon(slot)
      }</div>
              <strong style="display: block; margin-bottom: 8px; color: #00ffff;">${
        slot.charAt(0).toUpperCase() + slot.slice(1)
      }</strong>
              <div style="margin-bottom: 8px; font-size: 12px; color: #00ffff; font-weight: bold; min-height: 20px;">
                ${formattedValue}
              </div>
              
              <!-- Rarity Toggle (only if not locked by set effects) -->
              ${
        !isLocked
          ? `
                  <div style="margin-bottom: 8px;">
                    <select onchange="updateArtifactRarity('${char.id}', '${slot}')" 
                            style="width: 100%; padding: 4px; background: #1c2b33; border: 1px solid #00ffff; border-radius: 4px; color: white; font-size: 10px;">
                      <option value="5star" ${
            artifact.rarity === "5star" ? "selected" : ""
          }>5★</option>
                      <option value="4star" ${
            artifact.rarity === "4star" ? "selected" : ""
          }>4★</option>
                    </select>
                  </div>
                `
          : `
                  <div style="font-size: 9px; color: #888; margin-bottom: 8px;">
                    Locked by set
                  </div>
                `
      }
              
              <!-- Main Stat Selection -->
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
        
        <!-- Stats Comparison -->
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

// Function to display artifact set effects
function renderArtifactSetEffects(char) {
  const effects = calculateArtifactSetEffects(char);
  let html = "";

  const set1 = char.gear.artifactSet1;
  const set2 = char.gear.artifactSet2;

  if (set1 || set2) {
    html += `<div style="color: #ccc; margin-bottom: 10px; font-size: 12px;">`;

    if (set1 && set2) {
      if (set1 === set2) {
        const setRarity = getArtifactSetRarity(char, set1);
        html +=
          `<div style="color: #00ffff; font-weight: bold; margin-bottom: 5px;">4-Piece Set Active</div>`;
        html += `<strong>${set1}</strong> (${
          setRarity === "5star" ? "5★" : "4★"
        })`;
        if (setRarity === "4star") {
          html +=
            `<div style="font-size: 10px; color: #888; margin-top: 4px;">Flower, Plume, Goblet, Circlet: 4★ | Sands: 5★ (better stats)</div>`;
        }
      } else {
        const set1Rarity = getArtifactSetRarity(char, set1);
        const set2Rarity = getArtifactSetRarity(char, set2);
        html +=
          `<div style="color: #00ffff; font-weight: bold; margin-bottom: 5px;">2-Piece + 2-Piece Sets</div>`;
        html += `<div><strong>Set 1:</strong> ${set1} (${
          set1Rarity === "5star" ? "5★" : "4★"
        })</div>`;
        html += `<div><strong>Set 2:</strong> ${set2} (${
          set2Rarity === "5star" ? "5★" : "4★"
        })</div>`;
        if (set1Rarity === "4star" || set2Rarity === "4star") {
          let artifactInfo = "";
          if (set1Rarity === "4star") artifactInfo += "Flower, Plume: 4★";
          if (set2Rarity === "4star") {
            if (artifactInfo) artifactInfo += " | ";
            artifactInfo += "Goblet, Circlet: 4★";
          }
          artifactInfo += " | Sands: 5★ (better stats)";
          html +=
            `<div style="font-size: 10px; color: #888; margin-top: 4px;">${artifactInfo}</div>`;
        }
      }
    } else if (set1) {
      const setRarity = getArtifactSetRarity(char, set1);
      html +=
        `<div style="color: #00ffff; font-weight: bold; margin-bottom: 5px;">2-Piece Set Active</div>`;
      html += `<strong>${set1}</strong> (${
        setRarity === "5star" ? "5★" : "4★"
      })`;
      if (setRarity === "4star") {
        html +=
          `<div style="font-size: 10px; color: #888; margin-top: 4px;">Flower, Plume: 4★ | Others: 5★</div>`;
      }
    } else if (set2) {
      const setRarity = getArtifactSetRarity(char, set2);
      html +=
        `<div style="color: #00ffff; font-weight: bold; margin-bottom: 5px;">2-Piece Set Active</div>`;
      html += `<strong>${set2}</strong> (${
        setRarity === "5star" ? "5★" : "4★"
      })`;
      if (setRarity === "4star") {
        html +=
          `<div style="font-size: 10px; color: #888; margin-top: 4px;">Goblet, Circlet: 4★ | Others: 5★</div>`;
      }
    }
    html += `</div>`;
  }

  // Display stat effects
  Object.keys(effects.stats).forEach((stat) => {
    const value = effects.stats[stat];
    const formattedStat = formatStatName(stat);
    html +=
      `<div style="color: #00ffff; margin: 5px 0;">${formattedStat}: +${value}%</div>`;
  });

  // Display descriptive effects (only for 4-piece sets)
  if (set1 && set2 && set1 === set2) {
    effects.descriptions.forEach((desc) => {
      html +=
        `<div style="color: #88ff88; margin: 5px 0; font-style: italic; font-size: 12px;">${desc}</div>`;
    });
  }

  return html || '<div style="color: #888;">No set effects active</div>';
}

// Helper function to format stat names for display
function formatStatName(stat) {
  const statMap = {
    atk: "ATK",
    hp: "HP",
    def: "DEF",
    elementalMastery: "Elemental Mastery",
    critRate: "CRIT Rate",
    critDmg: "CRIT DMG",
    energyRecharge: "Energy Recharge",
    shieldStrength: "Shield Strength",
    normalDmg: "Normal Attack DMG",
    chargedDmg: "Charged Attack DMG",
    pyroDmg: "Pyro DMG Bonus",
    hydroDmg: "Hydro DMG Bonus",
    electroDmg: "Electro DMG Bonus",
    cryoDmg: "Cryo DMG Bonus",
    anemoDmg: "Anemo DMG Bonus",
    geoDmg: "Geo DMG Bonus",
    dendroDmg: "Dendro DMG Bonus",
    pyroReactionDmg: "Pyro Reaction DMG",
    // Add more mappings as needed
  };
  return statMap[stat] || stat;
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
  const hpPercentBonus = artifactStats.hpPercent + (setEffects.stats.hp || 0);
  const hpFlatBonus = artifactStats.hpFlat;
  baseStats.hp = (stats.baseHP * (1 + hpPercentBonus / 100)) + hpFlatBonus;

  // Calculate ATK: ((BASE * (1 + percentage sum of artifacts)) + sum of flat artifact increases) + (BASE * percent weapon increase) + flat weapon increase
  const atkPercentBonus = artifactStats.atkPercent +
    (setEffects.stats.atk || 0);
  const atkFlatBonus = artifactStats.atkFlat;
  baseStats.atk = (stats.baseATK * (1 + atkPercentBonus / 100)) + atkFlatBonus +
    (stats.baseATK * (weaponStats.atkPercent || 0) / 100) +
    (weaponStats.atkFlat || 0);

  // Calculate DEF: (base def * (1 + percentage sum of artifacts)) + flat def rolls
  const defPercentBonus = artifactStats.defPercent +
    (setEffects.stats.def || 0);
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
  baseStats.elementalMastery += setEffects.stats.elementalMastery || 0;
  baseStats.critRate += setEffects.stats.critRate || 0;
  baseStats.critDmg += setEffects.stats.critDmg || 0;
  baseStats.energyRecharge += setEffects.stats.energyRecharge || 0;
  baseStats.healingBonus += setEffects.stats.healingBonus || 0;
  baseStats.elementalDmg += setEffects.stats.elementalDmg || 0;
  baseStats.elementalDmg += setEffects.stats.pyroDmg || 0;
  baseStats.elementalDmg += setEffects.stats.hydroDmg || 0;
  baseStats.elementalDmg += setEffects.stats.electroDmg || 0;
  baseStats.elementalDmg += setEffects.stats.cryoDmg || 0;
  baseStats.elementalDmg += setEffects.stats.anemoDmg || 0;
  baseStats.elementalDmg += setEffects.stats.geoDmg || 0;
  baseStats.elementalDmg += setEffects.stats.dendroDmg || 0;

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
  if (!weaponName) return { atkFlat: 0, atkPercent: 0, passiveStats: {} };

  const charData = ALL_CHARACTERS[char.game]?.[char.name];
  const weaponType = charData?.weapon;

  if (!weaponType) return { atkFlat: 0, atkPercent: 0, passiveStats: {} };

  const weapons = ALL_WEAPONS[char.game]?.[weaponType] || [];
  const weapon = weapons.find((w) => w.name === weaponName);

  if (!weapon) return { atkFlat: 0, atkPercent: 0, passiveStats: {} };

  const weaponStats = {
    atkFlat: weapon.baseATK || 0,
    atkPercent: 0,
    additionalStat: null,
    passiveStats: {}, // Stats from passive effects
  };

  // Handle main stat
  if (weapon.stat && weapon.stat.type && weapon.stat.type !== "none") {
    weaponStats.additionalStat = {
      type: weapon.stat.type,
      value: weapon.stat.value,
    };
  }

  // Handle passive effects (to be implemented with new weapon structure)
  // This will be updated when weapons are converted to the new format

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
    const value = artifact.value;

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
  const effects = {
    stats: {}, // Stat increases
    descriptions: [], // Descriptive effects
  };

  const gear = char.gear;
  const set1 = gear.artifactSet1;
  const set2 = gear.artifactSet2;

  const processSetEffect = (setEffect, isFourPiece = false) => {
    if (!setEffect) return;

    switch (setEffect.type) {
      case "stat":
        if (setEffect.stat && setEffect.value) {
          effects.stats[setEffect.stat] = (effects.stats[setEffect.stat] || 0) +
            setEffect.value;
        }
        if (setEffect.description && isFourPiece) {
          effects.descriptions.push(setEffect.description);
        }
        break;

      case "description":
        if (setEffect.description && isFourPiece) {
          effects.descriptions.push(setEffect.description);
        }
        break;

      case "mixed":
        if (setEffect.stat && setEffect.value) {
          effects.stats[setEffect.stat] = (effects.stats[setEffect.stat] || 0) +
            setEffect.value;
        }
        if (setEffect.description && isFourPiece) {
          effects.descriptions.push(setEffect.description);
        }
        break;

      default:
        // Legacy support for old format
        Object.keys(setEffect).forEach((stat) => {
          if (stat !== "type" && stat !== "description" && stat !== "stat") {
            effects.stats[stat] = (effects.stats[stat] || 0) + setEffect[stat];
          }
        });
        break;
    }
  };

  // Process first 2-piece effect
  if (set1 && ARTIFACT_SETS[char.game]?.[set1]) {
    const set1Effect = ARTIFACT_SETS[char.game][set1]["2pc"];
    processSetEffect(set1Effect, false);
  }

  // Process second 2-piece effect
  if (set2 && ARTIFACT_SETS[char.game]?.[set2]) {
    const set2Effect = ARTIFACT_SETS[char.game][set2]["2pc"];
    processSetEffect(set2Effect, false);
  }

  // Process 4-piece effect only if both sets are the same
  if (set1 && set2 && set1 === set2) {
    const fourPiece = ARTIFACT_SETS[char.game][set1]["4pc"];
    processSetEffect(fourPiece, true);
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
    const newSet = select.value;

    if (setNumber === 1) {
      char.gear.artifactSet1 = newSet;
    } else {
      char.gear.artifactSet2 = newSet;
    }

    // Update artifact rarities based on set combinations
    updateArtifactRarities(char);

    saveMyCharacters();
    renderCharacterGear(char);
  }
};

window.updateArtifactRarity = (charId, slot) => {
  const char = getCharacterById(charId);
  const select = document.querySelector(
    `select[onchange="updateArtifactRarity('${charId}', '${slot}')"]`,
  );

  if (select && !isArtifactRarityLocked(char, slot)) {
    const newRarity = select.value;
    char.gear.artifacts[slot].rarity = newRarity;

    // Update the artifact value based on new rarity
    const currentMainStat = char.gear.artifacts[slot].mainStat;
    char.gear.artifacts[slot].value = getArtifactMainStatValue(
      currentMainStat,
      newRarity,
    );

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
    const newMainStat = select.value;
    const currentRarity = char.gear.artifacts[slot].rarity;

    char.gear.artifacts[slot].mainStat = newMainStat;
    char.gear.artifacts[slot].value = getArtifactMainStatValue(
      newMainStat,
      currentRarity,
    );

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
