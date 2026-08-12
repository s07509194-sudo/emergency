import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";

const navItems = [
  { label: "لوحة التحكم", path: "/dashboard" },
  { label: "الخريطة التفاعلية", path: "/critical-points" },
  { label: "الرصد", path: "/monitoring" },
  { label: "البلاغات", path: null },
  { label: "التنبيهات", path: "/alerts" },
  { label: "التقارير", path: null },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside
      className="
        w-72 min-h-screen p-6 text-white relative overflow-hidden
        bg-gradient-to-b from-emerald-500/95 via-teal-700/95 to-teal-950
        backdrop-blur-2xl
        border-l border-white/10
        shadow-2xl
      "
    >
      {/* لمسة زجاجية إضافية أعلى الشريط */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />

      <div className="relative">
        {/* الشعار + اسم النظام */}
        <div className="flex flex-col items-center mb-10 pt-2">
          <img
            src={logo}
            alt="شعار أمانة المدينة المنورة"
            className="w-24 h-24 object-contain drop-shadow-lg mb-4"
          />
          <h2 className="text-2xl font-bold text-center tracking-wide">
            Emergency System
          </h2>
          <p className="text-white/70 text-sm mt-1">أمانة المدينة المنورة</p>
        </div>

        {/* التنقل */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = item.path !== null && location.pathname === item.path;

            const className = `
              block px-4 py-3.5 rounded-xl text-lg font-medium
              transition-all duration-200
              ${
                isActive
                  ? "bg-white/25 backdrop-blur-md border border-white/30 shadow-lg"
                  : "hover:bg-white/10 border border-transparent"
              }
            `;

            if (item.path) {
              return (
                <Link key={item.label} to={item.path} className={className}>
                  {item.label}
                </Link>
              );
            }

            return (
              <div key={item.label} className={`${className} cursor-pointer`}>
                {item.label}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
