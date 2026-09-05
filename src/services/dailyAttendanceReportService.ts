import { simulateNetwork, generateMockId } from "./mockNetwork";
import { EMPLOYEES } from "../data/employeesRoster";
import type {
  DailyShiftAttendanceReport,
  ShiftKey,
  WeeklyLeaveEntry,
  AbsenceEntry,
  Employee,
} from "../types/operationsRoom";

/**
 * خدمة "التقرير اليومي" — يُعبّى بأول نصف ساعة من الشفت لتوثيق الحضور
 * والإجازات الأسبوعية والغياب. منفصل تمامًا عن shiftSessionService
 * (يلي بيوثّق نهاية الشفت كملخص تسليم).
 *
 * ⚠️ TODO (عند ربط الـ backend الحقيقي):
 *   GET/PUT /api/daily-attendance-reports/{date}/{shiftKey}
 */

const store = new Map<string, DailyShiftAttendanceReport>();

function reportKey(date: string, shiftKey: ShiftKey): string {
  return `${date}_${shiftKey}`;
}

function emptyReport(date: string, shiftKey: ShiftKey): DailyShiftAttendanceReport {
  return {
    date,
    shiftKey,
    supervisorId: null,
    shiftEmployeeIds: [],
    weeklyLeaves: [],
    absences: [],
  };
}

export const dailyAttendanceReportService = {
  async getAllEmployees(): Promise<Employee[]> {
    return simulateNetwork(EMPLOYEES, 150);
  },

  /** المشرف يُختار من المنسقين فقط، اتساقًا مع مشرف الشفت بنموذج المتابعة */
  async getCoordinators(): Promise<Employee[]> {
    return simulateNetwork(
      EMPLOYEES.filter((e) => !e.isOperationsRoomStaff),
      150
    );
  },

  async getReport(date: string, shiftKey: ShiftKey): Promise<DailyShiftAttendanceReport> {
    const key = reportKey(date, shiftKey);
    if (!store.has(key)) {
      store.set(key, emptyReport(date, shiftKey));
    }
    return simulateNetwork(store.get(key)!, 200);
  },

  async updateSupervisor(
    date: string,
    shiftKey: ShiftKey,
    supervisorId: string | null
  ): Promise<DailyShiftAttendanceReport> {
    const report = await this.getReport(date, shiftKey);
    const updated: DailyShiftAttendanceReport = { ...report, supervisorId };
    store.set(reportKey(date, shiftKey), updated);
    return simulateNetwork(updated, 150);
  },

  async setShiftEmployees(
    date: string,
    shiftKey: ShiftKey,
    employeeIds: string[]
  ): Promise<DailyShiftAttendanceReport> {
    const report = await this.getReport(date, shiftKey);
    const updated: DailyShiftAttendanceReport = { ...report, shiftEmployeeIds: employeeIds };
    store.set(reportKey(date, shiftKey), updated);
    return simulateNetwork(updated, 150);
  },

  async addWeeklyLeave(
    date: string,
    shiftKey: ShiftKey,
    input: Omit<WeeklyLeaveEntry, "id">
  ): Promise<DailyShiftAttendanceReport> {
    const report = await this.getReport(date, shiftKey);
    const entry: WeeklyLeaveEntry = { ...input, id: generateMockId("leave") };
    const updated: DailyShiftAttendanceReport = {
      ...report,
      weeklyLeaves: [...report.weeklyLeaves, entry],
    };
    store.set(reportKey(date, shiftKey), updated);
    return simulateNetwork(updated, 150);
  },

  async removeWeeklyLeave(
    date: string,
    shiftKey: ShiftKey,
    entryId: string
  ): Promise<DailyShiftAttendanceReport> {
    const report = await this.getReport(date, shiftKey);
    const updated: DailyShiftAttendanceReport = {
      ...report,
      weeklyLeaves: report.weeklyLeaves.filter((e) => e.id !== entryId),
    };
    store.set(reportKey(date, shiftKey), updated);
    return simulateNetwork(updated, 150);
  },

  async addAbsence(
    date: string,
    shiftKey: ShiftKey,
    input: Omit<AbsenceEntry, "id">
  ): Promise<DailyShiftAttendanceReport> {
    const report = await this.getReport(date, shiftKey);
    const entry: AbsenceEntry = { ...input, id: generateMockId("absence") };
    const updated: DailyShiftAttendanceReport = {
      ...report,
      absences: [...report.absences, entry],
    };
    store.set(reportKey(date, shiftKey), updated);
    return simulateNetwork(updated, 150);
  },

  async removeAbsence(
    date: string,
    shiftKey: ShiftKey,
    entryId: string
  ): Promise<DailyShiftAttendanceReport> {
    const report = await this.getReport(date, shiftKey);
    const updated: DailyShiftAttendanceReport = {
      ...report,
      absences: report.absences.filter((e) => e.id !== entryId),
    };
    store.set(reportKey(date, shiftKey), updated);
    return simulateNetwork(updated, 150);
  },
};
