"use client";

import { Card, CardContent } from "@/components/ui";
import { getTeamsByZone, getQBContractByTeamId } from "@/lib/data";

export function QuickStats() {
  const zoneData = getTeamsByZone();
  const phiContract = getQBContractByTeamId("PHI");
  const phiCapHit = phiContract?.capHits.find(h => h.year === 2025);
  const phiCapPercent = phiCapHit ? ((phiCapHit.amount / 279_200_000) * 100).toFixed(2) : "5.30";

  // Elite = ELITE + FAVORABLE (under 10%)
  const eliteCount = zoneData.ELITE.length + zoneData.FAVORABLE.length;
  // Closing = CAUTION + DANGER (10-16%)
  const closingCount = zoneData.CAUTION.length + zoneData.DANGER.length;
  // Closed = CLOSED (over 16%)
  const closedCount = zoneData.CLOSED.length;

  const stats = [
    {
      label: "OPEN WINDOWS",
      value: eliteCount,
      subtext: "Teams under 10%",
      color: "text-window-elite",
      bgColor: "bg-window-elite/10",
    },
    {
      label: "WINDOWS CLOSING",
      value: closingCount,
      subtext: "Teams 10-15%",
      color: "text-window-caution",
      bgColor: "bg-window-caution/10",
    },
    {
      label: "WINDOWS CLOSED",
      value: closedCount,
      subtext: "Teams over 15%",
      color: "text-window-closed",
      bgColor: "bg-window-closed/10",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Super Bowl Champion Hero */}
      <Card className="bg-gradient-to-r from-[#004C54]/20 to-[#A5ACAF]/20 border-2 border-[#004C54]">
        <CardContent className="py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🏆</div>
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-[#A5ACAF] mb-1">
                  SUPER BOWL 59 CHAMPION
                </p>
                <h2 className="text-2xl font-mono font-bold text-white">
                  PHILADELPHIA EAGLES
                </h2>
                <p className="text-lg font-mono text-window-elite">
                  Jalen Hurts at {phiCapPercent}% cap hit
                </p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-text-secondary italic max-w-xs">
                "Thesis validated. Cheap QB wins championship."
              </p>
              <p className="text-xs text-text-muted mt-2">
                All 10 of last 10 SB winners under 13% QB cap hit
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className={stat.bgColor}>
            <CardContent>
              <p className="text-xs font-mono uppercase tracking-wider text-text-muted mb-1">
                {stat.label}
              </p>
              <p className={`text-3xl font-mono font-bold ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-xs text-text-muted mt-1">{stat.subtext}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
