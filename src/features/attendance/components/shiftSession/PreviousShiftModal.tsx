import { useEffect, useRef, useState } from "react";
import { X, Printer, Download, Loader2 } from "lucide-react";

import { shiftSessionService, getPreviousShift } from "../../../../services/shiftSessionService";
import { printShiftSessionReport } from "../../../../utils/printShiftSessionReport";
import { exportShiftSessionReportPdf } from "../../../../utils/shiftSessionReportPdf";
import type { Employee, ShiftKey, ShiftSession } from "../../../../types/operationsRoom";
import ShiftSessionReportView from "./ShiftSessionReportView";

interface PreviousShiftModalProps {
  currentDate: string;
  currentShiftKey: ShiftKey;
  coordinators: Employee[];
  onClose: () => void;
}

function nowFormatted(): string {
  return new Date().toLocaleString("ar-SA", { dateStyle: "medium", timeStyle: "short" });
}

export default function PreviousShiftModal({
  currentDate,
  currentShiftKey,
  coordinators,
  onClose,
}: PreviousShiftModalProps) {
  const [session, setSession] = useState<ShiftSession | null | undefined>(undefined);
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const previous = getPreviousShift(currentDate, currentShiftKey);

  useEffect(() => {
    shiftSessionService.peekSession(previous.date, previous.shiftKey).then(setSession);
  }, [previous.date, previous.shiftKey]);

  const handleExportPdf = async () => {
    if (!session) return;
    setIsExporting(true);
    try {
      await exportShiftSessionReportPdf({ session, coordinators });
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    if (reportRef.current) printShiftSessionReport(reportRef.current);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 print:bg-white print:backdrop-blur-none">
      <div className="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-5 sm:p-6 shadow-2xl print:shadow-none print:max-h-none">
        <div className="flex items-center justify-between mb-4 print:hidden">
          <h3 className="text-lg font-extrabold text-black">
            تقرير تسليم الشفت السابق ({previous.shiftKey} — {previous.date})
          </h3>
          <div className="flex items-center gap-2">
            {session && (
              <>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 text-sm font-bold text-blue-700 hover:bg-blue-50 border-2 border-blue-300 rounded-lg px-3 py-1.5"
                >
                  <Printer size={15} />
                  طباعة
                </button>
                <button
                  type="button"
                  onClick={handleExportPdf}
                  disabled={isExporting}
                  className="flex items-center gap-1.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg px-3 py-1.5"
                >
                  {isExporting ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
                  {isExporting ? "جارٍ إنشاء التقرير..." : "PDF التقرير الرسمي"}
                </button>
              </>
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

        {session === undefined && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 rounded-xl bg-slate-50 animate-pulse" />
            ))}
          </div>
        )}

        {session === null && (
          <p className="text-sm font-bold text-blue-700 text-center py-10">
            لا يوجد تقرير محفوظ للشفت السابق ({previous.shiftKey} — {previous.date}) — لم يُفتح النموذج بعد.
          </p>
        )}

        {session && (
          <div ref={reportRef}>
            <ShiftSessionReportView session={session} coordinators={coordinators} generatedAt={nowFormatted()} />
          </div>
        )}
      </div>
    </div>
  );
}
