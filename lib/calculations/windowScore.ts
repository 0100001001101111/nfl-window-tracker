import {
  WindowZone,
  WindowStatus,
  WindowZoneType,
  WindowStatusType,
  TeamWindowScore,
  QBContract,
  Team,
  NonQBSurplusResult,
  RookieContractStar,
  PerformanceMetrics,
  CURRENT_YEAR,
  CURRENT_CAP,
  CAP_GROWTH_RATE,
  DANGER_THRESHOLD,
} from "@/types";

/**
 * THE DOMINANT SIGNAL: QB Cap Hit %
 * Teams under 10% win championships. Teams over 15% don't.
 */
export function getQBCapHitZone(capHitPercent: number): WindowZone {
  if (capHitPercent < 6) {
    return {
      zone: "ELITE",
      color: "#00ff88",
      label: "CHAMPIONSHIP WINDOW WIDE OPEN",
      description: "Maximum roster flexibility. This is where Super Bowls are won.",
      historicalWinRate: "78% playoff appearance, 34% Super Bowl appearance",
    };
  }
  if (capHitPercent < 10) {
    return {
      zone: "FAVORABLE",
      color: "#88ff00",
      label: "WINDOW OPEN",
      description: "Strong roster flexibility. Contender territory.",
      historicalWinRate: "71% playoff appearance, 22% Super Bowl appearance",
    };
  }
  if (capHitPercent < 13) {
    return {
      zone: "CAUTION",
      color: "#ffaa00",
      label: "WINDOW CLOSING",
      description: "At the threshold. Still possible but getting harder.",
      historicalWinRate: "58% playoff appearance, 11% Super Bowl appearance",
    };
  }
  if (capHitPercent < 15) {
    return {
      zone: "DANGER",
      color: "#ff6600",
      label: "WINDOW NEARLY CLOSED",
      description: "Roster construction compromised. Need elite play just to compete.",
      historicalWinRate: "44% playoff appearance, 4% Super Bowl appearance",
    };
  }
  return {
    zone: "CLOSED",
    color: "#ff4444",
    label: "WINDOW CLOSED",
    description: "Cannot build a championship roster at this cap hit.",
    historicalWinRate: "31% playoff appearance, 1% Super Bowl appearance",
  };
}

/**
 * Get window status based on composite score
 */
export function getWindowStatus(score: number): WindowStatus {
  if (score >= 80) return { status: "wide_open", color: "#00ff88", label: "WIDE OPEN" };
  if (score >= 65) return { status: "open", color: "#88ff00", label: "OPEN" };
  if (score >= 50) return { status: "closing", color: "#ffaa00", label: "CLOSING" };
  if (score >= 35) return { status: "soft_closed", color: "#ff6600", label: "SOFT CLOSED" };
  return { status: "hard_closed", color: "#ff4444", label: "CLOSED" };
}

/**
 * Project future salary cap based on historical growth rate
 */
export function projectFutureCap(year: number): number {
  const yearsOut = year - CURRENT_YEAR;
  return Math.round(CURRENT_CAP * Math.pow(1 + CAP_GROWTH_RATE, yearsOut));
}

/**
 * Calculate years until QB cap hit crosses the danger threshold (13%)
 */
export function calculateYearsUntilThreshold(
  qbContract: QBContract,
  threshold: number = DANGER_THRESHOLD
): number {
  let years = 0;

  for (const capHit of qbContract.capHits) {
    if (capHit.year < CURRENT_YEAR) continue;
    if (capHit.isVoidYear) continue;

    const projectedCap = projectFutureCap(capHit.year);
    const capHitPercent = (capHit.amount / projectedCap) * 100;

    if (capHitPercent >= threshold) {
      return years;
    }
    years++;
  }

  return Math.min(years, 5); // Cap at 5+ years
}

/**
 * Calculate the primary QB Cap Score (0-100)
 * 0% cap hit = 100 points, 20% cap hit = 0 points
 */
export function calculateQBCapScore(qbCapHitPercent: number): number {
  return Math.max(0, Math.min(100, 100 - qbCapHitPercent * 5));
}

/**
 * Calculate QB Quality Score (0-100) based on performance metrics
 * Uses EPA, CPOE, QBR, and PFF Grade
 * Returns 40 (unproven) if no meaningful stats
 */
export function calculateQBQualityScore(metrics?: PerformanceMetrics): number {
  // If no metrics or all zeros, return "unproven" score
  if (!metrics || (metrics.epaPerPlay === 0 && metrics.qbr === 0 && metrics.pffGrade === 0)) {
    return 40; // Unproven - significant uncertainty penalty
  }

  // Normalize EPA per play: range roughly -0.2 to 0.3
  // -0.2 = 0, 0.0 = 40, 0.15 = 70, 0.25+ = 100
  const epaScore = Math.max(0, Math.min(100, (metrics.epaPerPlay + 0.2) * 200));

  // Normalize CPOE: range roughly -5 to +6
  // -5 = 0, 0 = 45, 3 = 72, 6+ = 100
  const cpoeScore = Math.max(0, Math.min(100, (metrics.cpoe + 5) * 9.1));

  // Normalize QBR: range roughly 30 to 85
  // 30 = 0, 50 = 36, 65 = 64, 80+ = 100
  const qbrScore = Math.max(0, Math.min(100, (metrics.qbr - 30) * 1.82));

  // Normalize PFF Grade: range roughly 50 to 95
  // 50 = 0, 65 = 33, 80 = 67, 92+ = 100
  const pffScore = Math.max(0, Math.min(100, (metrics.pffGrade - 50) * 2.22));

  // Weighted average: PFF and EPA weighted higher as better predictors
  const qualityScore =
    epaScore * 0.30 +
    pffScore * 0.30 +
    qbrScore * 0.25 +
    cpoeScore * 0.15;

  return Math.round(qualityScore * 10) / 10;
}

/**
 * Calculate trajectory score based on years until threshold
 * 5+ years = 100, 0 years = 0
 */
export function calculateTrajectoryScore(yearsUntilThreshold: number): number {
  return Math.min(100, yearsUntilThreshold * 20);
}

/**
 * Calculate sustainability score based on how long non-QB surplus lasts
 * 4+ years = 100, 0 years = 0
 */
export function calculateSustainabilityScore(sustainabilityYears: number): number {
  return Math.min(100, sustainabilityYears * 25);
}

/**
 * Calculate core health score (placeholder - would need roster data)
 * This is a tiebreaker metric at 5% weight
 */
export function calculateCoreHealthScore(
  qbAge: number = 27,
  keyInjuries: number = 0
): number {
  let score = 100;

  // Age penalty for QB over 30
  if (qbAge > 30) {
    score -= (qbAge - 30) * 5;
  }

  // Injury penalty
  score -= keyInjuries * 10;

  return Math.max(0, Math.min(100, score));
}

/**
 * Proven success data for teams (2023-2025 results)
 */
export interface ProvenSuccess {
  superBowlWin: boolean;      // Won SB in last 3 years
  superBowlAppearance: boolean; // Made SB in last 3 years
  conferenceChamp: boolean;   // Made conference championship
  playoffWin: boolean;        // Won a playoff game in last 2 years
}

/**
 * Get proven success for a team based on recent playoff results
 */
export function getProvenSuccess(teamId: string): ProvenSuccess {
  // 2025 Super Bowl: PHI won, KC lost
  // 2024: KC won, SF lost
  // 2023: KC won, PHI lost
  const sbWinners = ["PHI"]; // PHI won SB 59 (2025)
  const sbAppearances = ["PHI", "KC"]; // PHI and KC in SB 59
  const confChamps = ["PHI", "KC", "WAS", "BUF"]; // 2025 conf championship teams
  const playoffWinners = [
    "PHI", "KC", "WAS", "BUF", "DET", "LAR", "DEN", "GB", "SF", "HOU", "TB", "MIN"
  ];

  return {
    superBowlWin: sbWinners.includes(teamId),
    superBowlAppearance: sbAppearances.includes(teamId),
    conferenceChamp: confChamps.includes(teamId),
    playoffWin: playoffWinners.includes(teamId),
  };
}

/**
 * Season result data for scoring
 */
export interface SeasonResult {
  wins: number;
  madePlayoffs: boolean;
  playoffWins: number;
  confChampionship: boolean;
  superBowlAppearance: boolean;
  superBowlWin: boolean;
  coachTier: number;
  qbProductionTier: number;
}

/**
 * Main window score calculation - MULTI-FACTOR FORMULA
 *
 * Weighted Scoring (out of 100 points):
 * 1. 2025 Team Success (30%) - Current year wins + playoff success (max 35 with playoffs)
 * 2. QB Cap Hit % (25%) - The core thesis - lower is better
 * 3. Head Coach Quality (20%) - Proven winners vs. rebuilding
 * 4. Window Length (15%) - Years remaining before cap escalates
 * 5. QB Proven Production (10%) - Career playoff record, efficiency
 *
 * A cheap QB on a 5-12 team doesn't have a better window than
 * a slightly more expensive QB on a 14-3 team with an elite coach.
 */
export function calculateWindowScore(
  qbCapHitPercent: number,
  yearsUntilThreshold: number,
  seasonResult?: SeasonResult
): number {
  let totalScore = 0;

  // 1. TEAM SUCCESS (30% - max 35 with playoffs)
  let successScore = 0;
  if (seasonResult) {
    const wins = seasonResult.wins;
    if (wins >= 14) successScore = 30;
    else if (wins >= 12) successScore = 25;
    else if (wins >= 11) successScore = 22;
    else if (wins >= 10) successScore = 18;
    else if (wins >= 9) successScore = 14;
    else if (wins >= 8) successScore = 10;
    else if (wins >= 7) successScore = 6;
    else successScore = 2;

    // Playoff bonuses
    if (seasonResult.madePlayoffs) successScore += 3;
    successScore += (seasonResult.playoffWins * 2);
    if (seasonResult.confChampionship) successScore += 5;
    if (seasonResult.superBowlAppearance) successScore += 5;
    if (seasonResult.superBowlWin) successScore += 10;

    // Cap at 35
    successScore = Math.min(35, successScore);
  } else {
    successScore = 10; // Default if no data
  }
  totalScore += successScore;

  // 2. QB CAP HIT % (25% - max 25 points)
  let capScore = 0;
  if (qbCapHitPercent < 2) capScore = 25;
  else if (qbCapHitPercent < 3) capScore = 23;
  else if (qbCapHitPercent < 4) capScore = 21;
  else if (qbCapHitPercent < 6) capScore = 18;
  else if (qbCapHitPercent < 8) capScore = 14;
  else if (qbCapHitPercent < 10) capScore = 10;
  else if (qbCapHitPercent < 13) capScore = 6;
  else if (qbCapHitPercent < 15) capScore = 3;
  else capScore = 0;
  totalScore += capScore;

  // 3. HEAD COACH QUALITY (20% - max 20 points)
  const coachScore = seasonResult?.coachTier || 10;
  totalScore += coachScore;

  // 4. WINDOW LENGTH (15% - max 15 points)
  let windowScore = 0;
  if (yearsUntilThreshold >= 4) windowScore = 15;
  else if (yearsUntilThreshold >= 3) windowScore = 12;
  else if (yearsUntilThreshold >= 2) windowScore = 9;
  else if (yearsUntilThreshold >= 1) windowScore = 5;
  else windowScore = 3;
  totalScore += windowScore;

  // 5. QB PROVEN PRODUCTION (10% - max 10 points)
  const productionScore = seasonResult?.qbProductionTier || 4;
  totalScore += productionScore;

  return Math.round(totalScore);
}

/**
 * Calculate complete TeamWindowScore for a team
 */
export function calculateTeamWindowScore(
  team: Team,
  qbContract: QBContract,
  nonQBSurplus: NonQBSurplusResult = { totalSurplus: 0, starRookies: [], sustainabilityYears: 0, surplusAsPercentOfCap: 0 },
  qbAge: number = 27,
  seasonResult?: SeasonResult
): TeamWindowScore {
  // Get current year cap hit
  const currentCapHit = qbContract.capHits.find(h => h.year === CURRENT_YEAR);
  const qbCapHit = currentCapHit?.amount || 0;
  const qbCapHitPercent = (qbCapHit / CURRENT_CAP) * 100;

  // Calculate years until threshold
  const yearsUntilThreshold = calculateYearsUntilThreshold(qbContract, DANGER_THRESHOLD);

  // Calculate core health
  const coreScore = calculateCoreHealthScore(qbAge);

  // Calculate component scores (for display purposes)
  const qbCapScore = calculateQBCapScore(qbCapHitPercent);
  const qbQualityScore = calculateQBQualityScore(qbContract.performanceMetrics);
  const surplusScore = Math.min(100, (nonQBSurplus.totalSurplus / 50_000_000) * 100);
  const trajectoryScore = calculateTrajectoryScore(yearsUntilThreshold);
  const sustainabilityScore = calculateSustainabilityScore(nonQBSurplus.sustainabilityYears);

  // Calculate overall score with new multi-factor formula
  const overallScore = calculateWindowScore(
    qbCapHitPercent,
    yearsUntilThreshold,
    seasonResult
  );

  // Get window zone and status
  const windowZone = getQBCapHitZone(qbCapHitPercent);
  const windowStatus = getWindowStatus(overallScore);

  return {
    teamId: team.id,
    overallScore,
    qbCapScore,
    qbQualityScore,
    surplusScore,
    trajectoryScore,
    sustainabilityScore,
    coreScore,
    qbCapHitPercent: Math.round(qbCapHitPercent * 100) / 100,
    qbCapHit,
    salaryCap: CURRENT_CAP,
    yearsUntilThreshold,
    windowZone,
    windowStatus,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Calculate dead money penalty for trajectory score
 * Teams like Saints who "kick the can" should show steeper cliffs
 */
export function calculateDeadMoneyPenalty(
  qbContract: QBContract,
  projectedCaps: number[]
): number {
  let penalty = 1.0;

  for (let i = 0; i < qbContract.capHits.length; i++) {
    const capHit = qbContract.capHits[i];

    if (capHit.isVoidYear && capHit.deadMoneyIfCut) {
      const yearIndex = capHit.year - CURRENT_YEAR;
      const projectedCap = projectedCaps[yearIndex] || projectFutureCap(capHit.year);
      const deadMoneyPercent = (capHit.deadMoneyIfCut / projectedCap) * 100;

      // If void year hit > 5% of that year's projected cap, apply penalty
      if (deadMoneyPercent > 5) {
        penalty *= 0.9; // 10% penalty per bad void year
      }
      if (deadMoneyPercent > 10) {
        penalty *= 0.8; // Additional 20% penalty for severe void years
      }
    }
  }

  return Math.max(0.5, penalty); // Floor at 0.5
}

/**
 * Sort teams by overall window score (descending)
 * Overall score now factors in both cap efficiency AND QB quality
 */
export function sortTeamsByWindow(scores: TeamWindowScore[]): TeamWindowScore[] {
  return [...scores].sort((a, b) => {
    // Primary sort: overall score (descending - higher is better)
    // This now includes QB quality, so cheap+bad won't rank above cheap+good
    if (b.overallScore !== a.overallScore) {
      return b.overallScore - a.overallScore;
    }
    // Secondary sort: QB cap hit % (ascending - lower is better as tiebreaker)
    return a.qbCapHitPercent - b.qbCapHitPercent;
  });
}

/**
 * Get the zone color for a given cap hit percentage
 */
export function getZoneColor(capHitPercent: number): string {
  return getQBCapHitZone(capHitPercent).color;
}

/**
 * Get zone type from cap hit percentage
 */
export function getZoneType(capHitPercent: number): WindowZoneType {
  return getQBCapHitZone(capHitPercent).zone;
}
