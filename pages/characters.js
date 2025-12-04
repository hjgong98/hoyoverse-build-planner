// /pages/characters.js

import { addCharacter, loadMyCharacters } from "../saved/my-characters.js";
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
    // Get the character icon - prioritize custom character data
    let charIcon;
    if (char.isCustom && char.customData) {
      // For custom characters, use the custom icon
      charIcon = char.customData.icon || "./assets/stick figure.png";
    } else {
      // For regular characters, use the icon from ALL_CHARACTERS
      const charData = ALL_CHARACTERS[char.game]?.[char.name];
      charIcon = charData?.icon || "./assets/fallback-character.jpg";
    }

    const fullName = char.name;
    const fullGameName = this.getFullGameName(char.game);

    const box = document.createElement("div");
    box.className = "char-box";
    box.title =
      `${fullName} (${fullGameName}) → Lv.${char.currentLevel} → ${char.goalLevel}`;

    // Create clickable area for character detail
    const charDetailDiv = document.createElement("div");
    charDetailDiv.style.cursor = "pointer";
    charDetailDiv.style.width = "100%";
    charDetailDiv.style.height = "100%";
    charDetailDiv.onclick = () => renderCharacterDetail(char);

    charDetailDiv.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
        <img src="${charIcon}" alt="${fullName}" 
            style="width: 48px; height: 48px; border-radius: 8px; object-fit: cover; border: 2px solid #e67e22;"
            onerror="this.src='./assets/fallback-character.jpg'; this.onerror=null;">
        <span style="font-size: 12px; text-align: center; line-height: 1.2;">${fullName}</span>
      </div>
    `;

    box.appendChild(charDetailDiv);

    // Add delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "×";
    deleteBtn.style.position = "absolute";
    deleteBtn.style.top = "-5px";
    deleteBtn.style.right = "-5px";
    deleteBtn.style.background = "#e74c3c";
    deleteBtn.style.color = "white";
    deleteBtn.style.border = "none";
    deleteBtn.style.borderRadius = "50%";
    deleteBtn.style.width = "20px";
    deleteBtn.style.height = "20px";
    deleteBtn.style.fontSize = "12px";
    deleteBtn.style.cursor = "pointer";
    deleteBtn.style.display = "none";
    deleteBtn.style.zIndex = "10";
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      this.removeCharacter(char.name, char.game);
    };

    box.style.position = "relative";
    box.appendChild(deleteBtn);

    // Show delete button on hover
    box.addEventListener("mouseenter", () => {
      deleteBtn.style.display = "block";
    });

    box.addEventListener("mouseleave", () => {
      deleteBtn.style.display = "none";
    });

    return box;
  }

  removeCharacter(name, game) {
    if (
      !confirm(`Remove ${name} from your list? This will delete all progress.`)
    ) {
      return;
    }

    // Filter out the character to remove
    const characters = loadMyCharacters();
    const filtered = characters.filter((char) =>
      !(char.name === name && char.game === game)
    );

    // Save to localStorage
    localStorage.setItem("hoyoverse-builds", JSON.stringify(filtered));

    // Refresh the character list
    this.myCharacters = filtered;
    this.renderCharacterList();
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

  // Add method to refresh character list
  refreshCharacterList() {
    this.myCharacters = loadMyCharacters();
    this.renderCharacterList();
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

    // Load current characters to check which ones are already added
    const myCharacters = loadMyCharacters();
    const existingCharacters = myCharacters
      .filter((char) => char.game === game)
      .map((char) => char.name);

    const charactersObj = ALL_CHARACTERS[game] || {};
    const allCharacters = Object.keys(charactersObj);

    // Count how many are already added
    const addedCount =
      allCharacters.filter((name) => existingCharacters.includes(name)).length;

    window.openModal?.(`
      <h3>Select Character</h3>
      <p>Game: <strong>${gameConfig.name}</strong></p>
      <p style="font-size: 12px; color: ${
      addedCount > 0 ? "#e74c3c" : "#27ae60"
    };">
        ${
      addedCount === 0
        ? "No characters added yet"
        : `${addedCount} of ${allCharacters.length} characters already added`
    }
      </p>
      <p><strong>Pick a character:</strong></p>
      <select id="select-character" style="width: 100%; padding: 8px;">
        <option value="">-- Select a character --</option>
        ${
      allCharacters.map((name) => {
        const isAdded = existingCharacters.includes(name);
        return `<option value="${name}" ${
          isAdded ? 'disabled style="color: #95a5a6;"' : ""
        }>
                  ${name} ${isAdded ? "✓ (Already added)" : ""}
                </option>`;
      }).join("")
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

    if (game === "genshin") {
      this.renderGenshinCustomModal(game, gameConfig);
    } else if (game === "hsr") {
      this.renderHSRCustomModal(game, gameConfig);
    } else if (game === "zzz") {
      this.renderZZZCustomModal(game, gameConfig);
    }
  }

  static renderGenshinCustomModal(game, gameConfig) {
    // Get materials for dropdowns from the old working code
    const commonMaterials =
      ASCENSION_MATERIALS.genshin?.filter((m) =>
        m.tags?.[0] === "common" && m.tags?.[2] === 1
      ) || [];

    const localMaterials =
      ASCENSION_MATERIALS.genshin?.filter((m) => m.tags?.[0] === "local") || [];

    const bossMaterials =
      ASCENSION_MATERIALS.genshin?.filter((m) => m.tags?.[0] === "overworld") ||
      [];

    const talentMaterials =
      ASCENSION_MATERIALS.genshin?.filter((m) =>
        m.tags?.[0] === "talent" && m.tags?.[2] === 2
      ) || [];

    const weeklyMaterials =
      ASCENSION_MATERIALS.genshin?.filter((m) => m.tags?.[0] === "weekly") ||
      [];

    window.openModal?.(`
      <div style="max-height: 80vh; overflow-y: auto;">
        <h3>Customize Character - ${gameConfig.name}</h3>
        
        <div style="margin-bottom: 15px;">
          <strong>Character Name:</strong><br>
          <input type="text" id="custom-name" placeholder="Enter character name" style="width: 100%; padding: 8px;">
        </div>
        
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
            <select id="custom-element" style="width: 100%; padding: 8px;" onchange="CharacterModalHandler.updateAutoGem()">
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
        
        <h4>Ascension Materials</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 15px;">
          <div>
            <strong>Common</strong><br>
            <select id="custom-common-select" style="width: 100%; padding: 8px;">
              <option value="">Select common material...</option>
              ${
      commonMaterials.map((m) =>
        `<option value='${
          JSON.stringify({ name: m.name, img: m.img })
        }'>${m.name}</option>`
      ).join("")
    }
              <option value='CUSTOM'>Custom Common Material</option>
            </select>
            <div id="custom-common-display" style="font-size: 12px; color: #ccc; min-height: 20px; display: flex; align-items: center; gap: 5px; margin-top: 5px;"></div>
          </div>
          <div>
            <strong>Local Specialty</strong><br>
            <select id="custom-local-select" style="width: 100%; padding: 8px;">
              <option value="">Select local specialty...</option>
              ${
      localMaterials.map((m) =>
        `<option value='${
          JSON.stringify({ name: m.name, img: m.img })
        }'>${m.name}</option>`
      ).join("")
    }
              <option value='CUSTOM'>Custom Local Specialty</option>
            </select>
            <div id="custom-local-display" style="font-size: 12px; color: #ccc; min-height: 20px; display: flex; align-items: center; gap: 5px; margin-top: 5px;"></div>
          </div>
          <div>
            <strong>Boss Material</strong><br>
            <select id="custom-boss-select" style="width: 100%; padding: 8px;">
              <option value="">Select boss material...</option>
              ${
      bossMaterials.map((m) =>
        `<option value='${
          JSON.stringify({ name: m.name, img: m.img })
        }'>${m.name}</option>`
      ).join("")
    }
              <option value='CUSTOM'>Custom Boss Material</option>
            </select>
            <div id="custom-boss-display" style="font-size: 12px; color: #ccc; min-height: 20px; display: flex; align-items: center; gap: 5px; margin-top: 5px;"></div>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 20px;">
          <div>
            <strong>Elemental Gem</strong><br>
            <div style="background: #2c3e50; padding: 10px; border-radius: 6px; margin-top: 5px;">
              <div id="custom-gem-display" style="display: flex; align-items: center; gap: 10px; justify-content: center;">
                <div style="font-size: 12px; color: #ccc; text-align: center;">
                  Select an element to auto-set gem
                </div>
              </div>
            </div>
          </div>
          <div>
            <strong>Talent Book</strong><br>
            <select id="custom-talent-select" style="width: 100%; padding: 8px;">
              <option value="">Select talent book...</option>
              ${
      talentMaterials.map((m) =>
        `<option value='${
          JSON.stringify({ name: m.name, img: m.img })
        }'>${m.name}</option>`
      ).join("")
    }
              <option value='CUSTOM'>Custom Talent Book</option>
            </select>
            <div id="custom-talent-display" style="font-size: 12px; color: #ccc; min-height: 20px; display: flex; align-items: center; gap: 5px; margin-top: 5px;"></div>
          </div>
          <div>
            <strong>Weekly Material</strong><br>
            <select id="custom-weekly-select" style="width: 100%; padding: 8px;">
              <option value="">Select weekly material...</option>
              ${
      weeklyMaterials.map((m) =>
        `<option value='${
          JSON.stringify({ name: m.name, img: m.img })
        }'>${m.name}</option>`
      ).join("")
    }
              <option value='CUSTOM'>Custom Weekly Material</option>
            </select>
            <div id="custom-weekly-display" style="font-size: 12px; color: #ccc; min-height: 20px; display: flex; align-items: center; gap: 5px; margin-top: 5px;"></div>
          </div>
        </div>
        
        <button onclick="CharacterModalHandler.saveCustomCharacterFromDropdowns('genshin')" 
                style="padding: 10px 20px; background: #2ecc71; color: white; border: none; border-radius: 6px; font-weight: bold;">
          Set Build Goal →
        </button>
        <button onclick="window.closeModal?.()" 
                style="padding: 10px 20px; background: #95a5a6; color: white; border: none; border-radius: 6px; margin-left: 10px;">
          Cancel
        </button>
      </div>
    `);

    // Initialize gem based on default element
    setTimeout(() => CharacterModalHandler.updateAutoGem(), 100);

    // Add event listeners for all dropdowns
    setTimeout(() => {
      const materialTypes = ["common", "local", "boss", "talent", "weekly"];
      materialTypes.forEach((type) => {
        const select = document.getElementById(`custom-${type}-select`);
        const display = document.getElementById(`custom-${type}-display`);

        if (select && display) {
          select.addEventListener("change", function () {
            CharacterModalHandler.handleMaterialSelection(
              type,
              this.value,
              display,
            );
          });
        }
      });
    }, 100);
  }

  static updateAutoGem() {
    const element = document.getElementById("custom-element")?.value
      ?.toLowerCase();
    const gemDisplay = document.getElementById("custom-gem-display");

    if (!gemDisplay || !element) return;

    // Find the gem for this element at tier 2
    const gemMaterial = ASCENSION_MATERIALS.genshin?.find((m) =>
      m.tags?.[0] === "gem" &&
      m.tags?.[1] === element &&
      m.tags?.[2] === 2
    );

    if (gemMaterial) {
      // Fix image path
      let imgPath = gemMaterial.img;
      if (!imgPath.startsWith("./assets/") && !imgPath.startsWith("http")) {
        imgPath = `/assets${imgPath.startsWith("/") ? "" : "/"}${imgPath}`;
      }

      // Store the gem material
      window["custom-gem"] = {
        name: gemMaterial.name,
        img: imgPath,
      };

      // Update the display
      gemDisplay.innerHTML = `
        <img src="${imgPath}" alt="${gemMaterial.name}" style="width: 32px; height: 32px; border-radius: 6px;">
        <div>
          <div style="font-weight: bold; color: #00ffff; font-size: 14px;">${gemMaterial.name}</div>
          <div style="font-size: 10px; color: #95a5a6;">Auto-set from element</div>
        </div>
      `;
    } else {
      window["custom-gem"] = null;
      gemDisplay.innerHTML = `
        <div style="font-size: 12px; color: #e74c3c; text-align: center;">
          No gem found for ${element}. Using custom fallback.
        </div>
      `;
    }
  }

  static handleMaterialSelection(type, value, displayElement) {
    if (value === "CUSTOM") {
      const customName = prompt(`Enter custom ${type} material name:`);
      if (customName) {
        const materialData = {
          name: customName,
          img: "./assets/question.webp",
        };
        window[`custom-${type}`] = materialData;
        CharacterModalHandler.updateMaterialDisplay(
          displayElement,
          materialData.name,
          materialData.img,
          true,
        );
      } else {
        // Reset if user cancels
        const select = document.getElementById(`custom-${type}-select`);
        if (select) select.value = "";
        window[`custom-${type}`] = null;
      }
    } else if (value) {
      try {
        const materialData = JSON.parse(value);
        // Fix image path for all materials
        if (
          materialData.img && !materialData.img.startsWith("./assets/") &&
          !materialData.img.startsWith("http")
        ) {
          materialData.img = `/assets${
            materialData.img.startsWith("/") ? "" : "/"
          }${materialData.img}`;
        }
        window[`custom-${type}`] = materialData;
        CharacterModalHandler.updateMaterialDisplay(
          displayElement,
          materialData.name,
          materialData.img,
          false,
        );
      } catch (e) {
        console.error("Error parsing material data:", e);
      }
    } else {
      // Empty selection
      window[`custom-${type}`] = null;
      if (displayElement) {
        displayElement.innerHTML = "";
      }
    }
  }

  static updateMaterialDisplay(displayElement, name, img, isCustom) {
    if (displayElement) {
      displayElement.innerHTML = `
        <img src="${img}" alt="${name}" style="width: 24px; height: 24px; border-radius: 4px;">
        <span>${name}${isCustom ? " (Custom)" : ""}</span>
      `;
    }
  }

  static saveCustomCharacterFromDropdowns(game) {
    const name = document.getElementById("custom-name")?.value.trim();
    if (!name) {
      alert("Please enter a character name!");
      return;
    }

    // Collect custom character data
    const customCharData = {
      name: name,
      game: game,
      picture: "./assets/profile pic.jpg",
      icon: "./assets/stick figure.png",
      isCustom: true,
    };

    // Collect custom materials based on game
    const customMats = [];

    if (game === "genshin") {
      customCharData.element = document.getElementById("custom-element")?.value;
      customCharData.weapon = document.getElementById("custom-weapon")?.value;
      customCharData.region = document.getElementById("custom-region")?.value;
      customCharData.rarity = parseInt(
        document.getElementById("custom-rarity")?.value,
      );

      // Collect materials from window object
      const materialTypes = [
        "common",
        "local",
        "boss",
        "gem",
        "talent",
        "weekly",
      ];
      materialTypes.forEach((type) => {
        const mat = window[`custom-${type}`];
        if (mat) {
          customMats.push(mat);
          customCharData[`${type}Material`] = mat;
        } else {
          // Show warning for missing required materials
          if (type !== "gem") { // Gem is auto-set, so don't warn
            console.warn(`No ${type} material selected for custom character`);
          }
        }
      });
    }

    // Store custom character data globally for build goal step
    window.currentCustomChar = customCharData;
    window.currentCustomMats = customMats;

    window.closeModal?.();
    BuildGoalHandler.setGoalForCharacter(name, game, customMats);
  }

  static renderHSRCustomModal(game, gameConfig) {
    // Simplified HSR modal for now - you can expand this later
    window.openModal?.(`
      <div style="max-height: 80vh; overflow-y: auto;">
        <h3>Customize Character - ${gameConfig.name}</h3>
        <p>HSR custom character feature coming soon!</p>
        <button onclick="window.closeModal?.()" 
                style="padding: 10px 20px; background: #95a5a6; color: white; border: none; border-radius: 6px; margin-left: 10px;">
          Cancel
        </button>
      </div>
    `);
  }

  static renderZZZCustomModal(game, gameConfig) {
    // Simplified ZZZ modal for now - you can expand this later
    window.openModal?.(`
      <div style="max-height: 80vh; overflow-y: auto;">
        <h3>Customize Character - ${gameConfig.name}</h3>
        <p>ZZZ custom character feature coming soon!</p>
        <button onclick="window.closeModal?.()" 
                style="padding: 10px 20px; background: #95a5a6; color: white; border: none; border-radius: 6px; margin-left: 10px;">
          Cancel
        </button>
      </div>
    `);
  }
}

// =================================================================
// BUILD GOAL HANDLER
// =================================================================

class BuildGoalHandler {
  static setGoalForCharacter(name, game, customMats = []) {
    const limits = GAME_LIMITS[game];
    const gameConfig = GAME_CONFIG[game];

    // For custom characters, get weapon from the stored custom data
    let weaponCategory;
    let allWeapons = [];

    if (window.currentCustomChar?.isCustom) {
      // Custom character - use weapon from custom data
      weaponCategory = window.currentCustomChar.weapon;
      allWeapons = weaponCategory
        ? ALL_WEAPONS[game]?.[weaponCategory] || []
        : [];
    } else {
      // Regular character - use data from ALL_CHARACTERS
      const charData = ALL_CHARACTERS[game]?.[name];
      weaponCategory = charData?.weapon || charData?.path || charData?.role;
      allWeapons = weaponCategory
        ? ALL_WEAPONS[game]?.[weaponCategory] || []
        : [];
    }

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
      this.createLevelSelectors(
        levelOptions,
        gameConfig.weaponLabel,
        weaponOptions,
      )
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
    const talentNames = GAME_CONFIG[game]?.talentNames || [];

    return `
      <div style="margin-bottom: 15px;">
        <strong>Talents:</strong>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
          ${
      maxLevels.map((maxLevel, i) =>
        this.createTalentInput(i, maxLevel, talentNames[i])
      ).join("")
    }
        </div>
      </div>
    `;
  }

  static createTalentInput(
    index,
    maxLevel,
    talentName = `Talent ${index + 1}`,
  ) {
    return `
      <div>
        <label>${talentName}:</label><br>
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

    // Add custom character data if it exists
    if (window.currentCustomChar?.isCustom) {
      newChar.isCustom = true;
      newChar.customData = window.currentCustomChar;
      newChar.imageUrl = window.currentCustomChar.picture;

      // Store custom metadata for easier access
      newChar.customMetadata = {
        element: window.currentCustomChar.element,
        weapon: window.currentCustomChar.weapon,
        region: window.currentCustomChar.region,
        rarity: window.currentCustomChar.rarity,
        materials: customMats,
      };

      // Also store custom materials in the main object for compatibility
      newChar.materials = customMats;
    }

    // Use the imported addCharacter function
    addCharacter(newChar);

    // Clean up temporary storage
    delete window.currentCustomChar;
    delete window.currentCustomMats;

    window.closeModal?.();

    // Refresh the character list
    const charactersPage = new CharactersPage();
    charactersPage.refreshCharacterList();

    return newChar;
  }
}

// =================================================================
// GLOBAL FUNCTION EXPORTS
// =================================================================

// Export the classes and functions to window for use in HTML onclick handlers
window.CharactersPage = CharactersPage;
window.CharacterModalHandler = CharacterModalHandler;
window.BuildGoalHandler = BuildGoalHandler;

// Keep the original function names for backward compatibility
window.openAddCharacterModal = () =>
  CharacterModalHandler.openGameSelectionModal();
window.handleGameSelection = () => CharacterModalHandler.handleGameSelection();
window.handleCharacterSelection = (game) =>
  CharacterModalHandler.handleCharacterSelection(game);
window.openCustomCharacterModal = (game) =>
  CharacterModalHandler.openCustomCharacterModal(game);
window.openMaterialSelector = CharacterModalHandler.openMaterialSelector;
window.selectMaterial = CharacterModalHandler.selectMaterial;
window.saveCustomCharacter = CharacterModalHandler.saveCustomCharacter;
window.saveCustomCharacterFromDropdowns =
  CharacterModalHandler.saveCustomCharacterFromDropdowns;
window.setGoalForCharacter = BuildGoalHandler.setGoalForCharacter;
window.saveBuildGoal = BuildGoalHandler.saveBuildGoal;
window.updateAutoGem = CharacterModalHandler.updateAutoGem;

// Helper function
window.getFullGameName = (gameKey) => GAME_CONFIG[gameKey]?.name || gameKey;

// =================================================================
// INITIALIZATION
// =================================================================

export function initCharactersScene() {
  new CharactersPage();
}

window.initCharactersScene = initCharactersScene;
