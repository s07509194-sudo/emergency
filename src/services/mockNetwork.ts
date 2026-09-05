/**
 * أداة مساعدة لمحاكاة زمن استجابة الشبكة داخل خدمات الـ mock.
 *
 * الهدف: خلي الواجهة تتعامل من اليوم الأول مع حالات التحميل (loading)
 * وحالات الفشل، بحيث لما نستبدل هاي الدوال بـ fetch/axios حقيقي،
 * ما يحتاج الكومبوننت يتغيّر إطلاقًا — بس الملف يلي جوا services/ هو يلي بيتغيّر.
 */
export function simulateNetwork<T>(data: T, delayMs = 400): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delayMs);
  });
}

/** يولّد معرّف فريد بسيط لعناصر الـ mock (سجل قرار، حدث حالة، إلخ) */
export function generateMockId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}
