import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getTeamById,
  getQBContractByTeamId,
  getAllWindowScores,
} from "@/lib/data";
import {
  WindowScoreDisplay,
  CapHitProjection,
  FactorBreakdown,
  ContractDetails,
} from "@/components/team";
import { NonQBSurplusResult } from "@/types";

interface PageProps {
  params: Promise<{ teamId: string }>;
}

export default async function TeamPage({ params }: PageProps) {
  const { teamId } = await params;
  const team = getTeamById(teamId.toUpperCase());
  const contract = getQBContractByTeamId(teamId.toUpperCase());
  const allScores = getAllWindowScores();
  const score = allScores.find((s) => s.teamId === teamId.toUpperCase());

  if (!team || !contract || !score) {
    notFound();
  }

  // Find team rank
  const rank = allScores.findIndex((s) => s.teamId === teamId.toUpperCase()) + 1;

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors"
      >
        <span>←</span>
        <span>Back to Rankings</span>
      </Link>

      {/* Team Header */}
      <div className="flex items-center gap-4">
        <div
          className="w-3 h-16 rounded"
          style={{ backgroundColor: team.primaryColor }}
        />
        <div>
          <h1 className="text-3xl font-mono font-bold text-text-primary">
            {team.name.toUpperCase()}
          </h1>
          <p className="text-text-muted">
            {team.conference} • {team.division} • Rank #{rank} of 32
          </p>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Window Score - Full width on mobile, 2 cols on desktop */}
        <WindowScoreDisplay score={score} team={team} contract={contract} />

        {/* Contract Details */}
        <ContractDetails contract={contract} />
      </div>

      {/* Cap projection */}
      <CapHitProjection contract={contract} teamName={team.name} />

      {/* Factor breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FactorBreakdown score={score} />

        {/* Historical Context */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-sm font-mono uppercase tracking-wider text-text-muted mb-4">
            WHAT THIS MEANS FOR THE ROSTER
          </h3>
          <div className="space-y-4 text-sm text-text-secondary">
            {score.qbCapHitPercent < 6 && (
              <p>
                At <span className="text-window-elite font-mono font-bold">{score.qbCapHitPercent.toFixed(1)}%</span> QB cap hit,{" "}
                {team.city} has maximum roster flexibility. This is championship window territory.
                The team can afford elite talent at multiple positions while maintaining depth.
              </p>
            )}
            {score.qbCapHitPercent >= 6 && score.qbCapHitPercent < 10 && (
              <p>
                At <span className="text-window-favorable font-mono font-bold">{score.qbCapHitPercent.toFixed(1)}%</span> QB cap hit,{" "}
                {team.city} has solid roster flexibility. Still in contender territory with room to build around the QB.
              </p>
            )}
            {score.qbCapHitPercent >= 10 && score.qbCapHitPercent < 13 && (
              <p>
                At <span className="text-window-caution font-mono font-bold">{score.qbCapHitPercent.toFixed(1)}%</span> QB cap hit,{" "}
                {team.city} is at the threshold. Success is still possible but roster construction becomes critical.
                Every decision matters more.
              </p>
            )}
            {score.qbCapHitPercent >= 13 && score.qbCapHitPercent < 16 && (
              <p>
                At <span className="text-window-danger font-mono font-bold">{score.qbCapHitPercent.toFixed(1)}%</span> QB cap hit,{" "}
                {team.city}&apos;s roster construction is compromised. Need elite play at multiple positions just to compete.
                History shows teams in this range rarely win championships.
              </p>
            )}
            {score.qbCapHitPercent >= 16 && (
              <p>
                At <span className="text-window-closed font-mono font-bold">{score.qbCapHitPercent.toFixed(1)}%</span> QB cap hit,{" "}
                {team.city} cannot build a championship roster at this cap allocation.
                Historical data shows teams over 15% have less than 1% Super Bowl appearance rate.
              </p>
            )}

            <div className="p-3 bg-background rounded mt-4">
              <p className="text-xs text-text-muted">
                <span className="font-mono">COMPARISON:</span> The difference between a 5% and 15% QB cap hit is approximately $28M in cap space.
                That&apos;s a Pro Bowl edge rusher or two quality starters.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate static params for all teams
export async function generateStaticParams() {
  const { teams } = await import("@/lib/data/teams.json");
  return teams.map((team: { id: string }) => ({
    teamId: team.id,
  }));
}
