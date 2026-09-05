import { useEffect, useState } from "react";
import { Radio } from "lucide-react";

import { attendanceService } from "../../../services/attendanceService";
import type { AttendanceRecord } from "../../../types/operationsRoom";
import { ATTENDANCE_STATUS_META } from "../../operationsRoom/utils/statusMeta";

const SHIFT_LABELS: Record<string, string> = {
  L: "الليلي (L)",
  A: "الصباح (A)",
  P: "الظهيرة (P)",
  N: "المسائي (N)",
};

export default function StaffingTable() {
  const [staffing, setStaffing] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    attendanceService.getOperationsRoomStaffing().then((data) => {
      setStaffing(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="rounded-2xl bg-white border-2 border-slate-200 shadow-md p-4 sm:p-5 lg:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 shrink-0 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700">
          <Radio size={18} />
        </div>
        <h3 className="text-base sm:text-lg font-extrabold text-black">
          قوة غرفة العمليات الحالية
        </h3>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-11 rounded-xl bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto -mx-1 rounded-xl border-2 border-slate-200">
          <table className="w-full text-sm min-w-[480px]">
            <thead>
              <tr className="bg-slate-900 text-white text-xs">
                <th className="text-start font-bold py-2.5 px-3">الموظف</th>
                <th className="text-start font-bold py-2.5 px-3">الوظيفة</th>
                <th className="text-start font-bold py-2.5 px-3">المناوبة</th>
                <th className="text-start font-bold py-2.5 px-3">الحالة</th>
                <th className="text-start font-bold py-2.5 px-3">وقت الدخول</th>
              </tr>
            </thead>
            <tbody>
              {staffing.map((row, index) => {
                const meta = ATTENDANCE_STATUS_META[row.status];
                return (
                  <tr
                    key={row.employeeId}
                    className={`border-b border-slate-200 last:border-0 ${index % 2 === 1 ? "bg-slate-50" : "bg-white"}`}
                  >
                    <td className="py-2.5 px-3 font-bold text-black">
                      {row.employeeName}
                    </td>
                    <td className="py-2.5 px-3 text-blue-700 font-semibold">{row.role}</td>
                    <td className="py-2.5 px-3 text-blue-700 font-semibold">
                      {SHIFT_LABELS[row.shift]}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border-2 ${meta.badgeClass}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${meta.dotColor}`} />
                        {meta.label}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-black font-semibold">
                      {row.checkInTime ?? "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
