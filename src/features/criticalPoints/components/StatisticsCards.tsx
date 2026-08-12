import { motion } from "framer-motion";
import { AlertTriangle, ShieldAlert, ShieldCheck, MapPin } from "lucide-react";
import { useCriticalPoints } from "../hooks/useCriticalPoints";
import CountUpNumber from "./CountUpNumber";

export default function StatisticsCards() {
  const { stats, loading, error } = useCriticalPoints();

  const cards = [
    {
      title: "إجمالي النقاط الحرجة",
      value: stats.total,
      icon: MapPin,
      border: "border-blue-600",
      iconColor: "text-blue-600",
      textColor: "text-slate-800",
      hoverText: "group-hover:text-blue-600",
    },
    {
      title: "عالية الخطورة",
      value: stats.high,
      icon: AlertTriangle,
      border: "border-orange-500",
      iconColor: "text-orange-500",
      textColor: "text-orange-600",
      hoverText: "group-hover:text-orange-600",
    },
    {
      title: "متوسطة الخطورة",
      value: stats.medium,
      icon: ShieldAlert,
      border: "border-yellow-500",
      iconColor: "text-yellow-500",
      textColor: "text-yellow-600",
      hoverText: "group-hover:text-yellow-600",
    },
    {
      title: "منخفضة الخطورة",
      value: stats.low,
      icon: ShieldCheck,
      border: "border-green-600",
      iconColor: "text-green-600",
      textColor: "text-green-600",
      hoverText: "group-hover:text-green-600",
    },
  ];

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-6 text-sm">
        تعذر تحميل بيانات النقاط الحرجة: {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`
              group bg-white rounded-2xl shadow-md p-6 border-l-4 ${card.border}
              transition-all duration-300
              hover:-translate-y-2 hover:scale-105 hover:shadow-2xl
              cursor-pointer
            `}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3
                  className={`text-gray-500 text-sm font-semibold transition-colors ${card.hoverText}`}
                >
                  {card.title}
                </h3>

                <p
                  className={`text-4xl font-bold mt-4 ${card.textColor} transition-transform duration-300 group-hover:scale-110 min-h-[2.5rem]`}
                >
                  {loading ? (
                    <span className="inline-block h-8 w-16 rounded bg-slate-200 animate-pulse" />
                  ) : (
                    <CountUpNumber value={card.value} duration={1.5} />
                  )}
                </p>
              </div>

              <Icon size={28} className={card.iconColor} />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}