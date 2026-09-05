type Props = {
  mapType: "street" | "satellite";
  setMapType: React.Dispatch<
    React.SetStateAction<"street" | "satellite">
  >;
};

export default function MapTypeSwitcher({
  mapType,
  setMapType,
}: Props) {
  return (
    <div
      className="
        absolute
        top-14
        sm:top-16
        lg:top-20
        right-2
        sm:right-3
        lg:right-4
        z-[1000]
        bg-white/95
        backdrop-blur-md
        rounded-lg
        sm:rounded-xl
        shadow-lg
        p-2
        sm:p-3
        w-32
        sm:w-36
        lg:w-40
      "
    >
      <p
        className="
          text-xs
          sm:text-sm
          font-semibold
          mb-1.5
          sm:mb-2
          text-slate-700
        "
      >
        نوع الخريطة
      </p>

      <button
        type="button"
        className={`
          w-full
          mb-1.5
          sm:mb-2
          rounded-lg
          px-2
          py-1.5
          sm:p-2
          text-xs
          sm:text-sm
          transition-all
          active:scale-95
          ${
            mapType === "street"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }
        `}
        onClick={() => setMapType("street")}
      >
        🗺️ Street
      </button>

      <button
        type="button"
        className={`
          w-full
          rounded-lg
          px-2
          py-1.5
          sm:p-2
          text-xs
          sm:text-sm
          transition-all
          active:scale-95
          ${
            mapType === "satellite"
              ? "bg-blue-600 text-white shadow-md"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }
        `}
        onClick={() => setMapType("satellite")}
      >
        🛰️ Satellite
      </button>
    </div>
  );
}