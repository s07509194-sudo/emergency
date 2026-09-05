import { useEffect, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import SensorsClusterMap from "./components/SensorsClusterMap";
import SensorsSummary from "./components/SensorsSummary";
import { readSensors, type SensorPoint } from "./utils/readSensors";

export default function EarlyWarning() {
  const [sensors, setSensors] = useState<SensorPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSensor, setSelectedSensor] = useState<SensorPoint | null>(null);

  useEffect(() => {
    let cancelled = false;

    readSensors()
      .then((loadedSensors) => {
        if (cancelled) return;
        setSensors(loadedSensors);
        setSelectedSensor(loadedSensors[0] ?? null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "تعذر تحميل بيانات المستشعرات");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <MainLayout>
      <main className="min-h-screen bg-slate-100 p-6" dir="rtl">

        {/* عنوان الصفحة */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800">الإنذار المبكر</h1>
          <p className="text-slate-500 mt-2">
            متابعة مستشعرات مناهيل شبكة تصريف مياه السيول والأمطار داخل المدينة المنورة.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-4 text-sm mb-6">
            {error}
          </div>
        )}

        {/* التخطيط: الخريطة + العدادات/الليست جنب بعض */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

          {/* الخريطة */}
          <div className="xl:col-span-7">
            <SensorsClusterMap
              sensors={sensors}
              loading={loading}
              selectedSensor={selectedSensor}
              onSelectSensor={setSelectedSensor}
            />
          </div>

          {/* العدادات + الليست التفصيلية */}
          <div className="xl:col-span-5">
            <SensorsSummary
              sensors={sensors}
              selectedId={selectedSensor?.id ?? null}
              onSelect={setSelectedSensor}
            />
          </div>

        </div>

      </main>
    </MainLayout>
  );
}
