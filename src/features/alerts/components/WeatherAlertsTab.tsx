import { Wind, CloudRain, Thermometer, Sun, Sunrise, Sunset } from "lucide-react";
import { useWeather } from "../../monitoring/hooks/useWeather";
import { evaluateWeatherAlerts, type AlertLevel } from "../utils/weatherAlertRules";

const ICONS = { wind: Wind, rain: CloudRain, heat: Thermometer, uv: Sun };

const LEVEL_META: Record<
  AlertLevel,
  { label: string; badge: string; bar: string; cardRing: string }
> = {
  normal: {
    label: "طبيعي",
    badge: "bg-green-100 text-green-700",
    bar: "bg-green-500",
    cardRing: "border-slate-100",
  },
  yellow: {
    label: "الإنذار الأصفر",
    badge: "bg-yellow-100 text-yellow-700",
    bar: "bg-yellow-400",
    cardRing: "border-yellow-200 ring-1 ring-yellow-100",
  },
  orange: {
    label: "الإنذار البرتقالي",
    badge: "bg-orange-100 text-orange-700",
    bar: "bg-orange-500",
    cardRing: "border-orange-200 ring-1 ring-orange-100",
  },
  red: {
    label: "الإنذار الأحمر",
    badge: "bg-red-100 text-red-600",
    bar: "bg-red-600",
    cardRing: "border-red-300 ring-2 ring-red-200",
  },
};

function StatBox({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 text-center">
      <p className={`text-2xl font-extrabold ${color ?? "text-slate-800"}`}>{value}</p>
      <p className="text-xs text-slate-500 mt-1">{label}</p>
    </div>
  );
}

export default function WeatherAlertsTab() {
  const { weather, loading, error } = useWeather();

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-6 text-sm">
        تعذر تحميل بيانات الطقس: {error}
      </div>
    );
  }

  if (loading || !weather) {
    return <div className="bg-white rounded-2xl shadow-sm animate-pulse h-64" />;
  }

  const todayPrecip = weather.daily.find((d) => d.label === "اليوم")?.precipSum;

  const alerts = evaluateWeatherAlerts({
    windSpeed: weather.windSpeed,
    precipitation: weather.precipitation,
    todayPrecipSum: todayPrecip,
    tempNow: weather.tempNow,
    uvIndex: weather.uvIndex,
  });

  const countBy = (level: AlertLevel) => alerts.filter((a) => a.level === level).length;
  const lastUpdate = new Date().toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" });

  return (
    <div>
      {/* شريط الإحصائيات + الشروق والغروب */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
          <StatBox label="إجمالي المؤشرات" value={alerts.length} />
          <StatBox label="الإنذار الأصفر" value={countBy("yellow")} color="text-yellow-600" />
          <StatBox label="الإنذار البرتقالي" value={countBy("orange")} color="text-orange-600" />
          <StatBox label="الإنذار الأحمر" value={countBy("red")} color="text-red-600" />
        </div>

        <div className="flex items-center gap-4 bg-white rounded-2xl shadow-sm border border-slate-100 px-5 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Sunrise size={16} className="text-amber-500" />
            <span className="text-slate-500">الشروق</span>
            <span className="font-bold text-slate-800">{weather.sunrise}</span>
          </div>
          <div className="w-px h-6 bg-slate-200" />
          <div className="flex items-center gap-2 text-sm">
            <Sunset size={16} className="text-orange-500" />
            <span className="text-slate-500">الغروب</span>
            <span className="font-bold text-slate-800">{weather.sunset}</span>
          </div>
        </div>
      </div>

      {/* البطاقات */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {alerts.map((alert) => {
          const Icon = ICONS[alert.id];
          const meta = LEVEL_META[alert.level];

          return (
            <div
              key={alert.id}
              className={`bg-white rounded-2xl shadow-md overflow-hidden border ${meta.cardRing}`}
            >
              <div className={`h-1.5 ${meta.bar}`} />

              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon size={20} className="text-slate-600" />
                    <h4 className="font-bold text-slate-700">{alert.title}</h4>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${meta.badge}`}>
                    {meta.label}
                  </span>
                </div>

                <p className="text-2xl font-extrabold text-slate-800 mb-2">{alert.value}</p>
                <p className="text-sm text-slate-500 mb-4">{alert.message}</p>

                <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs">
                  <p className="flex justify-between">
                    <span className="text-slate-400">الأمانة</span>
                    <span className="text-slate-600 font-medium">أمانة المدينة المنورة</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-400">المصدر</span>
                    <span className="text-slate-600 font-medium">Open-Meteo</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-400">آخر تحديث</span>
                    <span className="text-slate-600 font-medium">{lastUpdate}</span>
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
