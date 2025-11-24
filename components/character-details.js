// /components/character-details.js

// todo list:
// - edit the character details so it can be updated

// Import the data you need
import { GAME_LIMITS } from "../data/game-limits.js";
import { getCharacterById, saveMyCharacters } from "../saved/my-characters.js";
import { loadMaterialsInventory } from "../saved/materials-inventory.js";
import { ALL_CHARACTERS } from "../data/all-characters.js";
import { ALL_WEAPONS } from "../data/all-weapons.js";
import { ASCENSION_MATERIALS } from "../data/ascension-mats.js";
import { initCharacterGearScene } from "../saved/character-gear.js";
import {
  calculateCharacterAscensionMaterials,
  calculateTalentMaterials,
  getMaterialInfo,
} from "../components/character-calculations.js";
import {
  calculateDaysOfResin,
  calculateResinRegenerationTime,
  calculateResinRequirements,
  formatTimeMinutes,
} from "./resin-calculations.js";

// Map short game keys to full names
function getFullGameName(gameKey) {
  const names = {
    genshin: "Genshin Impact",
    hsr: "Honkai Star Rail",
    zzz: "Zenless Zone Zero",
  };
  return names[gameKey] || gameKey;
}

// Helper functions
function getGearType(game) {
  const gearTypes = {
    genshin: "Artifacts",
    hsr: "Relics",
    zzz: "Discs",
  };
  return gearTypes[game] || "Gear";
}

function getTalentName(game, index) {
  const talentNames = {
    genshin: ["Normal Attack", "Elemental Skill", "Elemental Burst"],
    hsr: ["Basic Attack", "Skill", "Ultimate", "Talent"],
    zzz: ["Basic Attack", "Dodge", "Assist", "Special Attack", "Chain Attack"],
  };
  return talentNames[game]?.[index] || `Talent ${index + 1}`;
}

function getTalentDisplayName(char, index) {
  const charData = ALL_CHARACTERS[char.game]?.[char.name];

  // Check for custom talent names in character data
  const customNames = {
    genshin: {
      0: charData?.normal, // Normal Attack
      1: charData?.skill, // Elemental Skill
      2: charData?.burst, // Elemental Burst
    },
    hsr: {
      0: charData?.basic, // Basic Attack
      1: charData?.skill, // Skill
      2: charData?.ultimate, // Ultimate
      3: charData?.talent, // Talent
    },
    zzz: {
      0: charData?.basic, // Basic Attack
      1: charData?.dodge, // Dodge
      2: charData?.assist, // Assist
      3: charData?.special, // Special Attack
      4: charData?.chain, // Chain Attack
    },
  };

  // Get custom name if available
  const customName = customNames[char.game]?.[index];
  if (customName) {
    return customName;
  }

  // Fallback to default names
  return getTalentName(char.game, index);
}

function isCharacterMaxed(char, limits) {
  const isCharMaxed = char.currentLevel >= (limits.maxCharLevel || 90);
  const isWeaponMaxed =
    char.currentWeaponLevel >= (limits.maxWeaponLevel || 90);

  let areTalentsMaxed = true;
  if (Array.isArray(char.talentsCurrent)) {
    areTalentsMaxed = char.talentsCurrent.every((talent) =>
      talent >= (limits.maxTalent || 10)
    );
  }

  return isCharMaxed && isWeaponMaxed && areTalentsMaxed;
}

function isTalentMaxed(char, talentIndex, limits) {
  if (!Array.isArray(char.talentsCurrent)) return false;
  return char.talentsCurrent[talentIndex] >= (limits.maxTalent || 10);
}

function getMilestoneOptions(game) {
  const gameMilestones = {
    genshin: [20, 40, 50, 60, 70, 80, 90],
    hsr: [20, 30, 40, 50, 60, 70, 80],
    zzz: [20, 30, 40, 50, 60],
  };
  return gameMilestones[game] || [20, 40, 50, 60, 70, 80, 90];
}

function calculateOverallProgress(char, limits) {
  let totalWeight = 0;
  let completedWeight = 0;

  // Character Level (30% weight)
  const charMax = char.goalLevel || limits.maxCharLevel;
  const charProgress = char.currentLevel >= charMax
    ? 100
    : ((char.currentLevel || 1) / charMax) * 100;
  totalWeight += 30;
  completedWeight += charProgress * 0.3;

  // Weapon Level (25% weight)
  const weaponMax = char.goalWeaponLevel || limits.maxWeaponLevel;
  const weaponProgress = char.currentWeaponLevel >= weaponMax
    ? 100
    : ((char.currentWeaponLevel || 1) / weaponMax) * 100;
  totalWeight += 25;
  completedWeight += weaponProgress * 0.25;

  // Talents (35% weight)
  if (Array.isArray(char.talentsGoal)) {
    const talentWeight = 35 / char.talentsGoal.length;
    char.talentsGoal.forEach((goal, i) => {
      const current = char.talentsCurrent?.[i] || 1;
      const talentProgress = current >= goal ? 100 : (current / goal) * 100;
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

function getFuelName(game) {
  const fuelNames = {
    genshin: "Resin",
    hsr: "Trailblaze Power",
    zzz: "Battery Charge",
  };
  return fuelNames[game] || "Fuel";
}

function getWeaponImage(char) {
  if (!char.weaponName) return "";

  const charData = ALL_CHARACTERS[char.game]?.[char.name];
  const weaponType = charData?.weapon;

  if (!weaponType) return "";

  const weapons = ALL_WEAPONS[char.game]?.[weaponType] || [];
  const weapon = weapons.find((w) => w.name === char.weaponName);

  if (weapon && weapon.image) {
    return weapon.image;
  }

  // Fallback image path
  return `/assets/${char.game}/weapons/${char.weaponName}.webp`;
}

function getRarityColor(char) {
  if (!char.weaponName) return "#95a5a6";

  const charData = ALL_CHARACTERS[char.game]?.[char.name];
  const weaponType = charData?.weapon;

  if (!weaponType) return "#95a5a6";

  const weapons = ALL_WEAPONS[char.game]?.[weaponType] || [];
  const weapon = weapons.find((w) => w.name === char.weaponName);

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

function getWeaponRarity(char) {
  if (!char.weaponName) return "";

  const charData = ALL_CHARACTERS[char.game]?.[char.name];
  const weaponType = charData?.weapon;

  if (!weaponType) return "";

  const weapons = ALL_WEAPONS[char.game]?.[weaponType] || [];
  const weapon = weapons.find((w) => w.name === char.weaponName);

  if (!weapon) return "";

  const rarity = weapon.rarity || weapon.rarity;
  return rarity ? `${rarity}★` : "";
}

// Define AND export the function
export function renderCharacterDetail(char) {
  const limits = GAME_LIMITS[char.game];
  const weaponLabel = limits?.weaponLabel || "Item";
  const fullGameName = getFullGameName(char.game);
  const gearType = getGearType(char.game);

  // Get character data for icon and picture
  const charData = ALL_CHARACTERS[char.game]?.[char.name];

  // Use custom image, character picture, or placeholder
  let currentPicture = char.imageUrl || charData?.picture;

  // Calculate progress
  const totalProgress = calculateOverallProgress(char, limits);

  // Calculate fuel and time estimates based on resin requirements
  const fuelEstimate = calculateFuelEstimate(char);
  const timeEstimate = calculateTimeEstimate(char);

  // Get milestone options based on game
  const milestones = getMilestoneOptions(char.game);

  window.openModal?.(`
  <div style="display: flex; flex-direction: column; max-height: 95vh; width: 100%;">
    <!-- Scrollable Content Area -->
    <div style="flex: 1; overflow-y: auto; padding: 20px;">
      <div style="text-align: left; font-size: 14px; line-height: 1.5; color: white; max-width: 1200px;">
        
        <!-- Header: Character Name & Progress Bar -->
        <div style="margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <h2 style="margin: 0; color: #00ffff; font-size: 28px;">${
    char.name || "Unknown"
  }</h2>
            <span style="background: #1c3b5a; padding: 8px 16px; border-radius: 20px; font-size: 16px; font-weight: bold;">
              ${fullGameName}
            </span>
          </div>
          <!-- Progress Tracking Bar - Now shows progress towards FINAL goals, not new level -->
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
          
          <!-- Left Column: Character Info -->
          <div>
            <!-- Character Image -->
            <div style="background: #1c2b33; padding: 25px; border-radius: 16px; text-align: center; margin-bottom: 20px; border: 2px solid #00ffff44;">
              <div id="character-image-container" style="width: 220px; height: 300px; margin: 0 auto; background: #2c3e50; border-radius: 12px; overflow: hidden; border: 2px solid #00ffff44;">
                <img src="${currentPicture}" alt="${char.name}" 
                     style="width: 100%; height: 100%; object-fit: cover;">
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
              <div style="display: flex; align-items: center; gap: 12px; margin-top: 12px; margin-bottom: 15px;">
                ${
    char.weaponName
      ? `
                  <img src="${getWeaponImage(char)}" alt="${char.weaponName}" 
                      style="width: 48px; height: 48px; border-radius: 6px; object-fit: cover; border: 2px solid ${
        getRarityColor(char)
      };">
                  <div style="flex: 1;">
                    <div style="color: #00ffff; font-weight: bold; font-size: 14px;">${char.weaponName}</div>
                    <div style="color: #ccc; font-size: 12px;">${
        getWeaponRarity(char)
      }</div>
                  </div>
                `
      : `
                  <div style="width: 48px; height: 48px; border-radius: 6px; background: #2c3e50; display: flex; align-items: center; justify-content: center; border: 2px dashed #ccc;">
                    <span style="color: #ccc; font-size: 20px;">?</span>
                  </div>
                  <div style="color: #ccc; font-size: 14px;">No weapon selected</div>
                `
  }
              </div>
              <button onclick="window.openWeaponSelector('${char.id}')" 
                      style="padding: 12px 16px; background: #9b59b6; color: white; border: none; border-radius: 8px; font-size: 14px; cursor: pointer; width: 100%; font-weight: bold;">
                Change ${weaponLabel}
              </button>
            </div>
          </div>

          <!-- Right Column: Progress Tracking -->
          <div style="background: #1c2b33; padding: 25px; border-radius: 16px; border: 2px solid #00ffff44;">
            <h4 style="margin: 0 0 20px 0; color: #00ffff; font-size: 22px;">Upgrade Progress</h4>
            
            <!-- Character Level -->
            <div style="margin-bottom: 20px; background: #2c3e50; padding: 20px; border-radius: 12px; ${
    char.currentLevel >= limits.maxCharLevel ? "border: 2px solid #27ae60;" : ""
  }">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <strong style="font-size: 16px; ${
    char.currentLevel >= limits.maxCharLevel ? "color: #27ae60;" : ""
  }">
                  Character Level ${
    char.currentLevel >= limits.maxCharLevel ? "★" : ""
  }
                </strong>
                <div style="display: flex; align-items: center; gap: 12px;">
                  <span style="font-size: 16px; color: #ccc; font-weight: bold;">${
    char.currentLevel || 1
  }</span>
                  ${
    char.currentLevel >= limits.maxCharLevel
      ? '<span style="font-size: 14px; color: #27ae60; font-weight: bold;">MAX</span>'
      : `
                        <span style="font-size: 18px;">→</span>
                        <input type="number" 
                               id="char-new-level" 
                               value="${
        char.newLevel || char.currentLevel + 1
      }" 
                               min="${char.currentLevel || 1}" 
                               max="${limits.maxCharLevel}"
                               style="width: 80px; padding: 8px; background: #1c2b33; border: 2px solid #00ffff; border-radius: 6px; color: white; text-align: center; font-size: 16px; font-weight: bold;">
                      `
  }
                </div>
              </div>
              ${
    char.currentLevel >= limits.maxCharLevel
      ? '<div style="font-size: 12px; color: #27ae60; text-align: center;">Character is at maximum level!</div>'
      : ""
  }
            </div>

            <!-- Weapon Level -->
            <div style="margin-bottom: 20px; background: #2c3e50; padding: 20px; border-radius: 12px; ${
    char.currentWeaponLevel >= limits.maxWeaponLevel
      ? "border: 2px solid #27ae60;"
      : ""
  }">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <strong style="font-size: 16px; ${
    char.currentWeaponLevel >= limits.maxWeaponLevel ? "color: #27ae60;" : ""
  }">
                  ${weaponLabel} Level ${
    char.currentWeaponLevel >= limits.maxWeaponLevel ? "★" : ""
  }
                </strong>
                <div style="display: flex; align-items: center; gap: 12px;">
                  <span style="font-size: 16px; color: #ccc; font-weight: bold;">${
    char.currentWeaponLevel || 1
  }</span>
                  ${
    char.currentWeaponLevel >= limits.maxWeaponLevel
      ? '<span style="font-size: 14px; color: #27ae60; font-weight: bold;">MAX</span>'
      : `
                        <span style="font-size: 18px;">→</span>
                        <input type="number" 
                               id="weapon-new-level" 
                               value="${
        char.newWeaponLevel || char.currentWeaponLevel + 1
      }" 
                               min="${char.currentWeaponLevel || 1}" 
                               max="${limits.maxWeaponLevel}"
                               style="width: 80px; padding: 8px; background: #1c2b33; border: 2px solid #00ffff; border-radius: 6px; color: white; text-align: center; font-size: 16px; font-weight: bold;">
                      `
  }
                </div>
              </div>
              ${
    char.currentWeaponLevel >= limits.maxWeaponLevel
      ? `<div style="font-size: 12px; color: #27ae60; text-align: center;">${weaponLabel} is at maximum level!</div>`
      : ""
  }
            </div>

            <!-- Talents -->
            <div style="margin-bottom: 20px;">
              <h5 style="margin: 0 0 15px 0; color: #00ffff; font-size: 18px;">Talents</h5>
              ${
    Array.isArray(char.talentsCurrent)
      ? char.talentsCurrent.map((current, i) => {
        const talentName = getTalentDisplayName(char, i);
        const newLevel = char.talentsNew?.[i] || current + 1;
        const isMaxed = isTalentMaxed(char, i, limits);
        const talentGoal = char.talentsGoal?.[i] || limits.maxTalent;

        // If talent is maxed, show static display
        if (isMaxed) {
          return `
                          <div style="background: #2c3e50; padding: 15px; border-radius: 8px; margin-bottom: 12px; border: 2px solid #27ae60;">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                              <div>
                                <strong style="font-size: 14px; color: #27ae60;">${talentName} ★</strong>
                                <div style="font-size: 11px; color: #ccc;">MAX LEVEL</div>
                              </div>
                              <span style="font-size: 16px; color: #27ae60; font-weight: bold;">${current}</span>
                            </div>
                          </div>
                        `;
        }

        // If talent is not maxed, show upgrade interface
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

            <!-- Single Complete Button -->
            ${
    isCharacterMaxed(char, limits)
      ? `
                  <div style="background: #27ae60; padding: 15px 25px; border-radius: 8px; text-align: center; margin-top: 10px;">
                    <div style="font-size: 16px; font-weight: bold; color: white;">🎉 Character Fully Maxed! 🎉</div>
                    <div style="font-size: 12px; color: #d4f8d4; margin-top: 5px;">All levels are at maximum!</div>
                  </div>
                `
      : `
                  <button onclick="window.completeAllUpgrades('${char.id}')" 
                          style="padding: 15px 25px; background: #27ae60; color: white; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; font-weight: bold; width: 100%; margin-top: 10px;">
                    🚀 Complete All Upgrades
                  </button>
                `
  }
          </div>
        </div>

        <!-- Bottom Section: Materials & Resources -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; border-top: 3px solid #00ffff; padding-top: 25px;">
          
          <!-- Left: Materials Needed -->
          <div style="background: #1c2b33; padding: 25px; border-radius: 16px; border: 2px solid #00ffff44;">
            <h4 style="margin: 0 0 20px 0; color: #00ffff; font-size: 20px;">Materials Needed</h4>
            
            <div style="max-height: 400px; overflow-y: auto; text-align: left;">
              ${renderMaterialRequirements(char)}
            </div>

            <!-- Change Goalpost Button -->
            <button onclick="window.setGoalpost('${char.id}')" 
                    style="margin-top: 20px; padding: 12px; background: #f39c12; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; width: 100%; font-size: 14px;">
              🎯 Change Goalpost
            </button>
          </div>

          <!-- Right: Resources & Actions -->
          <div style="background: #1c2b33; padding: 25px; border-radius: 16px; border: 2px solid #00ffff44;">
            <h4 style="margin: 0 0 20px 0; color: #00ffff; font-size: 20px;">Resources & Actions</h4>
            
            <div style="color: #ccc; margin-bottom: 30px;">
              <div style="display: grid; gap: 20px;">
                <!-- Fuel Needed -->
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
                
                <!-- Time Needed -->
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

            <!-- Calculate Artifacts Button -->
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

    <!-- Fixed Close Button at bottom -->
    <div style="flex-shrink: 0; text-align: center; padding: 20px; background: #1c2b33; border-top: 2px solid #00ffff44;">
      <button onclick="window.closeModal?.()" 
              style="padding: 15px 30px; background: #95a5a6; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold;">
        Close
      </button>
    </div>
  </div>
`);
}

// Fixed fuel estimate function
function calculateFuelEstimate(char) {
  // Get character data for material calculations
  const charData = ALL_CHARACTERS[char.game]?.[char.name];
  if (!charData) return "Unknown";

  // Calculate materials needed
  const ascensionMats = calculateCharacterAscensionMaterials(
    charData,
    char.currentLevel || 1,
    char.goalLevel || GAME_LIMITS[char.game]?.maxCharLevel || 90,
  );

  // Calculate talent materials
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

  // Calculate resin requirements
  const resinResults = calculateResinRequirements(
    charData,
    ascensionMats,
    talentMats,
  );

  return `${resinResults.total.minResin}-${resinResults.total.maxResin} ${
    getFuelName(char.game)
  }`;
}

// Fixed time estimate function
function calculateTimeEstimate(char) {
  // If build is complete, show completion message
  const totalProgress = calculateOverallProgress(char, GAME_LIMITS[char.game]);
  if (totalProgress >= 100) return "🎉 Build Complete!";

  // Get character data for material calculations
  const charData = ALL_CHARACTERS[char.game]?.[char.name];
  if (!charData) return "Unknown";

  // Calculate materials needed
  const ascensionMats = calculateCharacterAscensionMaterials(
    charData,
    char.currentLevel || 1,
    char.goalLevel || GAME_LIMITS[char.game]?.maxCharLevel || 90,
  );

  // Calculate talent materials
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
        // Aggregate materials
        talentMat.books.forEach((talentBook) => {
          const existing = talentMats.books.find((b) =>
            b.type === talentBook.type && b.tier === talentBook.tier
          );
          if (existing) existing.count += talentBook.count;
          else talentMats.books.push({ ...talentBook });
        });
      }
    });
  }

  // Calculate resin requirements and use the time estimate
  const resinResults = calculateResinRequirements(
    charData,
    ascensionMats,
    talentMats,
  );

  // Return the time range from resin calculations
  return `${formatTimeMinutes(resinResults.total.minTime)} - ${
    formatTimeMinutes(resinResults.total.maxTime)
  }`;
}

// Add weapon selector function
window.openWeaponSelector = (charId) => {
  const char = getCharacterById(charId);
  const charData = ALL_CHARACTERS[char.game]?.[char.name];
  const weaponType = charData?.weapon || charData?.path || charData?.role;

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
      <h3 style="color: #00ffff; margin-bottom: 20px; font-size: 24px;">Select Weapon</h3>
      
      <div style="margin-bottom: 25px;">
        <strong style="font-size: 16px;">Weapon:</strong><br>
        <select id="weapon-select" style="width: 100%; padding: 12px; background: #2c3e50; border: 2px solid #00ffff; border-radius: 8px; color: white; font-size: 16px; margin-top: 8px;">
          ${weaponOptions}
        </select>
      </div>
      
      <div style="display: flex; gap: 15px; justify-content: center;">
        <button onclick="window.saveWeaponSelection('${charId}')" 
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
    char.weaponName = weaponSelect.options[weaponSelect.selectedIndex]?.text ||
      weaponSelect.value;
    saveMyCharacters();
    console.log(`Weapon updated to: ${char.weaponName}`);
    window.closeModal?.();
    setTimeout(() => renderCharacterDetail(char), 100);
  }
};

// Update the complete function to handle all upgrades
window.completeAllUpgrades = (charId) => {
  const char = getCharacterById(charId);
  const limits = GAME_LIMITS[char.game];
  let updated = false;

  // Character Level (only if not maxed)
  if (char.currentLevel < limits.maxCharLevel) {
    const newCharLevel =
      parseInt(document.getElementById("char-new-level")?.value) ||
      char.currentLevel;
    if (
      newCharLevel > char.currentLevel && newCharLevel <= limits.maxCharLevel
    ) {
      char.currentLevel = newCharLevel;
      updated = true;
    }
  }

  // Weapon Level (only if not maxed)
  if (char.currentWeaponLevel < limits.maxWeaponLevel) {
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
  }

  // Talents (only if not maxed)
  if (Array.isArray(char.talentsCurrent)) {
    char.talentsCurrent.forEach((current, i) => {
      if (current < limits.maxTalent) {
        const newTalentLevel =
          parseInt(document.getElementById(`talent-new-${i}`)?.value) ||
          current;
        if (newTalentLevel > current && newTalentLevel <= limits.maxTalent) {
          char.talentsCurrent[i] = newTalentLevel;
          updated = true;
        }
      }
    });
  }

  if (updated) {
    saveMyCharacters();
    console.log("All upgrades completed!");
    setTimeout(() => renderCharacterDetail(char), 100);
  } else {
    console.log("No valid upgrades to complete!");
  }
};

// Action functions
window.updateCharacterImage = (charId) => {
  const char = getCharacterById(charId);
  const imageUrl = document.getElementById("image-url-input")?.value;
  if (imageUrl) {
    char.imageUrl = imageUrl;
    saveMyCharacters();
    console.log(`Image updated for ${char.name}!`);
    setTimeout(() => renderCharacterDetail(char), 100);
  }
};

window.changeWeapon = (charId) => {
  const char = getCharacterById(charId);
  console.log(`Opening weapon selector for ${char.name}!`);
  window.openWeaponSelector(charId);
};

window.completeUpgrade = (charId, type) => {
  const char = getCharacterById(charId);
  const limits = GAME_LIMITS[char.game];

  if (type === "character") {
    const newLevel =
      parseInt(document.getElementById("char-new-level")?.value) ||
      char.currentLevel + 1;
    if (newLevel > char.currentLevel && newLevel <= limits.maxCharLevel) {
      char.currentLevel = newLevel;
      saveMyCharacters();
      console.log(`Character leveled up to ${newLevel}!`);
      setTimeout(() => renderCharacterDetail(char), 100);
    } else {
      console.log("Invalid level selected!");
    }
  } else if (type === "weapon") {
    const newLevel =
      parseInt(document.getElementById("weapon-new-level")?.value) ||
      char.currentWeaponLevel + 1;
    if (
      newLevel > char.currentWeaponLevel && newLevel <= limits.maxWeaponLevel
    ) {
      char.currentWeaponLevel = newLevel;
      saveMyCharacters();
      console.log(`Weapon leveled up to ${newLevel}!`);
      setTimeout(() => renderCharacterDetail(char), 100);
    } else {
      console.log("Invalid level selected!");
    }
  }
};

window.completeTalentUpgrade = (charId, talentIndex) => {
  const char = getCharacterById(charId);
  const limits = GAME_LIMITS[char.game];
  const current = char.talentsCurrent?.[talentIndex] || 1;
  const newLevel =
    parseInt(document.getElementById(`talent-new-${talentIndex}`)?.value) ||
    current + 1;

  if (newLevel > current && newLevel <= limits.maxTalent) {
    char.talentsCurrent[talentIndex] = newLevel;
    saveMyCharacters();
    const talentName = getTalentDisplayName(char, talentIndex);
    console.log(`${talentName} upgraded to level ${newLevel}!`);
    setTimeout(() => renderCharacterDetail(char), 100);
  } else {
    console.log("Invalid talent level selected!");
  }
};

window.setGoalpost = (charId) => {
  const char = getCharacterById(charId);
  const limits = GAME_LIMITS[char.game];
  const milestones = getMilestoneOptions(char.game);

  // Open goal setting modal
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
        <strong style="font-size: 16px;">Final ${limits.weaponLabel} Level Goal:</strong><br>
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
        const talentName = getTalentDisplayName(char, i);
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
  console.log(`Opening gear calculator for ${char.name}`);

  // Close the character details modal first
  window.closeModal?.();

  // Initialize the gear scene
  setTimeout(() => {
    initCharacterGearScene(charId);
  }, 100);
};

// Add this function to display material requirements
function renderMaterialRequirements(char) {
  // Get the full character data from ALL_CHARACTERS
  const charData = ALL_CHARACTERS[char.game]?.[char.name];
  if (!charData) {
    return '<div style="color: #ccc; text-align: center;">Character data not found</div>';
  }

  const charLevel = char.currentLevel || 1;
  const targetLevel = char.goalLevel || GAME_LIMITS[char.game]?.maxCharLevel ||
    90;

  console.log("=== RENDER MATERIAL REQUIREMENTS ===");
  console.log("Character:", char.name);
  console.log("Current Level:", charLevel);
  console.log("Target Level:", targetLevel);
  console.log("Character Data:", charData);

  // Merge character data with the char object
  const fullCharData = { ...charData, ...char };

  // Calculate ALL materials needed from current level to goal level
  const ascensionMaterials = calculateCharacterAscensionMaterials(
    fullCharData,
    charLevel,
    targetLevel,
  );
  console.log("Ascension Materials:", ascensionMaterials);

  // Also calculate talent materials if talents are set
  let talentMaterials = {
    mora: 0,
    common: [],
    books: [],
    weekly: [],
    crown: 0,
  };
  if (Array.isArray(char.talentsCurrent) && Array.isArray(char.talentsGoal)) {
    console.log("Talents Current:", char.talentsCurrent);
    console.log("Talents Goal:", char.talentsGoal);

    char.talentsCurrent.forEach((currentTalent, i) => {
      const goalTalent = char.talentsGoal[i] || currentTalent;
      if (goalTalent > currentTalent) {
        console.log(
          `Calculating talent ${i} from ${currentTalent} to ${goalTalent}`,
        );
        const talentMat = calculateTalentMaterials(
          fullCharData,
          i,
          currentTalent,
          goalTalent,
        );
        talentMaterials.mora += talentMat.mora;

        // Aggregate talent common materials
        talentMat.common.forEach((talentCommon) => {
          const existing = talentMaterials.common.find((c) =>
            c.type === talentCommon.type && c.tier === talentCommon.tier
          );
          if (existing) {
            existing.count += talentCommon.count;
          } else {
            talentMaterials.common.push({ ...talentCommon });
          }
        });

        // Aggregate talent books
        talentMat.books.forEach((talentBook) => {
          const existing = talentMaterials.books.find((b) =>
            b.type === talentBook.type && b.tier === talentBook.tier
          );
          if (existing) {
            existing.count += talentBook.count;
          } else {
            talentMaterials.books.push({ ...talentBook });
          }
        });

        // Aggregate weekly materials
        talentMat.weekly.forEach((weeklyMat) => {
          const existing = talentMaterials.weekly.find((w) =>
            w.name === weeklyMat.name
          );
          if (existing) {
            existing.count += weeklyMat.count;
          } else {
            talentMaterials.weekly.push({ ...weeklyMat });
          }
        });

        // Add crowns
        if (talentMat.crown) {
          talentMaterials.crown += talentMat.crown;
        }
      }
    });
  }

  console.log("Talent Materials:", talentMaterials);

  // Function to get correct image path
  function getMaterialImagePath(materialName) {
    // Remove any URL encoding and special characters, but keep spaces
    const cleanName = decodeURIComponent(materialName).replace(
      /[^a-zA-Z0-9 ]/g,
      "",
    );
    return `/assets/genshin/${cleanName}.webp`;
  }

  // IMPROVED Function to get material by name with better matching
  function findMaterialByName(materialName) {
    const decodedName = decodeURIComponent(materialName);
    console.log(`Looking for material by name: "${decodedName}"`);

    // Try exact match first
    let material = ASCENSION_MATERIALS[char.game]?.find((m) =>
      m.name === decodedName
    );

    // If not found, try partial match
    if (!material) {
      material = ASCENSION_MATERIALS[char.game]?.find((m) =>
        m.name.includes(decodedName) || decodedName.includes(m.name)
      );
    }

    if (material) {
      console.log(`Found material: ${material.name}`);
      // Fix the image path to use /assets/genshin/
      const fixedImg = material.img.startsWith("/assets/")
        ? material.img
        : `/assets${material.img}`;
      return {
        ...material,
        img: fixedImg,
      };
    }

    console.log(`Material not found: ${decodedName}`);
    // Fallback: create a basic material object
    return {
      name: decodedName,
      img: getMaterialImagePath(decodedName),
    };
  }

  // IMPROVED Function to get material by tags with better gem matching
  function findMaterialByTags(tags) {
    console.log(`Looking for material by tags:`, tags);

    let material = ASCENSION_MATERIALS[char.game]?.find((m) => {
      if (!m.tags) return false;

      // Check if all tag conditions are met
      const matchesAllTags = Object.entries(tags).every(([key, value]) => {
        if (key === "tier") {
          return m.tags[2] === value;
        }
        if (key === "element" && tags.gem) {
          // For gems, check if the material name contains the element
          const elementName = value.charAt(0).toUpperCase() + value.slice(1);
          return m.name.includes(elementName);
        }
        return m.tags.includes(value);
      });

      return matchesAllTags;
    });

    // If not found, try alternative approaches
    if (!material) {
      // Special handling for gems
      if (tags.gem && tags.element && tags.tier) {
        const elementName = tags.element.charAt(0).toUpperCase() +
          tags.element.slice(1);
        const gemTypes = ["Sliver", "Fragment", "Chunk", "Gemstone"];
        const gemType = gemTypes[tags.tier - 2] || gemTypes[0]; // tier 2=Sliver, 3=Fragment, etc.

        let gemName = `${elementName} Agate ${gemType}`;
        if (tags.element === "hydro") gemName = `Varunada Lazurite ${gemType}`;
        if (tags.element === "electro") gemName = `Vajrada Amethyst ${gemType}`;
        if (tags.element === "anemo") gemName = `Vayuda Turquoise ${gemType}`;
        if (tags.element === "cryo") gemName = `Shivada Jade ${gemType}`;
        if (tags.element === "geo") gemName = `Prithiva Topaz ${gemType}`;
        if (tags.element === "dendro") gemName = `Nagadus Emerald ${gemType}`;

        material = ASCENSION_MATERIALS[char.game]?.find((m) =>
          m.name === gemName
        );

        if (!material) {
          // Try partial match
          material = ASCENSION_MATERIALS[char.game]?.find((m) =>
            m.tags?.[0] === "gem" && m.name.includes(elementName) &&
            m.name.includes(gemType)
          );
        }
      }

      // Special handling for common materials
      if (tags.common && tags.type && tags.tier) {
        material = ASCENSION_MATERIALS[char.game]?.find((m) =>
          m.tags?.[0] === "common" &&
          m.tags?.[1] === tags.type &&
          m.tags?.[2] === tags.tier
        );
      }

      // Special handling for talent books
      if (tags.talent && tags.type && tags.tier) {
        material = ASCENSION_MATERIALS[char.game]?.find((m) =>
          m.tags?.[0] === "talent" &&
          m.tags?.[1] === tags.type &&
          m.tags?.[2] === tags.tier
        );
      }
    }

    if (material) {
      console.log(`Found material by tags: ${material.name}`);
      // Fix the image path to use /assets/genshin/
      const fixedImg = material.img.startsWith("/assets/")
        ? material.img
        : `/assets${material.img}`;
      return {
        ...material,
        img: fixedImg,
      };
    }

    console.log(`Material not found by tags:`, tags);
    // Fallback: create a basic material object
    const fallbackName = Object.values(tags).filter((v) =>
      typeof v === "string"
    ).join(" ");
    return {
      name: fallbackName,
      img: getMaterialImagePath(fallbackName),
    };
  }

  // Create a SIMPLE combined list of ALL materials
  const materialMap = new Map();

  // Add Crown of Insight
  if (talentMaterials.crown > 0) {
    const crownMaterial = findMaterialByName("Crown of Insight");
    const key = `CROWN_INSIGHT`;
    materialMap.set(key, {
      material: crownMaterial,
      count: talentMaterials.crown,
      type: "crown",
    });
    console.log(`Added Crown of Insight: ${talentMaterials.crown}`);
  }

  // Add Mora - FIXED: Only add once
  const totalMora = ascensionMaterials.mora + talentMaterials.mora;
  if (totalMora > 0) {
    const moraMaterial = findMaterialByTags({ currency: true });
    // Use a unique key for mora to prevent duplicates
    materialMap.set("MORA_CURRENCY", {
      material: moraMaterial,
      count: totalMora,
      type: "mora",
    });
  }

  // Add Gems - IMPROVED lookup with better key generation
  console.log("Processing gems:", ascensionMaterials.gems);
  ascensionMaterials.gems.forEach((gemReq) => {
    console.log(`Looking for gem: ${gemReq.element} tier ${gemReq.tier}`);

    const gemMaterial = findMaterialByTags({
      gem: true,
      element: gemReq.element,
      tier: gemReq.tier,
    });

    // Create a unique key for each gem type and tier
    const key = `GEM_${gemReq.element}_${gemReq.tier}`;
    console.log(`Gem key: ${key}, material:`, gemMaterial);

    if (materialMap.has(key)) {
      materialMap.get(key).count += gemReq.count;
    } else {
      materialMap.set(key, {
        material: gemMaterial,
        count: gemReq.count,
        type: "gem",
      });
    }
  });

  // Add Local Specialties
  console.log("Processing local:", ascensionMaterials.local);
  ascensionMaterials.local.forEach((localReq) => {
    const localMaterial = findMaterialByName(localReq.name);
    const key = `LOCAL_${localMaterial.name}`;
    if (materialMap.has(key)) {
      materialMap.get(key).count += localReq.count;
    } else {
      materialMap.set(key, {
        material: localMaterial,
        count: localReq.count,
        type: "local",
      });
    }
  });

  // Add Common Materials - IMPROVED with better key generation
  console.log("Processing common ascension:", ascensionMaterials.common);
  console.log("Processing common talent:", talentMaterials.common);

  [...ascensionMaterials.common, ...talentMaterials.common].forEach(
    (commonReq) => {
      console.log(
        `Looking for common: ${commonReq.type} tier ${commonReq.tier}`,
      );

      const commonMaterial = findMaterialByTags({
        common: true,
        type: commonReq.type,
        tier: commonReq.tier,
      });

      // Create a unique key for each common type and tier
      const key = `COMMON_${commonReq.type}_${commonReq.tier}`;
      console.log(`Common key: ${key}, material:`, commonMaterial);

      if (materialMap.has(key)) {
        materialMap.get(key).count += commonReq.count;
      } else {
        materialMap.set(key, {
          material: commonMaterial,
          count: commonReq.count,
          type: "common",
        });
      }
    },
  );

  // Add Boss Materials
  console.log("Processing boss:", ascensionMaterials.boss);
  ascensionMaterials.boss.forEach((bossReq) => {
    const bossMaterial = findMaterialByName(bossReq.name);
    const key = `BOSS_${bossMaterial.name}`;
    if (materialMap.has(key)) {
      materialMap.get(key).count += bossReq.count;
    } else {
      materialMap.set(key, {
        material: bossMaterial,
        count: bossReq.count,
        type: "boss",
      });
    }
  });

  // Add Talent Books - IMPROVED with better key generation
  console.log("Processing books:", talentMaterials.books);
  talentMaterials.books.forEach((bookReq) => {
    console.log(`Looking for book: ${bookReq.type} tier ${bookReq.tier}`);

    const bookMaterial = findMaterialByTags({
      talent: true,
      type: bookReq.type,
      tier: bookReq.tier,
    });

    // Create a unique key for each book type and tier
    const key = `BOOK_${bookReq.type}_${bookReq.tier}`;
    console.log(`Book key: ${key}, material:`, bookMaterial);

    if (materialMap.has(key)) {
      materialMap.get(key).count += bookReq.count;
    } else {
      materialMap.set(key, {
        material: bookMaterial,
        count: bookReq.count,
        type: "book",
      });
    }
  });

  // Add Weekly Boss Materials
  console.log("Processing weekly:", talentMaterials.weekly);
  talentMaterials.weekly.forEach((weeklyReq) => {
    const weeklyMaterial = findMaterialByName(weeklyReq.name);
    const key = `WEEKLY_${weeklyMaterial.name}`;
    if (materialMap.has(key)) {
      materialMap.get(key).count += weeklyReq.count;
    } else {
      materialMap.set(key, {
        material: weeklyMaterial,
        count: weeklyReq.count,
        type: "weekly",
      });
    }
  });

  // Convert map to array
  const allMaterials = Array.from(materialMap.values());
  console.log("Final materials to display:", allMaterials);

  // If no materials needed, show message
  if (allMaterials.length === 0) {
    return '<div style="color: #ccc; text-align: center; padding: 20px;">No materials required to reach goal</div>';
  }

  // Simple flexbox layout
  let materialsHTML = `
    <div style="
      display: flex; 
      flex-wrap: wrap; 
      gap: 12px; 
      justify-content: center;
      align-items: flex-start;
    ">
  `;

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

  allMaterials.forEach((item) => {
    const borderColor = borderColors[item.type] || "#95a5a6";

    materialsHTML += `
      <div style="
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 70px;
      ">
        <!-- Image with count badge -->
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
            onerror="this.src='/assets/genshin/mora.webp'; this.onerror=null;"
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
            ${
      item.count > 999 ? Math.floor(item.count / 1000) + "k" : item.count
    }
          </div>
        </div>
        
        <!-- Material name -->
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

// Add this function to update materials when level change
function setupLevelChangeListeners(charId) {
  const char = getCharacterById(charId); // Add this line to get the character
  const charLevelInput = document.getElementById("char-new-level");
  if (charLevelInput) {
    charLevelInput.addEventListener("change", () => {
      const char = getCharacterById(charId);
      setTimeout(() => renderCharacterDetail(char), 100);
    });
  }

  // Also listen for talent level changes
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

setTimeout(() => setupLevelChangeListeners(char.id), 100);
window.renderCharacterDetail = renderCharacterDetail;
