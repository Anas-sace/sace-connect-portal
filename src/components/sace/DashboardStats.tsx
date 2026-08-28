import { Building2, Compass, Briefcase, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface DashboardStatsProps {
  total: number;
  internship: number;
  immersion: number;
  colleges: number;
}

export function DashboardStats({ total, internship, immersion, colleges }: DashboardStatsProps) {
  const cards: { label: string; value: number; icon: LucideIcon }[] = [
    { label: "Total Responses", value: total, icon: Users },
    { label: "Internship Program", value: internship, icon: Briefcase },
    { label: "Immersion Program", value: immersion, icon: Compass },
    { label: "Colleges", value: colleges, icon: Building2 },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {cards.map(({ label, value, icon: Icon }) => (
        <div key={label} className="surface-card p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium text-muted-foreground sm:text-sm">{label}</p>
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary">
              <Icon className="size-4 text-primary" aria-hidden />
            </span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-primary sm:text-3xl">{value}</p>
        </div>
      ))}
    </div>
  );
}
