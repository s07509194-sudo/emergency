import { useRef, useState } from "react";
import { Mic, AlignLeft, Plus, FileText } from "lucide-react";
import { notificationTypes, placeholders } from "../data/mockData";

export interface NotificationFormState {
  messageMode: "recorded" | "text";
  notificationType: string;
  title: string;
  message: string;
}

interface NotificationFormProps {
  value: NotificationFormState;
  onChange: (value: NotificationFormState) => void;
}

export default function NotificationForm({ value, onChange }: NotificationFormProps) {
  const [selectedPlaceholder, setSelectedPlaceholder] = useState(placeholders[0].value);
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const patch = (partial: Partial<NotificationFormState>) =>
    onChange({ ...value, ...partial });

  const insertPlaceholder = () => {
    const label = placeholders.find((p) => p.value === selectedPlaceholder)?.label ?? "";
    const tag = `{{${label}}}`;
    const el = textareaRef.current;

    if (!el) {
      patch({ message: `${value.message}${tag}` });
      return;
    }

    const start = el.selectionStart ?? value.message.length;
    const end = el.selectionEnd ?? value.message.length;
    const nextMessage = `${value.message.slice(0, start)}${tag}${value.message.slice(end)}`;
    patch({ message: nextMessage });

    requestAnimationFrame(() => {
      el.focus();
      const cursor = start + tag.length;
      el.setSelectionRange(cursor, cursor);
    });
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
      <h2 className="mb-5 text-lg font-bold text-slate-800">الإشعار</h2>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* نوع الرسالة */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-500">
            نوع الرسالة <span className="text-rose-500">*</span>
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => patch({ messageMode: "recorded" })}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
                value.messageMode === "recorded"
                  ? "border-rose-200 bg-rose-50 text-rose-600"
                  : "border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Mic size={16} />
              رسالة مسجلة
            </button>

            <button
              type="button"
              onClick={() => patch({ messageMode: "text" })}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
                value.messageMode === "text"
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
            >
              <AlignLeft size={16} />
              رسالة نصية
            </button>
          </div>
        </div>

        {/* نوع الإشعار */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-500">
            نوع الإشعار <span className="text-rose-500">*</span>
          </label>
          <select
            value={value.notificationType}
            onChange={(e) => patch({ notificationType: e.target.value })}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none"
          >
            {notificationTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* عنوان الإشعار */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-500">
            عنوان الإشعار <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={value.title}
            onChange={(e) => patch({ title: e.target.value })}
            placeholder="اكتب عنوان الإشعار"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* المتغير */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-500">المتغير</label>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={insertPlaceholder}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white transition-colors hover:bg-emerald-700"
              aria-label="إضافة المتغير للرسالة"
            >
              <Plus size={18} />
            </button>

            <select
              value={selectedPlaceholder}
              onChange={(e) => setSelectedPlaceholder(e.target.value)}
              className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none"
            >
              {placeholders.map((p) => (
                <option key={p.value} value={p.value}>
                  اختر متغير - {p.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setShowPreview((s) => !s)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              <FileText size={15} />
              معاينة
            </button>
          </div>
        </div>
      </div>

      {/* الرسالة */}
      <div className="mt-5">
        <label className="mb-2 block text-sm font-semibold text-slate-500">
          الرسالة <span className="text-rose-500">*</span>
        </label>
        <textarea
          ref={textareaRef}
          rows={4}
          value={value.message}
          onChange={(e) => patch({ message: e.target.value })}
          placeholder="Message"
          className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none"
        />
      </div>

      {showPreview && (
        <div className="mt-4 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/60 p-4">
          <p className="mb-1 text-xs font-semibold text-emerald-700">معاينة الرسالة</p>
          <p className="whitespace-pre-wrap text-sm text-slate-700">
            {value.message || "لسه ما كتبتش نص الرسالة."}
          </p>
        </div>
      )}
    </div>
  );
}
