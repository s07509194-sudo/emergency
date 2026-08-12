import type { CriticalPoint } from "./readExcel";

export interface CriticalPointsFilters {
  search: string;
  /** "all" أو القيمة الفعلية لعمود "المشكلة" (نوع النقطة) */
  type: string;
  /** "all" | "high" | "medium" | "low" */
  risk: string;
}

export const DEFAULT_FILTERS: CriticalPointsFilters = {
  search: "",
  type: "all",
  risk: "all",
};

/**
 * نفس منطق مطابقة درجة الخطورة المستخدم في useCriticalPoints،
 * يدعم الصيغتين (عالية/عالي، منخفضة/منخفض).
 */
function matchesRiskFilter(risk: string, filter: string): boolean {
  if (filter === "all") return true;

  const value = risk.trim();

  if (filter === "high") return value.includes("عالي");
  if (filter === "medium") return value.includes("متوسط");
  if (filter === "low") return value.includes("منخفض");

  return true;
}

export type RiskCategory = "high" | "medium" | "low" | "unknown";

/** يحدد فئة الخطورة (high/medium/low) لأي نص خطورة قادم من الإكسل */
export function getRiskCategory(risk: string): RiskCategory {
  const value = risk.trim();

  if (value.includes("عالي")) return "high";
  if (value.includes("متوسط")) return "medium";
  if (value.includes("منخفض")) return "low";

  return "unknown";
}

export function filterCriticalPoints(
  points: CriticalPoint[],
  filters: CriticalPointsFilters
): CriticalPoint[] {
  const search = filters.search.trim().toLowerCase();

  return points.filter((point) => {
    const matchesSearch =
      search === "" ||
      point.problem.toLowerCase().includes(search) ||
      point.district.toLowerCase().includes(search) ||
      point.municipality.toLowerCase().includes(search) ||
      point.code.toLowerCase().includes(search);

    const matchesType =
      filters.type === "all" || point.problem.trim() === filters.type;

    const matchesRisk = matchesRiskFilter(point.risk, filters.risk);

    return matchesSearch && matchesType && matchesRisk;
  });
}
