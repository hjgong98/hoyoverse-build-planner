// /components/character-details.js

// todo list:
// - edit the character details so it can be updated

// Import the data you need
import { GAME_LIMITS } from "../data/game-limits.js";

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
  const fullGameName = getFullGameName(char.game); // ✅ Full name!

  // Safety checks
  if (!char) {
    console.error("No character data provided!");
    return;
  }

  window.openModal?.(`
        <div style="text-align: left; font-size: 14px; line-height: 1.5; color: white;">
        <h3> ${char.name || "Unknown"}</h3>

        <p><strong>Game:</strong> ${fullGameName}</p>

        <p><strong>Level:</strong> ${char.currentLevel || 1} → ${
    char.goalLevel || "?"
  }</p>

        <p><strong>${weaponLabel}:</strong> <em>${
    char.weaponName || "—"
  }</em></p>

        <p><strong>${weaponLabel} Level:</strong> ${
    char.currentWeaponLevel || 1
  } → ${char.goalWeaponLevel || "?"}</p>

        <p><strong>Talents:</strong></p>
        <p style="margin-left: 16px; font-family: monospace;">
            ${
    Array.isArray(char.talentsGoal)
      ? char.talentsGoal.map((t, i) => `T${i + 1}: Lv.1 → ${t}`).join("<br>")
      : "Not set"
  }
        </p>

        <button onclick="window.closeModal?.()" style="padding: 8px 16px; font-size: 14px;">
            Close
        </button>
        </div>
    `);
}
