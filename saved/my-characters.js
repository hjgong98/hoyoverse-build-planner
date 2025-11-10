// /saved/my-characters.js
let myCharacters = [];

// Load, save, add
export const loadMyCharacters = () => {
  const saved = localStorage.getItem("hoyoverse-builds");
  if (saved) {
    myCharacters = JSON.parse(saved);
  }
  return myCharacters;
};

export const saveMyCharacters = () => {
  localStorage.setItem("hoyoverse-builds", JSON.stringify(myCharacters));
};

export const addCharacter = (char) => {
  char.id = Date.now();
  myCharacters.push(char);
  saveMyCharacters();
  return char;
};

export const getCharacterById = (id) => {
  return myCharacters.find((c) => c.id == id);
};

// Clear all data
export function clearAllSavedData() {
  localStorage.removeItem("hoyoverse-builds");
  myCharacters = [];
}
