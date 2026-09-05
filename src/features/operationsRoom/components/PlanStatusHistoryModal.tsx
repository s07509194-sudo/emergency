import { X } from "lucide-react";
import { useOperationsRoom } from "../../../context/OperationsRoomContext";
import { PLAN_STATUS_META, formatDateTime } from "../utils/statusMeta";

export default function PlanStatusHistoryModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const { planStatus } = useOperationsRoom();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-2xl bg-white p-5 sm:p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">
            السجل الزمني لحالة الخطة
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <ol className="relative border-e-2 border-slate-100 pe-4 space-y-5">
          {planStatus?.history.map((event) => {
            const meta = PLAN_STATUS_META[event.toLevel];
            return (
              <li key={event.id} className="relative">
                <span
                  className={`absolute -end-[21px] top-1 h-3 w-3 rounded-full ${meta.dotColor}`}
                />
                <p className="text-xs text-slate-400">
                  {formatDateTime(event.timestamp)}
                </p>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">
                  {event.fromLevel
                    ? `${PLAN_STATUS_META[event.fromLevel].label} ← ${meta.label}`
                    : meta.label}
                </p>
                <p className="text-sm text-slate-500 mt-0.5">{event.reason}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  بواسطة: {event.changedBy}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
