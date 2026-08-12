import { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { CloudLightning, Inbox } from "lucide-react";
import WeatherAlertsTab from "./components/WeatherAlertsTab";
import ReportsIntakeTab from "./components/ReportsIntakeTab";

type TabKey = "weather" | "reports";

const TABS: { key: TabKey; label: string; icon: typeof CloudLightning }[] = [
  { key: "weather", label: "تنبيهات حالة الطقس", icon: CloudLightning },
  { key: "reports", label: "استقبال البلاغات", icon: Inbox },
];

export default function Alerts() {
  const [tab, setTab] = useState<TabKey>("weather");

  return (
    <MainLayout>
      <div className="p-6">

        {/* عنوان الصفحة */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800">التنبيهات</h1>
          <p className="text-slate-500 mt-2">
            متابعة تنبيهات حالة الطقس اللحظية، واستقبال البلاغات الواردة.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100 w-fit">
          {TABS.map((t) => {
            const Icon = t.icon;
            const isActive = tab === t.key;

            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                  transition-all duration-200
                  ${isActive ? "bg-emerald-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"}
                `}
              >
                <Icon size={16} />
                {t.label}
              </button>
            );
          })}
        </div>

        {tab === "weather" ? <WeatherAlertsTab /> : <ReportsIntakeTab />}

      </div>
    </MainLayout>
  );
}
