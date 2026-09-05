import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Send, CheckCircle2 } from "lucide-react";

import MainLayout from "../../components/layout/MainLayout";
import NotificationForm, {
  type NotificationFormState,
} from "./components/NotificationForm";
import ChannelsPriority, { type Channel } from "./components/ChannelsPriority";
import RecipientsPanel from "./components/RecipientsPanel";
import { mockGroups, notificationTypes } from "./data/mockData";

export default function QuickSend() {
  const navigate = useNavigate();

  const [form, setForm] = useState<NotificationFormState>({
    messageMode: "text",
    notificationType: notificationTypes[0].value,
    title: "",
    message: "",
  });

  const [channels, setChannels] = useState<Channel[]>(["sms", "email"]);
  const [selectedContactIds, setSelectedContactIds] = useState<number[]>([]);
  const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [sentSummary, setSentSummary] = useState<{ recipients: number } | null>(null);

  const toggleChannel = (channel: Channel) => {
    setChannels((prev) =>
      prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]
    );
  };

  const totalRecipients = () => {
    const fromGroups = mockGroups
      .filter((g) => selectedGroupIds.includes(g.id))
      .reduce((sum, g) => sum + g.membersCount, 0);
    return selectedContactIds.length + fromGroups;
  };

  const handleCancel = () => {
    navigate("/analytics");
  };

  const handleSend = () => {
    if (!form.title.trim()) {
      setError("لازم تكتب عنوان الإشعار الأول.");
      return;
    }
    if (!form.message.trim()) {
      setError("لازم تكتب نص الرسالة.");
      return;
    }
    if (channels.length === 0) {
      setError("اختار قناة إرسال واحدة على الأقل.");
      return;
    }
    if (selectedContactIds.length === 0 && selectedGroupIds.length === 0) {
      setError("اختار مستلم واحد على الأقل (جهة اتصال أو مجموعة).");
      return;
    }

    setError(null);
    setSentSummary({ recipients: totalRecipients() });
  };

  const handleSendAnother = () => {
    setSentSummary(null);
    setForm({
      messageMode: "text",
      notificationType: notificationTypes[0].value,
      title: "",
      message: "",
    });
    setChannels(["sms", "email"]);
    setSelectedContactIds([]);
    setSelectedGroupIds([]);
  };

  if (sentSummary) {
    return (
      <MainLayout>
        <div className="flex min-h-[70vh] items-center justify-center p-6">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm border border-slate-100">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="mb-2 text-xl font-bold text-slate-800">
              تم إرسال الإشعار بنجاح
            </h2>
            <p className="mb-6 text-sm text-slate-500">
              تم إرسال "{form.title}" إلى {sentSummary.recipients} مستلم عبر{" "}
              {channels.length} قناة اتصال.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={handleSendAnother}
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                إرسال إشعار جديد
              </button>
              <button
                type="button"
                onClick={() => navigate("/analytics")}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                الرجوع لصفحة التقارير
              </button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6">
        {/* عنوان الصفحة */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={handleCancel}
              className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-700"
            >
              <ArrowRight size={15} />
              الرجوع للتقارير
            </button>
            <h1 className="text-3xl font-bold text-slate-800">إرسال إشعار سريع</h1>
            <p className="mt-2 text-slate-500">
              أرسل تنبيهًا فوريًا للجهات المعنية واطلب منها تأكيد الجاهزية والاستجابة.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <NotificationForm value={form} onChange={setForm} />

          <ChannelsPriority selectedChannels={channels} onToggleChannel={toggleChannel} />

          <RecipientsPanel
            selectedContactIds={selectedContactIds}
            onChangeSelectedContactIds={setSelectedContactIds}
            selectedGroupIds={selectedGroupIds}
            onChangeSelectedGroupIds={setSelectedGroupIds}
          />

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
              {error}
            </div>
          )}

          {/* أزرار الإجراء */}
          <div className="flex flex-wrap justify-end gap-3 pb-6">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-xl border border-slate-200 px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={handleSend}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              <Send size={16} />
              إرسال
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
