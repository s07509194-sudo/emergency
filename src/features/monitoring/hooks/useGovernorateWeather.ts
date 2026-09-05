import { useEffect, useState } from "react";

export interface GovernorateWeather {
  name: string;
  lat: number;
  lon: number;
  precipToday: number | null;
  windSpeed: number | null;
  code: number | null;
}

interface UseGovernorateWeatherResult {
  data: Record<string, GovernorateWeather>;
  loading: boolean;
  error: string | null;
}

// أسماء المحافظات ومراكزها الجغرافية الحقيقية (محسوبة من حدود الشيب فايل الرسمي)
const GOVERNORATES: { name: string; lat: number; lon: number }[] = [
  { name: "المدينة المنورة", lat: 24.52377, lon: 39.6353 },
  { name: "الحناكية", lat: 24.85733, lon: 41.07883 },
  { name: "العلا", lat: 26.56567, lon: 38.00063 },
  { name: "العيص", lat: 25.33604, lon: 38.28172 },
  { name: "المهد", lat: 23.55308, lon: 40.97759 },
  { name: "بدر", lat: 23.82124, lon: 38.92092 },
  { name: "خيبر", lat: 25.84715, lon: 39.39729 },
  { name: "وادي الفرع", lat: 23.36958, lon: 39.68122 },
  { name: "ينبع", lat: 24.4196, lon: 38.18783 },
];

const REFRESH_INTERVAL_MS = 10 * 60 * 1000;

export function useGovernorateWeather(): UseGovernorateWeatherResult {
  const [data, setData] = useState<Record<string, GovernorateWeather>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchAll() {
      try {
        const lats = GOVERNORATES.map((g) => g.lat).join(",");
        const lons = GOVERNORATES.map((g) => g.lon).join(",");

        const url =
          `https://api.open-meteo.com/v1/forecast` +
          `?latitude=${lats}&longitude=${lons}` +
          `&current=wind_speed_10m,weather_code` +
          `&daily=precipitation_sum` +
          `&forecast_days=1&timezone=auto`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("تعذر جلب بيانات طقس المحافظات");

        const result = await res.json();
        const list: any[] = Array.isArray(result) ? result : [result];

        const merged: Record<string, GovernorateWeather> = {};
        GOVERNORATES.forEach((g, i) => {
          const item = list[i];
          merged[g.name] = {
            name: g.name,
            lat: g.lat,
            lon: g.lon,
            precipToday: item?.daily?.precipitation_sum?.[0] ?? null,
            windSpeed: item?.current?.wind_speed_10m ?? null,
            code: item?.current?.weather_code ?? null,
          };
        });

        if (isMounted) {
          setData(merged);
          setLoading(false);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "حدث خطأ أثناء تحميل بيانات طقس المحافظات"
          );
          setLoading(false);
        }
      }
    }

    fetchAll();
    const intervalId = setInterval(fetchAll, REFRESH_INTERVAL_MS);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return { data, loading, error };
}
