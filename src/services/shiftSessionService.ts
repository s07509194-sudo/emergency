import { simulateNetwork, generateMockId } from "./mockNetwork";
import { EMPLOYEES } from "../data/employeesRoster";
import { SHIFT_DEFINITIONS } from "./attendanceService";
import type {
  ShiftSession,
  ShiftKey,
  ShiftAttendanceRow,
  CommunicationChannelKey,
  CommunicationChannelCheck,
  EmailLogEntry,
  Employee,
} from "../types/operationsRoom";

/**
 * خدمة "نموذج متابعة الشفت" — النسخة الرقمية من النموذج الورقي الرسمي
 * المستخدم بمركز الطوارئ والأزمات.
 *
 * ⚠️ TODO (عند ربط الـ backend الحقيقي): كل جلسة شفت (ShiftSession) بتتحدد
 * بمفتاح (التاريخ + رمز الشفت) — نفس المفتاح المفروض يستخدمه الـ API:
 *   GET/PUT /api/shift-sessions/{date}/{shiftKey}
 *   POST    /api/shift-sessions/{date}/{shiftKey}/emails
 *   POST    /api/shift-sessions/{date}/{shiftKey}/close
 */

export const COMMUNICATION_CHANNELS: CommunicationChannelKey[] = [
  "landline",
  "mobile",
  "fax",
  "ministry_hotline",
  "email",
  "thuraya",
];

function buildEmptyCommunicationChecks(): CommunicationChannelCheck[] {
  return COMMUNICATION_CHANNELS.map((channel) => ({ channel, wasTested: false }));
}

const sessionsStore = new Map<string, ShiftSession>();

function sessionKey(date: string, shiftKey: ShiftKey): string {
  return `${date}_${shiftKey}`;
}

function createEmptySession(date: string, shiftKey: ShiftKey): ShiftSession {
  const definition = SHIFT_DEFINITIONS.find((s) => s.key === shiftKey);
  return {
    id: generateMockId("session"),
    date,
    shiftKey,
    startTime: definition?.startTime ?? "00:00",
    endTime: definition?.endTime ?? "00:00",
    liaisonOfficerIds: [],
    shiftSupervisorId: null,
    attendance: [],
    communicationChecks: buildEmptyCommunicationChecks(),
    communicationSummaryNotes: "",
    outgoingEmails: [],
    incomingEmails: [],
    equipmentHandedOverInGoodCondition: null,
    closedBy: null,
    closedAt: null,
    status: "open",
  };
}

const SHIFT_ORDER: ShiftKey[] = ["L", "A", "P", "N"];

/**
 * يحسب (التاريخ + رمز الشفت) للشفت السابق مباشرة على شفت معطى.
 * يستخدم لتمكين الشفت الحالي من الاطلاع على تقرير تسليم الشفت اللي قبله.
 * ترتيب الشفتات: L → A → P → N → (اليوم التالي) L...
 * إذا كان الشفت الحالي L، فالسابق هو N من اليوم السابق.
 */
export function getPreviousShift(date: string, shiftKey: ShiftKey): { date: string; shiftKey: ShiftKey } {
  const currentIndex = SHIFT_ORDER.indexOf(shiftKey);
  const previousIndex = (currentIndex - 1 + SHIFT_ORDER.length) % SHIFT_ORDER.length;
  const previousShiftKey = SHIFT_ORDER[previousIndex];

  if (previousShiftKey !== "N") {
    return { date, shiftKey: previousShiftKey };
  }

  const previousDate = new Date(date);
  previousDate.setDate(previousDate.getDate() - 1);
  const pad = (n: number) => String(n).padStart(2, "0");
  const previousDateStr = `${previousDate.getFullYear()}-${pad(previousDate.getMonth() + 1)}-${pad(previousDate.getDate())}`;

  return { date: previousDateStr, shiftKey: previousShiftKey };
}

export const shiftSessionService = {
  /** قائمة المنسقين فقط (ضباط الاتصال) — لاختيار ضباط الاتصال والمشرف المناوب */
  async getCoordinators(): Promise<Employee[]> {
    return simulateNetwork(
      EMPLOYEES.filter((e) => !e.isOperationsRoomStaff),
      150
    );
  },

  async getSession(date: string, shiftKey: ShiftKey): Promise<ShiftSession> {
    const key = sessionKey(date, shiftKey);
    if (!sessionsStore.has(key)) {
      sessionsStore.set(key, createEmptySession(date, shiftKey));
    }
    return simulateNetwork(sessionsStore.get(key)!, 250);
  },

  /** نفس getSession بس بدون إنشاء جلسة فاضية جديدة — للاستخدام بالتقارير فقط */
  async peekSession(date: string, shiftKey: ShiftKey): Promise<ShiftSession | null> {
    return simulateNetwork(sessionsStore.get(sessionKey(date, shiftKey)) ?? null, 100);
  },

  async updateBasicInfo(
    date: string,
    shiftKey: ShiftKey,
    updates: { liaisonOfficerIds?: string[]; shiftSupervisorId?: string | null }
  ): Promise<ShiftSession> {
    const session = await this.getSession(date, shiftKey);
    const updated: ShiftSession = { ...session, ...updates };
    sessionsStore.set(sessionKey(date, shiftKey), updated);
    return simulateNetwork(updated, 200);
  },

  async setAttendanceRows(
    date: string,
    shiftKey: ShiftKey,
    rows: ShiftAttendanceRow[]
  ): Promise<ShiftSession> {
    const session = await this.getSession(date, shiftKey);
    const updated: ShiftSession = { ...session, attendance: rows };
    sessionsStore.set(sessionKey(date, shiftKey), updated);
    return simulateNetwork(updated, 200);
  },

  async updateCommunicationCheck(
    date: string,
    shiftKey: ShiftKey,
    channel: CommunicationChannelKey,
    updates: Partial<CommunicationChannelCheck>
  ): Promise<ShiftSession> {
    const session = await this.getSession(date, shiftKey);
    const updated: ShiftSession = {
      ...session,
      communicationChecks: session.communicationChecks.map((check) =>
        check.channel === channel ? { ...check, ...updates } : check
      ),
    };
    sessionsStore.set(sessionKey(date, shiftKey), updated);
    return simulateNetwork(updated, 200);
  },

  async updateCommunicationSummaryNotes(
    date: string,
    shiftKey: ShiftKey,
    notes: string
  ): Promise<ShiftSession> {
    const session = await this.getSession(date, shiftKey);
    const updated: ShiftSession = { ...session, communicationSummaryNotes: notes };
    sessionsStore.set(sessionKey(date, shiftKey), updated);
    return simulateNetwork(updated, 150);
  },

  async addEmailLog(
    date: string,
    shiftKey: ShiftKey,
    direction: "outgoing" | "incoming",
    input: Omit<EmailLogEntry, "id" | "direction">
  ): Promise<ShiftSession> {
    const session = await this.getSession(date, shiftKey);
    const entry: EmailLogEntry = { ...input, id: generateMockId("mail"), direction };
    const updated: ShiftSession = {
      ...session,
      outgoingEmails:
        direction === "outgoing" ? [...session.outgoingEmails, entry] : session.outgoingEmails,
      incomingEmails:
        direction === "incoming" ? [...session.incomingEmails, entry] : session.incomingEmails,
    };
    sessionsStore.set(sessionKey(date, shiftKey), updated);
    return simulateNetwork(updated, 200);
  },

  /** إغلاق/تسليم الشفت — يقفل النموذج ويمنع التعديل (بمرحلة لاحقة) */
  async closeSession(
    date: string,
    shiftKey: ShiftKey,
    input: { closedBy: string; equipmentHandedOverInGoodCondition: boolean }
  ): Promise<ShiftSession> {
    const session = await this.getSession(date, shiftKey);
    const updated: ShiftSession = {
      ...session,
      closedBy: input.closedBy,
      equipmentHandedOverInGoodCondition: input.equipmentHandedOverInGoodCondition,
      closedAt: new Date().toISOString(),
      status: "closed",
    };
    sessionsStore.set(sessionKey(date, shiftKey), updated);
    return simulateNetwork(updated, 300);
  },
};
