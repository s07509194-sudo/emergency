import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Menu, X } from "lucide-react";
import logo from "../../assets/logo.png";

const navItems = [
  { labelKey: "sidebar.dashboard", path: "/dashboard" },
  { labelKey: "sidebar.operationsRoom", path: "/operations-room" },
  { labelKey: "sidebar.attendance", path: "/attendance" },
  { labelKey: "sidebar.map", path: "/critical-points" },
  { labelKey: "sidebar.monitoring", path: "/monitoring" },
  { labelKey: "sidebar.equipment", path: "/equipment" },
  { labelKey: "sidebar.reports", path: "/analytics" },
  { labelKey: "sidebar.alerts", path: "/alerts" },
  { labelKey: "sidebar.earlyWarning", path: "/early-warning" },
  { labelKey: "sidebar.knowledge", path: null },
];

export default function Sidebar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isEnglish = i18n.language.startsWith("en");

  const closeSidebar = () => {
    setIsOpen(false);
  };

  /*
   * اتجاه الـ Sidebar حسب اللغة
   * عربي = يمين
   * إنجليزي = يسار
   */
  const sidebarSide = isEnglish
    ? "left-0 border-r border-white/10"
    : "right-0 border-l border-white/10";

  /*
   * مكان الـ Sidebar عندما يكون مغلقًا على الجوال
   */
  const hiddenPosition = isEnglish
    ? "-translate-x-full"
    : "translate-x-full";

  return (
    <>
      {/* =====================================================
          زر القائمة للجوال
      ====================================================== */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={t("sidebar.openMenu")}
        className={`
          fixed top-4 z-50
          ${isEnglish ? "left-4" : "right-4"}
          flex h-12 w-12
          items-center justify-center
          rounded-xl
          bg-emerald-700
          text-white
          shadow-xl
          transition
          hover:bg-emerald-800
          lg:hidden
        `}
      >
        <Menu size={26} />
      </button>

      {/* =====================================================
          الخلفية عند فتح القائمة على الجوال
      ====================================================== */}
      {isOpen && (
        <button
          type="button"
          aria-label={t("sidebar.closeMenu")}
          onClick={closeSidebar}
          className="
            fixed inset-0
            z-40
            bg-black/50
            backdrop-blur-sm
            lg:hidden
          "
        />
      )}

      {/* =====================================================
          Sidebar
      ====================================================== */}
      <aside
        className={`
          fixed
          top-0
          z-50
          min-h-screen
          w-[280px]
          overflow-y-auto
          p-5
          text-white

          ${sidebarSide}

          bg-gradient-to-b
          from-emerald-500/95
          via-teal-700/95
          to-teal-950

          backdrop-blur-2xl
          shadow-2xl

          transform
          transition-transform
          duration-300
          ease-in-out

          ${isOpen ? "translate-x-0" : hiddenPosition}

          lg:sticky
          lg:top-0
          lg:z-30
          lg:block
          lg:w-72
          lg:min-w-[288px]
          lg:translate-x-0
          lg:transform-none
          lg:overflow-hidden
        `}
      >
        {/* =====================================================
            لمسة زجاجية
        ====================================================== */}
        <div className="
          pointer-events-none
          absolute
          inset-0
          bg-gradient-to-b
          from-white/10
          to-transparent
        " />

        <div className="relative">
          {/* =====================================================
              زر الإغلاق للجوال
          ====================================================== */}
          <button
            type="button"
            onClick={closeSidebar}
            aria-label={t("sidebar.closeMenu")}
            className={`
              absolute
              top-0
              ${isEnglish ? "right-0" : "left-0"}
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-lg
              bg-white/10
              text-white
              hover:bg-white/20
              lg:hidden
            `}
          >
            <X size={22} />
          </button>

          {/* =====================================================
              الشعار + اسم النظام
          ====================================================== */}
          <div className="
            mb-8
            flex
            flex-col
            items-center
            pt-6
            lg:pt-2
          ">
            <img
              src={logo}
              alt={t("sidebar.logoAlt")}
              className="
                mb-4
                h-20
                w-20
                object-contain
                drop-shadow-lg
                sm:h-24
                sm:w-24
              "
            />

            <h2 className="
              text-center
              text-xl
              font-bold
              tracking-wide
              sm:text-2xl
            ">
              {t("sidebar.systemName")}
            </h2>

            <p className="
              mt-1
              text-xs
              text-white/70
              sm:text-sm
            ">
              {t("sidebar.municipality")}
            </p>
          </div>

          {/* =====================================================
              التنقل
          ====================================================== */}
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive =
                item.path !== null &&
                location.pathname === item.path;

              const className = `
                block
                rounded-xl
                border
                px-4
                py-3
                text-base
                font-medium
                transition-all
                duration-200
                sm:py-3.5
                sm:text-lg

                ${
                  isActive
                    ? "border-white/30 bg-white/25 shadow-lg backdrop-blur-md"
                    : "border-transparent hover:bg-white/10"
                }
              `;

              {/* =====================================================
                  العناصر التي لها Route
              ====================================================== */}
              if (item.path) {
                return (
                  <Link
                    key={item.labelKey}
                    to={item.path}
                    onClick={closeSidebar}
                    className={className}
                  >
                    {t(item.labelKey)}
                  </Link>
                );
              }

              {/* =====================================================
                  العناصر التي ليس لها Route حاليًا
              ====================================================== */}
              return (
                <div
                  key={item.labelKey}
                  className={`${className} cursor-pointer`}
                  onClick={closeSidebar}
                >
                  {t(item.labelKey)}
                </div>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}