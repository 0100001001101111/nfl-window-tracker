"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  Cell,
  LabelList,
} from "recharts";
import { ScatterDataPoint } from "@/types";
import { ZONE_COLORS } from "@/lib/utils/colors";
import { formatPlayoffRound } from "@/lib/utils/formatting";

interface ScatterPlotProps {
  data: ScatterDataPoint[];
  selectedYear?: number;
  sbWinner?: string | null;
  onTeamClick?: (teamId: string) => void;
}

export function ScatterPlot({ data, selectedYear = 2025, sbWinner, onTeamClick }: ScatterPlotProps) {
  // Separate SB Winner for special rendering (gold trophy icon)
  const winnerData = sbWinner ? data.filter(d => d.teamId === sbWinner) : [];
  const otherData = sbWinner ? data.filter(d => d.teamId !== sbWinner) : data;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload as ScatterDataPoint;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
          <p className="font-mono font-bold text-text-primary">{point.teamName}</p>
          <p className="text-sm text-text-secondary">{point.qbName}</p>
          <p className="text-sm mt-2">
            <span className="text-text-muted">Cap Hit: </span>
            <span style={{ color: point.color }} className="font-mono font-bold">
              {point.qbCapHitPercent.toFixed(2)}%
            </span>
          </p>
          <p className="text-sm">
            <span className="text-text-muted">{selectedYear} Result: </span>
            <span className="text-text-primary">{formatPlayoffRound(point.playoffRound)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const playoffRoundLabels = [
    "Missed",
    "Wild Card",
    "Divisional",
    "Conference",
    "SB Loss",
    "SB Winner",
  ];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
        {/* Background zones */}
        <ReferenceArea x1={0} x2={6} fill={ZONE_COLORS.ELITE} fillOpacity={0.08} />
        <ReferenceArea x1={6} x2={10} fill={ZONE_COLORS.FAVORABLE} fillOpacity={0.06} />
        <ReferenceArea x1={10} x2={13} fill={ZONE_COLORS.CAUTION} fillOpacity={0.06} />
        <ReferenceArea x1={13} x2={16} fill={ZONE_COLORS.DANGER} fillOpacity={0.06} />
        <ReferenceArea x1={16} x2={30} fill={ZONE_COLORS.CLOSED} fillOpacity={0.06} />

        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />

        <XAxis
          type="number"
          dataKey="qbCapHitPercent"
          domain={[0, 25]}
          ticks={[0, 5, 10, 13, 16, 20, 25]}
          tick={{ fill: "#a0a0a0", fontSize: 11, fontFamily: "monospace" }}
          tickLine={{ stroke: "#2a2a35" }}
          axisLine={{ stroke: "#2a2a35" }}
          label={{
            value: "QB Cap Hit %",
            position: "bottom",
            offset: 0,
            fill: "#6b7280",
            fontSize: 12,
            fontFamily: "monospace",
          }}
        />

        <YAxis
          type="number"
          dataKey="playoffRound"
          domain={[0, 5]}
          ticks={[0, 1, 2, 3, 4, 5]}
          tickFormatter={(value) => playoffRoundLabels[value] || ""}
          tick={{ fill: "#a0a0a0", fontSize: 10, fontFamily: "monospace" }}
          tickLine={{ stroke: "#2a2a35" }}
          axisLine={{ stroke: "#2a2a35" }}
          width={90}
        />

        {/* 13% Danger Threshold Line */}
        <ReferenceLine
          x={13}
          stroke={ZONE_COLORS.CAUTION}
          strokeWidth={2}
          strokeDasharray="5 5"
          label={{
            value: "13% THRESHOLD",
            position: "top",
            fill: ZONE_COLORS.CAUTION,
            fontSize: 10,
            fontFamily: "monospace",
          }}
        />

        <Tooltip content={<CustomTooltip />} />

        {/* Regular teams */}
        <Scatter
          data={otherData}
          onClick={(data) => onTeamClick?.(data.teamId)}
          cursor="pointer"
        >
          {otherData.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
          <LabelList
            dataKey="teamId"
            position="top"
            offset={8}
            style={{ fontSize: 9, fontFamily: "monospace", fill: "#a0a0a0" }}
          />
        </Scatter>

        {/* Super Bowl Champion - larger gold dot with trophy */}
        {winnerData.length > 0 && (
          <Scatter
            data={winnerData}
            onClick={(data) => onTeamClick?.(data.teamId)}
            cursor="pointer"
            shape={(props: any) => {
              const { cx, cy } = props;
              return (
                <g>
                  <circle cx={cx} cy={cy} r={12} fill="#FFD700" stroke="#B8860B" strokeWidth={2} />
                  <text x={cx} y={cy + 3} textAnchor="middle" fontSize={8} fill="#000">🏆</text>
                </g>
              );
            }}
          >
            <LabelList
              dataKey="teamId"
              position="top"
              offset={16}
              style={{ fontSize: 10, fontFamily: "monospace", fill: "#FFD700", fontWeight: "bold" }}
            />
          </Scatter>
        )}
      </ScatterChart>
    </ResponsiveContainer>
  );
}
