"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
  getZoneBadgeVariant,
} from "@/components/ui";
import { getAllWindowScores, getTeamById, getQBContractByTeamId, getTeamSeasonResult } from "@/lib/data";
import { CURRENT_CAP } from "@/types";

// Projected salary caps (8.5% annual growth)
const PROJECTED_CAPS = {
  2025: CURRENT_CAP,
  2026: Math.round(CURRENT_CAP * 1.085),
  2027: Math.round(CURRENT_CAP * 1.177),
};

// Get cap percentage for a specific year with styling info
function getCapPctForYear(
  teamId: string,
  year: 2025 | 2026 | 2027
): { pct: number | null; display: string; color: string; tooltip: string } {
  const contract = getQBContractByTeamId(teamId);
  if (!contract) return { pct: null, display: "-", color: "text-text-muted", tooltip: "No contract data" };

  const capHit = contract.capHits.find(h => h.year === year);
  const projectedCap = PROJECTED_CAPS[year];

  if (!capHit) {
    const maxYear = Math.max(...contract.capHits.map(h => h.year));
    if (year > maxYear) {
      return { pct: null, display: "FA", color: "text-text-muted", tooltip: "Free agent" };
    }
    return { pct: null, display: "-", color: "text-text-muted", tooltip: "No data" };
  }

  const pct = (capHit.amount / projectedCap) * 100;
  const isFifthYear = capHit.isFifthYearOption || false;

  let color = "text-text-primary";
  if (pct >= 15) color = "text-window-closed";
  else if (pct >= 13) color = "text-window-caution";

  const capHitM = (capHit.amount / 1_000_000).toFixed(1);
  const tooltip = `$${capHitM}M (${pct.toFixed(2)}%)${isFifthYear ? " - 5th year option" : ""}`;

  return {
    pct,
    display: `${pct.toFixed(1)}%${isFifthYear ? "*" : ""}`,
    color,
    tooltip,
  };
}

export function WindowRankings() {
  const router = useRouter();
  const scores = getAllWindowScores();

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>WINDOW RANKINGS</CardTitle>
        <span className="text-xs text-text-muted font-mono">
          Multi-factor score: Team Success (30%) + Cap % (25%) + Coach (20%) + Window (15%) + QB Production (10%)
        </span>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow hover={false}>
              <TableHead className="w-8">RK</TableHead>
              <TableHead className="w-16">TEAM</TableHead>
              <TableHead>QB</TableHead>
              <TableHead align="center" className="w-16">RECORD</TableHead>
              <TableHead align="right" className="w-16">2025 CAP</TableHead>
              <TableHead align="right" className="w-14 hidden md:table-cell">2026</TableHead>
              <TableHead align="right" className="w-14 hidden lg:table-cell">2027</TableHead>
              <TableHead align="center" className="w-20">ZONE</TableHead>
              <TableHead align="right" className="w-14">SCORE</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scores.map((score, index) => {
              const team = getTeamById(score.teamId);
              const contract = getQBContractByTeamId(score.teamId);
              const seasonResult = getTeamSeasonResult(score.teamId);
              if (!team || !contract) return null;

              const cap2025 = getCapPctForYear(score.teamId, 2025);
              const cap2026 = getCapPctForYear(score.teamId, 2026);
              const cap2027 = getCapPctForYear(score.teamId, 2027);

              // Format record
              const record = seasonResult ? `${seasonResult.wins}-${seasonResult.losses}` : "-";
              const recordColor = seasonResult
                ? seasonResult.wins >= 12
                  ? "text-window-elite"
                  : seasonResult.wins >= 10
                  ? "text-window-favorable"
                  : seasonResult.wins >= 8
                  ? "text-text-primary"
                  : "text-window-danger"
                : "text-text-muted";

              // Build score tooltip
              const scoreTooltip = seasonResult
                ? `Team Success: ${seasonResult.wins}W + playoffs\nCap Hit: ${cap2025.display}\nCoach: ${seasonResult.coachName} (${seasonResult.coachTier}/20)\nQB Production: ${seasonResult.qbProductionTier}/10`
                : "Score breakdown unavailable";

              return (
                <TableRow
                  key={score.teamId}
                  onClick={() => router.push(`/team/${score.teamId}`)}
                >
                  <TableCell className="font-mono text-text-muted text-sm">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-1 h-4 rounded"
                        style={{ backgroundColor: team.primaryColor }}
                      />
                      <span className="font-medium text-text-primary text-sm">
                        {team.id}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-text-secondary text-sm truncate max-w-[100px]">
                    {contract.playerName}
                  </TableCell>

                  {/* 2025 Record */}
                  <TableCell align="center">
                    <span
                      className={`font-mono text-sm font-bold ${recordColor}`}
                      title={seasonResult ? `${seasonResult.coachName}${seasonResult.madePlayoffs ? " | Playoffs" : ""}` : ""}
                    >
                      {record}
                    </span>
                  </TableCell>

                  {/* 2025 Cap % */}
                  <TableCell align="right">
                    <span
                      className={`font-mono text-sm font-bold ${cap2025.color}`}
                      title={cap2025.tooltip}
                    >
                      {cap2025.display}
                    </span>
                  </TableCell>

                  {/* 2026 Cap % */}
                  <TableCell align="right" className="hidden md:table-cell">
                    <span
                      className={`font-mono text-sm ${cap2026.pct !== null && cap2026.pct >= 13 ? "font-bold" : ""} ${cap2026.color}`}
                      title={cap2026.tooltip}
                    >
                      {cap2026.display}
                    </span>
                  </TableCell>

                  {/* 2027 Cap % */}
                  <TableCell align="right" className="hidden lg:table-cell">
                    <span
                      className={`font-mono text-sm ${cap2027.pct !== null && cap2027.pct >= 13 ? "font-bold" : ""} ${cap2027.color}`}
                      title={cap2027.tooltip}
                    >
                      {cap2027.display}
                    </span>
                  </TableCell>

                  <TableCell align="center">
                    <Badge
                      variant={getZoneBadgeVariant(score.windowZone.zone)}
                      size="sm"
                    >
                      {score.windowZone.zone}
                    </Badge>
                  </TableCell>
                  <TableCell align="right">
                    <span
                      className="font-mono font-bold text-text-primary text-sm"
                      title={scoreTooltip}
                    >
                      {score.overallScore}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 mt-4 text-xs font-mono text-text-muted">
          <span>* = 5th year option</span>
          <span>FA = Free agent</span>
          <span className="text-window-caution">Orange = 13%+</span>
          <span className="text-window-closed">Red = 15%+</span>
        </div>
      </CardContent>
    </Card>
  );
}
