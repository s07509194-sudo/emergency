import { Search, RotateCcw } from "lucide-react";
import {
  DEFAULT_FILTERS,
  type CriticalPointsFilters,
} from "../utils/filterCriticalPoints";

interface FiltersProps {
  filters: CriticalPointsFilters;
  onChange: (filters: CriticalPointsFilters) => void;
  /** القيم الفريدة لعمود "المشكلة" (نوع النقطة)، مُستخرجة من البيانات نفسها */
  typeOptions: string[];
}

export default function Filters({ filters, onChange, typeOptions }: FiltersProps) {
  const handleReset = () => {
    onChange(DEFAULT_FILTERS);
  };

  return (
    <div className="bg-white rounded-xl shadow mt-8 p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* البحث */}
        <div className="relative">
          <Search
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="البحث عن نقطة حرجة..."
            className="w-full border rounded-lg pr-10 pl-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* نوع النقطة */}
        <select
          value={filters.type}
          onChange={(e) => onChange({ ...filters, type: e.target.value })}
          className="border rounded-lg px-4 py-3"
        >
          <option value="all">جميع الأنواع</option>
          {typeOptions.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {/* درجة الخطورة */}
        <select
          value={filters.risk}
          onChange={(e) => onChange({ ...filters, risk: e.target.value })}
          className="border rounded-lg px-4 py-3"
        >
          <option value="all">جميع درجات الخطورة</option>
          <option value="high">عالية</option>
          <option value="medium">متوسطة</option>
          <option value="low">منخفضة</option>
        </select>

        {/* زر إعادة التعيين */}
        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 py-3 font-semibold transition"
        >
          <RotateCcw size={16} />
          إعادة تعيين الفلاتر
        </button>
      </div>
    </div>
  );
}
