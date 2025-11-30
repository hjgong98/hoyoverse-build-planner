// pages/inventory.js

import { ASCENSION_MATERIALS } from "../data/ascension-mats.js";
import {
  addMaterial,
  loadMaterialsInventory,
  setMaterialCount,
} from "../saved/materials-inventory.js";

class InventoryManager {
  constructor() {
    this.materials = {};
    this.currentGame = "genshin";
    this.init();
  }

  init() {
    this.materials = loadMaterialsInventory();
    this.render();
  }

  render() {
    const app = document.getElementById("page-content");
    if (!app) return;

    app.innerHTML = this.createInventoryInterface();
  }

  createInventoryInterface() {
    const materialsCurrent = this.materials[this.currentGame] || {};
    const materialsToShow = this.getFilteredMaterials(materialsCurrent);

    return `
      <div style="padding: 16px; font-family: sans-serif; color: white; max-width: 100%; box-sizing: border-box;">
        <h2 style="margin: 0 0 16px; color: #00ffff; text-align: center;">Inventory</h2>
        ${this.createGameTabs()}
        ${this.createMaterialGrid(materialsToShow, materialsCurrent)}
        ${this.createAddButton()}
      </div>
    `;
  }

  getFilteredMaterials(materialsCurrent) {
    const mats = ASCENSION_MATERIALS[this.currentGame] || [];
    return mats.filter((mat) => {
      const count = materialsCurrent[mat.name] || 0;
      return count > 0;
    });
  }

  createGameTabs() {
    const games = ["genshin", "hsr", "zzz"];

    return `
      <div style="margin-bottom: 16px; display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
        ${games.map((game) => this.createGameTab(game)).join("")}
      </div>
    `;
  }

  createGameTab(game) {
    const labels = {
      genshin: "Genshin",
      hsr: "Honkai Star Rail",
      zzz: "Zenless Zone Zero",
    };

    const active = this.currentGame === game;
    return `
      <button onclick="window.inventoryManager.switchGame('${game}')"
              style="padding: 8px 14px; border: none; 
                     background: ${active ? "#00ffff" : "#1c3b5a"}; 
                     color: ${active ? "#0f1a20" : "white"}; 
                     border-radius: 6px; font-weight: ${
      active ? "bold" : "normal"
    };
                     cursor: pointer; min-width: 100px; white-space: nowrap;">
        ${labels[game]}
      </button>
    `;
  }

  createMaterialGrid(materialsToShow, materialsCurrent) {
    if (materialsToShow.length === 0) {
      return `
        <p style="text-align: center; color: #888; margin: 20px 0; font-size: 14px;">
          No materials in inventory. Click "Add Material" to get started!
        </p>
      `;
    }

    return `
      <div style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; padding: 8px; max-width: 100%; box-sizing: border-box;">
        ${
      materialsToShow.map((mat) =>
        this.renderMaterialItem(mat, materialsCurrent[mat.name] || 0)
      ).join("")
    }
      </div>
    `;
  }

  renderMaterialItem(mat, count) {
    return `
      <div class="mat-item" 
           onclick="window.inventoryManager.openEditModal('${
      this.escapeQuotes(this.currentGame)
    }', '${this.escapeQuotes(mat.name)}')"
           style="position: relative; display: inline-flex; flex-direction: column; align-items: center;
                  cursor: pointer; width: 60px; user-select: none;">
        <div style="position: relative; width: 48px; height: 48px; margin: 4px auto;">
          <img src="/assets/${mat.img}" alt="${mat.name}"
               style="width: 100%; height: 100%; object-fit: contain; border-radius: 6px;" />
          ${
      count > 0
        ? `
            <span style="position: absolute; bottom: -6px; right: -4px;
                         background: #e74c3c; color: white; font-size: 10px; font-weight: bold;
                         border-radius: 8px; padding: 0 5px; min-width: 18px; height: 18px;
                         display: flex; align-items: center; justify-content: center;">
              ${count}
            </span>
          `
        : ""
    }
        </div>
      </div>
    `;
  }

  createAddButton() {
    return `
      <div style="text-align: center; margin-top: 20px;">
        <button onclick="window.inventoryManager.openAddModal()"
                style="padding: 12px 24px; font-size: 16px; background: #2ecc71; color: white;
                       border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
          Add Material
        </button>
      </div>
    `;
  }

  switchGame(game) {
    this.currentGame = game;
    this.render();
  }

  openEditModal(game, matName) {
    const materialsCurrent = this.materials[game] || {};
    const count = materialsCurrent[matName] || 0;
    const mat = (ASCENSION_MATERIALS[game] || []).find((m) =>
      m.name === matName
    );

    if (!mat) {
      alert("⚠️ Material not found!");
      return;
    }

    window.openModal(this.createEditModalContent(mat, count, game));
  }

  createEditModalContent(mat, count, game) {
    return `
      <div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;">
        <div style="background: #16232b; border-radius: 12px; width: 280px; color: white;
                    border: 2px solid #00ffff; box-shadow: 0 0 10px rgba(0, 255, 255, 0.2);">
          <div style="padding: 20px; text-align: center;">
            <h3 style="color: #00ffff; margin: 0 0 12px; font-size: 18px;">${mat.name}</h3>
            <img src="/assets/${mat.img}" alt="${mat.name}"
                 style="width: 72px; height: 72px; object-fit: contain; border: 1px solid #3498db; border-radius: 8px; margin: 0 auto 16px; display: block;" />
            <div style="color: #ddd; margin-bottom: 10px;"><strong>Count</strong></div>
            <input id="edit-count" type="number" min="0" value="${count}"
                   style="width: 80px; padding: 10px; font-size: 16px; text-align: center;
                          border: 1px solid #3498db; background: #0f1a20; color: white; border-radius: 6px;" />
            <div style="margin-top: 20px; display: flex; justify-content: center; gap: 12px;">
              <button onclick="window.closeModal()"
                      style="padding: 8px 16px; background: #95a5a6; border: none; border-radius: 6px; color: white; font-size: 14px;">
                Cancel
              </button>
              <button onclick="window.inventoryManager.saveEdit('${
      this.escapeQuotes(game)
    }', '${this.escapeQuotes(mat.name)}')"
                      style="padding: 8px 16px; background: #2ecc71; border: none; border-radius: 6px; color: white; font-size: 14px; font-weight: bold;">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  saveEdit(game, matName) {
    const input = document.getElementById("edit-count");
    if (!input) return;

    const count = Math.max(0, parseInt(input.value) || 0);
    setMaterialCount(game, matName, count);
    this.materials = loadMaterialsInventory();
    window.closeModal();
    this.render();
  }

  openAddModal() {
    const inv = this.materials[this.currentGame] || {};
    const available = (ASCENSION_MATERIALS[this.currentGame] || []).filter(
      (mat) => !(mat.name in inv) || inv[mat.name] === 0,
    );

    window.openModal(this.createAddModalContent(available));
  }

  createAddModalContent(available) {
    const options = available.length > 0
      ? available.map((mat) =>
        `<option value="${mat.name}">${mat.name}</option>`
      ).join("")
      : `<option disabled>All materials are already in inventory</option>`;

    return `
      <div style="display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;">
        <div style="background: #16232b; border-radius: 12px; width: 300px; color: white;
                    border: 2px solid #00ffff; box-shadow: 0 0 10px rgba(0, 255, 255, 0.2);">
          <div style="padding: 20px;">
            <h3 style="color: #00ffff; margin: 0 0 16px; font-size: 18px; text-align: center;">Add Material</h3>
            <div style="margin-bottom: 12px; text-align: left;">
              <strong style="color: #ddd;">Material</strong>
              <select id="add-mat" style="width: 100%; padding: 10px; font-size: 14px; background: #0f1a20; color: white; border: 1px solid #3498db; border-radius: 6px;">
                ${options}
              </select>
            </div>
            <div style="margin-bottom: 16px; text-align: left;">
              <strong style="color: #ddd;">Amount</strong>
              <input id="add-count" type="number" min="1" value="1"
                     style="width: 75%; padding: 10px; font-size: 14px; text-align: center;
                            background: #0f1a20; color: white; border: 1px solid #3498db; border-radius: 6px;" />
            </div>
            <div style="display: flex; justify-content: center; gap: 12px;">
              <button onclick="window.closeModal()"
                      style="padding: 10px 16px; background: #7f8c8d; border: none; border-radius: 6px; color: white; font-size: 14px;">
                Cancel
              </button>
              <button onclick="window.inventoryManager.saveAdd()"
                      style="padding: 10px 16px; background: #2ecc71; border: none; border-radius: 6px; color: white; font-weight: bold; font-size: 14px;">
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  saveAdd() {
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

    addMaterial(this.currentGame, matName, count);
    this.materials = loadMaterialsInventory();
    window.closeModal();
    this.render();
  }

  escapeQuotes(str) {
    return str.replace(/'/g, "&#39;").replace(/"/g, "&quot;");
  }
}

// Initialize and export - FIXED: Properly assign to window
let inventoryManager;

export function initInventoryScene() {
  inventoryManager = new InventoryManager();
  // Make sure it's available globally
  window.inventoryManager = inventoryManager;
}

// Also add direct exports for the methods that might be called from HTML
window.inventoryManagerMethods = {
  switchGame: (game) => inventoryManager?.switchGame(game),
  openAddModal: () => inventoryManager?.openAddModal(),
  openEditModal: (game, matName) =>
    inventoryManager?.openEditModal(game, matName),
  saveEdit: (game, matName) => inventoryManager?.saveEdit(game, matName),
  saveAdd: () => inventoryManager?.saveAdd(),
};
