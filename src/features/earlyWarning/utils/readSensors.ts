export interface SensorPoint {
  id: number;
  code: string;
  location: string;
  lat: number;
  lng: number;
  status: string;
  governorate: string;
}

/**
 * بيانات المستشعرات محفوظة كـ JSON خفيف بدل Excel، عشان تفادي بطء
 * تفكيك ملفات xlsx داخل المتصفح.
 */
export async function readSensors(): Promise<SensorPoint[]> {
  const response = await fetch(`${import.meta.env.BASE_URL}data/sensors.json`);

  if (!response.ok) {
    throw new Error("تعذر تحميل بيانات المستشعرات");
  }

  const rows = await response.json();

  return rows.map((row: any) => ({
    id: row.id,
    code: row.code ?? `SNR-${row.id}`,
    location: row.location ?? "",
    lat: Number(row.lat),
    lng: Number(row.lng),
    status: row.status ?? "نشط",
    governorate: row.governorate ?? "غير محدد",
  }));
}
