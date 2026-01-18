"use client";

import clsx from "clsx";
import { getCapHitColor } from "@/lib/utils/colors";

interface ProgressBarProps {
  value: number; // 0-100 or actual percentage
  max?: number;
  showThresholds?: boolean;
  className?: string;
  height?: "sm" | "md" | "lg";
}

export function ProgressBar({
  value,
  max = 25, // Default max is 25% cap hit
  showThresholds = true,
  className,
  height = "md",
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const color = getCapHitColor(value);

  const heightStyles = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  return (
    <div className={clsx("w-full", className)}>
      <div
        className={clsx(
          "w-full bg-border rounded-full overflow-hidden relative",
          heightStyles[height]
        )}
      >
        {/* Progress fill */}
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />

        {/* Threshold markers */}
        {showThresholds && (
          <>
            {/* 6% marker */}
            <div
              className="absolute top-0 bottom-0 w-px bg-window-elite/50"
              style={{ left: `${(6 / max) * 100}%` }}
            />
            {/* 10% marker */}
            <div
              className="absolute top-0 bottom-0 w-px bg-window-favorable/50"
              style={{ left: `${(10 / max) * 100}%` }}
            />
            {/* 13% marker - DANGER THRESHOLD */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-window-caution"
              style={{ left: `${(13 / max) * 100}%` }}
            />
            {/* 16% marker */}
            <div
              className="absolute top-0 bottom-0 w-px bg-window-danger/50"
              style={{ left: `${(16 / max) * 100}%` }}
            />
          </>
        )}
      </div>

      {/* Labels */}
      {showThresholds && (
        <div className="flex justify-between mt-1 text-[10px] font-mono text-text-muted">
          <span>0%</span>
          <span className="text-window-elite">6%</span>
          <span className="text-window-favorable">10%</span>
          <span className="text-window-caution font-bold">13%</span>
          <span className="text-window-danger">16%</span>
          <span>{max}%</span>
        </div>
      )}
    </div>
  );
}

// Simplified version for inline use
interface MiniProgressProps {
  value: number;
  max?: number;
  className?: string;
}

export function MiniProgress({ value, max = 20, className }: MiniProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const color = getCapHitColor(value);

  return (
    <div className={clsx("w-16 h-1.5 bg-border rounded-full overflow-hidden", className)}>
      <div
        className="h-full rounded-full"
        style={{
          width: `${percentage}%`,
          backgroundColor: color,
        }}
      />
    </div>
  );
}
