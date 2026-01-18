import clsx from "clsx";
import { WindowZoneType } from "@/types";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "elite" | "favorable" | "caution" | "danger" | "closed";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const variantStyles = {
  default: "bg-text-muted/20 text-text-secondary",
  elite: "bg-window-elite/20 text-window-elite border-window-elite/30",
  favorable: "bg-window-favorable/20 text-window-favorable border-window-favorable/30",
  caution: "bg-window-caution/20 text-window-caution border-window-caution/30",
  danger: "bg-window-danger/20 text-window-danger border-window-danger/30",
  closed: "bg-window-closed/20 text-window-closed border-window-closed/30",
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-xs",
  lg: "px-3 py-1.5 text-sm",
};

export function Badge({
  children,
  variant = "default",
  size = "md",
  className,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center font-mono font-medium rounded border",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}

// Helper function to get badge variant from zone type
export function getZoneBadgeVariant(zone: WindowZoneType): BadgeProps["variant"] {
  const map: Record<WindowZoneType, BadgeProps["variant"]> = {
    ELITE: "elite",
    FAVORABLE: "favorable",
    CAUTION: "caution",
    DANGER: "danger",
    CLOSED: "closed",
  };
  return map[zone];
}
