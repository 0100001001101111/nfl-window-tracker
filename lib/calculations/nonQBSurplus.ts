import {
  RookieContractStar,
  NonQBSurplusResult,
  MarketValueBenchmark,
  PositionBenchmarks,
  CURRENT_YEAR,
  CURRENT_CAP,
} from "@/types";

/**
 * Market Value Benchmarks by Position (2025 estimates)
 * Based on recent contracts and market trends
 */
export const MARKET_VALUE_BENCHMARKS: PositionBenchmarks = {
  WR1: { elite: 35_000_000, good: 25_000_000, average: 15_000_000 },
  WR: { elite: 28_000_000, good: 18_000_000, average: 10_000_000 },
  EDGE: { elite: 30_000_000, good: 22_000_000, average: 14_000_000 },
  CB: { elite: 22_000_000, good: 16_000_000, average: 10_000_000 },
  DT: { elite: 22_000_000, good: 15_000_000, average: 10_000_000 },
  OT: { elite: 25_000_000, good: 18_000_000, average: 12_000_000 },
  OG: { elite: 18_000_000, good: 12_000_000, average: 8_000_000 },
  C: { elite: 16_000_000, good: 11_000_000, average: 7_000_000 },
  RB: { elite: 14_000_000, good: 10_000_000, average: 6_000_000 },
  LB: { elite: 18_000_000, good: 12_000_000, average: 7_000_000 },
  S: { elite: 16_000_000, good: 11_000_000, average: 7_000_000 },
  TE: { elite: 15_000_000, good: 10_000_000, average: 6_000_000 },
};

/**
 * Estimate market value based on position and performance (PFF grade)
 */
export function estimateMarketValue(
  position: string,
  pffGrade: number
): number {
  const benchmarks = MARKET_VALUE_BENCHMARKS[position];

  if (!benchmarks) {
    // Default to average values for unknown positions
    return 8_000_000;
  }

  // Use PFF grade to place player in tier
  if (pffGrade >= 85) return benchmarks.elite;
  if (pffGrade >= 75) return benchmarks.good;
  if (pffGrade >= 65) return benchmarks.average;
  return Math.round(benchmarks.average * 0.5); // Below average
}

/**
 * Calculate surplus value for a rookie contract player
 */
export function calculateRookieSurplus(
  player: RookieContractStar
): number {
  const marketValue = estimateMarketValue(player.position, player.pffGrade);
  return marketValue - player.currentYearCapHit;
}

/**
 * Calculate when a player becomes extension eligible
 * For draft picks: After 3rd year (can sign extension), restricted after 4th
 */
export function calculateExtensionYear(
  draftYear: number,
  draftRound: number
): number {
  // First round picks: 5th year option
  if (draftRound === 1) {
    return draftYear + 4; // Extension typically after year 3-4
  }
  // Other rounds: Extension after year 3
  return draftYear + 3;
}

/**
 * Calculate sustainability of non-QB surplus
 * Returns the number of years until majority of surplus evaporates
 */
export function calculateSurplusSustainability(
  starRookies: RookieContractStar[]
): number {
  if (starRookies.length === 0) return 0;

  // Find the year when most surplus disappears
  const extensionYears = starRookies.map(r => r.extensionEligibleYear);

  // Sort and find median
  extensionYears.sort((a, b) => a - b);
  const medianExtensionYear = extensionYears[Math.floor(extensionYears.length / 2)];

  return Math.max(0, medianExtensionYear - CURRENT_YEAR);
}

/**
 * Calculate total non-QB surplus for a team
 * This is the "Rams exception" logic - explains how teams can compete
 * despite expensive QBs
 */
export function calculateNonQBSurplus(
  rookieStars: RookieContractStar[]
): NonQBSurplusResult {
  let totalSurplus = 0;
  const qualifyingRookies: RookieContractStar[] = [];

  for (const player of rookieStars) {
    const marketValue = estimateMarketValue(player.position, player.pffGrade);
    const surplus = marketValue - player.currentYearCapHit;

    // Only count significant surplus (> $5M)
    if (surplus > 5_000_000) {
      totalSurplus += surplus;
      qualifyingRookies.push({
        ...player,
        estimatedMarketValue: marketValue,
        surplusValue: surplus,
      });
    }
  }

  const sustainabilityYears = calculateSurplusSustainability(qualifyingRookies);
  const surplusAsPercentOfCap = (totalSurplus / CURRENT_CAP) * 100;

  return {
    totalSurplus,
    starRookies: qualifyingRookies.sort((a, b) => b.surplusValue - a.surplusValue),
    sustainabilityYears,
    surplusAsPercentOfCap: Math.round(surplusAsPercentOfCap * 10) / 10,
  };
}

/**
 * Calculate adjusted window score accounting for non-QB surplus
 * This is how the Rams can compete despite Stafford at 17%
 */
export function calculateAdjustedEffectiveQBCost(
  qbCapHitPercent: number,
  nonQBSurplus: NonQBSurplusResult
): {
  rawQBCapHitPercent: number;
  effectiveQBCost: number;
  surplusOffset: number;
  explanation: string;
} {
  // Convert surplus to "effective QB cap reduction"
  // Give 50% credit for non-QB surplus
  const surplusAsPercent = nonQBSurplus.surplusAsPercentOfCap;
  const surplusOffset = surplusAsPercent * 0.5;
  const effectiveQBCost = Math.max(0, qbCapHitPercent - surplusOffset);

  let explanation = "";
  if (surplusOffset > 5) {
    explanation = `QB at ${qbCapHitPercent.toFixed(1)}% but ${nonQBSurplus.starRookies.length} rookie stars provide $${(nonQBSurplus.totalSurplus / 1_000_000).toFixed(0)}M in surplus value. Effective QB cost: ${effectiveQBCost.toFixed(1)}%. `;

    if (nonQBSurplus.sustainabilityYears <= 2) {
      explanation += `Warning: Window closes in ~${nonQBSurplus.sustainabilityYears} years when extensions come due.`;
    }
  } else {
    explanation = `QB at ${qbCapHitPercent.toFixed(1)}% cap hit. Limited non-QB surplus value.`;
  }

  return {
    rawQBCapHitPercent: qbCapHitPercent,
    effectiveQBCost: Math.round(effectiveQBCost * 10) / 10,
    surplusOffset: Math.round(surplusOffset * 10) / 10,
    explanation,
  };
}

/**
 * Get a sustainability warning if applicable
 */
export function getSustainabilityWarning(
  nonQBSurplus: NonQBSurplusResult
): string | null {
  if (nonQBSurplus.totalSurplus < 20_000_000) {
    return null; // Not enough surplus to matter
  }

  if (nonQBSurplus.sustainabilityYears <= 1) {
    const extensionPlayers = nonQBSurplus.starRookies
      .filter(r => r.extensionEligibleYear <= CURRENT_YEAR + 1)
      .map(r => r.playerName)
      .join(", ");
    return `CRITICAL: $${(nonQBSurplus.totalSurplus / 1_000_000).toFixed(0)}M surplus evaporates this/next year. Extensions due: ${extensionPlayers}`;
  }

  if (nonQBSurplus.sustainabilityYears <= 2) {
    return `WARNING: Non-QB surplus ($${(nonQBSurplus.totalSurplus / 1_000_000).toFixed(0)}M) expires in ${nonQBSurplus.sustainabilityYears} years. Window is NOW.`;
  }

  return null;
}

/**
 * Format surplus for display
 */
export function formatSurplus(surplus: number): string {
  if (surplus >= 1_000_000) {
    return `+$${(surplus / 1_000_000).toFixed(1)}M`;
  }
  return `+$${(surplus / 1_000).toFixed(0)}K`;
}
