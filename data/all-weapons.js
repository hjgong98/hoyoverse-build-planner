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
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Silver Sword",
        rarity: 2,
        baseATK: 243,
        stat: { type: "none", value: 0 },
        passive: { description: "none" },
        image: "./assets/genshin/weapons/Silver Sword.webp",
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
        image: "./assets/genshin/weapons/Cool Steel.webp",
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
        image: "./assets/genshin/weapons/Dark Iron Sword.webp",
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
        image: "./assets/genshin/weapons/Fillet Blade.webp",
      },
      {
        name: "Harbinger of Dawn",
        rarity: 3,
        baseATK: 401,
        stat: { type: "CRIT DMG", value: 46.9 },
        passive: { type: "CRIT Rate", value: [14, 28], description: "none" },
        image: "./assets/genshin/weapons/Harbinger of Dawn.webp",
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
        image: "./assets/genshin/weapons/Skyrider Sword.webp",
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
        image: "./assets/genshin/weapons/Traveler's Handy Sword.webp",
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
        image: "./assets/genshin/weapons/Amenoma Kageuchi.webp",
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
        image: "./assets/genshin/weapons/Blackcliff Longsword.webp",
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
        image: "./assets/genshin/weapons/Calamity of Eshu.webp",
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
        image: "./assets/genshin/weapons/Cinnabar Spindle.webp",
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
        image: "./assets/genshin/weapons/Favonius Sword.webp",
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
        image: "./assets/genshin/weapons/Festering Desire.webp",
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
        image: "./assets/genshin/weapons/Finale of the Deep.webp",
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
        image: "./assets/genshin/weapons/Fleuve Cendre Ferryman.webp",
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
        image: "./assets/genshin/weapons/Flute of Ezpitzal.webp",
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
        image: "./assets/genshin/weapons/Iron Sting.webp",
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
        image: "./assets/genshin/weapons/Kagotsurube Isshin.webp",
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
        image: "./assets/genshin/weapons/Lion's Roar.webp",
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
        image: "./assets/genshin/weapons/Moonweaver's Dawn.webp",
      },
      {
        name: "Prototype Rancour",
        rarity: 4,
        baseATK: 565,
        stat: { type: "Physical DMG Bonus", value: 34.5 },
        passive: {
          description:
            "On hit, Normal or Charged Attacks increase ATK and DEF by 4~8% for 6s. Max 4 stacks. This effect can only occur once every 0.3s.",
        },
        image: "./assets/genshin/weapons/Prototype Rancour.webp",
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
        image: "./assets/genshin/weapons/Royal Longsword.webp",
      },
      {
        name: "Sacrificial Sword",
        rarity: 4,
        baseATK: 454,
        stat: { type: "Energy Recharge", value: 61.3 },
        passive: {
          description:
            "After dealing damage to an opponent with an Elemental Skill, the skill has a 40~80% chance to end its own CD. Can only occur once every 30~16s.",
        },
        image: "./assets/genshin/weapons/Sacrificial Sword.webp",
      },
      {
        name: "Sapwood Blade",
        rarity: 4,
        baseATK: 565,
        stat: { type: "Energy Recharge", value: 30.6 },
        passive: {
          description:
            "After triggering Burning, Quicken, Aggravate, Spread, Bloom, Lunar-Bloom, Hyperbloom, or Burgeon, a Leaf of Consciousness will be created around the character for a maximum of 10s. When picked up, the Leaf will grant the character 60~120 Elemental Mastery for 12s. Only 1 Leaf can be generated this way every 20s. This effect can still be triggered if the character is not on the field. The Leaf of Consciousness' effect cannot stack.",
        },
        image: "./assets/genshin/weapons/Sapwood Blade.webp",
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
        image: "./assets/genshin/weapons/Serenity's Call.webp",
      },
      {
        name: "	Sturdy Bone",
        rarity: 4,
        baseATK: 565,
        stat: { type: "ATK", value: 27.6 },
        passive: {
          description:
            "Sprint or Alternate Sprint Stamina Consumption decreased by 15%. Additionally, after using Sprint or Alternate Sprint, Normal Attack DMG is increased by 16~32% of ATK. This effect expires after triggering 18 times or 7s.",
        },
        image: "./assets/genshin/weapons/	Sturdy Bone.webp",
      },
      {
        name: "Sword of Descension",
        rarity: 4,
        baseATK: 440,
        stat: { type: "ATK", value: 35.2 },
        passive: {
          description:
            "Hitting enemies with Normal or Charged Attacks grants a 50% chance to deal 200% ATK as DMG in a small AoE. This effect can only occur once every 10s. Additionally, if the Traveler equips the Sword of Descension, their ATK is increased by 66.",
        },
        image: "./assets/genshin/weapons/Sword of Descension.webp",
      },
      {
        name: "Sword of Narzissenkreuz",
        rarity: 4,
        baseATK: 510,
        stat: { type: "ATK", value: 41.3 },
        passive: {
          description:
            "When the equipping character does not have an Arkhe: When Normal Attacks, Charged Attacks, or Plunging Attacks strike, a Pneuma or Ousia energy blast will be unleashed, dealing 160~320% of ATK as DMG. This effect can be triggered once every 12s. The energy blast type is determined by the current type of the Sword of Narzissenkreuz.",
        },
        image: "./assets/genshin/weapons/Sword of Narzissenkreuz.webp",
      },
      {
        name: "The Alley Flash",
        rarity: 4,
        baseATK: 620,
        stat: { type: "Elemental Mastery", value: 55 },
        passive: {
          description:
            "Increases DMG dealt by the character equipping this weapon by 12~24%. Taking DMG disables this effect for 5s.",
        },
        image: "./assets/genshin/weapons/The Alley Flash.webp",
      },
      {
        name: "The Black Sword",
        rarity: 4,
        baseATK: 510,
        stat: { type: "CRIT Rate", value: 27.6 },
        passive: {
          description:
            "ncreases DMG dealt by Normal and Charged Attacks by 20~40%." +
            "Additionally, regenerates 60~100% of ATK as HP when Normal and Charged Attacks score a CRIT Hit. This effect can occur once every 5s.",
        },
        image: "./assets/genshin/weapons/The Black Sword.webp",
      },
      {
        name: "The Dockhand's Assistant",
        rarity: 4,
        baseATK: 510,
        stat: { type: "HP ", value: 41.3 },
        passive: {
          description:
            "When the wielder is healed or heals others, they will gain a Stoic's Symbol that lasts 30s, up to a maximum of 3 Symbols. When using their Elemental Skill or Burst, all Symbols will be consumed and the Roused effect will be granted for 10s. For each Symbol consumed, gain 40~80 Elemental Mastery, and 2s after the effect occurs, 2~4 Energy per Symbol consumed will be restored for said character. The Roused effect can be triggered once every 15s, and Symbols can be gained even when the character is not on the field.",
        },
        image: "./assets/genshin/weapons/The Dockhand's Assistant.webp",
      },
      {
        name: "The Flute",
        rarity: 4,
        baseATK: 510,
        stat: { type: "ATK ", value: 41.3 },
        passive: {
          description:
            "Normal or Charged Attacks grant a Harmonic on hits. Gaining 5 Harmonics triggers the power of music and deals 100~200% ATK DMG to surrounding enemies. Harmonics last up to 30s, and a maximum of 1 can be gained every 0.5s.",
        },
        image: "./assets/genshin/weapons/The Flute.webp",
      },
      {
        name: "Toukabou Shigure",
        rarity: 4,
        baseATK: 510,
        stat: { type: "Elemental Mastery", value: 165 },
        passive: {
          description:
            "After an attack hits opponents, it will inflict an instance of Cursed Parasol upon one of them for 10s. This effect can be triggered once every 15s. If this opponent is defeated during Cursed Parasol's duration, Cursed Parasol's CD will be refreshed immediately. The character wielding this weapon will deal 16~32% more DMG to the opponent affected by Cursed Parasol.",
        },
        image: "./assets/genshin/weapons/Toukabou Shigure.webp",
      },
      {
        name: "Wolf-Fang",
        rarity: 4,
        baseATK: 510,
        stat: { type: "CRIT Rate", value: 27.6 },
        passive: {
          description:
            "DMG dealt by Elemental Skill and Elemental Burst is increased by 16~32%. When an Elemental Skill hits an opponent, its CRIT Rate will be increased by 2~4%. When an Elemental Burst hits an opponent, its CRIT Rate will be increased by 2~4%. Both of these effects last 10s separately, have 4 max stacks, and can be triggered once every 0.1s.",
        },
        image: "./assets/genshin/weapons/Wolf-Fang.webp",
      },
      {
        name: "Xiphos' Moonlight",
        rarity: 4,
        baseATK: 510,
        stat: { type: "Elemental Mastery", value: 165 },
        passive: {
          description:
            "The following effect will trigger every 10s: The equipping character will gain 0.036~0.072% Energy Recharge for each point of Elemental Mastery they possess for 12s, with nearby party members gaining 30% of this buff for the same duration. Multiple instances of this weapon can allow this buff to stack. This effect will still trigger even if the character is not on the field.",
        },
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Absolution",
        rarity: 5,
        baseATK: 674,
        stat: { type: "CRIT DMG", value: 44.1 },
        passive: {
          description:
            "CRIT DMG increased by 20~40%. Increasing the value of a Bond of Life increases the DMG the equipping character deals by 16~32% for 6s. Max 3 stacks.",
        },
        image: "./assets/genshin/weapons/Absolution.webp",
      },
      {
        name: "Aquila Favonia",
        rarity: 5,
        baseATK: 674,
        stat: { type: "Physical DMG Bonus", value: 41.3 },
        passive: {
          description:
            "ATK is increased by 20~40%. Triggers on taking DMG: the soul of the Falcon of the West awakens, holding the banner of the resistance aloft, regenerating HP equal to 100~160% of ATK and dealing 200~320% of ATK as DMG to surrounding opponents. This effect can only occur once every 15s.",
        },
        image: "./assets/genshin/weapons/Aquila Favonia.webp",
      },
      {
        name: "Athame Artis",
        rarity: 5,
        baseATK: 608,
        stat: { type: "CRIT Rate", value: 33.1 },
        passive: {
          description:
            "CRIT DMG from Elemental Bursts is increased by 16~?%. When an Elemental Burst hits an opponent, gain the Blade of the Daylight Hours effect: ATK is increased by 20~?%. Nearby active party members other than the equipping character have their ATK increased by 16~?% for 3s." +
            "Additionally, when the party possesses Hexerei: Secret Rite effects, the effects of Blade of the Daylight Hours are increased by an additional 75%. This effect can be triggered even if the equipping character is off-field.",
        },
        image: "./assets/genshin/weapons/Athame Artis.webp",
      },
      {
        name: "Azurelight",
        rarity: 5,
        baseATK: 674,
        stat: { type: "CRIT Rate", value: 22.1 },
        passive: {
          description:
            "Within 12s after an Elemental Skill is used, ATK is increased by 24~48%. During this time, when the equipping character has 0 Energy, ATK will be further increased by 24~48%, and CRIT DMG will be increased by 40~80%.",
        },
        image: "./assets/genshin/weapons/Azurelight.webp",
      },
      {
        name: "Freedom-Sworn",
        rarity: 5,
        baseATK: 608,
        stat: { type: "Elemental Mastery", value: 198 },
        passive: {
          description:
            "A part of the 'Millennial Movement' that wanders amidst the winds." +
            "Increases DMG by 10~20%." +
            "When the character wielding this weapon triggers Elemental Reactions, they gain a Sigil of Rebellion. This effect can be triggered once every 0.5s and can be triggered even if said character is not on the field." +
            "When you possess 2 Sigils of Rebellion, all of them will be consumed and all nearby party members will obtain 'Millennial Movement: Song of Resistance' for 12s." +
            "'Millennial Movement: Song of Resistance' increases Normal, Charged, and Plunging Attack DMG by 16~32% and increases ATK by 20~40%. Once this effect is triggered, you will not gain Sigils of Rebellion for 20s." +
            "Of the many effects of the 'Millennial Movement,' buffs of the same type will not stack.",
        },
        image: "./assets/genshin/weapons/Freedom-Sworn.webp",
      },
      {
        name: "Haran Geppaku Futsu",
        rarity: 5,
        baseATK: 608,
        stat: { type: "CRIT Rate", value: 33.1 },
        passive: {
          description:
            "Obtain 12~24% All Elemental DMG Bonus. When other nearby party members use Elemental Skills, the character equipping this weapon will gain 1 Wavespike stack. Max 2 stacks. This effect can be triggered once every 0.3s. When the character equipping this weapon uses an Elemental Skill, all stacks of Wavespike will be consumed to gain Rippling Upheaval: each stack of Wavespike consumed will increase Normal Attack DMG by 20~40% for 8s.",
        },
        image: "./assets/genshin/weapons/Haran Geppaku Futsu.webp",
      },
      {
        name: "Key of Khaj-Nisut",
        rarity: 5,
        baseATK: 542,
        stat: { type: "HP", value: 66.2 },
        passive: {
          description:
            "HP increased by 20~40%. When an Elemental Skill hits opponents, you gain the Grand Hymn effect for 20s. This effect increases the equipping character's Elemental Mastery by 0.12~0.24% of their Max HP. This effect can trigger once every 0.3s. Max 3 stacks. When this effect gains 3 stacks, or when the third stack's duration is refreshed, the Elemental Mastery of all nearby party members will be increased by 0.2~0.4% of the equipping character's max HP for 20s.",
        },
        image: "./assets/genshin/weapons/Key of Khaj-Nisut.webp",
      },
      {
        name: "Light of Foliar Incision",
        rarity: 5,
        baseATK: 542,
        stat: { type: "CRIT DMG", value: 88.2 },
        passive: {
          description:
            "CRIT Rate is increased by 4~8%. After Normal Attacks deal Elemental DMG, the Foliar Incision effect will be obtained, increasing DMG dealt by Normal Attacks and Elemental Skills by 120~240% of Elemental Mastery. This effect will disappear after 28 DMG instances or 12s. You can obtain Foliar Incision once every 12s.",
        },
        image: "./assets/genshin/weapons/Light of Foliar Incision.webp",
      },
      {
        name: "Mistsplitter Reforged",
        rarity: 5,
        baseATK: 674,
        stat: { type: "CRIT DMG", value: 44.1 },
        passive: {
          description:
            "Gain a 12~24% Elemental DMG Bonus for all elements and receive the might of the Mistsplitter's Emblem. At stack levels 1/2/3, Mistsplitter's Emblem provides a 8/16/28~16/32/56% Elemental DMG Bonus for the character's Elemental Type. The character will obtain 1 stack of Mistsplitter's Emblem in each of the following scenarios: Normal Attack deals Elemental DMG (stack lasts 5s), casting Elemental Burst (stack lasts 10s); Energy is less than 100% (stack disappears when Energy is full). Each stack's duration is calculated independently.",
        },
        image: "./assets/genshin/weapons/Mistsplitter Reforged.webp",
      },
      {
        name: "Peak Patrol Song",
        rarity: 5,
        baseATK: 542,
        stat: { type: "DEF", value: 82.7 },
        passive: {
          description:
            "Gain 'Ode to Flowers' after Normal or Plunging Attacks hit an opponent: DEF increases by 8~16% and gain a 10~20% All Elemental DMG Bonus for 6s. Max 2 stacks. Can trigger once per 0.1s. When this effect reaches 2 stacks or the 2nd stack's duration is refreshed, increase all nearby party members' All Elemental DMG Bonus by 8~16% for every 1,000 DEF the equipping character has, up to a maximum of 25.6~51.2%, for 15s.",
        },
        image: "./assets/genshin/weapons/Peak Patrol Song.webp",
      },
      {
        name: "Primordial Jade Cutter",
        rarity: 5,
        baseATK: 542,
        stat: { type: "CRIT Rate", value: 44.1 },
        passive: {
          description:
            "HP increased by 20~40%. Additionally, provides an ATK Bonus based on 1.2~2.4% of the wielder's Max HP.",
        },
        image: "./assets/genshin/weapons/Primordial Jade Cutter.webp",
      },
      {
        name: "Skyward Blade",
        rarity: 5,
        baseATK: 608,
        stat: { type: "Energy Recharge", value: 55.1 },
        passive: {
          description:
            "CRIT Rate increased by 4~8%. Gains Skypiercing Might upon using an Elemental Burst: Increases Movement SPD by 10%, increases ATK SPD by 10%, and Normal and Charged hits deal additional DMG equal to 20~40% of ATK. Skypiercing Might lasts for 12s.",
        },
        image: "./assets/genshin/weapons/Skyward Blade.webp",
      },
      {
        name: "Splendor of Tranquil Waters",
        rarity: 5,
        baseATK: 542,
        stat: { type: "CRIT DMG", value: 88.2 },
        passive: {
          description:
            "When the equipping character's current HP increases or decreases, Elemental Skill DMG dealt will be increased by 8~16% for 6s. Max 3 stacks. This effect can be triggered once every 0.2s. When other party members' current HP increases or decreases, the equipping character's Max HP will be increased by 14~28% for 6s. Max 2 stacks. This effect can be triggered once every 0.2s. The aforementioned effects can be triggered even if the wielder is off-field.",
        },
        image: "./assets/genshin/weapons/Splendor of Tranquil Waters.webp",
      },
      {
        name: "Summit Shaper",
        rarity: 5,
        baseATK: 608,
        stat: { type: "ATK", value: 49.6 },
        passive: {
          description:
            "Increases Shield Strength by 20~40%. Scoring hits on opponents increases ATK by 4~8% for 8s. Max 5 stacks. Can only occur once every 0.3s. While protected by a shield, this ATK increase effect is increased by 100%.",
        },
        image: "./assets/genshin/weapons/Summit Shaper.webp",
      },
      {
        name: "Uraku Misugiri",
        rarity: 5,
        baseATK: 542,
        stat: { type: "CRIT DMG", value: 88.2 },
        passive: {
          description:
            "Normal Attack DMG is increased by 16~32% and Elemental Skill DMG is increased by 24~48%. After a nearby active character deals Geo DMG, the aforementioned effects increase by 100% for 15s. Additionally, the wielder's DEF is increased by 20~40%.",
        },
        image: "./assets/genshin/weapons/Uraku Misugiri.webp",
      },
    ],
    Claymore: [
      {
        name: "Wolf's Gravestone",
        rarity: 5,
        stat: { type: "none", value: 0 },
        passive: { description: "none" },
        image: "./assets/genshin/weapons/Dull Blade.webp",
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
      {
        name: "Beginner's Protector",
        rarity: 1,
        baseATK: 185,
        stat: { type: "none", value: 0 },
        passive: {
          description: "none",
        },
        image: "./assets/genshin/weapons/Beginner's Protector.webp",
      },
      {
        name: "Iron Point",
        rarity: 2,
        baseATK: 243,
        stat: { type: "none", value: 0 },
        passive: {
          description: "none",
        },
        image: "./assets/genshin/weapons/Iron Point.webp",
      },
      {
        name: "Black Tassel",
        rarity: 3,
        baseATK: 354,
        stat: { type: "HP", value: 46.9 },
        passive: {
          description: "Increases DMG against slimes by 40~80%.",
        },
        image: "./assets/genshin/weapons/Deathmatch.webp",
      },
      {
        name: "Halberd",
        rarity: 3,
        baseATK: 448,
        stat: { type: "ATK", value: 23.4 },
        passive: {
          description:
            "Normal Attacks deal an additional 160~320% DMG. Can only occur once every 10s.",
        },
        image: "./assets/genshin/weapons/Halberd.webp",
      },
      {
        name: "White Tassel",
        rarity: 3,
        baseATK: 401,
        stat: { type: "Crit Rate", value: 23.4 },
        passive: {
          description: "Increases Normal Attack DMG by 24~48%.",
        },
        image: "./assets/genshin/weapons/White Tassel.webp",
      },
      {
        name: "Beginner's Protector",
        rarity: 4,
        baseATK: 701,
        stat: { type: "Crit Rate", value: 36.8 },
        passive: {
          description: "none",
        },
        image: "./assets/genshin/weapons/Deathmatch.webp",
      },
      {
        name: "'The Catch'",
        rarity: 4,
        baseATK: 510,
        stat: { type: "Energy Recharge", value: 45.9 },
        passive: {
          description:
            "Increases Elemental Burst DMG by 16~32% and Elemental Burst CRIT Rate by 6~12%.",
        },
        image: "./assets/genshin/weapons/'The Catch'.webp",
      },
      {
        name: "Ballad of the Fjords",
        rarity: 4,
        baseATK: 510,
        stat: { type: "Crit Rate", value: 27.6 },
        passive: {
          description:
            "When there are at least 3 different Elemental Types in your party, Elemental Mastery will be increased by 120~240.",
        },
        image: "./assets/genshin/weapons/Ballad of the Fjords.webp",
      },
      {
        name: "Blackcliff Pole",
        rarity: 4,
        baseATK: 510,
        stat: { type: "CRIT DMG", value: 55.1 },
        passive: {
          description:
            "After defeating an opponent, ATK is increased by 12~24% for 30s. This effect has a maximum of 3 stacks, and the duration of each stack is independent of the others.",
        },
        image: "./assets/genshin/weapons/Blackcliff Pole.webp",
      },
      {
        name: "Beginner's Protector",
        rarity: 4,
        baseATK: 701,
        stat: { type: "Crit Rate", value: 36.8 },
        passive: {
          description: "none",
        },
        image: "./assets/genshin/weapons/Deathmatch.webp",
      },
      {
        name: "Deathmatch",
        rarity: 4,
        baseATK: 701,
        stat: { type: "Crit Rate", value: 36.8 },
        passive: {
          description:
            "If there are at least 2 opponents nearby, ATK is increased by 16~32% and DEF is increased by 16~32%. If there are fewer than 2 opponents nearby, ATK is increased by 24~48%.",
        },
        image: "./assets/genshin/weapons/Deathmatch.webp",
      },
      {
        name: "Beginner's Protector",
        rarity: 4,
        baseATK: 701,
        stat: { type: "Crit Rate", value: 36.8 },
        passive: {
          description: "none",
        },
        image: "./assets/genshin/weapons/Deathmatch.webp",
      },
      {
        name: "Beginner's Protector",
        rarity: 4,
        baseATK: 701,
        stat: { type: "Crit Rate", value: 36.8 },
        passive: {
          description: "none",
        },
        image: "./assets/genshin/weapons/Deathmatch.webp",
      },
      {
        name: "Beginner's Protector",
        rarity: 4,
        baseATK: 701,
        stat: { type: "Crit Rate", value: 36.8 },
        passive: {
          description: "none",
        },
        image: "./assets/genshin/weapons/Deathmatch.webp",
      },
      {
        name: "Beginner's Protector",
        rarity: 4,
        baseATK: 701,
        stat: { type: "Crit Rate", value: 36.8 },
        passive: {
          description: "none",
        },
        image: "./assets/genshin/weapons/Deathmatch.webp",
      },
      {
        name: "Calamity Queller",
        rarity: 5,
        baseATK: 701,
        stat: { type: "ATK", value: 16.5 },
        passive: {
          description:
            "Gain 12% All Elemental DMG Bonus. Obtain Consummation for 20s after using an Elemental Skill, causing ATK to increase by 3.2% per second. This ATK increase has a maximum of 6 stacks. When the character equipped with this weapon is not on the field, Consummation's ATK increase is doubled.",
        },
        image: "./assets/genshin/weapons/Calamity Queller.webp",
      },
    ],
    Catalyst: [
      {
        name: "Lost Prayer to the Sacred Winds",
        rarity: 5,
        stat: "CRIT Rate",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Skyward Atlas",
        rarity: 5,
        stat: "ATK",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Memory of Dust",
        rarity: 5,
        stat: "ATK",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Everlasting Moonglow",
        rarity: 5,
        stat: "HP",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Kagura's Verity",
        rarity: 5,
        stat: "CRIT DMG",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Tulaytullah's Remembrance",
        rarity: 5,
        stat: "CRIT DMG",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "A Thousand Floating Dreams",
        rarity: 5,
        stat: "Elemental Mastery",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Cashflow Supervision",
        rarity: 5,
        stat: "CRIT Rate",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "The Widsith",
        rarity: 4,
        stat: "CRIT DMG",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Sacrificial Fragments",
        rarity: 4,
        stat: "Elemental Mastery",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Favonius Codex",
        rarity: 4,
        stat: "Energy Recharge",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Solar Pearl",
        rarity: 4,
        stat: "CRIT Rate",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Mappa Mare",
        rarity: 4,
        stat: "Elemental Mastery",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Dodoco Tales",
        rarity: 4,
        stat: "ATK",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Oathsworn Eye",
        rarity: 4,
        stat: "ATK",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Ballad of the Boundless Blue",
        rarity: 4,
        stat: "ATK",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
    ],
    Bow: [
      {
        name: "Amos' Bow",
        rarity: 5,
        stat: "ATK",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Skyward Harp",
        rarity: 5,
        stat: "CRIT Rate",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
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
        image: "./assets/genshin/weapons/Elegy for the End.webp",
      },
      {
        name: "Polar Star",
        rarity: 5,
        stat: "CRIT Rate",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Thundering Pulse",
        rarity: 5,
        stat: "CRIT DMG",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Aqua Simulacra",
        rarity: 5,
        stat: "CRIT DMG",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Hunter's Path",
        rarity: 5,
        stat: "CRIT Rate",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "The First Great Magic",
        rarity: 5,
        stat: "CRIT DMG",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Sacrificial Bow",
        rarity: 4,
        stat: "Energy Recharge",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Favonius Warbow",
        rarity: 4,
        stat: "Energy Recharge",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Rust",
        rarity: 4,
        stat: "ATK",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "The Stringless",
        rarity: 4,
        stat: "Elemental Mastery",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Alley Hunter",
        rarity: 4,
        stat: "ATK",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Hamayumi",
        rarity: 4,
        stat: "ATK",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Mouun's Moon",
        rarity: 4,
        stat: "ATK",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Windblume Ode",
        rarity: 4,
        stat: "Elemental Mastery",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Fading Twilight",
        rarity: 4,
        stat: "Energy Recharge",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Ibex Piercer",
        rarity: 4,
        stat: "ATK",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Scion of the Blazing Sun",
        rarity: 4,
        stat: "CRIT Rate",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Song of Stillness",
        rarity: 4,
        stat: "ATK",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
    ],
  },
  hsr: {
    Destruction: [
      {
        name: "The Unreachable Side",
        rarity: 5,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Brighter Than the Sun",
        rarity: 5,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "I Shall Be My Own Sword",
        rarity: 5,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "On the Fall of an Aeon",
        rarity: 5,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "A Secret Vow",
        rarity: 4,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Under the Blue Sky",
        rarity: 4,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Woops! Walked the Phantylia",
        rarity: 4,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Mutual Demise",
        rarity: 3,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Collapsing Sky",
        rarity: 3,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
    ],
    Hunt: [
      {
        name: "Sleep Like the Dead",
        rarity: 5,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "In the Night",
        rarity: 5,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Cruising in the Stellar Sea",
        rarity: 5,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Swordplay",
        rarity: 4,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Only Silence Remains",
        rarity: 4,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Return to Darkness",
        rarity: 4,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Adversarial",
        rarity: 4,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Arrows",
        rarity: 3,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Darting Arrow",
        rarity: 3,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
    ],
    Erudition: [
      {
        name: "Before Dawn",
        rarity: 5,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "An Instant Before A Gaze",
        rarity: 5,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Night on the Milky Way",
        rarity: 5,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Today Is Another Peaceful Day",
        rarity: 4,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "The Seriousness of Breakfast",
        rarity: 4,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Data Bank",
        rarity: 4,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Passkey",
        rarity: 3,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Sagacity",
        rarity: 3,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
    ],
    Harmony: [
      {
        name: "But the Battle Isn't Over",
        rarity: 5,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Earthly Escapade",
        rarity: 5,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Dance! Dance! Dance!",
        rarity: 4,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Planetary Rendezvous",
        rarity: 4,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Carve the Moon, Weave the Clouds",
        rarity: 4,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Meshing Cogs",
        rarity: 3,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Chorus",
        rarity: 3,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Void",
        rarity: 3,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
    ],
    Nihility: [
      {
        name: "Incessant Rain",
        rarity: 5,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Eyes of the Prey",
        rarity: 4,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Good Night and Sleep Well",
        rarity: 4,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Resolution Shines As Pearls of Sweat",
        rarity: 4,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Fermata",
        rarity: 4,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "We Will Meet Again",
        rarity: 3,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Loop",
        rarity: 3,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
    ],
    Preservation: [
      {
        name: "Moment of Victory",
        rarity: 5,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Texture of Memories",
        rarity: 5,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Landau's Choice",
        rarity: 4,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Day One of My New Life",
        rarity: 4,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "We Are Wildfire",
        rarity: 4,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Defense",
        rarity: 3,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Amber",
        rarity: 3,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
    ],
    Abundance: [
      {
        name: "Night of Fright",
        rarity: 5,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Time Waits for No One",
        rarity: 5,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Post-Op Conversation",
        rarity: 4,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Perfect Timing",
        rarity: 4,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Quid Pro Quo",
        rarity: 4,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Warmth Shortens Cold Nights",
        rarity: 3,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Cornucopia",
        rarity: 3,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Shared Feeling",
        rarity: 4,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
    ],
    Remembrance: [
      {
        name: "She Already Shut Her Eyes",
        rarity: 5,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "An Apple of Peace",
        rarity: 4,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "It's Showtime",
        rarity: 4,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "After the Charmony Fall",
        rarity: 4,
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
    ],
  },
  zzz: {
    Attack: [
      {
        name: "Pleniluna",
        rank: "A",
        stat: "Crush",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Starlight Engine",
        rank: "S",
        stat: "Slash",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Deep Sea Prison",
        rank: "S",
        stat: "Strike",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Shocking Touch",
        rank: "A",
        stat: "Strike",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Six Stars",
        rank: "A",
        stat: "Slash",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
    ],
    Stun: [
      {
        name: "Revolver",
        rank: "A",
        stat: "Pierce",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Bunny Boom",
        rank: "S",
        stat: "Strike",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Bunny Knight",
        rank: "A",
        stat: "Strike",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Freezing Grip",
        rank: "A",
        stat: "Strike",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
    ],
    Anomaly: [
      {
        name: "Alpha",
        rank: "S",
        stat: "Slash",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Blazing Strike",
        rank: "A",
        stat: "Strike",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Cannon Rover",
        rank: "A",
        stat: "Strike",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Inferno",
        rank: "A",
        stat: "Slash",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
    ],
    Support: [
      {
        name: "Mark I",
        rank: "A",
        stat: "Support",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Mark II",
        rank: "S",
        stat: "Support",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Shadow Hunt",
        rank: "A",
        stat: "Support",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Soul Contract",
        rank: "S",
        stat: "Support",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
    ],
    Defense: [
      {
        name: "Base",
        rank: "A",
        stat: "Defense",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Inflection",
        rank: "S",
        stat: "Defense",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Original Transmorpher",
        rank: "S",
        stat: "Defense",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Starlight Standard",
        rank: "A",
        stat: "Defense",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
    ],
    Rupture: [
      {
        name: "Cobalt",
        rank: "S",
        stat: "Rupture",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Puzzle Sphere",
        rank: "A",
        stat: "Rupture",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Radiowave Journey",
        rank: "A",
        stat: "Rupture",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
      {
        name: "Solar Slicer",
        rank: "S",
        stat: "Rupture",
        image: "./assets/genshin/weapons/Dull Blade.webp",
      },
    ],
  },
};
