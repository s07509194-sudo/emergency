/**
 * الأنواع المشتركة لوحدتي "غرفة العمليات" و"الحضور والمناوبات".
 *
 * ملاحظة مهمة: هاي الأنواع هي "العقد" (contract) بين الواجهة والـ backend.
 * لما يجهز الـ API الحقيقي، هاد الملف هو المرجع لشكل البيانات المتوقع —
 * حاول تخلي استجابة الـ backend مطابقة لهاي الأشكال بقدر الإمكان لتقليل
 * التعديلات المطلوبة على الواجهة.
 */

/* =========================================================
   حالة الخطة (Plan Activation Lifecycle)
========================================================= */

/** مستويات دورة حياة الخطة، من الأقل للأعلى حدّة */
export type PlanStatusLevel =
  | "monitoring" // 🟢 مراقبة
  | "activated" // 🟡 مفعّلة
  | "escalated" // 🟠 مصعّدة
  | "de_escalated" // 🔵 خافضة تصعيد
  | "deactivated"; // ⚪ مغلقة

export interface PlanStatusChangeInput {
  toLevel: PlanStatusLevel;
  /** السبب إجباري لأي تغيير حالة (تفعيل/تصعيد/خفض/إغلاق) */
  reason: string;
  changedBy: string;
}

export interface PlanStatusEvent {
  id: string;
  fromLevel: PlanStatusLevel | null;
  toLevel: PlanStatusLevel;
  reason: string;
  changedBy: string;
  timestamp: string; // ISO 8601
}

export interface PlanStatus {
  currentLevel: PlanStatusLevel;
  /** رقم مستوى التصعيد داخل نفس الحالة (مثلاً تصعيد مستوى 1 أو 2) */
  escalationTier: number;
  activeSince: string; // ISO 8601
  lastChangedBy: string;
  history: PlanStatusEvent[];
}

/* =========================================================
   سجل القرارات (Decision Log)
========================================================= */

export type DecisionSource = "plan_status_change" | "manual";

export interface Decision {
  id: string;
  source: DecisionSource;
  summary: string;
  details?: string;
  actor: string;
  timestamp: string; // ISO 8601
  /** ربط اختياري بحالة الخطة وقت اتخاذ القرار، لبناء الخط الزمني لاحقًا */
  planLevelAtTime?: PlanStatusLevel;
}

export interface AddDecisionInput {
  summary: string;
  details?: string;
  actor: string;
}

/* =========================================================
   مؤشرات أداء الغرفة (KPIs)
========================================================= */

export interface OperationsRoomKpis {
  /** الوقت بالدقائق من رصد الحدث حتى تفعيل الخطة رسميًا */
  avgActivationTimeMinutes: number;
  /** عدد مرات التصعيد خلال الفترة الحالية */
  escalationCount: number;
  /** نسبة الحضور الفعلي وقت آخر تفعيل خطة (0-100) */
  staffingComplianceDuringActivation: number;
  /** عدد القرارات المسجلة خلال الحدث الحالي/الأخير */
  decisionsLogged: number;
  /** آخر تحديث للمؤشرات */
  lastUpdated: string; // ISO 8601
}

/* =========================================================
   الموظفون والمناوبات (Attendance & Shifts)
========================================================= */

/**
 * نظام الشفتات الرسمي (4 شفتات باليوم):
 *   L: 01:00 ← 07:00   A: 07:00 ← 13:00
 *   P: 13:00 ← 19:00   N: 19:00 ← 01:00
 * الأوقات معرّفة مركزيًا بـ SHIFT_DEFINITIONS بملف services/attendanceService.ts
 * — عدّل هناك فقط لو تغيّرت الأوقات الرسمية.
 */
export type ShiftKey = "L" | "A" | "P" | "N";

export interface ShiftDefinition {
  key: ShiftKey;
  label: string;
  startTime: string; // "07:00"
  endTime: string; // "13:00"
  requiredStaffCount: number;
}

export type AttendanceStatus =
  | "present" // 🟢 حاضر
  | "absent" // 🔴 غياب
  | "late" // 🟡 متأخر
  | "on_leave" // 🟣 إجازة
  | "day_off" // ⚪ أوف (يوم راحة أسبوعي مجدول)
  | "field_mission" // 🔵 مهمة ميدانية
  | "not_checked_in"; // ⚠️ لم يسجل الحضور

export interface Employee {
  id: string;
  name: string;
  role: string; // مثلاً: مشغل غرفة عمليات، مراقب، GIS، مشرف
  isOperationsRoomStaff: boolean;
}

export interface AttendanceRecord {
  employeeId: string;
  employeeName: string;
  role: string;
  shift: ShiftKey;
  status: AttendanceStatus;
  checkInTime?: string; // "07:52"
  checkOutTime?: string;
}

export interface AttendanceSummary {
  totalEmployees: number;
  present: number;
  absent: number;
  late: number;
  onLeave: number;
  dayOff: number;
  fieldMission: number;
  notCheckedIn: number;
}

/* =========================================================
   نموذج متابعة الشفت (Shift Session) — مطابق للنموذج الورقي الرسمي
========================================================= */

export interface ShiftAttendanceRow {
  employeeId: string;
  employeeName: string;
  roleLabel: string; // "الصفة" — مثلاً: ضابط اتصال
  checkInTime?: string; // نص حر مطابق للنموذج الورقي، مثال: "1:00"
  checkOutTime?: string;
  status: AttendanceStatus; // حاضر / غياب / إجازة / أوف ...
  notes?: string;
}

export type CommunicationChannelKey =
  | "landline" // الهاتف الثابت
  | "mobile" // الجوال
  | "fax" // الفاكس
  | "ministry_hotline" // الخط الساخن مع الوزارة
  | "email" // البريد الإلكتروني
  | "thuraya"; // الثريا

export interface CommunicationChannelCheck {
  channel: CommunicationChannelKey;
  wasTested: boolean;
  result?: string; // مثال: ناجح / فاشل / يحتاج صيانة
  testedAt?: string;
  testedBy?: string;
  notes?: string;
}

export interface EmailLogEntry {
  id: string;
  direction: "outgoing" | "incoming"; // صادر / وارد
  senderName: string;
  recipientEntity: string; // الجهة المستلمة (أو الجهة المرسِلة لو وارد)
  sentAt: string; // نص حر مطابق للنموذج الورقي، مثال: "1:11"
  subject: string;
  notes?: string;
}

export interface ShiftSession {
  id: string;
  date: string; // "2026-09-01"
  shiftKey: ShiftKey;
  startTime: string;
  endTime: string;
  liaisonOfficerIds: string[]; // ضباط الاتصال المشاركون بهالشفت (من المنسقين)
  shiftSupervisorId: string | null; // المشرف المناوب — من المنسقين فقط
  attendance: ShiftAttendanceRow[];
  communicationChecks: CommunicationChannelCheck[];
  communicationSummaryNotes: string; // ملاحظات عامة آخر قسم اختبار قنوات التواصل
  outgoingEmails: EmailLogEntry[];
  incomingEmails: EmailLogEntry[];
  equipmentHandedOverInGoodCondition: boolean | null; // تمت تسليم الأجهزة بحالة ممتازة؟
  closedBy: string | null; // توقيع من أغلق/سلّم الشفت
  closedAt: string | null; // ISO 8601
  status: "open" | "closed";
}

/* =========================================================
   الجاهزية والاستدعاء (Readiness & Call-down)
========================================================= */

export interface ReadinessStatus {
  requiredCount: number;
  availableCount: number;
  gap: number;
  gapPercentage: number;
  /** يُحسب تلقائيًا بناءً على مستوى تفعيل الخطة الحالي */
  basedOnPlanLevel: PlanStatusLevel;
}

export interface ReinforcementRequest {
  id: string;
  requestedBy: string;
  requiredCount: number;
  reason: string;
  status: "pending" | "acknowledged" | "fulfilled";
  timestamp: string; // ISO 8601
}

/* =========================================================
   التقرير اليومي (Daily Shift Attendance Report)
   — يُعبّى بأول نصف ساعة من الشفت للتوثيق (حضور + إجازات + غياب)،
   بعكس ShiftSession يلي يُقفل آخر الشفت كملخص تسليم.
========================================================= */

export type LeaveType = "weekly_off" | "annual" | "sick" | "emergency" | "other";

export interface WeeklyLeaveEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveDate: string; // "YYYY-MM-DD"
  leaveType: LeaveType;
  notes?: string;
}

export interface AbsenceEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  absenceDate: string; // "YYYY-MM-DD"
  reason?: string;
  notes?: string;
}

export interface DailyShiftAttendanceReport {
  date: string; // "YYYY-MM-DD"
  shiftKey: ShiftKey;
  supervisorId: string | null; // مشرف الفترة — من المنسقين
  shiftEmployeeIds: string[]; // الموظفين في الشفت
  weeklyLeaves: WeeklyLeaveEntry[];
  absences: AbsenceEntry[];
}

/* =========================================================
   سجل أعمال الموظفين (Employee Activity / Duty Log)
========================================================= */

export interface ActivityLogEntry {
  id: string;
  employeeCode: string;
  employeeName: string;
  role: string;
  shift: ShiftKey;
  checkInTime: string; // ISO 8601
  checkOutTime?: string; // ISO 8601، فاضي لحد ما يقفل السجل
  taskDescription: string;
}

export interface AddActivityLogInput {
  employeeCode: string;
  employeeName: string;
  role: string;
  shift: ShiftKey;
  taskDescription: string;
  checkInTime: string; // ISO 8601
  checkOutTime?: string; // ISO 8601
}

export interface EmployeeActivityReport {
  employeeCode: string;
  employeeName: string;
  role: string;
  entries: ActivityLogEntry[];
  totalMinutesWorked: number;
  totalTasks: number;
}
