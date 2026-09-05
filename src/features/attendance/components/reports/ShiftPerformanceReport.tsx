import { Users, CheckCircle2, Clock, Lock, AlertTriangle } from "lucide-react";

import amanahLogo from "../../../../assets/images/amanah-logo.png";
import type { ShiftDaySummary, ReportTotals } from "../../../../services/reportService";
import { ATTENDANCE_STATUS_META } from "../../../operationsRoom/utils/statusMeta";

interface ShiftPerformanceReportProps {
  title: string;
  rangeLabel: string;
  generatedAt: string;
  summaries: ShiftDaySummary[];
  totals: ReportTotals;
}

const SHIFT_KEY_LABEL: Record<string, string> = {
  L: "الليلي (L)",
  A: "الصباح (A)",
  P: "الظهيرة (P)",
  N: "المسائي (N)",
};

function sessionStatusBadge(summary: ShiftDaySummary) {
  if (!summary.session) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
        لم يبدأ
      </span>
    );
  }
  if (summary.session.status === "closed") {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
        <Lock size={10} />
        مغلق
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-700 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
      <Clock size={10} />
      مفتوح
    </span>
  );
}

export default function ShiftPerformanceReport({
  title,
  rangeLabel,
  generatedAt,
  summaries,
  totals,
}: ShiftPerformanceReportProps) {
  const statusColumns: { key: keyof ReportTotals; label: string }[] = [
    { key: "present", label: ATTENDANCE_STATUS_META.present.label },
    { key: "absent", label: ATTENDANCE_STATUS_META.absent.label },
    { key: "late", label: ATTENDANCE_STATUS_META.late.label },
    { key: "onLeave", label: ATTENDANCE_STATUS_META.on_leave.label },
    { key: "dayOff", label: ATTENDANCE_STATUS_META.day_off.label },
    { key: "fieldMission", label: ATTENDANCE_STATUS_META.field_mission.label },
    { key: "notCheckedIn", label: ATTENDANCE_STATUS_META.not_checked_in.label },
  ];

  return (
    <div className="bg-white text-slate-800" dir="rtl">
      {/* ترويسة التقرير */}
      <div className="flex items-start justify-between border-b-2 border-slate-800 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <img src={amanahLogo} alt="شعار أمانة المدينة المنورة" className="h-12 w-auto object-contain" />
          <div>
            <p className="text-lg font-extrabold text-slate-800">
              مركز الطوارئ والأزمات — المدينة المنورة
            </p>
            <p className="text-sm text-slate-500">غرفة العمليات · تقرير أداء الشفتات</p>
          </div>
        </div>
        <div className="text-end">
          <p className="text-base font-bold text-slate-700">{title}</p>
          <p className="text-xs text-slate-400 mt-0.5">{rangeLabel}</p>
          <p className="text-xs text-slate-400 mt-0.5">تاريخ الإصدار: {generatedAt}</p>
        </div>
      </div>

      {/* مؤشرات عامة */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        <div className="rounded-xl border border-slate-200 p-3 text-center">
          <p className="text-2xl font-extrabold text-emerald-600">{totals.attendanceRatePercent}%</p>
          <p className="text-[11px] text-slate-500 mt-0.5">نسبة الحضور الإجمالية</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-3 text-center">
          <p className="text-2xl font-extrabold text-slate-700">{totals.closedShifts}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">شفتات مغلقة رسميًا</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-3 text-center">
          <p className="text-2xl font-extrabold text-orange-600">{totals.openShifts}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">شفتات مفتوحة حاليًا</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-3 text-center">
          <p className="text-2xl font-extrabold text-slate-400">{totals.notStartedShifts}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">شفتات لم تبدأ</p>
        </div>
      </div>

      {/* ملخص الحالات */}
      <div className="mb-5">
        <p className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-1.5">
          <Users size={15} />
          ملخص حالات الحضور بالفترة
        </p>
        <div className="grid grid-cols-7 gap-2">
          {statusColumns.map((col) => (
            <div key={col.key} className="rounded-lg bg-slate-50 border border-slate-100 p-2 text-center">
              <p className="text-base font-bold text-slate-800">{totals[col.key] as number}</p>
              <p className="text-[10px] text-slate-500">{col.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* جدول تفصيلي لكل شفت بكل يوم */}
      <div className="mb-5">
        <p className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-1.5">
          <CheckCircle2 size={15} />
          تفاصيل الشفتات
        </p>
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-slate-800 text-white">
              <th className="py-1.5 px-2 text-start font-semibold">التاريخ</th>
              <th className="py-1.5 px-2 text-start font-semibold">الشفت</th>
              <th className="py-1.5 px-2 text-start font-semibold">الحالة</th>
              <th className="py-1.5 px-2 text-start font-semibold">المشرف المناوب</th>
              <th className="py-1.5 px-2 text-center font-semibold">حاضر</th>
              <th className="py-1.5 px-2 text-center font-semibold">غياب</th>
              <th className="py-1.5 px-2 text-center font-semibold">متأخر</th>
              <th className="py-1.5 px-2 text-center font-semibold">إجازة/أوف</th>
              <th className="py-1.5 px-2 text-center font-semibold">قنوات مُختبرة</th>
              <th className="py-1.5 px-2 text-center font-semibold">بريد</th>
              <th className="py-1.5 px-2 text-center font-semibold">الأجهزة</th>
            </tr>
          </thead>
          <tbody>
            {summaries.map((s) => (
              <tr key={`${s.date}_${s.shiftKey}`} className="border-b border-slate-100 even:bg-slate-50/60">
                <td className="py-1.5 px-2 whitespace-nowrap">{s.date}</td>
                <td className="py-1.5 px-2 whitespace-nowrap font-semibold">
                  {SHIFT_KEY_LABEL[s.shiftKey] ?? s.shiftKey}
                </td>
                <td className="py-1.5 px-2">{sessionStatusBadge(s)}</td>
                <td className="py-1.5 px-2 whitespace-nowrap">
                  {s.session?.shiftSupervisorId ? "✓ محدد" : "—"}
                </td>
                <td className="py-1.5 px-2 text-center">{s.statusCounts.present}</td>
                <td className="py-1.5 px-2 text-center">{s.statusCounts.absent}</td>
                <td className="py-1.5 px-2 text-center">{s.statusCounts.late}</td>
                <td className="py-1.5 px-2 text-center">
                  {s.statusCounts.on_leave + s.statusCounts.day_off}
                </td>
                <td className="py-1.5 px-2 text-center">{s.channelsTestedCount} / 6</td>
                <td className="py-1.5 px-2 text-center">{s.emailsCount}</td>
                <td className="py-1.5 px-2 text-center">
                  {s.session?.equipmentHandedOverInGoodCondition === true && "✅"}
                  {s.session?.equipmentHandedOverInGoodCondition === false && (
                    <AlertTriangle size={13} className="inline text-orange-500" />
                  )}
                  {(s.session?.equipmentHandedOverInGoodCondition ?? null) === null && "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-400 text-center">
        تم إصدار هذا التقرير آليًا من منصة إدارة الأزمات والطوارئ — المدينة المنورة
      </div>
    </div>
  );
}
