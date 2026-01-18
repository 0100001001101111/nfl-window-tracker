"use client";

import { TeamWindowScore, Team, QBContract } from "@/types";
import { Card, CardContent, Badge, getZoneBadgeVariant, ProgressBar } from "@/components/ui";
import { formatCurrency, formatYears, formatPercent } from "@/lib/utils/formatting";

interface WindowScoreDisplayProps {
  score: TeamWindowScore;
  team: Team;
  contract: QBContract;
}

export function WindowScoreDisplay({ score, team, contract }: WindowScoreDisplayProps) {
  return (
    <Card className="col-span-full lg:col-span-2">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <p className="text-xs font-mono uppercase tracking-wider text-text-muted mb-2">
            THE NUMBER THAT MATTERS
          </p>
          <p
            className="text-6xl font-mono font-bold"
            style={{ color: score.windowZone.color }}
          >
            {score.qbCapHitPercent.toFixed(1)}%
          </p>
          <p className="text-lg text-text-secondary mt-1">
            QB Cap Hit
          </p>
        </div>

        <ProgressBar
          value={score.qbCapHitPercent}
          max={25}
          showThresholds={true}
          height="lg"
        />

        <div className="mt-6 text-center">
          <Badge
            variant={getZoneBadgeVariant(score.windowZone.zone)}
            size="lg"
          >
            {score.windowZone.label}
          </Badge>
        </div>

        <div className="mt-6 p-4 bg-background rounded-lg">
          <p className="text-sm text-text-secondary">
            {score.windowZone.description}
          </p>
          <p className="text-xs text-text-muted mt-2 font-mono">
            Historical: {score.windowZone.historicalWinRate}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="p-3 bg-background rounded">
            <p className="text-xs font-mono text-text-muted">CAP HIT</p>
            <p className="text-lg font-mono font-bold text-text-primary">
              {formatCurrency(score.qbCapHit)}
            </p>
          </div>
          <div className="p-3 bg-background rounded">
            <p className="text-xs font-mono text-text-muted">SALARY CAP</p>
            <p className="text-lg font-mono font-bold text-text-primary">
              {formatCurrency(score.salaryCap)}
            </p>
          </div>
          <div className="p-3 bg-background rounded">
            <p className="text-xs font-mono text-text-muted">YEARS TO 13%</p>
            <p
              className={`text-lg font-mono font-bold ${
                score.yearsUntilThreshold === 0
                  ? "text-window-closed"
                  : score.yearsUntilThreshold >= 3
                  ? "text-window-elite"
                  : "text-window-caution"
              }`}
            >
              {score.yearsUntilThreshold === 0 ? "PAST" : formatYears(score.yearsUntilThreshold)}
            </p>
          </div>
          <div className="p-3 bg-background rounded">
            <p className="text-xs font-mono text-text-muted">CONTRACT</p>
            <p className="text-lg font-mono font-bold text-text-primary">
              {contract.yearsRemaining}yr left
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
