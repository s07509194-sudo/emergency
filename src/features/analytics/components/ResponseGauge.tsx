interface ResponseGaugeProps {
  responded: number;
  notResponded: number;
}

/**
 * جيج نصف دائري متقطع (Dashed Speedometer) لعرض نسبة الرد على الإشعارات
 * مبني بالكامل بـ SVG بدون مكتبات خارجية
 */
export default function ResponseGauge({
  responded,
  notResponded,
}: ResponseGaugeProps) {
  const total = responded + notResponded;
  const percent = total > 0 ? (responded / total) * 100 : 0;

  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const r = 90;

  // عدد الشرطات الكلي على نصف الدائرة، وعدد الشرطات المضاءة حسب النسبة
  const totalTicks = 36;
  const litTicks = Math.round((percent / 100) * totalTicks);

  const ticks = Array.from({ length: totalTicks }, (_, i) => {
    // زاوية كل شرطة من 180° إلى 0° فوق نصف الدائرة
    const angleDeg = 180 - (i / (totalTicks - 1)) * 180;
    const angleRad = (angleDeg * Math.PI) / 180;

    const outerR = r;
    const innerR = r - 14;

    const x1 = cx + innerR * Math.cos(angleRad);
    const y1 = cy - innerR * Math.sin(angleRad);
    const x2 = cx + outerR * Math.cos(angleRad);
    const y2 = cy - outerR * Math.sin(angleRad);

    const isLit = i < litTicks;

    return { x1, y1, x2, y2, isLit, key: i };
  });

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
        {ticks.map((t) => (
          <line
            key={t.key}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            strokeWidth={5}
            strokeLinecap="round"
            stroke={t.isLit ? "#f59e0b" : "#e2e8f0"}
          />
        ))}

        <text
          x={cx}
          y={cy - 18}
          textAnchor="middle"
          className="fill-slate-800"
          style={{ fontSize: 30, fontWeight: 800 }}
        >
          {percent.toFixed(2)}%
        </text>

        <text
          x={cx}
          y={cy + 8}
          textAnchor="middle"
          className="fill-slate-400"
          style={{ fontSize: 14, fontWeight: 600 }}
        >
          الرد
        </text>
      </svg>
    </div>
  );
}
