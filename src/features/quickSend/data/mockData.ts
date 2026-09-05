/**
 * بيانات وهمية (Mock Data) لصفحة "الإشعار السريع"
 * لاحقًا تُستبدل بربط حقيقي بجهات الاتصال والمجموعات من الـ API
 */

export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  mobile: string;
  email: string;
  jobNumber: string;
}

export interface RecipientGroup {
  id: number;
  name: string;
  membersCount: number;
}

const branches = [
  "بلدية الحناكية (أ)",
  "بلدية الحناكية (ب)",
  "بلدية النخيل (أ)",
  "بلدية النخيل (ب2)",
  "بلدية الحسو (أ)",
  "بلدية الحسو (ب)",
  "بلدية العيص (أ)",
  "بلدية العيص (ب)",
  "بلدية سليلة جهينة والمريغ (أ)",
  "بلدية سليلة جهينة والمريغ (ب)",
  "بلدية بدر",
  "بلدية العلا",
  "بلدية خيبر",
];

const firstNames = [
  "سلطام", "محمد", "عبدالإله", "يوسف", "فيصل", "عبدالله", "عبدالرحمن",
  "راجح", "بندر", "سلامة", "خالد", "تركي", "فهد", "ماجد", "سعود",
  "عبدالعزيز", "ناصر", "بدر", "سامي", "عمر",
];

const lastNames = [
  "مرزوق الصاعدي", "معتق المشيعلي", "متعب الحيسوني", "بن سعود العوفي",
  "عبدالمحسن الازهري", "الحميدي الحربي", "سلمان الحبيشي", "عبدالله الشظيفي",
  "حميد الجهني", "عبدالراحم العنزي", "الغامدي", "القرشي", "الزهراني",
  "العتيبي", "الحربي", "الجهني", "المطيري", "السلمي", "البلوي", "الرشيدي",
];

function buildContacts(): Contact[] {
  const list: Contact[] = [];
  for (let i = 0; i < 51; i++) {
    const first = firstNames[i % firstNames.length];
    const last = lastNames[i % lastNames.length];
    const branch = branches[i % branches.length];
    const mobile = `9665${(50000000 + i * 137).toString().slice(0, 8)}`;
    const email =
      i % 3 === 0
        ? `amana-md.gov.sa@${4300000 + i}`
        : `${first}.${last.split(" ")[0]}@amana-md.gov.sa`.replace(/\s/g, "");

    list.push({
      id: i + 1,
      firstName: `${first} ${branch}`,
      lastName: last,
      mobile,
      email,
      jobNumber: `${100000 + i * 7}`,
    });
  }
  return list;
}

export const mockContacts: Contact[] = buildContacts();

export const mockGroups: RecipientGroup[] = [
  { id: 1, name: "مدراء البلديات الفرعية", membersCount: 13 },
  { id: 2, name: "فرق الطوارئ الميدانية", membersCount: 22 },
  { id: 3, name: "غرفة العمليات المركزية", membersCount: 8 },
  { id: 4, name: "الدفاع المدني - المدينة", membersCount: 15 },
  { id: 5, name: "قسم الاتصالات والإعلام", membersCount: 6 },
  { id: 6, name: "فرق الرصد الجوي", membersCount: 9 },
  { id: 7, name: "الأمن العام", membersCount: 18 },
  { id: 8, name: "الهلال الأحمر السعودي", membersCount: 11 },
  { id: 9, name: "شركات المرافق (كهرباء ومياه)", membersCount: 14 },
  { id: 10, name: "الإدارة العليا", membersCount: 5 },
];

export const notificationTypes = [
  { value: "broadcast-no-reply", label: "تنبيه دون الحاجة لرد - BROADCAST" },
  { value: "broadcast-reply", label: "تنبيه بحاجة لرد - RESPONSE" },
  { value: "readiness-check", label: "طلب تأكيد جاهزية - READINESS" },
];

export const placeholders = [
  { value: "recipient-name", label: "اسم المستلم" },
  { value: "branch-name", label: "اسم البلدية/الجهة" },
  { value: "date-time", label: "التاريخ والوقت" },
  { value: "sender-name", label: "اسم المرسل" },
];
