import MainLayout from "../../components/layout/MainLayout";
import LiveStreamCard from "./components/LiveStreamCard";
import WeatherWidget from "./components/WeatherWidget";
import ReportsTable from "./components/ReportsTable";
import { emergencyReports } from "../../data/emergencyData";

export default function Monitoring() {
  return (
    <MainLayout>
      <div className="p-6 bg-slate-100 min-h-screen">

        {/* عنوان الصفحة */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800">الرصد</h1>
          <p className="text-slate-500 mt-2">
            متابعة مباشرة للأخبار، حالة الطقس، وأحدث البلاغات الواردة.
          </p>
        </div>

        {/* البث المباشر */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LiveStreamCard
            channelName="قناة الحدث"
            title="البث المباشر لقناة الحدث"
            videoId="-EEHXzLNS6o"
          />

          <LiveStreamCard
            channelName="القناة الإخبارية"
            title="البث المباشر | القناة الإخبارية"
            videoId="yYJjtr3fbZE"
          />
        </div>

        {/* الطقس */}
        <div className="mt-6">
          <WeatherWidget />
        </div>

        {/* جدول البلاغات */}
        <div className="bg-white rounded-2xl shadow-lg mt-6 overflow-hidden">
          <h2 className="text-lg font-bold text-slate-800 px-6 pt-6 pb-4">
            آخر البلاغات
          </h2>

          <ReportsTable reports={emergencyReports} />
        </div>

      </div>
    </MainLayout>
  );
}
