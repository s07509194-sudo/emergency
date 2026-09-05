import { useEffect, useState } from "react";
import { ClipboardList, Plus, Zap } from "lucide-react";

import { operationsRoomService } from "../../../services/operationsRoomService";
import type { Decision } from "../../../types/operationsRoom";
import { formatDateTime, PLAN_STATUS_META } from "../utils/statusMeta";

// TODO: استبدل هاد بالمستخدم الحقيقي من نظام الصلاحيات لما يتوفر الـ backend
const CURRENT_USER = "المشرف الحالي";

export default function DecisionLog() {
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [summary, setSummary] = useState("");
  const [details, setDetails] = useState("");

  const loadDecisions = async () => {
    setIsLoading(true);
    const data = await operationsRoomService.getDecisionLog();
    setDecisions(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadDecisions();
  }, []);

  const handleAdd = async () => {
    if (!summary.trim()) return;
    await operationsRoomService.addDecision({
      summary: summary.trim(),
      details: details.trim() || undefined,
      actor: CURRENT_USER,
    });
    setSummary("");
    setDetails("");
    setIsAdding(false);
    loadDecisions();
  };

  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-md p-4 sm:p-5 lg:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 shrink-0 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
            <ClipboardList size={18} />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-700">
            سجل القرارات
          </h3>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding((v) => !v)}
          className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 rounded-lg px-3 py-1.5 transition"
        >
          <Plus size={16} />
          تسجيل قرار
        </button>
      </div>

      {isAdding && (
        <div className="mb-4 rounded-xl border border-slate-200 p-3 space-y-2">
          <input
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="ملخص القرار (إجباري)"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="تفاصيل إضافية (اختياري)"
            rows={2}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-sm font-semibold text-slate-500 px-3 py-1.5 rounded-lg hover:bg-slate-50"
            >
              إلغاء
            </button>
            <button
              type="button"
              disabled={!summary.trim()}
              onClick={handleAdd}
              className="text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 px-3.5 py-1.5 rounded-lg"
            >
              حفظ
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 rounded-xl bg-slate-50 animate-pulse" />
          ))}
        </div>
      ) : (
        <ul className="space-y-3 max-h-80 overflow-y-auto">
          {decisions.map((decision) => (
            <li
              key={decision.id}
              className="flex items-start gap-3 rounded-xl border border-slate-100 p-3"
            >
              <div
                className={`mt-0.5 w-7 h-7 shrink-0 rounded-lg flex items-center justify-center ${
                  decision.source === "plan_status_change"
                    ? "bg-orange-50 text-orange-500"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                <Zap size={14} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800">
                  {decision.summary}
                </p>
                {decision.details && (
                  <p className="text-sm text-slate-500 mt-0.5">
                    {decision.details}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <span className="text-xs text-slate-400">
                    {formatDateTime(decision.timestamp)} · {decision.actor}
                  </span>
                  {decision.planLevelAtTime && (
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${PLAN_STATUS_META[decision.planLevelAtTime].badgeClass}`}
                    >
                      {PLAN_STATUS_META[decision.planLevelAtTime].label}
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
