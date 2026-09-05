import { useEffect, useState } from "react";

export interface RegionalCity {
  name: string;
  lat: number;
  lon: number;
  temp: number | null;
  code: number | null;
}

interface UseRegionalWeatherResult {
  cities: RegionalCity[];
  loading: boolean;
  error: string | null;
}

// إحداثيات تقريبية لمراكز مدن رئيسية في منطقة المدينة المنورة (نقاط، وليست حدودًا إدارية رسمية)
const CITIES: Omit<RegionalCity, "temp" | "code">[] = [
  { name: "المدينة المنورة", lat: 24.4709, lon: 39.6122 },
  { name: "ينبع", lat: 24.0896, lon: 38.0618 },
  { name: "العلا", lat: 26.6096, lon: 37.9236 },
  { name: "بدر", lat: 23.7783, lon: 38.7911 },
  { name: "خيبر", lat: 25.7297, lon: 39.2897 },
  { name: "الحناكية", lat: 24.8752, lon: 40.525 },
  { name: "مهد الذهب", lat: 23.5027, lon: 40.858 },
];

export function useRegionalWeather(): UseRegionalWeatherResult {
  const [cities, setCities] = useState<RegionalCity[]>(
    CITIES.map((c) => ({ ...c, temp: null, code: null }))
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchAll() {
      try {
        const lats = CITIES.map((c) => c.lat).join(",");
        const lons = CITIES.map((c) => c.lon).join(",");

        const url =
          `https://api.open-meteo.com/v1/forecast` +
          `?latitude=${lats}&longitude=${lons}` +
          `&current=temperature_2m,weather_code&timezone=auto`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("تعذر جلب بيانات طقس المدن المجاورة");

        const data = await res.json();
        // مع تعدد الإحداثيات، Open-Meteo بيرجع Array بدل Object واحد
        const list: any[] = Array.isArray(data) ? data : [data];

        const merged = CITIES.map((c, i) => ({
          ...c,
          temp:
            list[i]?.current?.temperature_2m !== undefined
              ? Math.round(list[i].current.temperature_2m)
              : null,
          code: list[i]?.current?.weather_code ?? null,
        }));

        if (isMounted) {
          setCities(merged);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "حدث خطأ أثناء تحميل طقس المدن المجاورة"
          );
          setLoading(false);
        }
      }
    }

    fetchAll();

    return () => {
      isMounted = false;
    };
  }, []);

  return { cities, loading, error };
}
