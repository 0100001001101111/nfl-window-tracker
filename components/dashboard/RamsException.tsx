"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";

/**
 * THE RAMS EXCEPTION
 *
 * Matthew Stafford at 17.01% should mean window CLOSED.
 * But LAR made the playoffs with a Divisional Round appearance.
 *
 * Why? Massive non-QB surplus value from elite rookies:
 * - Puka Nacua: $1.1M (worth $20M+ on market)
 * - Jared Verse: $5.5M (DROY candidate, worth $15M+)
 * - Kobie Turner: $1.2M (elite interior pass rush)
 * - Byron Young: $1.5M (rotational edge)
 *
 * This is THE exception that proves the rule.
 */
export function RamsException() {
  const rookieStars = [
    { name: "Puka Nacua", salary: 1.1, marketValue: 30, position: "WR" },
    { name: "Jared Verse", salary: 3.4, marketValue: 25, position: "EDGE" },
    { name: "Kobie Turner", salary: 1.5, marketValue: 15, position: "DT" },
    { name: "Byron Young", salary: 1.5, marketValue: 10, position: "EDGE" },
    { name: "Steve Avila", salary: 2.5, marketValue: 12, position: "OG" },
    { name: "Kyren Williams", salary: 5.0, marketValue: 11, position: "RB" },
  ];

  const totalSalary = rookieStars.reduce((sum, p) => sum + p.salary, 0);
  const totalMarketValue = rookieStars.reduce((sum, p) => sum + p.marketValue, 0);
  const totalSurplus = totalMarketValue - totalSalary;

  return (
    <Card className="bg-gradient-to-r from-[#003594]/20 to-[#FFD100]/10 border-2 border-[#FFD100]/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-[#FFD100]">THE RAMS EXCEPTION</span>
          <span className="text-xs font-normal text-text-muted ml-2">Why 17% can still compete</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stafford's Cap Hit */}
        <div className="flex items-center justify-between p-3 bg-window-closed/10 rounded border border-window-closed/30">
          <div>
            <p className="font-mono text-lg font-bold text-window-closed">Matthew Stafford</p>
            <p className="text-sm text-text-muted">$47.5M cap hit (17.01%)</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-text-muted uppercase">Window Status</p>
            <p className="font-mono text-window-closed font-bold">CLOSED</p>
          </div>
        </div>

        {/* The Exception */}
        <div className="p-3 bg-window-elite/10 rounded border border-window-elite/30">
          <p className="text-sm font-bold text-window-elite mb-2">BUT THEY MADE THE DIVISIONAL ROUND. HOW?</p>
          <p className="text-xs text-text-secondary">
            Elite rookie contracts create massive surplus value, offsetting the QB cap burden.
          </p>
        </div>

        {/* Rookie Stars Table */}
        <div className="overflow-hidden rounded border border-border-subtle">
          <table className="w-full text-sm">
            <thead className="bg-background-secondary">
              <tr>
                <th className="text-left px-3 py-2 font-mono text-xs text-text-muted">PLAYER</th>
                <th className="text-right px-3 py-2 font-mono text-xs text-text-muted">SALARY</th>
                <th className="text-right px-3 py-2 font-mono text-xs text-text-muted">MARKET VALUE</th>
                <th className="text-right px-3 py-2 font-mono text-xs text-text-muted">SURPLUS</th>
              </tr>
            </thead>
            <tbody>
              {rookieStars.map((player) => (
                <tr key={player.name} className="border-t border-border-subtle">
                  <td className="px-3 py-2">
                    <span className="font-mono">{player.name}</span>
                    <span className="text-xs text-text-muted ml-2">({player.position})</span>
                  </td>
                  <td className="text-right px-3 py-2 font-mono text-text-muted">
                    ${player.salary}M
                  </td>
                  <td className="text-right px-3 py-2 font-mono text-text-secondary">
                    ${player.marketValue}M
                  </td>
                  <td className="text-right px-3 py-2 font-mono text-window-elite font-bold">
                    +${(player.marketValue - player.salary).toFixed(1)}M
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-background-secondary border-t-2 border-window-elite/30">
              <tr>
                <td className="px-3 py-2 font-mono font-bold">TOTAL SURPLUS</td>
                <td className="text-right px-3 py-2 font-mono text-text-muted">
                  ${totalSalary.toFixed(1)}M
                </td>
                <td className="text-right px-3 py-2 font-mono">
                  ${totalMarketValue}M
                </td>
                <td className="text-right px-3 py-2 font-mono text-window-elite font-bold text-lg">
                  +${totalSurplus.toFixed(1)}M
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Bottom Line */}
        <div className="p-3 bg-[#FFD100]/10 rounded border border-[#FFD100]/30">
          <p className="text-sm text-text-primary">
            <span className="font-bold text-[#FFD100]">THE LESSON:</span>{" "}
            You can overcome a bad QB contract IF you have elite players on rookie deals.
            The Rams have ~$88M in surplus value from 6 elite rookie contracts, offsetting Stafford&apos;s 17% cap hit.
          </p>
          <p className="text-xs text-text-muted mt-2">
            Window open through 2026 ONLY. Unsustainable once Nacua/Verse get paid.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
