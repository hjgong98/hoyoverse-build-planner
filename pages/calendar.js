// pages/calendar.js

// todo list;
// - make it look like an actual calender
// - add the ability to add events
// - view builds and their start dates and projected end dates

export function initCalendarScene() {
  const events = [
    { game: "genshin", title: "Cryo Weekly Boss", day: "Monday" },
    { game: "hsr", title: "Stagnant Shadow", day: "Tue & Fri" },
    { game: "zzz", title: "Chain Event", day: "Ongoing" },
  ];

  document.getElementById("page-content").innerHTML = `
    <h2>In-Game Events</h2>
    <ul>
      ${
    events.map((e) => `
        <li><strong>${e.game.toUpperCase()}</strong>: ${e.title} → <em>${e.day}</em></li>
      `).join("")
  }
    </ul>
    <h3>Active Builds</h3>
    <p><em>No builds in progress yet. Start one from character page!</em></p>
  `;
}
