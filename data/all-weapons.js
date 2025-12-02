// /data/all-weapons.js

// todo list:
// - add all weapons
// - add their additional subs and passives

export const ALL_WEAPONS = {
  genshin: {
    Sword: [
      {
        name: "Dull Blade",
        rarity: 1,
        baseATK: 185,
        stat: { type: "none", value: 0 },
        passive: { description: "none" },
        image: "/assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Silver Sword",
        rarity: 2,
        baseATK: 243,
        stat: { type: "none", value: 0 },
        passive: { description: "none" },
        image: "/assets/genshin/weapons/Silver Sword.webp",
      },
      {
        name: "Cool Steel",
        rarity: 3,
        baseATK: 401,
        stat: { type: "ATK", value: 35.2 },
        passive: {
          description:
            "Increases DMG against opponents affected by Hydro or Cryo by 12~24%.",
        },
        image: "/assets/genshin/weapons/Cool Steel.webp",
      },
      {
        name: "Dark Iron Sword",
        rarity: 3,
        baseATK: 401,
        stat: { type: "Elemental Mastery", value: 141 },
        passive: {
          description:
            "Upon causing an Overloaded, Superconduct, Electro-Charged, Quicken, Aggravate, Hyperbloom, Lunar-Charged, or Electro-infused Swirl reaction, ATK is increased by 20% - 30% for 12s.",
        },
        image: "/assets/genshin/weapons/Dark Iron Sword.webp",
      },
      {
        name: "Fillet Blade",
        rarity: 3,
        baseATK: 401,
        stat: { type: "ATK", value: 35.2 },
        passive: {
          description:
            "On hit, has 50% chance to deal 240~400% ATK DMG to a single enemy. Can only occur once every 15~11s.",
        },
        image: "/assets/genshin/weapons/Fillet Blade.webp",
      },
      {
        name: "Harbinger of Dawn",
        rarity: 3,
        baseATK: 401,
        stat: { type: "CRIT DMG", value: 46.9 },
        passive: { type: "CRIT Rate", value: [14, 28], description: "none" },
        image: "/assets/genshin/weapons/Harbinger of Dawn.webp",
      },
      {
        name: "Skyrider Sword",
        rarity: 3,
        baseATK: 354,
        stat: { type: "Energy Recharge", value: 51.7 },
        passive: {
          description:
            "Using an Elemental Burst grants a 12~24% increase in ATK and Movement SPD for 15s.",
        },
        image: "/assets/genshin/weapons/Skyrider Sword.webp",
      },
      {
        name: "Traveler's Handy Sword",
        rarity: 3,
        baseATK: 401,
        stat: { type: "DEF", value: 29.3 },
        passive: {
          type: "none",
          value: 0,
          description:
            "Each Elemental Orb or Particle collected restores 1~2% HP.",
        },
        image: "/assets/genshin/weapons/Traveler's Handy Sword.webp",
      },
      {
        name: "Amenoma Kageuchi",
        rarity: 4,
        baseATK: 454,
        stat: { type: "ATK", value: 55.1 },
        passive: {
          type: "none",
          value: 0,
          description:
            "After casting an Elemental Skill, gain 1 Succession Seed. This effect can be triggered once every 5s. The Succession Seed lasts for 30s. Up to 3 Succession Seeds may exist simultaneously. After using an Elemental Burst, all Succession Seeds are consumed and after 2s, the character regenerates 6~12 Energy for each seed consumed.",
        },
        image: "/assets/genshin/weapons/Amenoma Kageuchi.webp",
      },
      {
        name: "Blackcliff Longsword",
        rarity: 4,
        baseATK: 565,
        stat: { type: "CRIT DMG", value: 36.8 },
        passive: {
          description:
            "After defeating an opponent, ATK is increased by 12~24% for 30s. This effect has a maximum of 3 stacks, and the duration of each stack is independent of the others.",
        },
        image: "/assets/genshin/weapons/Blackcliff Longsword.webp",
      },
      {
        name: "Calamity of Eshu",
        rarity: 4,
        baseATK: 565,
        stat: { type: "ATK", value: 27.6 },
        passive: {
          description:
            "While characters are protected by a Shield, DMG dealt by Normal and Charged Attacks is increased by 20~40%, and Normal and Charged Attack CRIT Rate is increased by 8~16%.",
        },
        image: "/assets/genshin/weapons/Calamity of Eshu.webp",
      },
      {
        name: "Cinnabar Spindle",
        rarity: 4,
        baseATK: 454,
        stat: { type: "E ernergy recharge", value: 0 },
        passive: {
          description:
            "Elemental Skill DMG is increased by 40~80% of DEF. The effect will be triggered no more than once every 1.5s and will be cleared 0.1s after the Elemental Skill deals DMG.",
        },
        image: "/assets/genshin/weapons/Cinnabar Spindle.webp",
      },
      {
        name: "Favonius Sword",
        rarity: 4,
        baseATK: 454,
        stat: { type: "Energy Recharge", value: 61.3 },
        passive: {
          description:
            "CRIT hits have a 60~100% chance to generate a small amount of Elemental Particles, which will regenerate 6 Energy for the character. Can only occur once every 12~6s.",
        },
        image: "/assets/genshin/weapons/Favonius Sword.webp",
      },
      {
        name: "Festering Desire",
        rarity: 4,
        baseATK: 510,
        stat: { type: "Energy Recharge", value: 45.9 },
        passive: {
          description:
            "Increases Elemental Skill DMG by 16~32% and Elemental Skill CRIT Rate by 6~12%.",
        },
        image: "/assets/genshin/weapons/Festering Desire.webp",
      },
      {
        name: "Finale of the Deep",
        rarity: 4,
        baseATK: 565,
        stat: { type: "ATK", value: 27.6 },
        passive: {
          description:
            "When using an Elemental Skill, ATK will be increased by 12~24% for 15s, and a Bond of Life worth 25% of Max HP will be granted. This effect can be triggered once every 10s. When the Bond of Life is cleared, a maximum of 150~300 ATK will be gained based on 2.4~4.8% of the total amount of the Life Bond cleared, lasting for 15s.",
        },
        image: "/assets/genshin/weapons/Finale of the Deep.webp",
      },
      {
        name: "Fleuve Cendre Ferryman",
        rarity: 4,
        baseATK: 510,
        stat: { type: "Energy Recharge", value: 45.9 },
        passive: {
          description:
            "Increases Elemental Skill CRIT Rate by 8~16%. Additionally, increases Energy Recharge by 16~32% for 5s after using an Elemental Skill.",
        },
        image: "/assets/genshin/weapons/Fleuve Cendre Ferryman.webp",
      },
      {
        name: "Flute of Ezpitzal",
        rarity: 4,
        baseATK: 454,
        stat: { type: "DEF", value: 69.0 },
        passive: {
          description:
            "Using an Elemental Skill increases DEF by 16~32% for 15s.",
        },
        image: "/assets/genshin/weapons/Flute of Ezpitzal.webp",
      },
      {
        name: "Iron Sting",
        rarity: 4,
        baseATK: 510,
        stat: { type: "Elemental Mastery", value: 165 },
        passive: {
          description:
            "Dealing Elemental DMG increases all DMG by 6~12% for 6s. Max 2 stacks. Can only occur once every 1s.",
        },
        image: "/assets/genshin/weapons/Iron Sting.webp",
      },
      {
        name: "Kagotsurube Isshin",
        rarity: 4,
        baseATK: 510,
        stat: { type: "ATK", value: 41.3 },
        passive: {
          description:
            "When a Normal, Charged, or Plunging Attack hits an opponent, it will whip up a Hewing Gale, dealing AoE DMG equal to 180% of ATK and increasing ATK by 15% for 8s. This effect can be triggered once every 8s.",
        },
        image: "/assets/genshin/weapons/Kagotsurube Isshin.webp",
      },
      {
        name: "Lion's Roar",
        rarity: 4,
        baseATK: 510,
        stat: { type: "ATK", value: 41.3 },
        passive: {
          description:
            "Increases DMG against enemies affected by Pyro or Electro by 20~36%.",
        },
        image: "/assets/genshin/weapons/Lion's Roar.webp",
      },
      {
        name: "Moonweaver's Dawn",
        rarity: 4,
        baseATK: 565,
        stat: { type: "ATK", value: 27.6 },
        passive: {
          description:
            "Increases Elemental Burst DMG by 20~40%. When the equipping character's Energy Capacity does not exceed 60/40, their Elemental Burst DMG is increased by an additional 16%/28~32%/56%.",
        },
        image: "/assets/genshin/weapons/Moonweaver's Dawn.webp",
      },
      {
        name: "Cool Steel",
        rarity: 3,
        baseATK: 401,
        stat: { type: "none", value: 0 },
        passive: { description: "none" },
        image: "/assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Royal Longsword",
        rarity: 4,
        baseATK: 510,
        stat: { type: "ATK", value: 41.3 },
        passive: {
          description:
            "Upon dealing damage to an opponent, increases CRIT Rate by 8~16%. Max 5 stacks. A CRIT hit removes all existing stacks.",
        },
        image: "/assets/genshin/weapons/Royal Longsword.webp",
      },
      {
        name: "Sacrificial Sword",
        rarity: 4,
        baseATK: 401,
        stat: { type: "Energy Recharge", value: 61.3 },
        passive: {
          description:
            "After dealing damage to an opponent with an Elemental Skill, the skill has a 40~80% chance to end its own CD. Can only occur once every 30~16s.",
        },
        image: "/assets/genshin/weapons/Sacrificial Sword.webp",
      },
      {
        name: "Cool Steel",
        rarity: 3,
        baseATK: 401,
        stat: { type: "none", value: 0 },
        passive: { description: "none" },
        image: "/assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Serenity's Call",
        rarity: 4,
        baseATK: 454,
        stat: { type: "Energy Recharge", value: 61.3 },
        passive: {
          description:
            "Upon causing an Elemental Reaction, increases Max HP by 16~32% for 12s. Moonsign: Ascendant Gleam: Max HP from this effect is further increased by 16~32%. This effect can be triggered even if the equipping character is off-field.",
        },
        image: "/assets/genshin/weapons/Serenity's Call.webp",
      },
      {
        name: "Cool Steel",
        rarity: 3,
        baseATK: 401,
        stat: { type: "none", value: 0 },
        passive: { description: "none" },
        image: "/assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Sword of Descension",
        rarity: 4,
        baseATK: 440,
        stat: { type: "ATK", value: 35.2 },
        passive: {
          type: "none",
          value: 0,
          description:
            "Hitting enemies with Normal or Charged Attacks grants a 50% chance to deal 200% ATK as DMG in a small AoE. This effect can only occur once every 10s. Additionally, if the Traveler equips the Sword of Descension, their ATK is increased by 66.",
        },
        image: "/assets/genshin/weapons/Sword of Descension.webp",
      },
      {
        name: "Sword of Narzissenkreuz",
        rarity: 4,
        baseATK: 510,
        stat: { type: "ATK", value: 51.3 },
        passive: {
          description:
            "When the equipping character does not have an Arkhe: When Normal Attacks, Charged Attacks, or Plunging Attacks strike, a Pneuma or Ousia energy blast will be unleashed, dealing 160~320% of ATK as DMG. This effect can be triggered once every 12s. The energy blast type is determined by the current type of the Sword of Narzissenkreuz.",
        },
        image: "/assets/genshin/weapons/Sword of Narzissenkreuz.webp",
      },
      {
        name: "Cool Steel",
        rarity: 3,
        baseATK: 401,
        stat: { type: "none", value: 0 },
        passive: { description: "none" },
        image: "/assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Cool Steel",
        rarity: 3,
        baseATK: 401,
        stat: { type: "none", value: 0 },
        passive: { description: "none" },
        image: "/assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Cool Steel",
        rarity: 3,
        baseATK: 401,
        stat: { type: "none", value: 0 },
        passive: { description: "none" },
        image: "/assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Cool Steel",
        rarity: 3,
        baseATK: 401,
        stat: { type: "none", value: 0 },
        passive: { description: "none" },
        image: "/assets/genshin/weapons/Dull Blade.webp",
      },
    ],
    Claymore: [
      {
        name: "Wolf's Gravestone",
        rarity: 5,
        stat: { type: "none", value: 0 },
        passive: { description: "none" },
        image: "/assets/genshin/weapons/Dull Blade.webp",
      },
      { name: "The Unforged", rarity: 5, stat: "ATK" },
      { name: "Song of Broken Pines", rarity: 5, stat: "Physical DMG" },
      { name: "Redhorn Stonethresher", rarity: 5, stat: "DEF, CRIT DMG" },
      { name: "Beacon of the Reed Sea", rarity: 5, stat: "CRIT Rate" },
      { name: "Skyward Pride", rarity: 5, stat: "Energy Recharge" },
      { name: "Serpent Spine", rarity: 4, stat: "CRIT Rate" },
      { name: "Sacrificial Greatsword", rarity: 4, stat: "Energy Recharge" },
      { name: "Favonius Greatsword", rarity: 4, stat: "Energy Recharge" },
      { name: "Rainslasher", rarity: 4, stat: "Elemental Mastery" },
      { name: "Luxurious Sea-Lord", rarity: 4, stat: "ATK" },
      { name: "Mailed Flower", rarity: 4, stat: "Elemental Mastery" },
    ],
    Polearm: [
      { name: "Staff of Homa", rarity: 5, stat: "HP, CRIT DMG" },
      { name: "Engulfing Lightning", rarity: 5, stat: "Energy Recharge" },
      {
        name: "Calamity Queller",
        rarity: 5,
        baseATK: 701,
        stat: { type: "ATK", value: 16.5 },
        passive: {
          description:
            "Gain 12% All Elemental DMG Bonus. Obtain Consummation for 20s after using an Elemental Skill, causing ATK to increase by 3.2% per second. This ATK increase has a maximum of 6 stacks. When the character equipped with this weapon is not on the field, Consummation's ATK increase is doubled.",
        },
        image: "/assets/genshin/weapons/Calamity Queller.webp",
      },
      { name: "Primordial Jade Winged-Spear", rarity: 5, stat: "CRIT Rate" },
      { name: "Vortex Vanquisher", rarity: 5, stat: "ATK" },
      { name: "Skyward Spine", rarity: 5, stat: "Energy Recharge" },
      { name: "The Catch", rarity: 4, stat: "Energy Recharge" },
      { name: "Favonius Lance", rarity: 4, stat: "Energy Recharge" },
      {
        name: "Deathmatch",
        rarity: 4,
        baseATK: 701,
        stat: { type: "Crit Rate", value: 36.8 },
        passive: {
          description:
            "f there are at least 2 opponents nearby, ATK is increased by 16~32% and DEF is increased by 16~32%. If there are fewer than 2 opponents nearby, ATK is increased by 24~48%.",
        },
        image: "/assets/genshin/weapons/Deathmatch.webp",
      },
      { name: "Dragon's Bane", rarity: 4, stat: "Elemental Mastery" },
      { name: "Lithic Spear", rarity: 4, stat: "ATK" },
      { name: "Missive Windspear", rarity: 4, stat: "ATK" },
      { name: "Ballad of the Fjords", rarity: 4, stat: "CRIT Rate" },
    ],
    Catalyst: [
      { name: "Lost Prayer to the Sacred Winds", rarity: 5, stat: "CRIT Rate" },
      { name: "Skyward Atlas", rarity: 5, stat: "ATK" },
      { name: "Memory of Dust", rarity: 5, stat: "ATK" },
      { name: "Everlasting Moonglow", rarity: 5, stat: "HP" },
      { name: "Kagura's Verity", rarity: 5, stat: "CRIT DMG" },
      { name: "Tulaytullah's Remembrance", rarity: 5, stat: "CRIT DMG" },
      {
        name: "A Thousand Floating Dreams",
        rarity: 5,
        stat: "Elemental Mastery",
      },
      { name: "Cashflow Supervision", rarity: 5, stat: "CRIT Rate" },
      { name: "The Widsith", rarity: 4, stat: "CRIT DMG" },
      { name: "Sacrificial Fragments", rarity: 4, stat: "Elemental Mastery" },
      { name: "Favonius Codex", rarity: 4, stat: "Energy Recharge" },
      { name: "Solar Pearl", rarity: 4, stat: "CRIT Rate" },
      { name: "Mappa Mare", rarity: 4, stat: "Elemental Mastery" },
      { name: "Dodoco Tales", rarity: 4, stat: "ATK" },
      { name: "Oathsworn Eye", rarity: 4, stat: "ATK" },
      { name: "Ballad of the Boundless Blue", rarity: 4, stat: "ATK" },
    ],
    Bow: [
      { name: "Amos' Bow", rarity: 5, stat: "ATK" },
      { name: "Skyward Harp", rarity: 5, stat: "CRIT Rate" },
      {
        name: "Elegy for the End",
        rarity: 5,
        baseATK: 401,
        stat: { type: "Energy Recharge", value: 55.1 },
        passive: {
          description: "Increases Elemental Mastery by 60~120." +
            "When the Elemental Skills or Elemental Bursts of the character wielding this weapon hit opponents, that character gains a Sigil of Remembrance. This effect can be triggered once every 0.2s and can be triggered even if said character is not on the field." +
            "When you possess 4 Sigils of Remembrance, all of them will be consumed and all nearby party members will obtain the 'Millennial Movement: Farewell Song' effect for 12s." +
            "'Millennial Movement: Farewell Song' increases Elemental Mastery by 100~200 and increases ATK by 20~40%. Once this effect is triggered, you will not gain Sigils of Remembrance for 20s." +
            "Of the many effects of the 'Millennial Movement,' buffs of the same type will not stack.",
        },
        image: "/assets/genshin/weapons/Elegy for the End.webp",
      },
      { name: "Polar Star", rarity: 5, stat: "CRIT Rate" },
      { name: "Thundering Pulse", rarity: 5, stat: "CRIT DMG" },
      { name: "Aqua Simulacra", rarity: 5, stat: "CRIT DMG" },
      { name: "Hunter's Path", rarity: 5, stat: "CRIT Rate" },
      { name: "The First Great Magic", rarity: 5, stat: "CRIT DMG" },
      { name: "Sacrificial Bow", rarity: 4, stat: "Energy Recharge" },
      { name: "Favonius Warbow", rarity: 4, stat: "Energy Recharge" },
      { name: "Rust", rarity: 4, stat: "ATK" },
      { name: "The Stringless", rarity: 4, stat: "Elemental Mastery" },
      { name: "Alley Hunter", rarity: 4, stat: "ATK" },
      { name: "Hamayumi", rarity: 4, stat: "ATK" },
      { name: "Mouun's Moon", rarity: 4, stat: "ATK" },
      { name: "Windblume Ode", rarity: 4, stat: "Elemental Mastery" },
      { name: "Fading Twilight", rarity: 4, stat: "Energy Recharge" },
      { name: "Ibex Piercer", rarity: 4, stat: "ATK" },
      { name: "Scion of the Blazing Sun", rarity: 4, stat: "CRIT Rate" },
      { name: "Song of Stillness", rarity: 4, stat: "ATK" },
    ],
  },
  hsr: {
    Destruction: [
      { name: "The Unreachable Side", rarity: 5 },
      { name: "Brighter Than the Sun", rarity: 5 },
      { name: "I Shall Be My Own Sword", rarity: 5 },
      { name: "On the Fall of an Aeon", rarity: 5 },
      { name: "A Secret Vow", rarity: 4 },
      { name: "Under the Blue Sky", rarity: 4 },
      { name: "Woops! Walked the Phantylia", rarity: 4 },
      { name: "Mutual Demise", rarity: 3 },
      { name: "Collapsing Sky", rarity: 3 },
    ],
    Hunt: [
      { name: "Sleep Like the Dead", rarity: 5 },
      { name: "In the Night", rarity: 5 },
      { name: "Cruising in the Stellar Sea", rarity: 5 },
      { name: "Swordplay", rarity: 4 },
      { name: "Only Silence Remains", rarity: 4 },
      { name: "Return to Darkness", rarity: 4 },
      { name: "Adversarial", rarity: 4 },
      { name: "Arrows", rarity: 3 },
      { name: "Darting Arrow", rarity: 3 },
    ],
    Erudition: [
      { name: "Before Dawn", rarity: 5 },
      { name: "An Instant Before A Gaze", rarity: 5 },
      { name: "Night on the Milky Way", rarity: 5 },
      { name: "Today Is Another Peaceful Day", rarity: 4 },
      { name: "The Seriousness of Breakfast", rarity: 4 },
      { name: "Data Bank", rarity: 4 },
      { name: "Passkey", rarity: 3 },
      { name: "Sagacity", rarity: 3 },
    ],
    Harmony: [
      { name: "But the Battle Isn't Over", rarity: 5 },
      { name: "Earthly Escapade", rarity: 5 },
      { name: "Dance! Dance! Dance!", rarity: 4 },
      { name: "Planetary Rendezvous", rarity: 4 },
      { name: "Carve the Moon, Weave the Clouds", rarity: 4 },
      { name: "Meshing Cogs", rarity: 3 },
      { name: "Chorus", rarity: 3 },
      { name: "Void", rarity: 3 },
    ],
    Nihility: [
      { name: "Incessant Rain", rarity: 5 },
      { name: "Eyes of the Prey", rarity: 4 },
      { name: "Good Night and Sleep Well", rarity: 4 },
      { name: "Resolution Shines As Pearls of Sweat", rarity: 4 },
      { name: "Fermata", rarity: 4 },
      { name: "We Will Meet Again", rarity: 3 },
      { name: "Loop", rarity: 3 },
    ],
    Preservation: [
      { name: "Moment of Victory", rarity: 5 },
      { name: "Texture of Memories", rarity: 5 },
      { name: "Landau's Choice", rarity: 4 },
      { name: "Day One of My New Life", rarity: 4 },
      { name: "We Are Wildfire", rarity: 4 },
      { name: "Defense", rarity: 3 },
      { name: "Amber", rarity: 3 },
    ],
    Abundance: [
      { name: "Night of Fright", rarity: 5 },
      { name: "Time Waits for No One", rarity: 5 },
      { name: "Post-Op Conversation", rarity: 4 },
      { name: "Perfect Timing", rarity: 4 },
      { name: "Quid Pro Quo", rarity: 4 },
      { name: "Warmth Shortens Cold Nights", rarity: 3 },
      { name: "Cornucopia", rarity: 3 },
      { name: "Shared Feeling", rarity: 4 },
    ],
    Remembrance: [
      { name: "She Already Shut Her Eyes", rarity: 5 },
      { name: "An Apple of Peace", rarity: 4 },
      { name: "It's Showtime", rarity: 4 },
      { name: "After the Charmony Fall", rarity: 4 },
    ],
  },
  zzz: {
    Attack: [
      { name: "Pleniluna", rank: "A", stat: "Crush" },
      { name: "Starlight Engine", rank: "S", stat: "Slash" },
      { name: "Deep Sea Prison", rank: "S", stat: "Strike" },
      { name: "Shocking Touch", rank: "A", stat: "Strike" },
      { name: "Six Stars", rank: "A", stat: "Slash" },
    ],
    Stun: [
      { name: "Revolver", rank: "A", stat: "Pierce" },
      { name: "Bunny Boom", rank: "S", stat: "Strike" },
      { name: "Bunny Knight", rank: "A", stat: "Strike" },
      { name: "Freezing Grip", rank: "A", stat: "Strike" },
    ],
    Anomaly: [
      { name: "Alpha", rank: "S", stat: "Slash" },
      { name: "Blazing Strike", rank: "A", stat: "Strike" },
      { name: "Cannon Rover", rank: "A", stat: "Strike" },
      { name: "Inferno", rank: "A", stat: "Slash" },
    ],
    Support: [
      { name: "Mark I", rank: "A", stat: "Support" },
      { name: "Mark II", rank: "S", stat: "Support" },
      { name: "Shadow Hunt", rank: "A", stat: "Support" },
      { name: "Soul Contract", rank: "S", stat: "Support" },
    ],
    Defense: [
      { name: "Base", rank: "A", stat: "Defense" },
      { name: "Inflection", rank: "S", stat: "Defense" },
      { name: "Original Transmorpher", rank: "S", stat: "Defense" },
      { name: "Starlight Standard", rank: "A", stat: "Defense" },
    ],
    Rupture: [
      { name: "Cobalt", rank: "S", stat: "Rupture" },
      { name: "Puzzle Sphere", rank: "A", stat: "Rupture" },
      { name: "Radiowave Journey", rank: "A", stat: "Rupture" },
      { name: "Solar Slicer", rank: "S", stat: "Rupture" },
    ],
  },
};
