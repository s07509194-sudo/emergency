import {
  Droplets,
  Wind,
  Gauge,
  CloudRain,
  Sunrise,
  Sunset,
  Sun,
} from "lucide-react";

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
      <div className="w-full max-w-full min-w-0 bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-red-100">
        <p className="font-semibold text-red-600 mb-1 text-base">
          تعذر تحميل بيانات الطقس
        </p>

        <p className="text-slate-500 text-sm">
          {error}
        </p>
      </div>
    );
  }

  if (loading || !weather) {
    return (
      <div className="w-full max-w-full min-w-0 bg-white rounded-2xl shadow-lg p-6 animate-pulse min-h-[420px]" />
    );
  }

  return (
    <div
      className="
        w-full
        max-w-full
        min-w-0
        mt-3
        sm:mt-5
        mb-3
        sm:mb-5
        bg-white
        rounded-2xl
        shadow-lg
        overflow-hidden
      "
    >

      {/* =====================================================
          الحالة الحالية
      ===================================================== */}
      <div
        className="
          bg-gradient-to-br
          from-[#006f62]
          via-[#159f8b]
          to-[#4fc3b1]
          p-4
          sm:p-5
          lg:p-6
          text-white
        "
      >

        {/* ===================================================
            شريط الأمانة
        =================================================== */}
        <div
          className="
            flex
            items-center
            gap-2
            mb-4
            pb-4
            border-b
            border-white/20
          "
        >
          <img
            src={logo}
            alt="شعار أمانة المدينة المنورة"
            className="
              w-8
              h-8
              sm:w-9
              sm:h-9
              object-contain
              bg-white
              rounded-full
              p-1
              shrink-0
            "
          />

          <span className="text-sm sm:text-base font-bold">
            أمانة المدينة المنورة
          </span>
        </div>


        {/* ===================================================
            الحالة الحالية

            Mobile:
            عمودي

            sm+:
            أفقي
        =================================================== */}
        <div
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-4
            min-w-0
          "
        >

          {/* المدينة */}
          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl font-bold truncate">
              {weather.city}
            </h3>

            <p className="text-white/90 text-sm sm:text-base mt-1">
              {getWeatherLabel(weather.code)}
            </p>

            <p className="text-white/70 text-xs sm:text-sm mt-1">
              الإحساس الحراري {weather.feelsLike}°C
            </p>
          </div>


          {/* الحرارة */}
          <div
            className="
              flex
              items-center
              gap-2
              sm:gap-3
              shrink-0
            "
          >
            <AnimatedWeatherIcon
              code={weather.code}
              size={48}
            />

            <span
              className="
                text-4xl
                sm:text-5xl
                lg:text-6xl
                font-bold
                leading-none
              "
            >
              {weather.tempNow}°
            </span>
          </div>

        </div>


        {/* ===================================================
            شريط الإحصائيات
        =================================================== */}
        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-3
            lg:grid-cols-6
            gap-2
            mt-5
          "
        >

          {/* الأمطار */}
          <div className="bg-white/15 backdrop-blur rounded-xl p-2.5 sm:p-3 text-center min-w-0">
            <CloudRain
              size={22}
              className="mx-auto mb-1"
            />

            <p className="text-xs sm:text-sm font-semibold truncate">
              {weather.precipitation} مم
            </p>

            <p className="text-[11px] sm:text-xs text-white/70">
              الأمطار
            </p>
          </div>


          {/* الرياح */}
          <div className="bg-white/15 backdrop-blur rounded-xl p-2.5 sm:p-3 text-center min-w-0">
            <Wind
              size={22}
              className="mx-auto mb-1"
            />

            <p className="text-xs sm:text-sm font-semibold truncate">
              {weather.windSpeed} كم/س
            </p>

            <p className="text-[11px] sm:text-xs text-white/70">
              الرياح
            </p>
          </div>


          {/* الرطوبة */}
          <div className="bg-white/15 backdrop-blur rounded-xl p-2.5 sm:p-3 text-center min-w-0">
            <Droplets
              size={22}
              className="mx-auto mb-1"
            />

            <p className="text-xs sm:text-sm font-semibold">
              {weather.humidity}%
            </p>

            <p className="text-[11px] sm:text-xs text-white/70">
              الرطوبة
            </p>
          </div>


          {/* الضغط */}
          <div className="bg-white/15 backdrop-blur rounded-xl p-2.5 sm:p-3 text-center min-w-0">
            <Gauge
              size={24}
              className="mx-auto mb-1"
            />

            <p className="text-xs sm:text-sm font-semibold truncate">
              {weather.pressure} hPa
            </p>

            <p className="text-[11px] sm:text-xs text-white/70">
              الضغط
            </p>
          </div>


          {/* الأشعة */}
          <div className="bg-white/15 backdrop-blur rounded-xl p-2.5 sm:p-3 text-center min-w-0">
            <Sun
              size={22}
              className="mx-auto mb-1"
            />

            <p className="text-xs sm:text-sm font-semibold">
              {weather.uvIndex}
            </p>

            <p className="text-[11px] sm:text-xs text-white/70 truncate">
              {getUvLabel(weather.uvIndex)}
            </p>
          </div>


          {/* الشروق والغروب */}
          <div className="bg-white/15 backdrop-blur rounded-xl p-2.5 sm:p-3 text-center min-w-0">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Sunrise size={17} />
              <Sunset size={17} />
            </div>

            <p className="text-xs sm:text-sm font-semibold truncate">
              {weather.sunrise}
            </p>

            <p className="text-[11px] sm:text-xs text-white/70 truncate">
              {weather.sunset}
            </p>
          </div>

        </div>
      </div>


      {/* =====================================================
          الساعات القادمة
      ===================================================== */}
      <div
        className="
          px-3
          sm:px-5
          py-4
          border-b
          border-slate-100
          min-w-0
        "
      >

        <h4 className="text-sm sm:text-base font-bold text-slate-700 mb-3">
          الساعات القادمة
        </h4>


        {/* Cards */}
        <div
          className="
            flex
            gap-2
            sm:gap-3
            overflow-x-auto
            pb-2
            mb-4
            min-w-0
            scrollbar-thin
          "
        >
          {weather.hourly.map((hour) => (
            <div
              key={hour.time}
              className="
                flex
                flex-col
                items-center
                gap-1
                min-w-[64px]
                sm:min-w-[68px]
                shrink-0
                bg-slate-50
                rounded-xl
                py-2.5
                sm:py-3
                px-2
              "
            >
              <span className="text-xs sm:text-sm text-slate-500 whitespace-nowrap">
                {hour.time}
              </span>

              <AnimatedWeatherIcon
                code={hour.code}
                size={32}
              />

              <span className="text-sm sm:text-base font-bold text-slate-800">
                {hour.temp}°
              </span>

              <span className="text-[11px] sm:text-xs text-sky-600 flex items-center gap-0.5 whitespace-nowrap">
                <Droplets size={11} />
                {hour.precipProbability}%
              </span>
            </div>
          ))}
        </div>


        {/* ===================================================
            منحنى الحرارة
        =================================================== */}
        <div className="w-full min-w-0 h-[150px] sm:h-[160px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <AreaChart
              data={weather.hourly}
              margin={{
                top: 10,
                right: 5,
                left: -20,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="tempGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#f97316"
                    stopOpacity={0.35}
                  />

                  <stop
                    offset="95%"
                    stopColor="#f97316"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f1f5f9"
                vertical={false}
              />

              <XAxis
                dataKey="time"
                tick={{
                  fontSize: 11,
                  fill: "#94a3b8",
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{
                  fontSize: 11,
                  fill: "#94a3b8",
                }}
                axisLine={false}
                tickLine={false}
                domain={["dataMin - 2", "dataMax + 2"]}
              />

              <Tooltip
                formatter={(value) => [
                  `${value}°`,
                  "الحرارة",
                ]}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  fontSize: 12,
                }}
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

      </div>


      {/* =====================================================
          توقعات الأيام
      ===================================================== */}
      <div
        className="
          px-3
          sm:px-5
          py-4
          min-w-0
        "
      >

        <h4 className="text-sm sm:text-base font-bold text-slate-700 mb-3">
          توقعات الأيام
        </h4>


        <div
          className="
            flex
            gap-2
            sm:gap-3
            overflow-x-auto
            pb-2
            min-w-0
          "
        >
          {weather.daily.map((day) => {
            const isPast = day.label === "الأمس";

            return (
              <div
                key={day.label}
                className={`
                  flex
                  flex-col
                  items-center
                  gap-1.5
                  min-w-[82px]
                  sm:min-w-[92px]
                  shrink-0
                  rounded-xl
                  py-3
                  sm:py-4
                  px-2
                  transition
                  ${
                    isPast
                      ? "bg-slate-50 text-slate-400"
                      : "hover:bg-slate-50 text-slate-700"
                  }
                `}
              >

                <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">
                  {day.label}
                </span>

                <AnimatedWeatherIcon
                  code={day.code}
                  size={38}
                />

                <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                  <span className="font-bold text-slate-800">
                    {day.tempMax}°
                  </span>

                  <span className="text-slate-400">
                    {day.tempMin}°
                  </span>
                </div>

                <span className="text-[11px] sm:text-xs text-sky-600 flex items-center gap-0.5 whitespace-nowrap">
                  <CloudRain size={10} />
                  {day.precipSum} مم
                </span>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}