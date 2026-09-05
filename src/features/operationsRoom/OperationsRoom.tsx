import { useState } from "react";

import MainLayout from "../../components/layout/MainLayout";
import PlanStatusBar from "./components/PlanStatusBar";
import PlanStatusHistoryModal from "./components/PlanStatusHistoryModal";
import DecisionLog from "./components/DecisionLog";
import KpiGrid from "./components/KpiGrid";

export default function OperationsRoom() {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <MainLayout>
      <div className="w-full min-w-0 p-2 sm:p-3 md:p-5 space-y-4 lg:space-y-6">
        <div className="mb-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            غرفة العمليات
          </h1>
          <p className="text-sm sm:text-base text-slate-500 mt-1">
            حالة الخطة، سجل القرارات، ومؤشرات الأداء اللحظية
          </p>
        </div>

        <PlanStatusBar onShowHistory={() => setShowHistory(true)} />

        <KpiGrid />

        <DecisionLog />
      </div>

      {showHistory && (
        <PlanStatusHistoryModal onClose={() => setShowHistory(false)} />
      )}
    </MainLayout>
  );
}
