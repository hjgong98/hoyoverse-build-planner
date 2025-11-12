// /saved/materials-inventory.js
let materialsInventory = {};

export const loadMaterialsInventory = () => {
  const saved = localStorage.getItem("hoyoverse-materials");
  if (saved) {
    materialsInventory = JSON.parse(saved);
  } else {
    // Default empty structure
    materialsInventory = { genshin: {}, hsr: {}, zzz: {} };
  }
  return materialsInventory;
};

export const saveMaterialsInventory = () => {
  localStorage.setItem(
    "hoyoverse-materials",
    JSON.stringify(materialsInventory),
  );
};

export const addMaterial = (game, matName, count = 1) => {
  if (!materialsInventory[game]) materialsInventory[game] = {};
  materialsInventory[game][matName] = (materialsInventory[game][matName] || 0) +
    count;
  saveMaterialsInventory();
};

export const setMaterialCount = (game, matName, count) => {
  if (!materialsInventory[game]) materialsInventory[game] = {};
  materialsInventory[game][matName] = Math.max(0, Math.floor(count));
  saveMaterialsInventory();
  if (materialsInventory[game][matName] === 0) {
    delete materialsInventory[game][matName];
  }
};

export const clearAllMaterialData = () => {
  localStorage.removeItem("hoyoverse-materials");
  materialsInventory = { genshin: {}, hsr: {}, zzz: {} };
};
