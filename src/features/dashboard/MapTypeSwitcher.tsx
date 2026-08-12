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
      top-20
      right-4
      z-[1000]
      bg-white
      rounded-xl
      shadow-lg
      p-3
      "
    >
      <p className="text-sm font-semibold mb-2">
        نوع الخريطة
      </p>

      <button
        className={`
          w-full
          mb-2
          rounded-lg
          p-2
          ${
            mapType === "street"
              ? "bg-blue-600 text-white"
              : "bg-slate-100"
          }
        `}
        onClick={() => setMapType("street")}
      >
        🗺️ Street
      </button>

      <button
        className={`
          w-full
          rounded-lg
          p-2
          ${
            mapType === "satellite"
              ? "bg-blue-600 text-white"
              : "bg-slate-100"
          }
        `}
        onClick={() => setMapType("satellite")}
      >
        🛰️ Satellite
      </button>
    </div>
  );
}