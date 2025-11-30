// main.js
import { initCharactersScene } from "./pages/characters.js";
import { initDataScene } from "./pages/data.js";
import { initInventoryScene } from "./pages/inventory.js";
import { initCalendarScene } from "./pages/calendar.js";

class App {
  constructor() {
    this.modal = document.getElementById("modal");
    this.modalContent = document.getElementById("modal-content");
    this.scenes = {
      characters: initCharactersScene,
      data: initDataScene,
      inventory: initInventoryScene,
      calendar: initCalendarScene,
    };

    this.init();
  }

  init() {
    this.setupModal();
    this.setupNavigation();
    this.navigateTo("characters");

    // Expose for debugging
    window.navigateTo = this.navigateTo.bind(this);
  }

  setupModal() {
    window.openModal = (html) => {
      this.modalContent.innerHTML = html;
      this.modal.style.display = "flex";
    };

    window.closeModal = () => {
      this.modal.style.display = "none";
    };

    this.modal?.addEventListener("click", (e) => {
      if (e.target === this.modal) window.closeModal();
    });
  }

  setupNavigation() {
    document.querySelectorAll("[data-page]").forEach((button) => {
      button.addEventListener("click", () => {
        const page = button.getAttribute("data-page");
        this.navigateTo(page);
      });
    });
  }

  navigateTo(sceneName) {
    const content = document.getElementById("page-content");
    content.innerHTML = "<p>Loading...</p>";

    const initFn = this.scenes[sceneName];
    if (initFn) {
      initFn();
    } else {
      content.innerHTML = `<p>⚠️ Scene "${sceneName}" not found.</p>`;
    }
  }
}

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new App();
});
