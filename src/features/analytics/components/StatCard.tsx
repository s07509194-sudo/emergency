import type { LucideIcon } from "lucide-react";
import AnimatedNumber from "../../dashboard/AnimatedNumber";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  iconBg: string;
  iconColor: string;
  onClick?: () => void;
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  iconBg,
  iconColor,
  onClick,
}: StatCardProps) {
  const isClickable = Boolean(onClick);

  const className = `
    flex flex-col items-center justify-center gap-3
    rounded-2xl bg-white p-5 w-full
    shadow-sm border border-slate-100
    transition-all duration-200
    hover:shadow-md hover:-translate-y-0.5
    ${isClickable ? "cursor-pointer hover:border-emerald-200" : ""}
  `;

  const content = (
    <>
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg}`}
      >
        <Icon size={22} className={iconColor} />
      </div>

      <div className="text-2xl font-extrabold text-slate-800 sm:text-3xl">
        <AnimatedNumber value={value} duration={1.2} />
      </div>

      <div className="text-sm font-medium text-slate-500">{label}</div>
    </>
  );

  if (isClickable) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {content}
      </button>
    );
  }

  return <div className={className}>{content}</div>;
}
