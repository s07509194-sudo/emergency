import { useState } from "react";
import type { ReactNode } from "react";
import { Mail, Plus, ArrowUpRight, ArrowDownLeft } from "lucide-react";

import type { EmailLogEntry } from "../../../../types/operationsRoom";

interface EmailLogSectionProps {
  outgoing: EmailLogEntry[];
  incoming: EmailLogEntry[];
  onAdd: (direction: "outgoing" | "incoming", input: Omit<EmailLogEntry, "id" | "direction">) => void;
  disabled: boolean;
}

const emptyForm = { senderName: "", recipientEntity: "", sentAt: "", subject: "", notes: "" };

function EmailTable({
  title,
  icon,
  entries,
  onAdd,
  disabled,
  recipientLabel,
}: {
  title: string;
  icon: ReactNode;
  entries: EmailLogEntry[];
  onAdd: (input: Omit<EmailLogEntry, "id" | "direction">) => void;
  disabled: boolean;
  recipientLabel: string;
}) {
  const [form, setForm] = useState(emptyForm);
  const [isAdding, setIsAdding] = useState(false);

  const canSubmit = form.senderName.trim() && form.subject.trim();

  const handleAdd = () => {
    if (!canSubmit) return;
    onAdd({
      senderName: form.senderName.trim(),
      recipientEntity: form.recipientEntity.trim(),
      sentAt: form.sentAt.trim(),
      subject: form.subject.trim(),
      notes: form.notes.trim() || undefined,
    });
    setForm(emptyForm);
    setIsAdding(false);
  };

  return (
    <div className="flex-1 min-w-[280px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-sm font-extrabold text-black">
          {icon}
          {title}
        </div>
        {!disabled && (
          <button
            type="button"
            onClick={() => setIsAdding((v) => !v)}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 rounded-lg px-2 py-1"
          >
            <Plus size={13} />
            إضافة
          </button>
        )}
      </div>

      {isAdding && (
        <div className="mb-3 rounded-xl border-2 border-slate-300 p-2.5 space-y-1.5 bg-slate-50">
          <input
            value={form.senderName}
            onChange={(e) => setForm({ ...form, senderName: e.target.value })}
            placeholder="اسم المرسل"
            className="w-full rounded-lg border-2 border-slate-300 px-2.5 py-1.5 text-xs font-medium text-black bg-white"
          />
          <input
            value={form.recipientEntity}
            onChange={(e) => setForm({ ...form, recipientEntity: e.target.value })}
            placeholder={recipientLabel}
            className="w-full rounded-lg border-2 border-slate-300 px-2.5 py-1.5 text-xs font-medium text-black bg-white"
          />
          <div className="flex gap-1.5">
            <input
              type="time"
              value={form.sentAt}
              onChange={(e) => setForm({ ...form, sentAt: e.target.value })}
              className="rounded-lg border-2 border-slate-300 px-2.5 py-1.5 text-xs font-medium text-black bg-white"
            />
            <input
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="موضوع البريد"
              className="flex-1 rounded-lg border-2 border-slate-300 px-2.5 py-1.5 text-xs font-medium text-black bg-white"
            />
          </div>
          <input
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="ملاحظات (اختياري)"
            className="w-full rounded-lg border-2 border-slate-300 px-2.5 py-1.5 text-xs font-medium text-black bg-white"
          />
          <div className="flex justify-end gap-1.5">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs font-bold text-slate-600 px-2.5 py-1 rounded-lg hover:bg-slate-50"
            >
              إلغاء
            </button>
            <button
              type="button"
              disabled={!canSubmit}
              onClick={handleAdd}
              className="text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 px-3 py-1 rounded-lg"
            >
              حفظ
            </button>
          </div>
        </div>
      )}

      {entries.length === 0 ? (
        <p className="text-xs font-bold text-blue-700 py-3 text-center">لا يوجد سجلات بعد</p>
      ) : (
        <ul className="space-y-2 max-h-56 overflow-y-auto">
          {entries.map((entry) => (
            <li key={entry.id} className="rounded-lg border-2 border-slate-200 p-2 text-xs bg-slate-50">
              <p className="font-extrabold text-black">{entry.subject}</p>
              <p className="text-blue-700 font-semibold mt-0.5">
                {entry.senderName} ← {entry.recipientEntity || "—"} · {entry.sentAt || "—"}
              </p>
              {entry.notes && <p className="text-slate-600 font-medium mt-0.5">{entry.notes}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function EmailLogSection({ outgoing, incoming, onAdd, disabled }: EmailLogSectionProps) {
  return (
    <div className="rounded-2xl bg-white border-2 border-slate-200 shadow-md p-4 sm:p-5 lg:p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 shrink-0 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700">
          <Mail size={18} />
        </div>
        <h3 className="text-base sm:text-lg font-extrabold text-black">سجل البريد الإلكتروني</h3>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        <EmailTable
          title="البريد الصادر"
          icon={<ArrowUpRight size={14} className="text-orange-500" />}
          entries={outgoing}
          onAdd={(input) => onAdd("outgoing", input)}
          disabled={disabled}
          recipientLabel="الجهة المستلمة"
        />
        <div className="w-px bg-slate-300 hidden sm:block" />
        <EmailTable
          title="البريد الوارد"
          icon={<ArrowDownLeft size={14} className="text-sky-500" />}
          entries={incoming}
          onAdd={(input) => onAdd("incoming", input)}
          disabled={disabled}
          recipientLabel="الجهة المرسِلة"
        />
      </div>
    </div>
  );
}
