interface CircularStatProps {
  percent: number;
  value: number;
  label: string;
  gradientFrom: string;
  gradientTo: string;
}

/**
 * دائرة نسبية (Donut) بخلفية متدرجة + رقم داخلها، تُستخدم في كارت "آخر إشعار تم إرساله"
 */
export default function CircularStat({
  percent,
  value,
  label,
  gradientFrom,
  gradientTo,
}: CircularStatProps) {
  const size = 96;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div
      className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl p-5 text-white shadow-md"
      style={{
        backgroundImage: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
      }}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#ffffff"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-extrabold">{percent}%</span>
        </div>
      </div>

      <div className="text-center">
        <div className="text-lg font-bold leading-none">{value}</div>
        <div className="mt-1 text-xs font-medium text-white/90">{label}</div>
      </div>
    </div>
  );
}
