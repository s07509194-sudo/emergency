import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  Contact,
  FileText,
  Send,
  Settings,
  Users,
} from "lucide-react";

import MainLayout from "../../components/layout/MainLayout";
import StatCard from "./components/StatCard";
import ResponseGauge from "./components/ResponseGauge";
import ChannelsOverview from "./components/ChannelsOverview";
import LatestTemplatesTable from "./components/LatestTemplatesTable";
import LastNotificationCard from "./components/LastNotificationCard";

import {
  topStats,
  responseOverview,
  channelsOverview,
  latestTemplates,
} from "./data/notificationsData";

const iconMap = {
  settings: { icon: Settings, iconBg: "bg-slate-100", iconColor: "text-slate-600" },
  groups: { icon: Users, iconBg: "bg-blue-50", iconColor: "text-blue-600" },
  contacts: { icon: Contact, iconBg: "bg-indigo-50", iconColor: "text-indigo-600" },
  reports: { icon: FileText, iconBg: "bg-amber-50", iconColor: "text-amber-600" },
  templates: { icon: ClipboardList, iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
  quick: { icon: Send, iconBg: "bg-sky-50", iconColor: "text-sky-600" },
} as const;

export default function Analytics() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="p-6">
        {/* عنوان الصفحة */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800">منظومة الإشعارات</h1>
          <p className="mt-2 text-slate-500">
            نظرة عامة على الإشعارات المرسلة، القوالب المستخدمة، ونسب الاستجابة.
          </p>
        </div>

        {/* الإحصائيات العلوية */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {topStats.map((stat) => {
            const cfg = iconMap[stat.icon];
            return (
              <StatCard
                key={stat.key}
                icon={cfg.icon}
                iconBg={cfg.iconBg}
                iconColor={cfg.iconColor}
                label={stat.label}
                value={stat.value}
                onClick={stat.key === "quick" ? () => navigate("/quick-send") : undefined}
              />
            );
          })}
        </div>

        {/* نسبة الرد + استخدام القنوات */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex flex-col items-center justify-center gap-6 rounded-2xl bg-white p-6 shadow-sm border border-slate-100 sm:flex-row lg:col-span-1">
            <ResponseGauge
              responded={responseOverview.responded}
              notResponded={responseOverview.notResponded}
            />

            <div className="flex gap-8 sm:flex-col sm:gap-6">
              <div className="text-center">
                <div className="text-sm text-slate-400">قام بالرد</div>
                <div className="text-2xl font-extrabold text-emerald-600">
                  {responseOverview.responded}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-400">لم يقوم بالرد</div>
                <div className="text-2xl font-extrabold text-rose-500">
                  {responseOverview.notResponded}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <ChannelsOverview data={channelsOverview} />
          </div>
        </div>

        {/* أحدث القوالب + آخر إشعار تم إرساله */}
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <LatestTemplatesTable rows={latestTemplates} />
          <LastNotificationCard />
        </div>
      </div>
    </MainLayout>
  );
}
