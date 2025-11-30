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
// NEW SUBSTAT CALCULATOR WITH PROPER STAT FORMULAS
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

  static calculateSubstatRequirements(char, baseStats, goalStats) {
    const currentStats = this.calculateCurrentStats(char, baseStats);
    const statGaps = this.calculateStatGaps(currentStats, goalStats);

    if (Object.keys(statGaps).length === 0) {
      return { noGaps: true };
    }

    const requirements = this.calculateRollRequirements(
      char,
      baseStats,
      statGaps,
    );
    return {
      requirements: requirements,
      statGaps: statGaps,
      currentStats: currentStats,
    };
  }

  static calculateCurrentStats(char, baseStats) {
    const artifactStats = this.calculateArtifactMainStats(char);
    const setEffects = this.calculateArtifactSetEffects(char);

    const current = {
      hp: this.calculateHP(
        baseStats.baseHP,
        artifactStats.hpPercent,
        artifactStats.hpFlat,
      ),
      atk: this.calculateATK(
        baseStats.baseATK,
        baseStats.weaponATK,
        artifactStats.atkPercent,
        artifactStats.atkFlat,
      ),
      def: this.calculateDEF(
        baseStats.baseDEF,
        artifactStats.defPercent,
        artifactStats.defFlat,
      ),
      elementalMastery: artifactStats.elementalMastery,
      critRate: 5 + artifactStats.critRate,
      critDmg: 50 + artifactStats.critDmg,
      energyRecharge: 100 + artifactStats.energyRecharge,
      elementalDmg: artifactStats.elementalDmg,
    };

    // Apply set effects
    if (setEffects.stats.ATK) {
      current.atk += baseStats.baseATK * (setEffects.stats.ATK / 100);
    }
    if (setEffects.stats.HP) {
      current.hp += baseStats.baseHP * (setEffects.stats.HP / 100);
    }
    if (setEffects.stats.DEF) {
      current.def += baseStats.baseDEF * (setEffects.stats.DEF / 100);
    }
    if (setEffects.stats["Elemental Mastery"]) {
      current.elementalMastery += setEffects.stats["Elemental Mastery"];
    }
    if (setEffects.stats["Energy Recharge"]) {
      current.energyRecharge += setEffects.stats["Energy Recharge"];
    }

    return current;
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

  static calculateRollRequirements(char, baseStats, statGaps) {
    const requirements = {};

    // Calculate requirements for each stat gap
    Object.entries(statGaps).forEach(([statKey, gap]) => {
      const substatTypes = this.getSubstatTypesForStat(statKey);

      // For each possible substat type, calculate min and max rolls needed
      const solutions = [];

      substatTypes.forEach((substatType) => {
        const rollValues = this.SUBSTAT_ROLL_VALUES[5][substatType];
        if (rollValues) {
          // Calculate rolls needed using min and max roll values
          const minRolls = Math.ceil(gap / rollValues.max); // Best case: all max rolls
          const maxRolls = Math.ceil(gap / rollValues.min); // Worst case: all min rolls

          solutions.push({
            substatType: substatType,
            minRolls: minRolls, // Using max roll values
            maxRolls: maxRolls, // Using min roll values
            valuePerRoll: rollValues,
            totalValue: {
              min: minRolls * rollValues.min, // Worst total value
              max: maxRolls * rollValues.max, // Best total value (but we use minRolls for max value)
            },
            actualMinValue: minRolls * rollValues.max, // Actual best case value
            actualMaxValue: maxRolls * rollValues.min, // Actual worst case value
          });
        }
      });

      // For HP/ATK/DEF, calculate mixed solutions
      if (statKey === "hp") {
        const mixedSolution = this.calculateMixedHPSolution(
          baseStats.baseHP,
          gap,
        );
        solutions.push(mixedSolution);
      } else if (statKey === "atk") {
        const mixedSolution = this.calculateMixedATKSolution(
          baseStats.baseATK + baseStats.weaponATK,
          gap,
        );
        solutions.push(mixedSolution);
      } else if (statKey === "def") {
        const mixedSolution = this.calculateMixedDEFSolution(
          baseStats.baseDEF,
          gap,
        );
        solutions.push(mixedSolution);
      }

      requirements[statKey] = solutions;
    });

    // Now distribute rolls across artifacts with proper constraints
    const distributedRequirements = this.distributeRollsWithConstraints(
      char,
      requirements,
    );

    return distributedRequirements;
  }

  static calculateMixedHPSolution(baseHP, gap) {
    const hpPercentRoll = this.SUBSTAT_ROLL_VALUES[5]["HP%"];
    const hpFlatRoll = this.SUBSTAT_ROLL_VALUES[5]["HP"];

    // Calculate using max values (min rolls scenario)
    const hpPercentValuePerRollMax = baseHP * hpPercentRoll.max / 100;
    const hpFlatValuePerRollMax = hpFlatRoll.max;

    // Try 70% HP% + 30% HP distribution for min rolls (best case)
    const hpPercentGapMin = gap * 0.7;
    const hpFlatGapMin = gap * 0.3;

    const hpPercentRollsMin = Math.ceil(
      hpPercentGapMin / hpPercentValuePerRollMax,
    );
    const hpFlatRollsMin = Math.ceil(hpFlatGapMin / hpFlatValuePerRollMax);
    const totalRollsMin = hpPercentRollsMin + hpFlatRollsMin;

    // Calculate using min values (max rolls scenario)
    const hpPercentValuePerRollMin = baseHP * hpPercentRoll.min / 100;
    const hpFlatValuePerRollMin = hpFlatRoll.min;

    const hpPercentGapMax = gap * 0.7;
    const hpFlatGapMax = gap * 0.3;

    const hpPercentRollsMax = Math.ceil(
      hpPercentGapMax / hpPercentValuePerRollMin,
    );
    const hpFlatRollsMax = Math.ceil(hpFlatGapMax / hpFlatValuePerRollMin);
    const totalRollsMax = hpPercentRollsMax + hpFlatRollsMax;

    return {
      substatType: "HP% + HP",
      minRolls: totalRollsMin, // Best case
      maxRolls: totalRollsMax, // Worst case
      valuePerRoll: { min: 0, max: 0 },
      totalValue: {
        min: (hpPercentRollsMin * (baseHP * hpPercentRoll.min / 100)) +
          (hpFlatRollsMin * hpFlatRoll.min),
        max: (hpPercentRollsMin * (baseHP * hpPercentRoll.max / 100)) +
          (hpFlatRollsMin * hpFlatRoll.max),
      },
      breakdown: {
        "HP%": { min: hpPercentRollsMin, max: hpPercentRollsMax },
        "HP": { min: hpFlatRollsMin, max: hpFlatRollsMax },
      },
    };
  }

  static calculateMixedATKSolution(totalBaseATK, gap) {
    const atkPercentRoll = this.SUBSTAT_ROLL_VALUES[5]["ATK%"];
    const atkFlatRoll = this.SUBSTAT_ROLL_VALUES[5]["ATK"];

    // Min rolls scenario (max values)
    const atkPercentValuePerRollMax = totalBaseATK * atkPercentRoll.max / 100;
    const atkFlatValuePerRollMax = atkFlatRoll.max;

    const atkPercentGapMin = gap * 0.8;
    const atkFlatGapMin = gap * 0.2;

    const atkPercentRollsMin = Math.ceil(
      atkPercentGapMin / atkPercentValuePerRollMax,
    );
    const atkFlatRollsMin = Math.ceil(atkFlatGapMin / atkFlatValuePerRollMax);
    const totalRollsMin = atkPercentRollsMin + atkFlatRollsMin;

    // Max rolls scenario (min values)
    const atkPercentValuePerRollMin = totalBaseATK * atkPercentRoll.min / 100;
    const atkFlatValuePerRollMin = atkFlatRoll.min;

    const atkPercentGapMax = gap * 0.8;
    const atkFlatGapMax = gap * 0.2;

    const atkPercentRollsMax = Math.ceil(
      atkPercentGapMax / atkPercentValuePerRollMin,
    );
    const atkFlatRollsMax = Math.ceil(atkFlatGapMax / atkFlatValuePerRollMin);
    const totalRollsMax = atkPercentRollsMax + atkFlatRollsMax;

    return {
      substatType: "ATK% + ATK",
      minRolls: totalRollsMin,
      maxRolls: totalRollsMax,
      valuePerRoll: { min: 0, max: 0 },
      totalValue: {
        min: (atkPercentRollsMin * (totalBaseATK * atkPercentRoll.min / 100)) +
          (atkFlatRollsMin * atkFlatRoll.min),
        max: (atkPercentRollsMin * (totalBaseATK * atkPercentRoll.max / 100)) +
          (atkFlatRollsMin * atkFlatRoll.max),
      },
      breakdown: {
        "ATK%": { min: atkPercentRollsMin, max: atkPercentRollsMax },
        "ATK": { min: atkFlatRollsMin, max: atkFlatRollsMax },
      },
    };
  }

  static calculateMixedDEFSolution(baseDEF, gap) {
    const defPercentRoll = this.SUBSTAT_ROLL_VALUES[5]["DEF%"];
    const defFlatRoll = this.SUBSTAT_ROLL_VALUES[5]["DEF"];

    // Min rolls scenario (max values)
    const defPercentValuePerRollMax = baseDEF * defPercentRoll.max / 100;
    const defFlatValuePerRollMax = defFlatRoll.max;

    const defPercentGapMin = gap * 0.7;
    const defFlatGapMin = gap * 0.3;

    const defPercentRollsMin = Math.ceil(
      defPercentGapMin / defPercentValuePerRollMax,
    );
    const defFlatRollsMin = Math.ceil(defFlatGapMin / defFlatValuePerRollMax);
    const totalRollsMin = defPercentRollsMin + defFlatRollsMin;

    // Max rolls scenario (min values)
    const defPercentValuePerRollMin = baseDEF * defPercentRoll.min / 100;
    const defFlatValuePerRollMin = defFlatRoll.min;

    const defPercentGapMax = gap * 0.7;
    const defFlatGapMax = gap * 0.3;

    const defPercentRollsMax = Math.ceil(
      defPercentGapMax / defPercentValuePerRollMin,
    );
    const defFlatRollsMax = Math.ceil(defFlatGapMax / defFlatValuePerRollMin);
    const totalRollsMax = defPercentRollsMax + defFlatRollsMax;

    return {
      substatType: "DEF% + DEF",
      minRolls: totalRollsMin,
      maxRolls: totalRollsMax,
      valuePerRoll: { min: 0, max: 0 },
      totalValue: {
        min: (defPercentRollsMin * (baseDEF * defPercentRoll.min / 100)) +
          (defFlatRollsMin * defFlatRoll.min),
        max: (defPercentRollsMin * (baseDEF * defPercentRoll.max / 100)) +
          (defFlatRollsMin * defFlatRoll.max),
      },
      breakdown: {
        "DEF%": { min: defPercentRollsMin, max: defPercentRollsMax },
        "DEF": { min: defFlatRollsMin, max: defFlatRollsMax },
      },
    };
  }

  static distributeRollsWithConstraints(char, requirements) {
    const distributed = {};
    const artifactConstraints = this.getArtifactConstraints(char);
    const availableRolls = this.calculateAvailableRolls(char);

    Object.entries(requirements).forEach(([statKey, solutions]) => {
      if (solutions && solutions.length > 0) {
        // Find the best solution (usually the mixed one)
        const bestSolution = solutions.find((s) =>
          s.substatType.includes("+")
        ) || solutions[0];

        // Check if we can distribute these rolls given artifact constraints
        const distribution = this.canDistributeRolls(
          char,
          statKey,
          bestSolution,
          artifactConstraints,
        );

        distributed[statKey] = {
          solution: bestSolution,
          distribution: distribution,
          achievable: distribution.achievable,
          minRolls: bestSolution.minRolls,
          maxRolls: bestSolution.maxRolls,
        };
      }
    });

    return distributed;
  }

  static canDistributeRolls(char, statKey, solution, artifactConstraints) {
    const substatTypes = this.getSubstatTypesForStat(statKey);
    const slots = ["flower", "plume", "sands", "goblet", "circlet"];

    let totalAvailableRolls = 0;
    let achievableMin = true;
    let achievableMax = true;

    // Calculate how many rolls each artifact can contribute for these substat types
    slots.forEach((slot) => {
      const artifact = char.gear.artifacts[slot];
      const availableSubstats = this.getAvailableSubstatsForSlot(
        slot,
        artifact.mainStat,
      );

      // Check if this artifact can roll any of the needed substat types
      const canRollSubstat = substatTypes.some((substat) =>
        availableSubstats.includes(substat)
      );

      if (canRollSubstat) {
        // Each artifact can contribute up to 9 rolls (4 initial + 5 upgrades)
        totalAvailableRolls += 9;
      }
    });

    // Check achievability
    if (solution.minRolls > totalAvailableRolls) {
      achievableMin = false;
    }
    if (solution.maxRolls > totalAvailableRolls) {
      achievableMax = false;
    }

    return {
      totalAvailableRolls: totalAvailableRolls,
      achievableMin: achievableMin,
      achievableMax: achievableMax,
      requiredMinRolls: solution.minRolls,
      requiredMaxRolls: solution.maxRolls,
    };
  }

  static getArtifactConstraints(char) {
    const constraints = {};
    const slots = ["flower", "plume", "sands", "goblet", "circlet"];

    slots.forEach((slot) => {
      const artifact = char.gear.artifacts[slot];
      constraints[slot] = {
        mainStat: artifact.mainStat,
        availableSubstats: this.getAvailableSubstatsForSlot(
          slot,
          artifact.mainStat,
        ),
      };
    });

    return constraints;
  }

  static calculateAvailableRolls(char) {
    let totalRolls = 0;
    const slots = ["flower", "plume", "sands", "goblet", "circlet"];

    slots.forEach((slot) => {
      totalRolls += 9; // Max possible rolls per artifact (4 initial + 5 upgrades)
    });

    return totalRolls;
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

    const conflictingSubstats = this.getConflictingSubstats(mainStat);
    return allSubstats.filter((substat) =>
      !conflictingSubstats.includes(substat)
    );
  }

  static getConflictingSubstats(mainStat) {
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
    };

    if (mainStat.includes("DMG%")) {
      return [];
    }

    return conflicts[mainStat] || [];
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

      if (
        gear.artifactSet1 && gear.artifactSet2 &&
        gear.artifactSet1 === gear.artifactSet2 &&
        gear.artifactSet1 === setName && isFirstSet
      ) {
        const set4pcEffect = setData["4pc"];
        if (set4pcEffect && set4pcEffect.description) {
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

  static formatRequirementsForDisplay(requirements) {
    if (requirements.noGaps) {
      return { noGaps: true, message: "All goal stats have been achieved!" };
    }

    if (!requirements.requirements) {
      return {
        possible: false,
        message: "No goal stats set or invalid calculation",
      };
    }

    const reqs = requirements.requirements;
    const displayData = {
      possible: true,
      substats: {},
      totalRolls: { minUsed: 0, maxUsed: 0, available: 45 },
    };

    Object.entries(reqs).forEach(([statKey, data]) => {
      const solution = data.solution;
      const distribution = data.distribution;

      displayData.substats[statKey] = {
        neededRolls: {
          min: solution.minRolls, // Best case: all max rolls
          max: solution.maxRolls, // Worst case: all min rolls
        },
        achievable: {
          min: distribution.achievableMin,
          max: distribution.achievableMax,
        },
        totalValue: solution.totalValue,
        originalStat: statKey,
        solutionType: solution.substatType,
        breakdown: solution.breakdown,
        availableRolls: distribution.totalAvailableRolls,
      };

      displayData.totalRolls.minUsed += solution.minRolls;
      displayData.totalRolls.maxUsed += solution.maxRolls;

      if (!distribution.achievableMin || !distribution.achievableMax) {
        displayData.possible = false;
      }
    });

    if (!displayData.possible) {
      displayData.message =
        "Some goal stats require more substat rolls than available in artifacts that can roll them";
    }

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
// STAT CALCULATOR (KEEP EXISTING)
// =================================================================

class StatCalculator {
  static calculateBaseStats(char, stats, charData) {
    if (!stats) return this.getBaseStats();

    const baseStats = this.getBaseStats();
    const weaponStats = this.calculateWeaponStats(char);

    const charStatsData = CHARACTER_STATS[char.game]?.[char.name];
    const charAscensionStat = charStatsData?.additionalStat;
    const weaponAscensionStat = weaponStats.additionalStat;

    const totalBaseHP = stats.baseHP;
    const totalBaseATK = stats.baseATK + weaponStats.baseATK;
    const totalBaseDEF = stats.baseDEF;

    const hpPercentBonus =
      this.getStatBonus(charAscensionStat, weaponAscensionStat, "HP") / 100;
    baseStats.hp = totalBaseHP * (1 + hpPercentBonus);

    const atkPercentBonus =
      this.getStatBonus(charAscensionStat, weaponAscensionStat, "ATK") / 100;
    baseStats.atk = totalBaseATK * (1 + atkPercentBonus);

    const defPercentBonus =
      this.getStatBonus(charAscensionStat, weaponAscensionStat, "DEF") / 100;
    baseStats.def = totalBaseDEF * (1 + defPercentBonus);

    baseStats.elementalMastery = this.getFlatStatBonus(
      charAscensionStat,
      weaponAscensionStat,
      "Elemental Mastery",
    );
    baseStats.critRate = 5 +
      this.getFlatStatBonus(
        charAscensionStat,
        weaponAscensionStat,
        "CRIT Rate",
      );
    baseStats.critDmg = 50 +
      this.getFlatStatBonus(charAscensionStat, weaponAscensionStat, "CRIT DMG");
    baseStats.energyRecharge = 100 +
      this.getFlatStatBonus(
        charAscensionStat,
        weaponAscensionStat,
        "Energy Recharge",
      );
    baseStats.elementalDmg = this.getFlatStatBonus(
      charAscensionStat,
      weaponAscensionStat,
      "DMG%",
    );

    if (charAscensionStat?.type?.includes("DMG Bonus")) {
      baseStats.elementalDmg += charAscensionStat.value;
    }

    return baseStats;
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
    };
  }

  static getStatBonus(charStat, weaponStat, statType) {
    let bonus = 0;
    if (charStat?.type === statType) bonus += charStat.value;
    if (weaponStat?.type === statType) bonus += weaponStat.value;
    return bonus;
  }

  static getFlatStatBonus(charStat, weaponStat, statType) {
    let bonus = 0;
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

  static calculateProjectedStats(char, stats, charData) {
    const baseStats = this.calculateBaseStats(char, stats, charData);
    const artifactStats = this.calculateArtifactMainStats(char);
    const setEffects = this.calculateArtifactSetEffects(char);

    const projected = { ...baseStats };

    const weaponStats = this.calculateWeaponStats(char);
    const totalBaseHP = stats.baseHP;
    const totalBaseATK = stats.baseATK + weaponStats.baseATK;
    const totalBaseDEF = stats.baseDEF;

    const totalHPPercent = artifactStats.hpPercent / 100;
    projected.hp = (baseStats.hp * (1 + totalHPPercent)) + artifactStats.hpFlat;

    const totalATKPercent = artifactStats.atkPercent / 100;
    projected.atk = (totalBaseATK * (1 + totalATKPercent)) +
      artifactStats.atkFlat;

    const totalDEFPercent = artifactStats.defPercent / 100;
    projected.def = (baseStats.def * (1 + totalDEFPercent)) +
      artifactStats.defFlat;

    projected.elementalMastery += artifactStats.elementalMastery;
    projected.critRate += artifactStats.critRate;
    projected.critDmg += artifactStats.critDmg;
    projected.energyRecharge += artifactStats.energyRecharge;
    projected.healingBonus += artifactStats.healingBonus;
    projected.elementalDmg += artifactStats.elementalDmg;

    if (setEffects.stats.ATK) {
      projected.atk += totalBaseATK * (setEffects.stats.ATK / 100);
    }
    if (setEffects.stats["Elemental Mastery"]) {
      projected.elementalMastery += setEffects.stats["Elemental Mastery"];
    }
    if (setEffects.stats["Energy Recharge"]) {
      projected.energyRecharge += setEffects.stats["Energy Recharge"];
    }
    if (setEffects.stats.DEF) {
      projected.def += totalBaseDEF * (setEffects.stats.DEF / 100);
    }
    if (setEffects.stats.HP) {
      projected.hp += totalBaseHP * (setEffects.stats.HP / 100);
    }

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

  static calculateArtifactSetEffects(char) {
    const effects = { stats: {}, descriptions: [] };
    const gear = char.gear;
    const gameConfig = GearUtils.getGearConfig(char.game);

    const processSetEffect = (setName, isFirstSet = true) => {
      const setData = gameConfig.artifactSets[setName];
      if (!setData) return;

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

      if (
        gear.artifactSet1 && gear.artifactSet2 &&
        gear.artifactSet1 === gear.artifactSet2 &&
        gear.artifactSet1 === setName && isFirstSet
      ) {
        const set4pcEffect = setData["4pc"];
        if (set4pcEffect && set4pcEffect.description) {
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
}

// =================================================================
// GEAR RENDERER (UPDATED WITH NEW CALCULATOR)
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
      healingBonus: 0,
      energyRecharge: 100,
      elementalDmg: 0,
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
        label: "Elemental DMG Bonus",
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
      {
        key: "elementalDmg",
        label: "Elemental DMG Bonus",
        suffix: "%",
        baseValue: 0,
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
                <span>${stat.label}:</span>
                <input type="number" 
                       id="goal-${stat.key}" 
                       value="${currentValue}" 
                       min="${stat.baseValue}"
                       onchange="GearHandler.updateGoalStat('${char.id}', '${stat.key}')"
                       style="width: 80px; padding: 4px; background: #1c2b33; border: 2px solid #00ffff; border-radius: 4px; color: white; text-align: center;">
                <span>${stat.suffix}</span>
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
          const statSuffix = weapon.stat.type.includes("%") ? "%" : "";
          rightColumn +=
            `<div style="margin: 5px 0; font-size: 11px;"><strong>Stat:</strong> ${weapon.stat.type} ${statValue}${statSuffix}</div>`;
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
      {
        key: "elementalDmg",
        label: "Elemental DMG Bonus",
        format: (val) => val.toFixed(1),
        suffix: "%",
        baseValue: 0,
      },
    ];

    let hasGoals = false;
    const comparisons = statsConfig.map((stat) => {
      const current = projectedStats[stat.key];
      const goal = goalStats[stat.key];
      const currentProgress = progress[stat.key];

      if (goal > stat.baseValue) {
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
      }

      return `
        <div style="margin-bottom: 8px; padding: 8px; background: #1c2b33; border-radius: 6px;">
          <div style="display: flex; justify-content: space-between;">
            <span>${stat.label}:</span>
            <span style="font-weight: bold; color: #00ffff;">${
        stat.format(current)
      }${stat.suffix}</span>
          </div>
        </div>
      `;
    }).join("");

    if (!hasGoals) {
      return `
        <div style="text-align: center; padding: 20px; color: #888; font-style: italic;">
          No custom goals set. Increase values above base levels to see progress tracking.
        </div>
        <div style="display: grid; gap: 8px;">
          ${comparisons}
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

    if (!displayData.possible) {
      return `
      <div style="margin-top: 25px; padding-top: 20px; border-top: 2px solid #e74c3c;">
        <h5 style="color: #e74c3c; margin-bottom: 15px;">Goal Unachievable</h5>
        <div style="color: #ccc; padding: 15px; background: #1c2b33; border-radius: 8px;">
          ${
        displayData.message ||
        "The current goal stats cannot be achieved with the current artifact configuration."
      }
        </div>
      </div>
    `;
    }

    if (Object.keys(displayData.substats).length === 0) {
      return "";
    }

    return `
    <div style="margin-top: 25px; padding-top: 20px; border-top: 2px solid #00ffff44;">
      <h5 style="color: #00ffff; margin-bottom: 15px;">Substat Roll Analysis (New Calculation)</h5>
      
      <div style="background: #1c2b33; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <strong style="color: #00ffff;">Total Rolls Required:</strong>
          <span style="color: #ccc;">
            ${displayData.totalRolls.minUsed} - ${displayData.totalRolls.maxUsed} rolls 
            (out of ${displayData.totalRolls.available} available)
          </span>
        </div>
        <div style="font-size: 12px; color: #888; margin-top: 8px;">
          Range: ${displayData.totalRolls.minUsed} rolls (all max rolls) to ${displayData.totalRolls.maxUsed} rolls (all min rolls)
        </div>
      </div>
      
      <div style="display: grid; gap: 12px;">
        ${
      Object.entries(displayData.substats).map(([statKey, data]) => {
        const minAchievable = data.achievable.min;
        const maxAchievable = data.achievable.max;
        const minColor = minAchievable ? "#27ae60" : "#e74c3c";
        const maxColor = maxAchievable ? "#27ae60" : "#e74c3c";

        return `
            <div style="background: #1c2b33; padding: 15px; border-radius: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <strong style="color: #00ffff;">${statKey.toUpperCase()}</strong>
                <span style="color: #ccc;">
                  ${data.neededRolls.min} - ${data.neededRolls.max} rolls needed
                </span>
              </div>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px; color: #ccc; margin-bottom: 8px;">
                <div>Value Gain: ${data.totalValue.min.toFixed(0)} - ${
          data.totalValue.max.toFixed(0)
        }</div>
                <div style="text-align: right;">
                  Min: <span style="color: ${minColor}">${
          minAchievable ? "✅" : "❌"
        }</span> | 
                  Max: <span style="color: ${maxColor}">${
          maxAchievable ? "✅" : "❌"
        }</span>
                </div>
              </div>
              
              <div style="font-size: 11px; color: #888; margin-top: 8px;">
                <strong>Available in:</strong> ${data.availableRolls} rolls across compatible artifacts
              </div>
              
              ${
          data.breakdown
            ? `
                <div style="font-size: 11px; color: #888; margin-top: 8px;">
                  <strong>Optimal Distribution:</strong> 
                  ${
              Object.entries(data.breakdown).map(([substat, rolls]) =>
                `${rolls.min}-${rolls.max} ${substat} rolls`
              ).join(" + ")
            }
                </div>
              `
            : ""
        }
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
// GEAR HANDLER (KEEP EXISTING)
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
      const baseValues = { critRate: 5, critDmg: 50, energyRecharge: 100 };
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
