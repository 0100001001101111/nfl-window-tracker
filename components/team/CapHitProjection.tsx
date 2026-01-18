"use client";

import { QBContract } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { CapProjectionChart } from "@/components/charts";
import { generateCapProjection, findThresholdCrossYear, calculatePeakCapHit } from "@/lib/calculations/trajectory";
import { formatCurrency, formatPercent } from "@/lib/utils/formatting";

interface CapHitProjectionProps {
  contract: QBContract;
  teamName: string;
}

export function CapHitProjection({ contract, teamName }: CapHitProjectionProps) {
  const projectionData = generateCapProjection(contract);
  const thresholdYear = findThresholdCrossYear(contract);
  const peakCapHit = calculatePeakCapHit(contract);

  return (
    <Card>
      <CardHeader>
        <CardTitle>CAP HIT PROJECTION (% OF CAP)</CardTitle>
      </CardHeader>
      <CardContent>
        <CapProjectionChart data={projectionData} teamName={teamName} />

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="p-3 bg-background rounded">
            <p className="text-xs font-mono text-text-muted">CROSSES 13% IN</p>
            <p
              className={`text-lg font-mono font-bold ${
                thresholdYear
                  ? thresholdYear <= 2026
                    ? "text-window-closed"
                    : "text-window-caution"
                  : "text-window-elite"
              }`}
            >
              {thresholdYear || "Never (through contract)"}
            </p>
          </div>
          <div className="p-3 bg-background rounded">
            <p className="text-xs font-mono text-text-muted">PEAK CAP HIT</p>
            <p className="text-lg font-mono font-bold text-text-primary">
              {formatPercent(peakCapHit.percent)} in {peakCapHit.year}
            </p>
            <p className="text-xs text-text-muted">
              {formatCurrency(peakCapHit.amount)}
            </p>
          </div>
        </div>

        {thresholdYear && thresholdYear <= 2027 && (
          <div className="mt-4 p-3 bg-window-caution/10 border border-window-caution/30 rounded">
            <p className="text-sm text-window-caution font-mono">
              ⚠️ {contract.playerName} NEVER drops below 13% threshold through {Math.max(...contract.capHits.filter(c => !c.isVoidYear).map(c => c.year))}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
