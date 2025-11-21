// /components/character-details.js

// todo list:
// - edit the character details so it can be updated

// Import the data you need

import { GAME_LIMITS } from "../data/game-limits.js";
import { getCharacterById, saveMyCharacters } from "../saved/my-characters.js";
import { loadMaterialsInventory } from "../saved/materials-inventory.js";

// Map short game keys to full names
function getFullGameName(gameKey) {
  const names = {
    genshin: "Genshin Impact",
    hsr: "Honkai Star Rail",
    zzz: "Zenless Zone Zero",
  };
  return names[gameKey] || gameKey;
}

// Define AND export the function
export function renderCharacterDetail(char) {
  const limits = GAME_LIMITS[char.game];
  const weaponLabel = limits?.weaponLabel || "Item";
  const fullGameName = getFullGameName(char.game);
  const gearType = getGearType(char.game);

  // Safety checks
  if (!char) {
    console.error("No character data provided!");
    return;
  }

  // Calculate progress - FIXED: uses current level against final goals
  const totalProgress = calculateOverallProgress(char, limits);
  const timeEstimate = calculateTimeEstimate(char, totalProgress);
  const fuelEstimate = calculateFuelEstimate(char);

  // Get milestone options based on game
  const milestones = getMilestoneOptions(char.game);

  window.openModal?.(`
    <div style="text-align: left; font-size: 14px; line-height: 1.5; color: white; max-width: 800px; max-height: 90vh; overflow-y: auto;">
      
      <!-- Header: Character Name & Progress Bar -->
      <div style="margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <h2 style="margin: 0; color: #00ffff;">${char.name || "Unknown"}</h2>
          <span style="background: #1c3b5a; padding: 4px 12px; border-radius: 16px; font-size: 14px; font-weight: bold;">
            ${fullGameName}
          </span>
        </div>
        <!-- Progress Tracking Bar - Now shows progress towards FINAL goals, not new level -->
        <div style="background: #1c2b33; padding: 15px; border-radius: 8px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <strong>Progress Tracking (towards final goals)</strong>
            <span>${totalProgress}%</span>
          </div>
          <div style="width: 100%; height: 20px; background: #2c3e50; border-radius: 10px; overflow: hidden;">
            <div style="width: ${totalProgress}%; height: 100%; background: linear-gradient(90deg, #00ffff, #3498db); transition: width 0.3s;"></div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div style="display: grid; grid-template-columns: 250px 1fr; gap: 20px; margin-bottom: 20px;">
        
        <!-- Left Column: Character Info -->
        <div>
          <!-- Character Image -->
          <div style="background: #1c2b33; padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 15px;">
            <div id="character-image-container" style="width: 180px; height: 250px; margin: 0 auto; background: #2c3e50; border-radius: 8px; display: flex; align-items: center; justify-content: center; border: 2px dashed #00ffff44;">
              ${
    char.imageUrl
      ? `<img src="${char.imageUrl}" alt="${char.name}" style="max-width: 100%; max-height: 100%; border-radius: 6px;" />`
      : `<span style="color: #00ffff; font-size: 48px;">👤</span>`
  }
            </div>
            <div style="margin-top: 10px;">
              <input type="text" id="image-url-input" placeholder="Paste image URL here" 
                     value="${char.imageUrl || ""}" 
                     style="width: 100%; padding: 8px; background: #2c3e50; border: 1px solid #00ffff; border-radius: 4px; color: white; font-size: 12px;" />
              <button onclick="window.updateCharacterImage('${char.id}')" 
                      style="margin-top: 8px; padding: 6px 12px; background: #3498db; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer; width: 100%;">
                  Update Image
              </button>
            </div>
          </div>

          <!-- Weapon Info -->
          <div style="background: #1c2b33; padding: 15px; border-radius: 8px;">
            <strong>${weaponLabel}:</strong>
            <div style="margin-top: 8px; color: #ccc; font-size: 12px;">
              ${char.weaponName || "No weapon selected"}
            </div>
            <button onclick="window.changeWeapon('${char.id}')" 
                    style="margin-top: 8px; padding: 8px 12px; background: #9b59b6; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer; width: 100%;">
              Change ${weaponLabel}
            </button>
          </div>
        </div>

        <!-- Right Column: Progress Tracking -->
        <div style="background: #1c2b33; padding: 20px; border-radius: 12px;">
          <!-- Character Level -->
          <div style="margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <strong>Character Level</strong>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 12px; color: #ccc;">${
    char.currentLevel || 1
  }</span>
                <span>→</span>
                <input type="number" 
                       id="char-new-level" 
                       value="${char.newLevel || char.currentLevel + 1}" 
                       min="${char.currentLevel || 1}" 
                       max="${limits.maxCharLevel}"
                       style="width: 60px; padding: 4px; background: #2c3e50; border: 1px solid #00ffff; border-radius: 4px; color: white; text-align: center; font-size: 12px;">
              </div>
            </div>
            <button onclick="window.completeUpgrade('${char.id}', 'character')" 
                    style="padding: 10px 16px; background: #2ecc71; color: white; border: none; border-radius: 6px; font-size: 14px; cursor: pointer; width: 100%;">
              Complete
            </button>
          </div>

          <!-- Weapon Level -->
          <div style="margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <strong>${weaponLabel} Level</strong>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 12px; color: #ccc;">${
    char.currentWeaponLevel || 1
  }</span>
                <span>→</span>
                <input type="number" 
                       id="weapon-new-level" 
                       value="${
    char.newWeaponLevel || char.currentWeaponLevel + 1
  }" 
                       min="${char.currentWeaponLevel || 1}" 
                       max="${limits.maxWeaponLevel}"
                       style="width: 60px; padding: 4px; background: #2c3e50; border: 1px solid #00ffff; border-radius: 4px; color: white; text-align: center; font-size: 12px;">
              </div>
            </div>
            <button onclick="window.completeUpgrade('${char.id}', 'weapon')" 
                    style="padding: 10px 16px; background: #2ecc71; color: white; border: none; border-radius: 6px; font-size: 14px; cursor: pointer; width: 100%;">
              Complete
            </button>
          </div>

          <!-- Talents -->
          <div>
            ${
    Array.isArray(char.talentsCurrent)
      ? char.talentsCurrent.map((current, i) => {
        const talentName = getTalentName(char.game, i);
        const newLevel = char.talentsNew?.[i] || current + 1;

        return `
                      <div style="margin-bottom: 12px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                          <strong>${talentName}</strong>
                          <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 12px; color: #ccc;">${current}</span>
                            <span>→</span>
                            <input type="number" 
                                   id="talent-new-${i}" 
                                   value="${newLevel}" 
                                   min="${current}" 
                                   max="${limits.maxTalent}"
                                   style="width: 60px; padding: 4px; background: #2c3e50; border: 1px solid #00ffff; border-radius: 4px; color: white; text-align: center; font-size: 12px;">
                          </div>
                        </div>
                        <button onclick="window.completeTalentUpgrade('${char.id}', ${i})" 
                                style="padding: 10px 16px; background: #2ecc71; color: white; border: none; border-radius: 6px; font-size: 14px; cursor: pointer; width: 100%;">
                          Complete
                        </button>
                      </div>
                    `;
      }).join("")
      : '<div style="color: #ccc; text-align: center;">No talents set</div>'
  }
          </div>
        </div>
      </div>

      <!-- Bottom Section: Timeline & Gear -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; border-top: 2px solid #00ffff; padding-top: 20px;">
        
        <!-- Left: Time & Fuel -->
        <div style="background: #1c2b33; padding: 20px; border-radius: 12px;">
          <h4 style="margin: 0 0 15px 0; color: #00ffff;">Resources</h4>
          
          <div style="display: grid; gap: 15px;">
            <div>
              <strong>⏰ Time Left:</strong><br>
              <span style="color: #ccc; font-size: 12px;">${timeEstimate}</span>
            </div>
            <div>
              <strong>⛽ Fuel Needed:</strong><br>
              <span style="color: #ccc; font-size: 12px;">${fuelEstimate}</span>
            </div>
          </div>

          <!-- Set Goal Button -->
          <button onclick="window.setGoalpost('${char.id}')" 
                  style="margin-top: 20px; padding: 12px; background: #f39c12; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; width: 100%;">
            Change Goalpost?
          </button>
        </div>

        <!-- Right: Start/End Goal & Gear -->
        <div style="background: #1c2b33; padding: 20px; border-radius: 12px;">
          <h4 style="margin: 0 0 15px 0; color: #00ffff;">Build Timeline</h4>
          
          <div style="color: #ccc; margin-bottom: 20px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; text-align: center;">
              <div>
                <strong>Start Goal</strong><br>
                <span style="font-size: 12px;">Today</span>
              </div>
              <div>
                <strong>End Goal</strong><br>
                <span style="font-size: 12px;">${
    calculateEndDate(timeEstimate)
  }</span>
              </div>
            </div>
          </div>

          <!-- Gear Calculator Button -->
          <button onclick="window.openGearCalculator('${char.id}')" 
                  style="padding: 12px; background: #9b59b6; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; width: 100%;">
            Open ${gearType} Calculator
          </button>
        </div>
      </div>

      <!-- Close Button -->
      <div style="text-align: center; margin-top: 20px;">
        <button onclick="window.closeModal?.()" 
                style="padding: 12px 24px; background: #95a5a6; color: white; border: none; border-radius: 6px; cursor: pointer;">
          Close
        </button>
      </div>
    </div>
  `);
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
    genshin: ["Normal Attack", "Skill", "Ultimate"],
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

function calculateOverallProgress(char, limits) {
  let totalWeight = 0;
  let completedWeight = 0;

  // Character Level (30% weight) - FIXED: uses current level vs final goal
  const charMax = char.goalLevel || limits.maxCharLevel;
  const charProgress = ((char.currentLevel || 1) / charMax) * 100;
  totalWeight += 30;
  completedWeight += charProgress * 0.3;

  // Weapon Level (25% weight) - FIXED: uses current level vs final goal
  const weaponMax = char.goalWeaponLevel || limits.maxWeaponLevel;
  const weaponProgress = ((char.currentWeaponLevel || 1) / weaponMax) * 100;
  totalWeight += 25;
  completedWeight += weaponProgress * 0.25;

  // Talents (35% weight) - FIXED: uses current talent levels vs final goals
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

function calculateTimeEstimate(char, progress) {
  if (progress >= 100) return "🎉 Build Complete!";

  const daysRemaining = Math.ceil((100 - progress) / 10);
  if (daysRemaining <= 7) {
    return `${daysRemaining} day${daysRemaining !== 1 ? "s" : ""}`;
  } else if (daysRemaining <= 30) {
    const weeks = Math.ceil(daysRemaining / 7);
    return `${weeks} week${weeks !== 1 ? "s" : ""}`;
  } else {
    const months = Math.ceil(daysRemaining / 30);
    return `${months} month${months !== 1 ? "s" : ""}`;
  }
}

function calculateFuelEstimate(char) {
  // Simple fuel/resin estimation - FIXED: uses current levels vs final goals
  const baseFuel = 1000;
  const levelFuel = ((char.goalLevel || 90) - (char.currentLevel || 1)) * 50;
  const talentFuel = Array.isArray(char.talentsGoal)
    ? char.talentsGoal.reduce((sum, goal, i) => {
      const current = char.talentsCurrent?.[i] || 1;
      return sum + ((goal - current) * 20);
    }, 0)
    : 0;

  const totalFuel = baseFuel + levelFuel + talentFuel;
  return `${totalFuel} ${getFuelName(char.game)}`;
}

function getFuelName(game) {
  const fuelNames = {
    genshin: "Resin",
    hsr: "Trailblaze Power",
    zzz: "Battery Charge",
  };
  return fuelNames[game] || "Fuel";
}

function calculateEndDate(timeEstimate) {
  const today = new Date();
  const endDate = new Date(today);

  if (timeEstimate.includes("day")) {
    const days = parseInt(timeEstimate);
    endDate.setDate(today.getDate() + days);
  } else if (timeEstimate.includes("week")) {
    const weeks = parseInt(timeEstimate);
    endDate.setDate(today.getDate() + (weeks * 7));
  } else if (timeEstimate.includes("month")) {
    const months = parseInt(timeEstimate);
    endDate.setMonth(today.getMonth() + months);
  } else {
    endDate.setDate(today.getDate() + 7);
  }

  return endDate.toLocaleDateString();
}

// Action functions
window.updateCharacterImage = (charId) => {
  const char = getCharacterById(charId);
  const imageUrl = document.getElementById("image-url-input")?.value;
  if (imageUrl) {
    char.imageUrl = imageUrl;
    saveMyCharacters();
    console.log(`Image updated for ${char.name}!`);
  }
};

window.changeWeapon = (charId) => {
  const char = getCharacterById(charId);
  console.log(`Opening weapon selector for ${char.name}!`);
  // Implementation would open weapon selection modal
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
    const talentName = getTalentName(char.game, talentIndex);
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
    <div style="text-align: left; color: white; max-width: 500px;">
      <h3 style="color: #00ffff; margin-bottom: 20px;">Set Final Goal - ${char.name}</h3>
      
      <div style="margin-bottom: 20px;">
        <strong>Final Character Level Goal:</strong><br>
        <select id="final-char-goal" 
                style="width: 140px; padding: 10px; background: #2c3e50; border: 1px solid #00ffff; border-radius: 6px; color: white; font-size: 14px;">
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
        <strong>Final ${limits.weaponLabel} Level Goal:</strong><br>
        <select id="final-weapon-goal" 
                style="width: 140px; padding: 10px; background: #2c3e50; border: 1px solid #00ffff; border-radius: 6px; color: white; font-size: 14px;">
          ${
    milestones.map((milestone) =>
      `<option value="${milestone}" ${
        char.goalWeaponLevel === milestone ? "selected" : ""
      }>${milestone}</option>`
    ).join("")
  }
        </select>
      </div>
      
      <div style="margin-bottom: 25px;">
        <strong>Final Talent Goals:</strong><br>
        ${
    Array.isArray(char.talentsCurrent)
      ? char.talentsCurrent.map((current, i) => {
        const talentName = getTalentName(char.game, i);
        return `
                  <div style="margin-top: 10px; display: flex; justify-content: between; align-items: center;">
                    <label style="font-size: 13px;">${talentName}:</label>
                    <select id="final-talent-${i}" 
                            style="width: 100px; padding: 8px; background: #2c3e50; border: 1px solid #00ffff; border-radius: 4px; color: white; font-size: 12px;">
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
      
      <div style="display: flex; gap: 10px; justify-content: center;">
        <button onclick="window.saveFinalGoals('${charId}')" 
                style="padding: 12px 24px; background: #2ecc71; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
          Save Final Goals
        </button>
        <button onclick="window.closeModal?.()" 
                style="padding: 12px 24px; background: #95a5a6; color: white; border: none; border-radius: 6px; cursor: pointer;">
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
  console.log(
    `Opening ${gearType} calculator for ${char.name}! This would go to /saved/gear.js`,
  );
  // Implementation would navigate to gear calculator page
};
