import { useState } from "react";
import { LayoutDashboard, ArrowLeftRight, FileBarChart } from "lucide-react";

import MainLayout from "../../components/layout/MainLayout";
import AttendanceSummaryBar from "./components/AttendanceSummaryBar";
import StaffingTable from "./components/StaffingTable";
import ShiftScheduleCard from "./components/ShiftScheduleCard";
import ReadinessPanel from "./components/ReadinessPanel";
import EmployeeActivityLog from "./components/EmployeeActivityLog";
import ShiftSessionForm from "./components/shiftSession/ShiftSessionForm";
import ReportsPanel from "./components/reports/ReportsPanel";

type AttendanceTab = "overview" | "shifts" | "reports";

const TABS: { key: AttendanceTab; label: string; icon: typeof LayoutDashboard; activeColor: string }[] = [
  { key: "overview", label: "نظرة عامة وجاهزية", icon: LayoutDashboard, activeColor: "border-emerald-600 text-emerald-700" },
  { key: "shifts", label: "تسليم الشيفت", icon: ArrowLeftRight, activeColor: "border-blue-600 text-blue-700" },
  { key: "reports", label: "التقارير", icon: FileBarChart, activeColor: "border-indigo-600 text-indigo-700" },
];

export default function Attendance() {
  const [activeTab, setActiveTab] = useState<AttendanceTab>("overview");

  return (
    <MainLayout>
      <div className="w-full min-w-0 p-2 sm:p-3 md:p-5 space-y-4 lg:space-y-6">
        <div className="mb-1 print:hidden">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-black">
            الحضور والمناوبات
          </h1>
          <p className="text-sm sm:text-base text-blue-700 font-medium mt-1">
            متابعة حضور طاقم غرفة العمليات وجاهزية الشفت الحالي
          </p>
        </div>

        {/* لوحة الجاهزية — دايمًا ظاهرة بكل التبويبات، متجمدة لو الطاقم كافٍ ونشطة لو فيه عجز */}
        <div className="print:hidden">
          <ReadinessPanel />
        </div>

        {/* تبويبات القسم */}
        <div className="flex flex-wrap gap-1.5 border-b-2 border-slate-200 print:hidden">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 text-sm font-bold px-4 py-2.5 border-b-2 -mb-0.5 transition ${
                  isActive ? tab.activeColor : "border-transparent text-black/60 hover:text-black"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === "overview" && (
          <div className="space-y-4 lg:space-y-6">
            <AttendanceSummaryBar />
            <StaffingTable />
            <ShiftScheduleCard onOpenShiftForm={() => setActiveTab("shifts")} />
            <EmployeeActivityLog />
          </div>
        )}

        {activeTab === "shifts" && <ShiftSessionForm />}

        {activeTab === "reports" && <ReportsPanel />}
      </div>
    </MainLayout>
  );
}
