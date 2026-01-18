import {
  QBContract,
  CapProjectionDataPoint,
  CURRENT_YEAR,
  CURRENT_CAP,
  CAP_GROWTH_RATE,
  DANGER_THRESHOLD,
} from "@/types";
import { projectFutureCap } from "./windowScore";

/**
 * Calculate trajectory score based on cap hit changes
 * Negative = window opening (cap hit decreasing)
 * Positive = window closing (cap hit increasing)
 */
export function calculateTrajectoryDirection(qbContract: QBContract): number {
  const currentHit = qbContract.capHits.find(h => h.year === CURRENT_YEAR)?.amount || 0;
  const nextYearHit = qbContract.capHits.find(h => h.year === CURRENT_YEAR + 1)?.amount || 0;

  if (currentHit === 0) return 0;

  const yearOverYearIncrease = ((nextYearHit - currentHit) / currentHit) * 100;

  if (yearOverYearIncrease < 0) return 90; // Improving
  if (yearOverYearIncrease < 20) return 70; // Stable
  if (yearOverYearIncrease < 50) return 50; // Moderate increase
  if (yearOverYearIncrease < 100) return 30; // Significant increase
  return 15; // Cap cliff incoming
}

/**
 * Generate cap hit projection data for charts
 */
export function generateCapProjection(
  qbContract: QBContract,
  yearsToProject: number = 6
): CapProjectionDataPoint[] {
  const projections: CapProjectionDataPoint[] = [];

  for (let i = 0; i < yearsToProject; i++) {
    const year = CURRENT_YEAR + i;
    const capHitEntry = qbContract.capHits.find(h => h.year === year);
    const projectedCap = projectFutureCap(year);

    if (capHitEntry && !capHitEntry.isVoidYear) {
      projections.push({
        year,
        capHitPercent: Math.round((capHitEntry.amount / projectedCap) * 100 * 100) / 100,
        capHitAmount: capHitEntry.amount,
        projectedCap,
        isProjected: year > CURRENT_YEAR,
      });
    } else if (capHitEntry && capHitEntry.isVoidYear) {
      // Show void years differently
      projections.push({
        year,
        capHitPercent: 0,
        capHitAmount: capHitEntry.deadMoneyIfCut || 0,
        projectedCap,
        isProjected: true,
      });
    }
  }

  return projections;
}

/**
 * Find the year when cap hit first crosses the danger threshold
 */
export function findThresholdCrossYear(
  qbContract: QBContract,
  threshold: number = DANGER_THRESHOLD
): number | null {
  for (const capHit of qbContract.capHits) {
    if (capHit.year < CURRENT_YEAR) continue;
    if (capHit.isVoidYear) continue;

    const projectedCap = projectFutureCap(capHit.year);
    const capHitPercent = (capHit.amount / projectedCap) * 100;

    if (capHitPercent >= threshold) {
      return capHit.year;
    }
  }
  return null;
}

/**
 * Calculate cap hit trend (slope)
 * Positive slope = increasing cap burden
 * Negative slope = decreasing cap burden
 */
export function calculateCapHitTrend(qbContract: QBContract): number {
  const projections = generateCapProjection(qbContract, 4);

  if (projections.length < 2) return 0;

  // Simple linear regression for trend
  const n = projections.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

  projections.forEach((point, i) => {
    sumX += i;
    sumY += point.capHitPercent;
    sumXY += i * point.capHitPercent;
    sumXX += i * i;
  });

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  return Math.round(slope * 100) / 100;
}

/**
 * Get trajectory description based on analysis
 */
export function getTrajectoryDescription(
  qbContract: QBContract,
  currentCapHitPercent: number
): string {
  const trend = calculateCapHitTrend(qbContract);
  const crossYear = findThresholdCrossYear(qbContract);
  const direction = calculateTrajectoryDirection(qbContract);

  if (currentCapHitPercent < 6) {
    if (crossYear) {
      const yearsUntil = crossYear - CURRENT_YEAR;
      return `Elite territory now. Crosses ${DANGER_THRESHOLD}% threshold in ${yearsUntil} year${yearsUntil > 1 ? 's' : ''} (${crossYear}).`;
    }
    return "Elite territory. No threshold crossing projected through contract.";
  }

  if (currentCapHitPercent >= DANGER_THRESHOLD) {
    if (trend > 1) {
      return `Already past ${DANGER_THRESHOLD}% threshold and cap hit still climbing. Window closed.`;
    }
    return `Already past ${DANGER_THRESHOLD}% threshold. Would need restructure to create flexibility.`;
  }

  if (crossYear) {
    const yearsUntil = crossYear - CURRENT_YEAR;
    if (yearsUntil <= 1) {
      return `Crosses ${DANGER_THRESHOLD}% threshold next year. Window closing rapidly.`;
    }
    return `${yearsUntil} years until ${DANGER_THRESHOLD}% threshold (${crossYear}). Moderate runway.`;
  }

  return "Cap hit remains manageable through contract.";
}

/**
 * Calculate worst-case cap hit (if no restructures)
 */
export function calculatePeakCapHit(qbContract: QBContract): {
  year: number;
  amount: number;
  percent: number;
} {
  let peak = { year: CURRENT_YEAR, amount: 0, percent: 0 };

  for (const capHit of qbContract.capHits) {
    if (capHit.isVoidYear) continue;
    if (capHit.year < CURRENT_YEAR) continue;

    const projectedCap = projectFutureCap(capHit.year);
    const percent = (capHit.amount / projectedCap) * 100;

    if (percent > peak.percent) {
      peak = {
        year: capHit.year,
        amount: capHit.amount,
        percent: Math.round(percent * 100) / 100,
      };
    }
  }

  return peak;
}

/**
 * Project cap hit with potential restructure
 */
export function simulateRestructure(
  qbContract: QBContract,
  amountToConvert: number,
  yearsToProrate: number = 5
): QBContract {
  const newContract: QBContract = JSON.parse(JSON.stringify(qbContract));
  const perYearBonus = amountToConvert / yearsToProrate;

  // Find current year index
  const currentYearIndex = newContract.capHits.findIndex(h => h.year === CURRENT_YEAR);

  if (currentYearIndex === -1) return newContract;

  // Reduce current year hit
  newContract.capHits[currentYearIndex].amount -= amountToConvert;
  newContract.capHits[currentYearIndex].baseSalary -= amountToConvert;

  // Spread to future years
  for (let i = 0; i < yearsToProrate; i++) {
    const targetIndex = currentYearIndex + i;
    if (newContract.capHits[targetIndex]) {
      newContract.capHits[targetIndex].amount += perYearBonus;
      newContract.capHits[targetIndex].signingBonus += perYearBonus;
    }
  }

  return newContract;
}

/**
 * Get contract flexibility assessment
 */
export function getContractFlexibility(qbContract: QBContract): {
  hasRestructureRoom: boolean;
  maxRestructureAmount: number;
  recommendation: string;
} {
  const currentYearHit = qbContract.capHits.find(h => h.year === CURRENT_YEAR);

  if (!currentYearHit) {
    return {
      hasRestructureRoom: false,
      maxRestructureAmount: 0,
      recommendation: "No current year cap hit data available.",
    };
  }

  // Can only convert base salary (roughly)
  const baseSalary = currentYearHit.baseSalary;
  const hasRoom = baseSalary > 1_500_000; // Need at least vet minimum
  const maxRestructure = Math.max(0, baseSalary - 1_500_000);

  let recommendation = "";
  if (!hasRoom) {
    recommendation = "No restructure room. Base salary already at minimum.";
  } else if (maxRestructure > 20_000_000) {
    recommendation = `Significant restructure room ($${(maxRestructure / 1_000_000).toFixed(1)}M). Could create short-term relief but pushes cap burden to future years.`;
  } else {
    recommendation = `Limited restructure room ($${(maxRestructure / 1_000_000).toFixed(1)}M). Minor relief possible.`;
  }

  return {
    hasRestructureRoom: hasRoom,
    maxRestructureAmount: maxRestructure,
    recommendation,
  };
}
