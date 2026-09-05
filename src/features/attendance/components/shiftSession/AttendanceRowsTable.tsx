import { useEffect, useState } from "react";
import { ClipboardCheck, Plus, Trash2 } from "lucide-react";

import { attendanceService } from "../../../../services/attendanceService";
import type { AttendanceStatus, Employee, ShiftAttendanceRow } from "../../../../types/operationsRoom";
import { ATTENDANCE_STATUS_META } from "../../../operationsRoom/utils/statusMeta";

interface AttendanceRowsTableProps {
  rows: ShiftAttendanceRow[];
  onChange: (rows: ShiftAttendanceRow[]) => void;
  disabled: boolean;
}

const STATUS_OPTIONS: AttendanceStatus[] = [
  "present",
  "absent",
  "late",
  "on_leave",
  "day_off",
  "field_mission",
  "not_checked_in",
];

export default function AttendanceRowsTable({ rows, onChange, disabled }: AttendanceRowsTableProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newEmployeeQuery, setNewEmployeeQuery] = useState("");

  useEffect(() => {
    attendanceService.getEmployees().then(setEmployees);
  }, []);

  const updateRow = (index: number, updates: Partial<ShiftAttendanceRow>) => {
    const next = rows.map((row, i) => (i === index ? { ...row, ...updates } : row));
    onChange(next);
  };

  const removeRow = (index: number) => {
    onChange(rows.filter((_, i) => i !== index));
  };

  const handleAddEmployee = () => {
    const match = employees.find(
      (e) =>
        e.id.toLowerCase() === newEmployeeQuery.trim().toLowerCase() ||
        e.name.toLowerCase() === newEmployeeQuery.trim().toLowerCase()
    );
    if (!match) return;
    if (rows.some((r) => r.employeeId === match.id)) {
      setNewEmployeeQuery("");
      return;
    }

    const newRow: ShiftAttendanceRow = {
      employeeId: match.id,
      employeeName: match.name,
      roleLabel: match.role,
      status: "present",
      checkInTime: "",
      checkOutTime: "",
      notes: "",
    };
    onChange([...rows, newRow]);
    setNewEmployeeQuery("");
  };

  return (
    <div className="rounded-2xl bg-white border-2 border-slate-200 shadow-md p-4 sm:p-5 lg:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 shrink-0 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
          <ClipboardCheck size={18} />
        </div>
        <h3 className="text-base sm:text-lg font-extrabold text-black">
          الموظفون بالشفت والحضور
        </h3>
      </div>

      {!disabled && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <input
            value={newEmployeeQuery}
            onChange={(e) => setNewEmployeeQuery(e.target.value)}
            list="shift-session-employees"
            placeholder="أضف موظف بالكود أو الاسم..."
            className="flex-1 min-w-[220px] rounded-xl border-2 border-slate-300 px-3 py-2 text-sm font-semibold text-black focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <datalist id="shift-session-employees">
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name} — {e.role}
              </option>
            ))}
          </datalist>
          <button
            type="button"
            onClick={handleAddEmployee}
            disabled={!newEmployeeQuery.trim()}
            className="flex items-center gap-1.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 rounded-xl px-3.5 py-2 transition"
          >
            <Plus size={15} />
            إضافة
          </button>
        </div>
      )}

      {rows.length === 0 ? (
        <p className="text-sm font-bold text-blue-700 text-center py-6">
          لا يوجد موظفون مضافون بهالشفت بعد.
        </p>
      ) : (
        <div className="overflow-x-auto -mx-1 rounded-xl border-2 border-slate-200">
          <table className="w-full text-sm min-w-[760px]">
            <thead>
              <tr className="bg-slate-900 text-white text-xs">
                <th className="text-start font-bold py-2.5 px-3">اسم الموظف</th>
                <th className="text-start font-bold py-2.5 px-3">الصفة</th>
                <th className="text-start font-bold py-2.5 px-3">وقت الحضور</th>
                <th className="text-start font-bold py-2.5 px-3">وقت الانصراف</th>
                <th className="text-start font-bold py-2.5 px-3">الحالة</th>
                <th className="text-start font-bold py-2.5 px-3">ملاحظات</th>
                {!disabled && <th className="py-2 px-2"></th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.employeeId} className="border-b border-slate-200 last:border-0">
                  <td className="py-2 px-2 font-bold text-black whitespace-nowrap">
                    {row.employeeName}
                  </td>
                  <td className="py-2 px-2 text-blue-700 font-semibold whitespace-nowrap">{row.roleLabel}</td>
                  <td className="py-2 px-2">
                    <input
                      type="time"
                      value={row.checkInTime ?? ""}
                      disabled={disabled}
                      onChange={(e) => updateRow(index, { checkInTime: e.target.value })}
                      className="rounded-lg border-2 border-slate-300 px-2 py-1.5 text-xs font-semibold text-black w-28 disabled:bg-slate-100"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="time"
                      value={row.checkOutTime ?? ""}
                      disabled={disabled}
                      onChange={(e) => updateRow(index, { checkOutTime: e.target.value })}
                      className="rounded-lg border-2 border-slate-300 px-2 py-1.5 text-xs font-semibold text-black w-28 disabled:bg-slate-100"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <select
                      value={row.status}
                      disabled={disabled}
                      onChange={(e) => updateRow(index, { status: e.target.value as AttendanceStatus })}
                      className="rounded-lg border-2 border-slate-300 px-2 py-1.5 text-xs font-semibold text-black bg-white disabled:bg-slate-100"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {ATTENDANCE_STATUS_META[status].label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-2 px-2">
                    <input
                      value={row.notes ?? ""}
                      disabled={disabled}
                      onChange={(e) => updateRow(index, { notes: e.target.value })}
                      placeholder="—"
                      className="rounded-lg border-2 border-slate-300 px-2 py-1.5 text-xs font-medium text-black w-36 disabled:bg-slate-100"
                    />
                  </td>
                  {!disabled && (
                    <td className="py-2 px-2">
                      <button
                        type="button"
                        onClick={() => removeRow(index)}
                        className="text-red-400 hover:text-red-600 p-1"
                        title="إزالة"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
