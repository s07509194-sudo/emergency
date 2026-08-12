import { useMemo, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import CriticalPointsMap from "./components/CriticalPointsMap";
import StatisticsCards from "./components/StatisticsCards";
import Filters from "./components/Filters";
import AnalyticsCharts from "./components/AnalyticsCharts";
import { useCriticalPoints } from "./hooks/useCriticalPoints";
import {
  filterCriticalPoints,
  DEFAULT_FILTERS,
  type CriticalPointsFilters,
} from "./utils/filterCriticalPoints";

export default function CriticalPoints() {
  const { points, loading } = useCriticalPoints();
  const [filters, setFilters] = useState<CriticalPointsFilters>(DEFAULT_FILTERS);

  // القيم الفريدة لعمود "المشكلة" (نوع النقطة) تُستخرج تلقائيًا من البيانات
  const typeOptions = useMemo(() => {
    const unique = new Set(
      points.map((p) => p.problem.trim()).filter((value) => value.length > 0)
    );
    return Array.from(unique).sort();
  }, [points]);

  const filteredPoints = useMemo(
    () => filterCriticalPoints(points, filters),
    [points, filters]
  );

  return (
    <MainLayout>
      <div className="p-6 bg-slate-100 min-h-screen">

        {/* عنوان الصفحة */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800">
            النقاط الحرجة
          </h1>

          <p className="text-slate-500 mt-2">
            متابعة وإدارة النقاط الحرجة داخل المدينة المنورة.
          </p>
        </div>

        {/* بطاقات الإحصائيات — تُقرأ وتُحسب مباشرة من ملف الإكسل عبر useCriticalPoints */}
        <StatisticsCards />

        {/* شريط الفلاتر — مرتبط مباشرة بالخريطة */}
        <Filters
          filters={filters}
          onChange={setFilters}
          typeOptions={typeOptions}
        />

        {/* عداد نتائج الفلترة */}
        <p className="text-sm text-slate-500 mt-3">
          عرض {filteredPoints.length} من أصل {points.length} نقطة
        </p>

        {/* رسوم بيانية تحليلية — مرتبطة بنفس الفلاتر */}
        <AnalyticsCharts points={filteredPoints} />

        {/* الخريطة */}
        <div className="bg-white rounded-2xl shadow-lg mt-6 p-6">

          <h2 className="text-2xl font-bold text-slate-800 mb-5">
            خريطة النقاط الحرجة
          </h2>

          <CriticalPointsMap points={filteredPoints} loading={loading} />

        </div>

      </div>
    </MainLayout>
  );
}
