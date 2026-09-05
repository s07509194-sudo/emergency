import { useEffect, useState } from "react";
import { Timer, TrendingUp, Users, ClipboardCheck } from "lucide-react";

import { operationsRoomService } from "../../../services/operationsRoomService";
import type { OperationsRoomKpis } from "../../../types/operationsRoom";
import AnimatedNumber from "../../dashboard/AnimatedNumber";

export default function KpiGrid() {
  const [kpis, setKpis] = useState<OperationsRoomKpis | null>(null);

  useEffect(() => {
    operationsRoomService.getKpis().then(setKpis);
  }, []);

  const cards = [
    {
      title: "متوسط وقت التفعيل",
      value: kpis?.avgActivationTimeMinutes ?? 0,
      suffix: " دقيقة",
      icon: Timer,
      color: "text-blue-600",
      bg: "from-blue-400/25 to-indigo-600/25",
    },
    {
      title: "عدد مرات التصعيد",
      value: kpis?.escalationCount ?? 0,
      suffix: "",
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "from-orange-400/25 to-amber-600/25",
    },
    {
      title: "التزام الحضور وقت التفعيل",
      value: kpis?.staffingComplianceDuringActivation ?? 0,
      suffix: "%",
      icon: Users,
      color: "text-emerald-600",
      bg: "from-emerald-400/25 to-teal-600/25",
    },
    {
      title: "القرارات المسجلة",
      value: kpis?.decisionsLogged ?? 0,
      suffix: "",
      icon: ClipboardCheck,
      color: "text-purple-600",
      bg: "from-purple-400/25 to-fuchsia-600/25",
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-white rounded-2xl shadow-md border border-slate-100 p-4 sm:p-5 flex items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <p className="text-slate-500 text-xs sm:text-sm mb-1.5 truncate">
                {card.title}
              </p>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 font-mono">
                {kpis ? (
                  <AnimatedNumber value={card.value} suffix={card.suffix} />
                ) : (
                  "—"
                )}
              </h2>
            </div>

            <div
              className={`shrink-0 p-2.5 sm:p-3 rounded-2xl ${card.color} bg-gradient-to-br ${card.bg} border border-white/60`}
            >
              <Icon size={20} strokeWidth={2.2} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
