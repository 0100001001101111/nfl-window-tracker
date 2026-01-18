"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { getWindowAlerts, getTeamById } from "@/lib/data";

export function AlertsFeed() {
  const alerts = getWindowAlerts();

  const alertIcons = {
    positive: "🟢",
    warning: "🟡",
    danger: "🔴",
  };

  const alertColors = {
    positive: "border-window-elite/30 bg-window-elite/5",
    warning: "border-window-caution/30 bg-window-caution/5",
    danger: "border-window-closed/30 bg-window-closed/5",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>WINDOW ALERTS</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {alerts.map((alert, index) => {
            const team = getTeamById(alert.teamId);
            return (
              <div
                key={index}
                className={`flex items-start gap-2 p-2 rounded border ${alertColors[alert.type]}`}
              >
                <span className="text-sm">{alertIcons[alert.type]}</span>
                <div className="flex-1">
                  <span className="font-mono font-bold text-sm text-text-primary">
                    {alert.teamId}:
                  </span>
                  <span className="text-sm text-text-secondary ml-1">
                    {alert.message}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
