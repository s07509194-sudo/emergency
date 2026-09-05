import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";

import { MADINAH_GOVERNORATES, ALERT_LEVEL_META, ALERT_TYPE_META } from "./alertReadinessMeta";
import type { AlertLevel, AlertType } from "./alertReadinessMeta";

export interface AlertReadinessFormData {
  governorate: string;
  alertLevel: AlertLevel;
  alertType: AlertType;
  readinessTestDone: boolean | null;
  responseReportDone: boolean | null;
  recoveryReportDone: boolean | null;
}

interface YesNoFieldProps {
  label: string;
  value: boolean | null;
  onChange: (value: boolean) => void;
}

function YesNoField({ label, value, onChange }: YesNoFieldProps) {
  return (
    <div className="rounded-xl border-2 border-slate-200 p-3 bg-slate-50">
      <p className="text-sm font-extrabold text-black mb-2">{label}</p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`flex items-center gap-1.5 text-sm font-semibold rounded-lg px-3 py-1.5 border-2 transition ${
            value === true
              ? "bg-emerald-600 text-white border-emerald-600"
              : "border-slate-300 text-black hover:bg-slate-50"
          }`}
        >
          <CheckCircle2 size={14} />
          نعم
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`flex items-center gap-1.5 text-sm font-semibold rounded-lg px-3 py-1.5 border-2 transition ${
            value === false
              ? "bg-red-500 text-white border-red-500"
              : "border-slate-300 text-black hover:bg-slate-50"
          }`}
        >
          <XCircle size={14} />
          لا
        </button>
        {value === null && (
          <span className="flex items-center gap-1 text-xs font-bold text-blue-700 self-center">
            <HelpCircle size={12} />
            لم يُحدد بعد
          </span>
        )}
      </div>
    </div>
  );
}

interface AlertReadinessReportFormProps {
  data: AlertReadinessFormData;
  onChange: (updates: Partial<AlertReadinessFormData>) => void;
}

export default function AlertReadinessReportForm({ data, onChange }: AlertReadinessReportFormProps) {
  return (
    <div className="rounded-2xl bg-white border-2 border-slate-200 shadow-md p-4 sm:p-5 lg:p-6 print:hidden">
      <h3 className="text-base sm:text-lg font-extrabold text-black mb-4">
        بيانات تقرير الجاهزية أثناء الإنذار
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div>
          <label className="block text-sm font-extrabold text-black mb-1.5">المحافظة</label>
          <select
            value={data.governorate}
            onChange={(e) => onChange({ governorate: e.target.value })}
            className="w-full rounded-xl border-2 border-slate-300 px-3 py-2.5 text-sm font-bold text-black bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
          >
            {MADINAH_GOVERNORATES.map((gov) => (
              <option key={gov} value={gov}>
                {gov}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-extrabold text-black mb-1.5">مستوى الإنذار</label>
          <select
            value={data.alertLevel}
            onChange={(e) => onChange({ alertLevel: e.target.value as AlertLevel })}
            className="w-full rounded-xl border-2 border-slate-300 px-3 py-2.5 text-sm font-bold text-black bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
          >
            {(Object.keys(ALERT_LEVEL_META) as AlertLevel[]).map((level) => (
              <option key={level} value={level}>
                {ALERT_LEVEL_META[level].label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-extrabold text-black mb-1.5">نوع الإنذار</label>
          <select
            value={data.alertType}
            onChange={(e) => onChange({ alertType: e.target.value as AlertType })}
            className="w-full rounded-xl border-2 border-slate-300 px-3 py-2.5 text-sm font-bold text-black bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
          >
            {(Object.keys(ALERT_TYPE_META) as AlertType[]).map((type) => (
              <option key={type} value={type}>
                {ALERT_TYPE_META[type].label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <YesNoField
          label="تم عمل تقرير الجاهزية والاختبار؟"
          value={data.readinessTestDone}
          onChange={(v) => onChange({ readinessTestDone: v })}
        />
        <YesNoField
          label="تم عمل تقرير الاستجابة؟"
          value={data.responseReportDone}
          onChange={(v) => onChange({ responseReportDone: v })}
        />
        <YesNoField
          label="تم عمل تقرير التعافي؟"
          value={data.recoveryReportDone}
          onChange={(v) => onChange({ recoveryReportDone: v })}
        />
      </div>
    </div>
  );
}
