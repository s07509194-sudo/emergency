import { useMemo, useState } from "react";
import { ChevronLeft, FileText, Eye, Search } from "lucide-react";
import { emergencyReports } from "../../../data/emergencyData";
import { getActionsForType } from "../utils/incidentActions";

type BoardTab = "emergency" | "warning" | "incoming";
type PanelView = "actions" | "details" | "report";

const TABS: { key: BoardTab; label: string }[] = [
  { key: "incoming", label: "البلاغات الواردة" },
  { key: "warning", label: "البلاغات التحذيرية" },
  { key: "emergency", label: "البلاغات الطارئة" },
];

const TYPE_LABELS: Record<string, string> = {
  Flood: "فيضانات",
  Fire: "حريق",
  Landslide: "انهيارات مباني",
  Drainage: "أخرى",
  Medical: "حالة إسعافية",
  Critical: "نقطة حرجة تحتاج متابعة",
  Shelter: "مركز إيواء",
};

const STATUS_META: Record<string, { label: string; className: string }> = {
  Active: { label: "مفتوح", className: "bg-blue-50 text-blue-600 border border-blue-200" },
  Closed: { label: "مغلق", className: "bg-slate-100 text-slate-500 border border-slate-200" },
  Pending: { label: "جديد", className: "bg-purple-50 text-purple-600 border border-purple-200" },
  Monitoring: { label: "قيد المتابعة", className: "bg-orange-50 text-orange-600 border border-orange-200" },
  Available: { label: "متاح", className: "bg-teal-50 text-teal-600 border border-teal-200" },
};

const SEVERITY_META: Record<string, { label: string; className: string; dot: string }> = {
  High: { label: "عالي", className: "bg-red-50 text-red-600 border border-red-200", dot: "bg-red-500" },
  Medium: { label: "متوسط", className: "bg-yellow-50 text-yellow-700 border border-yellow-200", dot: "bg-yellow-500" },
  Low: { label: "منخفض", className: "bg-green-50 text-green-600 border border-green-200", dot: "bg-green-500" },
};

const TYPE_CODE: Record<string, string> = {
  Flood: "FLOOD",
  Fire: "FIRE",
  Landslide: "COLL",
  Drainage: "DRAIN",
  Medical: "MED",
  Critical: "CRIT",
  Shelter: "SHEL",
};

/** يولّد تاريخ إنشاء ثابت (Deterministic) لكل بلاغ لغرض العرض، لحين توفر حقل تاريخ حقيقي من الـ backend */
function getDisplayDate(id: number): string {
  const base = new Date(2026, 7, 1); // 1 أغسطس 2026
  base.setDate(base.getDate() + ((id * 3) % 20));
  return base.toLocaleDateString("ar-EG", { year: "numeric", month: "2-digit", day: "2-digit" });
}

function getReferenceCode(id: number, type: string): string {
  const code = TYPE_CODE[type] ?? "OTH";
  return `MD-2026-${code}-${String(id).padStart(5, "0")}`;
}

function getReportNumber(id: number): string {
  return ((id * 2654435761) % 0xffffffff).toString(16).slice(0, 8);
}

export default function IncidentReportsBoard() {
  const [tab, setTab] = useState<BoardTab>("emergency");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [panelView, setPanelView] = useState<PanelView>("actions");

  const filtered = useMemo(() => {
    return emergencyReports.filter((r) => {
      const matchesTab =
        tab === "incoming" ? true : tab === "emergency" ? r.severity === "High" : r.severity === "Medium";

      const matchesSearch =
        search.trim() === "" || r.title.toLowerCase().includes(search.trim().toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [tab, search]);

  function toggleRow(id: number, view: PanelView) {
    if (expandedId === id && panelView === view) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    setPanelView(view);
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden mt-6">

      {/* الترويسة: بحث + تابات فرعية */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
        <div className="relative w-full lg:w-72">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث عن بلاغ..."
            className="w-full border border-slate-200 rounded-lg pr-9 pl-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex bg-slate-50 rounded-xl p-1 gap-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === t.key ? "bg-emerald-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* الجدول */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-right">
          <thead>
            <tr className="bg-slate-50 text-slate-500">
              <th className="px-4 py-3 font-semibold whitespace-nowrap">الرقم المرجعي</th>
              <th className="px-4 py-3 font-semibold whitespace-nowrap">رقم البلاغ</th>
              <th className="px-4 py-3 font-semibold whitespace-nowrap">الجهة</th>
              <th className="px-4 py-3 font-semibold">اسم البلاغ</th>
              <th className="px-4 py-3 font-semibold whitespace-nowrap">نوع البلاغ</th>
              <th className="px-4 py-3 font-semibold whitespace-nowrap">مستوى الخطورة</th>
              <th className="px-4 py-3 font-semibold whitespace-nowrap">تاريخ الإنشاء</th>
              <th className="px-4 py-3 font-semibold whitespace-nowrap">حالة البلاغ</th>
              <th className="px-4 py-3 font-semibold whitespace-nowrap">الإجراء</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center text-slate-400 py-10">
                  لا يوجد بلاغات في هذا التصنيف حاليًا
                </td>
              </tr>
            )}

            {filtered.map((r) => {
              const typeLabel = TYPE_LABELS[r.type] ?? r.type;
              const status = STATUS_META[r.status] ?? { label: r.status, className: "bg-slate-100 text-slate-600" };
              const severity = SEVERITY_META[r.severity] ?? { label: r.severity, className: "bg-slate-100 text-slate-600", dot: "bg-slate-400" };
              const isExpanded = expandedId === r.id;

              return (
                <>
                  <tr key={r.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-500 font-mono text-xs whitespace-nowrap">
                      {getReferenceCode(r.id, r.type)}
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-mono text-xs whitespace-nowrap">
                      {getReportNumber(r.id)}
                    </td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">الرصد</td>
                    <td className="px-4 py-3 text-slate-800 font-medium">{r.title}</td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{typeLabel}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${severity.className}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${severity.dot}`} />
                        {severity.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{getDisplayDate(r.id)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${status.className}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleRow(r.id, "actions")}
                          title="الإجراءات المتخذة"
                          className={`p-1.5 rounded-lg transition-colors ${
                            isExpanded && panelView === "actions" ? "bg-emerald-100 text-emerald-600" : "text-slate-400 hover:bg-slate-100"
                          }`}
                        >
                          <ChevronLeft size={16} className={isExpanded && panelView === "actions" ? "-rotate-90" : ""} />
                        </button>
                        <button
                          onClick={() => toggleRow(r.id, "report")}
                          title="التقرير"
                          className={`p-1.5 rounded-lg transition-colors ${
                            isExpanded && panelView === "report" ? "bg-emerald-100 text-emerald-600" : "text-slate-400 hover:bg-slate-100"
                          }`}
                        >
                          <FileText size={16} />
                        </button>
                        <button
                          onClick={() => toggleRow(r.id, "details")}
                          title="عرض التفاصيل"
                          className={`p-1.5 rounded-lg transition-colors ${
                            isExpanded && panelView === "details" ? "bg-emerald-100 text-emerald-600" : "text-slate-400 hover:bg-slate-100"
                          }`}
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr className="bg-slate-50/70">
                      <td colSpan={9} className="px-6 py-4">
                        {panelView === "actions" && (
                          <div>
                            <h5 className="text-sm font-bold text-slate-700 mb-3">الإجراءات المتخذة</h5>
                            <ol className="space-y-2.5 border-r-2 border-emerald-200 pr-4">
                              {getActionsForType(typeLabel).map((step, i) => (
                                <li key={i} className="relative text-sm">
                                  <span className="absolute -right-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                  <span className="text-slate-500">{step.actor}</span>
                                  <span className="text-slate-700"> — {step.action}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}

                        {panelView === "details" && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-slate-400 mb-1">الإحداثيات</p>
                              <p className="text-slate-700 font-mono text-xs">{r.lat}, {r.lng}</p>
                            </div>
                            <div>
                              <p className="text-slate-400 mb-1">مصدر البلاغ</p>
                              <p className="text-slate-700">نظام الرصد اللحظي</p>
                            </div>
                            <div>
                              <p className="text-slate-400 mb-1">الأمانة</p>
                              <p className="text-slate-700">أمانة المدينة المنورة</p>
                            </div>
                            <div>
                              <p className="text-slate-400 mb-1">آلية الاستلام</p>
                              <p className="text-slate-700">النظام الآلي</p>
                            </div>
                          </div>
                        )}

                        {panelView === "report" && (
                          <div className="text-sm text-slate-500">
                            {r.status === "Closed" ? (
                              <p>
                                تم إغلاق البلاغ بعد تنفيذ الإجراءات اللازمة والتأكد من زوال الخطر.
                                لا توجد ملاحظات إضافية معلّقة على هذا البلاغ.
                              </p>
                            ) : (
                              <p>لم يتم إرفاق تقرير ما بعد الإجراء بعد — البلاغ لا يزال قيد المعالجة.</p>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
