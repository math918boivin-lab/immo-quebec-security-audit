import { clsx } from "clsx";

type BadgeTone = "green" | "amber" | "red" | "gray" | "blue" | "purple";

const toneClasses: Record<BadgeTone, string> = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  amber: "bg-amber-50 text-amber-700 ring-amber-600/20",
  red: "bg-red-50 text-red-700 ring-red-600/20",
  gray: "bg-gray-100 text-gray-600 ring-gray-500/20",
  blue: "bg-blue-50 text-blue-700 ring-blue-600/20",
  purple: "bg-purple-50 text-purple-700 ring-purple-600/20",
};

export function Badge({ tone, children }: { tone: BadgeTone; children: React.ReactNode }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset whitespace-nowrap",
        toneClasses[tone]
      )}
    >
      {children}
    </span>
  );
}
