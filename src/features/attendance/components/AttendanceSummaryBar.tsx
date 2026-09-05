import { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  CalendarOff,
  BedDouble,
  MapPin,
  AlertCircle,
} from "lucide-react";

import { attendanceService } from "../../../services/attendanceService";
import type { AttendanceSummary } from "../../../types/operationsRoom";

export default function AttendanceSummaryBar() {
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);

  useEffect(() => {
    attendanceService.getAttendanceSummary().then(setSummary);
  }, []);

  const items = [
    { label: "الإجمالي", value: summary?.totalEmployees, icon: Users, color: "text-white", bg: "bg-slate-800" },
    { label: "حاضر", value: summary?.present, icon: UserCheck, color: "text-white", bg: "bg-emerald-600" },
    { label: "غائب", value: summary?.absent, icon: UserX, color: "text-white", bg: "bg-red-600" },
    { label: "متأخر", value: summary?.late, icon: Clock, color: "text-white", bg: "bg-amber-500" },
    { label: "إجازة", value: summary?.onLeave, icon: CalendarOff, color: "text-white", bg: "bg-purple-600" },
    { label: "أوف", value: summary?.dayOff, icon: BedDouble, color: "text-white", bg: "bg-indigo-500" },
    { label: "ميداني", value: summary?.fieldMission, icon: MapPin, color: "text-white", bg: "bg-blue-600" },
    { label: "لم يسجل", value: summary?.notCheckedIn, icon: AlertCircle, color: "text-white", bg: "bg-slate-500" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="bg-white rounded-2xl shadow-md border-2 border-slate-200 p-3 sm:p-4 flex flex-col items-center gap-1.5"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.bg} ${item.color}`}>
              <Icon size={17} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-extrabold text-black">
              {item.value ?? "—"}
            </span>
            <span className="text-xs font-bold text-blue-700 text-center">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}
