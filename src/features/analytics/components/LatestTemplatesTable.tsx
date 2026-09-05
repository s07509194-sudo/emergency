import { Mail, MessageSquare, type LucideIcon } from "lucide-react";
import type { TemplateRow } from "../data/notificationsData";

interface LatestTemplatesTableProps {
  rows: TemplateRow[];
}

const channelIcon: Record<"email" | "sms", { icon: LucideIcon; className: string }> = {
  email: { icon: Mail, className: "bg-sky-50 text-sky-600" },
  sms: { icon: MessageSquare, className: "bg-emerald-50 text-emerald-600" },
};

export default function LatestTemplatesTable({ rows }: LatestTemplatesTableProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100">
      <div className="bg-teal-700 px-5 py-3.5">
        <h2 className="text-center text-base font-bold text-white sm:text-lg">
          أحدث القوالب المستخدمة
        </h2>
      </div>

      <div className="max-h-[420px] overflow-y-auto">
        <table className="w-full min-w-[520px] text-sm">
          <thead className="sticky top-0 bg-white">
            <tr className="border-b border-slate-100 text-slate-400">
              <th className="px-4 py-3 text-center font-semibold">عدد المستلمون</th>
              <th className="px-4 py-3 text-center font-semibold">القنوات</th>
              <th className="px-4 py-3 text-right font-semibold">نوع الإشعار</th>
              <th className="px-4 py-3 text-right font-semibold">العنوان</th>
              <th className="px-4 py-3 text-center font-semibold">الرقم</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-slate-50 last:border-0 hover:bg-slate-50/70"
              >
                <td className="px-4 py-3 text-center font-semibold text-slate-700">
                  {row.recipients}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1.5">
                    {row.channels.map((ch) => {
                      const { icon: Icon, className } = channelIcon[ch];
                      return (
                        <span
                          key={ch}
                          className={`flex h-7 w-7 items-center justify-center rounded-lg ${className}`}
                        >
                          <Icon size={14} />
                        </span>
                      );
                    })}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500 whitespace-nowrap">
                    {row.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-medium text-slate-700">
                  {row.title}
                </td>
                <td className="px-4 py-3 text-center text-slate-500">{row.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
