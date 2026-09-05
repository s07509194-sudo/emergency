import { Clock, Mail, MessageSquare, Phone } from "lucide-react";
import CircularStat from "./CircularStat";
import { lastNotification } from "../data/notificationsData";

export default function LastNotificationCard() {
  const { id, badge, duration, channels, breakdown, results } = lastNotification;

  const breakdownItems = [
    { icon: Mail, bg: "bg-sky-50", color: "text-sky-600", value: breakdown.email, label: "البريد الإلكتروني" },
    { icon: MessageSquare, bg: "bg-violet-50", color: "text-violet-600", value: breakdown.sms, label: "الرسالة النصية" },
    { icon: Phone, bg: "bg-rose-50", color: "text-rose-500", value: breakdown.calls, label: "مكالمة" },
  ];

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100">
      <div className="bg-teal-700 px-5 py-3.5">
        <h2 className="text-center text-base font-bold text-white sm:text-lg">
          آخر إشعار تم إرساله
        </h2>
      </div>

      <div className="flex flex-1 flex-col gap-5 p-5">
        {/* رقم الإشعار والحالة */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            {badge}
          </span>
          <h3 className="text-lg font-bold text-slate-800">
            تقرير الإشعار رقم ({id})
          </h3>
        </div>

        {/* شريط المدة والقنوات */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-emerald-500 px-4 py-3 text-white">
          <div className="flex items-center gap-2 text-sm font-bold">
            <Clock size={16} />
            <span>مدة الإشعار {duration}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-white/90">القنوات:</span>
            {channels.map((c) => (
              <span
                key={c}
                className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* تفصيل القنوات */}
        <div className="grid grid-cols-3 gap-3">
          {breakdownItems.map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-2 text-center">
              <span className={`flex h-11 w-11 items-center justify-center rounded-full ${item.bg} ${item.color}`}>
                <item.icon size={18} />
              </span>
              <div className="text-xl font-extrabold text-slate-800">{item.value}</div>
              <div className="text-xs font-medium text-slate-400">{item.label}</div>
            </div>
          ))}
        </div>

        {/* النتائج النهائية */}
        <div className="mt-auto grid grid-cols-1 gap-3 sm:grid-cols-3">
          <CircularStat
            percent={results.failed.percent}
            value={results.failed.value}
            label={results.failed.label}
            gradientFrom="#f43f5e"
            gradientTo="#fb923c"
          />
          <CircularStat
            percent={results.delivered.percent}
            value={results.delivered.value}
            label={results.delivered.label}
            gradientFrom="#22c55e"
            gradientTo="#15803d"
          />
          <CircularStat
            percent={results.total.percent}
            value={results.total.value}
            label={results.total.label}
            gradientFrom="#1e293b"
            gradientTo="#0f172a"
          />
        </div>
      </div>
    </div>
  );
}
