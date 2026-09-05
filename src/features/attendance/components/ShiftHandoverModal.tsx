import { useState } from "react";
import { X } from "lucide-react";

import { attendanceService } from "../../../services/attendanceService";
import type { ShiftKey } from "../../../types/operationsRoom";

const SHIFT_ORDER: ShiftKey[] = ["morning", "evening", "night"];
const SHIFT_LABELS: Record<ShiftKey, string> = {
  morning: "الصباحية",
  evening: "المسائية",
  night: "الليلية",
};

// TODO: استبدل هاد بالمستخدم الحقيقي من نظام الصلاحيات لما يتوفر الـ backend
const CURRENT_USER = "المشرف الحالي";

export default function ShiftHandoverModal({
  currentShiftKey,
  onClose,
}: {
  currentShiftKey: ShiftKey;
  onClose: () => void;
}) {
  const nextShiftKey =
    SHIFT_ORDER[(SHIFT_ORDER.indexOf(currentShiftKey) + 1) % SHIFT_ORDER.length];

  const [receivedBy, setReceivedBy] = useState("");
  const [summary, setSummary] = useState("");
  const [openItems, setOpenItems] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const canSubmit = receivedBy.trim() && summary.trim();

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSaving(true);
    await attendanceService.submitHandover({
      fromShift: currentShiftKey,
      toShift: nextShiftKey,
      handedOverBy: CURRENT_USER,
      receivedBy: receivedBy.trim(),
      summary: summary.trim(),
      openItems: openItems.trim(),
    });
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 sm:p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">
            تسليم المناوبة: {SHIFT_LABELS[currentShiftKey]} ← {SHIFT_LABELS[nextShiftKey]}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">
              المسؤول المستلم <span className="text-red-500">*</span>
            </label>
            <input
              value={receivedBy}
              onChange={(e) => setReceivedBy(e.target.value)}
              placeholder="اسم مشرف المناوبة القادمة"
              className="w-full rounded-xl border border-slate-200 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">
              ملخص ما صار بالمناوبة <span className="text-red-500">*</span>
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={3}
              placeholder="أهم الأحداث والإجراءات خلال المناوبة..."
              className="w-full rounded-xl border border-slate-200 p-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">
              نقاط معلّقة تحتاج متابعة
            </label>
            <textarea
              value={openItems}
              onChange={(e) => setOpenItems(e.target.value)}
              rows={2}
              placeholder="أي شيء لازم المناوبة القادمة تنتبه له..."
              className="w-full rounded-xl border border-slate-200 p-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
        </div>

        <p className="mt-2 text-xs text-slate-400">
          لا يمكن إغلاق المناوبة الحالية رسميًا بدون تعبئة هالنموذج.
        </p>

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            إلغاء
          </button>
          <button
            type="button"
            disabled={!canSubmit || isSaving}
            onClick={handleSubmit}
            className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 text-sm font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSaving ? "جارٍ الحفظ..." : "تأكيد التسليم"}
          </button>
        </div>
      </div>
    </div>
  );
}
