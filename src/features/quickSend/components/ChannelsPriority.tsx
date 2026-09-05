import { Phone, MessageSquare, Mail } from "lucide-react";

export type Channel = "call" | "sms" | "email";

interface ChannelsPriorityProps {
  selectedChannels: Channel[];
  onToggleChannel: (channel: Channel) => void;
}

const channelsConfig: { key: Channel; icon: typeof Phone; label: string }[] = [
  { key: "call", icon: Phone, label: "اتصال هاتفي" },
  { key: "sms", icon: MessageSquare, label: "رسالة نصية" },
  { key: "email", icon: Mail, label: "بريد إلكتروني" },
];

export default function ChannelsPriority({
  selectedChannels,
  onToggleChannel,
}: ChannelsPriorityProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
      <h2 className="mb-5 text-lg font-bold text-slate-800">قنوات الاتصال</h2>

      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div className="text-center">
          <p className="mb-2 text-sm font-semibold text-slate-500">الأولوية</p>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-base font-bold text-slate-700">
            1
          </div>
        </div>

        <div className="flex-1">
          <p className="mb-2 text-sm font-semibold text-slate-500 sm:text-center">القنوات</p>
          <div className="flex gap-3 sm:justify-center">
            {channelsConfig.map(({ key, icon: Icon, label }) => {
              const isActive = selectedChannels.includes(key);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onToggleChannel(key)}
                  title={label}
                  aria-pressed={isActive}
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-colors ${
                    isActive
                      ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                      : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <Icon size={18} />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
