import { useEffect, useState } from "react";
import { CalendarClock } from "lucide-react";

import { shiftSessionService } from "../../../../services/shiftSessionService";
import { SHIFT_DEFINITIONS } from "../../../../services/attendanceService";
import type {
  CommunicationChannelKey,
  CommunicationChannelCheck,
  Employee,
  EmailLogEntry,
  ShiftKey,
  ShiftSession,
} from "../../../../types/operationsRoom";

import BasicInfoSection from "./BasicInfoSection";
import AttendanceRowsTable from "./AttendanceRowsTable";
import CommunicationChannelsTable from "./CommunicationChannelsTable";
import EmailLogSection from "./EmailLogSection";
import EndOfShiftSection from "./EndOfShiftSection";

function todayISODate(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export default function ShiftSessionForm() {
  const [selectedDate, setSelectedDate] = useState(todayISODate());
  const [selectedShift, setSelectedShift] = useState<ShiftKey>(SHIFT_DEFINITIONS[0].key);
  const [session, setSession] = useState<ShiftSession | null>(null);
  const [coordinators, setCoordinators] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSession = async (date: string, shiftKey: ShiftKey) => {
    setIsLoading(true);
    const data = await shiftSessionService.getSession(date, shiftKey);
    setSession(data);
    setIsLoading(false);
  };

  useEffect(() => {
    shiftSessionService.getCoordinators().then(setCoordinators);
  }, []);

  useEffect(() => {
    loadSession(selectedDate, selectedShift);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, selectedShift]);

  if (!session) {
    return (
      <div className="rounded-2xl bg-white border-2 border-slate-100 shadow-md p-6 animate-pulse h-40" />
    );
  }

  const isClosed = session.status === "closed";

  const handleBasicInfoChange = async (updates: {
    liaisonOfficerIds?: string[];
    shiftSupervisorId?: string | null;
  }) => {
    const updated = await shiftSessionService.updateBasicInfo(selectedDate, selectedShift, updates);
    setSession(updated);
  };

  const handleAttendanceChange = async (rows: ShiftSession["attendance"]) => {
    const updated = await shiftSessionService.setAttendanceRows(selectedDate, selectedShift, rows);
    setSession(updated);
  };

  const handleChannelChange = async (
    channel: CommunicationChannelKey,
    updates: Partial<CommunicationChannelCheck>
  ) => {
    const updated = await shiftSessionService.updateCommunicationCheck(
      selectedDate,
      selectedShift,
      channel,
      updates
    );
    setSession(updated);
  };

  const handleCommunicationSummaryNotesChange = async (notes: string) => {
    const updated = await shiftSessionService.updateCommunicationSummaryNotes(
      selectedDate,
      selectedShift,
      notes
    );
    setSession(updated);
  };

  const handleAddEmail = async (
    direction: "outgoing" | "incoming",
    input: Omit<EmailLogEntry, "id" | "direction">
  ) => {
    const updated = await shiftSessionService.addEmailLog(selectedDate, selectedShift, direction, input);
    setSession(updated);
  };

  const handleCloseSession = async (input: {
    closedBy: string;
    equipmentHandedOverInGoodCondition: boolean;
  }) => {
    const updated = await shiftSessionService.closeSession(selectedDate, selectedShift, input);
    setSession(updated);
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* شريط اختيار التاريخ والشفت */}
      <div className="rounded-2xl bg-white border-2 border-slate-200 shadow-md p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm font-extrabold text-black">
            <CalendarClock size={16} className="text-blue-600" />
            تسليم الشيفت
          </div>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-xl border-2 border-slate-300 px-3 py-2 text-sm font-semibold text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <div className="flex gap-1.5">
            {SHIFT_DEFINITIONS.map((def) => (
              <button
                key={def.key}
                type="button"
                onClick={() => setSelectedShift(def.key)}
                className={`text-sm font-bold rounded-xl px-3.5 py-2 border-2 transition ${
                  selectedShift === def.key
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-slate-300 text-black hover:bg-slate-50"
                }`}
                title={`${def.startTime} ← ${def.endTime}`}
              >
                {def.key}
              </button>
            ))}
          </div>

          {isClosed && (
            <span className="text-xs font-bold text-white bg-slate-700 rounded-full px-3 py-1.5">
              🔒 هالشفت مقفول ومسلَّم
            </span>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-2xl bg-white border-2 border-slate-200 shadow-md p-6 animate-pulse h-40" />
      ) : (
        <>
          <BasicInfoSection session={session} onChange={handleBasicInfoChange} disabled={isClosed} />

          <AttendanceRowsTable
            rows={session.attendance}
            onChange={handleAttendanceChange}
            disabled={isClosed}
          />

          <CommunicationChannelsTable
            checks={session.communicationChecks}
            onChangeChannel={handleChannelChange}
            overallNotes={session.communicationSummaryNotes}
            onChangeOverallNotes={handleCommunicationSummaryNotesChange}
            disabled={isClosed}
          />

          <EmailLogSection
            outgoing={session.outgoingEmails}
            incoming={session.incomingEmails}
            onAdd={handleAddEmail}
            disabled={isClosed}
          />

          <EndOfShiftSection
            session={session}
            coordinators={coordinators}
            onClose={handleCloseSession}
          />
        </>
      )}
    </div>
  );
}
