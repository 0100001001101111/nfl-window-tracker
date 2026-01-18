"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { HistoricalBarChart } from "@/components/charts";
import { historical } from "@/lib/data";

export function HistoricalProof() {
  const winners = historical.superBowlWinners.slice(0, 10); // Last 10

  return (
    <Card>
      <CardHeader>
        <CardTitle>THE PROOF: LAST 10 SUPER BOWL WINNERS</CardTitle>
      </CardHeader>
      <CardContent>
        <HistoricalBarChart data={winners} />

        <div className="mt-4 p-3 bg-window-elite/10 rounded border border-window-elite/20">
          <p className="text-sm text-text-primary">
            <span className="font-mono font-bold text-window-elite">
              AVERAGE QB CAP HIT % FOR SB WINNERS: {historical.analysisMetrics.sbWinnersAvgCapHitPercent}%
            </span>
          </p>
          <p className="text-xs text-text-muted mt-1">
            {historical.analysisMetrics.keyInsight}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
