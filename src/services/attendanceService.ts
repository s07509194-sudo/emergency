import { simulateNetwork, generateMockId } from "./mockNetwork";
import { EMPLOYEES } from "../data/employeesRoster";
import type {
  AttendanceRecord,
  AttendanceStatus,
  AttendanceSummary,
  ShiftDefinition,
  ShiftKey,
  ReadinessStatus,
  ReinforcementRequest,
  PlanStatusLevel,
  ActivityLogEntry,
  AddActivityLogInput,
  EmployeeActivityReport,
} from "../types/operationsRoom";

/**
 * طبقة خدمة الحضور والمناوبات.
 *
 * ⚠️ TODO (عند ربط الـ backend الحقيقي): نفس ملاحظة operationsRoomService —
 * استبدل الجسم بنداء API حقيقي بنفس التوقيع. البيانات هون مبنية فوق
 * الكشف الرسمي بملف data/employeesRoster.ts (48 موظف حقيقي)، فلما
 * يتوفر الـ backend، نداء GET /api/attendance/live المفروض يرجّع
 * حضور حقيقي لنفس هالموظفين بالضبط (بنفس أكوادهم إذا أمكن).
 *
 * نموذج "متابعة الشفت" الكامل (ضباط اتصال، اختبار قنوات تواصل، بريد،
 * نهاية الشفت) منقول لملف services/shiftSessionService.ts منفصل.
 *
 * أمثلة على المسارات المتوقعة لاحقًا:
 *   GET   /api/attendance/live
 *   GET   /api/attendance/shifts
 *   POST  /api/attendance/check-in
 *   GET   /api/attendance/readiness?planLevel=...
 *   POST  /api/attendance/reinforcement-request
 */

// نظام الشفتات الرسمي (4 شفتات باليوم) — عدّل هون فقط لو تغيّرت الأوقات الرسمية.
// عدد الموظفين الحقيقي بالكشف = 48 (6 طاقم أساسي + 42 منسق/ضابط اتصال).
export const SHIFT_DEFINITIONS: ShiftDefinition[] = [
  { key: "L", label: "الشفت الليلي (L)", startTime: "01:00", endTime: "07:00", requiredStaffCount: 10 },
  { key: "A", label: "شفت الصباح (A)", startTime: "07:00", endTime: "13:00", requiredStaffCount: 20 },
  { key: "P", label: "شفت الظهيرة (P)", startTime: "13:00", endTime: "19:00", requiredStaffCount: 16 },
  { key: "N", label: "الشفت المسائي (N)", startTime: "19:00", endTime: "01:00", requiredStaffCount: 14 },
];

/** يحدد الشفت الحالي بناءً على وقت الجهاز (تبسيط لمرحلة الـ mock) */
export function getCurrentShiftKey(date = new Date()): ShiftKey {
  const hour = date.getHours();
  if (hour >= 1 && hour < 7) return "L";
  if (hour >= 7 && hour < 13) return "A";
  if (hour >= 13 && hour < 19) return "P";
  return "N"; // 19:00 → 01:00 (يمتد عبر منتصف الليل)
}

const SHIFT_ROTATION: ShiftKey[] = ["L", "A", "P", "N"];

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/**
 * يبني حضورًا افتراضيًا لكل موظف بالكشف الرسمي لأغراض العرض التجريبي فقط.
 * الطاقم الأساسي (isOperationsRoomStaff) نفترضه على شفت الصباح (A) وحاضرًا
 * افتراضيًا؛ والمنسقون (ضباط الاتصال) موزّعون على الشفتات الأربعة بنمط دوري
 * مع تنويع بسيط لحالات الحضور — كل هاد يُستبدل ببيانات حضور حقيقية لحظة
 * ربط الـ backend.
 */
function buildInitialAttendance(): AttendanceRecord[] {
  return EMPLOYEES.map((employee, index) => {
    if (employee.isOperationsRoomStaff) {
      const isFieldRole = employee.role === "GIS";
      return {
        employeeId: employee.id,
        employeeName: employee.name,
        role: employee.role,
        shift: "A",
        status: isFieldRole ? "field_mission" : "present",
        checkInTime: isFieldRole ? undefined : `0${7 + (index % 2)}:${pad2((index * 7) % 60)}`,
      } satisfies AttendanceRecord;
    }

    const shift = SHIFT_ROTATION[index % SHIFT_ROTATION.length];

    let status: AttendanceStatus = "present";
    if (index % 11 === 0) status = "absent";
    else if (index % 9 === 0) status = "late";
    else if (index % 13 === 0) status = "on_leave";
    else if (index % 15 === 0) status = "day_off";
    else if (index % 17 === 0) status = "field_mission";
    else if (index % 23 === 0) status = "not_checked_in";

    const hasCheckIn = status === "present" || status === "late";

    return {
      employeeId: employee.id,
      employeeName: employee.name,
      role: employee.role,
      shift,
      status,
      checkInTime: hasCheckIn ? `0${7 + (index % 3)}:${pad2((index * 13) % 60)}` : undefined,
    } satisfies AttendanceRecord;
  });
}

let mockAttendance: AttendanceRecord[] = buildInitialAttendance();

let mockReinforcementRequests: ReinforcementRequest[] = [];

let mockActivityLog: ActivityLogEntry[] = [
  {
    id: generateMockId("log"),
    employeeCode: "MON-01",
    employeeName: "مرام يحيى حاسن الاحمدي",
    role: "مراقب",
    shift: "A",
    checkInTime: new Date(new Date().setHours(7, 58)).toISOString(),
    checkOutTime: undefined,
    taskDescription: "متابعة بلاغات السيول بمنطقة العوالي وتحديث حالتها بالنظام",
  },
  {
    id: generateMockId("log"),
    employeeCode: "GIS-01",
    employeeName: "محمد جمال علي شاهين",
    role: "GIS",
    shift: "A",
    checkInTime: new Date(new Date().setHours(8, 10)).toISOString(),
    checkOutTime: undefined,
    taskDescription: "معاينة ميدانية لنقطة حرجة بحي الحرة ورفع صور توثيقية",
  },
];

export const attendanceService = {
  async getLiveAttendance(): Promise<AttendanceRecord[]> {
    return simulateNetwork(mockAttendance);
  },

  async getAttendanceSummary(): Promise<AttendanceSummary> {
    const summary: AttendanceSummary = {
      totalEmployees: mockAttendance.length,
      present: mockAttendance.filter((a) => a.status === "present").length,
      absent: mockAttendance.filter((a) => a.status === "absent").length,
      late: mockAttendance.filter((a) => a.status === "late").length,
      onLeave: mockAttendance.filter((a) => a.status === "on_leave").length,
      dayOff: mockAttendance.filter((a) => a.status === "day_off").length,
      fieldMission: mockAttendance.filter((a) => a.status === "field_mission").length,
      notCheckedIn: mockAttendance.filter((a) => a.status === "not_checked_in").length,
    };
    return simulateNetwork(summary, 300);
  },

  /** قوة غرفة العمليات فقط (الطاقم الأساسي المباشر: إدارة، خبرة، GIS، هندسة، جرافيك، مراقبة) */
  async getOperationsRoomStaffing(): Promise<AttendanceRecord[]> {
    const roomStaffIds = new Set(
      EMPLOYEES.filter((e) => e.isOperationsRoomStaff).map((e) => e.id)
    );
    const staffing = mockAttendance.filter((a) => roomStaffIds.has(a.employeeId));
    return simulateNetwork(staffing, 300);
  },

  async getShiftDefinitions(): Promise<ShiftDefinition[]> {
    return simulateNetwork(SHIFT_DEFINITIONS, 200);
  },

  /**
   * يحسب الجاهزية بناءً على مستوى تفعيل الخطة الحالي.
   * كل ما ارتفع مستوى التفعيل، ارتفع العدد المطلوب من الطاقم.
   */
  async getReadiness(planLevel: PlanStatusLevel): Promise<ReadinessStatus> {
    const currentShift = getCurrentShiftKey();
    const baseRequired =
      SHIFT_DEFINITIONS.find((s) => s.key === currentShift)?.requiredStaffCount ?? 15;

    const multiplierByLevel: Record<PlanStatusLevel, number> = {
      monitoring: 0.6,
      activated: 1,
      escalated: 1.6,
      de_escalated: 1.2,
      deactivated: 0.6,
    };

    const requiredCount = Math.round(baseRequired * multiplierByLevel[planLevel]);
    const availableCount = mockAttendance.filter(
      (a) => a.status === "present" || a.status === "late"
    ).length;

    const gap = Math.max(0, requiredCount - availableCount);
    const gapPercentage = requiredCount > 0 ? Math.round((gap / requiredCount) * 100) : 0;

    const readiness: ReadinessStatus = {
      requiredCount,
      availableCount,
      gap,
      gapPercentage,
      basedOnPlanLevel: planLevel,
    };

    return simulateNetwork(readiness, 300);
  },

  async requestReinforcement(
    input: Omit<ReinforcementRequest, "id" | "timestamp" | "status">
  ): Promise<ReinforcementRequest> {
    const request: ReinforcementRequest = {
      ...input,
      id: generateMockId("reinforce"),
      status: "pending",
      timestamp: new Date().toISOString(),
    };
    mockReinforcementRequests = [request, ...mockReinforcementRequests];
    return simulateNetwork(request, 300);
  },

  async getEmployees() {
    return simulateNetwork(EMPLOYEES, 150);
  },

  async getReinforcementRequests(): Promise<ReinforcementRequest[]> {
    return simulateNetwork(mockReinforcementRequests, 200);
  },

  /* =========================================================
     سجل أعمال الموظفين (Duty / Activity Log)
  ========================================================= */

  async getActivityLog(): Promise<ActivityLogEntry[]> {
    // الأحدث أولًا
    return simulateNetwork(
      [...mockActivityLog].sort(
        (a, b) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime()
      )
    );
  },

  async addActivityLogEntry(input: AddActivityLogInput): Promise<ActivityLogEntry> {
    const entry: ActivityLogEntry = {
      ...input,
      id: generateMockId("log"),
    };
    mockActivityLog = [entry, ...mockActivityLog];
    return simulateNetwork(entry, 300);
  },

  /** تسجيل وقت الخروج لسجل مفتوح (لما الموظف يخلص شغله بنفس المهمة) */
  async closeActivityLogEntry(id: string, checkOutTime: string): Promise<ActivityLogEntry> {
    const entry = mockActivityLog.find((e) => e.id === id);
    if (!entry) {
      throw new Error("سجل العمل غير موجود");
    }
    entry.checkOutTime = checkOutTime;
    return simulateNetwork(entry, 200);
  },

  /** يبحث بكود الموظف أو الاسم ويبني تقرير أعمال مجمّع */
  async getEmployeeReport(query: string): Promise<EmployeeActivityReport | null> {
    const normalized = query.trim().toLowerCase();
    const entries = mockActivityLog.filter(
      (e) =>
        e.employeeCode.toLowerCase() === normalized ||
        e.employeeName.toLowerCase().includes(normalized)
    );

    if (entries.length === 0) {
      return simulateNetwork(null, 300);
    }

    const totalMinutesWorked = entries.reduce((sum, e) => {
      if (!e.checkOutTime) return sum;
      const minutes =
        (new Date(e.checkOutTime).getTime() - new Date(e.checkInTime).getTime()) / 60000;
      return sum + Math.max(0, minutes);
    }, 0);

    const report: EmployeeActivityReport = {
      employeeCode: entries[0].employeeCode,
      employeeName: entries[0].employeeName,
      role: entries[0].role,
      entries: entries.sort(
        (a, b) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime()
      ),
      totalMinutesWorked: Math.round(totalMinutesWorked),
      totalTasks: entries.length,
    };

    return simulateNetwork(report, 300);
  },
};
