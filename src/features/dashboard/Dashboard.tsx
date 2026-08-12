import { useState } from "react";
import { motion } from "framer-motion";

import MainLayout from "../../components/layout/MainLayout";

import {
  AlertTriangle,
  BellRing,
  MapPin,
  CloudRain,
  Radio,
  ShieldAlert,
} from "lucide-react";

import { emergencyReports } from "../../data/emergencyData";

import EmergencyMap from "./EmergencyMap";
import ReportDetails from "./ReportDetails";
import AnimatedNumber from "./AnimatedNumber";

export default function Dashboard() {
  const [selectedReport, setSelectedReport] = useState<
    (typeof emergencyReports)[0] | null
  >(null);

  const cards = [
    {
      title: "إجمالي البلاغات",
      value: 312,
      suffix: "",
      icon: AlertTriangle,
      gradient: "from-red-400/25 to-rose-600/25",
      iconColor: "text-red-600",
      glow: "shadow-red-500/20",
    },
    {
      title: "الإنذارات",
      value: 149,
      suffix: "",
      icon: BellRing,
      gradient: "from-orange-400/25 to-amber-600/25",
      iconColor: "text-orange-600",
      glow: "shadow-orange-500/20",
    },
    {
      title: "النقاط الحرجة",
      value: 641,
      suffix: "",
      icon: MapPin,
      gradient: "from-blue-400/25 to-indigo-600/25",
      iconColor: "text-blue-600",
      glow: "shadow-blue-500/20",
    },
    {
      title: "كمية الأمطار",
      value: 18,
      suffix: " مم",
      icon: CloudRain,
      gradient: "from-cyan-400/25 to-teal-600/25",
      iconColor: "text-cyan-600",
      glow: "shadow-cyan-500/20",
    },
  ];

  const recentReports = [
    { label: "بلاغ سيول - طريق رئيسي", severity: "high" },
    { label: "نقطة حرجة - تجمع مياه", severity: "medium" },
    { label: "بلاغ حريق", severity: "high" },
  ];

  const severityDot: Record<string, string> = {
    high: "bg-red-500",
    medium: "bg-yellow-500",
    low: "bg-green-500",
  };

  return (
    <MainLayout>
      <div className="min-h-screen p-5">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800">لوحة التحكم</h1>
          <p className="text-slate-500 mt-1">
            متابعة البلاغات والإنذارات والأمطار بشكل لحظي
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className={`
                  bg-white rounded-2xl shadow-md hover:shadow-xl ${card.glow}
                  transition-all duration-300
                  border border-slate-100
                  p-6 flex justify-between items-center
                `}
              >
                <div>
                  <p className="text-slate-500 text-sm mb-1.5">{card.title}</p>
                  <h2 className="text-4xl font-extrabold text-slate-800 font-mono tracking-tight">
                    <AnimatedNumber value={card.value} suffix={card.suffix} />
                  </h2>
                </div>

                <div
                  className={`
                    p-4 rounded-2xl ${card.iconColor}
                    bg-gradient-to-br ${card.gradient}
                    backdrop-blur-md
                    border border-white/60
                    shadow-lg
                  `}
                >
                  <Icon size={28} strokeWidth={2.2} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Main Workspace */}
        <div className="grid grid-cols-12 gap-6 mt-6">
          {/* Map */}
          <div className="col-span-12 xl:col-span-9">
            <EmergencyMap
              selectedReport={selectedReport}
              setSelectedReport={setSelectedReport}
            />
          </div>

          {/* Details Panel */}
          <div className="col-span-12 xl:col-span-3">
            <ReportDetails report={selectedReport} />
          </div>
        </div>

        {/* Operations Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">

          {/* آخر البلاغات */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
                <Radio size={18} />
              </div>
              <h3 className="text-lg font-bold text-slate-700">آخر البلاغات</h3>
            </div>

            <ul className="space-y-3">
              {recentReports.map((report) => (
                <li key={report.label} className="flex items-center gap-2 text-sm text-slate-600">
                  <span className={`w-2 h-2 rounded-full ${severityDot[report.severity]}`} />
                  {report.label}
                </li>
              ))}
            </ul>
          </div>

          {/* حالة الطقس */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                <CloudRain size={18} />
              </div>
              <h3 className="text-lg font-bold text-slate-700">حالة الطقس</h3>
            </div>

            <div className="space-y-2">
              <p className="text-slate-600 text-sm flex justify-between">
                <span>كمية الأمطار الحالية</span>
                <span className="font-bold text-slate-800">18 مم</span>
              </p>
              <p className="text-slate-600 text-sm flex justify-between items-center">
                <span>مستوى التنبيه</span>
                <span className="px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
                  متوسط
                </span>
              </p>
            </div>
          </div>

          {/* مستوى الخطورة */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                <ShieldAlert size={18} />
              </div>
              <h3 className="text-lg font-bold text-slate-700">مستوى الخطورة</h3>
            </div>

            <p className="text-orange-500 text-3xl font-extrabold">متوسط</p>
            <p className="text-slate-500 text-sm mt-2">12 نقطة تحتاج متابعة</p>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}
