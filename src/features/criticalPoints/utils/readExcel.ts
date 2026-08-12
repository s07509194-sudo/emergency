import * as XLSX from "xlsx";

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
  const response = await fetch("/data/critical_points.xlsx");
  const arrayBuffer = await response.arrayBuffer();

  const workbook = XLSX.read(arrayBuffer, {
    type: "array",
  });

  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  const rows = XLSX.utils.sheet_to_json<any>(sheet);

  return rows
    .filter(
      (row) =>
        row["X"] !== undefined &&
        row["Y"] !== undefined
    )
    .map((row, index) => ({
      id: index + 1,
      municipality: row["البلدية"] ?? "",
      district: row["الحي"] ?? "",
      lng: Number(row["X"]),
      lat: Number(row["Y"]),
      risk: row["درجة الخطورة"] ?? "",
      code: row["كود النقطة الحرجة"] ?? "",
      problem: row["المشكلة"] ?? "",
    }));
}