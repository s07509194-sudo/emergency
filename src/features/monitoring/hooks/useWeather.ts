import { useEffect, useState } from "react";

export interface HourlyForecast {
  time: string;
  temp: number;
  code: number;
  precipProbability: number;
}

export interface DailyForecast {
  label: string; // الأمس / اليوم / اسم اليوم
  tempMax: number;
  tempMin: number;
  code: number;
  precipSum: number;
}

interface WeatherData {
  city: string;
  tempNow: number;
  feelsLike: number;
  code: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  precipitation: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}

interface UseWeatherResult {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
}

// إحداثيات المدينة المنورة
const LAT = 24.4709;
const LON = 39.6122;

const API_URL =
  `https://api.open-meteo.com/v1/forecast` +
  `?latitude=${LAT}&longitude=${LON}` +
  `&current=temperature_2m,apparent_temperature,relative_humidity_2m,surface_pressure,wind_speed_10m,precipitation,weather_code` +
  `&hourly=temperature_2m,weather_code,precipitation_probability` +
  `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,uv_index_max,sunrise,sunset` +
  // past_days=1 بيخلي أول يوم في daily هو "الأمس"، عشان نقدر نقارن بيه
  `&past_days=1&forecast_days=10&timezone=auto`;

const DAY_NAMES = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

function getDayLabel(dateStr: string, todayStr: string, yesterdayStr: string): string {
  if (dateStr === todayStr) return "اليوم";
  if (dateStr === yesterdayStr) return "الأمس";
  return DAY_NAMES[new Date(dateStr).getDay()];
}

/**
 * Open-Meteo لا يتطلب أي API Key أو تسجيل — مجاني بالكامل للاستخدام غير التجاري.
 * https://open-meteo.com
 */
export function useWeather(): UseWeatherResult {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchWeather() {
      try {
        const res = await fetch(API_URL);

        if (!res.ok) {
          throw new Error("تعذر جلب بيانات الطقس");
        }

        const data = await res.json();
        const now = new Date();

        // أقرب 8 ساعات قادمة بدءًا من الساعة الحالية
        const nowIndex = data.hourly.time.findIndex(
          (t: string) => new Date(t) >= now
        );
        const startIndex = nowIndex === -1 ? 0 : nowIndex;

        const hourly: HourlyForecast[] = data.hourly.time
          .slice(startIndex, startIndex + 8)
          .map((time: string, i: number) => ({
            time: new Date(time).toLocaleTimeString("ar-EG", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            temp: Math.round(data.hourly.temperature_2m[startIndex + i]),
            code: data.hourly.weather_code[startIndex + i],
            precipProbability:
              data.hourly.precipitation_probability?.[startIndex + i] ?? 0,
          }));

        const todayStr = now.toISOString().split("T")[0];
        const yesterdayDate = new Date(now);
        yesterdayDate.setDate(yesterdayDate.getDate() - 1);
        const yesterdayStr = yesterdayDate.toISOString().split("T")[0];

        const daily: DailyForecast[] = data.daily.time.map(
          (date: string, i: number) => ({
            label: getDayLabel(date, todayStr, yesterdayStr),
            tempMax: Math.round(data.daily.temperature_2m_max[i]),
            tempMin: Math.round(data.daily.temperature_2m_min[i]),
            code: data.daily.weather_code[i],
            precipSum: Math.round(data.daily.precipitation_sum[i] * 10) / 10,
          })
        );

        const todayIndex = data.daily.time.findIndex((d: string) => d === todayStr);
        const uvIndex =
          todayIndex !== -1
            ? Math.round(data.daily.uv_index_max[todayIndex] * 10) / 10
            : 0;
        const sunrise =
          todayIndex !== -1
            ? new Date(data.daily.sunrise[todayIndex]).toLocaleTimeString("ar-EG", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "--:--";
        const sunset =
          todayIndex !== -1
            ? new Date(data.daily.sunset[todayIndex]).toLocaleTimeString("ar-EG", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "--:--";

        if (isMounted) {
          setWeather({
            city: "المدينة المنورة",
            tempNow: Math.round(data.current.temperature_2m),
            feelsLike: Math.round(data.current.apparent_temperature),
            code: data.current.weather_code,
            humidity: data.current.relative_humidity_2m,
            pressure: Math.round(data.current.surface_pressure),
            windSpeed: data.current.wind_speed_10m,
            precipitation: data.current.precipitation,
            uvIndex,
            sunrise,
            sunset,
            hourly,
            daily,
          });
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "حدث خطأ أثناء تحميل بيانات الطقس"
          );
          setLoading(false);
        }
      }
    }

    fetchWeather();

    return () => {
      isMounted = false;
    };
  }, []);

  return { weather, loading, error };
}
