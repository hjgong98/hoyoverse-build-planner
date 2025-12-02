// pages/data.js - UPDATED VERSION

import { clearAllSavedData, loadMyCharacters } from "../saved/my-characters.js";
import {
  clearAllMaterialData,
  loadMaterialsInventory,
} from "../saved/materials-inventory.js";

export function initDataScene() {
  const content = document.getElementById("page-content");
  content.innerHTML = `
    <div style="padding: 20px; max-width: 800px; margin: 0 auto;">
      <h2 style="color: #00ffff; margin-bottom: 25px;">Data Management</h2>
      
      <div style="background: #1c2b33; padding: 25px; border-radius: 12px; border: 2px solid #00ffff44; margin-bottom: 20px;">
        <h3 style="color: #00ffff; margin-bottom: 15px;">Export Data</h3>
        <p style="color: #ccc; margin-bottom: 20px;">
          Export all your character builds and inventory data to a JSON file for backup or transfer.
        </p>
        <button onclick="window.exportData()"
                style="padding: 12px 24px; background: #3498db; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold;">
          Export All Data
        </button>
      </div>
      
      <div style="background: #1c2b33; padding: 25px; border-radius: 12px; border: 2px solid #00ffff44; margin-bottom: 20px;">
        <h3 style="color: #00ffff; margin-bottom: 15px;">Import Data</h3>
        <p style="color: #ccc; margin-bottom: 20px;">
          Import character builds and inventory data from a previously exported JSON file.
        </p>
        <button onclick="window.importData()"
                style="padding: 12px 24px; background: #9b59b6; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold;">
          Import Data
        </button>
      </div>
      
      <div style="background: #1c2b33; padding: 25px; border-radius: 12px; border: 2px solid #e74c3c44;">
        <h3 style="color: #e74c3c; margin-bottom: 15px;">Clear Data</h3>
        <p style="color: #ccc; margin-bottom: 20px;">
          Permanently delete all character builds and inventory data. This action cannot be undone.
        </p>
        <button onclick="window.clearData()"
                style="padding: 12px 24px; background: #e74c3c; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold;">
          Clear All Data
        </button>
      </div>
    </div>
  `;
}

// --- EXPORTED FUNCTIONS ---

// Export all data (characters + materials)
export function exportData() {
  try {
    const characters = loadMyCharacters();
    const materials = loadMaterialsInventory();

    const dataToExport = {
      version: "2.0",
      timestamp: new Date().toISOString(),
      exportDate: new Date().toLocaleDateString(),
      characters: characters,
      materials: materials,
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hoyoverse-build-planner-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert(
      `✅ Data exported successfully!\n\nCharacters: ${characters.length}\nGames with materials: ${
        Object.keys(materials).filter((g) =>
          Object.keys(materials[g] || {}).length > 0
        ).length
      }`,
    );
  } catch (error) {
    console.error("Export failed:", error);
    alert("❌ Failed to export data. Check console for details.");
  }
}

// Import data (characters + materials)
export function importData() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.style.display = "none";
  document.body.appendChild(input);

  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      document.body.removeChild(input);
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const json = JSON.parse(evt.target.result);

        // Validate version
        if (!json.version) {
          alert("❌ Invalid data format: missing version information.");
          document.body.removeChild(input);
          return;
        }

        // Show confirmation dialog with data summary
        const charCount = json.characters ? json.characters.length : 0;
        const materialGames = json.materials
          ? Object.keys(json.materials).filter((g) =>
            Object.keys(json.materials[g] || {}).length > 0
          ).length
          : 0;

        const confirmMessage = `Import this data?\n\n` +
          `• Characters: ${charCount}\n` +
          `• Games with materials: ${materialGames}\n` +
          `• Exported: ${
            json.exportDate || json.timestamp?.split("T")[0] || "Unknown date"
          }\n\n` +
          `This will replace ALL current data.`;

        if (!confirm(confirmMessage)) {
          document.body.removeChild(input);
          return;
        }

        // Import characters
        if (json.characters && Array.isArray(json.characters)) {
          localStorage.setItem(
            "hoyoverse-builds",
            JSON.stringify(json.characters),
          );
        } else {
          localStorage.removeItem("hoyoverse-builds");
        }

        // Import materials
        if (json.materials && typeof json.materials === "object") {
          localStorage.setItem(
            "hoyoverse-materials",
            JSON.stringify(json.materials),
          );
        } else {
          localStorage.removeItem("hoyoverse-materials");
        }

        document.body.removeChild(input);

        alert(
          `✅ Data imported successfully!\n\nCharacters: ${charCount}\nMaterial games: ${materialGames}\n\nPage will now reload.`,
        );
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (err) {
        console.error("Import failed:", err);
        alert("❌ Failed to import: Invalid or corrupted JSON file.");
        document.body.removeChild(input);
      }
    };

    reader.onerror = () => {
      alert("❌ Failed to read the file.");
      document.body.removeChild(input);
    };

    reader.readAsText(file);
  };

  input.click();
}

// Clear all planner data including characters and materials
export function clearData() {
  const charCount = loadMyCharacters().length;
  const materials = loadMaterialsInventory();
  const materialCount = Object.values(materials).reduce(
    (sum, gameMats) =>
      sum + Object.values(gameMats || {}).filter((count) => count > 0).length,
    0,
  );

  const confirmMessage = `⚠️ ARE YOU ABSOLUTELY SURE? ⚠️\n\n` +
    `This will PERMANENTLY delete:\n` +
    `• ${charCount} character builds\n` +
    `• ${materialCount} material entries\n\n` +
    `This action CANNOT be undone!`;

  if (confirm(confirmMessage)) {
    clearAllSavedData();
    clearAllMaterialData();

    alert(
      `✅ All data cleared!\n\nDeleted ${charCount} character builds and ${materialCount} material entries.`,
    );
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }
}

// --- MAKE THEM AVAILABLE ON WINDOW ---
window.exportData = exportData;
window.importData = importData;
window.clearData = clearData;
