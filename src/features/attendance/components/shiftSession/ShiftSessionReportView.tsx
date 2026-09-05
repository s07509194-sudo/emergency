import amanahLogo from "../../../../assets/images/amanah-logo.png";
import { SHIFT_DEFINITIONS } from "../../../../services/attendanceService";
import type { CommunicationChannelCheck, Employee, ShiftSession } from "../../../../types/operationsRoom";
import { ATTENDANCE_STATUS_META, formatDateTime } from "../../../operationsRoom/utils/statusMeta";
import { formatArabicReportDate } from "../../../../utils/shiftSessionReportPdf";
import { CHANNEL_META } from "./channelMeta";
import "./ShiftSessionReportView.css";

interface ShiftSessionReportViewProps {
  session: ShiftSession;
  coordinators: Employee[];
  generatedAt: string;
}

function getShiftLabel(session: ShiftSession): string {
  return SHIFT_DEFINITIONS.find((shift) => shift.key === session.shiftKey)?.label ?? `الشيفت ${session.shiftKey}`;
}

function getOperationalStatus(session: ShiftSession): string {
  return session.status === "closed" ? "مغلق ومُسلَّم رسميًا" : "مفتوح وقيد المتابعة";
}

function getEquipmentStatus(session: ShiftSession): string {
  if (session.equipmentHandedOverInGoodCondition === true) return "تم التسليم بحالة جيدة";
  if (session.equipmentHandedOverInGoodCondition === false) return "توجد ملاحظة على الأجهزة";
  return "لم يتم التوثيق بعد";
}

function getPendingFollowUps(checks: CommunicationChannelCheck[]): string[] {
  return checks.flatMap((check) => {
    const channel = CHANNEL_META[check.channel].label;
    const note = check.notes?.trim();

    if (!check.wasTested) return [`استكمال اختبار قناة ${channel}.`];
    if (note) return [`${channel}: ${note}`];
    if (check.result && !/ناجح|سليم|ممتاز|متاح|يعمل/i.test(check.result)) {
      return [`متابعة قناة ${channel}: ${check.result}`];
    }
    return [];
  });
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="report-section">
      <h2 className="report-section-heading">{title}</h2>
      <div className="report-section-body">{children}</div>
    </section>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="report-info-item">
      <span className="report-info-label">{label}</span>
      <span className="report-info-value">{value || "—"}</span>
    </div>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return <p className="report-empty-state">{children}</p>;
}

export default function ShiftSessionReportView({
  session,
  coordinators,
  generatedAt,
}: ShiftSessionReportViewProps) {
  const liaisonNames = coordinators
    .filter((coordinator) => session.liaisonOfficerIds.includes(coordinator.id))
    .map((coordinator) => coordinator.name)
    .join("، ");
  const supervisorName = coordinators.find((coordinator) => coordinator.id === session.shiftSupervisorId)?.name ?? "—";
  const presentCount = session.attendance.filter((row) => row.status === "present" || row.status === "late").length;
  const testedChannels = session.communicationChecks.filter((check) => check.wasTested).length;
  const pendingFollowUps = getPendingFollowUps(session.communicationChecks);

  return (
    <article className="shift-session-report" data-shift-report="true" dir="rtl" lang="ar">
      <header className="report-header">
        <div className="report-brand-row">
          <div className="report-brand">
            <img src={amanahLogo} alt="شعار أمانة منطقة المدينة المنورة" className="report-logo" />
            <div>
              <p className="report-authority">أمانة منطقة المدينة المنورة</p>
              <p className="report-department">إدارة الطوارئ والأزمات</p>
            </div>
          </div>
          <div className="report-meta-top">
            <div>المرجع: SH-{session.date}-{session.shiftKey}</div>
            <div>تاريخ الإنشاء: {generatedAt}</div>
          </div>
        </div>
        <h1 className="report-title">تقرير تسليم الشيفت</h1>
        <p className="report-subtitle">سجل رسمي لمتابعة التسليم والاستلام في غرفة العمليات</p>
      </header>

      <Section title="البيانات الأساسية للشيفت">
        <div className="report-info-grid">
          <InfoItem label="التاريخ" value={formatArabicReportDate(session.date)} />
          <InfoItem label="رمز واسم الشيفت" value={getShiftLabel(session)} />
          <InfoItem label="وقت الشيفت" value={`${session.startTime} — ${session.endTime}`} />
          <InfoItem label="المشرف المناوب" value={supervisorName} />
          <InfoItem label="ضابط / ضباط الاتصال" value={liaisonNames || "—"} />
          <InfoItem label="حالة الشيفت" value={getOperationalStatus(session)} />
        </div>
      </Section>

      <Section title="الحالة التشغيلية">
        <div className="report-status-grid">
          <div className="report-status-card">
            <span className="report-status-label">حالة الأجهزة</span>
            <strong className="report-status-value">{getEquipmentStatus(session)}</strong>
          </div>
          <div className="report-status-card">
            <span className="report-status-label">الحضور المسجل</span>
            <strong className="report-status-value">{presentCount} من أصل {session.attendance.length}</strong>
          </div>
          <div className="report-status-card">
            <span className="report-status-label">قنوات الاتصال المختبرة</span>
            <strong className="report-status-value">{testedChannels} من أصل {session.communicationChecks.length}</strong>
          </div>
          <div className={`report-status-card ${pendingFollowUps.length > 0 ? "warning" : ""}`}>
            <span className="report-status-label">بنود المتابعة</span>
            <strong className="report-status-value">{pendingFollowUps.length} بند</strong>
          </div>
        </div>
      </Section>

      <Section title="بيانات الحضور والمناوبة">
        {session.attendance.length === 0 ? (
          <EmptyState>لا توجد بيانات حضور مسجلة لهذا الشيفت.</EmptyState>
        ) : (
          <div className="report-table-wrap">
            <table className="report-table">
              <thead>
                <tr>
                  <th scope="col" style={{ width: "21%" }}>الاسم</th>
                  <th scope="col" style={{ width: "18%" }}>الصفة</th>
                  <th scope="col" style={{ width: "11%" }}>الدخول</th>
                  <th scope="col" style={{ width: "11%" }}>الخروج</th>
                  <th scope="col" style={{ width: "14%" }}>الحالة</th>
                  <th scope="col">الملاحظات</th>
                </tr>
              </thead>
              <tbody>
                {session.attendance.map((row) => (
                  <tr key={row.employeeId}>
                    <td>{row.employeeName}</td>
                    <td>{row.roleLabel}</td>
                    <td className="center" dir="ltr">{row.checkInTime || "—"}</td>
                    <td className="center" dir="ltr">{row.checkOutTime || "—"}</td>
                    <td>{ATTENDANCE_STATUS_META[row.status].label}</td>
                    <td>{row.notes || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      <Section title="الحالة التشغيلية وقنوات التواصل">
        <div className="report-table-wrap">
          <table className="report-table">
            <thead>
              <tr>
                <th scope="col" style={{ width: "20%" }}>القناة</th>
                <th scope="col" style={{ width: "12%" }}>تم الاختبار</th>
                <th scope="col" style={{ width: "15%" }}>النتيجة</th>
                <th scope="col" style={{ width: "13%" }}>الوقت</th>
                <th scope="col" style={{ width: "18%" }}>المسؤول</th>
                <th scope="col">الملاحظات</th>
              </tr>
            </thead>
            <tbody>
              {session.communicationChecks.map((check) => (
                <tr key={check.channel}>
                  <td>{CHANNEL_META[check.channel].label}</td>
                  <td className="center">{check.wasTested ? "نعم" : "لا"}</td>
                  <td>{check.result || "—"}</td>
                  <td className="center" dir="ltr">{check.testedAt || "—"}</td>
                  <td>{check.testedBy || "—"}</td>
                  <td>{check.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title={`سجل المهام والمراسلات الصادرة (${session.outgoingEmails.length})`}>
        {session.outgoingEmails.length === 0 ? (
          <EmptyState>لا توجد مهام أو مراسلات صادرة مسجلة.</EmptyState>
        ) : (
          <div className="report-table-wrap">
            <table className="report-table">
              <thead>
                <tr>
                  <th scope="col" style={{ width: "13%" }}>الوقت</th>
                  <th scope="col" style={{ width: "16%" }}>المُرسل</th>
                  <th scope="col" style={{ width: "19%" }}>الجهة المستلمة</th>
                  <th scope="col" style={{ width: "29%" }}>الموضوع / المهمة</th>
                  <th scope="col">الملاحظات</th>
                </tr>
              </thead>
              <tbody>
                {session.outgoingEmails.map((mail) => (
                  <tr key={mail.id}>
                    <td className="center" dir="ltr">{mail.sentAt || "—"}</td>
                    <td>{mail.senderName || "—"}</td>
                    <td>{mail.recipientEntity || "—"}</td>
                    <td>{mail.subject}</td>
                    <td>{mail.notes || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      <Section title={`سجل التعليمات والمراسلات الواردة (${session.incomingEmails.length})`}>
        {session.incomingEmails.length === 0 ? (
          <EmptyState>لا توجد تعليمات أو مراسلات واردة مسجلة.</EmptyState>
        ) : (
          <div className="report-table-wrap">
            <table className="report-table">
              <thead>
                <tr>
                  <th scope="col" style={{ width: "13%" }}>الوقت</th>
                  <th scope="col" style={{ width: "16%" }}>المُرسل</th>
                  <th scope="col" style={{ width: "19%" }}>الجهة المرسلة</th>
                  <th scope="col" style={{ width: "29%" }}>الموضوع / التعليمات</th>
                  <th scope="col">الملاحظات</th>
                </tr>
              </thead>
              <tbody>
                {session.incomingEmails.map((mail) => (
                  <tr key={mail.id}>
                    <td className="center" dir="ltr">{mail.sentAt || "—"}</td>
                    <td>{mail.senderName || "—"}</td>
                    <td>{mail.recipientEntity || "—"}</td>
                    <td>{mail.subject}</td>
                    <td>{mail.notes || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      <Section title="الملاحظات والتعليمات العامة">
        <p className="report-note-box">
          {session.communicationSummaryNotes.trim() || "لا توجد ملاحظات أو تعليمات تشغيلية إضافية مسجلة."}
        </p>
      </Section>

      <Section title="المهام المعلقة وبنود المتابعة">
        {pendingFollowUps.length === 0 ? (
          <EmptyState>لا توجد مهام معلقة أو بنود متابعة مسجلة.</EmptyState>
        ) : (
          <ol className="report-followup-list">
            {pendingFollowUps.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
          </ol>
        )}
      </Section>

      <Section title="التوقيعات والإقرار">
        <div className="report-signatures">
          <div className="report-signature">
            <span className="report-signature-label">المُسلِّم</span>
            <strong className="report-signature-name">{session.closedBy || supervisorName}</strong>
            <span className="report-signature-date">{session.closedAt ? formatDateTime(session.closedAt) : "التاريخ والتوقيع"}</span>
          </div>
          <div className="report-signature">
            <span className="report-signature-label">المُستلم</span>
            <strong className="report-signature-name">&nbsp;</strong>
            <span className="report-signature-date">الاسم والتوقيع والتاريخ</span>
          </div>
          <div className="report-signature">
            <span className="report-signature-label">اعتماد المشرف</span>
            <strong className="report-signature-name">&nbsp;</strong>
            <span className="report-signature-date">الاسم والتوقيع والختم</span>
          </div>
        </div>
      </Section>

      <footer className="report-footer">
        <span>أمانة منطقة المدينة المنورة — إدارة الطوارئ والأزمات</span>
        <span className="report-page-number" aria-label="رقم الصفحة" />
        <span>تاريخ إنشاء التقرير: {generatedAt}</span>
      </footer>
    </article>
  );
}
