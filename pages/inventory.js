// pages/inventory.js

import { ASCENSION_MATERIALS } from "../data/ascension-mats.js";
import {
  addMaterial,
  loadMaterialsInventory,
  setMaterialCount,
} from "../saved/materials-inventory.js";

let materials = {};
let currentGame = "genshin";

export function initInventoryScene() {
  materials = loadMaterialsInventory();
  currentGame = "genshin";
  render();
}

function render() {
  const app = document.getElementById("page-content");
  if (!app) return;

  const materialsCurrent = materials[currentGame] || {};
  const mats = ASCENSION_MATERIALS[currentGame] || [];

  // Group logic
  const groups = {};
  const ungrouped = [];

  mats.forEach((mat) => {
    if (mat.tags?.[1] && typeof mat.tags?.[2] !== "undefined") {
      const category = mat.tags[1];
      if (!groups[category]) groups[category] = [];
      groups[category].push(mat);
    } else {
      ungrouped.push(mat);
    }
  });

  Object.keys(groups).forEach((key) => {
    groups[key].sort((a, b) => parseInt(a.tags[2]) - parseInt(b.tags[2]));
  });

  // Flatten all materials
  const allMats = [...ungrouped, ...Object.values(groups).flat()];

  // Render material grid (responsive flex-wrap)
  const materialGrid = `
    <div style="
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: center;
      padding: 8px;
      max-width: 100%;
      box-sizing: border-box;">
      ${
    allMats.map((mat) => {
      const count = materialsCurrent[mat.name] || 0;
      return renderMaterialItem(mat, count);
    }).join("")
  }
    </div>
  `;

  app.innerHTML = `
    <div style="padding: 16px; font-family: sans-serif; color: white; max-width: 100%; box-sizing: border-box;">
      <h2 style="margin: 0 0 16px; color: #00ffff; text-align: center;">Inventory</h2>

      <!-- Game Tabs -->
      <div style="margin-bottom: 16px; display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
        ${
    ["genshin", "hsr", "zzz"]
      .map((game) => {
        const label = gameLabel(game);
        const active = currentGame === game;
        return `
              <button onclick="window.switchGame('${game}')"
                      style="padding: 8px 14px; border: none; 
                             background: ${active ? "#00ffff" : "#1c3b5a"}; 
                             color: ${active ? "#0f1a20" : "white"}; 
                             border-radius: 6px; font-weight: ${
          active ? "bold" : "normal"
        };
                             cursor: pointer; min-width: 100px; white-space: nowrap;">
                ${label}
              </button>`;
      })
      .join("")
  }
      </div>

      <!-- Responsive Material Grid -->
      ${
    allMats.length > 0 ? materialGrid : `
        <p style="text-align: center; color: #888; margin: 20px 0; font-size: 14px;">
          No materials tracked yet.
        </p>
      `
  }

      <!-- Add Button -->
      <div style="text-align: center; margin-top: 20px;">
        <button onclick="window.openAddModal()"
                style="padding: 12px 24px; font-size: 16px; background: #2ecc71; color: white;
                       border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
          Add Material
        </button>
      </div>
    </div>
  `;
}

function renderMaterialItem(mat, count) {
  return `
    <div class="mat-item" 
         onclick="window.openEditModal('${escapeQuotes(currentGame)}', '${
    escapeQuotes(mat.name)
  }')"
         style="position: relative; display: inline-flex; flex-direction: column; align-items: center;
                cursor: pointer; width: 60px; user-select: none;">
      <div style="position: relative; width: 48px; height: 48px; margin: 4px auto;">
        <img src="/data/assets/${mat.img}" alt="${mat.name}"
             style="width: 100%; height: 100%; object-fit: contain; border-radius: 6px;" />
        ${
    count > 0
      ? `
          <span style="position: absolute; bottom: -6px; right: -4px;
                       background: #e74c3c; color: white; font-size: 10px; font-weight: bold;
                       border-radius: 8px; padding: 0 5px; min-width: 18px; height: 18px;
                       display: flex; align-items: center; justify-content: center;">
            ${count}
          </span>`
      : ""
  }
      </div>
    </div>
  `;
}

// 🌐 Switch Game
window.switchGame = (game) => {
  currentGame = game;
  render();
};

// ✅ Edit Modal (Centered)
window.openEditModal = (game, matName) => {
  const materialsCurrent = materials[game] || {};
  const count = materialsCurrent[matName] || 0;
  const mat = (ASCENSION_MATERIALS[game] || []).find((m) => m.name === matName);
  if (!mat) {
    alert("⚠️ Material not found!");
    return;
  }

  window.openModal(`
    <div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;">
      <div style="background: #16232b; border-radius: 12px; width: 280px; color: white;
                  border: 2px solid #00ffff; box-shadow: 0 0 10px rgba(0, 255, 255, 0.2);">
        <div style="padding: 20px; text-align: center;">
          <h3 style="color: #00ffff; margin: 0 0 12px; font-size: 18px;">${matName}</h3>
          <img src="/data/assets/${mat.img}" alt="${mat.name}"
               style="width: 72px; height: 72px; object-fit: contain; border: 1px solid #3498db; border-radius: 8px; margin: 0 auto 16px; display: block;" />
          
          <div style="color: #ddd; margin-bottom: 10px;">
            <strong>Count</strong>
          </div>
          <input id="edit-count" type="number" min="0" value="${count}"
                 style="width: 80px; padding: 10px; font-size: 16px; text-align: center;
                        border: 1px solid #3498db; background: #0f1a20; color: white; border-radius: 6px;" />

          <div style="margin-top: 20px; display: flex; justify-content: center; gap: 12px;">
            <button onclick="window.closeModal()"
                    style="padding: 8px 16px; background: #95a5a6; border: none; border-radius: 6px; color: white; font-size: 14px;">
              Cancel
            </button>
            <button onclick="window.saveEdit('${escapeQuotes(game)}', '${
    escapeQuotes(matName)
  }')"
                    style="padding: 8px 16px; background: #2ecc71; border: none; border-radius: 6px; color: white; font-size: 14px; font-weight: bold;">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  `);
};

window.saveEdit = (game, matName) => {
  const input = document.getElementById("edit-count");
  if (!input) return;
  const count = Math.max(0, parseInt(input.value) || 0);
  setMaterialCount(game, matName, count);
  materials = loadMaterialsInventory();
  window.closeModal();
  render();
};

// ✅ Add Modal (Centered)
window.openAddModal = () => {
  const inv = materials[currentGame] || {};
  const available = (ASCENSION_MATERIALS[currentGame] || []).filter(
    (mat) => !(mat.name in inv) || inv[mat.name] === 0,
  );

  const options = available.length > 0
    ? available.map((mat) => `<option value="${mat.name}">${mat.name}</option>`)
      .join("")
    : `<option disabled>No untracked materials</option>`;

  window.openModal(`
    <div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;">
      <div style="background: #16232b; border-radius: 12px; width: 300px; color: white;
                  border: 2px solid #00ffff; box-shadow: 0 0 10px rgba(0, 255, 255, 0.2);">
        <div style="padding: 20px;">
          <h3 style="color: #00ffff; margin: 0 0 16px; font-size: 18px; text-align: center;">➕ Add Material</h3>

          <div style="margin-bottom: 12px; text-align: left;">
            <strong style="color: #ddd;">Material</strong>
            <select id="add-mat" style="width: 100%; padding: 10px; font-size: 14px; background: #0f1a20; color: white; border: 1px solid #3498db; border-radius: 6px;">
              ${options}
            </select>
          </div>

          <div style="margin-bottom: 16px; text-align: left;">
            <strong style="color: #ddd;">Amount</strong>
            <input id="add-count" type="number" min="1" value="1"
                   style="width: 100%; padding: 10px; font-size: 14px; text-align: center;
                          background: #0f1a20; color: white; border: 1px solid #3498db; border-radius: 6px;" />
          </div>

          <div style="display: flex; justify-content: center; gap: 12px;">
            <button onclick="window.closeModal()"
                    style="padding: 10px 16px; background: #7f8c8d; border: none; border-radius: 6px; color: white; font-size: 14px;">
              Cancel
            </button>
            <button onclick="window.saveAdd()"
                    style="padding: 10px 16px; background: #2ecc71; border: none; border-radius: 6px; color: white; font-weight: bold; font-size: 14px;">
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  `);
};

window.saveAdd = () => {
  const select = document.getElementById("add-mat");
  if (
    !select || !select.value || select.options[select.selectedIndex]?.disabled
  ) {
    alert("Please select a valid material!");
    return;
  }
  const matName = select.value;
  const input = document.getElementById("add-count");
  const count = Math.max(1, parseInt(input.value) || 1);
  addMaterial(currentGame, matName, count);
  materials = loadMaterialsInventory();
  window.closeModal();
  render();
};

// Helpers
function escapeQuotes(str) {
  return str.replace(/'/g, "&#39;").replace(/"/g, "&quot;");
}

function gameLabel(game) {
  return {
    genshin: "Genshin",
    hsr: "Honkai Star Rail",
    zzz: "Zenless Zone Zero",
  }[game] || game;
}
