import { useEffect, useState } from "react";
import { Clock3, ArrowLeftRight } from "lucide-react";

import { attendanceService, getCurrentShiftKey } from "../../../services/attendanceService";
import type { AttendanceSummary, ShiftDefinition } from "../../../types/operationsRoom";

interface ShiftScheduleCardProps {
  onOpenShiftForm?: () => void;
}

export default function ShiftScheduleCard({ onOpenShiftForm }: ShiftScheduleCardProps) {
  const [shifts, setShifts] = useState<ShiftDefinition[]>([]);
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);

  const currentShiftKey = getCurrentShiftKey();

  useEffect(() => {
    attendanceService.getShiftDefinitions().then(setShifts);
    attendanceService.getAttendanceSummary().then(setSummary);
  }, []);

  const currentShift = shifts.find((s) => s.key === currentShiftKey);
  const present = summary ? summary.present + summary.late : 0;
  const shortage = currentShift
    ? Math.max(0, currentShift.requiredStaffCount - present)
    : 0;

  return (
    <div className="rounded-2xl bg-white border-2 border-slate-200 shadow-md p-4 sm:p-5 lg:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 shrink-0 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
            <Clock3 size={18} />
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-black">
            جدول المناوبات
          </h3>
        </div>

        {onOpenShiftForm && (
          <button
            type="button"
            onClick={onOpenShiftForm}
            className="flex items-center gap-1.5 text-sm font-bold text-blue-700 hover:bg-blue-50 border-2 border-blue-200 rounded-lg px-3 py-1.5 transition"
          >
            <ArrowLeftRight size={15} />
            تسليم الشيفت
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {shifts.map((shift) => {
          const isActive = shift.key === currentShiftKey;
          return (
            <div
              key={shift.key}
              className={`rounded-xl border-2 p-3 ${
                isActive
                  ? "border-emerald-400 bg-emerald-50"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-extrabold text-black">
                  {shift.label}
                </span>
                {isActive && (
                  <span className="text-[11px] font-bold text-white bg-emerald-600 px-2 py-0.5 rounded-full">
                    الحالية
                  </span>
                )}
              </div>
              <p className="text-xs text-blue-700 font-semibold">
                {shift.startTime} ← {shift.endTime}
              </p>
              <p className="text-xs text-blue-700 font-semibold mt-1">
                المطلوب: <span className="text-black font-extrabold">{shift.requiredStaffCount}</span>
                {isActive && summary && (
                  <> · الحاضر: <span className="text-black font-extrabold">{present}</span></>
                )}
              </p>
            </div>
          );
        })}
      </div>

      {currentShift && shortage > 0 && (
        <p className="mt-4 text-sm font-bold text-orange-800 bg-orange-100 border-2 border-orange-300 rounded-xl px-3 py-2">
          ⚠️ يوجد نقص في المناوبة الحالية: {shortage} موظف
        </p>
      )}
    </div>
  );
}
