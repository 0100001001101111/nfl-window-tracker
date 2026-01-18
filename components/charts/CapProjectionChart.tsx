"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  Area,
  ComposedChart,
} from "recharts";
import { CapProjectionDataPoint } from "@/types";
import { ZONE_COLORS } from "@/lib/utils/colors";
import { formatCurrency } from "@/lib/utils/formatting";

interface CapProjectionChartProps {
  data: CapProjectionDataPoint[];
  teamName?: string;
}

export function CapProjectionChart({ data, teamName }: CapProjectionChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload as CapProjectionDataPoint;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
          <p className="font-mono font-bold text-text-primary">{label}</p>
          <p className="text-sm mt-2">
            <span className="text-text-muted">Cap Hit: </span>
            <span className="font-mono text-text-primary">
              {formatCurrency(point.capHitAmount)}
            </span>
          </p>
          <p className="text-sm">
            <span className="text-text-muted">% of Cap: </span>
            <span
              className="font-mono font-bold"
              style={{
                color:
                  point.capHitPercent < 10
                    ? ZONE_COLORS.ELITE
                    : point.capHitPercent < 13
                    ? ZONE_COLORS.FAVORABLE
                    : point.capHitPercent < 16
                    ? ZONE_COLORS.DANGER
                    : ZONE_COLORS.CLOSED,
              }}
            >
              {point.capHitPercent.toFixed(1)}%
            </span>
          </p>
          <p className="text-sm">
            <span className="text-text-muted">Salary Cap: </span>
            <span className="font-mono text-text-secondary">
              {formatCurrency(point.projectedCap)}
            </span>
          </p>
          {point.isProjected && (
            <p className="text-xs text-text-muted mt-1 italic">Projected</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
        {/* Zone backgrounds */}
        <ReferenceArea y1={0} y2={6} fill={ZONE_COLORS.ELITE} fillOpacity={0.08} />
        <ReferenceArea y1={6} y2={10} fill={ZONE_COLORS.FAVORABLE} fillOpacity={0.06} />
        <ReferenceArea y1={10} y2={13} fill={ZONE_COLORS.CAUTION} fillOpacity={0.06} />
        <ReferenceArea y1={13} y2={16} fill={ZONE_COLORS.DANGER} fillOpacity={0.06} />
        <ReferenceArea y1={16} y2={30} fill={ZONE_COLORS.CLOSED} fillOpacity={0.06} />

        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />

        <XAxis
          dataKey="year"
          tick={{ fill: "#a0a0a0", fontSize: 11, fontFamily: "monospace" }}
          tickLine={{ stroke: "#2a2a35" }}
          axisLine={{ stroke: "#2a2a35" }}
        />

        <YAxis
          domain={[0, 25]}
          ticks={[0, 5, 10, 13, 16, 20, 25]}
          tick={{ fill: "#a0a0a0", fontSize: 11, fontFamily: "monospace" }}
          tickLine={{ stroke: "#2a2a35" }}
          axisLine={{ stroke: "#2a2a35" }}
          tickFormatter={(value) => `${value}%`}
        />

        {/* 13% Danger Threshold Line */}
        <ReferenceLine
          y={13}
          stroke={ZONE_COLORS.CAUTION}
          strokeWidth={2}
          strokeDasharray="5 5"
          label={{
            value: "13% DANGER THRESHOLD",
            position: "right",
            fill: ZONE_COLORS.CAUTION,
            fontSize: 10,
            fontFamily: "monospace",
          }}
        />

        <Tooltip content={<CustomTooltip />} />

        <Area
          type="monotone"
          dataKey="capHitPercent"
          stroke="transparent"
          fill="url(#capGradient)"
          fillOpacity={0.3}
        />

        <Line
          type="monotone"
          dataKey="capHitPercent"
          stroke="#00ff88"
          strokeWidth={3}
          dot={(props: any) => {
            const { cx, cy, payload } = props;
            const color =
              payload.capHitPercent < 10
                ? ZONE_COLORS.ELITE
                : payload.capHitPercent < 13
                ? ZONE_COLORS.FAVORABLE
                : payload.capHitPercent < 16
                ? ZONE_COLORS.DANGER
                : ZONE_COLORS.CLOSED;
            return (
              <circle
                cx={cx}
                cy={cy}
                r={6}
                fill={color}
                stroke="#0a0a0f"
                strokeWidth={2}
              />
            );
          }}
          activeDot={{
            r: 8,
            stroke: "#fff",
            strokeWidth: 2,
          }}
        />

        <defs>
          <linearGradient id="capGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00ff88" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#00ff88" stopOpacity={0} />
          </linearGradient>
        </defs>
      </ComposedChart>
    </ResponsiveContainer>
  );
}
