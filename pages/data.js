// pages/data.js

// todo list:
// - export data button
// - import data button

import { clearAllSavedData } from "../saved/my-characters.js";
import { clearAllMaterialData } from "../saved/materials-inventory.js";

export function initDataScene() {
  const content = document.getElementById("page-content");
  content.innerHTML = `
            <h2>Data Management</h2>
            <button onclick="window.exportData?.()">
            Export Build Data
            </button> <br><br>
            <button onclick="window.importData?.()">
            Import from JSON
            </button> <br><br>
            <button onclick="window.clearData?.()" style="color:red;">
            Clear All Data
            </button>
        `;
}

// --- EXPORTED FUNCTIONS ---

// Export so main.js or others can use it
export function exportData() {
  const myCharacters = JSON.parse(localStorage.getItem("hoyoverse-builds")) ||
    [];
  const dataToExport = {
    version: "1.0",
    timestamp: new Date().toISOString(),
    characters: myCharacters,
  };
  const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "hoyoverse-build-planner-data.json";
  a.click();
  URL.revokeObjectURL(url);
  alert("Data exported successfully!");
}

export function importData() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const json = JSON.parse(evt.target.result);

        // Validate structure
        if (!Array.isArray(json.characters)) {
          alert("Invalid data format: expected 'characters' array.");
          return;
        }

        // Save to localStorage
        localStorage.setItem(
          "hoyoverse-builds",
          JSON.stringify(json.characters),
        );
        alert(`Successfully imported ${json.characters.length} character(s)!`);
        window.location.reload();
      } catch (err) {
        console.error(err);
        alert("🚫 Failed to import: Invalid or corrupted JSON file.");
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

// Clear all planner data including characters
export function clearData() {
  if (
    confirm(
      "⚠️ Are you sure you want to delete ALL saved builds? This cannot be undone.⚠️ ",
    )
  ) {
    clearAllSavedData();
    clearAllMaterialData();
    alert("All data cleared! Starting fresh.");
    window.location.reload();
  }
}

// --- MAKE THEM AVAILABLE ON WINDOW ---
window.exportData = exportData;
window.importData = importData;
window.clearData = clearData;
