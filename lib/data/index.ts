import teamsData from "./teams.json";
import contractsData from "./contracts.json";
import historicalData from "./historical.json";
import salaryCapsData from "./salaryCaps.json";
import season2025Data from "./season2025.json";
import playoffResultsData from "./playoffResults.json";
import {
  Team,
  QBContract,
  HistoricalData,
  SalaryCapData,
  TeamWindowScore,
  NonQBSurplusResult,
  ScatterDataPoint,
  WindowAlert,
  CURRENT_CAP,
  CURRENT_YEAR,
} from "@/types";
import { calculateTeamWindowScore, getZoneType, getZoneColor } from "@/lib/calculations";

// Export raw data
export const teams: Team[] = teamsData.teams as Team[];
export const qbContracts: QBContract[] = contractsData.qbContracts as QBContract[];
export const historical: HistoricalData = historicalData as HistoricalData;
export const salaryCaps: SalaryCapData = salaryCapsData as SalaryCapData;
export const season2025 = season2025Data;
export const playoffResults = playoffResultsData;

// Team results type
export interface TeamSeasonResult {
  wins: number;
  losses: number;
  madePlayoffs: boolean;
  playoffWins: number;
  confChampionship: boolean;
  superBowlAppearance: boolean;
  superBowlWin: boolean;
  coachName: string;
  coachTier: number;
  qbProductionTier: number;
  qbProductionNote: string;
}

// Get team season results
export function getTeamSeasonResult(teamId: string): TeamSeasonResult | undefined {
  const results = season2025Data.teamResults as Record<string, TeamSeasonResult>;
  return results[teamId];
}

// Get team by ID
export function getTeamById(teamId: string): Team | undefined {
  return teams.find((t) => t.id === teamId);
}

// Get QB contract by team ID
export function getQBContractByTeamId(teamId: string): QBContract | undefined {
  return qbContracts.find((c) => c.teamId === teamId);
}

// Get all window scores calculated
export function getAllWindowScores(): TeamWindowScore[] {
  const scores: TeamWindowScore[] = [];

  for (const team of teams) {
    const contract = getQBContractByTeamId(team.id);
    if (!contract) continue;

    // For now, use empty non-QB surplus (would need roster data for full calculation)
    const nonQBSurplus: NonQBSurplusResult = {
      totalSurplus: 0,
      starRookies: [],
      sustainabilityYears: 0,
      surplusAsPercentOfCap: 0,
    };

    // Estimate QB age from data or default
    const qbAge = getQBAgeEstimate(contract.playerId);

    // Get season result for multi-factor scoring
    const seasonResult = getTeamSeasonResult(team.id);

    const score = calculateTeamWindowScore(team, contract, nonQBSurplus, qbAge, seasonResult);
    scores.push(score);
  }

  // Sort by overall score (descending - higher is better)
  // Multi-factor score includes: team success, cap %, coach, window length, QB production
  return scores.sort((a, b) => {
    if (b.overallScore !== a.overallScore) {
      return b.overallScore - a.overallScore;
    }
    // Tiebreaker: lower cap hit % wins
    return a.qbCapHitPercent - b.qbCapHitPercent;
  });
}

// Get window scores for scatter plot
export function getScatterPlotData(): ScatterDataPoint[] {
  const data: ScatterDataPoint[] = [];
  const scores = getAllWindowScores();

  for (const score of scores) {
    const team = getTeamById(score.teamId);
    const contract = getQBContractByTeamId(score.teamId);
    if (!team || !contract) continue;

    // Determine playoff round from 2025 results (would come from real data)
    const playoffRound = get2025PlayoffRound(score.teamId);

    data.push({
      teamId: score.teamId,
      teamName: team.name,
      qbName: contract.playerName,
      qbCapHitPercent: score.qbCapHitPercent,
      playoffRound,
      windowZone: getZoneType(score.qbCapHitPercent),
      color: getZoneColor(score.qbCapHitPercent),
    });
  }

  return data;
}

// Bridge QBs on short deals - don't alert about escalation
const BRIDGE_QBS = ["aaron-rodgers", "justin-fields", "geno-smith"];

// Teams that should NOT get warning alerts (champions, favorable deals)
const NO_WARNING_TEAMS = ["PHI"]; // PHI just won SB - no "clock ticking" warnings
const FAVORABLE_VETS = ["baker-mayfield"]; // Baker's deal stays under 12% - it's favorable, not closing

// Get alerts for teams
export function getWindowAlerts(): WindowAlert[] {
  const alerts: WindowAlert[] = [];
  const scores = getAllWindowScores();

  for (const score of scores) {
    const team = getTeamById(score.teamId);
    const contract = getQBContractByTeamId(score.teamId);
    if (!team || !contract) continue;

    const isBridgeQB = BRIDGE_QBS.includes(contract.playerId);
    const isFavorableVet = FAVORABLE_VETS.includes(contract.playerId);
    const noWarnings = NO_WARNING_TEAMS.includes(score.teamId);
    const isRookie = contract.contractType === "rookie";
    const yearsRemaining = contract.yearsRemaining;

    // SPECIAL: Rams Exception
    if (score.teamId === "LAR") {
      alerts.push({
        teamId: score.teamId,
        type: "warning",
        message: `Matthew Stafford at ${score.qbCapHitPercent.toFixed(2)}%. Window CLOSED by cap rules, but $88M rookie surplus keeps them competitive. Unsustainable.`,
        timestamp: new Date().toISOString(),
      });
      continue;
    }

    // GREEN: Rookie QBs under 4% with 3+ years left on deal
    if (isRookie && score.qbCapHitPercent < 4 && yearsRemaining >= 3) {
      alerts.push({
        teamId: score.teamId,
        type: "positive",
        message: `${contract.playerName} at ${score.qbCapHitPercent.toFixed(2)}%. Window WIDE OPEN for ${yearsRemaining}+ years.`,
        timestamp: new Date().toISOString(),
      });
    }
    // GREEN: Favorable veteran deals (Baker Mayfield)
    else if (isFavorableVet && score.qbCapHitPercent < 13) {
      alerts.push({
        teamId: score.teamId,
        type: "positive",
        message: `${contract.playerName} at ${score.qbCapHitPercent.toFixed(2)}%. Window FAVORABLE through 2027.`,
        timestamp: new Date().toISOString(),
      });
    }
    // YELLOW: QBs with escalating contracts (but not bridge QBs, not PHI, not favorable vets)
    else if (!isBridgeQB && !noWarnings && !isFavorableVet && score.qbCapHitPercent < 10 && score.yearsUntilThreshold <= 2 && yearsRemaining >= 2) {
      // Find next year's cap hit %
      const nextYearHit = contract.capHits.find(h => h.year === 2026);
      if (nextYearHit) {
        const nextYearPct = (nextYearHit.amount / (CURRENT_CAP * 1.085)) * 100;
        if (nextYearPct > score.qbCapHitPercent + 3) {
          alerts.push({
            teamId: score.teamId,
            type: "warning",
            message: `${contract.playerName} at ${score.qbCapHitPercent.toFixed(2)}% now, escalates to ${nextYearPct.toFixed(2)}% in 2026. Clock is ticking.`,
            timestamp: new Date().toISOString(),
          });
        }
      }
    }
    // ORANGE: QBs between 10-15% with escalating contracts (but not favorable vets)
    else if (!isFavorableVet && score.qbCapHitPercent >= 10 && score.qbCapHitPercent < 15) {
      const yearsLeft = score.yearsUntilThreshold;
      alerts.push({
        teamId: score.teamId,
        type: "warning",
        message: `${contract.playerName} at ${score.qbCapHitPercent.toFixed(2)}%. Window closing${yearsLeft > 0 ? ` - ${yearsLeft} year${yearsLeft === 1 ? '' : 's'} until threshold.` : '.'}`,
        timestamp: new Date().toISOString(),
      });
    }
    // RED: QBs over 15%
    else if (score.qbCapHitPercent >= 15) {
      const isDisaster = score.qbCapHitPercent >= 25;
      alerts.push({
        teamId: score.teamId,
        type: "danger",
        message: isDisaster
          ? `${contract.playerName} at ${score.qbCapHitPercent.toFixed(2)}%. DISASTER - worst contract situation in NFL.`
          : `${contract.playerName} at ${score.qbCapHitPercent.toFixed(2)}%. Championship window CLOSED.`,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Sort: positive first, then warning, then danger
  const sortOrder = { positive: 0, warning: 1, danger: 2 };
  alerts.sort((a, b) => sortOrder[a.type] - sortOrder[b.type]);

  return alerts.slice(0, 12); // Top 12 alerts
}

// Helper: Estimate QB age based on player ID (simplified)
function getQBAgeEstimate(playerId: string): number {
  const ageMap: Record<string, number> = {
    "jayden-daniels": 24,
    "bo-nix": 25,
    "caleb-williams": 23,
    "drake-maye": 22,
    "brock-purdy": 25,
    "jalen-hurts": 26,
    "jordan-love": 26,
    "cj-stroud": 23,
    "bryce-young": 24,
    "patrick-mahomes": 29,
    "josh-allen": 29,
    "lamar-jackson": 28,
    "joe-burrow": 28,
    "justin-herbert": 27,
    "jared-goff": 30,
    "dak-prescott": 31,
    "matthew-stafford": 37,
    "aaron-rodgers": 41,
    "russell-wilson": 36,
    "kirk-cousins": 36,
    "derek-carr": 34,
    "trevor-lawrence": 25,
    "tua-tagovailoa": 27,
    "deshaun-watson": 29,
    "kyler-murray": 27,
    "baker-mayfield": 29,
    "geno-smith": 34,
    "anthony-richardson": 22,
    "will-levis": 25,
    "daniel-jones": 27,
    "sam-darnold": 28,
    "aidan-oconnell": 26,
  };
  return ageMap[playerId] || 27;
}

// Helper: Get 2025 playoff results (based on spec)
function get2025PlayoffRound(teamId: string): number {
  const results: Record<string, number> = {
    PHI: 5, // Super Bowl Champion
    KC: 4, // Super Bowl Loser
    WAS: 3, // Conference Championship
    BUF: 3, // Conference Championship
    DET: 2, // Divisional
    LAR: 2, // Divisional
    DEN: 2, // Divisional
    GB: 2, // Divisional
    MIN: 1, // Wild Card
    TB: 1, // Wild Card
    HOU: 1, // Wild Card
    PIT: 1, // Wild Card
    LAC: 1, // Wild Card
    BAL: 0, // Missed (injured)
    SF: 2, // Divisional
    // All others missed playoffs
  };
  return results[teamId] || 0;
}

// Get top teams by window score
export function getTopTeamsByWindow(limit: number = 10): TeamWindowScore[] {
  return getAllWindowScores().slice(0, limit);
}

// Get teams in each zone
export function getTeamsByZone(): Record<string, TeamWindowScore[]> {
  const scores = getAllWindowScores();
  const zones: Record<string, TeamWindowScore[]> = {
    ELITE: [],
    FAVORABLE: [],
    CAUTION: [],
    DANGER: [],
    CLOSED: [],
  };

  for (const score of scores) {
    const zone = getZoneType(score.qbCapHitPercent);
    zones[zone].push(score);
  }

  return zones;
}

// Get historical comparison for a team
export function getHistoricalComparison(qbCapHitPercent: number): {
  similarWinners: typeof historical.superBowlWinners;
  avgWinnersCapHit: number;
} {
  const tolerance = 2; // +/- 2%
  const similarWinners = historical.superBowlWinners.filter(
    (w) =>
      Math.abs(w.qbCapHitPercent - qbCapHitPercent) <= tolerance
  );

  const avgWinnersCapHit = historical.analysisMetrics.sbWinnersAvgCapHitPercent || 7.8;

  return { similarWinners, avgWinnersCapHit };
}

// Playoff results data types
export interface PlayoffSeasonTeam {
  teamId: string;
  qbCapPct: number;
  result: number;
  note: string;
}

export interface PlayoffSeason {
  label: string;
  inProgress: boolean;
  sbWinner: string | null;
  sbLoser: string | null;
  teams: PlayoffSeasonTeam[];
}

// Get available seasons for dropdown
export function getAvailableSeasons(): { year: number; label: string; inProgress: boolean }[] {
  const seasons = playoffResultsData.seasons as Record<string, PlayoffSeason>;
  return Object.entries(seasons)
    .map(([year, data]) => ({
      year: parseInt(year),
      label: data.label,
      inProgress: data.inProgress,
    }))
    .sort((a, b) => b.year - a.year);
}

// Get scatter plot data for a specific season
export function getScatterDataBySeason(year: number): ScatterDataPoint[] {
  const seasons = playoffResultsData.seasons as Record<string, PlayoffSeason>;
  const seasonData = seasons[year.toString()];

  if (!seasonData) return [];

  const data: ScatterDataPoint[] = [];

  for (const teamResult of seasonData.teams) {
    const team = getTeamById(teamResult.teamId);
    if (!team) continue;

    // Find QB name from contracts (best effort - may not match historical QB)
    const contract = getQBContractByTeamId(teamResult.teamId);
    const qbName = contract?.playerName || "Unknown QB";

    data.push({
      teamId: teamResult.teamId,
      teamName: team.name,
      qbName,
      qbCapHitPercent: teamResult.qbCapPct,
      playoffRound: teamResult.result,
      windowZone: getZoneType(teamResult.qbCapPct),
      color: getZoneColor(teamResult.qbCapPct),
    });
  }

  return data;
}

// Get season info (SB winner/loser, in progress status)
export function getSeasonInfo(year: number): { sbWinner: string | null; sbLoser: string | null; inProgress: boolean } | null {
  const seasons = playoffResultsData.seasons as Record<string, PlayoffSeason>;
  const seasonData = seasons[year.toString()];

  if (!seasonData) return null;

  return {
    sbWinner: seasonData.sbWinner,
    sbLoser: seasonData.sbLoser,
    inProgress: seasonData.inProgress,
  };
}
