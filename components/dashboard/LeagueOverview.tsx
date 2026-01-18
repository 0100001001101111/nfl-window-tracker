"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { ScatterPlot } from "@/components/charts";
import { getScatterDataBySeason, getAvailableSeasons, getSeasonInfo } from "@/lib/data";

export function LeagueOverview() {
  const router = useRouter();
  const [selectedSeason, setSelectedSeason] = useState(2025);

  const seasons = getAvailableSeasons();
  const seasonInfo = getSeasonInfo(selectedSeason);
  const data = getScatterDataBySeason(selectedSeason);

  const handleTeamClick = (teamId: string) => {
    router.push(`/team/${teamId}`);
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle>THE THRESHOLD: 13%</CardTitle>
            <span className="text-xs text-text-muted font-mono">
              QB Cap Hit % vs {selectedSeason} Playoff Result
              {seasonInfo?.inProgress && (
                <span className="ml-2 px-1.5 py-0.5 bg-window-caution/20 text-window-caution rounded text-[10px] font-bold">
                  LIVE
                </span>
              )}
            </span>
          </div>
          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(parseInt(e.target.value))}
            className="bg-card border border-border rounded px-3 py-1.5 text-sm font-mono text-text-primary focus:outline-none focus:ring-2 focus:ring-window-elite"
          >
            {seasons.map((s) => (
              <option key={s.year} value={s.year}>
                {s.year} {s.inProgress ? "(In Progress)" : ""}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-text-secondary">
            Teams <span className="text-window-elite font-bold">UNDER 10%</span> win championships.
            Teams <span className="text-window-closed font-bold">OVER 15%</span> don&apos;t.
            Everything else is noise.
          </p>
        </div>

        <ScatterPlot data={data} selectedYear={selectedSeason} sbWinner={seasonInfo?.sbWinner || null} onTeamClick={handleTeamClick} />

        <div className="flex items-center justify-center gap-6 mt-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-window-elite" />
            <span className="text-text-muted">ELITE (&lt;6%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-window-favorable" />
            <span className="text-text-muted">FAVORABLE (6-10%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-window-caution" />
            <span className="text-text-muted">CAUTION (10-13%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-window-danger" />
            <span className="text-text-muted">DANGER (13-16%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-window-closed" />
            <span className="text-text-muted">CLOSED (&gt;16%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
