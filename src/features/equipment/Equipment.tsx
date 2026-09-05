import { useState } from "react";
import MainLayout from "../../components/layout/MainLayout";
import { AlertTriangle, Truck, Route, Map, ExternalLink } from "lucide-react";

type TabKey = "critical" | "equipment" | "roads" | "mymap";

const TABS: { key: TabKey; label: string; icon: typeof AlertTriangle; url: string }[] = [
    {
        key: "critical",
        label: "النقاط الحرجة",
        icon: AlertTriangle,
        url: "https://namaa-gis.kharetatalenmaa.sa/portal/apps/dashboards/b78dc488767c4296836436741c848bf5",
    },
    {
        key: "equipment",
        label: "المعدات",
        icon: Truck,
        url: "https://namaa-gis.kharetatalenmaa.sa/portal/apps/dashboards/c3b30c6c6ba5471f82724ddfcbbf57ca",
    },
    {
        key: "roads",
        label: "شبكة الطرق",
        icon: Route,
        url: "https://namaa-gis.kharetatalenmaa.sa/portal/apps/dashboards/9c8e68c08e9f44acafe8c5b78c102602",
    },
    {
        key: "mymap",
        label: "الخريطة التفاعلية",
        icon: Map,
        url: "https://www.google.com/maps/d/u/0/viewer?mid=1Ti1NFiXcpX81Vrd67LHiFWGx44lWRHY&femb=1&ll=25.0297784000716%2C39.63473900000001&z=7",
    },
];

export default function Equipment() {
    const [tab, setTab] = useState<TabKey>("critical");
    const activeTab = TABS.find((t) => t.key === tab)!;

    return (
        <MainLayout>
            <div className="p-6 bg-slate-100 min-h-screen">

                {/* عنوان الصفحة */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-slate-800">المعدات والآليات</h1>
                    <p className="text-slate-500 mt-2">
                        GIS Online للمتابعة اللحظية للنقاط الحرجة، المعدات، وشبكة الطرق.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-6 bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100 w-fit">
                    {TABS.map((t) => {
                        const Icon = t.icon;
                        const isActive = tab === t.key;

                        return (
                            <button
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                  transition-all duration-200
                  ${isActive ? "bg-emerald-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"}
                `}
                            >
                                <Icon size={16} />
                                {t.label}
                            </button>
                        );
                    })}
                </div>

                {/* رابط احتياطي لفتح الداشبورد في تبويب جديد */}
                <div className="flex justify-end mb-3">
                    <a
                        href={activeTab.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-emerald-700 hover:text-emerald-800 font-medium"
                    >
                        فتح "{activeTab.label}" في تبويب جديد
                        <ExternalLink size={14} />
                    </a>
                </div>

                {/* الداشبورد المدمج */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <iframe
                        key={activeTab.key}
                        src={activeTab.url}
                        title={activeTab.label}
                        className="w-full"
                        style={{ height: "75vh", border: "none" }}
                        allowFullScreen
                    />
                </div>

                <p className="text-xs text-slate-400 mt-3">
                    إذا لم يظهر المحتوى بشكل صحيح، استخدم رابط "فتح في تبويب جديد" أعلاه — بعض الخوادم قد تمنع عرض الصفحة داخل موقع آخر لأسباب أمنية.
                </p>

            </div>
        </MainLayout>
    );
}
