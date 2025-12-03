// /data/all-gear.js

export const GEAR_CONFIG = {
  genshin: {
    name: "Artifacts",
    levelOptions: [90, 95, 100],
    artifactSets: {
      "Instructor": {
        "2pc": {
          stat: "Elemental Mastery",
          value: 80,
          description: "Increases Elemental Mastery by 80.",
        },
        "4pc": {
          description:
            "Upon triggering an Elemental Reaction, increases all party members' Elemental Mastery by 120 for 8s.",
        },
        rarity: 4,
        pieces: {
          flower: {
            name: "Instructor's Brooch",
            image: "./assets/genshin/artifacts/Instructor's Brooch.webp",
          },
          plume: {
            name: "Instructor's Feather Accessory",
            image:
              "./assets/genshin/artifacts/Instructor's Feather Accessory.webp",
          },
          sands: {
            name: "Instructor's Pocket Watch",
            image: "./assets/genshin/artifacts/Instructor's Pocket Watch.webp",
          },
          goblet: {
            name: "Instructor's Tea Cup",
            image: "./assets/genshin/artifacts/Instructor's Tea Cup.webp",
          },
          circlet: {
            name: "Instructor's Cap",
            image: "./assets/genshin/artifacts/Instructor's Cap.webp",
          },
        },
      },
      "Exile": {
        "2pc": {
          stat: "Energy Recharge",
          value: 20,
          description: "Energy Recharge +20%",
        },
        "4pc": {
          description:
            "Using an Elemental Burst regenerates 2 Energy for all party members (excluding the wearer) every 2s for 6s.",
        },
        rarity: 4,
        pieces: {
          flower: {
            name: "Exile's Flower",
            image: "./assets/genshin/artifacts/Exile's Flower.webp",
          },
          plume: {
            name: "Exile's Feather",
            image: "./assets/genshin/artifacts/Exile's Feather.webp",
          },
          sands: {
            name: "Exile's Pocket Watch",
            image: "./assets/genshin/artifacts/Exile's Pocket Watch.webp",
          },
          goblet: {
            name: "Exile's Goblet",
            image: "./assets/genshin/artifacts/Exile's Goblet.webp",
          },
          circlet: {
            name: "Exile's Circlet",
            image: "./assets/genshin/artifacts/Exile's Circlet.webp",
          },
        },
      },
      "Gladiator's Finale": {
        "2pc": {
          stat: "ATK%",
          value: 18,
          description: "ATK +18%.",
        },
        "4pc": {
          description:
            "If the wielder of this artifact set uses a Sword, Claymore or Polearm, increases their Normal Attack DMG by 35%.",
        },
        rarity: 5,
        pieces: {
          flower: {
            name: "Gladiator's Nostalgia",
            image: "./assets/genshin/artifacts/Gladiator's Nostalgia.webp",
          },
          plume: {
            name: "Gladiator's Destiny",
            image: "./assets/genshin/artifacts/Gladiator's Destiny.webp",
          },
          sands: {
            name: "Gladiator's Longing",
            image: "./assets/genshin/artifacts/Gladiator's Longing.webp",
          },
          goblet: {
            name: "Gladiator's Intoxication",
            image: "./assets/genshin/artifacts/Gladiator's Intoxication.webp",
          },
          circlet: {
            name: "Gladiator's Triumphus",
            image: "./assets/genshin/artifacts/Gladiator's Triumphus.webp",
          },
        },
      },
      "Wanderer's Troupe": {
        "2pc": {
          stat: "Elemental Mastery",
          value: 80,
          description: "Increases Elemental Mastery by 80",
        },
        "4pc": {
          description:
            "Increases Charged Attack DMG by 35% if the character uses a Catalyst or Bow.",
        },
        rarity: 5,
        pieces: {
          flower: {
            name: "Troupe's Dawnlight",
            image: "./assets/genshin/artifacts/Troupe's Dawnlight.webp",
          },
          plume: {
            name: "Bard's Arrow Feather",
            image: "./assets/genshin/artifacts/Bard's Arrow Feather.webp",
          },
          sands: {
            name: "Concert's Final Hour",
            image: "./assets/genshin/artifacts/Concert's Final Hour.webp",
          },
          goblet: {
            name: "Wanderer's String-Kettle",
            image: "./assets/genshin/artifacts/Wanderer's String-Kettle.webp",
          },
          circlet: {
            name: "Conductor's Top Hat",
            image: "./assets/genshin/artifacts/Conductor's Top Hat.webp",
          },
        },
      },
      "Noblesse Oblige": {
        "2pc": {
          stat: "none",
          value: 0,
          description: " Elemental Burst DMG +20%",
        },
        "4pc": {
          description:
            "Using an Elemental Burst increases all party members' ATK by 20% for 12s. This effect cannot stack.",
        },
        rarity: 5,
        pieces: {
          flower: {
            name: "Royal Flora",
            image: "./assets/genshin/artifacts/Royal Flora.webp",
          },
          plume: {
            name: "Royal Plume",
            image: "./assets/genshin/artifacts/Royal Plume.webp",
          },
          sands: {
            name: "Royal Pocket Watch",
            image: "./assets/genshin/artifacts/Royal Pocket Watch.webp",
          },
          goblet: {
            name: "Royal Silver Urn",
            image: "./assets/genshin/artifacts/Royal Silver Urn.webp",
          },
          circlet: {
            name: "Royal Masque",
            image: "./assets/genshin/artifacts/Royal Masque.webp",
          },
        },
      },
      "Bloodstained Chivalry": {
        "2pc": {
          stat: "Physical DMG Bonus",
          value: 25,
          description: "Physical DMG Bonus +25%",
        },
        "4pc": {
          description:
            "After defeating an opponent, increases Charged Attack DMG by 50%, and reduces its Stamina cost to 0 for 10s.",
        },
        rarity: 5,
        pieces: {
          flower: {
            name: "Bloodstained Flower of Iron",
            image:
              "./assets/genshin/artifacts/Bloodstained Flower of Iron.webp",
          },
          plume: {
            name: "Bloodstained Black Plume",
            image: "./assets/genshin/artifacts/Bloodstained Black Plume.webp",
          },
          sands: {
            name: "Bloodstained Final Hour",
            image: "./assets/genshin/artifacts/Bloodstained Final Hour.webp",
          },
          goblet: {
            name: "Bloodstained Chevalier's Goblet",
            image:
              "./assets/genshin/artifacts/Bloodstained Chevalier's Goblet.webp",
          },
          circlet: {
            name: "Bloodstained Iron Mask",
            image: "./assets/genshin/artifacts/Bloodstained Iron Mask.webp",
          },
        },
      },
      "Maiden Beloved": {
        "2pc": {
          stat: "Healing Bonus",
          value: 15,
          description: "Character Healing Effectiveness +15%",
        },
        "4pc": {
          description:
            "Using an Elemental Skill or Burst increases healing received by all party members by 20% for 10s.",
        },
        rarity: 5,
        pieces: {
          flower: {
            name: "Maiden's Distant Love",
            image: "./assets/genshin/artifacts/Maiden's Distant Love.webp",
          },
          plume: {
            name: "Maiden's Heart-Stricken Infatuation",
            image:
              "./assets/genshin/artifacts/Maiden's Heart-Stricken Infatuation.webp",
          },
          sands: {
            name: "Maiden's Passing Youth",
            image: "./assets/genshin/artifacts/Maiden's Passing Youth.webp",
          },
          goblet: {
            name: "Maiden's Fleeting Leisure",
            image: "./assets/genshin/artifacts/Maiden's Fleeting Leisure.webp",
          },
          circlet: {
            name: "Maiden's Fading Beauty",
            image: "./assets/genshin/artifacts/Maiden's Fading Beauty.webp",
          },
        },
      },
      "Viridescent Venerer": {
        "2pc": {
          stat: "Anemo DMG Bonus",
          value: 15,
          description: "Anemo DMG Bonus +15%",
        },
        "4pc": {
          description:
            "Increases Swirl DMG by 60%. Decreases opponent's Elemental RES to the element infused in the Swirl by 40% for 10s.",
        },
        rarity: 5,
        pieces: {
          flower: {
            name: "In Remembrance of Viridescent Fields",
            image:
              "./assets/genshin/artifacts/In Remembrance of Viridescent Fields.webp",
          },
          plume: {
            name: "Viridescent Arrow Feather",
            image: "./assets/genshin/artifacts/Viridescent Arrow Feather.webp",
          },
          sands: {
            name: "Viridescent Venerer's Determination",
            image:
              "./assets/genshin/artifacts/Viridescent Venerer's Determination.webp",
          },
          goblet: {
            name: "Viridescent Venerer's Vessel",
            image:
              "./assets/genshin/artifacts/Viridescent Venerer's Vessel.webp",
          },
          circlet: {
            name: "Viridescent Venerer's Diadem",
            image:
              "./assets/genshin/artifacts/Viridescent Venerer's Diadem.webp",
          },
        },
      },
      "Archaic Petra": {
        "2pc": {
          stat: "Geo DMG Bonus",
          value: 15,
          description: "Geo DMG Bonus +15%.",
        },
        "4pc": {
          description:
            "Upon obtaining an Elemental Shard created through a Crystallize Reaction, all party members gain 35% DMG Bonus for that particular element for 10s. Only one form of Elemental DMG Bonus can be gained in this manner at any one time.",
        },
        rarity: 5,
        pieces: {
          flower: {
            name: "Flower of Creviced Cliff",
            image: "./assets/genshin/artifacts/Flower of Creviced Cliff.webp",
          },
          plume: {
            name: "Feather of Jagged Peaks",
            image: "./assets/genshin/artifacts/Feather of Jagged Peaks.webp",
          },
          sands: {
            name: "Sundial of Enduring Jade",
            image: "./assets/genshin/artifacts/Sundial of Enduring Jade.webp",
          },
          goblet: {
            name: "Goblet of Chiseled Crag",
            image: "./assets/genshin/artifacts/Goblet of Chiseled Crag.webp",
          },
          circlet: {
            name: "Mask of Solitude Basalt",
            image: "./assets/genshin/artifacts/Mask of Solitude Basalt.webp",
          },
        },
      },
      "Retracing Bolide": {
        "2pc": {
          stat: "Shield Strength",
          value: 35,
          description: "Increases Shield Strength by 35%.",
        },
        "4pc": {
          description:
            "While protected by a shield, gain an additional 40% Normal and Charged Attack DMG.",
        },
        rarity: 5,
        pieces: {
          flower: {
            name: "Summer Night's Bloom",
            image: "./assets/genshin/artifacts/Summer Night's Bloom.webp",
          },
          plume: {
            name: "Summer Night's Finale",
            image: "./assets/genshin/artifacts/Summer Night's Finale.webp",
          },
          sands: {
            name: "Summer Night's Moment",
            image: "./assets/genshin/artifacts/Summer Night's Moment.webp",
          },
          goblet: {
            name: "Summer Night's Waterballoon",
            image:
              "./assets/genshin/artifacts/Summer Night's Waterballoon.webp",
          },
          circlet: {
            name: "Summer Night's Mask",
            image: "./assets/genshin/artifacts/Summer Night's Mask.webp",
          },
        },
      },
      "Thundersoother": {
        "2pc": {
          stat: "Electro RES",
          value: 40,
          description: "Electro RES increased by 40%.",
        },
        "4pc": {
          description:
            "Increases DMG against opponents affected by Electro by 35%.",
        },
        rarity: 5,
        pieces: {
          flower: {
            name: "Thundersoother's Heart",
            image: "./assets/genshin/artifacts/Thundersoother's Heart.webp",
          },
          plume: {
            name: "Thundersoother's Plume",
            image: "./assets/genshin/artifacts/Thundersoother's Plume.webp",
          },
          sands: {
            name: "Hour of Soothing Thunder",
            image: "./assets/genshin/artifacts/Hour of Soothing Thunder.webp",
          },
          goblet: {
            name: "Thundersoother's Goblet",
            image: "./assets/genshin/artifacts/Thundersoother's Goblet.webp",
          },
          circlet: {
            name: "Thundersoother's Diadem",
            image: "./assets/genshin/artifacts/Thundersoother's Diadem.webp",
          },
        },
      },
      "Thundering Fury": {
        "2pc": {
          stat: "Electro DMG Bonus",
          value: 15,
          description: "Electro DMG Bonus +15%",
        },
        "4pc": {
          description: "Increases DMG caused by Overloaded, Electro-Charged,",
        },
        rarity: 5,
        pieces: {
          flower: {
            name: "Thunderbird's Mercy",
            image: "./assets/genshin/artifacts/Thunderbird's Mercy.webp",
          },
          plume: {
            name: "Survivor of Catastrophe",
            image: "./assets/genshin/artifacts/Survivor of Catastrophe.webp",
          },
          sands: {
            name: "Hourglass of Thunder",
            image: "./assets/genshin/artifacts/Hourglass of Thunder.webp",
          },
          goblet: {
            name: "Omen of Thunderstorm",
            image: "./assets/genshin/artifacts/Omen of Thunderstorm.webp",
          },
          circlet: {
            name: "Thunder Summoner's Crown",
            image: "./assets/genshin/artifacts/Thunder Summoner's Crown.webp",
          },
        },
      },
      "Lavawalker": {
        "2pc": {
          stat: "Pyro RES",
          value: 40,
          description: "Pyro RES increased by 40%.",
        },
        "4pc": {
          description:
            "Increases DMG against opponents affected by Pyro by 35%.",
        },
        rarity: 5,
        pieces: {
          flower: {
            name: "Lavawalker's Resolution",
            image: "./assets/genshin/artifacts/Lavawalker's Resolution.webp",
          },
          plume: {
            name: "Lavawalker's Salvation",
            image: "./assets/genshin/artifacts/Lavawalker's Salvation.webp",
          },
          sands: {
            name: "Lavawalker's Torment",
            image: "./assets/genshin/artifacts/Lavawalker's Torment.webp",
          },
          goblet: {
            name: "Lavawalker's Epiphany",
            image: "./assets/genshin/artifacts/Lavawalker's Epiphany.webp",
          },
          circlet: {
            name: "Lavawalker's Wisdom",
            image: "./assets/genshin/artifacts/Lavawalker's Wisdom.webp",
          },
        },
      },
      "Crimson Witch of Flames": {
        "2pc": {
          stat: "Pyro DMG Bonus",
          value: 15,
          description: "Pyro DMG Bonus +15%",
        },
        "4pc": {
          description:
            "Increases Overloaded and Burning, and Burgeon DMG by 40%. Increases Vaporize and Melt DMG by 15%. Using Elemental Skill increases the 2-Piece Set Bonus by 50% of its starting value for 10s. Max 3 stacks.",
        },
        rarity: 5,
        pieces: {
          flower: {
            name: "Witch's Flower of Blaze",
            image: "./assets/genshin/artifacts/Witch's Flower of Blaze.webp",
          },
          plume: {
            name: "Witch's Ever-Burning Plume",
            image: "./assets/genshin/artifacts/Witch's Ever-Burning Plume.webp",
          },
          sands: {
            name: "Witch's End Time",
            image: "./assets/genshin/artifacts/Witch's End Time.webp",
          },
          goblet: {
            name: "Witch's Heart Flames",
            image: "./assets/genshin/artifacts/Witch's Heart Flames.webp",
          },
          circlet: {
            name: "Witch's Scorching Hat",
            image: "./assets/genshin/artifacts/Witch's Scorching Hat.webp",
          },
        },
      },
      "Blizzard Strayer": {
        "2pc": {
          stat: "Cryo DMG Bonus",
          value: 15,
          description: "Cryo DMG Bonus +15%",
        },
        "4pc": {
          description:
            "When a character attacks an opponent affected by Cryo, their CRIT Rate is increased by 20%. If the opponent is Frozen, CRIT Rate is increased by an additional 20%.",
        },
        rarity: 5,
        pieces: {
          flower: {
            name: "Snowswept Memory",
            image: "./assets/genshin/artifacts/Snowswept Memory.webp",
          },
          plume: {
            name: "Icebreaker's Resolve",
            image: "./assets/genshin/artifacts/Icebreaker's Resolve.png",
          },
          sands: {
            name: "Frozen Homeland's Demise",
            image: "./assets/genshin/artifacts/Frozen Homeland's Demise.webp",
          },
          goblet: {
            name: "Frost-Weaved Dignity",
            image: "./assets/genshin/artifacts/Frost-Weaved Dignity.png",
          },
          circlet: {
            name: "Broken Rime's Echo",
            image: "./assets/genshin/artifacts/Broken Rime's Echo.webp",
          },
        },
      },
      "Heart of Depth": {
        "2pc": {
          stat: "Hydro DMG Bonus",
          value: 15,
          description: "Hydro DMG Bonus +15%",
        },
        "4pc": {
          description:
            "After using an Elemental Skill, increases Normal Attack and Charged Attack DMG by 30% for 15s.",
        },
        rarity: 5,
        pieces: {
          flower: {
            name: "Gilded Corsage",
            image: "./assets/genshin/artifacts/Gilded Corsage.webp",
          },
          plume: {
            name: "Gust of Nostalgia",
            image: "./assets/genshin/artifacts/Gust of Nostalgia.webp",
          },
          sands: {
            name: "Copper Compass",
            image: "./assets/genshin/artifacts/Copper Compass.webp",
          },
          goblet: {
            name: "Goblet of Thundering Deep",
            image: "./assets/genshin/artifacts/Goblet of Thundering Deep.webp",
          },
          circlet: {
            name: "Wine-Stained Tricorne",
            image: "./assets/genshin/artifacts/Wine-Stained Tricorne.webp",
          },
        },
      },
      "Tenacity of the Millelith": {
        "2pc": {
          stat: "HP%",
          value: 20,
          description: "HP +20%",
        },
        "4pc": {
          description:
            "When an Elemental Skill hits an opponent, the ATK of all nearby party members is increased by 20% and their Shield Strength is increased by 30% for 3s. This effect can be triggered once every 0.5s. This effect can still be triggered even when the character who is using this artifact set is not on the field.",
        },
        rarity: 5,
        pieces: {
          flower: {
            name: "Flower of Accolades",
            image: "./assets/genshin/artifacts/Flower of Accolades.webp",
          },
          plume: {
            name: "Ceremonial War-Plume",
            image: "./assets/genshin/artifacts/Ceremonial War-Plume.webp",
          },
          sands: {
            name: "Orichalceous Time-Dial",
            image: "./assets/genshin/artifacts/Orichalceous Time-Dial.webp",
          },
          goblet: {
            name: "Noble's Pledging Vessel",
            image: "./assets/genshin/artifacts/Noble's Pledging Vessel.webp",
          },
          circlet: {
            name: "General's Ancient Helm",
            image: "./assets/genshin/artifacts/General's Ancient Helm.webp",
          },
        },
      },
      "Pale Flame": {
        "2pc": {
          stat: "Physical DMG Bonus",
          value: 25,
          description: "Physical DMG Bonus +25%.",
        },
        "4pc": {
          description:
            "When an Elemental Skill hits an opponent, ATK is increased by 9% for 7s. This effect stacks up to 2 times and can be triggered once every 0.3s. Once 2 stacks are reached, the 2-set effect is increased by 100%.",
        },
        rarity: 5,
        pieces: {
          flower: {
            name: "Stainless Bloom",
            image: "./assets/genshin/artifacts/Stainless Bloom.webp",
          },
          plume: {
            name: "Wise Doctor's Pinion",
            image: "./assets/genshin/artifacts/Wise Doctor's Pinion.webp",
          },
          sands: {
            name: "Moment of Cessation",
            image: "./assets/genshin/artifacts/Moment of Cessation.webp",
          },
          goblet: {
            name: "Surpassing Cup",
            image: "./assets/genshin/artifacts/Surpassing Cup.webp",
          },
          circlet: {
            name: "Mocking Mask",
            image: "./assets/genshin/artifacts/Mocking Mask.webp",
          },
        },
      },
      "Shimenawa's Reminiscence": {
        "2pc": {
          stat: "ATK%",
          value: 18,
          description: "ATK +18%.",
        },
        "4pc": {
          description:
            "When casting an Elemental Skill, if the character has 15 or more Energy, they lose 15 Energy and Normal/Charged/Plunging Attack DMG is increased by 50% for 10s. This effect will not trigger again during that duration.",
        },
        rarity: 5,
        pieces: {
          flower: {
            name: "Entangling Bloom",
            image: "./assets/genshin/artifacts/Entangling Bloom.webp",
          },
          plume: {
            name: "Shaft of Remembrance",
            image: "./assets/genshin/artifacts/Shaft of Remembrance.webp",
          },
          sands: {
            name: "Morning Dew's Moment",
            image: "./assets/genshin/artifacts/Morning Dew's Moment.webp",
          },
          goblet: {
            name: "Hopeful Heart",
            image: "./assets/genshin/artifacts/Hopeful Heart.webp",
          },
          circlet: {
            name: "Capricious Visage",
            image: "./assets/genshin/artifacts/Capricious Visage.webp",
          },
        },
      },
      "Emblem of Severed Fate": {
        "2pc": {
          stat: "Energy Recharge",
          value: 20,
          description: "Energy Recharge +20%",
        },
        "4pc": {
          description:
            "Increases Elemental Burst DMG by 25% of Energy Recharge. A maximum of 75% bonus DMG can be obtained in this way.",
        },
        rarity: 5,
        pieces: {
          flower: {
            name: "Magnificent Tsuba",
            image: "./assets/genshin/artifacts/Magnificent Tsuba.webp",
          },
          plume: {
            name: "Sundered Feather",
            image: "./assets/genshin/artifacts/Sundered Feather.webp",
          },
          sands: {
            name: "Storm Cage",
            image: "./assets/genshin/artifacts/Storm Cage.webp",
          },
          goblet: {
            name: "Scarlet Vessel",
            image: "./assets/genshin/artifacts/Scarlet Vessel.webp",
          },
          circlet: {
            name: "Ornate Kabuto",
            image: "./assets/genshin/artifacts/Ornate Kabuto.webp",
          },
        },
      },
      "Husk of Opulent Dreams": {
        "2pc": {
          stat: "DEF%",
          value: 30,
          description: "DEF +30%",
        },
        "4pc": {
          description:
            "A character equipped with this Artifact set will obtain the Curiosity effect in the following conditions:" +
            "When on the field, the character gains 1 stack after hitting an opponent with a Geo attack, triggering a maximum of once every 0.3s." +
            "When off the field, the character gains 1 stack every 3s." +
            "Curiosity can stack up to 4 times, each providing 6% DEF and a 6% Geo DMG Bonus." +
            "When 6 seconds pass without gaining a Curiosity stack, 1 stack is lost.",
        },
        rarity: 5,
        pieces: {
          flower: {
            name: "Bloom Times",
            image: "./assets/genshin/artifacts/Bloom Times.webp",
          },
          plume: {
            name: "Plume of Luxury",
            image: "./assets/genshin/artifacts/Plume of Luxury.webp",
          },
          sands: {
            name: "Song of Life",
            image: "./assets/genshin/artifacts/Song of Life.webp",
          },
          goblet: {
            name: "Calabash of Awakening",
            image: "./assets/genshin/artifacts/Calabash of Awakening.webp",
          },
          circlet: {
            name: "Skeletal Hat",
            image: "./assets/genshin/artifacts/Skeletal Hat.webp",
          },
        },
      },
      "Ocean-Hued Clam": {
        "2pc": {
          stat: "Healing Bonus",
          value: 15,
          description: "Healing Bonus +15%.",
        },
        "4pc": {
          description:
            "When the character equipping this artifact set heals a character in the party, a Sea-Dyed Foam will appear for 3 seconds, accumulating the amount of HP recovered from healing (including overflow healing)." +
            "At the end of the duration, the Sea-Dyed Foam will explode, dealing DMG to nearby opponents based on 90% of the accumulated healing." +
            "(This DMG is calculated similarly to Reactions such as Electro-Charged, and Superconduct, but it is not affected by Elemental Mastery, Character Levels, or Reaction DMG Bonuses)." +
            "Only one Sea-Dyed Foam can be produced every 3.5 seconds." +
            "Each Sea-Dyed Foam can accumulate up to 30,000 HP (including overflow healing)." +
            "There can be no more than one Sea-Dyed Foam active at any given time." +
            "This effect can still be triggered even when the character who is using this artifact set is not on the field.",
        },
        rarity: 5,
        pieces: {
          flower: {
            name: "Sea-Dyed Blossom",
            image: "./assets/genshin/artifacts/Sea-Dyed Blossom.webp",
          },
          plume: {
            name: "Deep Palace's Plume",
            image: "./assets/genshin/artifacts/Deep Palace's Plume.webp",
          },
          sands: {
            name: "Cowry of Parting",
            image: "./assets/genshin/artifacts/Cowry of Parting.webp",
          },
          goblet: {
            name: "Pearl Cage",
            image: "./assets/genshin/artifacts/Pearl Cage.webp",
          },
          circlet: {
            name: "Crown of Watatsumi",
            image: "./assets/genshin/artifacts/Crown of Watatsumi.webp",
          },
        },
      },
      "Vermillion Hereafter": {
        "2pc": {
          stat: "ATK%",
          value: 18,
          description: "ATK +18%.",
        },
        "4pc": {
          description:
            "After using an Elemental Burst, this character will gain the Nascent Light effect, increasing their ATK by 8% for 16s. When the character's HP decreases, their ATK will further increase by 10%. This increase can occur this way maximum of 4 times. This effect can be triggered once every 0.8s. Nascent Light will be dispelled when the character leaves the field. If an Elemental Burst is used again during the duration of Nascent Light, the original Nascent Light will be dispelled.",
        },
        rarity: 5,
        pieces: {
          flower: {
            name: "Flowering Life",
            image: "./assets/genshin/artifacts/Flowering Life.webp",
          },
          plume: {
            name: "Feather of Nascent Light",
            image: "./assets/genshin/artifacts/Feather of Nascent Light.webp",
          },
          sands: {
            name: "Solar Relic",
            image: "./assets/genshin/artifacts/Solar Relic.webp",
          },
          goblet: {
            name: "Moment of the Pact",
            image: "./assets/genshin/artifacts/Moment of the Pact.webp",
          },
          circlet: {
            name: "Thundering Poise",
            image: "./assets/genshin/artifacts/Thundering Poise.webp",
          },
        },
      },
      "Echoes of an Offering": {
        "2pc": {
          stat: "ATK%",
          value: 18,
          description: "ATK +18%.",
        },
        "4pc": {
          description:
            "When Normal Attacks hit opponents, there is a 36% chance that it will trigger Valley Rite, which will increase Normal Attack DMG by 70% of ATK." +
            "This effect will be dispelled 0.05s after a Normal Attack deals DMG." +
            "If a Normal Attack fails to trigger Valley Rite, the odds of it triggering the next time will increase by 20%." +
            "This trigger can occur once every 0.2s.",
        },
        rarity: 5,
        pieces: {
          flower: {
            name: "Soulscent Bloom",
            image: "./assets/genshin/artifacts/Soulscent Bloom.webp",
          },
          plume: {
            name: "Jade Leaf",
            image: "./assets/genshin/artifacts/Jade Leaf.webp",
          },
          sands: {
            name: "Symbol of Felicitation",
            image: "./assets/genshin/artifacts/Symbol of Felicitation.webp",
          },
          goblet: {
            name: "Chalice of the Font",
            image: "./assets/genshin/artifacts/Chalice of the Font.webp",
          },
          circlet: {
            name: "Flowing Rings",
            image: "./assets/genshin/artifacts/Flowing Rings.webp",
          },
        },
      },
      "Deepwood Memories": {
        "2pc": {
          stat: "Dendro DMG Bonus",
          value: 15,
          description: "Dendro DMG Bonus +15%.",
        },
        "4pc": {
          description:
            "After Elemental Skills or Bursts hit opponents, the targets' Dendro RES will be decreased by 30% for 8s. This effect can be triggered even if the equipping character is not on the field.",
        },
        rarity: 5,
        pieces: {
          flower: {
            name: "Labyrinth Wayfarer",
            image: "./assets/genshin/artifacts/Labyrinth Wayfarer.webp",
          },
          plume: {
            name: "Scholar of Vines",
            image: "./assets/genshin/artifacts/Scholar of Vines.webp",
          },
          sands: {
            name: "A Time of Insight",
            image: "./assets/genshin/artifacts/A Time of Insight.webp",
          },
          goblet: {
            name: "Lamp of the Lost",
            image: "./assets/genshin/artifacts/Lamp of the Lost.webp",
          },
          circlet: {
            name: "Laurel Coronet",
            image: "./assets/genshin/artifacts/Laurel Coronet.webp",
          },
        },
      },
      "Gilded Dreams": {
        "2pc": {
          stat: "Elemental Mastery",
          value: 80,
          description: "Increases Elemental Mastery by 80.",
        },
        "4pc": {
          description:
            "Within 8s of triggering an Elemental Reaction, the character equipping this will obtain buffs based on the Elemental Type of the other party members. ATK is increased by 14% for each party member whose Elemental Type is the same as the equipping character, and Elemental Mastery is increased by 50 for every party member with a different Elemental Type. Each of the aforementioned buffs will count up to 3 characters. This effect can be triggered once every 8s. The character who equips this can still trigger its effects when not on the field.",
        },
        rarity: 5,
        pieces: {
          flower: {
            name: "Dreaming Steelbloom",
            image: "./assets/genshin/artifacts/Dreaming Steelbloom.webp",
          },
          plume: {
            name: "Feather of Judgment",
            image: "./assets/genshin/artifacts/Feather of Judgment.webp",
          },
          sands: {
            name: "The Sunken Years",
            image: "./assets/genshin/artifacts/The Sunken Years.webp",
          },
          goblet: {
            name: "Honeyed Final Feast",
            image: "./assets/genshin/artifacts/Honeyed Final Feast.webp",
          },
          circlet: {
            name: "Shadow of the Sand King",
            image: "./assets/genshin/artifacts/Shadow of the Sand King.webp",
          },
        },
      },
      "Desert Pavilion Chronicle": {
        "2pc": {
          stat: "Anemo DMG Bonus",
          value: 15,
          description: "Anemo DMG Bonus +15%",
        },
        "4pc": {
          description:
            "When Charged Attacks hit opponents, the equipping character's Normal Attack SPD will increase by 10% while Normal, Charged, and Plunging Attack DMG will increase by 40% for 15s.",
        },
        rarity: 5,
        pieces: {
          flower: {
            name: "The First Days of the City of Kings",
            image:
              "./assets/genshin/artifacts/The First Days of the City of Kings.webp",
          },
          plume: {
            name: "End of the Golden Realm",
            image: "./assets/genshin/artifacts/End of the Golden Realm.webp",
          },
          sands: {
            name: "Timepiece of the Lost Path",
            image: "./assets/genshin/artifacts/Timepiece of the Lost Path.webp",
          },
          goblet: {
            name: "Defender of the Enchanting Dream",
            image:
              "./assets/genshin/artifacts/Defender of the Enchanting Dream.webp",
          },
          circlet: {
            name: "Legacy of the Desert High-Born",
            image:
              "./assets/genshin/artifacts/Legacy of the Desert High-Born.webp",
          },
        },
      },
      "Flower of Paradise Lost": {
        "2pc": {
          stat: "Elemental Mastery",
          value: 80,
          description: "Increases Elemental Mastery by 80.",
        },
        "4pc": {
          description:
            "The equipping character's Bloom, Hyperbloom, and Burgeon reaction DMG are increased by 40%, and their Lunar-Bloom reaction DMG is increased by 10%. Additionally, after the equipping character triggers Bloom, Hyperbloom, Lunar-Bloom, or Burgeon, they will gain another 25% bonus to the effect mentioned prior. Each stack of this lasts 10s. Max 4 stacks simultaneously. This effect can only be triggered once per second. The character who equips this can still trigger its effects when not on the field.",
        },
        rarity: 5,
        pieces: {
          flower: {
            name: "Ay-Khanoum's Myriad",
            image: "./assets/genshin/artifacts/Ay-Khanoum's Myriad.webp",
          },
          plume: {
            name: "Wilting Feast",
            image: "./assets/genshin/artifacts/Wilting Feast.webp",
          },
          sands: {
            name: "A Moment Congealed",
            image: "./assets/genshin/artifacts/A Moment Congealed.webp",
          },
          goblet: {
            name: "Secret-Keeper's Magic Bottle",
            image:
              "./assets/genshin/artifacts/Secret-Keeper's Magic Bottle.webp",
          },
          circlet: {
            name: "Amethyst Crown",
            image: "./assets/genshin/artifacts/Amethyst Crown.webp",
          },
        },
      },
      "Nymph's Dream": {
        "2pc": {
          stat: "Hydro DMG Bonus",
          value: 15,
          description: "Hydro DMG Bonus +15%",
        },
        "4pc": {
          description:
            "After Normal, Charged, and Plunging Attacks, Elemental Skills, and Elemental Bursts hit opponents, 1 stack of Mirrored Nymph will be triggered, lasting 8s. When under the effect of 1, 2, or 3 or more Mirrored Nymph stacks, ATK will be increased by 7%/16%/25%, and Hydro DMG will be increased by 4%/9%/15%. Mirrored Nymph created by Normal, Charged, and Plunging Attacks, Elemental Skills, and Elemental Bursts exist independently.",
        },
        rarity: 5,
        pieces: {
          flower: {
            name: "Odyssean Flower",
            image: "./assets/genshin/artifacts/Odyssean Flower.webp",
          },
          plume: {
            name: "Wicked Mage's Plumule",
            image: "./assets/genshin/artifacts/Wicked Mage's Plumule.webp",
          },
          sands: {
            name: "Nymph's Constancy",
            image: "./assets/genshin/artifacts/Nymph's Constancy.webp",
          },
          goblet: {
            name: "Heroes' Tea Party",
            image: "./assets/genshin/artifacts/Heroes' Tea Party.webp",
          },
          circlet: {
            name: "Fell Dragon's Monocle",
            image: "./assets/genshin/artifacts/Fell Dragon's Monocle.webp",
          },
        },
      },
      "Vourukasha's Glow": {
        "2pc": {
          stat: "HP%",
          value: 20,
          description: "HP +20%",
        },
        "4pc": {
          description:
            "Elemental Skill and Elemental Burst DMG will be increased by 10%. After the equipping character takes DMG, the aforementioned DMG Bonus is increased by 80% for 5s. This effect increase can have 5 stacks. The duration of each stack is counted independently. These effects can be triggered even when the equipping character is not on the field.",
        },
        rarity: 5,
        pieces: {
          flower: {
            name: "Stamen of Khvarena's Origin",
            image:
              "./assets/genshin/artifacts/Stamen of Khvarena's Origin.webp",
          },
          plume: {
            name: "Vibrant Pinion",
            image: "./assets/genshin/artifacts/Vibrant Pinion.webp",
          },
          sands: {
            name: "Ancient Abscission",
            image: "./assets/genshin/artifacts/Ancient Abscission.webp",
          },
          goblet: {
            name: "Feast of Boundless Joy",
            image: "./assets/genshin/artifacts/Feast of Boundless Joy.webp",
          },
          circlet: {
            name: "Heart of Khvarena's Brilliance",
            image:
              "./assets/genshin/artifacts/Heart of Khvarena's Brilliance.webp",
          },
        },
      },
      "Marechaussee Hunter": {
        "2pc": {
          stat: "none",
          value: 0,
          description: "Normal and Charged Attack DMG +15%.",
        },
        "4pc": {
          description:
            "When current HP increases or decreases, CRIT Rate will be increased by 12% for 5s. Max 3 stacks.",
        },
        rarity: 5,
        pieces: {
          flower: {
            name: "Hunter's Brooch",
            image: "./assets/genshin/artifacts/Hunter's Brooch.webp",
          },
          plume: {
            name: "Masterpiece's Overture",
            image: "./assets/genshin/artifacts/Masterpiece's Overture.webp",
          },
          sands: {
            name: "Moment of Judgment",
            image: "./assets/genshin/artifacts/Moment of Judgment.webp",
          },
          goblet: {
            name: "Forgotten Vessel",
            image: "./assets/genshin/artifacts/Forgotten Vessel.webp",
          },
          circlet: {
            name: "Veteran's Visage",
            image: "./assets/genshin/artifacts/Veteran's Visage.webp",
          },
        },
      },
      "Golden Troupe": {
        "2pc": {
          stat: "none",
          value: 0,
          description: "Increases Elemental Skill DMG by 20%.",
        },
        "4pc": {
          description:
            "Increases Elemental Skill DMG by 25%. Additionally, when not on the field, Elemental Skill DMG will be further increased by 25%. This effect will be cleared 2s after taking the field.",
        },
        rarity: 5,
        pieces: {
          flower: {
            name: "Golden Song's Variation",
            image: "./assets/genshin/artifacts/Golden Song's Variation.webp",
          },
          plume: {
            name: "Golden Bird's Shedding",
            image: "./assets/genshin/artifacts/Golden Bird's Shedding.webp",
          },
          sands: {
            name: "Golden Era's Prelude",
            image: "./assets/genshin/artifacts/Golden Era's Prelude.webp",
          },
          goblet: {
            name: "Golden Night's Bustle",
            image: "./assets/genshin/artifacts/Golden Night's Bustle.webp",
          },
          circlet: {
            name: "Golden Troupe's Reward",
            image: "./assets/genshin/artifacts/Golden Troupe's Reward.webp",
          },
        },
      },
      "Song of Days Past": {
        "2pc": {
          stat: "Healing Bonus",
          value: 15,
          description: "Healing Bonus +15%.",
        },
        "4pc": {
          description:
            "When the equipping character heals a party member, the Yearning effect will be created for 6s, which records the total amount of healing provided (including overflow healing). When the duration expires, the Yearning effect will be transformed into the 'Waves of Days Past' effect: When your active party member hits an opponent with a Normal Attack, Charged Attack, Plunging Attack, Elemental Skill, or Elemental Burst, the DMG dealt will be increased by 8% of the total healing amount recorded by the Yearning effect. The 'Waves of Days Past' effect is removed after it has taken effect 5 times or after 10s. A single instance of the Yearning effect can record up to 15,000 healing, and only a single instance can exist at once, but it can record the healing from multiple equipping characters. Equipping characters on standby can still trigger this effect.",
        },
        rarity: 5,
        pieces: {
          flower: {
            name: "Forgotten Oath of Days Past",
            image:
              "./assets/genshin/artifacts/Forgotten Oath of Days Past.webp",
          },
          plume: {
            name: "Recollection of Days Past",
            image: "./assets/genshin/artifacts/Recollection of Days Past.webp",
          },
          sands: {
            name: "Echoing Sound From Days Past",
            image:
              "./assets/genshin/artifacts/Echoing Sound From Days Past.webp",
          },
          goblet: {
            name: "Promised Dream of Days Past",
            image:
              "./assets/genshin/artifacts/Promised Dream of Days Past.webp",
          },
          circlet: {
            name: "Poetry of Days Past",
            image: "./assets/genshin/artifacts/Poetry of Days Past.webp",
          },
        },
      },
      "Nighttime Whispers in the Echoing Woods": {
        "2pc": {
          stat: "ATK%",
          value: 15,
          description: "ATK +18%.",
        },
        "4pc": {
          description:
            "After using an Elemental Skill, gain a 20% Geo DMG Bonus for 10s. While under a shield granted by the Crystallize reaction, the above effect will be increased by 150%, and this additional increase disappears 1s after that shield is lost.",
        },
        rarity: 5,
        pieces: {
          flower: {
            name: "Selfless Floral Accessory",
            image: "./assets/genshin/artifacts/Selfless Floral Accessory.webp",
          },
          plume: {
            name: "Honest Quill",
            image: "./assets/genshin/artifacts/Honest Quill.webp",
          },
          sands: {
            name: "Faithful Hourglass",
            image: "./assets/genshin/artifacts/Faithful Hourglass.webp",
          },
          goblet: {
            name: "Magnanimous Ink Bottle",
            image: "./assets/genshin/artifacts/Magnanimous Ink Bottle.webp",
          },
          circlet: {
            name: "Compassionate Ladies' Hat",
            image: "./assets/genshin/artifacts/Compassionate Ladies' Hat.webp",
          },
        },
      },
      "Fragment of Harmonic Whimsy": {
        "2pc": {
          stat: "ATK%",
          value: 18,
          description: "ATK +18%.",
        },
        "4pc": {
          description:
            "When the value of a Bond of Life increases or decreases, this character deals 18% increased DMG for 6s. Max 3 stacks.",
        },
        rarity: 5,
        pieces: {
          flower: {
            name: "Harmonious Symphony Prelude",
            image:
              "./assets/genshin/artifacts/Harmonious Symphony Prelude.webp",
          },
          plume: {
            name: "Ancient Sea's Nocturnal Musing",
            image:
              "./assets/genshin/artifacts/Ancient Sea's Nocturnal Musing.webp",
          },
          sands: {
            name: "The Grand Jape of the Turning of Fate",
            image:
              "./assets/genshin/artifacts/The Grand Jape of the Turning of Fate.webp",
          },
          goblet: {
            name: "Ichor Shower Rhapsody",
            image: "./assets/genshin/artifacts/Ichor Shower Rhapsody.webp",
          },
          circlet: {
            name: "Whimsical Dance of the Withered",
            image:
              "./assets/genshin/artifacts/Whimsical Dance of the Withered.webp",
          },
        },
      },
      "Unfinished Reverie": {
        "2pc": {
          stat: "ATK%",
          value: 18,
          description: "ATK +18%.",
        },
        "4pc": {
          description:
            "After leaving combat for 3s, DMG dealt increased by 50%. In combat, if no Burning opponents are nearby for more than 6s, this DMG Bonus will decrease by 10% per second until it reaches 0%. When a Burning opponent exists, it will increase by 10% instead until it reaches 50%. This effect still triggers if the equipping character is off-field.",
        },
        rarity: 5,
        flower: {
          name: "Dark Fruit of Bright Flowers",
          image: "./assets/genshin/artifacts/Dark Fruit of Bright Flowers.webp",
        },
        plume: {
          name: "Faded Emerald Tail",
          image: "./assets/genshin/artifacts/Faded Emerald Tail.webp",
        },
        sands: {
          name: "Moment of Attainment",
          image: "./assets/genshin/artifacts/Moment of Attainment.webp",
        },
        goblet: {
          name: "The Wine-Flask Over Which the Plan Was Hatched",
          image:
            "./assets/genshin/artifacts/The Wine-Flask Over Which the Plan Was Hatched.webp",
        },
        circlet: {
          name: "Crownless Crown",
          image: "./assets/genshin/artifacts/Crownless Crown.webp",
        },
      },
      "Scroll of the Hero of Cinder City": {
        "2pc": {
          stat: "none",
          value: 0,
          description:
            "When a nearby party member triggers a Nightsoul Burst, the equipping character regenerates 6 Elemental Energy.",
        },
        "4pc": {
          description:
            "After the equipping character triggers a reaction related to their Elemental Type, all nearby party members gain a 12% Elemental DMG Bonus for the Elemental Types involved in the elemental reaction for 15s. If the equipping character is in the Nightsoul's Blessing state when triggering this effect, all nearby party members gain an additional 28% Elemental DMG Bonus for the Elemental Types involved in the elemental reaction for 20s. The equipping character can trigger this effect while off-field, and the DMG bonus from Artifact Sets with the same name do not stack.",
        },
        rarity: 5,
        pieces: {
          flower: {
            name: "Beast Tamer's Talisman",
            image: "./assets/genshin/artifacts/Beast Tamer's Talisman.webp",
          },
          plume: {
            name: "Mountain Ranger's Marker",
            image: "./assets/genshin/artifacts/Mountain Ranger's Marker.webp",
          },
          sands: {
            name: "Mystic's Gold Dial",
            image: "./assets/genshin/artifacts/Mystic's Gold Dial.webp",
          },
          goblet: {
            name: "Wandering Scholar's Claw Cup",
            image:
              "./assets/genshin/artifacts/Wandering Scholar's Claw Cup.webp",
          },
          circlet: {
            name: "Demon-Warrior's Feather Mask",
            image:
              "./assets/genshin/artifacts/Demon-Warrior's Feather Mask.webp",
          },
        },
      },
      "Obsidian Codex": {
        "2pc": {
          stat: "none",
          value: 0,
          description:
            "While the equipping character is in Nightsoul's Blessing and is on the field, their DMG dealt is increased by 15%.",
        },
        "4pc": {
          description:
            "After the equipping character consumes 1 Nightsoul point while on the field, CRIT Rate increases by 40% for 6s. This effect can trigger once every second.",
        },
        rarity: 5,
        pieces: {
          flower: {
            name: "Reckoning of the Xenogenic",
            image: "./assets/genshin/artifacts/Reckoning of the Xenogenic.webp",
          },
          plume: {
            name: "Root of the Spirit-Marrow",
            image: "./assets/genshin/artifacts/Root of the Spirit-Marrow.webp",
          },
          sands: {
            name: "Myths of the Night Realm",
            image: "./assets/genshin/artifacts/Myths of the Night Realm.webp",
          },
          goblet: {
            name: "Pre-Banquet of the Contenders",
            image:
              "./assets/genshin/artifacts/Pre-Banquet of the Contenders.webp",
          },
          circlet: {
            name: "Crown of the Saints",
            image: "./assets/genshin/artifacts/Crown of the Saints.webp",
          },
        },
      },
      "Finale of the Deep Galleries": {
        "2pc": {
          stat: "Cryo DMG Bonus",
          value: 15,
          description: "Cryo DMG Bonus +15%",
        },
        "4pc": {
          description:
            "When the equipping character has 0 Elemental Energy, Normal Attack DMG is increased by 60% and Elemental Burst DMG is increased by 60%. After the equipping character deals Normal Attack DMG, the aforementioned Elemental Burst effect will stop applying for 6s. After the equipping character deals Elemental Burst DMG, the aforementioned Normal Attack effect will stop applying for 6s. This effect can trigger even if the equipping character is off the field.",
        },
        rarity: 5,
        pieces: {
          flower: {
            name: "Gallery's Echoing Song",
            image: "./assets/genshin/artifacts/Gallery's Echoing Song.webp",
          },
          plume: {
            name: "Gallery's Distant Pact",
            image: "./assets/genshin/artifacts/Gallery's Distant Pact.webp",
          },
          sands: {
            name: "Gallery's Moment of Oblivion",
            image:
              "./assets/genshin/artifacts/Gallery's Moment of Oblivion.webp",
          },
          goblet: {
            name: "Gallery's Bestowed Banquet",
            image: "./assets/genshin/artifacts/Gallery's Bestowed Banquet.webp",
          },
          circlet: {
            name: "Gallery's Lost Crown",
            image: "./assets/genshin/artifacts/Gallery's Lost Crown.webp",
          },
        },
      },
      "Long Night's Oath": {
        "2pc": {
          stat: "none",
          value: 0,
          description: "Plunging Attack DMG increased by 25%.",
        },
        "4pc": {
          description:
            "After the equipping character's Plunging Attack/Charged Attack/Elemental Skill hits an opponent, they will gain 1/2/2 stack(s) of 'Radiance Everlasting.' Plunging Attacks, Charged Attacks or Elemental Skills can each trigger this effect once every 1s. Radiance Everlasting: Plunging Attacks deal 15% increased DMG for 6s. Max 5 stacks. Each stack's duration is counted independently.",
        },
        rarity: 5,
        pieces: {
          flower: {
            name: "Lightkeeper's Pledge",
            image: "./assets/genshin/artifacts/Lightkeeper's Pledge.webp",
          },
          plume: {
            name: "Nightingale's Tail Feather",
            image: "./assets/genshin/artifacts/Nightingale's Tail Feather.webp",
          },
          sands: {
            name: "Undying One's Mourning Bell",
            image:
              "./assets/genshin/artifacts/Undying One's Mourning Bell.webp",
          },
          goblet: {
            name: "A Horn Unwinded",
            image: "./assets/genshin/artifacts/A Horn Unwinded.webp",
          },
          circlet: {
            name: "Dyed Tassel",
            image: "./assets/genshin/artifacts/Dyed Tassel.webp",
          },
        },
      },
      "Night of the Sky's Unveiling": {
        "2pc": {
          stat: "Elemental Mastery",
          value: 80,
          description: "Increases Elemental Mastery by 80.",
        },
        "4pc": {
          description:
            "When nearby party members trigger Lunar Reactions, if the equipping character is on the field, gain the Gleaming Moon: Intent effect for 4s: Increases CRIT Rate by 15%/30% when the party's Moonsign is Nascent Gleam/Ascendant Gleam. All party members' Lunar Reaction DMG is increased by 10% for each different Gleaming Moon effect that party members have. Effects from Gleaming Moon cannot stack.",
        },
        rarity: 5,
        pieces: {
          flower: {
            name: "Bloom of the Mind's Desire",
            image: "./assets/genshin/artifacts/Bloom of the Mind's Desire.webp",
          },
          plume: {
            name: "Feather of Indelible Sin",
            image: "./assets/genshin/artifacts/Feather of Indelible Sin.webp",
          },
          sands: {
            name: "Revelation's Toll",
            image: "./assets/genshin/artifacts/Revelation's Toll.webp",
          },
          goblet: {
            name: "Vessel of Plenty",
            image: "./assets/genshin/artifacts/Vessel of Plenty.webp",
          },
          circlet: {
            name: "Crown of the Befallen",
            image: "./assets/genshin/artifacts/Crown of the Befallen.webp",
          },
        },
      },
      "Silken Moon's Serenade": {
        "2pc": {
          stat: "Energy Recharge",
          value: 20,
          description: "Energy Recharge +20%.",
        },
        "4pc": {
          description:
            "When dealing Elemental DMG, gain the Gleaming Moon: Devotion effect for 8s: Increases all party members' Elemental Mastery by 60/120 when the party's Moonsign is Nascent Gleam/Ascendant Gleam. The equipping character can trigger this effect while off-field. All party members' Lunar Reaction DMG is increased by 10% for each different Gleaming Moon effect that party members have. Effects from Gleaming Moon cannot stack.",
        },
        rarity: 5,
        pieces: {
          flower: {
            name: "Crystal Tear of the Wanderer",
            image:
              "./assets/genshin/artifacts/Crystal Tear of the Wanderer.webp",
          },
          plume: {
            name: "Pristine Plume of the Blessed",
            image:
              "./assets/genshin/artifacts/Pristine Plume of the Blessed.webp",
          },
          sands: {
            name: "Frost Devotee's Delirium",
            image: "./assets/genshin/artifacts/Frost Devotee's Delirium.webp",
          },
          goblet: {
            name: "Joyous Glory of the Pure",
            image: "./assets/genshin/artifacts/Joyous Glory of the Pure.webp",
          },
          circlet: {
            name: "Holy Crown of the Believer",
            image: "./assets/genshin/artifacts/Holy Crown of the Believer.webp",
          },
        },
      },
    },
  },
  hsr: {
    name: "Relics",
    levelOptions: [80],
    artifactSets: {
      // Add your HSR relic sets here when you have them
    },
  },
  zzz: {
    name: "Discs",
    levelOptions: [60],
    artifactSets: {
      // Add your ZZZ disc sets here when you have them
    },
  },
};

export const ARTIFACT_MAIN_STATS = {
  flower: ["HP"],
  plume: ["ATK"],
  sands: ["HP%", "ATK%", "DEF%", "Elemental Mastery", "Energy Recharge"],
  goblet: [
    "HP%",
    "ATK%",
    "DEF%",
    "Elemental Mastery",
    "Pyro DMG%",
    "Hydro DMG%",
    "Electro DMG%",
    "Cryo DMG%",
    "Anemo DMG%",
    "Geo DMG%",
    "Dendro DMG%",
    "Physical DMG%",
  ],
  circlet: [
    "HP%",
    "ATK%",
    "DEF%",
    "Elemental Mastery",
    "CRIT Rate",
    "CRIT DMG",
    "Healing Bonus",
  ],
};

export const ARTIFACT_MAIN_STAT_VALUES = {
  5: {
    "HP": 4780,
    "ATK": 311,
    "HP%": 46.6,
    "ATK%": 46.6,
    "DEF%": 46.6,
    "Elemental Mastery": 186.5,
    "Energy Recharge": 51.8,
    "CRIT Rate": 31.1,
    "CRIT DMG": 62.2,
    "Healing Bonus": 35.9,
    "Pyro DMG%": 46.6,
    "Hydro DMG%": 46.6,
    "Electro DMG%": 46.6,
    "Cryo DMG%": 46.6,
    "Anemo DMG%": 46.6,
    "Geo DMG%": 46.6,
    "Dendro DMG%": 46.6,
    "Physical DMG%": 58.3,
  },
  4: {
    "HP": 3571,
    "ATK": 232,
    "HP%": 34.8,
    "ATK%": 34.8,
    "DEF%": 34.8,
    "Elemental Mastery": 139.3,
    "Energy Recharge": 39.0,
    "CRIT Rate": 23.3,
    "CRIT DMG": 46.4,
    "Healing Bonus": 26.8,
    "Pyro DMG%": 34.8,
    "Hydro DMG%": 34.8,
    "Electro DMG%": 34.8,
    "Cryo DMG%": 34.8,
    "Anemo DMG%": 34.8,
    "Geo DMG%": 34.8,
    "Dendro DMG%": 34.8,
    "Physical DMG%": 43.5,
  },
};
