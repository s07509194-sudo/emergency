import { Mail, MessageSquare, Phone, Smartphone } from "lucide-react";
import AnimatedNumber from "../../dashboard/AnimatedNumber";
import type { ChannelsOverviewData } from "../data/notificationsData";

interface ChannelsOverviewProps {
  data: ChannelsOverviewData;
}

export default function ChannelsOverview({ data }: ChannelsOverviewProps) {
  const items = [
    { icon: MessageSquare, bg: "bg-violet-50", color: "text-violet-600", value: data.sms, label: "الرسالة النصية" },
    { icon: Phone, bg: "bg-emerald-50", color: "text-emerald-600", value: data.calls, label: "المكالمات" },
    { icon: Smartphone, bg: "bg-rose-50", color: "text-rose-500", value: data.whatsapp, label: "إشعارات الهاتف" },
    { icon: Mail, bg: "bg-sky-50", color: "text-sky-600", value: data.email, label: "البريد الإلكتروني" },
  ];

  return (
    <div className="grid h-full grid-cols-2 gap-4 rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
      {items.map((item) => (
        <div key={item.label} className="flex items-center justify-center gap-3">
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${item.bg} ${item.color}`}>
            <item.icon size={20} />
          </span>
          <div>
            <div className="text-xl font-extrabold text-slate-800 sm:text-2xl">
              <AnimatedNumber value={item.value} duration={1.2} />
            </div>
            <div className="text-xs font-medium text-slate-400">{item.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
