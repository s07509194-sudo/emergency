import { useEffect, useState } from "react";
import { ListChecks, Plus, Search, LogOut as LogOutIcon } from "lucide-react";

import { attendanceService, getCurrentShiftKey } from "../../../services/attendanceService";
import type { ActivityLogEntry, Employee, ShiftKey } from "../../../types/operationsRoom";
import EmployeeReportModal from "./EmployeeReportModal";

const SHIFT_LABELS: Record<ShiftKey, string> = {
  L: "الليلي (L)",
  A: "الصباح (A)",
  P: "الظهيرة (P)",
  N: "المسائي (N)",
};

function toDateTimeLocal(iso: string): string {
  // يحول ISO لصيغة <input type="datetime-local"> بالتوقيت المحلي
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatEntryTime(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("ar-SA", { dateStyle: "short", timeStyle: "short" });
}

function formatDuration(checkIn: string, checkOut?: string): string {
  if (!checkOut) return "جارٍ الآن";
  const minutes = Math.max(
    0,
    Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 60000)
  );
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return hours > 0 ? `${hours} س ${rest} د` : `${rest} د`;
}

const emptyForm = {
  employeeCode: "",
  employeeName: "",
  role: "",
  taskDescription: "",
  checkInTime: toDateTimeLocal(new Date().toISOString()),
  checkOutTime: "",
};

export default function EmployeeActivityLog() {
  const [entries, setEntries] = useState<ActivityLogEntry[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const [searchQuery, setSearchQuery] = useState("");
  const [reportQuery, setReportQuery] = useState<string | null>(null);

  const loadEntries = async () => {
    setIsLoading(true);
    const data = await attendanceService.getActivityLog();
    setEntries(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadEntries();
    attendanceService.getEmployees().then(setEmployees);
  }, []);

  /** لما يكتب كود موجود فعليًا بالكشف، عبّي الاسم والوظيفة تلقائيًا */
  const handleCodeChange = (value: string) => {
    const match = employees.find(
      (e) => e.id.toLowerCase() === value.trim().toLowerCase()
    );
    setForm((prev) => ({
      ...prev,
      employeeCode: value,
      employeeName: match ? match.name : prev.employeeName,
      role: match ? match.role : prev.role,
    }));
  };

  const canSubmit =
    form.employeeCode.trim() && form.employeeName.trim() && form.role.trim() && form.taskDescription.trim();

  const handleAdd = async () => {
    if (!canSubmit) return;

    await attendanceService.addActivityLogEntry({
      employeeCode: form.employeeCode.trim(),
      employeeName: form.employeeName.trim(),
      role: form.role.trim(),
      shift: getCurrentShiftKey(),
      taskDescription: form.taskDescription.trim(),
      checkInTime: new Date(form.checkInTime).toISOString(),
      checkOutTime: form.checkOutTime ? new Date(form.checkOutTime).toISOString() : undefined,
    });

    setForm(emptyForm);
    setIsAdding(false);
    loadEntries();
  };

  const handleCloseOut = async (entry: ActivityLogEntry) => {
    await attendanceService.closeActivityLogEntry(entry.id, new Date().toISOString());
    loadEntries();
  };

  return (
    <div className="rounded-2xl bg-white border-2 border-slate-200 shadow-md p-4 sm:p-5 lg:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 shrink-0 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-700">
            <ListChecks size={18} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-black">
              سجل أعمال الموظفين
            </h3>
            <p className="text-xs text-blue-700 font-semibold">
              دخول/خروج كل موظف بكود خاص به، مع وصف المهمة — أساس تقرير الأعمال الفردي
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding((v) => !v)}
          className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 rounded-lg px-3 py-1.5 transition"
        >
          <Plus size={16} />
          تسجيل عمل جديد
        </button>
      </div>

      {/* نموذج البحث عن تقرير موظف */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute top-1/2 -translate-y-1/2 start-3 text-blue-600" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث بكود الموظف أو اسمه لعرض تقرير أعماله..."
            className="w-full rounded-xl border-2 border-slate-300 ps-9 pe-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
        <button
          type="button"
          disabled={!searchQuery.trim()}
          onClick={() => setReportQuery(searchQuery.trim())}
          className="text-sm font-semibold text-white bg-slate-700 hover:bg-slate-800 disabled:opacity-40 rounded-xl px-4 py-2 transition"
        >
          عرض التقرير
        </button>
      </div>

      {isAdding && (
        <div className="mb-4 rounded-xl border-2 border-slate-300 p-3 space-y-2 bg-slate-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              value={form.employeeCode}
              onChange={(e) => handleCodeChange(e.target.value)}
              list="roster-employee-codes"
              placeholder="كود الموظف (مثال: CO-07)"
              className="rounded-lg border-2 border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <datalist id="roster-employee-codes">
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name} — {employee.role}
                </option>
              ))}
            </datalist>
            <input
              value={form.employeeName}
              onChange={(e) => setForm({ ...form, employeeName: e.target.value })}
              placeholder="اسم الموظف"
              className="rounded-lg border-2 border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <input
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            placeholder="المسؤولية / الوظيفة (مثال: مشغل غرفة عمليات)"
            className="w-full rounded-lg border-2 border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-blue-700 mb-1">وقت الدخول</label>
              <input
                type="datetime-local"
                value={form.checkInTime}
                onChange={(e) => setForm({ ...form, checkInTime: e.target.value })}
                className="w-full rounded-lg border-2 border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-blue-700 mb-1">
                وقت الخروج <span className="text-blue-500">(اختياري - يقفل لاحقًا)</span>
              </label>
              <input
                type="datetime-local"
                value={form.checkOutTime}
                onChange={(e) => setForm({ ...form, checkOutTime: e.target.value })}
                className="w-full rounded-lg border-2 border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
          </div>

          <textarea
            value={form.taskDescription}
            onChange={(e) => setForm({ ...form, taskDescription: e.target.value })}
            placeholder="وصف العمل الذي قام به..."
            rows={2}
            className="w-full rounded-lg border-2 border-slate-300 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setForm(emptyForm);
              }}
              className="text-sm font-bold text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-50"
            >
              إلغاء
            </button>
            <button
              type="button"
              disabled={!canSubmit}
              onClick={handleAdd}
              className="text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 px-3.5 py-1.5 rounded-lg"
            >
              حفظ
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 rounded-xl bg-slate-50 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto -mx-1 rounded-xl border-2 border-slate-200">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="bg-slate-900 text-white text-xs">
                <th className="text-start font-bold py-2.5 px-3">الكود</th>
                <th className="text-start font-bold py-2.5 px-3">الموظف</th>
                <th className="text-start font-bold py-2.5 px-3">المسؤولية</th>
                <th className="text-start font-bold py-2.5 px-3">المناوبة</th>
                <th className="text-start font-bold py-2.5 px-3">دخول</th>
                <th className="text-start font-bold py-2.5 px-3">خروج</th>
                <th className="text-start font-bold py-2.5 px-3">المدة</th>
                <th className="text-start font-bold py-2.5 px-3">العمل المنجز</th>
                <th className="text-start font-bold py-2.5 px-3"></th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b border-slate-200 last:border-0 align-top">
                  <td className="py-2.5 px-2 font-mono text-xs font-bold text-blue-700">
                    {entry.employeeCode}
                  </td>
                  <td className="py-2.5 px-2 font-bold text-black whitespace-nowrap">
                    {entry.employeeName}
                  </td>
                  <td className="py-2.5 px-2 text-blue-700 font-semibold whitespace-nowrap">{entry.role}</td>
                  <td className="py-2.5 px-2 text-blue-700 font-semibold whitespace-nowrap">
                    {SHIFT_LABELS[entry.shift]}
                  </td>
                  <td className="py-2.5 px-2 text-blue-700 font-semibold whitespace-nowrap">
                    {formatEntryTime(entry.checkInTime)}
                  </td>
                  <td className="py-2.5 px-2 text-blue-700 font-semibold whitespace-nowrap">
                    {formatEntryTime(entry.checkOutTime)}
                  </td>
                  <td className="py-2.5 px-2 text-blue-700 font-semibold whitespace-nowrap">
                    {formatDuration(entry.checkInTime, entry.checkOutTime)}
                  </td>
                  <td className="py-2.5 px-2 text-black font-medium max-w-[220px]">
                    {entry.taskDescription}
                  </td>
                  <td className="py-2.5 px-2">
                    {!entry.checkOutTime && (
                      <button
                        type="button"
                        onClick={() => handleCloseOut(entry)}
                        title="تسجيل وقت الخروج الآن"
                        className="flex items-center gap-1 text-xs font-semibold text-orange-600 hover:bg-orange-50 rounded-lg px-2 py-1"
                      >
                        <LogOutIcon size={13} />
                        إنهاء
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {reportQuery && (
        <EmployeeReportModal query={reportQuery} onClose={() => setReportQuery(null)} />
      )}
    </div>
  );
}
