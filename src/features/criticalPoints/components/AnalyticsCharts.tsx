import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,

} from "recharts";
import { PieChart as PieIcon, BarChart3 } from "lucide-react";
import type { CriticalPoint } from "../utils/readExcel";
import { getRiskCategory } from "../utils/filterCriticalPoints";

interface AnalyticsChartsProps {
  points: CriticalPoint[];
}

const RISK_COLORS = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#22c55e",
};

export default function AnalyticsCharts({ points }: AnalyticsChartsProps) {
  // توزيع النقاط حسب مستوى الخطورة
  const riskData = useMemo(() => {
    const counts = { high: 0, medium: 0, low: 0 };

    points.forEach((p) => {
      const category = getRiskCategory(p.risk);
      if (category === "high" || category === "medium" || category === "low") {
        counts[category]++;
      }
    });

    return [
      { name: "عالية", value: counts.high, color: RISK_COLORS.high },
      { name: "متوسطة", value: counts.medium, color: RISK_COLORS.medium },
      { name: "منخفضة", value: counts.low, color: RISK_COLORS.low },
    ];
  }, [points]);

  // توزيع النقاط حسب البلدية (أعلى 8 بلديات من حيث عدد النقاط)
  const municipalityData = useMemo(() => {
    const map = new Map<
      string,
      { name: string; high: number; medium: number; low: number; total: number }
    >();

    points.forEach((p) => {
      const name = p.municipality.trim() || "غير محدد";

      if (!map.has(name)) {
        map.set(name, { name, high: 0, medium: 0, low: 0, total: 0 });
      }

      const entry = map.get(name)!;
      const category = getRiskCategory(p.risk);

      if (category === "high") entry.high++;
      else if (category === "medium") entry.medium++;
      else if (category === "low") entry.low++;

      entry.total++;
    });

    return Array.from(map.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);
  }, [points]);

  const total = riskData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
      {/* توزيع النقاط حسب مستوى الخطورة */}
      <div className="xl:col-span-1 bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
            <PieIcon size={18} className="text-purple-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">
            توزيع النقاط حسب المستوى
          </h2>
        </div>

        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={riskData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
            >
              {riskData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} stroke="#fff" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => {
                const numericValue = Number(value ?? 0);
                return [
                  `${numericValue} نقطة (${total ? Math.round((numericValue / total) * 100) : 0}%)`,
                  name,
                ];
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Legend مخصص */}
        <div className="mt-2 space-y-2">
          {riskData.map((item) => {
            const percent = total ? Math.round((item.value / total) * 100) : 0;
            return (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: item.color }}
                  />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-800">
                  {item.value} <span className="text-slate-400">({percent}%)</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* توزيع النقاط حسب البلدية */}
      <div className="xl:col-span-2 bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <BarChart3 size={18} className="text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">
              توزيع النقاط حسب البلدية
            </h2>
          </div>

          {/* Legend الألوان */}
          <div className="hidden sm:flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> عالية
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" /> متوسطة
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" /> منخفضة
            </span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={municipalityData}
            layout="vertical"
            margin={{ top: 0, right: 20, bottom: 0, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
            <XAxis type="number" tick={{ fill: "#64748b", fontSize: 12 }} />
            <YAxis
              type="category"
              dataKey="name"
              width={110}
              tick={{ fill: "#334155", fontSize: 13 }}
            />
            <Tooltip cursor={{ fill: "#f1f5f9" }} />
            <Bar dataKey="high" stackId="risk" fill={RISK_COLORS.high} name="عالية" radius={[0, 4, 4, 0]} />
            <Bar dataKey="medium" stackId="risk" fill={RISK_COLORS.medium} name="متوسطة" />
            <Bar dataKey="low" stackId="risk" fill={RISK_COLORS.low} name="منخفضة" radius={[4, 0, 0, 4]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
