import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    /* =====================================================
       العربية
    ====================================================== */
    ar: {
      translation: {
        header: {
          title: "منصة إدارة الطوارئ والأزمات",
          subtitle: "أمانة المدينة المنورة",
          operations: "غرفة العمليات - نظام الإنذار المبكر",
          notifications: "الإشعارات",
          allRead: "تحديد الكل كمقروء",
          logout: "تسجيل الخروج",
          logoutConfirm: "هل تريد تسجيل الخروج؟",
          language: "EN",
        },

        notifications: {
          rain: "تنبيه أمطار متوسطة",
          report: "بلاغ جديد وارد",
          system: "تحديث حالة النظام",
          rainTime: "منذ 5 دقائق",
          reportTime: "منذ 20 دقيقة",
          systemTime: "منذ ساعة",
        },

        sidebar: {
          openMenu: "فتح القائمة",
          closeMenu: "إغلاق القائمة",
          logoAlt: "شعار أمانة المدينة المنورة",
          systemName: "نظام الطوارئ",
          municipality: "أمانة المدينة المنورة",

          dashboard: "لوحة التحكم",
          operationsRoom: "غرفة العمليات",
          attendance: "الحضور والمناوبات",
          map: "الخريطة التفاعلية",
          monitoring: "الرصد",
          equipment: "المعدات والآليات",
          reports: "منظومة الاستدعاء",
          alerts: "التنبيهات",
          earlyWarning: "الإنذار المبكر",
          analytics: "التقارير",
          knowledge: "بوابة المعرفة",
        },
      },
    },

    /* =====================================================
       English
    ====================================================== */
    en: {
      translation: {
        header: {
          title: "Emergency & Crisis Management Platform",
          subtitle: "Madinah Municipality",
          operations: "Operations Room - Early Warning System",
          notifications: "Notifications",
          allRead: "Mark all as read",
          logout: "Log out",
          logoutConfirm: "Do you want to log out?",
          language: "العربية",
        },

        notifications: {
          rain: "Moderate rain alert",
          report: "New incoming report",
          system: "System status update",
          rainTime: "5 minutes ago",
          reportTime: "20 minutes ago",
          systemTime: "1 hour ago",
        },

        sidebar: {
          openMenu: "Open menu",
          closeMenu: "Close menu",
          logoAlt: "Madinah Municipality logo",
          systemName: "Emergency System",
          municipality: "Madinah Municipality",

          dashboard: "Dashboard",
          operationsRoom: "Operations Room",
          attendance: "Attendance & Shifts",
          map: "Interactive Map",
          monitoring: "Monitoring",
          equipment: "Equipment & Vehicles",
          reports: "Mobilization System",
          alerts: "Alerts",
          earlyWarning: "Early Warning",
          analytics: "Reports",
          knowledge: "Knowledge Portal",
        },
      },
    },
  },

  /* =====================================================
     اللغة الافتراضية
  ====================================================== */
  lng: localStorage.getItem("app-language") || "ar",

  fallbackLng: "ar",

  /* =====================================================
     إعدادات interpolation
  ====================================================== */
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;