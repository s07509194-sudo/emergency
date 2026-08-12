import {
  RefreshCw,
  LocateFixed,
} from "lucide-react";

type Props = {
  onRefresh: () => void;
  onHome: () => void;
};

export default function MapToolbar({
  onRefresh,
  onHome,
}: Props) {
  return (
    <div
      className="
      absolute
      top-4
      right-4
      z-[1000]
      flex
      gap-2
      "
    >
      <button
        onClick={onRefresh}
        className="
        bg-white
        shadow-lg
        rounded-lg
        p-2
        hover:bg-slate-100
        "
        title="تحديث"
      >
        <RefreshCw size={20} />
      </button>

      <button
        onClick={onHome}
        className="
        bg-white
        shadow-lg
        rounded-lg
        p-2
        hover:bg-slate-100
        "
        title="مركز العمليات"
      >
        <LocateFixed size={20} />
      </button>
    </div>
  );
}