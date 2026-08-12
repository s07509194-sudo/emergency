import { ShieldCheck } from "lucide-react";

export default function Header() {
  return (
    <header
      className="
        h-20
        bg-gradient-to-r from-emerald-900/80 via-emerald-700/70 to-teal-400/60
        backdrop-blur-xl
        border-b border-white/20
        shadow-lg
        flex items-center justify-between
        px-8
        sticky top-0 z-10
      "
    >

      {/* العنوان */}
      <div className="flex items-center gap-3">

        <div
          className="
            w-11 h-11 rounded-xl
            bg-white/20
            backdrop-blur-md
            border border-white/30
            flex items-center justify-center
            shadow-md
          "
        >
          <ShieldCheck size={22} className="text-white" />
        </div>


        <div>
          <h1 className="text-xl font-bold text-white drop-shadow">
            منصة إدارة الطوارئ والأزمات
          </h1>

          <p className="text-xs text-emerald-50 mt-0.5">
            أمانة المدينة المنورة
          </p>
        </div>

      </div>


      {/* حالة غرفة العمليات */}
      <div
        className="
          flex items-center gap-2
          bg-white/30
          backdrop-blur-md
          border border-white/40
          rounded-full
          px-4 py-2
          shadow-sm
        "
      >

        <span className="relative flex h-2 w-2">

          <span
            className="
              animate-ping
              absolute inline-flex
              h-full w-full
              rounded-full
              bg-red-500
              opacity-75
            "
          />

          <span
            className="
              relative inline-flex
              rounded-full
              h-2 w-2
              bg-red-700
            "
          />

        </span>


        <span className="text-sm font-bold text-[#7f1d1d]">
          غرفة العمليات - نظام الإنذار المبكر
        </span>

      </div>

    </header>
  );
}