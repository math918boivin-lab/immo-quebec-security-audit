import { clsx } from "clsx";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "slate",
  hint,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: "slate" | "green" | "amber" | "red" | "blue";
  hint?: string;
}) {
  const toneClasses: Record<string, string> = {
    slate: "bg-slate-900 text-white",
    green: "bg-emerald-600 text-white",
    amber: "bg-amber-500 text-white",
    red: "bg-red-600 text-white",
    blue: "bg-blue-600 text-white",
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
          {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
        </div>
        <div className={clsx("flex h-10 w-10 items-center justify-center rounded-lg", toneClasses[tone])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
