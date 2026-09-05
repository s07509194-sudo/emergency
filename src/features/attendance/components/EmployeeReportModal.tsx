import { useEffect, useState } from "react";
import { X, Printer, FileWarning } from "lucide-react";

import { attendanceService } from "../../../services/attendanceService";
import type { EmployeeActivityReport } from "../../../types/operationsRoom";

function formatEntryTime(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("ar-SA", { dateStyle: "short", timeStyle: "short" });
}

function formatTotalHours(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours} ساعة و${minutes} دقيقة`;
}

export default function EmployeeReportModal({
  query,
  onClose,
}: {
  query: string;
  onClose: () => void;
}) {
  const [report, setReport] = useState<EmployeeActivityReport | null | undefined>(undefined);

  useEffect(() => {
    attendanceService.getEmployeeReport(query).then(setReport);
  }, [query]);

  const handlePrint = () => window.print();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 print:bg-white print:backdrop-blur-none">
      <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-5 sm:p-6 shadow-2xl print:shadow-none print:max-h-none">
        <div className="flex items-center justify-between mb-4 print:hidden">
          <h3 className="text-lg font-extrabold text-black">تقرير أعمال الموظف</h3>
          <div className="flex items-center gap-2">
            {report && (
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 border-2 border-slate-300 rounded-lg px-3 py-1.5 font-bold text-blue-700"
              >
                <Printer size={15} />
                طباعة
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {report === undefined && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 rounded-xl bg-slate-50 animate-pulse" />
            ))}
          </div>
        )}

        {report === null && (
          <div className="flex flex-col items-center gap-2 py-10 text-blue-700">
            <FileWarning size={28} />
            <p className="text-sm">لا يوجد سجلات أعمال مطابقة لـ "{query}"</p>
          </div>
        )}

        {report && (
          <>
            <div className="rounded-xl bg-blue-50 border-2 border-blue-200 p-4 mb-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-lg font-extrabold text-black">{report.employeeName}</p>
                  <p className="text-sm text-blue-700 font-semibold">
                    {report.role} · كود: {report.employeeCode}
                  </p>
                </div>
                <div className="text-end">
                  <p className="text-sm text-blue-700 font-semibold">
                    إجمالي المهام:{" "}
                    <span className="font-extrabold text-black">{report.totalTasks}</span>
                  </p>
                  <p className="text-sm text-blue-700 font-semibold">
                    إجمالي ساعات العمل المسجّلة:{" "}
                    <span className="font-extrabold text-black">
                      {formatTotalHours(report.totalMinutesWorked)}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <ol className="space-y-3">
              {report.entries.map((entry) => (
                <li key={entry.id} className="rounded-xl border-2 border-slate-200 p-3 bg-white">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <span className="text-xs text-blue-700 font-bold">
                      {formatEntryTime(entry.checkInTime)} ← {formatEntryTime(entry.checkOutTime)}
                    </span>
                    {!entry.checkOutTime && (
                      <span className="text-[11px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                        لم يُقفل بعد
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-black font-medium">{entry.taskDescription}</p>
                </li>
              ))}
            </ol>
          </>
        )}
      </div>
    </div>
  );
}
