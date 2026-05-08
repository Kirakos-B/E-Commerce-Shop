import { cn } from "../../lib/utils";
import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: string;
  subtitle?: string;
}

const StatCard = ({
  title,
  value,
  icon,
  color = "bg-primary",
  subtitle,
}: StatCardProps) => {
  return (
    <div className="card p-6 flex items-center gap-4">
      <div
        className={cn(
          "w-14 h-14 rounded-xl flex items-center justify-center text-white flex-shrink-0",
          color,
        )}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm text-primary/50 font-medium">{title}</p>
        <p className="text-2xl font-bold text-primary">{value}</p>
        {subtitle && (
          <p className="text-xs text-primary/40 mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
