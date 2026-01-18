import { PerformanceMetrics, CURRENT_CAP } from "@/types";

/**
 * Market Value Benchmarks for QB performance
 * Maps performance metrics to estimated market value
 */
const QB_VALUE_TIERS = {
  elite: 60_000_000,      // Top 5 QB
  proBowl: 50_000_000,    // Top 10 QB
  aboveAverage: 40_000_000, // Top 15 QB
  average: 30_000_000,    // Top 20 QB
  belowAverage: 20_000_000, // Serviceable starter
  replacement: 5_000_000,  // Backup level
};

/**
 * Calculate QB value score based on cap hit percentage
 * This is used for the window score calculation
 */
export function calculateQBValueScore(capHitPercent: number): number {
  // Median starting QB cap hit is roughly 10-12% of cap
  // Elite value is under 6%
  // Overpay is above 18%

  if (capHitPercent < 3) return 100; // Rookie deal territory
  if (capHitPercent < 6) return 90;  // Massive surplus (Purdy 2025, Hurts 2024)
  if (capHitPercent < 10) return 75; // Good value
  if (capHitPercent < 14) return 55; // Fair market
  if (capHitPercent < 18) return 35; // Slight overpay
  if (capHitPercent < 22) return 20; // Significant overpay
  return 10; // Cap albatross
}

/**
 * Calculate QB Performance Value based on stats
 * Maps EPA/play, CPOE, QBR, and wins to a dollar value
 *
 * Weights:
 * - EPA: 40% (efficiency measure)
 * - CPOE: 20% (accuracy measure)
 * - Win %: 25% (results)
 * - Playoff success: 15% (when it matters)
 */
export function calculateQBPerformanceValue(metrics: PerformanceMetrics): number {
  // Normalize EPA/play to 0-100 scale
  // Elite: 0.25+, Average: 0.10, Bad: -0.05
  const epaScore = normalizeMetric(metrics.epaPerPlay, -0.1, 0.3, 0, 100);

  // Normalize CPOE to 0-100 scale
  // Elite: 5+, Average: 0, Bad: -5
  const cpoeScore = normalizeMetric(metrics.cpoe, -5, 8, 0, 100);

  // Normalize QBR to 0-100 scale
  // Elite: 75+, Average: 55, Bad: 35
  const qbrScore = normalizeMetric(metrics.qbr, 30, 80, 0, 100);

  // Normalize wins (assuming 17 game season)
  // Elite: 13+ wins, Average: 9, Bad: 4
  const winScore = normalizeMetric(metrics.wins, 3, 14, 0, 100);

  // Playoff wins bonus
  // Each playoff win adds significant value
  const playoffScore = Math.min(100, metrics.playoffWins * 25);

  // Weighted composite
  const compositeScore =
    epaScore * 0.35 +
    cpoeScore * 0.15 +
    qbrScore * 0.15 +
    winScore * 0.2 +
    playoffScore * 0.15;

  // Map composite score (0-100) to dollar value ($5M - $65M)
  const minValue = 5_000_000;
  const maxValue = 65_000_000;
  const dollarValue = minValue + (compositeScore / 100) * (maxValue - minValue);

  return Math.round(dollarValue);
}

/**
 * Calculate QB surplus value
 * Surplus = Performance Value - Actual Cap Hit
 */
export function calculateQBSurplusValue(
  performanceValue: number,
  actualCapHit: number
): number {
  return performanceValue - actualCapHit;
}

/**
 * Calculate surplus as percentage of salary cap
 */
export function calculateSurplusPercentage(surplus: number): number {
  return (surplus / CURRENT_CAP) * 100;
}

/**
 * Get QB value tier based on performance
 */
export function getQBValueTier(performanceValue: number): string {
  if (performanceValue >= QB_VALUE_TIERS.elite) return "Elite";
  if (performanceValue >= QB_VALUE_TIERS.proBowl) return "Pro Bowl";
  if (performanceValue >= QB_VALUE_TIERS.aboveAverage) return "Above Average";
  if (performanceValue >= QB_VALUE_TIERS.average) return "Average";
  if (performanceValue >= QB_VALUE_TIERS.belowAverage) return "Below Average";
  return "Replacement";
}

/**
 * Compare QB value to contract
 * Returns: "surplus" | "fair" | "overpay"
 */
export function compareQBValueToContract(
  performanceValue: number,
  actualCapHit: number
): "surplus" | "fair" | "overpay" {
  const surplus = performanceValue - actualCapHit;
  const surplusPercent = (surplus / actualCapHit) * 100;

  if (surplusPercent > 20) return "surplus";
  if (surplusPercent < -20) return "overpay";
  return "fair";
}

/**
 * Normalize a metric to a 0-100 scale
 */
function normalizeMetric(
  value: number,
  min: number,
  max: number,
  outMin: number,
  outMax: number
): number {
  const normalized = ((value - min) / (max - min)) * (outMax - outMin) + outMin;
  return Math.max(outMin, Math.min(outMax, normalized));
}

/**
 * Calculate the effective cap hit percentage accounting for performance
 * A QB playing above their cap hit has a lower "effective" cost
 */
export function calculateEffectiveCapHitPercent(
  actualCapHitPercent: number,
  performanceValue: number,
  actualCapHit: number
): number {
  const expectedCapHitPercent = (performanceValue / CURRENT_CAP) * 100;
  const surplus = expectedCapHitPercent - actualCapHitPercent;

  // If playing above contract, reduce effective cap hit
  // If playing below contract, increase effective cap hit
  return Math.max(0, actualCapHitPercent - surplus * 0.5);
}

/**
 * Get description of QB value situation
 */
export function getQBValueDescription(
  capHitPercent: number,
  performanceValue: number,
  actualCapHit: number
): string {
  const comparison = compareQBValueToContract(performanceValue, actualCapHit);
  const tier = getQBValueTier(performanceValue);
  const surplusValue = performanceValue - actualCapHit;
  const surplusMillion = Math.abs(surplusValue) / 1_000_000;

  if (comparison === "surplus") {
    return `${tier} performance at ${capHitPercent.toFixed(1)}% cap hit. Providing $${surplusMillion.toFixed(1)}M in surplus value.`;
  } else if (comparison === "overpay") {
    return `${tier} performance at ${capHitPercent.toFixed(1)}% cap hit. Overpaid by $${surplusMillion.toFixed(1)}M relative to production.`;
  }
  return `${tier} performance at ${capHitPercent.toFixed(1)}% cap hit. Fair market value.`;
}
