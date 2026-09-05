import amanahLogo from "../../../../assets/images/amanah-logo.png";
import type { DailyShiftAttendanceReport, Employee } from "../../../../types/operationsRoom";
import { LEAVE_TYPE_META } from "./leaveTypeMeta";

interface DailyAttendanceReportViewProps {
  report: DailyShiftAttendanceReport;
  allEmployees: Employee[];
  coordinators: Employee[];
  generatedAt: string;
}

export default function DailyAttendanceReportView({
  report,
  allEmployees,
  coordinators,
  generatedAt,
}: DailyAttendanceReportViewProps) {
  const supervisorName = coordinators.find((c) => c.id === report.supervisorId)?.name ?? "—";
  const shiftEmployees = report.shiftEmployeeIds
    .map((id) => allEmployees.find((e) => e.id === id))
    .filter((e): e is Employee => Boolean(e));

  return (
    <div className="bg-white text-slate-800" dir="rtl">
      {/* ترويسة رسمية */}
      <div className="flex items-start justify-between border-b-2 border-slate-800 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <img src={amanahLogo} alt="شعار أمانة المدينة المنورة" className="h-12 w-auto object-contain" />
          <div>
            <p className="text-lg font-extrabold text-slate-800">أمانة المدينة المنورة</p>
            <p className="text-sm text-slate-500">
              مشروع تشغيل وتطوير إدارة الطوارئ لأمانة منطقة المدينة المنورة
            </p>
          </div>
        </div>
        <div className="text-end">
          <p className="text-base font-bold text-slate-700">التقرير اليومي</p>
          <p className="text-xs text-slate-400 mt-0.5">التاريخ: {report.date}</p>
          <p className="text-xs text-slate-400 mt-0.5">تاريخ الإصدار: {generatedAt}</p>
        </div>
      </div>

      <p className="text-sm font-bold text-slate-700 mb-5">
        مشرف الفترة ({report.shiftKey}): <span className="font-extrabold">{supervisorName}</span>
      </p>

      {/* الموظفين في الشفت */}
      <div className="mb-6">
        <p className="text-sm font-bold text-slate-700 mb-2">الموظفين في الشفت:</p>
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-slate-800 text-white">
              <th className="py-1.5 px-2 text-center font-semibold w-10">م</th>
              <th className="py-1.5 px-2 text-start font-semibold">اسم الموظف</th>
            </tr>
          </thead>
          <tbody>
            {shiftEmployees.length === 0 ? (
              <tr>
                <td colSpan={2} className="py-3 px-2 text-center text-slate-400">
                  لا يوجد موظفون مضافون
                </td>
              </tr>
            ) : (
              shiftEmployees.map((emp, index) => (
                <tr key={emp.id} className="border-b border-slate-100 even:bg-slate-50/60">
                  <td className="py-1.5 px-2 text-center">{index + 1}</td>
                  <td className="py-1.5 px-2 font-medium">{emp.name}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* الإجازة الأسبوعية */}
      <div className="mb-6">
        <p className="text-sm font-bold text-slate-700 mb-2">الإجازة الأسبوعية:</p>
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-slate-800 text-white">
              <th className="py-1.5 px-2 text-center font-semibold w-10">م</th>
              <th className="py-1.5 px-2 text-start font-semibold">اسم الموظف</th>
              <th className="py-1.5 px-2 text-start font-semibold">تاريخ الإجازة</th>
              <th className="py-1.5 px-2 text-start font-semibold">الملاحظات</th>
            </tr>
          </thead>
          <tbody>
            {report.weeklyLeaves.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-3 px-2 text-center text-slate-400">
                  لا يوجد
                </td>
              </tr>
            ) : (
              report.weeklyLeaves.map((leave, index) => (
                <tr key={leave.id} className="border-b border-slate-100 even:bg-slate-50/60">
                  <td className="py-1.5 px-2 text-center">{index + 1}</td>
                  <td className="py-1.5 px-2 font-medium">{leave.employeeName}</td>
                  <td className="py-1.5 px-2">{leave.leaveDate}</td>
                  <td className="py-1.5 px-2 font-semibold text-rose-600">
                    {LEAVE_TYPE_META[leave.leaveType].label}
                    {leave.notes && ` — ${leave.notes}`}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* الغياب */}
      <div className="mb-4">
        <p className="text-sm font-bold text-slate-700 mb-2">الغياب:</p>
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-slate-800 text-white">
              <th className="py-1.5 px-2 text-center font-semibold w-10">م</th>
              <th className="py-1.5 px-2 text-start font-semibold">اسم الموظف</th>
              <th className="py-1.5 px-2 text-start font-semibold">تاريخ الغياب</th>
              <th className="py-1.5 px-2 text-start font-semibold">سبب الغياب</th>
              <th className="py-1.5 px-2 text-start font-semibold">الملاحظات</th>
            </tr>
          </thead>
          <tbody>
            {report.absences.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-3 px-2 text-center font-semibold text-slate-500">
                  لا يوجد
                </td>
              </tr>
            ) : (
              report.absences.map((absence, index) => (
                <tr key={absence.id} className="border-b border-slate-100 even:bg-slate-50/60">
                  <td className="py-1.5 px-2 text-center">{index + 1}</td>
                  <td className="py-1.5 px-2 font-medium">{absence.employeeName}</td>
                  <td className="py-1.5 px-2">{absence.absenceDate}</td>
                  <td className="py-1.5 px-2">{absence.reason || "—"}</td>
                  <td className="py-1.5 px-2">{absence.notes || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-400 text-center">
        تم إصدار هذا التقرير آليًا من منصة إدارة الأزمات والطوارئ — أمانة المدينة المنورة
      </div>
    </div>
  );
}
