import { useMemo, useState } from "react";
import { Activity, MapPin, Radio, Search, X } from "lucide-react";
import type { SensorPoint } from "../utils/readSensors";

interface SensorsSummaryProps {
  sensors: SensorPoint[];
  selectedId: number | null;
  onSelect: (sensor: SensorPoint) => void;
}

type GovernorateTone = {
  background: string;
  activeBackground: string;
  icon: string;
  glow: string;
  border: string;
  activeBorder: string;
};

const GOVERNORATES = ["المدينة المنورة", "ينبع", "بدر", "خيبر"] as const;

const GOVERNORATE_TONES: GovernorateTone[] = [
  {
    background: "from-emerald-400/10 via-white/20 to-emerald-100/10",
    activeBackground: "from-emerald-400/25 via-emerald-100/30 to-white/30",
    icon: "text-emerald-600",
    glow: "bg-emerald-400",
    border: "border-emerald-200/50",
    activeBorder: "border-emerald-300/80",
  },
  {
    background: "from-sky-400/10 via-white/20 to-sky-100/10",
    activeBackground: "from-sky-400/25 via-sky-100/30 to-white/30",
    icon: "text-sky-600",
    glow: "bg-sky-400",
    border: "border-sky-200/50",
    activeBorder: "border-sky-300/80",
  },
  {
    background: "from-amber-400/10 via-white/20 to-amber-100/10",
    activeBackground: "from-amber-400/25 via-amber-100/30 to-white/30",
    icon: "text-amber-600",
    glow: "bg-amber-400",
    border: "border-amber-200/50",
    activeBorder: "border-amber-300/80",
  },
  {
    background: "from-violet-400/10 via-white/20 to-violet-100/10",
    activeBackground: "from-violet-400/25 via-violet-100/30 to-white/30",
    icon: "text-violet-600",
    glow: "bg-violet-400",
    border: "border-violet-200/50",
    activeBorder: "border-violet-300/80",
  },
];

const STATUS_STYLES: Record<string, string> = {
  نشط: "border border-emerald-200/70 bg-emerald-50/70 text-emerald-700",
  "غير نشط": "border border-slate-200/70 bg-slate-100/70 text-slate-500",
  تنبيه: "border border-red-200/70 bg-red-50/70 text-red-600",
};

const FALLBACK_STATUS_STYLE =
  "border border-slate-200/70 bg-slate-100/70 text-slate-600";

const normalizeSearch = (value: string) => value.trim().toLocaleUpperCase("ar");

export default function SensorsSummary({
  sensors,
  selectedId,
  onSelect,
}: SensorsSummaryProps) {
  const [selectedGovernorate, setSelectedGovernorate] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");

  const sensorCounts = useMemo(() => {
    const counts = Object.fromEntries(
      GOVERNORATES.map((governorate) => [governorate, 0]),
    ) as Record<string, number>;

    for (const sensor of sensors) {
      counts[sensor.governorate] = (counts[sensor.governorate] ?? 0) + 1;
    }

    return counts;
  }, [sensors]);

  const filteredSensors = useMemo(() => {
    const query = normalizeSearch(searchQuery);

    return sensors.filter((sensor) => {
      const matchesGovernorate =
        !selectedGovernorate || sensor.governorate === selectedGovernorate;
      const matchesSearch =
        !query || normalizeSearch(sensor.code).includes(query);

      return matchesGovernorate && matchesSearch;
    });
  }, [sensors, searchQuery, selectedGovernorate]);

  const clearFilters = () => {
    setSelectedGovernorate(null);
    setSearchQuery("");
  };

  const hasActiveFilters = Boolean(selectedGovernorate || searchQuery.trim());

  return (
    <section className="space-y-6" dir="rtl" aria-label="ملخص المستشعرات">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {GOVERNORATES.map((governorate, index) => {
          const isActive = selectedGovernorate === governorate;
          const tone = GOVERNORATE_TONES[index];

          return (
            <button
              key={governorate}
              type="button"
              aria-pressed={isActive}
              onClick={() =>
                setSelectedGovernorate(isActive ? null : governorate)
              }
              className={`group relative min-h-[125px] overflow-hidden rounded-3xl border bg-gradient-to-br backdrop-blur-2xl transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.015] hover:shadow-[0_18px_45px_rgba(15,23,42,0.12)] active:translate-y-0 active:scale-[0.985] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 ${
                isActive ? tone.activeBackground : tone.background
              } ${isActive ? tone.activeBorder : tone.border} shadow-[0_8px_30px_rgba(15,23,42,0.06)]`}
            >
              <span
                className="absolute inset-x-0 top-0 h-px bg-white/80"
                aria-hidden="true"
              />
              <span
                className="pointer-events-none absolute -right-16 -top-20 h-40 w-40 rounded-full bg-white/50 opacity-0 blur-3xl transition-all duration-700 group-hover:translate-x-4 group-hover:translate-y-4 group-hover:opacity-100"
                aria-hidden="true"
              />
              <span
                className={`pointer-events-none absolute -bottom-10 -left-10 h-28 w-28 rounded-full blur-3xl opacity-10 transition-all duration-700 group-hover:scale-150 group-hover:opacity-30 ${tone.glow}`}
                aria-hidden="true"
              />

              <span className="relative z-10 flex h-full flex-col justify-between p-4">
                <span className="flex items-center justify-between">
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-2xl bg-white/55 shadow-sm backdrop-blur-md transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 ${tone.icon}`}
                    aria-hidden="true"
                  >
                    <MapPin size={18} strokeWidth={2.2} />
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full border border-white/60 bg-white/40 px-2 py-1 text-[10px] font-medium text-slate-500 backdrop-blur-md">
                    <span
                      className={`h-1.5 w-1.5 animate-pulse rounded-full ${tone.glow}`}
                    />
                    مراقبة
                  </span>
                </span>

                <span className="mt-2 flex items-end justify-between">
                  <span>
                    <span className="block text-xs font-medium text-slate-500">
                      مستشعرات
                    </span>
                    <span className="mt-0.5 block origin-right text-3xl font-black tracking-tight text-slate-800 transition-all duration-500 group-hover:translate-x-1 group-hover:scale-110">
                      {sensorCounts[governorate] ?? 0}
                    </span>
                  </span>
                  <Activity
                    size={19}
                    aria-hidden="true"
                    className={`opacity-40 transition-all duration-500 group-hover:scale-125 group-hover:opacity-100 ${tone.icon}`}
                  />
                </span>

                <span className="mt-1 text-sm font-bold text-slate-600">
                  {governorate}
                </span>
              </span>

              <span
                className={`absolute bottom-0 left-1/2 h-1 -translate-x-1/2 rounded-full transition-all duration-500 ${tone.glow} ${
                  isActive
                    ? "w-16 opacity-80"
                    : "w-0 opacity-0 group-hover:w-10 group-hover:opacity-50"
                }`}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>

      <section className="flex h-[780px] flex-col overflow-hidden rounded-[2rem] border border-white bg-white/55 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
        <header className="flex items-center justify-between border-b border-white/70 bg-white/35 px-5 py-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100/70 text-emerald-600 shadow-sm"
              aria-hidden="true"
            >
              <Radio size={17} />
            </span>
            <div>
              <h2 className="text-sm font-extrabold text-slate-700">
                تفاصيل المستشعرات
              </h2>
              {selectedGovernorate && (
                <p className="mt-1 text-[11px] text-slate-600">
                  عرض مستشعرات {selectedGovernorate}
                </p>
              )}
            </div>
          </div>
          <span className="rounded-full border border-white/70 bg-white/50 px-3 py-1.5 text-[11px] font-bold text-slate-500 backdrop-blur-md">
            {filteredSensors.length} مستشعر
          </span>
        </header>

        <div className="border-b border-white/70 bg-white/25 px-5 py-3 backdrop-blur-xl">
          <label htmlFor="sensor-search" className="sr-only">
            البحث بكود المستشعر
          </label>
          <div className="relative">
            <Search
              size={15}
              aria-hidden="true"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              id="sensor-search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="ابحث بكود المستشعر..."
              className="w-full rounded-xl border border-white/70 bg-white/50 py-2 pl-10 pr-9 text-xs font-medium text-slate-700 outline-none backdrop-blur-md transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-400/40"
            />
            {searchQuery && (
              <button
                type="button"
                aria-label="مسح البحث"
                onClick={() => setSearchQuery("")}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:bg-white hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {filteredSensors.map((sensor) => {
            const isSelected = selectedId === sensor.id;
            const statusStyle =
              STATUS_STYLES[sensor.status] ?? FALLBACK_STATUS_STYLE;

            return (
              <button
                key={sensor.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelect(sensor)}
                className={`group relative flex w-full items-center justify-between gap-3 border-b border-white/60 px-5 py-3.5 text-right transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-400/60 ${
                  isSelected
                    ? "bg-emerald-50/70 shadow-inner"
                    : "bg-white/10 hover:bg-white/60"
                }`}
              >
                <span
                  className={`absolute right-0 top-0 h-full w-1 bg-emerald-500 transition-opacity duration-300 ${
                    isSelected
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-40"
                  }`}
                  aria-hidden="true"
                />

                <span className="flex min-w-0 items-center gap-3">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                      isSelected
                        ? "scale-105 bg-emerald-100 text-emerald-600"
                        : "bg-white/60 text-slate-400 group-hover:bg-white group-hover:text-emerald-500"
                    }`}
                    aria-hidden="true"
                  >
                    <Radio size={15} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-slate-700">
                      {sensor.code}
                    </span>
                    <span className="mt-0.5 block text-[11px] font-medium text-slate-400">
                      {sensor.governorate}
                    </span>
                  </span>
                </span>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold backdrop-blur-md transition-transform duration-300 group-hover:scale-105 ${statusStyle}`}
                >
                  {sensor.status}
                </span>
              </button>
            );
          })}

          {filteredSensors.length === 0 && (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <span
                className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100/70 text-slate-400"
                aria-hidden="true"
              >
                <Radio size={20} />
              </span>
              <p className="text-sm font-semibold text-slate-500">
                لا توجد مستشعرات
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {hasActiveFilters
                  ? "جرّب تغيير معايير البحث أو الفلترة"
                  : "لا توجد مستشعرات لعرضها حالياً"}
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 rounded-lg px-3 py-2 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                >
                  مسح الفلاتر
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </section>
  );
}

export type { SensorsSummaryProps };
