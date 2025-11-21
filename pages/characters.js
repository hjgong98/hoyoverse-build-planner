// /pages/characters.js

// todo list:
// - edit custom character so that it asks what kind of mats
// - edit set build goal so that it lets me select a weapon from a list
// - edit set build goal so that it shows talents names of a specific character
// - add custom character weapon type

import { addCharacter, loadMyCharacters } from "../saved/my-characters.js";
import { renderCharacterDetail } from "../components/character-details.js";
import { ALL_CHARACTERS } from "../data/all-characters.js";
import { GAME_LIMITS } from "../data/game-limits.js";
import { ASCENSION_MATERIALS } from "../data/ascension-mats.js";
import { ALL_WEAPONS } from "../data/all-weapons.js";

let myCharacters = loadMyCharacters();

// Map short keys to full game names
function getFullGameName(gameKey) {
  const names = {
    genshin: "Genshin Impact",
    hsr: "Honkai Star Rail",
    zzz: "Zenless Zone Zero",
  };
  return names[gameKey] || gameKey;
}

// Initialize the Characters Page
export function initCharactersScene() {
  renderCharacterList();
}

// Triggered from + button
window.openAddCharacterModal = () => {
  window.openModal?.(`
    <h3>Add Character</h3>
    <p><strong>Select Game:</strong></p>
    <select id="select-game">
      <option value="genshin">Genshin Impact</option>
      <option value="hsr">Honkai Star Rail</option>
      <option value="zzz">Zenless Zone Zero</option>
    </select>
    <br><br>
    <button onclick="window.handleGameSelection()">Next →</button>
    <button onclick="window.closeModal?.()">Cancel</button>
  `);
};

// Render the character list
function renderCharacterList() {
  const content = document.getElementById("page-content");
  if (!content) return;

  if (myCharacters.length === 0) {
    content.innerHTML = `
      <h2>Characters</h2>
      <div class="char-grid" id="char-list">
        <div class="char-box add-new" onclick="window.openAddCharacterModal?.()">+</div>
      </div>
    `;
    return;
  }

  content.innerHTML = `
    <h2>Characters in Progress</h2>
    <div class="char-grid" id="char-list"></div>
  `;

  const list = document.getElementById("char-list");
  myCharacters.forEach((char) => {
    const box = document.createElement("div");
    box.className = "char-box";
    box.textContent = char.name;
    box.title = `${char.name} (${
      getFullGameName(char.game)
    }) → Lv.${char.currentLevel} → ${char.goalLevel}`;
    box.onclick = () => renderCharacterDetail(char);
    list.appendChild(box);
  });

  // Add "+" button
  const addBox = document.createElement("div");
  addBox.className = "char-box add-new";
  addBox.textContent = "+";
  addBox.onclick = () => window.openAddCharacterModal?.();
  list.appendChild(addBox);
}

// Step 2: After game selected → show character list + custom
window.handleGameSelection = () => {
  const game = document.getElementById("select-game")?.value;
  const fullName = getFullGameName(game);

  const charactersObj = ALL_CHARACTERS[game] || {};
  const characterNames = Object.keys(charactersObj);

  window.openModal?.(`
    <h3>Select Character</h3>
    <p>Game: <strong>${fullName}</strong></p>
    <p><strong>Pick a character:</strong></p>
    <select id="select-character">
      ${
    characterNames.map((name) => `<option value="${name}">${name}</option>`)
      .join("")
  }
      <option value="custom">🔧 Custom Character</option>
    </select>
    <br><br>
    <button onclick="window.handleCharacterSelection('${game}')">Next →</button>
    <button onclick="window.closeModal?.()">Cancel</button>
  `);
};

// Step 3: Handle selected or custom
window.handleCharacterSelection = (game) => {
  const name = document.getElementById("select-character")?.value;
  if (name === "custom") {
    window.openCustomCharacterModal(game);
  } else {
    window.setGoalForCharacter(name, game, []);
  }
};

// Custom Character Modal
window.openCustomCharacterModal = (game) => {
  const fullName = getFullGameName(game);

  if (game === "genshin") {
    renderGenshinCustomModal(fullName, game);
  } else if (game === "hsr") {
    renderHSRCustomModal(fullName, game);
  } else if (game === "zzz") {
    renderZZZCustomModal(fullName, game);
  }
};

// Genshin Impact Custom Character
function renderGenshinCustomModal(fullName, game) {
  const regions = [
    "Mondstadt",
    "Liyue",
    "Inazuma",
    "Sumeru",
    "Fontaine",
    "Natlan",
    "Snezhnaya",
  ];
  const weapons = ["Sword", "Claymore", "Polearm", "Catalyst", "Bow"];
  const elements = [
    "Pyro",
    "Hydro",
    "Electro",
    "Cryo",
    "Anemo",
    "Geo",
    "Dendro",
  ];

  window.openModal?.(`
    <div style="max-height: 80vh; overflow-y: auto;">
      <h3>Customize Character - ${fullName}</h3>
      
      <div style="margin-bottom: 15px;">
        <strong>Character Name:</strong><br>
        <input type="text" id="custom-name" placeholder="Enter character name" style="width: 100%; padding: 8px;">
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
        <div>
          <strong>Weapon:</strong><br>
          <select id="custom-weapon" style="width: 100%; padding: 8px;">
            ${weapons.map((w) => `<option value="${w}">${w}</option>`).join("")}
          </select>
        </div>
        <div>
          <strong>Region:</strong><br>
          <select id="custom-region" style="width: 100%; padding: 8px;">
            ${regions.map((r) => `<option value="${r}">${r}</option>`).join("")}
            <option value="unknown">Unknown</option>
          </select>
        </div>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
        <div>
          <strong>Element:</strong><br>
          <select id="custom-element" style="width: 100%; padding: 8px;">
            ${
    elements.map((e) => `<option value="${e}">${e}</option>`).join("")
  }
          </select>
        </div>
        <div>
          <strong>Rarity:</strong><br>
          <select id="custom-rarity" style="width: 100%; padding: 8px;">
            <option value="4">4★</option>
            <option value="5">5★</option>
          </select>
        </div>
      </div>
      
      <h4>Ascension Materials</h4>
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 15px;">
        <div>
          <strong>Common</strong><br>
          <button onclick="window.openMaterialSelector('genshin', 'common', 'custom-common')" style="width: 100%; padding: 8px;">+ Add</button>
          <div id="custom-common-display" style="font-size: 12px; color: #ccc; min-height: 20px;"></div>
        </div>
        <div>
          <strong>Local Specialty</strong><br>
          <button onclick="window.openMaterialSelector('genshin', 'local', 'custom-local')" style="width: 100%; padding: 8px;">+ Add</button>
          <div id="custom-local-display" style="font-size: 12px; color: #ccc; min-height: 20px;"></div>
        </div>
        <div>
          <strong>Boss Material</strong><br>
          <button onclick="window.openMaterialSelector('genshin', 'overworld', 'custom-boss')" style="width: 100%; padding: 8px;">+ Add</button>
          <div id="custom-boss-display" style="font-size: 12px; color: #ccc; min-height: 20px;"></div>
        </div>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 20px;">
        <div>
          <strong>Elemental Gem</strong><br>
          <button onclick="window.openMaterialSelector('genshin', 'gem', 'custom-gem')" style="width: 100%; padding: 8px;">+ Add</button>
          <div id="custom-gem-display" style="font-size: 12px; color: #ccc; min-height: 20px;"></div>
        </div>
        <div>
          <strong>Talent Book</strong><br>
          <button onclick="window.openMaterialSelector('genshin', 'talent books', 'custom-talent')" style="width: 100%; padding: 8px;">+ Add</button>
          <div id="custom-talent-display" style="font-size: 12px; color: #ccc; min-height: 20px;"></div>
        </div>
        <div>
          <strong>Weekly Material</strong><br>
          <button onclick="window.openMaterialSelector('genshin', 'weekly', 'custom-weekly')" style="width: 100%; padding: 8px;">+ Add</button>
          <div id="custom-weekly-display" style="font-size: 12px; color: #ccc; min-height: 20px;"></div>
        </div>
      </div>
      
      <button onclick="window.saveCustomCharacter('genshin')" style="padding: 10px 20px; background: #2ecc71; color: white; border: none; border-radius: 6px; font-weight: bold;">
        Set Build Goal →
      </button>
      <button onclick="window.closeModal?.()" style="padding: 10px 20px; background: #95a5a6; color: white; border: none; border-radius: 6px; margin-left: 10px;">
        Cancel
      </button>
    </div>
  `);
}

// HSR Custom Character
function renderHSRCustomModal(fullName, game) {
  const paths = [
    "Destruction",
    "Hunt",
    "Erudition",
    "Harmony",
    "Nihility",
    "Preservation",
    "Abundance",
  ];
  const types = [
    "Physical",
    "Fire",
    "Ice",
    "Lightning",
    "Wind",
    "Quantum",
    "Imaginary",
  ];

  window.openModal?.(`
    <div style="max-height: 80vh; overflow-y: auto;">
      <h3>Customize Character - ${fullName}</h3>
      
      <div style="margin-bottom: 15px;">
        <strong>Character Name:</strong><br>
        <input type="text" id="custom-name" placeholder="Enter character name" style="width: 100%; padding: 8px;">
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
        <div>
          <strong>Path:</strong><br>
          <select id="custom-path" style="width: 100%; padding: 8px;">
            ${paths.map((p) => `<option value="${p}">${p}</option>`).join("")}
          </select>
        </div>
        <div>
          <strong>Type:</strong><br>
          <select id="custom-type" style="width: 100%; padding: 8px;">
            ${types.map((t) => `<option value="${t}">${t}</option>`).join("")}
          </select>
        </div>
      </div>
      
      <div style="margin-bottom: 15px;">
        <strong>Rarity:</strong><br>
        <select id="custom-rarity" style="width: 100%; padding: 8px;">
          <option value="4">4★</option>
          <option value="5">5★</option>
        </select>
      </div>
      
      <h4>Ascension Materials</h4>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
        <div>
          <strong>Trace Materials</strong><br>
          <button onclick="window.openMaterialSelector('hsr', 'trace', 'custom-trace')" style="width: 100%; padding: 8px;">+ Add</button>
          <div id="custom-trace-display" style="font-size: 12px; color: #ccc; min-height: 20px;"></div>
        </div>
        <div>
          <strong>Ascension Materials</strong><br>
          <button onclick="window.openMaterialSelector('hsr', 'ascension', 'custom-ascension')" style="width: 100%; padding: 8px;">+ Add</button>
          <div id="custom-ascension-display" style="font-size: 12px; color: #ccc; min-height: 20px;"></div>
        </div>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
        <div>
          <strong>Enemy Drops</strong><br>
          <button onclick="window.openMaterialSelector('hsr', 'drops', 'custom-drops')" style="width: 100%; padding: 8px;">+ Add</button>
          <div id="custom-drops-display" style="font-size: 12px; color: #ccc; min-height: 20px;"></div>
        </div>
        <div>
          <strong>Weekly Materials</strong><br>
          <button onclick="window.openMaterialSelector('hsr', 'weekly', 'custom-weekly')" style="width: 100%; padding: 8px;">+ Add</button>
          <div id="custom-weekly-display" style="font-size: 12px; color: #ccc; min-height: 20px;"></div>
        </div>
      </div>
      
      <button onclick="window.saveCustomCharacter('hsr')" style="padding: 10px 20px; background: #2ecc71; color: white; border: none; border-radius: 6px; font-weight: bold;">
        Set Build Goal →
      </button>
      <button onclick="window.closeModal?.()" style="padding: 10px 20px; background: #95a5a6; color: white; border: none; border-radius: 6px; margin-left: 10px;">
        Cancel
      </button>
    </div>
  `);
}

// ZZZ Custom Character
function renderZZZCustomModal(fullName, game) {
  const roles = ["Attack", "Stun", "Anomaly", "Support", "Defense", "Rupture"];
  const types = ["Physical", "Fire", "Ice", "Electric", "Ether"];

  window.openModal?.(`
    <div style="max-height: 80vh; overflow-y: auto;">
      <h3>Customize Character - ${fullName}</h3>
      
      <div style="margin-bottom: 15px;">
        <strong>Character Name:</strong><br>
        <input type="text" id="custom-name" placeholder="Enter character name" style="width: 100%; padding: 8px;">
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
        <div>
          <strong>Role:</strong><br>
          <select id="custom-role" style="width: 100%; padding: 8px;">
            ${roles.map((r) => `<option value="${r}">${r}</option>`).join("")}
          </select>
        </div>
        <div>
          <strong>Type:</strong><br>
          <select id="custom-type" style="width: 100%; padding: 8px;">
            ${types.map((t) => `<option value="${t}">${t}</option>`).join("")}
          </select>
        </div>
      </div>
      
      <h4>Ascension Materials</h4>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
        <div>
          <strong>Core Skill Materials</strong><br>
          <button onclick="window.openMaterialSelector('zzz', 'core', 'custom-core')" style="width: 100%; padding: 8px;">+ Add</button>
          <div id="custom-core-display" style="font-size: 12px; color: #ccc; min-height: 20px;"></div>
        </div>
        <div>
          <strong>Weekly Materials</strong><br>
          <button onclick="window.openMaterialSelector('zzz', 'weekly', 'custom-weekly')" style="width: 100%; padding: 8px;">+ Add</button>
          <div id="custom-weekly-display" style="font-size: 12px; color: #ccc; min-height: 20px;"></div>
        </div>
      </div>
      
      <button onclick="window.saveCustomCharacter('zzz')" style="padding: 10px 20px; background: #2ecc71; color: white; border: none; border-radius: 6px; font-weight: bold;">
        Set Build Goal →
      </button>
      <button onclick="window.closeModal?.()" style="padding: 10px 20px; background: #95a5a6; color: white; border: none; border-radius: 6px; margin-left: 10px;">
        Cancel
      </button>
    </div>
  `);
}

// Material Selector
window.openMaterialSelector = (game, materialType, targetId) => {
  const materials = ASCENSION_MATERIALS[game] || [];
  let filteredMaterials = [];

  // Filter materials based on type and game-specific logic
  if (game === "genshin") {
    if (materialType === "common") {
      filteredMaterials = materials.filter((m) =>
        m.tags?.[0] === "common" && m.tags?.[2] === 1
      );
    } else if (materialType === "local") {
      const region = document.getElementById("custom-region")?.value;
      filteredMaterials = materials.filter((m) =>
        m.tags?.[0] === "local" && m.tags?.[1] === region?.toLowerCase()
      );
    } else if (materialType === "overworld") {
      filteredMaterials = materials.filter((m) => m.tags?.[0] === "overworld");
    } else if (materialType === "gem") {
      const element = document.getElementById("custom-element")?.value;
      filteredMaterials = materials.filter((m) =>
        m.tags?.[0] === "gem" && m.tags?.[1] === element?.toLowerCase() &&
        m.tags?.[2] === 2
      );
    } else if (materialType === "talent books") {
      filteredMaterials = materials.filter((m) =>
        m.tags?.[0] === "talent books" && m.tags?.[2] === 1
      );
    } else if (materialType === "weekly") {
      filteredMaterials = materials.filter((m) => m.tags?.[0] === "weekly");
    }
  }
  // Add similar logic for HSR and ZZZ...

  const options = filteredMaterials.length > 0
    ? filteredMaterials.map((m) =>
      `<option value="${m.name}">${m.name}</option>`
    ).join("")
    : `<option value="">No materials found</option>`;

  window.openModal?.(`
    <h3>Select ${materialType} Material</h3>
    <select id="material-select" style="width: 100%; padding: 8px; margin-bottom: 15px;">
      ${options}
    </select>
    <br>
    <button onclick="window.selectMaterial('${targetId}')" style="padding: 8px 16px; background: #2ecc71; color: white; border: none; border-radius: 6px;">
      Select
    </button>
    <button onclick="window.closeModal?.()" style="padding: 8px 16px; background: #95a5a6; color: white; border: none; border-radius: 6px; margin-left: 10px;">
      Cancel
    </button>
  `);
};

window.selectMaterial = (targetId) => {
  const select = document.getElementById("material-select");
  const materialName = select?.value;
  if (materialName) {
    // Store the selected material
    window[targetId] = materialName;
    // Update display
    const display = document.getElementById(`${targetId}-display`);
    if (display) {
      display.textContent = materialName;
    }
    window.closeModal?.();
  }
};

// Save custom character and proceed to build goal
window.saveCustomCharacter = (game) => {
  const name = document.getElementById("custom-name")?.value.trim();
  if (!name) {
    alert("Please enter a character name!");
    return;
  }

  // Collect custom materials based on game
  const customMats = [];

  if (game === "genshin") {
    const materials = [
      window["custom-common"],
      window["custom-local"],
      window["custom-boss"],
      window["custom-gem"],
      window["custom-talent"],
      window["custom-weekly"],
    ].filter(Boolean);
    customMats.push(...materials);
  } else if (game === "hsr") {
    const materials = [
      window["custom-trace"],
      window["custom-ascension"],
      window["custom-drops"],
      window["custom-weekly"],
    ].filter(Boolean);
    customMats.push(...materials);
  } else if (game === "zzz") {
    const materials = [
      window["custom-core"],
      window["custom-weekly"],
    ].filter(Boolean);
    customMats.push(...materials);
  }

  window.closeModal?.();
  window.setGoalForCharacter(name, game, customMats);
};

// Set Build Goal (existing function - needs to be updated for each game's specific level ranges)
window.setGoalForCharacter = (name, game, customMats = []) => {
  const limits = GAME_LIMITS[game];
  const fullName = getFullGameName(game);

  // Get character data for pre-defined characters
  const charData = ALL_CHARACTERS[game]?.[name];

  // Determine weapon category
  let weaponCategory = null;
  let allWeapons = [];

  if (game === "genshin") {
    weaponCategory = charData?.weapon ||
      document.getElementById("custom-weapon")?.value;
    allWeapons = weaponCategory
      ? ALL_WEAPONS[game]?.[weaponCategory] || []
      : [];

    renderGenshinBuildGoal(
      name,
      game,
      fullName,
      limits,
      allWeapons,
      customMats,
    );
  } else if (game === "hsr") {
    weaponCategory = charData?.path ||
      document.getElementById("custom-path")?.value;
    allWeapons = weaponCategory
      ? ALL_WEAPONS[game]?.[weaponCategory] || []
      : [];

    renderHSRBuildGoal(name, game, fullName, limits, allWeapons, customMats);
  } else if (game === "zzz") {
    weaponCategory = charData?.role ||
      document.getElementById("custom-role")?.value;
    allWeapons = weaponCategory
      ? ALL_WEAPONS[game]?.[weaponCategory] || []
      : [];

    renderZZZBuildGoal(name, game, fullName, limits, allWeapons, customMats);
  }
};

// Render Genshin Build Goal
function renderGenshinBuildGoal(
  name,
  game,
  fullName,
  limits,
  allWeapons,
  customMats,
) {
  const weaponOptions = allWeapons.length > 0
    ? allWeapons.map((w) =>
      `<option value="${w.name}">${w.name} ${
        w.rarity ? `(${w.rarity}★)` : ""
      }</option>`
    ).join("")
    : `<option value="">No weapons found</option>`;

  const levelOptions = [
    "20/20",
    "20/40",
    "40/40",
    "40/50",
    "50/50",
    "50/60",
    "60/60",
    "60/70",
    "70/70",
    "70/80",
    "80/80",
    "80/90",
    "90/90",
  ];
  const weaponLevelOptions = [
    "20/20",
    "20/40",
    "40/40",
    "40/50",
    "50/50",
    "50/60",
    "60/60",
    "60/70",
    "70/70",
    "70/80",
    "80/80",
    "80/90",
    "90/90",
  ];

  window.openModal?.(`
    <div style="max-height: 80vh; overflow-y: auto;">
      <h3>Character Build Goal - ${name}</h3>
      <p>Game: <strong>${fullName}</strong></p>
      
      <div style="margin-bottom: 15px;">
        <strong>Character Level:</strong><br>
        <select id="char-level" style="width: 100%; padding: 8px;">
          ${
    levelOptions.map((level) =>
      `<option value="${level.split("/")[1]}">${level}</option>`
    ).join("")
  }
        </select>
      </div>
      
      <div style="margin-bottom: 15px;">
        <strong>Weapon:</strong><br>
        <select id="weapon-name" style="width: 100%; padding: 8px;">
          <option value="">Choose weapon...</option>
          ${weaponOptions}
        </select>
      </div>
      
      <div style="margin-bottom: 15px;">
        <strong>Weapon Level:</strong><br>
        <select id="weapon-level" style="width: 100%; padding: 8px;">
          ${
    weaponLevelOptions.map((level) =>
      `<option value="${level.split("/")[1]}">${level}</option>`
    ).join("")
  }
        </select>
      </div>
      
      <div style="margin-bottom: 15px;">
        <strong>Talents:</strong>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
          <div>
            <label>Normal Attack:</label><br>
            <select id="talent-0" style="width: 100%; padding: 5px;">
              ${
    Array.from({ length: 10 }, (_, i) =>
      `<option value="${i + 1}">${i + 1}</option>`).join("")
  }
            </select>
          </div>
          <div>
            <label>Skill:</label><br>
            <select id="talent-1" style="width: 100%; padding: 5px;">
              ${
    Array.from({ length: 10 }, (_, i) =>
      `<option value="${i + 1}">${i + 1}</option>`).join("")
  }
            </select>
          </div>
          <div>
            <label>Ultimate:</label><br>
            <select id="talent-2" style="width: 100%; padding: 5px;">
              ${
    Array.from({ length: 10 }, (_, i) =>
      `<option value="${i + 1}">${i + 1}</option>`).join("")
  }
            </select>
          </div>
        </div>
      </div>
      
      <button onclick="window.saveBuildGoal('${name}', '${game}', ${
    JSON.stringify(customMats)
  })" style="padding: 10px 20px; background: #2ecc71; color: white; border: none; border-radius: 6px; font-weight: bold;">
        ✅ Save Build
      </button>
      <button onclick="window.closeModal?.()" style="padding: 10px 20px; background: #95a5a6; color: white; border: none; border-radius: 6px; margin-left: 10px;">
        Cancel
      </button>
    </div>
  `);
}

// Honkai Star rail looks like
// Customize Character
// Name: ________
// Path: {select a path}
// Type: {Select a type}
// Rarity: {4 or 5}
// trace  ascension
// [ + ]  [   +   ] <- same clickable buttons
// enemy  weekly
// [ + ]  [ +  ]
// same logic - looks in ascension-mats.js in the hsr section, trace mats looks for tags[0] = "trace" and tags[1] = {chosen path}, ascension looks for tags[0] = "ascension" and tags[1] = {chosen type}, enemy looks for tags[0] = "drops", weekly looks for tags[0]="weekly"

// Character Build Goal
// character name:
// character level: 1/20 - {chose from 20/20, 20/40. 40/40, 40/50, 50/50, 50/60, 60/60, 60/70, 70/70, 70/80, 80/80}
// light cone: {select from character's path type in all-weapons.js}
// light level: 1/20 - {chose from 20/20, 20/40. 40/40, 40/50, 50/50, 50/60, 60/60, 60/70, 70/70, 70/80, 80/80}
// Basic Attack: 1 - {select 1 - 6}
// Skill: 1 - {select from 1 - 10}
// Ultimate: 1 - {select from 1 - 10}
// Talent: 1 - {select from 1 - 10}
// [] Bonus Abilities (all 3)  (mark to turn off)
// [] minor traces [all] (mark to turn on)

// Zenless Zone Zero looks like
// Customize Character
// Name: ___________
// Role: {select a role}
// type: {Select a type}
// core skill   weekly
// [    +   ]   [ +  ]
// same logic, click buttons, open list of materials imported from ascension-mats.js in the zzz section, core skill looks for tags[0]= "core", weekly looks for tags[0] = "weekly"

// Character Build Goal
// character name:
// character level: 1/20 - {chose from 20/20, 20/40. 40/40, 40/50, 50/50, 50/60, 60/60}
// engine: {select from character's role type in all-weapons.js}
// enginelevel: 1/20 - {chose from 20/20, 20/40. 40/40, 40/50, 50/50, 50/60, 60/60}
// Basic attack: 1 - {select 1 - 12}
// Dodge: 1 - {select 1 - 12}
// Assist: 1 - {select 1 - 12}
// Special Attack: 1 - {select 1 - 12}
// Chain Attack: 1 - {select 1 - 12}

// Step 5: Save the full build (existing function)
window.saveBuildGoal = (name, game, customMats) => {
  const charLevel = document.getElementById("char-level")?.value || 1;
  const weaponSelect = document.getElementById("weapon-name");
  const weaponName = weaponSelect?.value
    ? weaponSelect.options[weaponSelect.selectedIndex]?.text ||
      weaponSelect.value
    : "";
  const weaponLevel = document.getElementById("weapon-level")?.value || 1;
  const talentValues = [];
  const limits = GAME_LIMITS[game];

  for (let i = 0; i < limits.talentCount; i++) {
    const val = document.getElementById(`talent-${i}`)?.value || 1;
    talentValues.push(parseInt(val));
  }

  // HSR Traces
  const majorTraces = game === "hsr"
    ? document.getElementById("major-traces")?.checked ?? true
    : false;
  const minorTraces = game === "hsr"
    ? document.getElementById("minor-traces")?.checked ?? true
    : false;

  const newChar = {
    name,
    game,
    currentLevel: 1,
    goalLevel: parseInt(charLevel),
    weaponName,
    currentWeaponLevel: 1,
    goalWeaponLevel: parseInt(weaponLevel),
    talentsCurrent: Array(limits.talentCount).fill(1),
    talentsGoal: talentValues,
    materials: customMats.length > 0 ? customMats : null,
    ...(game === "hsr" && { majorTraces, minorTraces }),
  };

  addCharacter(newChar);
  window.closeModal?.();
  renderCharacterList();
};
