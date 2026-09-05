import { CheckCircle2, XCircle, MapPin, AlertOctagon } from "lucide-react";

import amanahLogo from "../../../../assets/images/amanah-logo.png";
import { ALERT_LEVEL_META, ALERT_TYPE_META } from "./alertReadinessMeta";
import type { AlertReadinessFormData } from "./AlertReadinessReportForm";

interface AlertReadinessReportViewProps {
  data: AlertReadinessFormData;
  generatedAt: string;
}

function CheckRow({ label, value }: { label: string; value: boolean | null }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      {value === null ? (
        <span className="text-xs font-semibold text-slate-400">لم يُحدد</span>
      ) : value ? (
        <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-700">
          <CheckCircle2 size={16} />
          نعم
        </span>
      ) : (
        <span className="flex items-center gap-1.5 text-sm font-bold text-red-600">
          <XCircle size={16} />
          لا
        </span>
      )}
    </div>
  );
}

export default function AlertReadinessReportView({ data, generatedAt }: AlertReadinessReportViewProps) {
  const levelMeta = ALERT_LEVEL_META[data.alertLevel];
  const typeMeta = ALERT_TYPE_META[data.alertType];
  const AlertTypeIcon = typeMeta.icon;

  return (
    <div className="bg-white text-slate-800" dir="rtl">
      {/* ترويسة رسمية بشعار أمانة المدينة المنورة */}
      <div className="flex items-start justify-between border-b-2 border-slate-800 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <img src={amanahLogo} alt="شعار أمانة المدينة المنورة" className="h-14 w-auto object-contain" />
          <div>
            <p className="text-lg font-extrabold text-slate-800">أمانة المدينة المنورة</p>
            <p className="text-sm text-slate-500">مركز الطوارئ والأزمات · تقرير الجاهزية أثناء الإنذار</p>
          </div>
        </div>
        <div className="text-end">
          <p className="text-xs text-slate-400">تاريخ الإصدار</p>
          <p className="text-sm font-semibold text-slate-700">{generatedAt}</p>
        </div>
      </div>

      {/* شارة مستوى الإنذار البارزة */}
      <div className={`rounded-2xl border-2 p-4 mb-5 flex items-center justify-between ${levelMeta.badgeClass}`}>
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white ${levelMeta.solidClass}`}>
            <AlertOctagon size={22} />
          </div>
          <div>
            <p className="text-xs opacity-70">مستوى الإنذار</p>
            <p className="text-base font-extrabold">{levelMeta.label}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-end">
          <div>
            <p className="text-xs opacity-70">نوع الإنذار</p>
            <p className="text-base font-extrabold flex items-center gap-1.5">
              {typeMeta.label}
              <AlertTypeIcon size={18} />
            </p>
          </div>
        </div>
      </div>

      {/* المحافظة */}
      <div className="flex items-center gap-2 mb-5 rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
        <MapPin size={16} className="text-slate-500" />
        <span className="text-sm text-slate-500">المحافظة:</span>
        <span className="text-sm font-bold text-slate-800">{data.governorate}</span>
      </div>

      {/* حالة التقارير الثلاثة */}
      <div className="mb-5">
        <p className="text-sm font-bold text-slate-700 mb-2">حالة تقارير دورة إدارة الإنذار</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <CheckRow label="تقرير الجاهزية والاختبار" value={data.readinessTestDone} />
          <CheckRow label="تقرير الاستجابة" value={data.responseReportDone} />
          <CheckRow label="تقرير التعافي" value={data.recoveryReportDone} />
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-400 text-center">
        تم إصدار هذا التقرير آليًا من منصة إدارة الأزمات والطوارئ — أمانة المدينة المنورة
      </div>
    </div>
  );
}
