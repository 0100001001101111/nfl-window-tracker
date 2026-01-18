"use client";

import { QBContract } from "@/types";
import { Card, CardHeader, CardTitle, CardContent, Badge } from "@/components/ui";
import { formatCurrency, formatDate } from "@/lib/utils/formatting";

interface ContractDetailsProps {
  contract: QBContract;
}

export function ContractDetails({ contract }: ContractDetailsProps) {
  const contractTypeLabels: Record<string, string> = {
    rookie: "Rookie Deal",
    rookie_5th_year: "5th Year Option",
    veteran: "Veteran",
    veteran_backloaded: "Backloaded Veteran",
    veteran_market: "Market Rate",
    veteran_discount: "Team-Friendly",
    trade_acquisition: "Trade Acquisition",
    franchise_tag: "Franchise Tag",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>CONTRACT DETAILS</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-text-muted">Player</span>
            <span className="font-medium text-text-primary">
              {contract.playerName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Contract Type</span>
            <Badge variant="default">
              {contractTypeLabels[contract.contractType] || contract.contractType}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Total Value</span>
            <span className="font-mono text-text-primary">
              {formatCurrency(contract.totalValue, false)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">AAV</span>
            <span className="font-mono text-text-primary">
              {formatCurrency(contract.aav)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Guaranteed</span>
            <span className="font-mono text-text-primary">
              {formatCurrency(contract.guaranteedMoney, false)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Years Remaining</span>
            <span className="font-mono text-text-primary">
              {contract.yearsRemaining}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Signed</span>
            <span className="font-mono text-text-secondary">
              {formatDate(contract.signedDate)}
            </span>
          </div>
          {contract.hasNoTradeClause && (
            <div className="flex justify-between">
              <span className="text-text-muted">No-Trade Clause</span>
              <Badge variant="danger" size="sm">YES</Badge>
            </div>
          )}
        </div>

        {/* Cap Hits by Year */}
        <div className="mt-6">
          <p className="text-xs font-mono uppercase tracking-wider text-text-muted mb-3">
            Cap Hits by Year
          </p>
          <div className="space-y-2">
            {contract.capHits
              .filter((ch) => !ch.isVoidYear)
              .map((capHit) => (
                <div
                  key={capHit.year}
                  className="flex justify-between items-center p-2 bg-background rounded"
                >
                  <span className="font-mono text-text-secondary">
                    {capHit.year}
                  </span>
                  <span className="font-mono font-bold text-text-primary">
                    {formatCurrency(capHit.amount)}
                  </span>
                </div>
              ))}
            {contract.capHits.some((ch) => ch.isVoidYear) && (
              <div className="mt-2 p-2 bg-window-closed/10 border border-window-closed/30 rounded">
                <p className="text-xs text-window-closed font-mono">
                  ⚠️ Void Year Dead Money:{" "}
                  {formatCurrency(
                    contract.capHits
                      .filter((ch) => ch.isVoidYear)
                      .reduce((sum, ch) => sum + (ch.deadMoneyIfCut || 0), 0)
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
