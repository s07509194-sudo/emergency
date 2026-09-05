import { useRef, useState } from "react";
import {
  FileSignature,
  CheckCircle2,
  XCircle,
  Lock,
  Save,
  Printer,
  Download,
  Loader2,
  History,
} from "lucide-react";

import type { Employee, ShiftSession } from "../../../../types/operationsRoom";
import { formatDateTime } from "../../../operationsRoom/utils/statusMeta";
import { printShiftSessionReport } from "../../../../utils/printShiftSessionReport";
import { exportShiftSessionReportPdf } from "../../../../utils/shiftSessionReportPdf";
import ShiftSessionReportView from "./ShiftSessionReportView";
import PreviousShiftModal from "./PreviousShiftModal";

interface EndOfShiftSectionProps {
  session: ShiftSession;
  coordinators: Employee[];
  onClose: (input: { closedBy: string; equipmentHandedOverInGoodCondition: boolean }) => void;
}

function nowFormatted(): string {
  return new Date().toLocaleString("ar-SA", { dateStyle: "medium", timeStyle: "short" });
}

export default function EndOfShiftSection({ session, coordinators, onClose }: EndOfShiftSectionProps) {
  const [equipmentOk, setEquipmentOk] = useState<boolean | null>(null);
  const [closedBySignature, setClosedBySignature] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [showPreviousShift, setShowPreviousShift] = useState(false);

  const reportRef = useRef<HTMLDivElement>(null);

  const liaisonNames = coordinators
    .filter((c) => session.liaisonOfficerIds.includes(c.id))
    .map((c) => c.name)
    .join(" - ");

  const supervisorName = coordinators.find((c) => c.id === session.shiftSupervisorId)?.name;

  const canClose = equipmentOk !== null && closedBySignature.trim().length > 0;

  const handleClose = async () => {
    if (!canClose || equipmentOk === null) return;
    setIsClosing(true);
    await onClose({
      closedBy: closedBySignature.trim(),
      equipmentHandedOverInGoodCondition: equipmentOk,
    });
    setIsClosing(false);
  };

  const handleSave = () => {
    // البيانات فعليًا محفوظة لحظيًا مع كل تعديل — هالزر يعطي تأكيد بصري صريح للمستخدم
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const handleExportPdf = async () => {
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
    <div className="rounded-2xl bg-white border-2 border-slate-200 shadow-md p-4 sm:p-5 lg:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 shrink-0 rounded-xl bg-rose-100 flex items-center justify-center text-rose-700">
          <FileSignature size={18} />
        </div>
        <h3 className="text-base sm:text-lg font-extrabold text-black">نهاية الشفت</h3>
      </div>

      {session.status === "closed" ? (
        <div className="rounded-xl bg-emerald-50 border-2 border-emerald-200 p-4">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700 mb-2">
            <Lock size={15} />
            تم تسليم هالشفت رسميًا
          </p>
          <p className="text-sm text-black font-medium">
            سُلّم بواسطة: <span className="font-semibold">{session.closedBy}</span>
            {session.closedAt && ` — ${formatDateTime(session.closedAt)}`}
          </p>
          <p className="text-sm text-black font-medium mt-1">
            حالة الأجهزة:{" "}
            <span className="font-semibold">
              {session.equipmentHandedOverInGoodCondition ? "تم تسليمها بحالة ممتازة ✅" : "يوجد ملاحظة ⚠️"}
            </span>
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-blue-50 border-2 border-blue-200 p-3">
              <p className="text-xs font-bold text-blue-700 mb-1">ضابط الاتصال</p>
              <p className="text-black font-bold">{liaisonNames || "—"}</p>
            </div>
            <div className="rounded-xl bg-blue-50 border-2 border-blue-200 p-3">
              <p className="text-xs font-bold text-blue-700 mb-1">المشرف المناوب</p>
              <p className="text-black font-bold">{supervisorName || "—"}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-extrabold text-black mb-2">
              تمت تسليم جميع الأجهزة بحالة ممتازة؟
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEquipmentOk(true)}
                className={`flex items-center gap-1.5 text-sm font-semibold rounded-xl px-3.5 py-2 border-2 transition ${
                  equipmentOk === true
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "border-slate-300 text-black hover:bg-slate-50"
                }`}
              >
                <CheckCircle2 size={15} />
                نعم
              </button>
              <button
                type="button"
                onClick={() => setEquipmentOk(false)}
                className={`flex items-center gap-1.5 text-sm font-semibold rounded-xl px-3.5 py-2 border-2 transition ${
                  equipmentOk === false
                    ? "bg-red-500 text-white border-red-500"
                    : "border-slate-300 text-black hover:bg-slate-50"
                }`}
              >
                <XCircle size={15} />
                لا، يوجد ملاحظة
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-extrabold text-black mb-1.5">
              توقيع المُسلِّم (اكتب اسمك كإقرار)
            </label>
            <input
              value={closedBySignature}
              onChange={(e) => setClosedBySignature(e.target.value)}
              placeholder="اسم المشرف المناوب أو ضابط الاتصال المسؤول"
              className="w-full rounded-xl border-2 border-slate-300 px-3 py-2.5 text-sm font-semibold text-black focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <button
            type="button"
            disabled={!canClose || isClosing}
            onClick={handleClose}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white text-sm font-semibold py-2.5 transition"
          >
            <Lock size={15} />
            {isClosing ? "جارٍ الإغلاق..." : "إغلاق وتسليم الشفت رسميًا"}
          </button>
        </div>
      )}

      {/* إجراءات الحفظ والطباعة والتنزيل + الاطلاع على الشفت السابق */}
      <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t-2 border-slate-200">
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-1.5 text-sm font-bold text-blue-700 border-2 border-blue-300 hover:bg-blue-50 rounded-xl px-3.5 py-2 transition"
        >
          <Save size={15} />
          {savedFeedback ? "✅ تم الحفظ" : "حفظ التقرير"}
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-1.5 text-sm font-bold text-blue-700 border-2 border-blue-300 hover:bg-blue-50 rounded-xl px-3.5 py-2 transition"
        >
          <Printer size={15} />
          طباعة
        </button>

        <button
          type="button"
          onClick={handleExportPdf}
          disabled={isExporting}
          className="flex items-center gap-1.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl px-3.5 py-2 transition"
        >
          {isExporting ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
          {isExporting ? "جارٍ إنشاء التقرير..." : "PDF التقرير الرسمي"}
        </button>

        <div className="flex-1" />

        <button
          type="button"
          onClick={() => setShowPreviousShift(true)}
          className="flex items-center gap-1.5 text-sm font-bold text-blue-700 border-2 border-blue-300 hover:bg-blue-50 rounded-xl px-3.5 py-2 transition"
        >
          <History size={15} />
          تقرير الشفت السابق
        </button>
      </div>

      {/* المعاينة القابلة للطباعة والتصدير — تحتوي شعار أمانة المدينة المنورة */}
      <div className="mt-4 border-2 border-slate-200 rounded-2xl p-4 sm:p-5 overflow-x-auto print:border-none print:p-0">
        <div ref={reportRef}>
          <ShiftSessionReportView session={session} coordinators={coordinators} generatedAt={nowFormatted()} />
        </div>
      </div>

      {showPreviousShift && (
        <PreviousShiftModal
          currentDate={session.date}
          currentShiftKey={session.shiftKey}
          coordinators={coordinators}
          onClose={() => setShowPreviousShift(false)}
        />
      )}
    </div>
  );
}
