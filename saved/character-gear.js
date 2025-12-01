// /saved/character-gear.js

import { CHARACTER_STATS } from "../data/character-stats.js";
import { ALL_CHARACTERS } from "../data/all-characters.js";
import { ALL_WEAPONS } from "../data/all-weapons.js";
import { getCharacterById, saveMyCharacters } from "./my-characters.js";
import { renderCharacterDetail } from "../components/character-details.js";
import {
  ARTIFACT_MAIN_STAT_VALUES,
  ARTIFACT_MAIN_STATS,
  GEAR_CONFIG,
} from "../data/all-gear.js";

// =================================================================
// NEW SUBSTAT CALCULATOR
// =================================================================

class NewSubstatCalculator {
  static SUBSTAT_ROLL_VALUES = {
    5: {
      "HP": { min: 209.13, max: 299.75 },
      "ATK": { min: 13.62, max: 19.45 },
      "DEF": { min: 16.20, max: 23.15 },
      "HP%": { min: 4.08, max: 5.83 },
      "ATK%": { min: 4.08, max: 5.83 },
      "DEF%": { min: 5.10, max: 7.29 },
      "Elemental Mastery": { min: 16.32, max: 23.31 },
      "Energy Recharge": { min: 4.53, max: 6.48 },
      "CRIT Rate": { min: 2.72, max: 3.89 },
      "CRIT DMG": { min: 5.44, max: 7.77 },
    },
  };

  // Priority order for substat selection
  static SUBSTAT_PRIORITY = [
    "CRIT Rate",
    "CRIT DMG",
    "Energy Recharge",
    "Elemental Mastery",
    "HP%",
    "DEF%",
    "ATK%",
    "HP",
    "DEF",
    "ATK",
  ];

  static calculateSubstatRequirements(char, baseStats, goalStats) {
    const currentBaseStats = this.calculateBaseStatsWithArtifactsAndSets(
      char,
      baseStats,
    );
    const statGaps = this.calculateStatGaps(currentBaseStats, goalStats);

    if (Object.keys(statGaps).length === 0) {
      return { noGaps: true };
    }

    // Determine which substat types are needed for the goal
    const neededSubstatTypes = this.getNeededSubstatTypes(statGaps);

    // Calculate available rolls for each needed substat type
    const availableRollsResult = this.calculateAvailableRollsForNeededTypes(
      char,
      neededSubstatTypes,
    );

    // Calculate how many rolls of each type are needed to fill gaps
    const rollRequirements = this.calculateRollRequirements(
      statGaps,
      neededSubstatTypes,
      baseStats,
      availableRollsResult.byType,
    );

    return {
      statGaps,
      neededSubstatTypes,
      availableRolls: availableRollsResult,
      rollRequirements,
      currentBaseStats,
    };
  }

  static calculateBaseStatsWithArtifactsAndSets(char, baseStats) {
    // Get character ascension stat
    const charStatsData = CHARACTER_STATS[char.game]?.[char.name];
    const charAscensionStat = charStatsData?.additionalStat;

    // Get weapon stats
    const weaponStats = StatCalculator.calculateWeaponStats(char);

    // Get artifact main stats
    const artifactStats = this.calculateArtifactMainStats(char);

    // Get artifact set effects
    const setEffects = this.calculateArtifactSetEffects(char);

    // Calculate base HP with all sources
    const baseHP = baseStats.baseHP;
    let hpPercentSources = artifactStats.hpPercent +
      (setEffects.stats["HP%"] || 0);

    // Handle character ascension stat for HP - always percentage
    if (charAscensionStat) {
      if (charAscensionStat.type === "HP" || charAscensionStat.type === "HP%") {
        hpPercentSources += charAscensionStat.value;
      }
    }

    // Handle weapon stat for HP - always percentage
    if (weaponStats.additionalStat) {
      if (
        weaponStats.additionalStat.type === "HP" ||
        weaponStats.additionalStat.type === "HP%"
      ) {
        hpPercentSources += weaponStats.additionalStat.value;
      }
    }

    // Calculate base ATK with all sources
    const baseATK = baseStats.baseATK + weaponStats.baseATK;
    let atkPercentSources = artifactStats.atkPercent +
      (setEffects.stats["ATK%"] || 0);

    // Handle character ascension stat for ATK - always percentage
    if (charAscensionStat) {
      if (
        charAscensionStat.type === "ATK" || charAscensionStat.type === "ATK%"
      ) {
        atkPercentSources += charAscensionStat.value;
      }
    }

    // Handle weapon stat for ATK - always percentage
    if (weaponStats.additionalStat) {
      if (
        weaponStats.additionalStat.type === "ATK" ||
        weaponStats.additionalStat.type === "ATK%"
      ) {
        atkPercentSources += weaponStats.additionalStat.value;
      }
    }

    // Calculate base DEF with all sources
    const baseDEF = baseStats.baseDEF;
    let defPercentSources = artifactStats.defPercent +
      (setEffects.stats["DEF%"] || 0);

    // Handle character ascension stat for DEF - always percentage
    if (charAscensionStat) {
      if (
        charAscensionStat.type === "DEF" || charAscensionStat.type === "DEF%"
      ) {
        defPercentSources += charAscensionStat.value;
      }
    }

    // Handle weapon stat for DEF - always percentage
    if (weaponStats.additionalStat) {
      if (
        weaponStats.additionalStat.type === "DEF" ||
        weaponStats.additionalStat.type === "DEF%"
      ) {
        defPercentSources += weaponStats.additionalStat.value;
      }
    }

    // Calculate final stats (without substats)
    const stats = {
      hp: this.calculateHP(baseHP, hpPercentSources, artifactStats.hpFlat),
      atk: this.calculateATK(
        baseStats.baseATK,
        weaponStats.baseATK,
        atkPercentSources,
        artifactStats.atkFlat,
      ),
      def: this.calculateDEF(baseDEF, defPercentSources, artifactStats.defFlat),
      elementalMastery: artifactStats.elementalMastery +
        (setEffects.stats["Elemental Mastery"] || 0) +
        (charAscensionStat?.type === "Elemental Mastery"
          ? charAscensionStat.value
          : 0) +
        (weaponStats.additionalStat?.type === "Elemental Mastery"
          ? weaponStats.additionalStat.value
          : 0),
      critRate: 5 + artifactStats.critRate +
        (charAscensionStat?.type === "CRIT Rate"
          ? charAscensionStat.value
          : 0) +
        (weaponStats.additionalStat?.type === "CRIT Rate"
          ? weaponStats.additionalStat.value
          : 0),
      critDmg: 50 + artifactStats.critDmg +
        (charAscensionStat?.type === "CRIT DMG" ? charAscensionStat.value : 0) +
        (weaponStats.additionalStat?.type === "CRIT DMG"
          ? weaponStats.additionalStat.value
          : 0),
      energyRecharge: 100 + artifactStats.energyRecharge +
        (setEffects.stats["Energy Recharge"] || 0) +
        (charAscensionStat?.type === "Energy Recharge"
          ? charAscensionStat.value
          : 0) +
        (weaponStats.additionalStat?.type === "Energy Recharge"
          ? weaponStats.additionalStat.value
          : 0),
      elementalDmg: artifactStats.elementalDmg,
    };

    return stats;
  }

  static getNeededSubstatTypes(statGaps) {
    const neededTypes = new Set();

    Object.keys(statGaps).forEach((statKey) => {
      const types = this.getSubstatTypesForStat(statKey);
      types.forEach((type) => neededTypes.add(type));
    });

    // Sort by priority
    return Array.from(neededTypes).sort((a, b) => {
      const indexA = this.SUBSTAT_PRIORITY.indexOf(a);
      const indexB = this.SUBSTAT_PRIORITY.indexOf(b);
      return indexA - indexB;
    });
  }

  static calculateAvailableRollsForNeededTypes(char, neededSubstatTypes) {
    const slots = ["flower", "plume", "sands", "goblet", "circlet"];
    const availableRolls = {};

    // Initialize for each needed type
    neededSubstatTypes.forEach((type) => {
      availableRolls[type] = {
        base: 0, // base substat lines (1 per artifact that has this type as one of its initial 4)
        extraMin: 0, // minimum additional rolls (if this type gets no upgrades)
        extraMax: 0, // maximum additional rolls (if all upgrades go to this type)
        totalMin: 0, // base + extraMin
        totalMax: 0, // base + extraMax
      };
    });

    // Track which artifacts can roll which types
    const artifactPossibleTypes = {};

    slots.forEach((slot) => {
      const artifact = char.gear.artifacts[slot];
      const availableSubstats = this.getAvailableSubstatsForSlot(
        slot,
        artifact.mainStat,
      );

      // Filter needed types that this artifact can actually roll
      const possibleTypes = neededSubstatTypes.filter((type) =>
        availableSubstats.includes(type)
      );

      artifactPossibleTypes[slot] = possibleTypes;

      // If no needed types can roll here, skip
      if (possibleTypes.length === 0) return;

      // Artifact has 4 initial substat lines
      // We need to distribute 1 base line to each possible type (up to 4 types)

      // Distribute 1 base line to each type (if we have 4 or fewer types)
      const typesToGetBase = possibleTypes.slice(0, 4); // Max 4 types per artifact
      typesToGetBase.forEach((type) => {
        availableRolls[type].base += 1; // This artifact contributes 1 base line for this type
      });

      // Calculate upgrade rolls for this artifact
      const is5Star = artifact.rarity === 5;
      const minUpgrades = is5Star ? 4 : 2; // 5★: 4-5 upgrades, 4★: 2-3 upgrades
      const maxUpgrades = is5Star ? 5 : 3;

      // For maximum calculation: each type could get ALL upgrade rolls
      possibleTypes.forEach((type) => {
        availableRolls[type].extraMax += maxUpgrades;
      });

      // For minimum calculation: each type could get NO upgrade rolls
      // So extraMin stays at 0
    });

    // Calculate totals for each type
    neededSubstatTypes.forEach((type) => {
      const rolls = availableRolls[type];

      // Count how many artifacts can roll this type
      let artifactCount = 0;
      slots.forEach((slot) => {
        if (artifactPossibleTypes[slot]?.includes(type)) {
          artifactCount++;
        }
      });

      if (artifactCount === 0) return;

      const artifactsWithType = [];
      slots.forEach((slot) => {
        if (artifactPossibleTypes[slot]?.includes(type)) {
          const artifact = char.gear.artifacts[slot];
          artifactsWithType.push({
            slot,
            rarity: artifact.rarity,
            is5Star: artifact.rarity === 5,
          });
        }
      });

      // Recalculate with proper values
      rolls.base = artifactCount; // 1 base line per artifact
      rolls.extraMin = 0; // Minimum: no upgrades
      rolls.extraMax = artifactsWithType.reduce((sum, artifact) => {
        return sum + (artifact.is5Star ? 5 : 3); // Max upgrades per artifact
      }, 0);

      rolls.totalMin = rolls.base + rolls.extraMin;
      rolls.totalMax = rolls.base + rolls.extraMax;
    });

    // Calculate TOTAL available rolls across ALL needed types (for summary only)
    const totalAvailable = {
      min: 0,
      max: 0,
    };

    // For each artifact, calculate its contribution to total available rolls
    slots.forEach((slot) => {
      const artifact = char.gear.artifacts[slot];
      const is5Star = artifact.rarity === 5;

      const possibleTypes = artifactPossibleTypes[slot];
      if (possibleTypes && possibleTypes.length > 0) {
        // Each artifact contributes:
        // - Base lines: up to 4 (one for each different substat type)
        const baseLines = Math.min(4, possibleTypes.length);

        // - Upgrades: 4-5 for 5★, 2-3 for 4★
        const minUpgrades = is5Star ? 4 : 2;
        const maxUpgrades = is5Star ? 5 : 3;

        // Total rolls from this artifact:
        totalAvailable.min += baseLines + minUpgrades;
        totalAvailable.max += baseLines + maxUpgrades;
      }
    });

    return {
      byType: availableRolls, // Keep existing per-type calculations
      total: totalAvailable, // Add correct total calculations for summary
    };
  }

  static calculateRollRequirements(
    statGaps,
    neededSubstatTypes,
    baseStats,
    availableRolls,
  ) {
    const requirements = {};

    // First, handle simple stats (EM, ER, Crit)
    const simpleStats = [
      "elementalMastery",
      "energyRecharge",
      "critRate",
      "critDmg",
    ];
    simpleStats.forEach((statKey) => {
      if (statGaps[statKey]) {
        const substatType = this.getSubstatTypesForStat(statKey)[0];
        if (substatType && neededSubstatTypes.includes(substatType)) {
          const gap = statGaps[statKey];
          const rollValues = this.SUBSTAT_ROLL_VALUES[5][substatType];

          // Best case: using MAX roll values (fewer rolls needed)
          const bestCaseRollsNeeded = Math.ceil(gap / rollValues.max);
          // Worst case: using MIN roll values (more rolls needed)
          const worstCaseRollsNeeded = Math.ceil(gap / rollValues.min);

          requirements[substatType] = {
            statKey: statKey,
            gap: gap,
            bestCaseRolls: bestCaseRollsNeeded,
            worstCaseRolls: worstCaseRollsNeeded,
            rollValues: rollValues,
            gapValue: gap,
          };
        }
      }
    });

    // Handle HP, ATK, DEF (which can use both % and flat substats)
    const complexStats = ["hp", "atk", "def"];
    complexStats.forEach((statKey) => {
      if (statGaps[statKey]) {
        const gap = statGaps[statKey];
        const percentType = this.getPercentTypeForStat(statKey);
        const flatType = this.getFlatTypeForStat(statKey);

        // Get base value for calculating % substat effectiveness
        const baseValue = this.getBaseValueForStat(statKey, baseStats);

        const percentRollValues = this.SUBSTAT_ROLL_VALUES[5][percentType];
        const flatRollValues = this.SUBSTAT_ROLL_VALUES[5][flatType];

        // Calculate value per roll for percentage substats
        const percentValuePerRoll = {
          min: baseValue * percentRollValues.min / 100,
          max: baseValue * percentRollValues.max / 100,
        };

        // Check if percent type is available
        if (neededSubstatTypes.includes(percentType)) {
          const bestCasePercentRollsNeeded = Math.ceil(
            gap / percentValuePerRoll.max,
          );
          const worstCasePercentRollsNeeded = Math.ceil(
            gap / percentValuePerRoll.min,
          );

          requirements[percentType] = {
            statKey: statKey,
            gap: gap,
            bestCaseRolls: bestCasePercentRollsNeeded,
            worstCaseRolls: worstCasePercentRollsNeeded,
            rollValues: percentRollValues,
            valuePerRoll: percentValuePerRoll,
            baseValue: baseValue,
            gapValue: gap,
          };
        }

        // Check if flat type is available
        if (neededSubstatTypes.includes(flatType)) {
          const bestCaseFlatRollsNeeded = Math.ceil(gap / flatRollValues.max);
          const worstCaseFlatRollsNeeded = Math.ceil(gap / flatRollValues.min);

          requirements[flatType] = {
            statKey: statKey,
            gap: gap,
            bestCaseRolls: bestCaseFlatRollsNeeded,
            worstCaseRolls: worstCaseFlatRollsNeeded,
            rollValues: flatRollValues,
            gapValue: gap,
          };
        }
      }
    });

    return requirements;
  }

  static getPercentTypeForStat(statKey) {
    const map = {
      "hp": "HP%",
      "atk": "ATK%",
      "def": "DEF%",
    };
    return map[statKey];
  }

  static getFlatTypeForStat(statKey) {
    const map = {
      "hp": "HP",
      "atk": "ATK",
      "def": "DEF",
    };
    return map[statKey];
  }

  static getBaseValueForStat(statKey, baseStats) {
    const map = {
      "hp": baseStats.baseHP || 0,
      "atk": (baseStats.baseATK || 0) + (baseStats.weaponATK || 0),
      "def": baseStats.baseDEF || 0,
    };
    return map[statKey];
  }

  static calculateHP(baseHP, hpPercent, hpFlat) {
    return (baseHP * (1 + hpPercent / 100)) + hpFlat;
  }

  static calculateATK(baseATK, weaponATK, atkPercent, atkFlat) {
    const totalBaseATK = baseATK + weaponATK;
    return (totalBaseATK * (1 + atkPercent / 100)) + atkFlat;
  }

  static calculateDEF(baseDEF, defPercent, defFlat) {
    return (baseDEF * (1 + defPercent / 100)) + defFlat;
  }

  static calculateStatGaps(currentStats, goalStats) {
    const gaps = {};

    Object.keys(goalStats).forEach((statKey) => {
      const goal = goalStats[statKey];
      const current = currentStats[statKey];

      if (goal > current) {
        gaps[statKey] = goal - current;
      }
    });

    return gaps;
  }

  static getSubstatTypesForStat(statKey) {
    const mapping = {
      hp: ["HP%", "HP"],
      atk: ["ATK%", "ATK"],
      def: ["DEF%", "DEF"],
      elementalMastery: ["Elemental Mastery"],
      critRate: ["CRIT Rate"],
      critDmg: ["CRIT DMG"],
      energyRecharge: ["Energy Recharge"],
      elementalDmg: [],
    };

    return mapping[statKey] || [];
  }

  static getAvailableSubstatsForSlot(slot, mainStat) {
    const allSubstats = [
      "HP",
      "ATK",
      "DEF",
      "HP%",
      "ATK%",
      "DEF%",
      "Elemental Mastery",
      "Energy Recharge",
      "CRIT Rate",
      "CRIT DMG",
    ];

    // Remove conflicting substats (can't have same as main stat)
    const conflicts = {
      "HP": ["HP"],
      "ATK": ["ATK"],
      "HP%": ["HP%"],
      "ATK%": ["ATK%"],
      "DEF%": ["DEF%"],
      "Elemental Mastery": ["Elemental Mastery"],
      "Energy Recharge": ["Energy Recharge"],
      "CRIT Rate": ["CRIT Rate"],
      "CRIT DMG": ["CRIT DMG"],
      "Healing Bonus": ["Healing Bonus"],
      "Pyro DMG%": ["Pyro DMG%"],
      "Hydro DMG%": ["Hydro DMG%"],
      "Electro DMG%": ["Electro DMG%"],
      "Cryo DMG%": ["Cryo DMG%"],
      "Anemo DMG%": ["Anemo DMG%"],
      "Geo DMG%": ["Geo DMG%"],
      "Dendro DMG%": ["Dendro DMG%"],
      "Physical DMG%": ["Physical DMG%"],
    };

    const conflicting = conflicts[mainStat] || [];
    return allSubstats.filter((substat) => !conflicting.includes(substat));
  }

  static calculateArtifactMainStats(char) {
    const artifacts = char.gear.artifacts;
    const stats = {
      hpFlat: 0,
      hpPercent: 0,
      atkFlat: 0,
      atkPercent: 0,
      defFlat: 0,
      defPercent: 0,
      elementalMastery: 0,
      energyRecharge: 0,
      critRate: 0,
      critDmg: 0,
      healingBonus: 0,
      elementalDmg: 0,
    };

    Object.values(artifacts).forEach((artifact) => {
      const value = artifact.value;
      switch (artifact.mainStat) {
        case "HP":
          stats.hpFlat += value;
          break;
        case "ATK":
          stats.atkFlat += value;
          break;
        case "HP%":
          stats.hpPercent += value;
          break;
        case "ATK%":
          stats.atkPercent += value;
          break;
        case "DEF%":
          stats.defPercent += value;
          break;
        case "Elemental Mastery":
          stats.elementalMastery += value;
          break;
        case "Energy Recharge":
          stats.energyRecharge += value;
          break;
        case "CRIT Rate":
          stats.critRate += value;
          break;
        case "CRIT DMG":
          stats.critDmg += value;
          break;
        case "Healing Bonus":
          stats.healingBonus += value;
          break;
        default:
          if (artifact.mainStat.includes("DMG%")) {
            stats.elementalDmg += value;
          }
          break;
      }
    });

    return stats;
  }

  static calculateArtifactSetEffects(char) {
    const effects = { stats: {}, descriptions: [] };
    const gear = char.gear;
    const gameConfig = GearUtils.getGearConfig(char.game);

    const processSetEffect = (setName, isFirstSet = true) => {
      const setData = gameConfig.artifactSets[setName];
      if (!setData) return;

      // Always apply 2pc effect
      const set2pcEffect = setData["2pc"];
      if (set2pcEffect) {
        if (set2pcEffect.stat && set2pcEffect.value) {
          effects.stats[set2pcEffect.stat] =
            (effects.stats[set2pcEffect.stat] || 0) + set2pcEffect.value;
        }
        effects.descriptions.push({
          type: "2pc",
          setName: setName,
          description: set2pcEffect.description || `2pc ${setName} effect`,
        });
      }

      // Apply 4pc effect only if we have 4 pieces of the same set
      if (
        gear.artifactSet1 && gear.artifactSet2 &&
        gear.artifactSet1 === gear.artifactSet2 &&
        gear.artifactSet1 === setName && isFirstSet
      ) {
        const set4pcEffect = setData["4pc"];
        if (set4pcEffect) {
          // Handle 4pc stat bonuses if any
          if (set4pcEffect.stat && set4pcEffect.value) {
            effects.stats[set4pcEffect.stat] =
              (effects.stats[set4pcEffect.stat] || 0) + set4pcEffect.value;
          }
          effects.descriptions.push({
            type: "4pc",
            setName: setName,
            description: set4pcEffect.description,
          });
        }
      }
    };

    if (gear.artifactSet1) processSetEffect(gear.artifactSet1, true);
    if (gear.artifactSet2 && gear.artifactSet2 !== gear.artifactSet1) {
      processSetEffect(gear.artifactSet2, false);
    }

    return effects;
  }

  static formatRequirementsForDisplay(requirements, char) {
    if (requirements.noGaps) {
      return { noGaps: true, message: "All goal stats have been achieved!" };
    }

    const neededSubstatTypes = requirements.neededSubstatTypes || [];
    const availableRolls = requirements.availableRolls || {};
    const rollRequirements = requirements.rollRequirements || {};
    const statGaps = requirements.statGaps || {};

    if (neededSubstatTypes.length === 0) {
      return {
        possible: false,
        message: "No goal stats set or invalid calculation",
      };
    }

    // Calculate totals for display
    let totalBestCaseRollsNeeded = 0;
    let totalWorstCaseRollsNeeded = 0;

    const substatData = {};

    neededSubstatTypes.forEach((type) => {
      const rolls = availableRolls.byType
        ? availableRolls.byType[type]
        : availableRolls[type];
      const requirement = rollRequirements[type];

      if (rolls && requirement) {
        const bestCaseRollsNeeded = requirement.bestCaseRolls || 0;
        const worstCaseRollsNeeded = requirement.worstCaseRolls || 0;
        const gapValue = requirement.gapValue || requirement.gap || 0;

        totalBestCaseRollsNeeded += bestCaseRollsNeeded;
        totalWorstCaseRollsNeeded += worstCaseRollsNeeded;

        substatData[type] = {
          neededRolls: {
            best: bestCaseRollsNeeded,
            worst: worstCaseRollsNeeded,
          },
          availableRolls: {
            min: rolls.totalMin,
            max: rolls.totalMax,
          },
          gapValue: gapValue,
          substatType: type,
        };
      }
    });

    // Use the corrected total available rolls
    const totalAvailable = availableRolls.total || { min: 0, max: 0 };

    const displayData = {
      substats: substatData,
      totalRolls: {
        bestCase: totalBestCaseRollsNeeded,
        worstCase: totalWorstCaseRollsNeeded,
        minAvailable: totalAvailable.min,
        maxAvailable: totalAvailable.max,
      },
      statGaps: statGaps,
    };

    return displayData;
  }
}

// =================================================================
// UTILITY FUNCTIONS (KEEP EXISTING)
// =================================================================

class GearUtils {
  static getGearConfig(game) {
    return GEAR_CONFIG[game] || GEAR_CONFIG.genshin;
  }

  static getArtifactMainStatValue(mainStat, rarity = 5) {
    return ARTIFACT_MAIN_STAT_VALUES[rarity]?.[mainStat] || 0;
  }

  static formatStatValue(stat, value) {
    if (stat === "HP") return Math.round(value).toLocaleString();
    if (stat === "ATK") return Math.round(value).toLocaleString();
    if (
      stat.includes("%") || stat === "CRIT Rate" || stat === "CRIT DMG" ||
      stat === "Healing Bonus" || stat === "Energy Recharge"
    ) {
      return value.toFixed(1) + "%";
    }
    if (stat === "Elemental Mastery") return Math.round(value).toLocaleString();
    return value.toFixed(1);
  }

  static getArtifactIcon(slot) {
    const icons = {
      flower: "🌸",
      plume: "🪶",
      sands: "⏳",
      goblet: "🍶",
      circlet: "👑",
    };
    return icons[slot] || "📦";
  }

  static getWeaponImage(char) {
    if (!char.gear?.weapon) return "";

    const charData = ALL_CHARACTERS[char.game]?.[char.name];
    const weaponType = charData?.weapon;
    if (!weaponType) return "";

    const weapons = ALL_WEAPONS[char.game]?.[weaponType] || [];
    const weapon = weapons.find((w) => w.name === char.gear.weapon);

    return weapon?.image ||
      `/assets/${char.game}/weapons/${char.gear.weapon}.webp`;
  }

  static getWeaponRarityColor(char) {
    if (!char.gear?.weapon) return "#95a5a6";

    const charData = ALL_CHARACTERS[char.game]?.[char.name];
    const weaponType = charData?.weapon;
    if (!weaponType) return "#95a5a6";

    const weapons = ALL_WEAPONS[char.game]?.[weaponType] || [];
    const weapon = weapons.find((w) => w.name === char.gear.weapon);
    if (!weapon) return "#95a5a6";

    const rarity = weapon.rarity;
    switch (rarity) {
      case 5:
        return "#ffd700";
      case 4:
        return "#c0c0c0";
      case 3:
        return "#cd7f32";
      default:
        return "#95a5a6";
    }
  }

  static getWeaponRarityText(char) {
    if (!char.gear?.weapon) return "";

    const charData = ALL_CHARACTERS[char.game]?.[char.name];
    const weaponType = charData?.weapon;
    if (!weaponType) return "";

    const weapons = ALL_WEAPONS[char.game]?.[weaponType] || [];
    const weapon = weapons.find((w) => w.name === char.gear.weapon);

    return weapon?.rarity ? `${weapon.rarity}★` : "";
  }

  static getDefaultArtifactSetForWeapon(weaponType) {
    const meleeWeapons = ["Sword", "Claymore", "Polearm"];
    const rangedWeapons = ["Catalyst", "Bow"];

    if (meleeWeapons.includes(weaponType)) {
      return "Gladiator's Finale";
    } else if (rangedWeapons.includes(weaponType)) {
      return "Wanderer's Troupe";
    }
    return "Gladiator's Finale";
  }

  static isFourStarSet(setName) {
    const gameConfig = this.getGearConfig("genshin");
    const setData = gameConfig.artifactSets[setName];
    return setData && setData.rarity === 4;
  }

  static getArtifactImage(char, slot) {
    const gear = char.gear;
    if (!gear) return "";

    const gameConfig = this.getGearConfig(char.game);

    const set1 = gear.artifactSet1;
    const set2 = gear.artifactSet2;

    let targetSet = null;

    if (!set1 && !set2) {
      const charData = ALL_CHARACTERS[char.game]?.[char.name];
      const weaponType = charData?.weapon;
      targetSet = this.getDefaultArtifactSetForWeapon(weaponType);
    } else if (set1 && !set2) {
      if (this.isFourStarSet(set1)) {
        if (slot === "flower" || slot === "plume") {
          targetSet = set1;
        } else {
          const charData = ALL_CHARACTERS[char.game]?.[char.name];
          const weaponType = charData?.weapon;
          targetSet = this.getDefaultArtifactSetForWeapon(weaponType);
        }
      } else {
        targetSet = set1;
      }
    } else if (set1 && set2) {
      if (set1 === set2) {
        if (this.isFourStarSet(set1)) {
          if (
            slot === "flower" || slot === "plume" || slot === "goblet" ||
            slot === "circlet"
          ) {
            targetSet = set1;
          } else {
            const charData = ALL_CHARACTERS[char.game]?.[char.name];
            const weaponType = charData?.weapon;
            targetSet = this.getDefaultArtifactSetForWeapon(weaponType);
          }
        } else {
          targetSet = set1;
        }
      } else {
        if (this.isFourStarSet(set1) && this.isFourStarSet(set2)) {
          if (slot === "flower" || slot === "plume") {
            targetSet = set1;
          } else if (slot === "goblet" || slot === "circlet") {
            targetSet = set2;
          } else {
            const charData = ALL_CHARACTERS[char.game]?.[char.name];
            const weaponType = charData?.weapon;
            targetSet = this.getDefaultArtifactSetForWeapon(weaponType);
          }
        } else if (!this.isFourStarSet(set1) && this.isFourStarSet(set2)) {
          if (slot === "flower" || slot === "plume") {
            targetSet = set1;
          } else if (slot === "goblet" || slot === "circlet") {
            targetSet = set2;
          } else {
            const charData = ALL_CHARACTERS[char.game]?.[char.name];
            const weaponType = charData?.weapon;
            targetSet = this.getDefaultArtifactSetForWeapon(weaponType);
          }
        } else if (this.isFourStarSet(set1) && !this.isFourStarSet(set2)) {
          if (slot === "flower" || slot === "plume") {
            targetSet = set1;
          } else {
            targetSet = set2;
          }
        } else {
          if (slot === "flower" || slot === "plume") {
            targetSet = set1;
          } else {
            targetSet = set2;
          }
        }
      }
    }

    const setData = gameConfig.artifactSets[targetSet];
    if (setData && setData.pieces && setData.pieces[slot]) {
      return setData.pieces[slot].image;
    }

    return "";
  }

  static formatSetEffectText(effect) {
    if (effect.type === "stat") {
      return `+${effect.value}% ${effect.stat}`;
    }
    return effect.description || "";
  }
}

// =================================================================
// STAT CALCULATOR
// =================================================================

class StatCalculator {
  static calculateBaseStats(char, stats, charData) {
    if (!stats) return this.getBaseStats();

    const baseStats = this.getBaseStats();
    const weaponStats = this.calculateWeaponStats(char);

    const charStatsData = CHARACTER_STATS[char.game]?.[char.name];
    const charAscensionStat = charStatsData?.additionalStat;
    const weaponAscensionStat = weaponStats.additionalStat;

    // Determine elemental type for display
    const elementalType = this.getElementalType(char, charAscensionStat);
    baseStats.elementalType = elementalType;

    const totalBaseHP = stats.baseHP;
    const totalBaseATK = stats.baseATK + weaponStats.baseATK;
    const totalBaseDEF = stats.baseDEF;

    // Calculate HP/ATK/DEF percentages from character ascension and weapon
    let hpPercent = 0;
    let atkPercent = 0;
    let defPercent = 0;

    // Add character ascension stats (these are percentage bonuses)
    if (charAscensionStat) {
      switch (charAscensionStat.type) {
        case "HP":
        case "HP%":
          hpPercent += charAscensionStat.value;
          break;
        case "ATK":
        case "ATK%":
          atkPercent += charAscensionStat.value;
          break;
        case "DEF":
        case "DEF%":
          defPercent += charAscensionStat.value;
          break;
      }
    }

    // Add weapon stats (these are also percentage bonuses when they're HP/ATK/DEF)
    if (weaponAscensionStat) {
      switch (weaponAscensionStat.type) {
        case "HP":
        case "HP%":
          hpPercent += weaponAscensionStat.value;
          break;
        case "ATK":
        case "ATK%":
          atkPercent += weaponAscensionStat.value;
          break;
        case "DEF":
        case "DEF%":
          defPercent += weaponAscensionStat.value;
          break;
      }
    }

    // Apply the formulas
    baseStats.hp = this.calculateHP(totalBaseHP, hpPercent, 0);
    baseStats.atk = this.calculateATK(
      stats.baseATK,
      weaponStats.baseATK,
      atkPercent,
      0,
    );
    baseStats.def = this.calculateDEF(totalBaseDEF, defPercent, 0);

    // Handle other stats (flat bonuses)
    if (charAscensionStat) {
      switch (charAscensionStat.type) {
        case "Elemental Mastery":
          baseStats.elementalMastery += charAscensionStat.value;
          break;
        case "CRIT Rate":
          baseStats.critRate += charAscensionStat.value;
          break;
        case "CRIT DMG":
          baseStats.critDmg += charAscensionStat.value;
          break;
        case "Energy Recharge":
          baseStats.energyRecharge += charAscensionStat.value;
          break;
        default:
          if (charAscensionStat.type.includes("DMG Bonus")) {
            baseStats.elementalDmg += charAscensionStat.value;
          }
          break;
      }
    }

    if (weaponAscensionStat) {
      switch (weaponAscensionStat.type) {
        case "Elemental Mastery":
          baseStats.elementalMastery += weaponAscensionStat.value;
          break;
        case "CRIT Rate":
          baseStats.critRate += weaponAscensionStat.value;
          break;
        case "CRIT DMG":
          baseStats.critDmg += weaponAscensionStat.value;
          break;
        case "Energy Recharge":
          baseStats.energyRecharge += weaponAscensionStat.value;
          break;
        default:
          if (weaponAscensionStat.type.includes("DMG Bonus")) {
            baseStats.elementalDmg += weaponAscensionStat.value;
          }
          break;
      }
    }

    return baseStats;
  }

  static getElementalType(char, charAscensionStat) {
    // Extract elemental type from ascension stat or character data
    if (charAscensionStat?.type?.includes("DMG Bonus")) {
      return charAscensionStat.type.replace(" DMG Bonus", "");
    }
  }

  static getBaseStats() {
    return {
      hp: 0,
      atk: 0,
      def: 0,
      elementalMastery: 0,
      critRate: 5,
      critDmg: 50,
      healingBonus: 0,
      energyRecharge: 100,
      elementalDmg: 0,
      elementalType: "Elemental",
    };
  }

  static getPercentageStatBonus(charStat, weaponStat, statType) {
    let bonus = 0;
    // For HP/ATK/DEF: treat "HP", "ATK", "DEF" as percentage bonuses
    if (charStat?.type === statType || charStat?.type === `${statType}%`) {
      bonus += charStat.value;
    }
    if (weaponStat?.type === statType || weaponStat?.type === `${statType}%`) {
      bonus += weaponStat.value;
    }
    return bonus;
  }

  static getFlatStatBonus(charStat, weaponStat, statType) {
    let bonus = 0;
    // These are flat bonuses (CRIT Rate, CRIT DMG, Energy Recharge, Elemental Mastery)
    if (charStat?.type === statType) bonus += charStat.value;
    if (weaponStat?.type === statType) bonus += weaponStat.value;
    return bonus;
  }

  static calculateWeaponStats(char) {
    const weaponName =
      char.gear?.weapon?.replace(/\s*\(\d+★\)\s*$/, "").trim() || "";
    if (!weaponName) {
      return { baseATK: 0, additionalStat: null };
    }

    const charData = ALL_CHARACTERS[char.game]?.[char.name];
    const weaponType = charData?.weapon;
    if (!weaponType) {
      return { baseATK: 0, additionalStat: null };
    }

    const weapons = ALL_WEAPONS[char.game]?.[weaponType] || [];
    const weapon = weapons.find((w) => w.name === weaponName);
    if (!weapon) {
      return { baseATK: 0, additionalStat: null };
    }

    return {
      baseATK: weapon.baseATK || 0,
      additionalStat: weapon.stat && weapon.stat.type !== "none"
        ? {
          type: weapon.stat.type,
          value: weapon.stat.value,
        }
        : null,
    };
  }

  static calculateHP(baseHP, hpPercent, hpFlat) {
    return (baseHP * (1 + hpPercent / 100)) + hpFlat;
  }

  static calculateATK(baseATK, weaponATK, atkPercent, atkFlat) {
    const totalBaseATK = baseATK + weaponATK;
    return (totalBaseATK * (1 + atkPercent / 100)) + atkFlat;
  }

  static calculateDEF(baseDEF, defPercent, defFlat) {
    return (baseDEF * (1 + defPercent / 100)) + defFlat;
  }

  static calculateProjectedStats(char, stats, charData) {
    const baseStats = this.calculateBaseStats(char, stats, charData);
    const artifactStats = this.calculateArtifactMainStats(char);
    const setEffects = NewSubstatCalculator.calculateArtifactSetEffects(char);

    const weaponStats = this.calculateWeaponStats(char);
    const totalBaseHP = stats.baseHP;
    const totalBaseATK = stats.baseATK + weaponStats.baseATK;
    const totalBaseDEF = stats.baseDEF;

    // Get character ascension and weapon stats as percentage bonuses
    const charStatsData = CHARACTER_STATS[char.game]?.[char.name];
    const charAscensionStat = charStatsData?.additionalStat;

    // Gather all HP% sources (including character ascension and weapon stats)
    let totalHPPercent = artifactStats.hpPercent +
      (setEffects.stats["HP%"] || 0);
    if (charAscensionStat?.type === "HP" || charAscensionStat?.type === "HP%") {
      totalHPPercent += charAscensionStat.value;
    }
    if (
      weaponStats.additionalStat?.type === "HP" ||
      weaponStats.additionalStat?.type === "HP%"
    ) {
      totalHPPercent += weaponStats.additionalStat.value;
    }

    // Gather all ATK% sources
    let totalATKPercent = artifactStats.atkPercent +
      (setEffects.stats["ATK%"] || 0);
    if (
      charAscensionStat?.type === "ATK" || charAscensionStat?.type === "ATK%"
    ) {
      totalATKPercent += charAscensionStat.value;
    }
    if (
      weaponStats.additionalStat?.type === "ATK" ||
      weaponStats.additionalStat?.type === "ATK%"
    ) {
      totalATKPercent += weaponStats.additionalStat.value;
    }

    // Gather all DEF% sources
    let totalDEFPercent = artifactStats.defPercent +
      (setEffects.stats["DEF%"] || 0);
    if (
      charAscensionStat?.type === "DEF" || charAscensionStat?.type === "DEF%"
    ) {
      totalDEFPercent += charAscensionStat.value;
    }
    if (
      weaponStats.additionalStat?.type === "DEF" ||
      weaponStats.additionalStat?.type === "DEF%"
    ) {
      totalDEFPercent += weaponStats.additionalStat.value;
    }

    const projected = { ...baseStats };

    // Apply proper formulas with all gathered sources
    projected.hp = this.calculateHP(
      totalBaseHP,
      totalHPPercent,
      artifactStats.hpFlat,
    );
    projected.atk = this.calculateATK(
      stats.baseATK,
      weaponStats.baseATK,
      totalATKPercent,
      artifactStats.atkFlat,
    );
    projected.def = this.calculateDEF(
      totalBaseDEF,
      totalDEFPercent,
      artifactStats.defFlat,
    );

    // Add other stats (these are just additive)
    projected.elementalMastery += artifactStats.elementalMastery +
      (setEffects.stats["Elemental Mastery"] || 0);
    projected.critRate += artifactStats.critRate;
    projected.critDmg += artifactStats.critDmg;
    projected.energyRecharge += artifactStats.energyRecharge +
      (setEffects.stats["Energy Recharge"] || 0);
    projected.healingBonus += artifactStats.healingBonus;
    projected.elementalDmg += artifactStats.elementalDmg;

    return projected;
  }

  static calculateArtifactMainStats(char) {
    const artifacts = char.gear.artifacts;
    const stats = {
      hpFlat: 0,
      hpPercent: 0,
      atkFlat: 0,
      atkPercent: 0,
      defFlat: 0,
      defPercent: 0,
      elementalMastery: 0,
      energyRecharge: 0,
      critRate: 0,
      critDmg: 0,
      healingBonus: 0,
      elementalDmg: 0,
    };

    Object.values(artifacts).forEach((artifact) => {
      const value = artifact.value;
      switch (artifact.mainStat) {
        case "HP":
          stats.hpFlat += value;
          break;
        case "ATK":
          stats.atkFlat += value;
          break;
        case "HP%":
          stats.hpPercent += value;
          break;
        case "ATK%":
          stats.atkPercent += value;
          break;
        case "DEF%":
          stats.defPercent += value;
          break;
        case "Elemental Mastery":
          stats.elementalMastery += value;
          break;
        case "Energy Recharge":
          stats.energyRecharge += value;
          break;
        case "CRIT Rate":
          stats.critRate += value;
          break;
        case "CRIT DMG":
          stats.critDmg += value;
          break;
        case "Healing Bonus":
          stats.healingBonus += value;
          break;
        default:
          if (artifact.mainStat.includes("DMG%")) {
            stats.elementalDmg += value;
          }
          break;
      }
    });

    return stats;
  }
}

// =================================================================
// GEAR RENDERER
// =================================================================

class GearRenderer {
  static render(char) {
    const content = document.getElementById("page-content");
    if (!content) return;

    const gameConfig = GearUtils.getGearConfig(char.game);
    const charData = ALL_CHARACTERS[char.game]?.[char.name];
    const stats = CHARACTER_STATS[char.game]?.[char.name]
      ?.[char.gearLevel || 90];

    this.initializeGearData(char);

    const currentStats = StatCalculator.calculateBaseStats(
      char,
      stats,
      charData,
    );
    const projectedStats = StatCalculator.calculateProjectedStats(
      char,
      stats,
      charData,
    );

    // Get base stats for new calculator
    const baseStats = {
      baseHP: stats.baseHP,
      baseATK: stats.baseATK,
      baseDEF: stats.baseDEF,
      weaponATK: StatCalculator.calculateWeaponStats(char).baseATK,
    };

    // Use new calculator for requirements
    const requirements = NewSubstatCalculator.calculateSubstatRequirements(
      char,
      baseStats,
      char.gear.goalStats,
    );

    content.innerHTML = this.createGearInterface(
      char,
      gameConfig,
      currentStats,
      projectedStats,
      requirements,
    );
  }

  static initializeGearData(char) {
    if (!char.gear) {
      const charData = ALL_CHARACTERS[char.game]?.[char.name];
      const weaponType = charData?.weapon;
      char.weaponType = weaponType;

      const defaultSet = GearUtils.getDefaultArtifactSetForWeapon(weaponType);

      char.gear = {
        weapon: char.weaponName || "",
        artifactSet1: defaultSet,
        artifactSet2: defaultSet,
        artifacts: this.createDefaultArtifacts(char, defaultSet),
        goalStats: this.createDefaultGoalStats(),
      };
      saveMyCharacters();
    }

    if (!char.gearLevel) {
      char.gearLevel = 90;
      saveMyCharacters();
    }
  }

  static createDefaultArtifacts(char, defaultSet) {
    const slots = ["flower", "plume", "sands", "goblet", "circlet"];
    const artifacts = {};

    slots.forEach((slot) => {
      artifacts[slot] = {
        mainStat: ARTIFACT_MAIN_STATS[slot][0],
        value: GearUtils.getArtifactMainStatValue(
          ARTIFACT_MAIN_STATS[slot][0],
          5,
        ),
        rarity: 5,
        image: this.getArtifactImageForSlot(char, slot, defaultSet),
      };
    });

    return artifacts;
  }

  static getArtifactImageForSlot(char, slot, defaultSet) {
    const gameConfig = GearUtils.getGearConfig(char.game);
    const setData = gameConfig.artifactSets[defaultSet];
    return setData?.pieces?.[slot]?.image || "";
  }

  static createDefaultGoalStats() {
    return {
      hp: 0,
      atk: 0,
      def: 0,
      elementalMastery: 0,
      critRate: 5,
      critDmg: 50,
      energyRecharge: 100,
    };
  }

  static createGearInterface(
    char,
    gameConfig,
    currentStats,
    projectedStats,
    requirements,
  ) {
    return `
      <div style="max-width: 1400px; margin: 0 auto; padding: 20px;">
        ${this.createNavigation(char)}
        <h2 style="color: #00ffff; margin-bottom: 25px;">${char.name} - ${gameConfig.name} Optimizer</h2>
        ${this.createLevelSelector(char)}
        ${
      this.createStatsComparison(char, currentStats, projectedStats, gameConfig)
    }
        ${
      this.createArtifactsSection(
        char,
        gameConfig,
        projectedStats,
        requirements,
      )
    }
      </div>
    `;
  }

  static createNavigation(char) {
    return `
      <div style="margin-bottom: 20px;">
        <button onclick="GearHandler.navigateToCharacterDetails('${char.id}')" 
                style="padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; margin-right: 10px;">
          ← Back to Character Details
        </button>
        <button onclick="GearHandler.navigateToCharacterList()" 
                style="padding: 10px 20px; background: #95a5a6; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px;">
          ← Back to Character List
        </button>
      </div>
    `;
  }

  static createLevelSelector(char) {
    const gameConfig = GearUtils.getGearConfig(char.game);
    return `
      <div style="background: #1c2b33; padding: 15px; border-radius: 12px; border: 2px solid #00ffff44; margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <strong style="color: #00ffff;">Gear Calculator Level:</strong>
            <select id="gear-level-select" onchange="GearHandler.updateGearLevel('${char.id}')" 
                    style="margin-left: 10px; padding: 8px 12px; background: #2c3e50; border: 2px solid #00ffff; border-radius: 6px; color: white; font-size: 16px; font-weight: bold;">
              ${
      gameConfig.levelOptions.map((level) =>
        `<option value="${level}" ${
          char.gearLevel === level ? "selected" : ""
        }>${level}</option>`
      ).join("")
    }
            </select>
          </div>
          <div style="color: #ccc; font-size: 14px;">
            Note: This level is only for gear calculations
          </div>
        </div>
      </div>
    `;
  }

  static createStatsComparison(char, currentStats, projectedStats, gameConfig) {
    return `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin-bottom: 25px;">
        ${this.createCurrentStats(char, gameConfig)}
        ${this.createGoalStats(char)}
      </div>
    `;
  }

  static createCurrentStats(char, gameConfig) {
    const charData = ALL_CHARACTERS[char.game]?.[char.name];
    const stats = CHARACTER_STATS[char.game]?.[char.name]
      ?.[char.gearLevel || 90];
    const actualBaseStats = StatCalculator.calculateBaseStats(
      char,
      stats,
      charData,
    );

    return `
      <div style="background: #1c2b33; padding: 25px; border-radius: 16px; border: 2px solid #00ffff44;">
        <h3 style="color: #00ffff; margin-bottom: 20px;">Base Stats (Character + Weapon)</h3>
        ${this.createWeaponDisplay(char)}
        <div id="current-stats" style="display: grid; gap: 12px;">
          ${this.renderStatsDisplay(actualBaseStats)}
        </div>
      </div>
    `;
  }

  static createWeaponDisplay(char) {
    return `
      <div style="margin-bottom: 20px;">
        <strong>Weapon:</strong>
        <div style="display: flex; align-items: center; gap: 12px; margin-top: 8px;">
          ${
      char.gear.weapon ? this.renderWeaponInfo(char) : this.renderNoWeapon()
    }
          <button onclick="GearHandler.openWeaponSelector('${char.id}')" 
                  style="padding: 6px 12px; background: #9b59b6; color: white; border: none; border-radius: 6px; font-size: 12px; cursor: pointer;">
            Change
          </button>
        </div>
      </div>
    `;
  }

  static renderWeaponInfo(char) {
    return `
      <img src="${GearUtils.getWeaponImage(char)}" alt="${char.gear.weapon}" 
          style="width: 40px; height: 40px; border-radius: 6px; object-fit: cover; border: 2px solid ${
      GearUtils.getWeaponRarityColor(char)
    };">
      <div style="flex: 1;">
        <div style="color: #00ffff; font-weight: bold; font-size: 14px;">${char.gear.weapon}</div>
        <div style="color: #ccc; font-size: 11px;">${
      GearUtils.getWeaponRarityText(char)
    }</div>
      </div>
    `;
  }

  static renderNoWeapon() {
    return `
      <div style="width: 40px; height: 40px; border-radius: 6px; background: #2c3e50; display: flex; align-items: center; justify-content: center; border: 2px dashed #ccc;">
        <span style="color: #ccc; font-size: 16px;">?</span>
      </div>
      <div style="color: #ccc; font-size: 14px;">No weapon selected</div>
    `;
  }

  static renderStatsDisplay(stats) {
    const elementalLabel = stats.elementalType
      ? `${stats.elementalType} DMG Bonus`
      : "Elemental DMG Bonus";

    const statsConfig = [
      { key: "hp", label: "HP", base: Math.round(stats.hp), suffix: "" },
      { key: "atk", label: "ATK", base: Math.round(stats.atk), suffix: "" },
      { key: "def", label: "DEF", base: Math.round(stats.def), suffix: "" },
      {
        key: "elementalMastery",
        label: "Elemental Mastery",
        base: Math.round(stats.elementalMastery),
        suffix: "",
      },
      {
        key: "critRate",
        label: "CRIT Rate",
        base: stats.critRate.toFixed(1),
        suffix: "%",
      },
      {
        key: "critDmg",
        label: "CRIT DMG",
        base: stats.critDmg.toFixed(1),
        suffix: "%",
      },
      {
        key: "energyRecharge",
        label: "Energy Recharge",
        base: stats.energyRecharge.toFixed(1),
        suffix: "%",
      },
      {
        key: "elementalDmg",
        label: elementalLabel,
        base: stats.elementalDmg.toFixed(1),
        suffix: "%",
      },
    ];

    return statsConfig.map((stat) => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: #2c3e50; border-radius: 6px;">
        <span>${stat.label}:</span>
        <span style="font-weight: bold; color: #00ffff;">${stat.base}${stat.suffix}</span>
      </div>
    `).join("");
  }

  static createGoalStats(char) {
    const goalStats = char.gear.goalStats;

    const statsConfig = [
      { key: "hp", label: "HP", suffix: "", baseValue: 0 },
      { key: "atk", label: "ATK", suffix: "", baseValue: 0 },
      { key: "def", label: "DEF", suffix: "", baseValue: 0 },
      {
        key: "elementalMastery",
        label: "Elemental Mastery",
        suffix: "",
        baseValue: 0,
      },
      { key: "critRate", label: "CRIT Rate", suffix: "%", baseValue: 5 },
      { key: "critDmg", label: "CRIT DMG", suffix: "%", baseValue: 50 },
      {
        key: "energyRecharge",
        label: "Energy Recharge",
        suffix: "%",
        baseValue: 100,
      },
    ];

    return `
      <div style="background: #1c2b33; padding: 25px; border-radius: 16px; border: 2px solid #00ffff44;">
        <h3 style="color: #00ffff; margin-bottom: 20px;">Goal Stats</h3>
        <div id="goal-stats" style="display: grid; gap: 12px;">
          ${
      statsConfig.map((stat) => {
        const currentValue = goalStats[stat.key] !== undefined
          ? goalStats[stat.key]
          : stat.baseValue;
        return `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: #2c3e50; border-radius: 6px;">
                  <span style="font-size: 12px;">${stat.label}:</span>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <input type="number" 
                          id="goal-${stat.key}" 
                          value="${currentValue}" 
                          min="${stat.baseValue}"
                          onchange="GearHandler.updateGoalStat('${char.id}', '${stat.key}')"
                          style="width: 70px; padding: 4px; background: #1c2b33; border: 2px solid #00ffff; border-radius: 4px; color: white; text-align: center; font-size: 12px;">
                    <span style="font-size: 12px;">${stat.suffix}</span>
                  </div>
                </div>
              `;
      }).join("")
    }
        </div>
      </div>
    `;
  }

  static createArtifactsSection(
    char,
    gameConfig,
    projectedStats,
    requirements,
  ) {
    return `
      <div style="background: #1c2b33; padding: 25px; border-radius: 16px; border: 2px solid #00ffff44;">
        <h3 style="color: #00ffff; margin-bottom: 20px;">Artifacts Configuration</h3>
        ${this.createArtifactSetSelection(char)}
        ${this.createArtifactSlots(char)}
        ${this.createStatsComparisonSection(char, projectedStats, requirements)}
      </div>
    `;
  }

  static createArtifactSetSelection(char) {
    const gameConfig = GearUtils.getGearConfig(char.game);
    const currentSet1 = char.gear.artifactSet1 || "";
    const currentSet2 = char.gear.artifactSet2 || "";

    const setOptions1 = Object.keys(gameConfig.artifactSets).map((set) =>
      `<option value="${set}" ${
        currentSet1 === set ? "selected" : ""
      }>${set}</option>`
    ).join("");

    const setOptions2 = Object.keys(gameConfig.artifactSets).map((set) =>
      `<option value="${set}" ${
        currentSet2 === set ? "selected" : ""
      }>${set}</option>`
    ).join("");

    return `
      <div style="margin-bottom: 25px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
          <div>
            <strong>First 2-Piece Set:</strong>
            <select id="artifact-set-1" onchange="GearHandler.updateArtifactSet('${char.id}', 1)" 
                    style="width: 100%; padding: 10px; background: #2c3e50; border: 2px solid #00ffff; border-radius: 8px; color: white; margin-top: 8px;">
              <option value="">Choose set...</option>
              ${setOptions1}
            </select>
          </div>
          <div>
            <strong>Second 2-Piece Set:</strong>
            <select id="artifact-set-2" onchange="GearHandler.updateArtifactSet('${char.id}', 2)" 
                    style="width: 100%; padding: 10px; background: #2c3e50; border: 2px solid #00ffff; border-radius: 8px; color: white; margin-top: 8px;">
              <option value="">Choose set...</option>
              ${setOptions2}
            </select>
          </div>
        </div>
        ${this.createSetEffectsDisplay(char)}
      </div>
    `;
  }

  static createSetEffectsDisplay(char) {
    return `
      <div id="artifact-set-effects" style="background: #2c3e50; padding: 15px; border-radius: 8px; margin-top: 15px;">
        <strong style="color: #00ffff; margin-bottom: 15px; display: block;">Active Set Effects:</strong>
        <div id="set-effects-content" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          ${this.renderArtifactSetEffects(char)}
        </div>
      </div>
    `;
  }

  static renderArtifactSetEffects(char) {
    const gameConfig = GearUtils.getGearConfig(char.game);
    const set1 = char.gear.artifactSet1;
    const set2 = char.gear.artifactSet2;

    let leftColumn = "";
    let rightColumn = "";

    leftColumn += `<div style="color: #ccc; font-size: 12px;">`;

    if (set1 && set2) {
      if (set1 === set2) {
        const setData = gameConfig.artifactSets[set1];
        const set2pcEffect = setData?.["2pc"];
        const set4pcEffect = setData?.["4pc"];

        if (set2pcEffect) {
          leftColumn +=
            `<div style="color: #88ff88; margin: 8px 0; font-size: 11px; line-height: 1.3;">
            <strong>2pc ${set1}:</strong><br>${set2pcEffect.description}
          </div>`;
        }

        if (set4pcEffect) {
          leftColumn +=
            `<div style="color: #ffcc00; margin: 8px 0; font-size: 11px; line-height: 1.3;">
            <strong>4pc ${set1}:</strong><br>${set4pcEffect.description}
          </div>`;
        }
      } else {
        const set1Data = gameConfig.artifactSets[set1];
        const set2Data = gameConfig.artifactSets[set2];
        const set1Effect = set1Data?.["2pc"];
        const set2Effect = set2Data?.["2pc"];

        if (set1Effect) {
          leftColumn +=
            `<div style="color: #88ff88; margin: 8px 0; font-size: 11px; line-height: 1.3;">
            <strong>2pc ${set1}:</strong><br>${set1Effect.description}
          </div>`;
        }

        if (set2Effect) {
          leftColumn +=
            `<div style="color: #88ff88; margin: 8px 0; font-size: 11px; line-height: 1.3;">
            <strong>2pc ${set2}:</strong><br>${set2Effect.description}
          </div>`;
        }
      }
    } else if (set1) {
      const set1Data = gameConfig.artifactSets[set1];
      const set1Effect = set1Data?.["2pc"];
      if (set1Effect) {
        leftColumn +=
          `<div style="color: #88ff88; margin: 8px 0; font-size: 11px; line-height: 1.3;">
          <strong>2pc ${set1}:</strong><br>${set1Effect.description}
        </div>`;
      }
    } else {
      leftColumn +=
        '<div style="color: #888; margin: 8px 0;">No set effects active</div>';
    }

    leftColumn += `</div>`;

    rightColumn += `<div style="color: #ccc; font-size: 12px;">`;
    rightColumn +=
      `<div style="color: #00ffff; font-weight: bold; margin-bottom: 12px; font-size: 14px;">Weapon Equipped</div>`;

    if (char.gear.weapon) {
      const charData = ALL_CHARACTERS[char.game]?.[char.name];
      const weaponType = charData?.weapon;
      const weapons = weaponType
        ? ALL_WEAPONS[char.game]?.[weaponType] || []
        : [];
      const weapon = weapons.find((w) => w.name === char.gear.weapon);

      if (weapon) {
        const rarityStars = "★".repeat(weapon.rarity);
        rightColumn +=
          `<div style="font-weight: bold; color: #ffcc00; margin-bottom: 8px;">${weapon.name} (${rarityStars})</div>`;

        if (weapon.stat && weapon.stat.type && weapon.stat.type !== "none") {
          const statValue = weapon.stat.value;
          // For HP/ATK/DEF types, add % suffix since they represent percentages
          const statSuffix =
            (weapon.stat.type === "HP" || weapon.stat.type === "ATK" ||
                weapon.stat.type === "DEF" || weapon.stat.type.includes("%"))
              ? "%"
              : "";
          rightColumn +=
            `<div style="margin: 5px 0; font-size: 11px;"><strong>Stat:</strong> ${weapon.stat.type}${statSuffix} ${statValue}${statSuffix}</div>`;
        }

        if (
          weapon.passive && weapon.passive.description &&
          weapon.passive.description !== "none"
        ) {
          rightColumn +=
            `<div style="margin: 10px 0; font-size: 11px; line-height: 1.3;"><strong>Description:</strong> ${weapon.passive.description}</div>`;
        } else {
          rightColumn +=
            `<div style="margin: 10px 0; font-size: 11px; color: #888;"><strong>Description:</strong> No passive effect</div>`;
        }
      } else {
        rightColumn += `<div style="color: #888;">Weapon data not found</div>`;
      }
    } else {
      rightColumn += `<div style="color: #888;">No weapon equipped</div>`;
    }

    rightColumn += `</div>`;

    return `
        <div>${leftColumn}</div>
        <div>${rightColumn}</div>
    `;
  }

  static createArtifactSlots(char) {
    const slots = ["flower", "plume", "sands", "goblet", "circlet"];

    return `
      <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 15px; margin-bottom: 25px;">
        ${slots.map((slot) => this.createArtifactSlot(char, slot)).join("")}
      </div>
    `;
  }

  static createArtifactSlot(char, slot) {
    const artifact = char.gear.artifacts[slot];
    const currentValue = artifact.value ||
      GearUtils.getArtifactMainStatValue(artifact.mainStat, artifact.rarity);
    const formattedValue = GearUtils.formatStatValue(
      artifact.mainStat,
      currentValue,
    );
    const artifactImage = GearUtils.getArtifactImage(char, slot);

    const isLocked = this.isSlotRarityLocked(char, slot);

    return `
      <div style="background: #2c3e50; padding: 15px; border-radius: 12px; text-align: center; position: relative;">
        <div style="position: absolute; top: 8px; right: 8px; background: ${
      artifact.rarity === 5 ? "#ffd700" : "#c0c0c0"
    }; color: black; padding: 2px 6px; border-radius: 10px; font-size: 10px; font-weight: bold;">
          ${artifact.rarity === 5 ? "5★" : "4★"}
        </div>
        ${
      artifactImage
        ? `
          <img src="${artifactImage}" alt="${slot}" style="width: 48px; height: 48px; border-radius: 8px; object-fit: cover; margin-bottom: 8px; border: 2px solid #00ffff;">
        `
        : `
          <div style="font-size: 24px; margin-bottom: 8px;">${
          GearUtils.getArtifactIcon(slot)
        }</div>
        `
    }
        <strong style="display: block; margin-bottom: 8px; color: #00ffff;">${
      slot.charAt(0).toUpperCase() + slot.slice(1)
    }</strong>
        <div style="margin-bottom: 8px; font-size: 12px; color: #00ffff; font-weight: bold; min-height: 20px;">
          ${formattedValue}
        </div>
        ${
      !isLocked
        ? `
          <select onchange="GearHandler.updateArtifactRarity('${char.id}', '${slot}')" 
                  style="width: 100%; padding: 4px; background: #1c2b33; border: 1px solid #00ffff; border-radius: 4px; color: white; font-size: 10px; margin-bottom: 8px;">
            <option value="5" ${
          artifact.rarity === 5 ? "selected" : ""
        }>5★</option>
            <option value="4" ${
          artifact.rarity === 4 ? "selected" : ""
        }>4★</option>
          </select>
        `
        : `
          <div style="font-size: 9px; color: #888; margin-bottom: 8px;">Locked by set</div>
        `
    }
        <select onchange="GearHandler.updateArtifactMainStat('${char.id}', '${slot}')" 
                style="width: 100%; padding: 8px; background: #1c2b33; border: 2px solid #00ffff; border-radius: 6px; color: white; font-size: 12px;">
          ${
      ARTIFACT_MAIN_STATS[slot].map((stat) =>
        `<option value="${stat}" ${
          char.gear.artifacts[slot].mainStat === stat ? "selected" : ""
        }>${stat}</option>`
      ).join("")
    }
        </select>
      </div>
    `;
  }

  static isSlotRarityLocked(char, slot) {
    const set1 = char.gear.artifactSet1;
    const set2 = char.gear.artifactSet2;

    if (set1 && GearUtils.isFourStarSet(set1)) {
      if (slot === "flower" || slot === "plume") return true;
    }

    if (set2 && GearUtils.isFourStarSet(set2)) {
      if (set1 === set2) {
        if (slot !== "sands") return true;
      } else {
        if (slot === "goblet" || slot === "circlet") return true;
      }
    }

    return false;
  }

  static createStatsComparisonSection(char, projectedStats, requirements) {
    const goalStats = char.gear.goalStats;
    const progress = this.calculateGoalProgress(projectedStats, goalStats);

    const displayData = NewSubstatCalculator.formatRequirementsForDisplay(
      requirements,
      char,
    );

    return `
      <div id="stats-comparison" style="margin-top: 25px; background: #2c3e50; padding: 20px; border-radius: 12px;">
        <h4 style="color: #00ffff; margin-bottom: 15px;">Build Progress vs Goal</h4>
        ${this.renderStatsComparison(projectedStats, goalStats, progress)}
        ${this.renderNewSubstatRequirements(displayData)}
      </div>
    `;
  }

  static calculateGoalProgress(projectedStats, goalStats) {
    const progress = {};
    const baseValues = {
      hp: 0,
      atk: 0,
      def: 0,
      elementalMastery: 0,
      critRate: 5,
      critDmg: 50,
      energyRecharge: 100,
      elementalDmg: 0,
      physicalDmg: 0,
      healingBonus: 0,
      shieldStrength: 0,
      pyroRES: 0,
      electroRES: 0,
      pyroDmg: 0,
      hydroDmg: 0,
      electroDmg: 0,
      cryoDmg: 0,
      anemoDmg: 0,
      geoDmg: 0,
      dendroDmg: 0,
    };

    Object.keys(goalStats).forEach((key) => {
      const goal = goalStats[key];
      const current = projectedStats[key];
      const base = baseValues[key];

      if (goal > base) {
        progress[key] = Math.min(100, Math.round((current / goal) * 100));
      } else {
        progress[key] = 0;
      }
    });

    return progress;
  }

  static renderStatsComparison(projectedStats, goalStats, progress) {
    const statsConfig = [
      {
        key: "hp",
        label: "HP",
        format: (val) => Math.round(val).toLocaleString(),
        suffix: "",
        baseValue: 0,
      },
      {
        key: "atk",
        label: "ATK",
        format: (val) => Math.round(val).toLocaleString(),
        suffix: "",
        baseValue: 0,
      },
      {
        key: "def",
        label: "DEF",
        format: (val) => Math.round(val).toLocaleString(),
        suffix: "",
        baseValue: 0,
      },
      {
        key: "elementalMastery",
        label: "Elemental Mastery",
        format: (val) => Math.round(val).toLocaleString(),
        suffix: "",
        baseValue: 0,
      },
      {
        key: "critRate",
        label: "CRIT Rate",
        format: (val) => val.toFixed(1),
        suffix: "%",
        baseValue: 5,
      },
      {
        key: "critDmg",
        label: "CRIT DMG",
        format: (val) => val.toFixed(1),
        suffix: "%",
        baseValue: 50,
      },
      {
        key: "energyRecharge",
        label: "Energy Recharge",
        format: (val) => val.toFixed(1),
        suffix: "%",
        baseValue: 100,
      },
    ];

    let hasGoals = false;
    const comparisons = statsConfig.map((stat) => {
      const current = projectedStats[stat.key] || 0;
      const goal = goalStats[stat.key] || stat.baseValue;
      const currentProgress = progress[stat.key] || 0;

      // Hide stats with 0% goal (goal equals base value)
      if (goal <= stat.baseValue) {
        return "";
      }

      hasGoals = true;
      const progressColor = currentProgress >= 100
        ? "#27ae60"
        : currentProgress >= 75
        ? "#f39c12"
        : "#e74c3c";

      return `
        <div style="margin-bottom: 12px; padding: 10px; background: #1c2b33; border-radius: 6px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span>${stat.label}:</span>
            <span style="font-weight: bold; color: #00ffff;">
              ${stat.format(current)}${stat.suffix} / ${
        stat.format(goal)
      }${stat.suffix}
            </span>
          </div>
          <div style="width: 100%; height: 8px; background: #2c3e50; border-radius: 4px; overflow: hidden;">
            <div style="width: ${currentProgress}%; height: 100%; background: ${progressColor}; transition: width 0.3s;"></div>
          </div>
          <div style="text-align: right; font-size: 11px; color: ${progressColor}; margin-top: 4px;">
            ${currentProgress}% Complete
          </div>
        </div>
      `;
    }).filter((html) => html !== "").join("");

    if (!hasGoals) {
      return `
        <div style="text-align: center; padding: 20px; color: #888; font-style: italic;">
          No custom goals set. Increase values above base levels to see progress tracking.
        </div>
      `;
    }

    return `
      <div style="display: grid; gap: 8px;">
        ${comparisons}
      </div>
    `;
  }

  static renderNewSubstatRequirements(displayData) {
    if (displayData.noGaps) {
      return `
      <div style="margin-top: 25px; padding-top: 20px; border-top: 2px solid #27ae60;">
        <h5 style="color: #27ae60; margin-bottom: 15px;">Goal Achieved! 🎉</h5>
        <div style="color: #ccc; padding: 15px; background: #1c2b33; border-radius: 8px;">
          ${displayData.message}
        </div>
      </div>
    `;
    }

    if (Object.keys(displayData.substats).length === 0) {
      return "";
    }

    // Helper function to format substat type names
    const formatSubstatType = (substatType) => {
      const nameMap = {
        "Elemental Mastery": "Elemental Mastery",
        "Energy Recharge": "Energy Recharge",
        "CRIT Rate": "CRIT Rate",
        "CRIT DMG": "CRIT DMG",
        "HP%": "HP%",
        "HP": "HP",
        "ATK%": "ATK%",
        "ATK": "ATK",
        "DEF%": "DEF%",
        "DEF": "DEF",
      };
      return nameMap[substatType] || substatType;
    };

    // Helper to get value suffix and format display
    const formatValueDisplay = (substatType, gapValue) => {
      if (
        substatType.includes("%") ||
        substatType === "Elemental Mastery" ||
        substatType === "CRIT Rate" ||
        substatType === "CRIT DMG" ||
        substatType === "Energy Recharge"
      ) {
        // For % stats and EM, show the actual value (not %)
        return Math.round(gapValue);
      } else {
        // For flat stats, show rounded value
        return Math.round(gapValue);
      }
    };

    return `
    <div style="margin-top: 25px; padding-top: 20px; border-top: 2px solid #00ffff44;">
      <h5 style="color: #00ffff; margin-bottom: 15px;">Substat Roll Analysis</h5>
      
      <div style="background: #1c2b33; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <strong style="color: #00ffff;">Total Rolls Required:</strong>
          <span style="color: #ccc;">
            ${displayData.totalRolls.bestCase} - ${displayData.totalRolls.worstCase} rolls 
            (out of ${displayData.totalRolls.minAvailable} to ${displayData.totalRolls.maxAvailable} available)
          </span>
        </div>
        <div style="font-size: 12px; color: #888; margin-top: 8px;">
          Range: ${displayData.totalRolls.bestCase} rolls (all max rolls) to ${displayData.totalRolls.worstCase} rolls (all min rolls)
        </div>
      </div>
      
      <div style="display: grid; gap: 12px;">
        ${
      Object.entries(displayData.substats).map(([substatType, data]) => {
        const formattedSubstatType = formatSubstatType(substatType);
        const displayValue = formatValueDisplay(substatType, data.gapValue);

        return `
            <div style="background: #1c2b33; padding: 15px; border-radius: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <strong style="color: #00ffff;">${formattedSubstatType}</strong>
                <span style="color: #ccc;">
                  ${data.neededRolls.best} - ${data.neededRolls.worst} rolls needed
                </span>
              </div>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px; color: #ccc; margin-bottom: 8px;">
                <div>Missing Value: ${displayValue}</div>
                <div style="text-align: right;">
                  Range: ${data.neededRolls.best} (max rolls) to ${data.neededRolls.worst} (min rolls)
                </div>
              </div>
              
              <div style="font-size: 11px; color: #888; margin-top: 8px;">
                <strong>Available Rolls:</strong> ${data.availableRolls.min} - ${data.availableRolls.max} ${formattedSubstatType} substat rolls
              </div>
            </div>
          `;
      }).join("")
    }
      </div>
    </div>
  `;
  }
}

// =================================================================
// GEAR HANDLER
// =================================================================

class GearHandler {
  static navigateToCharacterDetails(charId) {
    const char = getCharacterById(charId);
    if (char) {
      const content = document.getElementById("page-content");
      if (content) content.innerHTML = "";
      renderCharacterDetail(char);
    }
  }

  static navigateToCharacterList() {
    const content = document.getElementById("page-content");
    if (content) content.innerHTML = "";
    if (window.initCharactersScene) {
      window.initCharactersScene();
    }
  }

  static updateGearLevel(charId) {
    const char = getCharacterById(charId);
    const select = document.getElementById("gear-level-select");
    if (select) {
      char.gearLevel = parseInt(select.value);
      saveMyCharacters();
      GearRenderer.render(char);
    }
  }

  static updateGoalStat(charId, statKey) {
    const char = getCharacterById(charId);
    const input = document.getElementById(`goal-${statKey}`);
    if (input) {
      const baseValues = {
        critRate: 5,
        critDmg: 50,
        energyRecharge: 100,
      };
      const baseValue = baseValues[statKey] || 0;
      const newValue = parseFloat(input.value) || baseValue;
      char.gear.goalStats[statKey] = Math.max(newValue, baseValue);
      saveMyCharacters();
      GearRenderer.render(char);
    }
  }

  static openWeaponSelector(charId) {
    const char = getCharacterById(charId);
    console.log("Open weapon selector for:", charId);
  }

  static updateArtifactSet(charId, setNumber) {
    const char = getCharacterById(charId);
    const select = document.getElementById(`artifact-set-${setNumber}`);
    if (select) {
      const newSet = select.value;

      if (setNumber === 1) {
        char.gear.artifactSet1 = newSet;
      } else {
        char.gear.artifactSet2 = newSet;
      }

      this.updateArtifactRarities(char);
      this.updateArtifactImages(char);

      saveMyCharacters();
      GearRenderer.render(char);
    }
  }

  static updateArtifactRarities(char) {
    const set1 = char.gear.artifactSet1;
    const set2 = char.gear.artifactSet2;

    Object.keys(char.gear.artifacts).forEach((slot) => {
      char.gear.artifacts[slot].rarity = 5;
    });

    if (set1 && GearUtils.isFourStarSet(set1)) {
      char.gear.artifacts["flower"].rarity = 4;
      char.gear.artifacts["plume"].rarity = 4;
    }

    if (set2 && GearUtils.isFourStarSet(set2)) {
      if (set1 === set2) {
        char.gear.artifacts["flower"].rarity = 4;
        char.gear.artifacts["plume"].rarity = 4;
        char.gear.artifacts["goblet"].rarity = 4;
        char.gear.artifacts["circlet"].rarity = 4;
      } else {
        char.gear.artifacts["goblet"].rarity = 4;
        char.gear.artifacts["circlet"].rarity = 4;
      }
    }

    Object.keys(char.gear.artifacts).forEach((slot) => {
      const artifact = char.gear.artifacts[slot];
      artifact.value = GearUtils.getArtifactMainStatValue(
        artifact.mainStat,
        artifact.rarity,
      );
    });
  }

  static updateArtifactImages(char) {
    const slots = ["flower", "plume", "sands", "goblet", "circlet"];
    slots.forEach((slot) => {
      char.gear.artifacts[slot].image = GearUtils.getArtifactImage(char, slot);
    });
  }

  static updateArtifactRarity(charId, slot) {
    const char = getCharacterById(charId);
    const select = document.querySelector(
      `select[onchange="GearHandler.updateArtifactRarity('${charId}', '${slot}')"]`,
    );
    if (select && !GearRenderer.isSlotRarityLocked(char, slot)) {
      const newRarity = parseInt(select.value);
      char.gear.artifacts[slot].rarity = newRarity;
      char.gear.artifacts[slot].value = GearUtils.getArtifactMainStatValue(
        char.gear.artifacts[slot].mainStat,
        newRarity,
      );
      saveMyCharacters();
      GearRenderer.render(char);
    }
  }

  static updateArtifactMainStat(charId, slot) {
    const char = getCharacterById(charId);
    const select = document.querySelector(
      `select[onchange="GearHandler.updateArtifactMainStat('${charId}', '${slot}')"]`,
    );
    if (select) {
      const newMainStat = select.value;
      const currentRarity = char.gear.artifacts[slot].rarity;
      char.gear.artifacts[slot].mainStat = newMainStat;
      char.gear.artifacts[slot].value = GearUtils.getArtifactMainStatValue(
        newMainStat,
        currentRarity,
      );
      saveMyCharacters();
      GearRenderer.render(char);
    }
  }
}

// =================================================================
// INITIALIZATION AND GLOBAL EXPORTS
// =================================================================

export function initCharacterGearScene(characterId) {
  const char = getCharacterById(characterId);
  if (!char) {
    console.error("Character not found:", characterId);
    return;
  }
  GearRenderer.render(char);
}

// Export handlers to global scope
window.GearHandler = GearHandler;
window.NewSubstatCalculator = NewSubstatCalculator;
