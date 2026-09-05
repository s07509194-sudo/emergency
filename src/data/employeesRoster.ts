import type { Employee } from "../types/operationsRoom";

/**
 * القائمة الرسمية لموظفي المشروع (48 موظف) — مصدرها كشف الأسماء الرسمي
 * المرفوع من صاحب المشروع.
 *
 * ⚠️ ملاحظة مهمة: أكواد الموظفين (id) مولّدة هون لأنها ما كانت موجودة
 * بالكشف الأصلي (بس أسماء ووظائف). لما يتوفر نظام موظفين حقيقي (HR/backend)،
 * استبدل هالأكواد بالأكواد الرسمية المعتمدة من الجهة، والأفضل يكون
 * الاستبدال هون فقط بهالملف دون الحاجة لتعديل أي شاشة تانية.
 *
 * تصنيف isOperationsRoomStaff:
 *  - true  → الطاقم الأساسي المباشر لتشغيل غرفة العمليات (إدارة، خبرة، GIS، هندسة، جرافيك، مراقبة)
 *  - false → المنسقون (ضباط الاتصال الميدانيون) — هما جوهر قسم "الحضور والمناوبات"
 */
export const EMPLOYEES: Employee[] = [
  { id: "PM-01", name: "فراس سعد الحربي", role: "مدير مشروع", isOperationsRoomStaff: true },
  { id: "EXP-01", name: "محمود البسيوني", role: "خبير", isOperationsRoomStaff: true },
  { id: "GIS-01", name: "محمد جمال علي شاهين", role: "GIS", isOperationsRoomStaff: true },
  { id: "ENG-01", name: "مودة عبدالعزيز احمد ابولبن", role: "مهندسة", isOperationsRoomStaff: true },
  { id: "GFX-01", name: "عثمان محمد شاهد", role: "جرافيك", isOperationsRoomStaff: true },
  { id: "MON-01", name: "مرام يحيى حاسن الاحمدي", role: "مراقب", isOperationsRoomStaff: true },

  { id: "CO-01", name: "الحسن بن انس كتبي", role: "منسق", isOperationsRoomStaff: false },
  { id: "CO-02", name: "سهام عيد الصاعدي", role: "منسقة", isOperationsRoomStaff: false },
  { id: "CO-03", name: "سارة عبيد الحربي", role: "منسقة", isOperationsRoomStaff: false },
  { id: "CO-04", name: "أحلام عامر عمار الحازمي", role: "منسقة", isOperationsRoomStaff: false },
  { id: "CO-05", name: "رهف ماجد الحربي", role: "منسقة", isOperationsRoomStaff: false },
  { id: "CO-06", name: "مرام عبيد عبدالله العتيبي", role: "منسقة", isOperationsRoomStaff: false },
  { id: "CO-07", name: "نورة سعود الحربي", role: "منسقة", isOperationsRoomStaff: false },
  { id: "CO-08", name: "شروق حويمد العلوي", role: "منسقة", isOperationsRoomStaff: false },
  { id: "CO-09", name: "شوق عبدالعزيز الحربي", role: "منسقة", isOperationsRoomStaff: false },
  { id: "CO-10", name: "همس سعد الحربي", role: "منسقة", isOperationsRoomStaff: false },
  { id: "CO-11", name: "فاطمة حسن الحربي", role: "منسقة", isOperationsRoomStaff: false },
  { id: "CO-12", name: "احمد بن مناور اللهيبي", role: "منسق", isOperationsRoomStaff: false },
  { id: "CO-13", name: "عبدالله اسماعيل الحربي", role: "منسق", isOperationsRoomStaff: false },
  { id: "CO-14", name: "فيصل عبدالعزيز الجهني", role: "منسق", isOperationsRoomStaff: false },
  { id: "CO-15", name: "نايف سلامة السحيمي", role: "منسق", isOperationsRoomStaff: false },
  { id: "CO-16", name: "عادل هليل المحمدي", role: "منسق", isOperationsRoomStaff: false },
  { id: "CO-17", name: "عبدالرحمن اسماعيل الحربي", role: "منسق", isOperationsRoomStaff: false },
  { id: "CO-18", name: "عبدالله نافع الحربي", role: "منسق", isOperationsRoomStaff: false },
  { id: "CO-19", name: "عبدالله نور السحيمي", role: "منسق", isOperationsRoomStaff: false },
  { id: "CO-20", name: "سهيل سليم الحربي", role: "منسق", isOperationsRoomStaff: false },
  { id: "CO-21", name: "خالد عبدالكريم المطيري", role: "منسق", isOperationsRoomStaff: false },
  { id: "CO-22", name: "خالد سالم الرشيدي", role: "منسق", isOperationsRoomStaff: false },
  { id: "CO-23", name: "حسام ناصر البلوي", role: "منسق", isOperationsRoomStaff: false },
  { id: "CO-24", name: "حمدان شليان الحربي", role: "منسق", isOperationsRoomStaff: false },
  { id: "CO-25", name: "محمد رأفت خجا", role: "منسق", isOperationsRoomStaff: false },
  { id: "CO-26", name: "محمد حاكم الحربي", role: "منسق", isOperationsRoomStaff: false },
  { id: "CO-27", name: "عامر حسن الجهني", role: "منسق", isOperationsRoomStaff: false },
  { id: "CO-28", name: "ندى غالب الحربي", role: "منسقة", isOperationsRoomStaff: false },
  { id: "CO-29", name: "ليال محمد باعقيل", role: "منسقة", isOperationsRoomStaff: false },
  { id: "CO-30", name: "نوره اسماعيل الحربي", role: "منسقة", isOperationsRoomStaff: false },
  { id: "CO-31", name: "لى محمد باعقيل", role: "منسقة", isOperationsRoomStaff: false },
  { id: "CO-32", name: "مها عبدالعزيز الحربي", role: "منسقة", isOperationsRoomStaff: false },
  { id: "CO-33", name: "تهاني جبري العمري", role: "منسقة", isOperationsRoomStaff: false },
  { id: "CO-34", name: "انس خالد ابراهيم", role: "منسق", isOperationsRoomStaff: false },
  { id: "CO-35", name: "عبدالمجيد نور السحيمي", role: "منسق", isOperationsRoomStaff: false },
  { id: "CO-36", name: "صهيب حسن غبان", role: "منسق", isOperationsRoomStaff: false },
  { id: "CO-37", name: "عمرو عبدالله غضوان", role: "منسق", isOperationsRoomStaff: false },
  { id: "CO-38", name: "حسام عادل السراني", role: "منسق", isOperationsRoomStaff: false },
  { id: "CO-39", name: "راكان بن حاكم الحربي", role: "منسق", isOperationsRoomStaff: false },
  { id: "CO-40", name: "خالد سعد ديبان الجهني", role: "منسق", isOperationsRoomStaff: false },
  { id: "CO-41", name: "ريان احمد النوار", role: "منسق", isOperationsRoomStaff: false },
  { id: "CO-42", name: "عبير محمد صالح العوفي", role: "منسقة", isOperationsRoomStaff: false },
];
