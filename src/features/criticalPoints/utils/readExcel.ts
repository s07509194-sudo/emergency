

export interface CriticalPoint {
  id: number;
  municipality: string;
  district: string;
  lat: number;
  lng: number;
  risk: string;
  code: string;
  problem: string;
}

export async function readCriticalPoints(): Promise<CriticalPoint[]> {
  const response = await fetch(`${import.meta.env.BASE_URL}data/critical_points.json`);

  if (!response.ok) {
    throw new Error("تعذر تحميل بيانات النقاط الحرجة");
  }

  const rows: unknown = await response.json();
  if (!Array.isArray(rows)) {
    throw new Error("صيغة بيانات النقاط الحرجة غير صحيحة");
  }

  return rows
    .filter((row): row is Record<string, unknown> => Boolean(row && typeof row === "object"))
    .map((row, index) => ({
      id: Number(row.id) || index + 1,
      municipality: String(row.municipality ?? ""),
      district: String(row.district ?? ""),
      lng: Number(row.lng),
      lat: Number(row.lat),
      risk: String(row.risk ?? ""),
      code: String(row.code ?? ""),
      problem: String(row.problem ?? ""),
    }))
    .filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lng));
}
