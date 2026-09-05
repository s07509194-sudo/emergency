/**
 * بيانات وهمية (Mock Data) لمنظومة الإشعارات - صفحة "التقارير"
 * لاحقًا يتم استبدال هذا الملف بطلبات حقيقية من services/api.ts
 */

export interface NotificationChannelStats {
  email: number;
  sms: number;
  calls: number;
  whatsapp: number;
}

export interface TopStat {
  key: string;
  label: string;
  value: number;
  icon: "settings" | "groups" | "contacts" | "reports" | "templates" | "quick";
}

export interface TemplateRow {
  id: string;
  title: string;
  type: string;
  channels: ("email" | "sms")[];
  recipients: number;
}

export const topStats: TopStat[] = [
  { key: "settings", label: "الاعدادات", value: 3, icon: "settings" },
  { key: "groups", label: "المجموعات", value: 17, icon: "groups" },
  { key: "contacts", label: "جهات الاتصال", value: 80, icon: "contacts" },
  { key: "reports", label: "تقارير الإشعارات", value: 843, icon: "reports" },
  { key: "templates", label: "قوالب الإشعارات", value: 19, icon: "templates" },
  { key: "quick", label: "إشعار سريع", value: 867, icon: "quick" },
];

export const responseOverview = {
  responded: 23,
  notResponded: 19,
};

export const channelsOverview: NotificationChannelStats & { whatsapp: number } = {
  sms: 4712,
  calls: 40,
  whatsapp: 0,
  email: 4591,
};

export type ChannelsOverviewData = typeof channelsOverview;

export const latestTemplates: TemplateRow[] = [
  { id: "01662", title: "روابط تقارير الحالة المطرية", type: "تنبيه دون الحاجة لرد", channels: ["email", "sms"], recipients: 4 },
  { id: "01661", title: "تحديث موقع الانذار", type: "تنبيه دون الحاجة لرد", channels: ["email", "sms"], recipients: 4 },
  { id: "01534", title: "تحديث حالة الإنذار", type: "تنبيه دون الحاجة لرد", channels: ["email", "sms"], recipients: 15 },
  { id: "01533", title: "تحديث حالة الإنذار", type: "تنبيه دون الحاجة لرد", channels: ["email", "sms"], recipients: 11 },
  { id: "01532", title: "روابط تقارير الحالة المطرية", type: "تنبيه دون الحاجة لرد", channels: ["email", "sms"], recipients: 5 },
  { id: "01531", title: "رفع درجة الانذار", type: "تنبيه دون الحاجة لرد", channels: ["email", "sms"], recipients: 5 },
  { id: "01502", title: "روابط تقارير الحالة المطرية", type: "تنبيه دون الحاجة لرد", channels: ["email", "sms"], recipients: 5 },
  { id: "01456", title: "روابط التقارير", type: "تنبيه دون الحاجة لرد", channels: ["email", "sms"], recipients: 2 },
  { id: "01455", title: "تحديث فترة الانذار", type: "تنبيه دون الحاجة لرد", channels: ["email", "sms"], recipients: 2 },
  { id: "01430", title: "روابط التقارير", type: "تنبيه دون الحاجة لرد", channels: ["email", "sms"], recipients: 4 },
  { id: "01428", title: "انذار", type: "تنبيه دون الحاجة لرد", channels: ["email", "sms"], recipients: 4 },
  { id: "01224", title: "تنبية استعداد البلديات - Copy", type: "تنبيه دون الحاجة لرد", channels: ["sms"], recipients: 54 },
  { id: "01139", title: "إنذار جديد", type: "تنبيه دون الحاجة لرد", channels: ["email", "sms"], recipients: 4 },
];

export const lastNotification = {
  id: "01866",
  badge: "تنبيه دون الحاجة لرد",
  durationLabel: "مدة الإشعار",
  duration: "00 : 00 : 28",
  channels: ["البريد الإلكتروني", "الرسالة النصية"],
  breakdown: {
    email: 9,
    sms: 9,
    calls: 0,
  },
  results: {
    failed: { percent: 0, value: 0, label: "إجمالي فشل بالإستقبال" },
    delivered: { percent: 100, value: 9, label: "إجمالي المستقبلون بنجاح" },
    total: { percent: 100, value: 9, label: "إجمالي المستلمون" },
  },
};
