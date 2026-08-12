import { useEffect, useState } from "react";
import { readCriticalPoints, type CriticalPoint } from "../utils/readExcel";

export interface CriticalPointsStats {
  total: number;
  high: number;
  medium: number;
  low: number;
}

interface UseCriticalPointsResult {
  points: CriticalPoint[];
  stats: CriticalPointsStats;
  loading: boolean;
  error: string | null;
}

/**
 * يتحقق إذا كان النص يحتوي على كلمة الخطورة المطلوبة،
 * بغض النظر عن الصيغة المستخدمة (عالية/عالي، منخفضة/منخفض، إلخ)
 * وبغض النظر عن أي كلمات إضافية مثل "الخطورة".
 */
function matchesRiskLevel(risk: string, keyword: string): boolean {
  return risk.trim().includes(keyword);
}

export function useCriticalPoints(): UseCriticalPointsResult {
  const [points, setPoints] = useState<CriticalPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    readCriticalPoints()
      .then((data) => {
        if (isMounted) {
          setPoints(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "حدث خطأ أثناء تحميل بيانات النقاط الحرجة"
          );
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const stats: CriticalPointsStats = {
    total: points.length,
    // "عالي" موجودة داخل كل من "عالية الخطورة" و"عالي الخطورة"
    high: points.filter((p) => matchesRiskLevel(p.risk, "عالي")).length,
    // "متوسط" موجودة داخل "متوسطة الخطورة"
    medium: points.filter((p) => matchesRiskLevel(p.risk, "متوسط")).length,
    // "منخفض" موجودة داخل كل من "منخفضة الخطورة" و"منخفض الخطورة"
    low: points.filter((p) => matchesRiskLevel(p.risk, "منخفض")).length,
  };

  return { points, stats, loading, error };
}
