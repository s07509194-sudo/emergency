import type { LeaveType } from "../../../../types/operationsRoom";

export const LEAVE_TYPE_META: Record<LeaveType, { label: string }> = {
  weekly_off: { label: "أوف أسبوعي" },
  annual: { label: "إجازة سنوية" },
  sick: { label: "إجازة مرضية" },
  emergency: { label: "إجازة اضطرارية" },
  other: { label: "أخرى" },
};
