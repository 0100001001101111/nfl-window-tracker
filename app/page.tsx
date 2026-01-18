import {
  LeagueOverview,
  WindowRankings,
  AlertsFeed,
  QuickStats,
  HistoricalProof,
  RamsException,
} from "@/components/dashboard";

export default function HomePage() {
  return (
    <div className="space-y-6">
      {/* Hero Stats */}
      <QuickStats />

      {/* Main scatter plot */}
      <LeagueOverview />

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Historical proof - takes 2 columns */}
        <div className="lg:col-span-2">
          <HistoricalProof />
        </div>

        {/* Alerts feed */}
        <AlertsFeed />
      </div>

      {/* The Rams Exception - educate about non-QB surplus */}
      <RamsException />

      {/* Full rankings table */}
      <WindowRankings />
    </div>
  );
}
