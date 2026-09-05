import { useEffect, useRef, useState } from "react";
import { FileBarChart, Printer, Download, Loader2, ClipboardList, AlertOctagon, CalendarCheck } from "lucide-react";

import { reportService } from "../../../../services/reportService";
import type { ShiftDaySummary, ReportTotals } from "../../../../services/reportService";
import { SHIFT_DEFINITIONS } from "../../../../services/attendanceService";
import { dailyAttendanceReportService } from "../../../../services/dailyAttendanceReportService";
import { exportElementAsPdf } from "../../../../utils/exportPdf";
import type { DailyShiftAttendanceReport, Employee, ShiftKey } from "../../../../types/operationsRoom";

import ShiftPerformanceReport from "./ShiftPerformanceReport";
import AlertReadinessReportForm from "./AlertReadinessReportForm";
import type { AlertReadinessFormData } from "./AlertReadinessReportForm";
import AlertReadinessReportView from "./AlertReadinessReportView";
import { MADINAH_GOVERNORATES } from "./alertReadinessMeta";
import DailyAttendanceReportForm from "./DailyAttendanceReportForm";
import DailyAttendanceReportView from "./DailyAttendanceReportView";

type ReportCategory = "shift_performance" | "daily_attendance" | "alert_readiness";
type ShiftReportType = "daily" | "weekly" | "monthly";

function todayISODate(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function currentMonthValue(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function nowFormatted(): string {
  return new Date().toLocaleString("ar-SA", { dateStyle: "medium", timeStyle: "short" });
}

const emptyAlertForm: AlertReadinessFormData = {
  governorate: MADINAH_GOVERNORATES[0],
  alertLevel: "yellow",
  alertType: "rain",
  readinessTestDone: null,
  responseReportDone: null,
  recoveryReportDone: null,
};

export default function ReportsPanel() {
  const [category, setCategory] = useState<ReportCategory>("shift_performance");

  // -- تقرير أداء المناوبات --
  const [shiftReportType, setShiftReportType] = useState<ShiftReportType>("daily");
  const [dailyDate, setDailyDate] = useState(todayISODate());
  const [weekStartDate, setWeekStartDate] = useState(todayISODate());
  const [monthValue, setMonthValue] = useState(currentMonthValue());
  const [summaries, setSummaries] = useState<ShiftDaySummary[] | null>(null);
  const [totals, setTotals] = useState<ReportTotals | null>(null);
  const [isLoadingShiftReport, setIsLoadingShiftReport] = useState(false);

  // -- التقرير اليومي (حضور الشفت عند بدايته) --
  const [dailyAttDate, setDailyAttDate] = useState(todayISODate());
  const [dailyAttShift, setDailyAttShift] = useState<ShiftKey>(SHIFT_DEFINITIONS[0].key);
  const [dailyAttReport, setDailyAttReport] = useState<DailyShiftAttendanceReport | null>(null);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [coordinators, setCoordinators] = useState<Employee[]>([]);

  // -- تقرير الجاهزية أثناء الإنذار --
  const [alertForm, setAlertForm] = useState<AlertReadinessFormData>(emptyAlertForm);

  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const generateShiftReport = async () => {
    setIsLoadingShiftReport(true);
    let data: ShiftDaySummary[];

    if (shiftReportType === "daily") {
      data = await reportService.getDailyReport(dailyDate);
    } else if (shiftReportType === "weekly") {
      data = await reportService.getWeeklyReport(weekStartDate);
    } else {
      const [year, month] = monthValue.split("-").map(Number);
      data = await reportService.getMonthlyReport(year, month);
    }

    setSummaries(data);
    setTotals(reportService.computeTotals(data));
    setIsLoadingShiftReport(false);
  };

  const loadDailyAttendanceReport = async () => {
    const data = await dailyAttendanceReportService.getReport(dailyAttDate, dailyAttShift);
    setDailyAttReport(data);
  };

  useEffect(() => {
    dailyAttendanceReportService.getAllEmployees().then(setAllEmployees);
    dailyAttendanceReportService.getCoordinators().then(setCoordinators);
  }, []);

  useEffect(() => {
    if (category === "shift_performance") generateShiftReport();
    if (category === "daily_attendance") loadDailyAttendanceReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, shiftReportType, dailyDate, weekStartDate, monthValue, dailyAttDate, dailyAttShift]);

  const shiftReportSubLabel =
    shiftReportType === "daily" ? "يومي" : shiftReportType === "weekly" ? "أسبوعي" : "شهري";

  const shiftRangeLabel =
    shiftReportType === "daily"
      ? `يوم ${dailyDate}`
      : shiftReportType === "weekly"
      ? `أسبوع يبدأ من ${weekStartDate}`
      : `شهر ${monthValue}`;

  const handleExportPdf = async (filename: string) => {
    if (!reportRef.current) return;
    setIsExporting(true);
    try {
      await exportElementAsPdf(reportRef.current, filename);
    } finally {
      setIsExporting(false);
    }
  };

  const categoryButtons: { key: ReportCategory; label: string; icon: typeof ClipboardList }[] = [
    { key: "shift_performance", label: "تقرير أداء المناوبات", icon: ClipboardList },
    { key: "daily_attendance", label: "التقرير اليومي (حضور الشفت)", icon: CalendarCheck },
    { key: "alert_readiness", label: "تقرير الجاهزية أثناء الإنذار", icon: AlertOctagon },
  ];

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* اختيار فئة التقرير */}
      <div className="flex flex-wrap gap-1.5 print:hidden">
        {categoryButtons.map((btn) => {
          const Icon = btn.icon;
          return (
            <button
              key={btn.key}
              type="button"
              onClick={() => setCategory(btn.key)}
              className={`flex items-center gap-1.5 text-sm font-semibold rounded-xl px-4 py-2.5 border-2 transition ${
                category === btn.key
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "border-slate-300 text-blue-700 font-bold hover:bg-blue-50 bg-white"
              }`}
            >
              <Icon size={15} />
              {btn.label}
            </button>
          );
        })}
      </div>

      {category === "shift_performance" && (
        <>
          {/* أدوات التحكم — لا تظهر بالطباعة/التصدير */}
          <div className="rounded-2xl bg-white border-2 border-slate-100 shadow-md p-4 sm:p-5 print:hidden">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-sm font-bold text-blue-700">
                <FileBarChart size={16} />
                نوع التقرير
              </div>

              <div className="flex gap-1.5">
                {(
                  [
                    { key: "daily", label: "يومي" },
                    { key: "weekly", label: "أسبوعي" },
                    { key: "monthly", label: "شهري" },
                  ] as { key: ShiftReportType; label: string }[]
                ).map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setShiftReportType(opt.key)}
                    className={`text-sm font-semibold rounded-xl px-3.5 py-2 border-2 transition ${
                      shiftReportType === opt.key
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "border-slate-300 text-blue-700 font-bold hover:bg-blue-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {shiftReportType === "daily" && (
                <input
                  type="date"
                  value={dailyDate}
                  onChange={(e) => setDailyDate(e.target.value)}
                  className="rounded-xl border-2 border-slate-300 px-3 py-2 text-sm font-semibold text-black focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              )}

              {shiftReportType === "weekly" && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-700">بداية الأسبوع:</span>
                  <input
                    type="date"
                    value={weekStartDate}
                    onChange={(e) => setWeekStartDate(e.target.value)}
                    className="rounded-xl border-2 border-slate-300 px-3 py-2 text-sm font-semibold text-black focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              )}

              {shiftReportType === "monthly" && (
                <input
                  type="month"
                  value={monthValue}
                  onChange={(e) => setMonthValue(e.target.value)}
                  className="rounded-xl border-2 border-slate-300 px-3 py-2 text-sm font-semibold text-black focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              )}

              <div className="flex-1" />

              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 rounded-xl px-3.5 py-2 transition"
              >
                <Printer size={15} />
                طباعة
              </button>

              <button
                type="button"
                onClick={() => handleExportPdf(`تقرير أداء المناوبات - ${shiftRangeLabel}.pdf`)}
                disabled={isExporting || !summaries}
                className="flex items-center gap-1.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl px-3.5 py-2 transition"
              >
                {isExporting ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
                {isExporting ? "جارٍ التنزيل..." : "تنزيل PDF"}
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-white border-2 border-slate-100 shadow-md p-5 sm:p-6 lg:p-8 print:shadow-none print:border-none print:p-0 overflow-x-auto">
            {isLoadingShiftReport || !summaries || !totals ? (
              <div className="h-64 animate-pulse" />
            ) : (
              <div ref={reportRef}>
                <ShiftPerformanceReport
                  title={`تقرير أداء المناوبات (${shiftReportSubLabel})`}
                  rangeLabel={shiftRangeLabel}
                  generatedAt={nowFormatted()}
                  summaries={summaries}
                  totals={totals}
                />
              </div>
            )}
          </div>
        </>
      )}

      {category === "daily_attendance" && (
        <>
          <div className="rounded-2xl bg-white border-2 border-slate-100 shadow-md p-4 sm:p-5 print:hidden">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-sm font-bold text-blue-700">
                <CalendarCheck size={16} />
                التاريخ والشفت
              </div>

              <input
                type="date"
                value={dailyAttDate}
                onChange={(e) => setDailyAttDate(e.target.value)}
                className="rounded-xl border-2 border-slate-300 px-3 py-2 text-sm font-semibold text-black focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />

              <div className="flex gap-1.5">
                {SHIFT_DEFINITIONS.map((def) => (
                  <button
                    key={def.key}
                    type="button"
                    onClick={() => setDailyAttShift(def.key)}
                    className={`text-sm font-semibold rounded-xl px-3.5 py-2 border-2 transition ${
                      dailyAttShift === def.key
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "border-slate-300 text-blue-700 font-bold hover:bg-blue-50"
                    }`}
                    title={`${def.startTime} ← ${def.endTime}`}
                  >
                    {def.key}
                  </button>
                ))}
              </div>

              <div className="flex-1" />

              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 rounded-xl px-3.5 py-2 transition"
              >
                <Printer size={15} />
                طباعة
              </button>

              <button
                type="button"
                onClick={() => handleExportPdf(`التقرير اليومي - ${dailyAttDate} - ${dailyAttShift}.pdf`)}
                disabled={isExporting || !dailyAttReport}
                className="flex items-center gap-1.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl px-3.5 py-2 transition"
              >
                {isExporting ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
                {isExporting ? "جارٍ التنزيل..." : "تنزيل PDF"}
              </button>
            </div>
          </div>

          {dailyAttReport && (
            <DailyAttendanceReportForm
              report={dailyAttReport}
              allEmployees={allEmployees}
              coordinators={coordinators}
              onUpdate={loadDailyAttendanceReport}
            />
          )}

          <div className="rounded-2xl bg-white border-2 border-slate-100 shadow-md p-5 sm:p-6 lg:p-8 print:shadow-none print:border-none print:p-0 overflow-x-auto">
            {!dailyAttReport ? (
              <div className="h-64 animate-pulse" />
            ) : (
              <div ref={reportRef}>
                <DailyAttendanceReportView
                  report={dailyAttReport}
                  allEmployees={allEmployees}
                  coordinators={coordinators}
                  generatedAt={nowFormatted()}
                />
              </div>
            )}
          </div>
        </>
      )}

      {category === "alert_readiness" && (
        <>
          <AlertReadinessReportForm
            data={alertForm}
            onChange={(updates) => setAlertForm((prev) => ({ ...prev, ...updates }))}
          />

          <div className="flex justify-end gap-2 print:hidden">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 rounded-xl px-3.5 py-2 transition bg-white"
            >
              <Printer size={15} />
              طباعة
            </button>

            <button
              type="button"
              onClick={() => handleExportPdf(`تقرير الجاهزية أثناء الإنذار - ${alertForm.governorate}.pdf`)}
              disabled={isExporting}
              className="flex items-center gap-1.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl px-3.5 py-2 transition"
            >
              {isExporting ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
              {isExporting ? "جارٍ التنزيل..." : "تنزيل PDF"}
            </button>
          </div>

          <div className="rounded-2xl bg-white border-2 border-slate-100 shadow-md p-5 sm:p-6 lg:p-8 print:shadow-none print:border-none print:p-0 overflow-x-auto">
            <div ref={reportRef}>
              <AlertReadinessReportView data={alertForm} generatedAt={nowFormatted()} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
