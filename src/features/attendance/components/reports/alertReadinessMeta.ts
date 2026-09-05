import { CloudRain, CloudDrizzle, CloudFog, Wind, Thermometer } from "lucide-react";

/**
 * أسماء المحافظات مأخوذة من ملف بيانات GIS الرسمي بالمشروع نفسه
 * (public/data/madinah_governorates.geojson) — مو قائمة مخمّنة.
 */
export const MADINAH_GOVERNORATES = [
  "المدينة المنورة",
  "ينبع",
  "العلا",
  "بدر",
  "خيبر",
  "المهد",
  "الحناكية",
  "العيص",
  "وادي الفرع",
] as const;

export type AlertLevel = "purple" | "red" | "orange" | "yellow";

export const ALERT_LEVEL_META: Record<
  AlertLevel,
  { label: string; badgeClass: string; solidClass: string }
> = {
  purple: {
    label: "أرجواني — شديد الخطورة",
    badgeClass: "bg-purple-100 text-purple-800 border-purple-300",
    solidClass: "bg-purple-600",
  },
  red: {
    label: "أحمر — عالي الخطورة",
    badgeClass: "bg-red-100 text-red-800 border-red-300",
    solidClass: "bg-red-600",
  },
  orange: {
    label: "برتقالي — متوسط الخطورة",
    badgeClass: "bg-orange-100 text-orange-800 border-orange-300",
    solidClass: "bg-orange-500",
  },
  yellow: {
    label: "أصفر — منخفض الخطورة",
    badgeClass: "bg-yellow-100 text-yellow-800 border-yellow-300",
    solidClass: "bg-yellow-400",
  },
};

export type AlertType = "rain" | "dust" | "fog" | "wind" | "heat_wave";

export const ALERT_TYPE_META: Record<AlertType, { label: string; icon: typeof CloudRain }> = {
  rain: { label: "حالة مطرية", icon: CloudRain },
  dust: { label: "أتربة مثارة", icon: CloudDrizzle },
  fog: { label: "ضباب", icon: CloudFog },
  wind: { label: "رياح", icon: Wind },
  heat_wave: { label: "موجة حارة", icon: Thermometer },
};
