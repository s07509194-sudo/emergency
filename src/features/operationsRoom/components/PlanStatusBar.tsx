import { useState } from "react";
import { ArrowUpCircle, ArrowDownCircle, History } from "lucide-react";

import { useOperationsRoom } from "../../../context/OperationsRoomContext";
import {
  PLAN_STATUS_META,
  getNextActionLabel,
  formatDateTime,
} from "../utils/statusMeta";
import PlanStatusChangeModal from "./PlanStatusChangeModal";

// TODO: استبدل هاد بالمستخدم الحقيقي من نظام الصلاحيات لما يتوفر الـ backend
const CURRENT_USER = "المشرف الحالي";

interface PlanStatusBarProps {
  onShowHistory: () => void;
}

export default function PlanStatusBar({ onShowHistory }: PlanStatusBarProps) {
  const { planStatus, isLoading, escalate, deEscalate } = useOperationsRoom();
  const [modalMode, setModalMode] = useState<"escalate" | "de_escalate" | null>(
    null
  );

  if (isLoading || !planStatus) {
    return (
      <div className="rounded-2xl bg-white border border-slate-100 shadow-md p-5 animate-pulse h-24" />
    );
  }

  const meta = PLAN_STATUS_META[planStatus.currentLevel];
  const actions = getNextActionLabel(planStatus.currentLevel);

  const handleConfirm = async (reason: string) => {
    if (modalMode === "escalate") {
      await escalate(reason, CURRENT_USER);
    } else if (modalMode === "de_escalate") {
      await deEscalate(reason, CURRENT_USER);
    }
    setModalMode(null);
  };

  return (
    <>
      <div className="rounded-2xl bg-white border border-slate-100 shadow-md p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full ${meta.dotColor} opacity-75`}
              />
              <span
                className={`relative inline-flex rounded-full h-3 w-3 ${meta.dotColor}`}
              />
            </span>

            <div>
              <p className="text-xs text-slate-400 mb-0.5">حالة الخطة الحالية</p>
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-bold px-2.5 py-0.5 rounded-full border ${meta.badgeClass}`}
                >
                  {meta.label}
                  {planStatus.escalationTier > 1
                    ? ` (مستوى ${planStatus.escalationTier})`
                    : ""}
                </span>
              </div>
            </div>
          </div>

          <div className="text-xs sm:text-sm text-slate-500 text-center">
            <p>
              مفعّلة منذ:{" "}
              <span className="font-semibold text-slate-700">
                {formatDateTime(planStatus.activeSince)}
              </span>
            </p>
            <p className="mt-0.5">
              بواسطة:{" "}
              <span className="font-semibold text-slate-700">
                {planStatus.lastChangedBy}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {actions.canEscalate && (
              <button
                type="button"
                onClick={() => setModalMode("escalate")}
                className="flex items-center gap-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-3.5 py-2 transition"
              >
                <ArrowUpCircle size={16} />
                {actions.escalateLabel}
              </button>
            )}

            {actions.canDeEscalate && (
              <button
                type="button"
                onClick={() => setModalMode("de_escalate")}
                className="flex items-center gap-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-3.5 py-2 transition"
              >
                <ArrowDownCircle size={16} />
                {actions.deEscalateLabel}
              </button>
            )}

            <button
              type="button"
              onClick={onShowHistory}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold px-3.5 py-2 hover:bg-slate-50 transition"
            >
              <History size={16} />
              السجل الزمني
            </button>
          </div>
        </div>
      </div>

      {modalMode && (
        <PlanStatusChangeModal
          mode={modalMode}
          actionLabel={
            modalMode === "escalate"
              ? actions.escalateLabel
              : actions.deEscalateLabel
          }
          onConfirm={handleConfirm}
          onClose={() => setModalMode(null)}
        />
      )}
    </>
  );
}
