import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

/**
 * يحوّل عنصر DOM (تقرير قابل للطباعة) لملف PDF جاهز للتنزيل مباشرة،
 * بدون المرور بنافذة الطباعة. يدعم تعدد الصفحات تلقائيًا لو المحتوى طويل.
 */
export async function exportElementAsPdf(element: HTMLElement, filename: string): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(filename);
}
