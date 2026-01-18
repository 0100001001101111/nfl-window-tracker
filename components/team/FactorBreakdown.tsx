"use client";

import { TeamWindowScore } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";

interface FactorBreakdownProps {
  score: TeamWindowScore;
}

interface FactorBarProps {
  label: string;
  value: number;
  weight: string;
  color: string;
}

function FactorBar({ label, value, weight, color }: FactorBarProps) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-text-secondary">
          {label} <span className="text-text-muted">({weight})</span>
        </span>
        <span className="font-mono" style={{ color }}>
          {value.toFixed(0)}/100
        </span>
      </div>
      <div className="h-2 bg-border rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${value}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

export function FactorBreakdown({ score }: FactorBreakdownProps) {
  const factors = [
    {
      label: "QB Cap Hit %",
      value: score.qbCapScore,
      weight: "45%",
      color: score.windowZone.color,
    },
    {
      label: "Trajectory",
      value: score.trajectoryScore,
      weight: "20%",
      color:
        score.trajectoryScore > 60
          ? "#00ff88"
          : score.trajectoryScore > 30
          ? "#ffaa00"
          : "#ff4444",
    },
    {
      label: "Non-QB Surplus",
      value: score.surplusScore,
      weight: "20%",
      color:
        score.surplusScore > 50
          ? "#00ff88"
          : score.surplusScore > 20
          ? "#ffaa00"
          : "#6b7280",
    },
    {
      label: "Sustainability",
      value: score.sustainabilityScore,
      weight: "10%",
      color:
        score.sustainabilityScore > 60
          ? "#00ff88"
          : score.sustainabilityScore > 30
          ? "#ffaa00"
          : "#ff4444",
    },
    {
      label: "Core Health",
      value: score.coreScore,
      weight: "5%",
      color:
        score.coreScore > 70
          ? "#00ff88"
          : score.coreScore > 50
          ? "#ffaa00"
          : "#ff4444",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>WINDOW HEALTH SCORE</CardTitle>
          <span
            className="text-2xl font-mono font-bold"
            style={{ color: score.windowStatus.color }}
          >
            {score.overallScore.toFixed(0)}/100
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {factors.map((factor) => (
            <FactorBar key={factor.label} {...factor} />
          ))}
        </div>

        <div className="mt-4 p-3 bg-background rounded text-xs text-text-muted">
          <p>
            Note: Composite score is secondary to QB Cap Hit %. Used for
            comparing teams with similar cap situations.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
