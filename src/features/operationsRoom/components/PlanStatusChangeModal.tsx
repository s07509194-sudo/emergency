import { useState } from "react";
import { X, ArrowUpCircle, ArrowDownCircle } from "lucide-react";

interface PlanStatusChangeModalProps {
  mode: "escalate" | "de_escalate";
  actionLabel: string;
  onConfirm: (reason: string) => void;
  onClose: () => void;
}

/**
 * أي تصعيد أو خفض تصعيد لازم يكون له سبب موثّق — هاد شرط أساسي
 * لجودة تقرير ما بعد الحادث لاحقًا، فما بنسمح بتأكيد الإجراء بدون سبب.
 */
export default function PlanStatusChangeModal({
  mode,
  actionLabel,
  onConfirm,
  onClose,
}: PlanStatusChangeModalProps) {
  const [reason, setReason] = useState("");
  const isEscalate = mode === "escalate";

  const handleConfirm = () => {
    if (!reason.trim()) return;
    onConfirm(reason.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 sm:p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {isEscalate ? (
              <ArrowUpCircle size={22} className="text-orange-500" />
            ) : (
              <ArrowDownCircle size={22} className="text-sky-500" />
            )}
            <h3 className="text-lg font-bold text-slate-800">{actionLabel}</h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <label className="block text-sm font-medium text-slate-600 mb-2">
          سبب الإجراء <span className="text-red-500">*</span>
        </label>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          placeholder="مثال: ارتفاع منسوب الأمطار عن الحد الحرج بمنطقة العوالي..."
          className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
        />

        {!reason.trim() && (
          <p className="mt-1.5 text-xs text-slate-400">
            السبب إجباري — يُستخدم لاحقًا في سجل القرارات وتقرير ما بعد الحادث.
          </p>
        )}

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            إلغاء
          </button>

          <button
            type="button"
            disabled={!reason.trim()}
            onClick={handleConfirm}
            className={`flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition ${
              isEscalate
                ? "bg-orange-500 hover:bg-orange-600"
                : "bg-sky-500 hover:bg-sky-600"
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            تأكيد {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
