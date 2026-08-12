interface EmergencyReport {
  id: number;
  title: string;
  type: string;
  status: string;
  lat: number;
  lng: number;
  severity: "High" | "Medium" | "Low" | string;
  createdAt?: string;
}

interface ReportsTableProps {
  reports: EmergencyReport[];
}

const SEVERITY_STYLES: Record<string, string> = {
  High: "bg-red-100 text-red-600",
  Medium: "bg-yellow-100 text-yellow-700",
  Low: "bg-green-100 text-green-700",
};

const SEVERITY_LABELS: Record<string, string> = {
  High: "عالية",
  Medium: "متوسطة",
  Low: "منخفضة",
};

export default function ReportsTable({ reports }: ReportsTableProps) {
  if (reports.length === 0) {
    return (
      <div className="text-center text-slate-400 py-16">
        لا يوجد تسجيلات هنا
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-right">
        <thead>
          <tr className="bg-slate-50 text-slate-600 text-sm">
            <th className="px-6 py-3 font-semibold">رقم البلاغ</th>
            <th className="px-6 py-3 font-semibold">مستوى الخطورة</th>
            <th className="px-6 py-3 font-semibold">نوع الحادث</th>
            <th className="px-6 py-3 font-semibold">تاريخ الإنشاء</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 text-slate-700 font-mono">#{report.id}</td>
              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    SEVERITY_STYLES[report.severity] ?? "bg-slate-100 text-slate-600"
                  }`}
                >
                  {SEVERITY_LABELS[report.severity] ?? report.severity}
                </span>
              </td>
              <td className="px-6 py-4 text-slate-700">{report.title}</td>
              <td className="px-6 py-4 text-slate-400">
                {report.createdAt ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}