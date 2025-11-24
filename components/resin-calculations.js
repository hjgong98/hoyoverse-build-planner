// /utils/resin-calculations.js

export function calculateResinRequirements(
  character,
  ascensionMats,
  talentMats,
) {
  const results = {
    boss: { minResin: 0, maxResin: 0, minTime: 0, maxTime: 0 },
    talents: { minResin: 0, maxResin: 0, minTime: 0, maxTime: 0 },
    total: { minResin: 0, maxResin: 0, minTime: 0, maxTime: 0 },
  };

  // Calculate boss material requirements (unchanged)
  if (ascensionMats.boss && ascensionMats.boss.length > 0) {
    const totalBossMats = ascensionMats.boss.reduce(
      (sum, mat) => sum + mat.count,
      0,
    );

    const minRuns = Math.ceil(totalBossMats / 4);
    const maxRuns = Math.ceil(totalBossMats / 3);

    results.boss.minResin = minRuns * 40;
    results.boss.maxResin = maxRuns * 40;
    results.boss.minTime = results.boss.minResin * 8;
    results.boss.maxTime = results.boss.maxResin * 8;
  }

  // FIXED: Calculate talent book requirements
  if (talentMats.books && talentMats.books.length > 0) {
    let totalMinResin = 0;
    let totalMaxResin = 0;

    // Process each book requirement separately
    talentMats.books.forEach((book) => {
      const tierNum = parseInt(book.tier);
      const count = book.count;

      // Realistic drop rates for talent domains:
      // - 20 resin per run
      // - Typical drops per run:
      //   * Minimum: 2 green (2★) books
      //   * Average: 1 blue (3★) + 2 green (2★) books
      //   * Maximum: 1 purple (4★) + 1 blue (3★) book

      let minRuns = 0;
      let maxRuns = 0;

      switch (tierNum) {
        case 2: // Green books (2★)
          // Min: 2 greens per run, Max: 3 greens per run (if lucky with extra drops)
          minRuns = Math.ceil(count / 3);
          maxRuns = Math.ceil(count / 2);
          break;

        case 3: // Blue books (3★)
          // Conversion: 3 greens = 1 blue
          // Min: 1 blue per run, Max: 2 blues per run
          minRuns = Math.ceil(count / 2);
          maxRuns = Math.ceil(count / 1);
          break;

        case 4: // Purple books (4★)
          // Conversion: 3 blues = 1 purple (or 9 greens = 1 purple)
          // Min: 0.33 purples per run (1 every 3 runs), Max: 1 purple per run
          minRuns = Math.ceil(count / 1);
          maxRuns = Math.ceil(count / 0.33); // More realistic: 1 purple every 3 runs on average
          break;
      }

      totalMinResin += minRuns * 20;
      totalMaxResin += maxRuns * 20;
    });

    results.talents.minResin = totalMinResin;
    results.talents.maxResin = totalMaxResin;
    results.talents.minTime = totalMinResin * 8;
    results.talents.maxTime = totalMaxResin * 8;
  }

  // Calculate totals
  results.total.minResin = results.boss.minResin + results.talents.minResin;
  results.total.maxResin = results.boss.maxResin + results.talents.maxResin;
  results.total.minTime = results.total.minResin * 8;
  results.total.maxTime = results.total.maxResin * 8;

  return results;
}

export function formatTimeMinutes(minutes) {
  if (minutes < 60) {
    return `${minutes} minutes`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours < 24) {
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}m`
      : `${hours}h`;
  }

  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  if (remainingHours > 0) {
    return `${days}d ${remainingHours}h`;
  }

  return `${days} days`;
}

export function calculateResinRegenerationTime(resinAmount) {
  const minutesNeeded = resinAmount * 8; // 8 minutes per resin
  return formatTimeMinutes(minutesNeeded);
}

// Additional helper to calculate days worth of resin
export function calculateDaysOfResin(resinAmount) {
  const resinPerDay = 180; // Natural regeneration
  return (resinAmount / resinPerDay).toFixed(1);
}
