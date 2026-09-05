import { RefreshCw, LocateFixed } from "lucide-react";

type Props = {
  onRefresh: () => void;
  onHome: () => void;
};

export default function MapToolbar({ onRefresh, onHome }: Props) {
  return (
    <div
      className="
        absolute top-3 right-3 z-[1000]
        flex items-center gap-1.5
        rounded-2xl border border-white/70
        bg-white/90 p-1.5
        shadow-xl shadow-slate-900/15
        backdrop-blur-md
      "
    >
      <button
        type="button"
        onClick={onHome}
        title="العودة إلى مركز العمليات"
        aria-label="العودة إلى مركز العمليات"
        className="
          flex h-9 w-9 items-center justify-center
          rounded-xl text-slate-600
          transition-all duration-200
          hover:-translate-y-0.5 hover:bg-emerald-50 hover:text-emerald-700
          active:translate-y-0 active:scale-95
        "
      >
        <LocateFixed size={18} />
      </button>

      <span className="h-5 w-px bg-slate-200" />

      <button
        type="button"
        onClick={onRefresh}
        title="تحديث الخريطة"
        aria-label="تحديث الخريطة"
        className="
          flex h-9 w-9 items-center justify-center
          rounded-xl text-slate-600
          transition-all duration-200
          hover:-translate-y-0.5 hover:bg-emerald-50 hover:text-emerald-700
          active:translate-y-0 active:scale-95
        "
      >
        <RefreshCw size={18} />
      </button>
    </div>
  );
}