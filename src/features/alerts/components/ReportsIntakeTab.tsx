import { Plus, MapPin } from "lucide-react";
import { emergencyReports } from "../../../data/emergencyData";

const STATUS_META: Record<string, { label: string; badge: string }> = {
  Active: { label: "مفتوح", badge: "bg-blue-100 text-blue-700" },
  Closed: { label: "مغلق", badge: "bg-slate-100 text-slate-500" },
  Pending: { label: "معلّق", badge: "bg-orange-100 text-orange-700" },
  Monitoring: { label: "تحت المتابعة", badge: "bg-purple-100 text-purple-700" },
  Available: { label: "متاح", badge: "bg-teal-100 text-teal-700" },
};

const SEVERITY_META: Record<string, { label: string; badge: string }> = {
  High: { label: "عالية", badge: "bg-red-100 text-red-600" },
  Medium: { label: "متوسطة", badge: "bg-yellow-100 text-yellow-700" },
  Low: { label: "منخفضة", badge: "bg-green-100 text-green-700" },
};

function StatBox({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 text-center">
      <p className={`text-2xl font-extrabold ${color ?? "text-slate-800"}`}>{value}</p>
      <p className="text-xs text-slate-500 mt-1">{label}</p>
    </div>
  );
}

export default function ReportsIntakeTab() {
  const total = emergencyReports.length;
  const openCount = emergencyReports.filter((r) => r.status === "Active").length;
  const closedCount = emergencyReports.filter((r) => r.status === "Closed").length;
  const highCount = emergencyReports.filter((r) => r.severity === "High").length;

  return (
    <div>
      {/* شريط الإحصائيات */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatBox label="إجمالي البلاغات" value={total} />
        <StatBox label="مفتوح" value={openCount} color="text-blue-600" />
        <StatBox label="مغلق" value={closedCount} color="text-slate-500" />
        <StatBox label="خطورة عالية" value={highCount} color="text-red-600" />
      </div>

      {/* زر إضافة (مبدئي، بدون ربط خلفي حاليًا) */}
      <div className="flex justify-end mb-4">
        <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-4 py-2.5 text-sm font-semibold transition">
          <Plus size={16} />
          إضافة بلاغ
        </button>
      </div>

      {/* البطاقات */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {emergencyReports.map((report) => {
          const status = STATUS_META[report.status] ?? {
            label: report.status,
            badge: "bg-slate-100 text-slate-600",
          };
          const severity = SEVERITY_META[report.severity] ?? {
            label: report.severity,
            badge: "bg-slate-100 text-slate-600",
          };

          return (
            <div key={report.id} className="bg-white rounded-2xl shadow-md border border-slate-100 p-5">
              <div className="flex items-start justify-between mb-1">
                <h4 className="font-bold text-slate-800">{report.title}</h4>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${status.badge}`}>
                  {status.label}
                </span>
              </div>

              <p className="text-xs text-slate-400 mb-4 font-mono">
                #MED-{String(report.id).padStart(4, "0")} · {report.type}
              </p>

              <div className="space-y-2 text-sm border-t border-slate-100 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">الأمانة</span>
                  <span className="text-slate-700 font-medium">أمانة المدينة المنورة</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">مستوى الخطورة</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${severity.badge}`}>
                    {severity.label}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 flex items-center gap-1">
                    <MapPin size={12} /> الإحداثيات
                  </span>
                  <span className="text-slate-700 font-mono text-xs">
                    {report.lat}, {report.lng}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
