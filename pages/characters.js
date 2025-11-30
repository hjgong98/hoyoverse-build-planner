// pages/characters.js

import {
  addCharacter,
  getCharacterById,
  loadMyCharacters,
} from "../saved/my-characters.js";
import { renderCharacterDetail } from "../components/character-details.js";
import { ALL_CHARACTERS } from "../data/all-characters.js";
import { GAME_LIMITS } from "../data/game-limits.js";
import { ASCENSION_MATERIALS } from "../data/ascension-mats.js";
import { ALL_WEAPONS } from "../data/all-weapons.js";

// =================================================================
// CONSTANTS AND CONFIGURATION
// =================================================================

const GAME_CONFIG = {
  genshin: {
    name: "Genshin Impact",
    weaponLabel: "Weapon",
    talentNames: ["Normal Attack", "Elemental Skill", "Elemental Burst"],
    materialTypes: [
      "common",
      "local",
      "overworld",
      "gem",
      "talent books",
      "weekly",
    ],
  },
  hsr: {
    name: "Honkai Star Rail",
    weaponLabel: "Light Cone",
    talentNames: ["Basic Attack", "Skill", "Ultimate", "Talent"],
    materialTypes: ["trace", "ascension", "drops", "weekly"],
  },
  zzz: {
    name: "Zenless Zone Zero",
    weaponLabel: "Engine",
    talentNames: [
      "Basic Attack",
      "Dodge",
      "Assist",
      "Special Attack",
      "Chain Attack",
    ],
    materialTypes: ["core", "weekly"],
  },
};

const TALENT_MAX_LEVELS = {
  genshin: [10, 10, 10],
  hsr: [6, 10, 10, 10],
  zzz: [12, 12, 12, 12, 12],
};

// =================================================================
// CHARACTERS PAGE CLASS
// =================================================================

class CharactersPage {
  constructor() {
    this.myCharacters = loadMyCharacters();
    this.init();
  }

  init() {
    this.renderCharacterList();
  }

  renderCharacterList() {
    const content = document.getElementById("page-content");
    if (!content) return;

    if (this.myCharacters.length === 0) {
      content.innerHTML = this.renderEmptyState();
      return;
    }

    content.innerHTML = this.renderCharacterGrid();
    this.renderCharacterBoxes();
  }

  renderEmptyState() {
    return `
      <h2>Characters</h2>
      <div class="char-grid" id="char-list">
        <div class="char-box add-new" onclick="CharacterModalHandler.openGameSelectionModal()">+</div>
      </div>
    `;
  }

  renderCharacterGrid() {
    return `
      <h2>Characters in Progress</h2>
      <div class="char-grid" id="char-list"></div>
    `;
  }

  renderCharacterBoxes() {
    const list = document.getElementById("char-list");
    if (!list) return;

    this.myCharacters.forEach((char) => {
      list.appendChild(this.createCharacterBox(char));
    });

    list.appendChild(this.createAddCharacterBox());
  }

  createCharacterBox(char) {
    const charData = ALL_CHARACTERS[char.game]?.[char.name];
    const charIcon = charData?.icon || char.imageUrl;
    const fullName = char.name;
    const fullGameName = this.getFullGameName(char.game);

    const box = document.createElement("div");
    box.className = "char-box";
    box.title =
      `${fullName} (${fullGameName}) → Lv.${char.currentLevel} → ${char.goalLevel}`;
    box.onclick = () => renderCharacterDetail(char);

    box.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
        <img src="${charIcon}" alt="${fullName}" 
            style="width: 48px; height: 48px; border-radius: 8px; object-fit: cover; border: 2px solid #e67e22;"
            onerror="this.src='/assets/fallback-character.jpg'; this.onerror=null;">
        <span style="font-size: 12px; text-align: center; line-height: 1.2;">${fullName}</span>
      </div>
    `;

    return box;
  }

  createAddCharacterBox() {
    const addBox = document.createElement("div");
    addBox.className = "char-box add-new";
    addBox.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
        <div style="width: 48px; height: 48px; border-radius: 8px; border: 2px dashed #3498db; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #3498db;">
          +
        </div>
        <span style="font-size: 12px; text-align: center;">Add Character</span>
      </div>
    `;
    addBox.onclick = () => CharacterModalHandler.openGameSelectionModal();
    return addBox;
  }

  getFullGameName(gameKey) {
    return GAME_CONFIG[gameKey]?.name || gameKey;
  }
}

// =================================================================
// MODAL HANDLER CLASS
// =================================================================

class CharacterModalHandler {
  static openGameSelectionModal() {
    window.openModal?.(`
      <h3>Add Character</h3>
      <p><strong>Select Game:</strong></p>
      <select id="select-game">
        ${
      Object.entries(GAME_CONFIG).map(([key, config]) =>
        `<option value="${key}">${config.name}</option>`
      ).join("")
    }
      </select>
      <br><br>
      <button onclick="CharacterModalHandler.handleGameSelection()">Next →</button>
      <button onclick="window.closeModal?.()">Cancel</button>
    `);
  }

  static handleGameSelection() {
    const game = document.getElementById("select-game")?.value;
    const gameConfig = GAME_CONFIG[game];
    if (!gameConfig) return;

    const charactersObj = ALL_CHARACTERS[game] || {};
    const characterNames = Object.keys(charactersObj);

    window.openModal?.(`
      <h3>Select Character</h3>
      <p>Game: <strong>${gameConfig.name}</strong></p>
      <p><strong>Pick a character:</strong></p>
      <select id="select-character">
        ${
      characterNames.map((name) => `<option value="${name}">${name}</option>`)
        .join("")
    }
        <option value="custom">🔧 Custom Character</option>
      </select>
      <br><br>
      <button onclick="CharacterModalHandler.handleCharacterSelection('${game}')">Next →</button>
      <button onclick="window.closeModal?.()">Cancel</button>
    `);
  }

  static handleCharacterSelection(game) {
    const name = document.getElementById("select-character")?.value;
    if (name === "custom") {
      this.openCustomCharacterModal(game);
    } else {
      BuildGoalHandler.setGoalForCharacter(name, game, []);
    }
  }

  static openCustomCharacterModal(game) {
    const gameConfig = GAME_CONFIG[game];
    if (!gameConfig) return;

    const modalContent = CustomCharacterModalFactory.create(game, gameConfig);
    window.openModal?.(modalContent);
  }

  static openMaterialSelector(game, materialType, targetId) {
    const materials = ASCENSION_MATERIALS[game] || [];
    const filteredMaterials = MaterialFilter.filterByType(
      materials,
      materialType,
      game,
    );

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
      <button onclick="CharacterModalHandler.selectMaterial('${targetId}')" 
              style="padding: 8px 16px; background: #2ecc71; color: white; border: none; border-radius: 6px;">
        Select
      </button>
      <button onclick="window.closeModal?.()" 
              style="padding: 8px 16px; background: #95a5a6; color: white; border: none; border-radius: 6px; margin-left: 10px;">
        Cancel
      </button>
    `);
  }

  static selectMaterial(targetId) {
    const select = document.getElementById("material-select");
    const materialName = select?.value;
    if (materialName) {
      window[targetId] = materialName;
      const display = document.getElementById(`${targetId}-display`);
      if (display) {
        display.textContent = materialName;
      }
      window.closeModal?.();
    }
  }
}

// =================================================================
// CUSTOM CHARACTER MODAL FACTORY
// =================================================================

class CustomCharacterModalFactory {
  static create(game, gameConfig) {
    const templates = {
      genshin: this.createGenshinModal,
      hsr: this.createHSRModal,
      zzz: this.createZZZModal,
    };

    const templateFn = templates[game] || this.createGenshinModal;
    return templateFn(game, gameConfig);
  }

  static createGenshinModal(game, gameConfig) {
    return `
      <div style="max-height: 80vh; overflow-y: auto;">
        <h3>Customize Character - ${gameConfig.name}</h3>
        ${this.createBasicInfoFields()}
        ${this.createGenshinAttributes()}
        ${this.createGenshinMaterials()}
        ${this.createActionButtons(game)}
      </div>
    `;
  }

  static createBasicInfoFields() {
    return `
      <div style="margin-bottom: 15px;">
        <strong>Character Name:</strong><br>
        <input type="text" id="custom-name" placeholder="Enter character name" style="width: 100%; padding: 8px;">
      </div>
    `;
  }

  static createGenshinAttributes() {
    return `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
        <div>
          <strong>Weapon:</strong><br>
          <select id="custom-weapon" style="width: 100%; padding: 8px;">
            <option value="Sword">Sword</option>
            <option value="Claymore">Claymore</option>
            <option value="Polearm">Polearm</option>
            <option value="Catalyst">Catalyst</option>
            <option value="Bow">Bow</option>
          </select>
        </div>
        <div>
          <strong>Region:</strong><br>
          <select id="custom-region" style="width: 100%; padding: 8px;">
            <option value="Mondstadt">Mondstadt</option>
            <option value="Liyue">Liyue</option>
            <option value="Inazuma">Inazuma</option>
            <option value="Sumeru">Sumeru</option>
            <option value="Fontaine">Fontaine</option>
            <option value="Natlan">Natlan</option>
            <option value="Snezhnaya">Snezhnaya</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
        <div>
          <strong>Element:</strong><br>
          <select id="custom-element" style="width: 100%; padding: 8px;">
            <option value="Pyro">Pyro</option>
            <option value="Hydro">Hydro</option>
            <option value="Electro">Electro</option>
            <option value="Cryo">Cryo</option>
            <option value="Anemo">Anemo</option>
            <option value="Geo">Geo</option>
            <option value="Dendro">Dendro</option>
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
    `;
  }

  static createGenshinMaterials() {
    const materialSections = [
      { type: "common", label: "Common" },
      { type: "local", label: "Local Specialty" },
      { type: "overworld", label: "Boss Material" },
      { type: "gem", label: "Elemental Gem" },
      { type: "talent books", label: "Talent Book" },
      { type: "weekly", label: "Weekly Material" },
    ];

    return `
      <h4>Ascension Materials</h4>
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 15px;">
        ${
      materialSections.slice(0, 3).map((section) =>
        this.createMaterialSection(section)
      ).join("")
    }
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 20px;">
        ${
      materialSections.slice(3).map((section) =>
        this.createMaterialSection(section)
      ).join("")
    }
      </div>
    `;
  }

  static createMaterialSection({ type, label }) {
    const targetId = `custom-${type.replace(" ", "-")}`;
    return `
      <div>
        <strong>${label}</strong><br>
        <button onclick="CharacterModalHandler.openMaterialSelector('genshin', '${type}', '${targetId}')" 
                style="width: 100%; padding: 8px;">+ Add</button>
        <div id="${targetId}-display" style="font-size: 12px; color: #ccc; min-height: 20px;"></div>
      </div>
    `;
  }

  static createActionButtons(game) {
    return `
      <button onclick="CharacterModalHandler.saveCustomCharacter('${game}')" 
              style="padding: 10px 20px; background: #2ecc71; color: white; border: none; border-radius: 6px; font-weight: bold;">
        Set Build Goal →
      </button>
      <button onclick="window.closeModal?.()" 
              style="padding: 10px 20px; background: #95a5a6; color: white; border: none; border-radius: 6px; margin-left: 10px;">
        Cancel
      </button>
    `;
  }

  static createHSRModal(game, gameConfig) {
    // Simplified HSR modal - similar pattern to Genshin
    return `
      <div style="max-height: 80vh; overflow-y: auto;">
        <h3>Customize Character - ${gameConfig.name}</h3>
        ${this.createBasicInfoFields()}
        <!-- HSR specific fields would go here -->
        ${this.createActionButtons(game)}
      </div>
    `;
  }

  static createZZZModal(game, gameConfig) {
    // Simplified ZZZ modal - similar pattern to Genshin
    return `
      <div style="max-height: 80vh; overflow-y: auto;">
        <h3>Customize Character - ${gameConfig.name}</h3>
        ${this.createBasicInfoFields()}
        <!-- ZZZ specific fields would go here -->
        ${this.createActionButtons(game)}
      </div>
    `;
  }
}

// =================================================================
// MATERIAL FILTER
// =================================================================

class MaterialFilter {
  static filterByType(materials, materialType, game) {
    const filters = {
      genshin: this.filterGenshinMaterials,
      hsr: this.filterHSRMaterials,
      zzz: this.filterZZZMaterials,
    };

    const filterFn = filters[game] || this.filterGenshinMaterials;
    return filterFn(materials, materialType);
  }

  static filterGenshinMaterials(materials, materialType) {
    const region = document.getElementById("custom-region")?.value;
    const element = document.getElementById("custom-element")?.value;

    const filterMap = {
      common: (m) => m.tags?.[0] === "common" && m.tags?.[2] === 1,
      local: (m) =>
        m.tags?.[0] === "local" && m.tags?.[1] === region?.toLowerCase(),
      overworld: (m) => m.tags?.[0] === "overworld",
      gem: (m) =>
        m.tags?.[0] === "gem" && m.tags?.[1] === element?.toLowerCase() &&
        m.tags?.[2] === 2,
      "talent books": (m) =>
        m.tags?.[0] === "talent books" && m.tags?.[2] === 1,
      weekly: (m) => m.tags?.[0] === "weekly",
    };

    return materials.filter(filterMap[materialType] || (() => false));
  }

  static filterHSRMaterials(materials, materialType) {
    // HSR filtering logic would go here
    return materials.filter((m) => m.tags?.[0] === materialType);
  }

  static filterZZZMaterials(materials, materialType) {
    // ZZZ filtering logic would go here
    return materials.filter((m) => m.tags?.[0] === materialType);
  }
}

// =================================================================
// BUILD GOAL HANDLER
// =================================================================

class BuildGoalHandler {
  static setGoalForCharacter(name, game, customMats = []) {
    const limits = GAME_LIMITS[game];
    const gameConfig = GAME_CONFIG[game];

    const charData = ALL_CHARACTERS[game]?.[name];
    const weaponCategory = charData?.weapon ||
      document.getElementById("custom-weapon")?.value;
    const allWeapons = weaponCategory
      ? ALL_WEAPONS[game]?.[weaponCategory] || []
      : [];

    const modalContent = this.createBuildGoalModal(
      name,
      game,
      gameConfig,
      limits,
      allWeapons,
      customMats,
    );
    window.openModal?.(modalContent);
  }

  static createBuildGoalModal(
    name,
    game,
    gameConfig,
    limits,
    weapons,
    customMats,
  ) {
    const weaponOptions = weapons.length > 0
      ? weapons.map((w) =>
        `<option value="${w.name}">${w.name} ${
          w.rarity ? `(${w.rarity}★)` : ""
        }</option>`
      ).join("")
      : `<option value="">No weapons found</option>`;

    const levelOptions = this.generateLevelOptions(game);
    const talentSection = this.createTalentSection(game, limits);

    return `
      <div style="max-height: 80vh; overflow-y: auto;">
        <h3>Character Build Goal - ${name}</h3>
        <p>Game: <strong>${gameConfig.name}</strong></p>
        
        ${
      this.createLevelSelectors(levelOptions, limits.weaponLabel, weaponOptions)
    }
        ${talentSection}
        
        <button onclick="BuildGoalHandler.saveBuildGoal('${name}', '${game}', ${
      JSON.stringify(customMats)
    })" 
                style="padding: 10px 20px; background: #2ecc71; color: white; border: none; border-radius: 6px; font-weight: bold;">
          ✅ Save Build
        </button>
        <button onclick="window.closeModal?.()" 
                style="padding: 10px 20px; background: #95a5a6; color: white; border: none; border-radius: 6px; margin-left: 10px;">
          Cancel
        </button>
      </div>
    `;
  }

  static generateLevelOptions(game) {
    const levelMaps = {
      genshin: [
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
      ],
      hsr: [
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
      ],
      zzz: ["20/20", "20/40", "40/40", "40/50", "50/50", "50/60", "60/60"],
    };

    return levelMaps[game] || levelMaps.genshin;
  }

  static createLevelSelectors(levelOptions, weaponLabel, weaponOptions) {
    return `
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
        <strong>${weaponLabel}:</strong><br>
        <select id="weapon-name" style="width: 100%; padding: 8px;">
          <option value="">Choose weapon...</option>
          ${weaponOptions}
        </select>
      </div>
      
      <div style="margin-bottom: 15px;">
        <strong>${weaponLabel} Level:</strong><br>
        <select id="weapon-level" style="width: 100%; padding: 8px;">
          ${
      levelOptions.map((level) =>
        `<option value="${level.split("/")[1]}">${level}</option>`
      ).join("")
    }
        </select>
      </div>
    `;
  }

  static createTalentSection(game, limits) {
    const maxLevels = TALENT_MAX_LEVELS[game] ||
      Array(limits.talentCount).fill(10);

    return `
      <div style="margin-bottom: 15px;">
        <strong>Talents:</strong>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
          ${
      maxLevels.map((maxLevel, i) => this.createTalentInput(i, maxLevel)).join(
        "",
      )
    }
        </div>
      </div>
    `;
  }

  static createTalentInput(index, maxLevel) {
    const talentNames = {
      0: "Normal Attack",
      1: "Skill",
      2: "Ultimate",
      3: "Talent",
      4: "Chain Attack",
    };

    return `
      <div>
        <label>${talentNames[index] || `Talent ${index + 1}`}:</label><br>
        <select id="talent-${index}" style="width: 100%; padding: 5px;">
          ${
      Array.from({ length: maxLevel }, (_, i) =>
        `<option value="${i + 1}">${i + 1}</option>`).join("")
    }
        </select>
      </div>
    `;
  }

  static saveBuildGoal(name, game, customMats) {
    const charLevel = document.getElementById("char-level")?.value || 1;
    const weaponSelect = document.getElementById("weapon-name");
    const weaponName = weaponSelect?.value
      ? weaponSelect.options[weaponSelect.selectedIndex]?.text ||
        weaponSelect.value
      : "";
    const weaponLevel = document.getElementById("weapon-level")?.value || 1;

    const limits = GAME_LIMITS[game];
    const talentValues = [];

    for (let i = 0; i < limits.talentCount; i++) {
      const val = document.getElementById(`talent-${i}`)?.value || 1;
      talentValues.push(parseInt(val));
    }

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
    };

    addCharacter(newChar);
    window.closeModal?.();

    // Refresh the character list
    const page = new CharactersPage();
    page.renderCharacterList();
  }
}

// =================================================================
// GLOBAL FUNCTION EXPORTS (Minimal)
// =================================================================

window.CharacterModalHandler = CharacterModalHandler;
window.BuildGoalHandler = BuildGoalHandler;
window.openAddCharacterModal = CharacterModalHandler.openGameSelectionModal;
window.handleGameSelection = CharacterModalHandler.handleGameSelection;
window.handleCharacterSelection =
  CharacterModalHandler.handleCharacterSelection;
window.openCustomCharacterModal =
  CharacterModalHandler.openCustomCharacterModal;
window.openMaterialSelector = CharacterModalHandler.openMaterialSelector;
window.selectMaterial = CharacterModalHandler.selectMaterial;
window.saveCustomCharacter = CharacterModalHandler.saveCustomCharacter;
window.setGoalForCharacter = BuildGoalHandler.setGoalForCharacter;
window.saveBuildGoal = BuildGoalHandler.saveBuildGoal;

window.getFullGameName = (gameKey) => GAME_CONFIG[gameKey]?.name || gameKey;

// =================================================================
// INITIALIZATION
// =================================================================

export function initCharactersScene() {
  new CharactersPage();
}

window.initCharactersScene = initCharactersScene;
