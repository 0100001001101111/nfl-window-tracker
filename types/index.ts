// Core Team Data
export interface Team {
  id: string; // e.g., "PHI"
  name: string; // "Philadelphia Eagles"
  city: string;
  mascot: string;
  conference: "AFC" | "NFC";
  division: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
}

// QB Contract Details
export interface CapHitYear {
  year: number;
  amount: number;
  baseSalary: number;
  signingBonus: number;
  otherBonuses: number;
  isVoidYear: boolean;
  deadMoneyIfCut?: number;
  isFifthYearOption?: boolean;
}

export interface PerformanceMetrics {
  epaPerPlay: number;
  cpoe: number;
  qbr: number;
  pffGrade: number;
  wins: number;
  playoffWins: number;
}

export interface QBContract {
  playerId: string;
  playerName: string;
  teamId: string;
  contractType: "rookie" | "rookie_5th_year" | "veteran" | "veteran_backloaded" | "veteran_market" | "veteran_discount" | "trade_acquisition" | "franchise_tag";
  totalValue: number;
  aav: number;
  guaranteedMoney: number;
  guaranteedAtSigning: number;
  signedDate: string;
  yearsTotal: number;
  yearsRemaining: number;
  hasNoTradeClause: boolean;
  capHits: CapHitYear[];
  performanceMetrics?: PerformanceMetrics;
}

// Window Status Types
export type WindowZoneType = "ELITE" | "FAVORABLE" | "CAUTION" | "DANGER" | "CLOSED";
export type WindowStatusType = "wide_open" | "open" | "closing" | "soft_closed" | "hard_closed";

export interface WindowZone {
  zone: WindowZoneType;
  color: string;
  label: string;
  description: string;
  historicalWinRate: string;
}

export interface WindowStatus {
  status: WindowStatusType;
  color: string;
  label: string;
}

// Team Window Score (calculated values)
export interface TeamWindowScore {
  teamId: string;
  overallScore: number; // 0-100, higher = more open window

  // Component scores (each 0-100)
  qbCapScore: number;
  qbQualityScore: number; // QB performance quality
  surplusScore: number;
  trajectoryScore: number;
  sustainabilityScore: number;
  coreScore: number;

  // Raw metrics
  qbCapHitPercent: number;
  qbCapHit: number;
  salaryCap: number;
  yearsUntilThreshold: number;

  // Derived values
  windowZone: WindowZone;
  windowStatus: WindowStatus;

  // Metadata
  updatedAt: string;
}

// Non-QB Surplus Value (Rams exception logic)
export interface RookieContractStar {
  playerId: string;
  playerName: string;
  position: string;
  teamId: string;
  draftYear: number;
  draftRound: number;
  draftPick: number;
  currentYearCapHit: number;
  estimatedMarketValue: number;
  surplusValue: number;
  yearsRemainingOnRookie: number;
  extensionEligibleYear: number;
  pffGrade: number;
  isProBowler: boolean;
  isAllPro: boolean;
}

export interface NonQBSurplusResult {
  totalSurplus: number;
  starRookies: RookieContractStar[];
  sustainabilityYears: number;
  surplusAsPercentOfCap: number;
}

// Historical Data
export interface SuperBowlEntry {
  year: number;
  teamId: string;
  qbName: string;
  qbCapHit: number;
  salaryCap: number;
  qbCapHitPercent: number;
  contractType: string;
  contractYear?: number;
  qbAge?: number;
  qbDrafted?: string;
  yearsWithTeam?: number;
  note?: string;
}

export interface ConferenceChampionshipQB {
  teamId: string;
  conference: "AFC" | "NFC";
  qbName: string;
  qbCapHit: number;
  salaryCap: number;
  qbCapHitPercent: number;
  contractType: string;
  result: "won_superbowl" | "lost_superbowl" | "lost_conference" | "lost_divisional" | "lost_wildcard";
  note?: string;
}

export interface ConferenceChampionshipYear {
  year: number;
  qbs: ConferenceChampionshipQB[];
}

export interface ThresholdZone {
  label: string;
  playoffRate: number;
  sbAppearanceRate: number;
  championshipRate: number;
}

export interface HistoricalData {
  superBowlWinners: SuperBowlEntry[];
  superBowlLosers: SuperBowlEntry[];
  conferenceChampionshipQBs: ConferenceChampionshipYear[];
  analysisMetrics: {
    sbWinnersAvgCapHitPercent: number | null;
    sbLosersAvgCapHitPercent: number | null;
    confChampAvgCapHitPercent: number | null;
    correlationCoefficient: number | null;
    keyInsight?: string;
  };
  thresholdAnalysis: {
    zones: Record<string, ThresholdZone>;
  };
}

// Salary Cap Data
export interface SalaryCapYear {
  year: number;
  cap: number;
  note?: string;
  growthRate?: number;
}

export interface SalaryCapData {
  historical: SalaryCapYear[];
  projected: SalaryCapYear[];
  assumptions: {
    baseGrowthRate: number;
    source: string;
  };
}

// Alert Types
export interface WindowAlert {
  teamId: string;
  type: "positive" | "warning" | "danger";
  message: string;
  timestamp: string;
}

// Chart Data Types
export interface ScatterDataPoint {
  teamId: string;
  teamName: string;
  qbName: string;
  qbCapHitPercent: number;
  playoffRound: number; // 0=missed, 1=WC, 2=Div, 3=Conf, 4=SB loss, 5=SB win
  windowZone: WindowZoneType;
  color: string;
}

export interface CapProjectionDataPoint {
  year: number;
  capHitPercent: number;
  capHitAmount: number;
  projectedCap: number;
  isProjected: boolean;
}

// Market Value Benchmarks
export interface MarketValueBenchmark {
  elite: number;
  good: number;
  average: number;
}

export type PositionBenchmarks = Record<string, MarketValueBenchmark>;

// Constants
export const CURRENT_YEAR = 2025;
export const CURRENT_CAP = 279_200_000;
export const CAP_GROWTH_RATE = 0.085;
export const DANGER_THRESHOLD = 13;
export const CLOSED_THRESHOLD = 16;

// Position types for roster efficiency
export type Position = "QB" | "OL" | "DL" | "WR" | "CB" | "LB" | "RB" | "TE" | "S" | "EDGE" | "OT" | "OG" | "C" | "DT";
