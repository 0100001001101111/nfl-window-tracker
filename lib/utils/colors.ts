import { WindowZoneType, WindowStatusType } from "@/types";

/**
 * Window zone colors matching the spec
 */
export const ZONE_COLORS: Record<WindowZoneType, string> = {
  ELITE: "#00ff88",
  FAVORABLE: "#88ff00",
  CAUTION: "#ffaa00",
  DANGER: "#ff6600",
  CLOSED: "#ff4444",
};

/**
 * Window status colors
 */
export const STATUS_COLORS: Record<WindowStatusType, string> = {
  wide_open: "#00ff88",
  open: "#88ff00",
  closing: "#ffaa00",
  soft_closed: "#ff6600",
  hard_closed: "#ff4444",
};

/**
 * Get color for a given cap hit percentage
 */
export function getCapHitColor(capHitPercent: number): string {
  if (capHitPercent < 6) return ZONE_COLORS.ELITE;
  if (capHitPercent < 10) return ZONE_COLORS.FAVORABLE;
  if (capHitPercent < 13) return ZONE_COLORS.CAUTION;
  if (capHitPercent < 16) return ZONE_COLORS.DANGER;
  return ZONE_COLORS.CLOSED;
}

/**
 * Get zone type from cap hit percentage
 */
export function getZoneFromCapHit(capHitPercent: number): WindowZoneType {
  if (capHitPercent < 6) return "ELITE";
  if (capHitPercent < 10) return "FAVORABLE";
  if (capHitPercent < 13) return "CAUTION";
  if (capHitPercent < 16) return "DANGER";
  return "CLOSED";
}

/**
 * Get background color class for zone
 */
export function getZoneBgClass(zone: WindowZoneType): string {
  const classes: Record<WindowZoneType, string> = {
    ELITE: "bg-window-elite/10",
    FAVORABLE: "bg-window-favorable/10",
    CAUTION: "bg-window-caution/10",
    DANGER: "bg-window-danger/10",
    CLOSED: "bg-window-closed/10",
  };
  return classes[zone];
}

/**
 * Get text color class for zone
 */
export function getZoneTextClass(zone: WindowZoneType): string {
  const classes: Record<WindowZoneType, string> = {
    ELITE: "text-window-elite",
    FAVORABLE: "text-window-favorable",
    CAUTION: "text-window-caution",
    DANGER: "text-window-danger",
    CLOSED: "text-window-closed",
  };
  return classes[zone];
}

/**
 * Get border color class for zone
 */
export function getZoneBorderClass(zone: WindowZoneType): string {
  const classes: Record<WindowZoneType, string> = {
    ELITE: "border-window-elite/30",
    FAVORABLE: "border-window-favorable/30",
    CAUTION: "border-window-caution/30",
    DANGER: "border-window-danger/30",
    CLOSED: "border-window-closed/30",
  };
  return classes[zone];
}

/**
 * Get gradient for progress bar based on cap hit
 */
export function getProgressGradient(capHitPercent: number): string {
  // Create a gradient that shows the threshold zones
  return `linear-gradient(to right,
    ${ZONE_COLORS.ELITE} 0%,
    ${ZONE_COLORS.ELITE} 30%,
    ${ZONE_COLORS.FAVORABLE} 30%,
    ${ZONE_COLORS.FAVORABLE} 50%,
    ${ZONE_COLORS.CAUTION} 50%,
    ${ZONE_COLORS.CAUTION} 65%,
    ${ZONE_COLORS.DANGER} 65%,
    ${ZONE_COLORS.DANGER} 80%,
    ${ZONE_COLORS.CLOSED} 80%,
    ${ZONE_COLORS.CLOSED} 100%
  )`;
}

/**
 * NFL Team Colors
 */
export const TEAM_COLORS: Record<string, { primary: string; secondary: string }> = {
  ARI: { primary: "#97233F", secondary: "#000000" },
  ATL: { primary: "#A71930", secondary: "#000000" },
  BAL: { primary: "#241773", secondary: "#000000" },
  BUF: { primary: "#00338D", secondary: "#C60C30" },
  CAR: { primary: "#0085CA", secondary: "#101820" },
  CHI: { primary: "#0B162A", secondary: "#C83803" },
  CIN: { primary: "#FB4F14", secondary: "#000000" },
  CLE: { primary: "#311D00", secondary: "#FF3C00" },
  DAL: { primary: "#003594", secondary: "#869397" },
  DEN: { primary: "#FB4F14", secondary: "#002244" },
  DET: { primary: "#0076B6", secondary: "#B0B7BC" },
  GB: { primary: "#203731", secondary: "#FFB612" },
  HOU: { primary: "#03202F", secondary: "#A71930" },
  IND: { primary: "#002C5F", secondary: "#A2AAAD" },
  JAX: { primary: "#006778", secondary: "#D7A22A" },
  KC: { primary: "#E31837", secondary: "#FFB81C" },
  LV: { primary: "#000000", secondary: "#A5ACAF" },
  LAC: { primary: "#0080C6", secondary: "#FFC20E" },
  LAR: { primary: "#003594", secondary: "#FFA300" },
  MIA: { primary: "#008E97", secondary: "#FC4C02" },
  MIN: { primary: "#4F2683", secondary: "#FFC62F" },
  NE: { primary: "#002244", secondary: "#C60C30" },
  NO: { primary: "#D3BC8D", secondary: "#101820" },
  NYG: { primary: "#0B2265", secondary: "#A71930" },
  NYJ: { primary: "#125740", secondary: "#000000" },
  PHI: { primary: "#004C54", secondary: "#A5ACAF" },
  PIT: { primary: "#FFB612", secondary: "#101820" },
  SF: { primary: "#AA0000", secondary: "#B3995D" },
  SEA: { primary: "#002244", secondary: "#69BE28" },
  TB: { primary: "#D50A0A", secondary: "#34302B" },
  TEN: { primary: "#0C2340", secondary: "#4B92DB" },
  WAS: { primary: "#5A1414", secondary: "#FFB612" },
};

/**
 * Get team primary color
 */
export function getTeamColor(teamId: string): string {
  return TEAM_COLORS[teamId]?.primary || "#6b7280";
}

/**
 * Darken a hex color
 */
export function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const G = ((num >> 8) & 0x00ff) - amt;
  const B = (num & 0x0000ff) - amt;
  return `#${(
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  )
    .toString(16)
    .slice(1)}`;
}
