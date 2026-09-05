import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import amanahLogo from "../assets/images/amanah-logo.png";
import amiriFont from "../assets/fonts/Amiri-Regular.ttf";
import type { CommunicationChannelCheck, Employee, ShiftSession } from "../types/operationsRoom";
import { SHIFT_DEFINITIONS } from "../services/attendanceService";
import { ATTENDANCE_STATUS_META } from "../features/operationsRoom/utils/statusMeta";
import { CHANNEL_META } from "../features/attendance/components/shiftSession/channelMeta";

const GREEN: [number, number, number] = [0, 111, 80];
const DARK_GREEN: [number, number, number] = [0, 83, 61];
const SOFT_GREEN: [number, number, number] = [232, 246, 238];
const BORDER: [number, number, number] = [184, 216, 202];
const INK: [number, number, number] = [17, 24, 39];
const MARGIN = 14;
const CONTENT_WIDTH = 182;
const FOOTER_Y = 288;

type PdfWithTable = jsPDF & { lastAutoTable?: { finalY?: number } };

export interface ShiftSessionPdfInput {
  session: ShiftSession;
  coordinators: Employee[];
  generatedAt?: Date;
}

export function formatArabicReportDate(date: string): string {
  const safeDate = new Date(`${date}T12:00:00`);
  if (Number.isNaN(safeDate.getTime())) return date;

  return new Intl.DateTimeFormat("ar-SA-u-ca-gregory", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(safeDate);
}

export function formatArabicReportDateTime(value = new Date()): string {
  return new Intl.DateTimeFormat("ar-SA-u-ca-gregory", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function getShiftLabel(session: ShiftSession): string {
  return SHIFT_DEFINITIONS.find((shift) => shift.key === session.shiftKey)?.label ?? `الشيفت ${session.shiftKey}`;
}

function getLiaisonNames(session: ShiftSession, coordinators: Employee[]): string {
  return coordinators
    .filter((coordinator) => session.liaisonOfficerIds.includes(coordinator.id))
    .map((coordinator) => coordinator.name)
    .join("، ");
}

function getSupervisorName(session: ShiftSession, coordinators: Employee[]): string {
  return coordinators.find((coordinator) => coordinator.id === session.shiftSupervisorId)?.name ?? "—";
}

function getOperationalStatus(session: ShiftSession): string {
  if (session.status === "closed") return "مغلق ومسلم رسميًا";
  return "مفتوح وقيد المتابعة";
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

function toBase64(arrayBuffer: ArrayBuffer): string {
  const bytes = new Uint8Array(arrayBuffer);
  const chunkSize = 0x8000;
  let binary = "";

  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }

  return btoa(binary);
}

async function loadArabicFont(pdf: jsPDF): Promise<void> {
  const response = await fetch(amiriFont);
  if (!response.ok) throw new Error("تعذر تحميل خط التقرير العربي.");

  pdf.addFileToVFS("Amiri-Regular.ttf", toBase64(await response.arrayBuffer()));
  pdf.addFont("Amiri-Regular.ttf", "Amiri", "normal");
  pdf.setFont("Amiri", "normal");
}

async function loadImageData(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const mimeType = response.headers.get("content-type") ?? "image/png";
    return `data:${mimeType};base64,${toBase64(await response.arrayBuffer())}`;
  } catch {
    return null;
  }
}

function sectionHeader(pdf: jsPDF, title: string, y: number): number {
  if (y > 263) {
    pdf.addPage();
    y = 16;
  }

  pdf.setFillColor(...GREEN);
  pdf.rect(MARGIN, y, CONTENT_WIDTH, 8, "F");
  pdf.setFont("Amiri", "normal");
  pdf.setFontSize(12);
  pdf.setTextColor(255, 255, 255);
  pdf.text(title, MARGIN + CONTENT_WIDTH - 3, y + 5.5, { align: "right" });
  return y + 11;
}

function summaryTable(
  pdf: PdfWithTable,
  rows: Array<[string, string]>,
  startY: number
): number {
  autoTable(pdf, {
    startY,
    margin: { left: MARGIN, right: MARGIN },
    theme: "grid",
    body: rows.map(([label, value]) => [value || "—", label]),
    styles: {
      font: "Amiri",
      fontStyle: "normal",
      fontSize: 10,
      textColor: INK,
      lineColor: BORDER,
      lineWidth: 0.25,
      cellPadding: 2.3,
      halign: "right",
      valign: "middle",
      overflow: "linebreak",
    },
    columnStyles: {
      0: { cellWidth: 133, fontStyle: "normal" },
      1: { cellWidth: 49, fillColor: SOFT_GREEN, textColor: DARK_GREEN, fontStyle: "normal" },
    },
    tableWidth: CONTENT_WIDTH,
    rowPageBreak: "avoid",
  });

  return (pdf.lastAutoTable?.finalY ?? startY) + 8;
}

function dataTable(
  pdf: PdfWithTable,
  title: string,
  headers: string[],
  rows: string[][],
  startY: number,
  columnWidths?: Record<number, number>
): number {
  const tableStart = sectionHeader(pdf, title, startY);
  const columnStyles = columnWidths
    ? Object.fromEntries(Object.entries(columnWidths).map(([index, cellWidth]) => [index, { cellWidth }]))
    : undefined;

  autoTable(pdf, {
    startY: tableStart,
    margin: { left: MARGIN, right: MARGIN },
    head: [headers],
    body: rows.length > 0 ? rows : [["لا توجد بيانات مسجلة ضمن هذا القسم."]],
    theme: "grid",
    showHead: rows.length > 0 ? "everyPage" : "never",
    styles: {
      font: "Amiri",
      fontStyle: "normal",
      fontSize: 8.6,
      textColor: INK,
      lineColor: BORDER,
      lineWidth: 0.25,
      cellPadding: 1.8,
      halign: "right",
      valign: "middle",
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: SOFT_GREEN,
      textColor: DARK_GREEN,
      font: "Amiri",
      fontStyle: "normal",
      fontSize: 8.8,
      halign: "right",
    },
    alternateRowStyles: { fillColor: [248, 252, 250] },
    columnStyles,
    tableWidth: CONTENT_WIDTH,
    rowPageBreak: "avoid",
  });

  return (pdf.lastAutoTable?.finalY ?? tableStart) + 8;
}

function addFooters(pdf: jsPDF, generatedAt: string): void {
  const pages = pdf.getNumberOfPages();
  const pageWidth = pdf.internal.pageSize.getWidth();

  for (let page = 1; page <= pages; page += 1) {
    pdf.setPage(page);
    pdf.setDrawColor(...BORDER);
    pdf.setLineWidth(0.25);
    pdf.line(MARGIN, FOOTER_Y - 4, pageWidth - MARGIN, FOOTER_Y - 4);
    pdf.setFont("Amiri", "normal");
    pdf.setFontSize(8.5);
    pdf.setTextColor(71, 85, 105);
    pdf.text("أمانة منطقة المدينة المنورة — إدارة الطوارئ والأزمات", pageWidth - MARGIN, FOOTER_Y, {
      align: "right",
    });
    pdf.text(`تاريخ الإنشاء: ${generatedAt}`, pageWidth / 2, FOOTER_Y, { align: "center" });
    pdf.text(`الصفحة ${page} من ${pages}`, MARGIN, FOOTER_Y, { align: "left" });
  }
}

/**
 * ينشئ ملف PDF حقيقيًا بنصوص وجداول قابلة للبحث والنسخ، ولا يعتمد على لقطة شاشة للواجهة.
 */
export async function exportShiftSessionReportPdf({
  session,
  coordinators,
  generatedAt = new Date(),
}: ShiftSessionPdfInput): Promise<void> {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true }) as PdfWithTable;
  pdf.setLanguage("ar-SA");
  // يقوم jsPDF بمعالجة تشكيل العربية تلقائيًا؛ تفعيل R2L هنا يعكس المحارف
  // مرة ثانية داخل الخط المضمّن. يبقى ترتيب الأعمدة والمحاذاة RTL يدويًا.
  pdf.setR2L(false);
  await loadArabicFont(pdf);

  const generatedAtText = formatArabicReportDateTime(generatedAt);
  const liaisonNames = getLiaisonNames(session, coordinators) || "—";
  const supervisorName = getSupervisorName(session, coordinators);
  const testedChannels = session.communicationChecks.filter((check) => check.wasTested).length;
  const presentCount = session.attendance.filter((row) => row.status === "present" || row.status === "late").length;
  const pendingFollowUps = getPendingFollowUps(session.communicationChecks);
  const logo = await loadImageData(amanahLogo);

  if (logo) pdf.addImage(logo, "PNG", MARGIN, 10, 16, 16);
  pdf.setFillColor(...GREEN);
  pdf.rect(MARGIN + (logo ? 20 : 0), 10, CONTENT_WIDTH - (logo ? 20 : 0), 16, "F");
  pdf.setFont("Amiri", "normal");
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(15);
  pdf.text("أمانة منطقة المدينة المنورة", MARGIN + CONTENT_WIDTH - 4, 16, { align: "right" });
  pdf.setFontSize(9.5);
  pdf.text("إدارة الطوارئ والأزمات", MARGIN + CONTENT_WIDTH - 4, 22, { align: "right" });

  pdf.setTextColor(...DARK_GREEN);
  pdf.setFontSize(21);
  pdf.text("تقرير تسليم الشيفت", MARGIN + CONTENT_WIDTH / 2, 37, { align: "center" });
  pdf.setFontSize(10);
  pdf.setTextColor(71, 85, 105);
  pdf.text(`تاريخ إنشاء التقرير: ${generatedAtText}`, MARGIN + CONTENT_WIDTH / 2, 43, { align: "center" });

  let cursorY = sectionHeader(pdf, "البيانات الأساسية للشيفت", 49);
  cursorY = summaryTable(
    pdf,
    [
      ["التاريخ", formatArabicReportDate(session.date)],
      ["الشيفت", getShiftLabel(session)],
      ["وقت الشيفت", `${session.startTime} — ${session.endTime}`],
      ["المشرف المناوب", supervisorName],
      ["ضابط/ضباط الاتصال", liaisonNames],
      ["حالة التقرير", getOperationalStatus(session)],
    ],
    cursorY
  );

  cursorY = sectionHeader(pdf, "الحالة التشغيلية", cursorY);
  cursorY = summaryTable(
    pdf,
    [
      ["حالة الأجهزة", getEquipmentStatus(session)],
      ["الحضور المسجل", `${presentCount} من أصل ${session.attendance.length}`],
      ["قنوات الاتصال المختبرة", `${testedChannels} من أصل ${session.communicationChecks.length}`],
      ["المراسلات", `صادر: ${session.outgoingEmails.length} — وارد: ${session.incomingEmails.length}`],
    ],
    cursorY
  );

  cursorY = dataTable(
    pdf,
    "بيانات الحضور والمناوبة",
    ["ملاحظات", "الحالة", "الخروج", "الدخول", "الصفة", "الاسم"],
    session.attendance.map((row) => [
      row.notes || "—",
      ATTENDANCE_STATUS_META[row.status].label,
      row.checkOutTime || "—",
      row.checkInTime || "—",
      row.roleLabel,
      row.employeeName,
    ]),
    cursorY,
    { 0: 34, 1: 22, 2: 19, 3: 19, 4: 38, 5: 50 }
  );

  cursorY = dataTable(
    pdf,
    "الحالة التشغيلية وقنوات التواصل",
    ["ملاحظات", "المسؤول", "الوقت", "النتيجة", "تم الاختبار", "القناة"],
    session.communicationChecks.map((check) => [
      check.notes || "—",
      check.testedBy || "—",
      check.testedAt || "—",
      check.result || "—",
      check.wasTested ? "نعم" : "لا",
      CHANNEL_META[check.channel].label,
    ]),
    cursorY,
    { 0: 36, 1: 30, 2: 20, 3: 36, 4: 22, 5: 38 }
  );

  cursorY = dataTable(
    pdf,
    "سجل المهام والمراسلات الصادرة",
    ["ملاحظات", "الموضوع / المهمة", "الجهة المستلمة", "المُرسل", "الوقت"],
    session.outgoingEmails.map((mail) => [
      mail.notes || "—",
      mail.subject,
      mail.recipientEntity || "—",
      mail.senderName || "—",
      mail.sentAt || "—",
    ]),
    cursorY,
    { 0: 32, 1: 57, 2: 42, 3: 31, 4: 20 }
  );

  cursorY = dataTable(
    pdf,
    "سجل التعليمات والمراسلات الواردة",
    ["ملاحظات", "الموضوع / التعليمات", "الجهة المرسلة", "المُرسل", "الوقت"],
    session.incomingEmails.map((mail) => [
      mail.notes || "—",
      mail.subject,
      mail.recipientEntity || "—",
      mail.senderName || "—",
      mail.sentAt || "—",
    ]),
    cursorY,
    { 0: 32, 1: 57, 2: 42, 3: 31, 4: 20 }
  );

  cursorY = sectionHeader(pdf, "الملاحظات والتعليمات والمهام المعلقة", cursorY);
  const notes = session.communicationSummaryNotes.trim() || "لا توجد ملاحظات أو تعليمات تشغيلية إضافية مسجلة.";
  pdf.setFont("Amiri", "normal");
  pdf.setFontSize(10.5);
  pdf.setTextColor(...INK);
  const noteLines = pdf.splitTextToSize(notes, CONTENT_WIDTH - 8);
  pdf.setFillColor(...SOFT_GREEN);
  pdf.rect(MARGIN, cursorY, CONTENT_WIDTH, Math.max(12, noteLines.length * 5 + 6), "F");
  pdf.text(noteLines, MARGIN + CONTENT_WIDTH - 4, cursorY + 5, { align: "right" });
  cursorY += Math.max(12, noteLines.length * 5 + 6) + 6;

  cursorY = dataTable(
    pdf,
    "بنود المتابعة المعلقة",
    ["البند المطلوب متابعته"],
    pendingFollowUps.map((item) => [item]),
    cursorY,
    { 0: CONTENT_WIDTH }
  );

  cursorY = sectionHeader(pdf, "التوقيعات والإقرار", cursorY);
  const signatureRows = [
    ["المُسلِّم", session.closedBy || supervisorName || "—"],
    ["المُستلم", "____________________________"],
    ["المشرف / الاعتماد", "____________________________"],
  ];
  autoTable(pdf, {
    startY: cursorY,
    margin: { left: MARGIN, right: MARGIN },
    body: signatureRows.map(([role, name]) => [name, role]),
    theme: "grid",
    styles: {
      font: "Amiri",
      fontStyle: "normal",
      fontSize: 10.5,
      textColor: INK,
      lineColor: BORDER,
      lineWidth: 0.25,
      cellPadding: 4.4,
      minCellHeight: 18,
      halign: "right",
      valign: "middle",
    },
    columnStyles: {
      0: { cellWidth: 125 },
      1: { cellWidth: 57, fillColor: SOFT_GREEN, textColor: DARK_GREEN },
    },
    tableWidth: CONTENT_WIDTH,
    rowPageBreak: "avoid",
  });

  addFooters(pdf, generatedAtText);
  pdf.save(`تقرير تسليم الشيفت - ${session.date} - ${session.shiftKey}.pdf`);
}
