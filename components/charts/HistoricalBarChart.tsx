"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";
import { SuperBowlEntry } from "@/types";
import { ZONE_COLORS } from "@/lib/utils/colors";
import { getCapHitColor } from "@/lib/utils/colors";

interface HistoricalBarChartProps {
  data: SuperBowlEntry[];
}

export function HistoricalBarChart({ data }: HistoricalBarChartProps) {
  // Transform data for chart
  const chartData = data
    .slice()
    .reverse()
    .map((entry) => ({
      year: entry.year,
      qbCapHitPercent: entry.qbCapHitPercent,
      qbName: entry.qbName,
      teamId: entry.teamId,
      color: getCapHitColor(entry.qbCapHitPercent),
    }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const entry = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
          <p className="font-mono font-bold text-text-primary">
            {entry.year} - {entry.teamId}
          </p>
          <p className="text-sm text-text-secondary">{entry.qbName}</p>
          <p className="text-sm mt-2">
            <span className="text-text-muted">Cap Hit: </span>
            <span
              className="font-mono font-bold"
              style={{ color: entry.color }}
            >
              {entry.qbCapHitPercent.toFixed(1)}%
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" vertical={false} />

        <XAxis
          dataKey="year"
          tick={{ fill: "#a0a0a0", fontSize: 10, fontFamily: "monospace" }}
          tickLine={{ stroke: "#2a2a35" }}
          axisLine={{ stroke: "#2a2a35" }}
        />

        <YAxis
          domain={[0, 15]}
          ticks={[0, 5, 10, 13, 15]}
          tick={{ fill: "#a0a0a0", fontSize: 11, fontFamily: "monospace" }}
          tickLine={{ stroke: "#2a2a35" }}
          axisLine={{ stroke: "#2a2a35" }}
          tickFormatter={(value) => `${value}%`}
        />

        {/* 13% threshold line */}
        <ReferenceLine
          y={13}
          stroke={ZONE_COLORS.CAUTION}
          strokeWidth={2}
          strokeDasharray="5 5"
        />

        {/* Average line */}
        <ReferenceLine
          y={7.8}
          stroke={ZONE_COLORS.ELITE}
          strokeWidth={1}
          strokeDasharray="3 3"
          label={{
            value: "AVG 7.8%",
            position: "right",
            fill: ZONE_COLORS.ELITE,
            fontSize: 10,
            fontFamily: "monospace",
          }}
        />

        <Tooltip content={<CustomTooltip />} />

        <Bar dataKey="qbCapHitPercent" radius={[4, 4, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
