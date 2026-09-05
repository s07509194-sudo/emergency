/**
 * يطبع تقرير تسليم شفت واحد فقط، مع عزل كامل عن واجهة النظام وبقية عناصر الصفحة.
 */
export function printShiftSessionReport(container: HTMLElement): void {
  const report = container.querySelector<HTMLElement>("[data-shift-report]") ?? container;
  const cleanup = () => {
    report.removeAttribute("data-print-target");
    document.body.classList.remove("printing-shift-report");
  };

  report.setAttribute("data-print-target", "true");
  document.body.classList.add("printing-shift-report");
  window.addEventListener("afterprint", cleanup, { once: true });

  try {
    window.print();
  } finally {
    // يغطي المتصفحات التي لا تطلق afterprint بعد إغلاق نافذة الطباعة.
    window.setTimeout(cleanup, 0);
  }
}
