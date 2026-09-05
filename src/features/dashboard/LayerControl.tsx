type Props = {
  setLayers: React.Dispatch<
    React.SetStateAction<{
      reports: boolean;
      operations: boolean;
    }>
  >;
};

export default function LayerControl({ setLayers }: Props) {
  return (
    <div
      className="
        absolute
        top-2
        left-2
        sm:top-3
        sm:left-3
        lg:top-4
        lg:left-4
        z-[1000]
        bg-white/95
        backdrop-blur-md
        rounded-lg
        sm:rounded-xl
        shadow-lg
        p-2.5
        sm:p-3
        lg:p-4
        w-36
        sm:w-44
        lg:w-52
      "
    >
      <h3
        className="
          font-bold
          text-slate-700
          text-xs
          sm:text-sm
          lg:text-base
          mb-2
          sm:mb-3
        "
      >
        🗂️ طبقات الخريطة
      </h3>

      {/* البلاغات */}
      <label
        className="
          flex
          items-center
          gap-1.5
          sm:gap-2
          mb-2
          text-xs
          sm:text-sm
          text-slate-700
          cursor-pointer
          select-none
        "
      >
        <input
          type="checkbox"
          defaultChecked
          className="
            w-3.5
            h-3.5
            sm:w-4
            sm:h-4
            accent-emerald-600
            cursor-pointer
            shrink-0
          "
          onChange={(e) => {
            setLayers((prev) => ({
              ...prev,
              reports: e.target.checked,
            }));
          }}
        />

        <span>🚨 البلاغات</span>
      </label>

      {/* إدارة الطوارئ */}
      <label
        className="
          flex
          items-center
          gap-1.5
          sm:gap-2
          text-xs
          sm:text-sm
          text-slate-700
          cursor-pointer
          select-none
        "
      >
        <input
          type="checkbox"
          defaultChecked
          className="
            w-3.5
            h-3.5
            sm:w-4
            sm:h-4
            accent-emerald-600
            cursor-pointer
            shrink-0
          "
          onChange={(e) => {
            setLayers((prev) => ({
              ...prev,
              operations: e.target.checked,
            }));
          }}
        />

        <span>🏢 إدارة الطوارئ</span>
      </label>
    </div>
  );
}