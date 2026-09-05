import { useEffect, useState } from "react";
import { UserCog, Users2, CalendarOff, UserX, Plus, Trash2 } from "lucide-react";

import { dailyAttendanceReportService } from "../../../../services/dailyAttendanceReportService";
import type {
  DailyShiftAttendanceReport,
  Employee,
  LeaveType,
} from "../../../../types/operationsRoom";
import { LEAVE_TYPE_META } from "./leaveTypeMeta";

interface DailyAttendanceReportFormProps {
  report: DailyShiftAttendanceReport;
  allEmployees: Employee[];
  coordinators: Employee[];
  onUpdate: () => void;
}

const LEAVE_TYPE_KEYS = Object.keys(LEAVE_TYPE_META) as LeaveType[];

export default function DailyAttendanceReportForm({
  report,
  allEmployees,
  coordinators,
  onUpdate,
}: DailyAttendanceReportFormProps) {
  const { date, shiftKey } = report;

  const [shiftEmployeeQuery, setShiftEmployeeQuery] = useState("");
  const [leaveForm, setLeaveForm] = useState({ employeeQuery: "", leaveDate: date, leaveType: "weekly_off" as LeaveType, notes: "" });
  const [absenceForm, setAbsenceForm] = useState({ employeeQuery: "", absenceDate: date, reason: "", notes: "" });

  useEffect(() => {
    setLeaveForm((prev) => ({ ...prev, leaveDate: date }));
    setAbsenceForm((prev) => ({ ...prev, absenceDate: date }));
  }, [date]);

  const findEmployee = (query: string): Employee | undefined =>
    allEmployees.find(
      (e) => e.id.toLowerCase() === query.trim().toLowerCase() || e.name.toLowerCase() === query.trim().toLowerCase()
    );

  const handleSupervisorChange = async (supervisorId: string) => {
    await dailyAttendanceReportService.updateSupervisor(date, shiftKey, supervisorId || null);
    onUpdate();
  };

  const handleAddShiftEmployee = async () => {
    const match = findEmployee(shiftEmployeeQuery);
    if (!match || report.shiftEmployeeIds.includes(match.id)) {
      setShiftEmployeeQuery("");
      return;
    }
    await dailyAttendanceReportService.setShiftEmployees(date, shiftKey, [...report.shiftEmployeeIds, match.id]);
    setShiftEmployeeQuery("");
    onUpdate();
  };

  const handleRemoveShiftEmployee = async (employeeId: string) => {
    await dailyAttendanceReportService.setShiftEmployees(
      date,
      shiftKey,
      report.shiftEmployeeIds.filter((id) => id !== employeeId)
    );
    onUpdate();
  };

  const handleAddLeave = async () => {
    const match = findEmployee(leaveForm.employeeQuery);
    if (!match) return;
    await dailyAttendanceReportService.addWeeklyLeave(date, shiftKey, {
      employeeId: match.id,
      employeeName: match.name,
      leaveDate: leaveForm.leaveDate,
      leaveType: leaveForm.leaveType,
      notes: leaveForm.notes.trim() || undefined,
    });
    setLeaveForm({ employeeQuery: "", leaveDate: date, leaveType: "weekly_off", notes: "" });
    onUpdate();
  };

  const handleAddAbsence = async () => {
    const match = findEmployee(absenceForm.employeeQuery);
    if (!match) return;
    await dailyAttendanceReportService.addAbsence(date, shiftKey, {
      employeeId: match.id,
      employeeName: match.name,
      absenceDate: absenceForm.absenceDate,
      reason: absenceForm.reason.trim() || undefined,
      notes: absenceForm.notes.trim() || undefined,
    });
    setAbsenceForm({ employeeQuery: "", absenceDate: date, reason: "", notes: "" });
    onUpdate();
  };

  const shiftEmployees = report.shiftEmployeeIds
    .map((id) => allEmployees.find((e) => e.id === id))
    .filter((e): e is Employee => Boolean(e));

  return (
    <div className="space-y-4 lg:space-y-6 print:hidden">
      {/* مشرف الفترة */}
      <div className="rounded-2xl bg-white border-2 border-slate-200 shadow-md p-4 sm:p-5">
        <div className="flex items-center gap-1.5 text-sm font-extrabold text-black mb-2">
          <UserCog size={15} />
          مشرف الفترة ({shiftKey})
        </div>
        <select
          value={report.supervisorId ?? ""}
          onChange={(e) => handleSupervisorChange(e.target.value)}
          className="w-full sm:w-80 rounded-xl border-2 border-slate-300 px-3 py-2.5 text-sm font-bold text-black bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
        >
          <option value="">— اختر مشرف الفترة —</option>
          {coordinators.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* الموظفين بالشفت */}
      <div className="rounded-2xl bg-white border-2 border-slate-200 shadow-md p-4 sm:p-5">
        <div className="flex items-center gap-1.5 text-sm font-extrabold text-black mb-3">
          <Users2 size={15} />
          الموظفين في الشفت
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <input
            value={shiftEmployeeQuery}
            onChange={(e) => setShiftEmployeeQuery(e.target.value)}
            list="daily-report-employees"
            placeholder="أضف موظف بالكود أو الاسم..."
            className="flex-1 min-w-[220px] rounded-xl border-2 border-slate-300 px-3 py-2 text-sm font-semibold text-black bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <datalist id="daily-report-employees">
            {allEmployees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name} — {e.role}
              </option>
            ))}
          </datalist>
          <button
            type="button"
            onClick={handleAddShiftEmployee}
            disabled={!shiftEmployeeQuery.trim()}
            className="flex items-center gap-1.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 rounded-xl px-3.5 py-2 transition"
          >
            <Plus size={15} />
            إضافة
          </button>
        </div>

        {shiftEmployees.length === 0 ? (
          <p className="text-sm font-bold text-blue-700 text-center py-3">لا يوجد موظفون مضافون بعد.</p>
        ) : (
          <ul className="space-y-1.5">
            {shiftEmployees.map((emp, index) => (
              <li
                key={emp.id}
                className="flex items-center justify-between rounded-lg border-2 border-slate-200 px-3 py-2 text-sm bg-slate-50"
              >
                <span className="text-black font-semibold">
                  <span className="text-blue-700 font-bold me-2">{index + 1}.</span>
                  {emp.name}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveShiftEmployee(emp.id)}
                  className="text-red-400 hover:text-red-600 p-1"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* الإجازة الأسبوعية */}
      <div className="rounded-2xl bg-white border-2 border-slate-200 shadow-md p-4 sm:p-5">
        <div className="flex items-center gap-1.5 text-sm font-extrabold text-black mb-3">
          <CalendarOff size={15} />
          الإجازة الأسبوعية
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-3">
          <input
            value={leaveForm.employeeQuery}
            onChange={(e) => setLeaveForm({ ...leaveForm, employeeQuery: e.target.value })}
            list="daily-report-employees"
            placeholder="اسم الموظف أو الكود"
            className="rounded-xl border-2 border-slate-300 px-3 py-2 text-sm font-semibold text-black bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <input
            type="date"
            value={leaveForm.leaveDate}
            onChange={(e) => setLeaveForm({ ...leaveForm, leaveDate: e.target.value })}
            className="rounded-xl border-2 border-slate-300 px-3 py-2 text-sm font-semibold text-black bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <select
            value={leaveForm.leaveType}
            onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value as LeaveType })}
            className="rounded-xl border-2 border-slate-300 px-3 py-2 text-sm font-semibold text-black bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            {LEAVE_TYPE_KEYS.map((key) => (
              <option key={key} value={key}>
                {LEAVE_TYPE_META[key].label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleAddLeave}
            disabled={!leaveForm.employeeQuery.trim()}
            className="flex items-center justify-center gap-1.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 rounded-xl px-3.5 py-2 transition"
          >
            <Plus size={15} />
            إضافة
          </button>
        </div>

        {report.weeklyLeaves.length > 0 && (
          <ul className="space-y-1.5">
            {report.weeklyLeaves.map((leave) => (
              <li
                key={leave.id}
                className="flex items-center justify-between rounded-lg border-2 border-slate-200 px-3 py-2 text-sm bg-slate-50"
              >
                <span className="text-black font-semibold">
                  {leave.employeeName} · {leave.leaveDate} · {LEAVE_TYPE_META[leave.leaveType].label}
                  {leave.notes && ` · ${leave.notes}`}
                </span>
                <button
                  type="button"
                  onClick={async () => {
                    await dailyAttendanceReportService.removeWeeklyLeave(date, shiftKey, leave.id);
                    onUpdate();
                  }}
                  className="text-red-400 hover:text-red-600 p-1"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* الغياب */}
      <div className="rounded-2xl bg-white border-2 border-slate-200 shadow-md p-4 sm:p-5">
        <div className="flex items-center gap-1.5 text-sm font-extrabold text-black mb-3">
          <UserX size={15} />
          الغياب
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-3">
          <input
            value={absenceForm.employeeQuery}
            onChange={(e) => setAbsenceForm({ ...absenceForm, employeeQuery: e.target.value })}
            list="daily-report-employees"
            placeholder="اسم الموظف أو الكود"
            className="rounded-xl border-2 border-slate-300 px-3 py-2 text-sm font-semibold text-black bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <input
            type="date"
            value={absenceForm.absenceDate}
            onChange={(e) => setAbsenceForm({ ...absenceForm, absenceDate: e.target.value })}
            className="rounded-xl border-2 border-slate-300 px-3 py-2 text-sm font-semibold text-black bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <input
            value={absenceForm.reason}
            onChange={(e) => setAbsenceForm({ ...absenceForm, reason: e.target.value })}
            placeholder="سبب الغياب"
            className="rounded-xl border-2 border-slate-300 px-3 py-2 text-sm font-semibold text-black bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <button
            type="button"
            onClick={handleAddAbsence}
            disabled={!absenceForm.employeeQuery.trim()}
            className="flex items-center justify-center gap-1.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 rounded-xl px-3.5 py-2 transition"
          >
            <Plus size={15} />
            إضافة
          </button>
        </div>

        {report.absences.length > 0 && (
          <ul className="space-y-1.5">
            {report.absences.map((absence) => (
              <li
                key={absence.id}
                className="flex items-center justify-between rounded-lg border-2 border-slate-200 px-3 py-2 text-sm bg-slate-50"
              >
                <span className="text-black font-semibold">
                  {absence.employeeName} · {absence.absenceDate}
                  {absence.reason && ` · ${absence.reason}`}
                </span>
                <button
                  type="button"
                  onClick={async () => {
                    await dailyAttendanceReportService.removeAbsence(date, shiftKey, absence.id);
                    onUpdate();
                  }}
                  className="text-red-400 hover:text-red-600 p-1"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
