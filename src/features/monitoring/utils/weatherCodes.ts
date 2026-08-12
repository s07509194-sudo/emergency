export type WeatherCategory =
  | "clear"
  | "partly-cloudy"
  | "cloudy"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "storm";

/**
 * أكواد الطقس القياسية (WMO Weather Codes) المستخدمة في Open-Meteo.
 * المرجع: https://open-meteo.com/en/docs
 */
export function getWeatherCategory(code: number): WeatherCategory {
  if (code === 0) return "clear";
  if (code === 1 || code === 2) return "partly-cloudy";
  if (code === 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if (code >= 51 && code <= 57) return "drizzle";
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return "snow";
  if (code >= 95) return "storm";
  return "cloudy";
}

const LABELS: Record<WeatherCategory, string> = {
  clear: "صافي",
  "partly-cloudy": "غائم جزئيًا",
  cloudy: "غائم",
  fog: "ضباب",
  drizzle: "رذاذ",
  rain: "أمطار",
  snow: "ثلوج",
  storm: "عاصفة رعدية",
};

export function getWeatherLabel(code: number): string {
  return LABELS[getWeatherCategory(code)];
}

/** تصنيف قياسي لمؤشر الأشعة فوق البنفسجية (UV Index) */
export function getUvLabel(uv: number): string {
  if (uv < 3) return "منخفض";
  if (uv < 6) return "متوسط";
  if (uv < 8) return "مرتفع";
  if (uv < 11) return "مرتفع جدًا";
  return "متطرف";
}