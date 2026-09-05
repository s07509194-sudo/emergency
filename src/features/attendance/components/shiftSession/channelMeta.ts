import { Phone, Smartphone, Printer, PhoneCall, Mail, Satellite } from "lucide-react";
import type { CommunicationChannelKey } from "../../../../types/operationsRoom";

export const CHANNEL_META: Record<
  CommunicationChannelKey,
  { label: string; icon: typeof Phone }
> = {
  landline: { label: "الهاتف الثابت", icon: Phone },
  mobile: { label: "الجوال", icon: Smartphone },
  fax: { label: "الفاكس", icon: Printer },
  ministry_hotline: { label: "الخط الساخن مع الوزارة", icon: PhoneCall },
  email: { label: "البريد الإلكتروني", icon: Mail },
  thuraya: { label: "الثريا", icon: Satellite },
};
