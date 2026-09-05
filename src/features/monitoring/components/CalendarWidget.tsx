import { useMemo, useState } from "react";

type CalendarType = "gregorian" | "hijri";

interface DayCell {
  day: number;
  isToday: boolean;
  key: string;
}

const DAY_NAMES = ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];

function getHijriParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US-u-ca-islamic-umalqura", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).formatToParts(date);

  return {
    day: Number(parts.find((p) => p.type === "day")?.value ?? 1),
    month: Number(parts.find((p) => p.type === "month")?.value ?? 1),
    year: Number(parts.find((p) => p.type === "year")?.value ?? 1),
  };
}

function buildGregorianMonth(today: Date) {
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: DayCell[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, isToday: d === today.getDate(), key: `g-${d}` });
  }

  const label = today.toLocaleDateString("ar-EG", { month: "long", year: "numeric" });

  return { cells, leadingBlanks: firstWeekday, label };
}

function buildHijriMonth(today: Date) {
  // نرجع للخلف يوم بيوم لحد أول يوم في الشهر الهجري الحالي
  const start = new Date(today);
  while (getHijriParts(start).day > 1) {
    start.setDate(start.getDate() - 1);
  }

  const startMonthNum = getHijriParts(start).month;
  const leadingBlanks = start.getDay();

  const cells: DayCell[] = [];
  const cursor = new Date(start);

  while (getHijriParts(cursor).month === startMonthNum) {
    const parts = getHijriParts(cursor);
    cells.push({
      day: parts.day,
      isToday: cursor.toDateString() === today.toDateString(),
      key: `h-${parts.day}`,
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  const label = today.toLocaleDateString("ar-SA-u-ca-islamic-umalqura", {
    month: "long",
    year: "numeric",
  });

  return { cells, leadingBlanks, label };
}

export default function CalendarWidget() {
  const [type, setType] = useState<CalendarType>("gregorian");
  const today = useMemo(() => new Date(), []);

  const { cells, leadingBlanks, label } = useMemo(() => {
    return type === "gregorian" ? buildGregorianMonth(today) : buildHijriMonth(today);
  }, [type, today]);

  return (
    <div
      className="
        rounded-2xl p-5
        bg-gradient-to-br from-teal-950 via-teal-900 to-emerald-900
        shadow-lg border border-white/10
      "
    >
      {/* الترويسة: اسم الشهر + مبدّل هجري/ميلادي */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-white font-bold text-base">{label}</h4>

        <div className="flex items-center gap-1 bg-white/10 rounded-full p-1">
          <button
            onClick={() => setType("gregorian")}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              type === "gregorian" ? "bg-emerald-400 text-teal-950" : "text-white/60 hover:text-white"
            }`}
          >
            ميلادي
          </button>
          <button
            onClick={() => setType("hijri")}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              type === "hijri" ? "bg-emerald-400 text-teal-950" : "text-white/60 hover:text-white"
            }`}
          >
            هجري
          </button>
        </div>
      </div>

      {/* أسماء الأيام */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAY_NAMES.map((d) => (
          <div key={d} className="text-center text-[11px] font-semibold text-white/50">
            {d}
          </div>
        ))}
      </div>

      {/* شبكة الأيام */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: leadingBlanks }).map((_, i) => (
          <div key={`blank-${i}`} />
        ))}

        {cells.map((cell) => (
          <div
            key={cell.key}
            className={`
              aspect-square flex items-center justify-center rounded-lg text-sm font-semibold
              transition-all
              ${
                cell.isToday
                  ? `
                    bg-gradient-to-br from-emerald-400 to-teal-300
                    text-teal-950 font-extrabold
                    shadow-[0_0_12px_3px_rgba(52,211,153,0.6)]
                    backdrop-blur-md
                    ring-2 ring-emerald-200/70
                    animate-pulse
                  `
                  : "text-white/80 hover:bg-white/10"
              }
            `}
          >
            {cell.day}
          </div>
        ))}
      </div>
    </div>
  );
}
