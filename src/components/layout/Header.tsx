import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Bell,
  CheckCheck,
  Languages,
  LogOut,
  ShieldCheck,
  X,
} from "lucide-react";

import { useOperationsRoom } from "../../context/OperationsRoomContext";
import { PLAN_STATUS_META } from "../../features/operationsRoom/utils/statusMeta";

const notifications = [
  { id: 1, titleKey: "notifications.rain", timeKey: "notifications.rainTime", unread: true },
  { id: 2, titleKey: "notifications.report", timeKey: "notifications.reportTime", unread: true },
  { id: 3, titleKey: "notifications.system", timeKey: "notifications.systemTime", unread: false },
];

export default function Header() {
  const { t, i18n } = useTranslation();
  const { planStatus } = useOperationsRoom();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  const isEnglish = i18n.language.startsWith("en");

  useEffect(() => {
    document.documentElement.dir = isEnglish ? "ltr" : "rtl";
    document.documentElement.lang = isEnglish ? "en" : "ar";
  }, [isEnglish]);

  const changeLanguage = () => {
    const nextLanguage = isEnglish ? "ar" : "en";

    i18n.changeLanguage(nextLanguage);
    localStorage.setItem("app-language", nextLanguage);
  };

  const logout = () => {
    if (!window.confirm(t("header.logoutConfirm"))) return;

    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    // غيّر /login لمسار صفحة تسجيل الدخول عندما تضيفها.
    window.location.href = "/login";
  };

  return (
    <header
      className="
        h-20 bg-gradient-to-l from-teal-900 via-teal-700 to-emerald-500
        shadow-md flex items-center justify-between px-5 sm:px-8
        sticky top-0 z-30
      "
    >
      {/* العنوان */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center">
          <ShieldCheck size={22} className="text-white" />
        </div>

        <div>
          <h1 className="text-xl font-bold text-white">{t("header.title")}</h1>
          <p className="text-xs text-white/70 mt-0.5">
            {t("header.subtitle")}
          </p>
        </div>
      </div>

      {/* حالة غرفة العمليات - مرتبطة لحظيًا بحالة الخطة الفعلية */}
      <Link
        to="/operations-room"
        className="hidden lg:flex items-center gap-2 bg-white/15 backdrop-blur border border-white/20 rounded-full px-4 py-2 hover:bg-white/25 transition"
      >
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              planStatus ? PLAN_STATUS_META[planStatus.currentLevel].dotColor : "bg-white"
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              planStatus ? PLAN_STATUS_META[planStatus.currentLevel].dotColor : "bg-white"
            }`}
          />
        </span>
        <span className="text-sm font-medium text-white">
          {t("header.operations")}
          {planStatus && ` · ${PLAN_STATUS_META[planStatus.currentLevel].label}`}
        </span>
      </Link>

      {/* الأزرار */}
      <div className="flex items-center gap-2">
        {/* الإشعارات */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative w-11 h-11 rounded-xl bg-white/15 backdrop-blur border border-white/20 flex items-center justify-center text-white transition-all hover:bg-white/25 hover:-translate-y-0.5"
            title={t("header.notifications")}
          >
            <Bell size={19} />

            {unreadCount > 0 && (
              <span className="absolute -top-1 -left-1 h-5 min-w-5 px-1 rounded-full bg-rose-500 border-2 border-teal-800 text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute left-0 top-14 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 text-right">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-800">
                  {t("header.notifications")}
                </h3>

                <div className="flex gap-1">
                  <button
                    onClick={() => setUnreadCount(0)}
                    className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50"
                    title={t("header.allRead")}
                  >
                    <CheckCheck size={17} />
                  </button>

                  <button
                    onClick={() => setIsNotificationsOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
                  >
                    <X size={17} />
                  </button>
                </div>
              </div>

              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex gap-3 px-4 py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50"
                >
                  <span
                    className={`mt-1.5 w-2 h-2 rounded-full ${
                      notification.unread && unreadCount > 0
                        ? "bg-emerald-500"
                        : "bg-slate-200"
                    }`}
                  />

                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      {t(notification.titleKey)}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {t(notification.timeKey)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* اللغة */}
        <button
          onClick={changeLanguage}
          className="h-11 flex items-center gap-2 px-3 rounded-xl bg-white/15 backdrop-blur border border-white/20 text-white transition-all hover:bg-white/25 hover:-translate-y-0.5"
          title={t("header.language")}
        >
          <Languages size={18} />
          <span className="hidden sm:inline text-sm font-semibold">
            {t("header.language")}
          </span>
        </button>

        {/* تسجيل الخروج */}
        <button
          onClick={logout}
          className="h-11 flex items-center gap-2 px-3 rounded-xl bg-rose-500/20 backdrop-blur border border-rose-200/30 text-white transition-all hover:bg-rose-500/40 hover:-translate-y-0.5"
          title={t("header.logout")}
        >
          <LogOut size={18} />
          <span className="hidden sm:inline text-sm font-semibold">
            {t("header.logout")}
          </span>
        </button>
      </div>
    </header>
  );
}