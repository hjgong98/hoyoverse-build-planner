// /pages/characters.js

// todo list:
// - edit custom character so that it asks what kind of mats
// - edit set build goal so that it lets me select a weapon from a list
// - edit set build goal so that it shows talents names of a specific character

import { addCharacter, loadMyCharacters } from "../saved/my-characters.js";
import { ALL_CHARACTERS } from "../data/all-characters.js";
import { GAME_LIMITS } from "../data/game-limits.js";
import { ASCENSION_MATERIALS } from "../data/ascension-mats.js";
import { ALL_WEAPONS } from "../data/all-weapons.js"; // ← NEW!
import { renderCharacterDetail } from "../components/character-details.js";

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
        <button onclick="window.handleGameSelection?.()">Next →</button>
        <button onclick="window.closeModal?.()">Cancel</button>
    `);
};

// Render the list: [Ayaka][Anby Demara][+] etc.
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
  const characters = ALL_CHARACTERS[game] || [];
  window.openModal?.(`
        <h3>Select Character</h3>
        <p>Game: <strong>${fullName}</strong></p>
        <p><strong>Pick a character:</strong></p>
        <select id="select-character">
        ${
    characters.map((c) => `<option value="${c.name}">${c.name}</option>`).join(
      "",
    )
  }
        <option value="custom">🔧 Custom Character</option>
        </select>
        <br><br>
        <button onclick="window.handleCharacterSelection?.('${game}')">Next →</button>
        <button onclick="window.closeModal?.()">Cancel</button>
    `);
};

// Step 3: Handle selected or custom
window.handleCharacterSelection = (game) => {
  const name = document.getElementById("select-character")?.value;
  if (name === "custom") {
    const fullName = getFullGameName(game);
    window.openModal?.(`
        <h3>Create Custom Character</h3>
        <p>Game: <strong>${fullName}</strong></p>
        <p><strong>Name:</strong></p>
        <input type="text" id="custom-name" placeholder="Enter name" />
        <br><br>
        <p><strong>Ascension Materials (comma-separated):</strong></p>
        <input type="text" id="custom-mats" placeholder="e.g. Ether Gear, Instinct Data" />
        <br><br>
        <button onclick="window.saveCustomAndSetGoal?.('${game}')">Set Goal →</button>
        <button onclick="window.closeModal?.()">Cancel</button>
        `);
  } else {
    window.setGoalForCharacter?.(name, game, []);
  }
};

// Save custom and move to goal
window.saveCustomAndSetGoal = (game) => {
  const name = document.getElementById("custom-name")?.value.trim();
  const matsInput = document.getElementById("custom-mats")?.value;
  const materials = matsInput ? matsInput.split(",").map((m) => m.trim()) : [];
  if (!name) {
    alert("⚠️ Please enter a name!");
    return;
  }
  window.setGoalForCharacter?.(name, game, materials);
};

// Step 4: Set Build Goal
window.setGoalForCharacter = (name, game, customMats = []) => {
  const limits = GAME_LIMITS[game];
  const fullName = getFullGameName(game);

  // Extract character's weapon/path/weapon type
  const charData = ALL_CHARACTERS[game]?.find((c) => c.name === name);
  const typeKey = game === "hsr" ? "path" : game === "zzz" ? "weapon" : "type";
  const characterType = charData?.[typeKey] || null;

  // Get compatible weapons
  const allWeapons = characterType && ALL_WEAPONS[game]?.[characterType]
    ? ALL_WEAPONS[game][characterType]
    : [];

  const weaponOptions = allWeapons.length > 0
    ? allWeapons.map((w) => `<option value="${w}">${w}</option>`).join("")
    : `<option value="">(No recommended weapons)</option>`;

  // HSR Traces Section
  const hsrTraceSection = game === "hsr"
    ? `
        <br><br>
        <p><strong>Traces:</strong></p>
        <label><input type="checkbox" id="major-traces" checked> 🌟 Upgrade Major Traces</label><br>
        <label><input type="checkbox" id="minor-traces" checked> 🔹 Upgrade Minor Traces</label>
        <br><br>
    `
    : "";

  const weaponLabel = limits.weaponLabel;

  window.openModal?.(`
        <h3>Set Build Goal: ${name}</h3>
        <p>Game: <strong>${fullName}</strong></p>
        <p><strong>Character Level:</strong></p>
        <input type="number" id="char-level" min="1" max="${limits.maxCharLevel}" value="${limits.maxCharLevel}">
        / ${limits.maxCharLevel}
        <br><br>
        <p><strong>${weaponLabel}:</strong></p>
        <select id="weapon-name">
        <option value="">Choose one...</option>
        ${weaponOptions}
        </select>
        <br><br>
        <input type="number" id="weapon-level" min="1" max="${limits.maxWeaponLevel}" value="${limits.maxWeaponLevel}">
        / ${limits.maxWeaponLevel}
        <br><br>
        <p><strong>Talents:</strong> (${limits.talentCount} total, max ${limits.maxTalent})</p>
        ${
    Array(limits.talentCount)
      .fill(0)
      .map((_, i) => `
            <input type="number" id="talent-${i}" min="1" max="${limits.maxTalent}" value="${limits.maxTalent}" style="width: 60px;">
        `)
      .join(" ")
  }
        ${hsrTraceSection}
        <br>
        <button onclick="window.saveBuildGoal?.('${name}', '${game}', ${
    JSON.stringify(customMats)
  })" style="font-weight:bold;">
        ✅ Save Build
        </button>
        <button onclick="window.closeModal?.()">Cancel</button>
    `);
};

// Step 5: Save the full build
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
