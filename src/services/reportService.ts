import { shiftSessionService } from "./shiftSessionService";
import { SHIFT_DEFINITIONS } from "./attendanceService";
import type { AttendanceStatus, ShiftKey, ShiftSession } from "../types/operationsRoom";

export interface ShiftDaySummary {
  date: string;
  shiftKey: ShiftKey;
  session: ShiftSession | null; // null = لم يُفتح النموذج بعد لهالشفت
  statusCounts: Record<AttendanceStatus, number>;
  totalAttendanceRows: number;
  channelsTestedCount: number;
  emailsCount: number;
}

export interface ReportTotals {
  present: number;
  absent: number;
  late: number;
  onLeave: number;
  dayOff: number;
  fieldMission: number;
  notCheckedIn: number;
  totalRows: number;
  closedShifts: number;
  openShifts: number;
  notStartedShifts: number;
  attendanceRatePercent: number;
}

function emptyStatusCounts(): Record<AttendanceStatus, number> {
  return {
    present: 0,
    absent: 0,
    late: 0,
    on_leave: 0,
    day_off: 0,
    field_mission: 0,
    not_checked_in: 0,
  };
}

function summarize(date: string, shiftKey: ShiftKey, session: ShiftSession | null): ShiftDaySummary {
  const statusCounts = emptyStatusCounts();
  session?.attendance.forEach((row) => {
    statusCounts[row.status] += 1;
  });

  return {
    date,
    shiftKey,
    session,
    statusCounts,
    totalAttendanceRows: session?.attendance.length ?? 0,
    channelsTestedCount: session?.communicationChecks.filter((c) => c.wasTested).length ?? 0,
    emailsCount: (session?.outgoingEmails.length ?? 0) + (session?.incomingEmails.length ?? 0),
  };
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function dateRangeArray(startDateISO: string, days: number): string[] {
  const start = new Date(startDateISO);
  const result: string[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    result.push(`${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`);
  }
  return result;
}

export const reportService = {
  async getSummariesForDates(dates: string[]): Promise<ShiftDaySummary[]> {
    const summaries: ShiftDaySummary[] = [];
    for (const date of dates) {
      for (const def of SHIFT_DEFINITIONS) {
        const session = await shiftSessionService.peekSession(date, def.key);
        summaries.push(summarize(date, def.key, session));
      }
    }
    return summaries;
  },

  async getDailyReport(date: string): Promise<ShiftDaySummary[]> {
    return this.getSummariesForDates([date]);
  },

  async getWeeklyReport(weekStartDate: string): Promise<ShiftDaySummary[]> {
    return this.getSummariesForDates(dateRangeArray(weekStartDate, 7));
  },

  async getMonthlyReport(year: number, month: number): Promise<ShiftDaySummary[]> {
    const daysInMonth = new Date(year, month, 0).getDate();
    const startDate = `${year}-${pad2(month)}-01`;
    return this.getSummariesForDates(dateRangeArray(startDate, daysInMonth));
  },

  computeTotals(summaries: ShiftDaySummary[]): ReportTotals {
    const totals = summaries.reduce(
      (acc, s) => {
        acc.present += s.statusCounts.present;
        acc.absent += s.statusCounts.absent;
        acc.late += s.statusCounts.late;
        acc.onLeave += s.statusCounts.on_leave;
        acc.dayOff += s.statusCounts.day_off;
        acc.fieldMission += s.statusCounts.field_mission;
        acc.notCheckedIn += s.statusCounts.not_checked_in;
        acc.totalRows += s.totalAttendanceRows;

        if (s.session?.status === "closed") acc.closedShifts += 1;
        else if (s.session) acc.openShifts += 1;
        else acc.notStartedShifts += 1;

        return acc;
      },
      {
        present: 0,
        absent: 0,
        late: 0,
        onLeave: 0,
        dayOff: 0,
        fieldMission: 0,
        notCheckedIn: 0,
        totalRows: 0,
        closedShifts: 0,
        openShifts: 0,
        notStartedShifts: 0,
      }
    );

    const attendanceRatePercent =
      totals.totalRows > 0 ? Math.round(((totals.present + totals.late) / totals.totalRows) * 100) : 0;

    return { ...totals, attendanceRatePercent };
  },
};
