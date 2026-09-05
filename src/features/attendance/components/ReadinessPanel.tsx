import { useEffect, useState } from "react";
import { ShieldAlert, Send, CheckCircle2, Phone, MessageSquare, Mail } from "lucide-react";

import { useOperationsRoom } from "../../../context/OperationsRoomContext";
import { attendanceService } from "../../../services/attendanceService";
import type { ReadinessStatus } from "../../../types/operationsRoom";
import { PLAN_STATUS_META } from "../../operationsRoom/utils/statusMeta";
import { ROOM_MANAGER_CONTACT } from "../../../config/roomManagerContact";

// TODO: استبدل هاد بالمستخدم الحقيقي من نظام الصلاحيات لما يتوفر الـ backend
const CURRENT_USER = "المشرف الحالي";

export default function ReadinessPanel() {
  const { planStatus } = useOperationsRoom();
  const [readiness, setReadiness] = useState<ReadinessStatus | null>(null);
  const [requestSent, setRequestSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!planStatus) return;
    attendanceService.getReadiness(planStatus.currentLevel).then(setReadiness);
  }, [planStatus]);

  if (!planStatus || !readiness) {
    return (
      <div className="rounded-2xl bg-white border-2 border-slate-100 shadow-md p-5 animate-pulse h-40" />
    );
  }

  const hasGap = readiness.gap > 0;
  const levelMeta = PLAN_STATUS_META[planStatus.currentLevel];

  const alertMessage = `🚨 نقص في طاقم غرفة العمليات\nحالة الخطة: ${levelMeta.label}\nالمطلوب: ${readiness.requiredCount} | الموجود: ${readiness.availableCount} | العجز: ${readiness.gap} (${readiness.gapPercentage}%)\nالرجاء التعزيز فورًا.`;

  const callHref = `tel:${ROOM_MANAGER_CONTACT.phone}`;
  const smsHref = `sms:${ROOM_MANAGER_CONTACT.phone}?body=${encodeURIComponent(alertMessage)}`;
  const emailHref = `mailto:${ROOM_MANAGER_CONTACT.email}?subject=${encodeURIComponent(
    "طلب تعزيز عاجل - غرفة العمليات"
  )}&body=${encodeURIComponent(alertMessage)}`;

  const handleRequestReinforcement = async () => {
    setIsSending(true);
    await attendanceService.requestReinforcement({
      requestedBy: CURRENT_USER,
      requiredCount: readiness.gap,
      reason: `نقص طاقم أثناء حالة الخطة: ${levelMeta.label}`,
    });
    setIsSending(false);
    setRequestSent(true);
  };

  return (
    <div
      className={`rounded-2xl border shadow-md p-4 sm:p-5 lg:p-6 transition-colors ${
        hasGap ? "bg-white border-orange-100" : "bg-slate-50/60 border-slate-100"
      }`}
    >
      <div className="flex items-center gap-2 mb-4">
        <div
          className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center ${
            hasGap ? "bg-orange-50 text-orange-500" : "bg-slate-100 text-slate-400"
          }`}
        >
          {hasGap ? (
            <span className="relative flex h-5 w-5 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-40" />
              <ShieldAlert size={18} className="relative" />
            </span>
          ) : (
            <ShieldAlert size={18} />
          )}
        </div>
        <div>
          <h3 className={`text-base sm:text-lg font-extrabold ${hasGap ? "text-black" : "text-slate-400"}`}>
            الجاهزية البشرية
          </h3>
          {!hasGap && <p className="text-xs text-slate-400">متجمدة — الطاقم كافٍ حاليًا</p>}
        </div>
      </div>

      <p className={`text-xs mb-3 ${hasGap ? "text-slate-400" : "text-slate-300"}`}>
        محسوبة بناءً على حالة الخطة الحالية:{" "}
        <span
          className={`font-semibold px-1.5 py-0.5 rounded-full border ${
            hasGap ? levelMeta.badgeClass : "bg-slate-100 text-slate-400 border-slate-200"
          }`}
        >
          {levelMeta.label}
        </span>
      </p>

      <div className="grid grid-cols-3 gap-3 text-center mb-4">
        <div className={`rounded-xl p-3 border-2 ${hasGap ? "bg-blue-50 border-blue-200" : "bg-white border-transparent"}`}>
          <p className={`text-xl font-extrabold ${hasGap ? "text-black" : "text-slate-400"}`}>
            {readiness.requiredCount}
          </p>
          <p className={`text-xs font-bold mt-0.5 ${hasGap ? "text-blue-700" : "text-slate-400"}`}>القوة المطلوبة</p>
        </div>
        <div className={`rounded-xl p-3 border-2 ${hasGap ? "bg-blue-50 border-blue-200" : "bg-white border-transparent"}`}>
          <p className={`text-xl font-extrabold ${hasGap ? "text-black" : "text-slate-400"}`}>
            {readiness.availableCount}
          </p>
          <p className={`text-xs font-bold mt-0.5 ${hasGap ? "text-blue-700" : "text-slate-400"}`}>الموجود</p>
        </div>
        <div className={`rounded-xl p-3 ${hasGap ? "bg-orange-50" : "bg-white"}`}>
          <p className={`text-xl font-extrabold ${hasGap ? "text-orange-600" : "text-slate-400"}`}>
            {readiness.gap}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">العجز</p>
        </div>
      </div>

      {hasGap ? (
        <div className="rounded-xl bg-orange-50 border-2 border-orange-100 p-3">
          <p className="text-sm font-semibold text-orange-700 mb-1">
            ⚠️ يوجد نقص في طاقم غرفة العمليات بنسبة {readiness.gapPercentage}%.
          </p>
          <p className="text-xs text-orange-600 mb-3">
            تنبيه {ROOM_MANAGER_CONTACT.name} ({ROOM_MANAGER_CONTACT.role}) مباشرة:
          </p>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <a
              href={callHref}
              className="flex items-center gap-1.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg px-3 py-2 transition"
            >
              <Phone size={15} />
              اتصال هاتفي
            </a>

            <a
              href={smsHref}
              className="flex items-center gap-1.5 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg px-3 py-2 transition"
            >
              <MessageSquare size={15} />
              رسالة SMS
            </a>

            <a
              href={emailHref}
              className="flex items-center gap-1.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg px-3 py-2 transition"
            >
              <Mail size={15} />
              بريد إلكتروني
            </a>
          </div>

          {requestSent ? (
            <p className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
              <CheckCircle2 size={16} />
              تم تسجيل طلب التعزيز بالنظام
            </p>
          ) : (
            <button
              type="button"
              onClick={handleRequestReinforcement}
              disabled={isSending}
              className="flex items-center gap-1.5 text-sm font-bold text-blue-700 border-2 border-blue-300 hover:bg-blue-50 disabled:opacity-50 rounded-lg px-3.5 py-2 transition"
            >
              <Send size={15} />
              {isSending ? "جارٍ التسجيل..." : "تسجيل الطلب بالنظام (لسجل القرارات)"}
            </button>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 bg-white border-2 border-slate-100 rounded-xl px-3 py-2 cursor-not-allowed select-none">
          <CheckCircle2 size={16} />
          الطاقم الحالي كافٍ — لا حاجة لإجراء الآن
        </div>
      )}
    </div>
  );
}
