import { Droplets, Wind, Gauge, CloudRain, Sunrise, Sunset, Sun } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useWeather } from "../hooks/useWeather";
import { getWeatherLabel, getUvLabel } from "../utils/weatherCodes";
import AnimatedWeatherIcon from "./AnimatedWeatherIcon";
import logo from "../../../assets/logo.png";

export default function WeatherWidget() {
  const { weather, loading, error } = useWeather();

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-red-100">
        <p className="font-semibold text-red-600 mb-1 text-base">تعذر تحميل بيانات الطقس</p>
        <p className="text-slate-500 text-sm">{error}</p>
      </div>
    );
  }

  if (loading || !weather) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse min-h-[420px]" />
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

      {/* الحالة الحالية */}
      <div className="bg-gradient-to-br from-sky-500 to-indigo-600 p-6 text-white">

        {/* شريط الأمانة */}
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/20">
          <img
            src={logo}
            alt="شعار أمانة المدينة المنورة"
            className="w-9 h-9 object-contain bg-white rounded-full p-1"
          />
          <span className="text-base font-bold">أمانة المدينة المنورة</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">{weather.city}</h3>
            <p className="text-white/90 text-base mt-1">{getWeatherLabel(weather.code)}</p>
            <p className="text-white/70 text-sm mt-1">
              الإحساس الحراري {weather.feelsLike}°C
            </p>
          </div>

          <div className="flex items-center gap-3">
            <AnimatedWeatherIcon code={weather.code} size={64} />
            <span className="text-6xl font-bold">{weather.tempNow}°</span>
          </div>
        </div>

        {/* شريط إحصائيات سريعة */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-5">
          <div className="bg-white/15 backdrop-blur rounded-xl p-3 text-center">
            <CloudRain size={18} className="mx-auto mb-1" />
            <p className="text-sm font-semibold">{weather.precipitation} مم</p>
            <p className="text-xs text-white/70">الأمطار</p>
          </div>
          <div className="bg-white/15 backdrop-blur rounded-xl p-3 text-center">
            <Wind size={18} className="mx-auto mb-1" />
            <p className="text-sm font-semibold">{weather.windSpeed} كم/س</p>
            <p className="text-xs text-white/70">الرياح</p>
          </div>
          <div className="bg-white/15 backdrop-blur rounded-xl p-3 text-center">
            <Droplets size={18} className="mx-auto mb-1" />
            <p className="text-sm font-semibold">{weather.humidity}%</p>
            <p className="text-xs text-white/70">الرطوبة</p>
          </div>
          <div className="bg-white/15 backdrop-blur rounded-xl p-3 text-center">
            <Gauge size={18} className="mx-auto mb-1" />
            <p className="text-sm font-semibold">{weather.pressure} hPa</p>
            <p className="text-xs text-white/70">الضغط</p>
          </div>
          <div className="bg-white/15 backdrop-blur rounded-xl p-3 text-center">
            <Sun size={18} className="mx-auto mb-1" />
            <p className="text-sm font-semibold">{weather.uvIndex}</p>
            <p className="text-xs text-white/70">{getUvLabel(weather.uvIndex)}</p>
          </div>
          <div className="bg-white/15 backdrop-blur rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Sunrise size={15} />
              <Sunset size={15} />
            </div>
            <p className="text-sm font-semibold">{weather.sunrise}</p>
            <p className="text-xs text-white/70">{weather.sunset}</p>
          </div>
        </div>
      </div>

      {/* الساعات القادمة */}
      <div className="px-5 py-4 border-b border-slate-100">
        <h4 className="text-base font-bold text-slate-700 mb-3">الساعات القادمة</h4>
        <div className="flex gap-3 overflow-x-auto pb-1 mb-4">
          {weather.hourly.map((hour) => (
            <div
              key={hour.time}
              className="flex flex-col items-center gap-1 min-w-[68px] bg-slate-50 rounded-xl py-3 px-2"
            >
              <span className="text-sm text-slate-500">{hour.time}</span>
              <AnimatedWeatherIcon code={hour.code} size={34} />
              <span className="text-base font-bold text-slate-800">{hour.temp}°</span>
              <span className="text-xs text-sky-600 flex items-center gap-0.5">
                <Droplets size={11} /> {hour.precipProbability}%
              </span>
            </div>
          ))}
        </div>

        {/* منحنى الحرارة بالساعة */}
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={weather.hourly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              domain={["dataMin - 2", "dataMax + 2"]}
            />
            <Tooltip
              formatter={(value: number) => [`${value}°`, "الحرارة"]}
              contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
            />
            <Area
              type="monotone"
              dataKey="temp"
              stroke="#f97316"
              strokeWidth={2.5}
              fill="url(#tempGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* توقعات الأيام (تشمل الأمس للمقارنة) — صف أفقي زي شكل الأيام في الصورة */}
      <div className="px-5 py-4">
        <h4 className="text-base font-bold text-slate-700 mb-3">توقعات الأيام</h4>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {weather.daily.map((day) => {
            const isPast = day.label === "الأمس";
            return (
              <div
                key={day.label}
                className={`
                  flex flex-col items-center gap-1.5 min-w-[92px] rounded-xl py-4 px-2
                  ${isPast ? "bg-slate-50 text-slate-400" : "hover:bg-slate-50 text-slate-700"}
                `}
              >
                <span className="text-sm font-semibold">{day.label}</span>
                <AnimatedWeatherIcon code={day.code} size={40} />
                <div className="flex items-center gap-1.5 text-sm">
                  <span className="font-bold text-slate-800">{day.tempMax}°</span>
                  <span className="text-slate-400">{day.tempMin}°</span>
                </div>
                <span className="text-xs text-sky-600 flex items-center gap-0.5">
                  <CloudRain size={10} /> {day.precipSum} مم
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
