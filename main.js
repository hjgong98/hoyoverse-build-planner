// main.js
import { initCharactersScene } from "./pages/characters.js";
import { initDataScene } from "./pages/data.js";
import { initInventoryScene } from "./pages/inventory.js";
import { initCalendarScene } from "./pages/calendar.js"; // 🔁 Fixed typo: calender → calendar

// Set up global modal
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modal-content");

window.openModal = (html) => {
  modalContent.innerHTML = html;
  modal.style.display = "flex";
};

window.closeModal = () => {
  modal.style.display = "none";
};

modal?.addEventListener("click", (e) => {
  if (e.target === modal) window.closeModal();
});

// Navigation: Load scene based on name
function navigateTo(sceneName) {
  const content = document.getElementById("page-content");
  content.innerHTML = "<p>Loading...</p>";

  const scenes = {
    characters: initCharactersScene,
    data: initDataScene,
    inventory: initInventoryScene,
    calendar: initCalendarScene,
  };

  const initFn = scenes[sceneName];
  if (initFn) {
    initFn();
  } else {
    content.innerHTML = `<p>⚠️ Scene "${sceneName}" not found.</p>`;
  }
}

// On Load
document.addEventListener("DOMContentLoaded", () => {
  // Set up navigation buttons
  document.querySelectorAll("[data-page]").forEach((button) => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("data-page");
      navigateTo(page);
    });
  });

  // Initialize the first page
  navigateTo("characters");

  // Expose navigate for debugging
  window.navigateTo = navigateTo;
});
