import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge } from "@/components/ui";
import { HistoricalBarChart } from "@/components/charts";
import { historical } from "@/lib/data";
import { getCapHitColor } from "@/lib/utils/colors";

export default function HistoryPage() {
  const winners = historical.superBowlWinners;
  const losers = historical.superBowlLosers;

  return (
    <div className="space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors"
      >
        <span>←</span>
        <span>Back to Dashboard</span>
      </Link>

      <div>
        <h1 className="text-3xl font-mono font-bold text-text-primary mb-2">
          HISTORICAL VALIDATION
        </h1>
        <p className="text-text-secondary">
          Super Bowl data proves the championship window thesis
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-window-elite/10">
          <CardContent>
            <p className="text-xs font-mono uppercase text-text-muted">SB WINNERS AVG</p>
            <p className="text-4xl font-mono font-bold text-window-elite">
              {historical.analysisMetrics.sbWinnersAvgCapHitPercent}%
            </p>
            <p className="text-xs text-text-muted">QB Cap Hit</p>
          </CardContent>
        </Card>
        <Card className="bg-window-danger/10">
          <CardContent>
            <p className="text-xs font-mono uppercase text-text-muted">SB LOSERS AVG</p>
            <p className="text-4xl font-mono font-bold text-window-danger">
              {historical.analysisMetrics.sbLosersAvgCapHitPercent}%
            </p>
            <p className="text-xs text-text-muted">QB Cap Hit</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-xs font-mono uppercase text-text-muted">CORRELATION</p>
            <p className="text-4xl font-mono font-bold text-text-primary">
              {historical.analysisMetrics.correlationCoefficient}
            </p>
            <p className="text-xs text-text-muted">Cap Hit vs Success</p>
          </CardContent>
        </Card>
      </div>

      {/* Visual Chart */}
      <Card>
        <CardHeader>
          <CardTitle>SUPER BOWL WINNERS BY QB CAP HIT % (LAST 10 YEARS)</CardTitle>
        </CardHeader>
        <CardContent>
          <HistoricalBarChart data={winners.slice(0, 10)} />
        </CardContent>
      </Card>

      {/* Winners Table */}
      <Card>
        <CardHeader>
          <CardTitle>SUPER BOWL WINNERS (2010-2025)</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table className="min-w-[600px]">
            <TableHeader>
              <TableRow hover={false}>
                <TableHead>YEAR</TableHead>
                <TableHead>TEAM</TableHead>
                <TableHead>QB</TableHead>
                <TableHead align="right">CAP HIT %</TableHead>
                <TableHead>TYPE</TableHead>
                <TableHead className="hidden sm:table-cell">NOTE</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {winners.map((entry) => (
                <TableRow key={entry.year} hover={false}>
                  <TableCell className="font-mono">{entry.year}</TableCell>
                  <TableCell className="font-bold">{entry.teamId}</TableCell>
                  <TableCell className="text-text-secondary">{entry.qbName}</TableCell>
                  <TableCell align="right">
                    <span
                      className="font-mono font-bold"
                      style={{ color: getCapHitColor(entry.qbCapHitPercent) }}
                    >
                      {entry.qbCapHitPercent.toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default" size="sm">
                      {entry.contractType.replace(/_/g, " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-text-muted max-w-xs truncate hidden sm:table-cell">
                    {entry.note}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Losers Table */}
      <Card>
        <CardHeader>
          <CardTitle>SUPER BOWL LOSERS (COMPARISON)</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table className="min-w-[500px]">
            <TableHeader>
              <TableRow hover={false}>
                <TableHead>YEAR</TableHead>
                <TableHead>TEAM</TableHead>
                <TableHead>QB</TableHead>
                <TableHead align="right">CAP HIT %</TableHead>
                <TableHead className="hidden sm:table-cell">NOTE</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {losers.map((entry) => (
                <TableRow key={entry.year} hover={false}>
                  <TableCell className="font-mono">{entry.year}</TableCell>
                  <TableCell className="font-bold">{entry.teamId}</TableCell>
                  <TableCell className="text-text-secondary">{entry.qbName}</TableCell>
                  <TableCell align="right">
                    <span
                      className="font-mono font-bold"
                      style={{ color: getCapHitColor(entry.qbCapHitPercent) }}
                    >
                      {entry.qbCapHitPercent.toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-text-muted max-w-xs truncate hidden sm:table-cell">
                    {entry.note}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Threshold Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>THRESHOLD ZONE ANALYSIS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.entries(historical.thresholdAnalysis.zones).map(([key, zone]) => (
              <div
                key={key}
                className="p-4 rounded-lg border"
                style={{
                  borderColor:
                    zone.label === "ELITE"
                      ? "#00ff8830"
                      : zone.label === "FAVORABLE"
                      ? "#88ff0030"
                      : zone.label === "CAUTION"
                      ? "#ffaa0030"
                      : zone.label === "DANGER"
                      ? "#ff660030"
                      : "#ff444430",
                  backgroundColor:
                    zone.label === "ELITE"
                      ? "#00ff8808"
                      : zone.label === "FAVORABLE"
                      ? "#88ff0008"
                      : zone.label === "CAUTION"
                      ? "#ffaa0008"
                      : zone.label === "DANGER"
                      ? "#ff660008"
                      : "#ff444408",
                }}
              >
                <p
                  className="font-mono font-bold text-sm"
                  style={{
                    color:
                      zone.label === "ELITE"
                        ? "#00ff88"
                        : zone.label === "FAVORABLE"
                        ? "#88ff00"
                        : zone.label === "CAUTION"
                        ? "#ffaa00"
                        : zone.label === "DANGER"
                        ? "#ff6600"
                        : "#ff4444",
                  }}
                >
                  {zone.label}
                </p>
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-text-muted">
                    Playoffs: <span className="text-text-primary font-mono">{(zone.playoffRate * 100).toFixed(0)}%</span>
                  </p>
                  <p className="text-xs text-text-muted">
                    SB Appearance: <span className="text-text-primary font-mono">{(zone.sbAppearanceRate * 100).toFixed(0)}%</span>
                  </p>
                  <p className="text-xs text-text-muted">
                    Championships: <span className="text-text-primary font-mono">{(zone.championshipRate * 100).toFixed(0)}%</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Insight */}
      <Card className="bg-window-elite/10 border-window-elite/30">
        <CardContent>
          <p className="text-lg text-text-primary font-medium">
            {historical.analysisMetrics.keyInsight}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
