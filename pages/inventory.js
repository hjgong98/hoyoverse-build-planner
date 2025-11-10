// pages/inventory.js

// todo list:
// - add buttons to show only one game inventory at a time
// - add search bar to filter items
// - make the amount of each item editable
export function initInventoryScene() {
  const inv = {
    genshin: ["Spirit Locket x3", "Teaching of Freedom"],
    hsr: ["Firm Arrow x2"],
    zzz: ["Ether Gear Blue"],
  };

  document.getElementById("page-content").innerHTML = `
            <h2>Inventory by Game</h2>
            <p><strong>Genshin Impact:</strong> ${formatList(inv.genshin)}</p>
            <p><strong>Honkai Star Rail:</strong> ${formatList(inv.hsr)}</p>
            <p><strong>Zenless Zone Zero:</strong> ${formatList(inv.zzz)}</p>
        `;
}

function formatList(arr) {
  return arr.length ? arr.join(", ") : "<em>Empty</em>";
}
