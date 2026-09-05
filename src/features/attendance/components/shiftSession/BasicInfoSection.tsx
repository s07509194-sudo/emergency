import { useEffect, useState } from "react";
import { Users2, UserCog } from "lucide-react";

import { shiftSessionService } from "../../../../services/shiftSessionService";
import type { Employee, ShiftSession } from "../../../../types/operationsRoom";

interface BasicInfoSectionProps {
  session: ShiftSession;
  onChange: (updates: { liaisonOfficerIds?: string[]; shiftSupervisorId?: string | null }) => void;
  disabled: boolean;
}

export default function BasicInfoSection({ session, onChange, disabled }: BasicInfoSectionProps) {
  const [coordinators, setCoordinators] = useState<Employee[]>([]);

  useEffect(() => {
    shiftSessionService.getCoordinators().then(setCoordinators);
  }, []);

  const toggleOfficer = (id: string) => {
    if (disabled) return;
    const isSelected = session.liaisonOfficerIds.includes(id);
    const next = isSelected
      ? session.liaisonOfficerIds.filter((oid) => oid !== id)
      : [...session.liaisonOfficerIds, id];
    onChange({ liaisonOfficerIds: next });
  };

  return (
    <div className="rounded-2xl bg-white border-2 border-slate-200 shadow-md p-4 sm:p-5 lg:p-6">
      <h3 className="text-base sm:text-lg font-extrabold text-black mb-1">البيانات الأساسية</h3>
      <p className="text-xs text-blue-700 font-bold mb-4">
        {session.startTime} ← {session.endTime} · شفت {session.shiftKey}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-sm font-extrabold text-black mb-2">
            <Users2 size={15} className="text-blue-600" />
            ضباط الاتصال بهالشفت
          </div>
          <div className="max-h-52 overflow-y-auto rounded-xl border-2 border-slate-200 p-2 space-y-1 bg-slate-50">
            {coordinators.map((officer) => (
              <label
                key={officer.id}
                className="flex items-center gap-2 text-sm font-semibold text-black px-2 py-1.5 rounded-lg hover:bg-white cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={session.liaisonOfficerIds.includes(officer.id)}
                  onChange={() => toggleOfficer(officer.id)}
                  disabled={disabled}
                  className="rounded border-2 border-slate-400 text-blue-600 focus:ring-blue-400"
                />
                {officer.name}
              </label>
            ))}
          </div>
          <p className="text-xs font-bold text-blue-700 mt-1.5">
            محدد حاليًا: <span className="text-black font-extrabold">{session.liaisonOfficerIds.length}</span> ضابط اتصال
          </p>
        </div>

        <div>
          <div className="flex items-center gap-1.5 text-sm font-extrabold text-black mb-2">
            <UserCog size={15} className="text-blue-600" />
            المشرف المناوب
          </div>
          <select
            value={session.shiftSupervisorId ?? ""}
            disabled={disabled}
            onChange={(e) => onChange({ shiftSupervisorId: e.target.value || null })}
            className="w-full rounded-xl border-2 border-slate-300 px-3 py-2.5 text-sm font-semibold text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 disabled:bg-slate-100"
          >
            <option value="">— اختر المشرف المناوب —</option>
            {coordinators.map((officer) => (
              <option key={officer.id} value={officer.id}>
                {officer.name}
              </option>
            ))}
          </select>
          <p className="text-xs font-bold text-blue-700 mt-1.5">
            هالشخص هو الممثل الرسمي للشفت — يستلم ويسلّم بالنيابة عن الجميع.
          </p>
        </div>
      </div>
    </div>
  );
}
