import { Radio } from "lucide-react";

import { COMMUNICATION_CHANNELS } from "../../../../services/shiftSessionService";
import type { CommunicationChannelCheck, CommunicationChannelKey } from "../../../../types/operationsRoom";
import { CHANNEL_META } from "./channelMeta";

interface CommunicationChannelsTableProps {
  checks: CommunicationChannelCheck[];
  onChangeChannel: (channel: CommunicationChannelKey, updates: Partial<CommunicationChannelCheck>) => void;
  overallNotes: string;
  onChangeOverallNotes: (notes: string) => void;
  disabled: boolean;
}

export default function CommunicationChannelsTable({
  checks,
  onChangeChannel,
  overallNotes,
  onChangeOverallNotes,
  disabled,
}: CommunicationChannelsTableProps) {
  return (
    <div className="rounded-2xl bg-white border-2 border-slate-200 shadow-md p-4 sm:p-5 lg:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 shrink-0 rounded-xl bg-sky-100 flex items-center justify-center text-sky-700">
          <Radio size={18} />
        </div>
        <h3 className="text-base sm:text-lg font-extrabold text-black">اختبار قنوات التواصل</h3>
      </div>

      <div className="space-y-2">
        {COMMUNICATION_CHANNELS.map((channelKey) => {
          const check = checks.find((c) => c.channel === channelKey);
          const meta = CHANNEL_META[channelKey];
          const Icon = meta.icon;

          return (
            <div
              key={channelKey}
              className={`rounded-xl border-2 p-3 transition ${
                check?.wasTested ? "border-emerald-300 bg-emerald-50" : "border-slate-200"
              }`}
            >
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 min-w-[170px]">
                  <Icon size={16} className="text-blue-600" />
                  <span className="text-sm font-extrabold text-black">{meta.label}</span>
                </div>

                <label className="flex items-center gap-1.5 text-xs font-bold text-blue-700">
                  <input
                    type="checkbox"
                    checked={check?.wasTested ?? false}
                    disabled={disabled}
                    onChange={(e) => onChangeChannel(channelKey, { wasTested: e.target.checked })}
                    className="rounded border-2 border-slate-400 text-emerald-600 focus:ring-emerald-400"
                  />
                  تم الاختبار
                </label>

                <input
                  value={check?.result ?? ""}
                  disabled={disabled}
                  onChange={(e) => onChangeChannel(channelKey, { result: e.target.value })}
                  placeholder="نتيجة الاختبار (ناجح/فاشل...)"
                  className="flex-1 min-w-[140px] rounded-lg border-2 border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-black disabled:bg-slate-100"
                />

                <input
                  type="time"
                  value={check?.testedAt ?? ""}
                  disabled={disabled}
                  onChange={(e) => onChangeChannel(channelKey, { testedAt: e.target.value })}
                  className="rounded-lg border-2 border-slate-300 px-2 py-1.5 text-xs font-semibold text-black w-28 disabled:bg-slate-100"
                />

                <input
                  value={check?.testedBy ?? ""}
                  disabled={disabled}
                  onChange={(e) => onChangeChannel(channelKey, { testedBy: e.target.value })}
                  placeholder="اسم المسؤول"
                  className="w-32 rounded-lg border-2 border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-black disabled:bg-slate-100"
                />

                <input
                  value={check?.notes ?? ""}
                  disabled={disabled}
                  onChange={(e) => onChangeChannel(channelKey, { notes: e.target.value })}
                  placeholder="ملاحظات"
                  className="flex-1 min-w-[120px] rounded-lg border-2 border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-black disabled:bg-slate-100"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4">
        <label className="block text-sm font-extrabold text-black mb-1.5">
          ملاحظات عامة على اختبار قنوات التواصل
        </label>
        <textarea
          value={overallNotes}
          disabled={disabled}
          onChange={(e) => onChangeOverallNotes(e.target.value)}
          rows={2}
          placeholder="مثال: تم عمل اختبار لجميع قنوات التواصل بناءً على التوجيه..."
          className="w-full rounded-xl border-2 border-slate-300 px-3 py-2.5 text-sm font-medium text-black resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:bg-slate-100"
        />
      </div>
    </div>
  );
}
