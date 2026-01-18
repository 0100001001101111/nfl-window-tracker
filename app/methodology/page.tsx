import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";

export default function MethodologyPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors"
      >
        <span>←</span>
        <span>Back to Dashboard</span>
      </Link>

      <div>
        <h1 className="text-3xl font-mono font-bold text-text-primary mb-2">
          METHODOLOGY
        </h1>
        <p className="text-text-secondary">
          The math behind the championship window thesis
        </p>
      </div>

      {/* The Core Thesis */}
      <Card>
        <CardHeader>
          <CardTitle>THE CORE THESIS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xl text-window-elite font-mono font-bold">
            &ldquo;Teams under 10% QB cap hit win championships. Teams over 15% don&apos;t.&rdquo;
          </p>
          <p className="text-text-secondary">
            Championship windows are fundamentally about roster construction. When a team&apos;s QB consumes less
            of the salary cap, more resources are available for surrounding talent. This creates a competitive
            advantage that compounds across multiple positions.
          </p>
          <p className="text-text-secondary">
            The NFL salary cap forces zero-sum decisions. Every dollar spent on the QB is a dollar not spent
            elsewhere. When QBs consume 15%+ of the cap, teams cannot fill enough roster holes to compete
            for championships.
          </p>
        </CardContent>
      </Card>

      {/* The Threshold Zones */}
      <Card>
        <CardHeader>
          <CardTitle>THE THRESHOLD ZONES</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-window-elite bg-window-elite/5 rounded-r">
              <p className="font-mono font-bold text-window-elite">ELITE (&lt;6%)</p>
              <p className="text-sm text-text-secondary mt-1">
                Maximum roster flexibility. This is where Super Bowls are won.
              </p>
              <p className="text-xs text-text-muted mt-2">
                Historical: 78% playoff appearance, 34% Super Bowl appearance
              </p>
            </div>

            <div className="p-4 border-l-4 border-window-favorable bg-window-favorable/5 rounded-r">
              <p className="font-mono font-bold text-window-favorable">FAVORABLE (6-10%)</p>
              <p className="text-sm text-text-secondary mt-1">
                Strong roster flexibility. Contender territory.
              </p>
              <p className="text-xs text-text-muted mt-2">
                Historical: 71% playoff appearance, 22% Super Bowl appearance
              </p>
            </div>

            <div className="p-4 border-l-4 border-window-caution bg-window-caution/5 rounded-r">
              <p className="font-mono font-bold text-window-caution">CAUTION (10-13%)</p>
              <p className="text-sm text-text-secondary mt-1">
                At the threshold. Still possible but getting harder.
              </p>
              <p className="text-xs text-text-muted mt-2">
                Historical: 58% playoff appearance, 11% Super Bowl appearance
              </p>
            </div>

            <div className="p-4 border-l-4 border-window-danger bg-window-danger/5 rounded-r">
              <p className="font-mono font-bold text-window-danger">DANGER (13-16%)</p>
              <p className="text-sm text-text-secondary mt-1">
                Roster construction compromised. Need elite play just to compete.
              </p>
              <p className="text-xs text-text-muted mt-2">
                Historical: 44% playoff appearance, 4% Super Bowl appearance
              </p>
            </div>

            <div className="p-4 border-l-4 border-window-closed bg-window-closed/5 rounded-r">
              <p className="font-mono font-bold text-window-closed">CLOSED (&gt;16%)</p>
              <p className="text-sm text-text-secondary mt-1">
                Cannot build a championship roster at this cap hit.
              </p>
              <p className="text-xs text-text-muted mt-2">
                Historical: 31% playoff appearance, 1% Super Bowl appearance
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Window Score Calculation */}
      <Card>
        <CardHeader>
          <CardTitle>WINDOW SCORE CALCULATION</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-text-secondary">
            The composite Window Score is a supporting metric. QB Cap Hit % is the primary signal.
            The score helps differentiate teams with similar cap situations.
          </p>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-background rounded">
              <span className="text-text-secondary">QB Cap Hit %</span>
              <span className="font-mono text-text-primary">45% weight</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-background rounded">
              <span className="text-text-secondary">Non-QB Surplus Value</span>
              <span className="font-mono text-text-primary">20% weight</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-background rounded">
              <span className="text-text-secondary">Trajectory (years to 13%)</span>
              <span className="font-mono text-text-primary">20% weight</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-background rounded">
              <span className="text-text-secondary">Sustainability</span>
              <span className="font-mono text-text-primary">10% weight</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-background rounded">
              <span className="text-text-secondary">Core Age/Health</span>
              <span className="font-mono text-text-primary">5% weight</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* The Rams Exception */}
      <Card>
        <CardHeader>
          <CardTitle>THE RAMS EXCEPTION (AND WHY IT PROVES THE RULE)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-text-secondary">
            Some teams can compete despite expensive QBs by accumulating massive non-QB surplus value.
            The 2025 Rams are a prime example:
          </p>

          <div className="p-4 bg-background rounded">
            <p className="font-mono text-sm text-text-muted mb-2">RAMS NON-QB SURPLUS (2025)</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-text-secondary">Puka Nacua (WR)</span>
                <span className="font-mono text-window-elite">+$29M surplus</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Jared Verse (EDGE)</span>
                <span className="font-mono text-window-elite">+$22M surplus</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Kobie Turner (DT)</span>
                <span className="font-mono text-window-elite">+$13M surplus</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 mt-2">
                <span className="text-text-primary font-bold">TOTAL SURPLUS</span>
                <span className="font-mono text-window-elite font-bold">+$87M</span>
              </div>
            </div>
          </div>

          <p className="text-text-secondary">
            <strong className="text-text-primary">BUT:</strong> This is unsustainable.
            Nacua extends in 2026, Verse in 2027. By 2027, that $87M surplus becomes $0M.
            The Rams&apos; window is NOW or never (2025-2026 max).
          </p>

          <p className="text-text-secondary">
            The sustainable path is a cheap QB. Teams like the Eagles can stay competitive for 4-5 years.
            The Rams have 2 years max.
          </p>
        </CardContent>
      </Card>

      {/* Data Sources */}
      <Card>
        <CardHeader>
          <CardTitle>DATA SOURCES</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-text-secondary">
            Contract data sourced from:
          </p>
          <ul className="list-disc list-inside text-text-muted space-y-1">
            <li>Over The Cap (overthecap.com)</li>
            <li>Spotrac (spotrac.com)</li>
            <li>Pro Football Reference (pro-football-reference.com)</li>
            <li>ESPN QBR metrics</li>
          </ul>
          <p className="text-xs text-text-muted mt-4">
            Data is updated periodically. Historical data covers 2010-2025.
            All cap figures adjusted to percentage of that year&apos;s salary cap.
          </p>
        </CardContent>
      </Card>

      {/* Limitations */}
      <Card>
        <CardHeader>
          <CardTitle>LIMITATIONS & CAVEATS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-window-caution/10 border border-window-caution/30 rounded">
            <p className="text-sm text-text-secondary">
              <strong className="text-window-caution">Correlation ≠ Causation:</strong> While the data shows
              a strong pattern, cheap QBs don&apos;t guarantee success. Many factors contribute to championships:
              coaching, health, draft hits, and yes, some luck.
            </p>
          </div>

          <div className="p-3 bg-window-caution/10 border border-window-caution/30 rounded">
            <p className="text-sm text-text-secondary">
              <strong className="text-window-caution">Survivorship Bias:</strong> We track winners, but many
              teams with cheap QBs also fail. The thesis is about <em>probability</em>, not certainty.
              A cheap QB increases your odds; it doesn&apos;t guarantee success.
            </p>
          </div>

          <div className="p-3 bg-window-caution/10 border border-window-caution/30 rounded">
            <p className="text-sm text-text-secondary">
              <strong className="text-window-caution">The Exception Cases:</strong> Elite QBs can overcome
              cap constraints with otherworldly play. Mahomes at 12% is different than an average QB at 12%.
              But even elite QBs have diminishing playoff success as cap hit increases.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
