import type { PlanStatusLevel } from "../../../types/operationsRoom";
import type { AttendanceStatus } from "../../../types/operationsRoom";

export const PLAN_STATUS_META: Record<
  PlanStatusLevel,
  { label: string; dotColor: string; badgeClass: string }
> = {
  monitoring: {
    label: "مراقبة",
    dotColor: "bg-emerald-500",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  activated: {
    label: "مفعّلة",
    dotColor: "bg-yellow-500",
    badgeClass: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  escalated: {
    label: "تصعيد",
    dotColor: "bg-orange-500",
    badgeClass: "bg-orange-50 text-orange-700 border-orange-200",
  },
  de_escalated: {
    label: "خفض تصعيد",
    dotColor: "bg-sky-500",
    badgeClass: "bg-sky-50 text-sky-700 border-sky-200",
  },
  deactivated: {
    label: "مغلقة",
    dotColor: "bg-slate-400",
    badgeClass: "bg-slate-100 text-slate-600 border-slate-200",
  },
};

export const ATTENDANCE_STATUS_META: Record<
  AttendanceStatus,
  { label: string; dotColor: string; badgeClass: string }
> = {
  present: {
    label: "حاضر",
    dotColor: "bg-emerald-500",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  absent: {
    label: "غائب",
    dotColor: "bg-red-500",
    badgeClass: "bg-red-50 text-red-700 border-red-200",
  },
  late: {
    label: "متأخر",
    dotColor: "bg-yellow-500",
    badgeClass: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  on_leave: {
    label: "إجازة",
    dotColor: "bg-purple-500",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
  },
  day_off: {
    label: "أوف",
    dotColor: "bg-slate-400",
    badgeClass: "bg-slate-100 text-slate-600 border-slate-200",
  },
  field_mission: {
    label: "مهمة ميدانية",
    dotColor: "bg-blue-500",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
  },
  not_checked_in: {
    label: "لم يسجل الحضور",
    dotColor: "bg-slate-400",
    badgeClass: "bg-slate-100 text-slate-600 border-slate-200",
  },
};

/** ترتيب منطقي للانتقال بين الحالات، يستخدم لتحديد نص وأيقونة زر الإجراء */
export function getNextActionLabel(current: PlanStatusLevel): {
  escalateLabel: string;
  deEscalateLabel: string;
  canEscalate: boolean;
  canDeEscalate: boolean;
} {
  return {
    escalateLabel: current === "monitoring" ? "تفعيل الخطة" : "تصعيد",
    deEscalateLabel: current === "escalated" ? "خفض تصعيد" : "إغلاق الخطة",
    canEscalate: current !== "escalated",
    canDeEscalate: current !== "monitoring" && current !== "deactivated",
  };
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("ar-SA", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("ar-SA", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
