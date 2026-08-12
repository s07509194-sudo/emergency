import { useState } from "react";

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
      top-4
      left-4
      z-[1000]
      bg-white
      rounded-xl
      shadow-lg
      p-4
      w-52
      "
    >

      <h3 className="
        font-bold
        text-slate-700
        mb-3
      ">
        🗂️ طبقات الخريطة
      </h3>


      <label className="
        flex
        items-center
        gap-2
        mb-2
        text-sm
      ">

        <input
          type="checkbox"
          defaultChecked
          onChange={(e)=>{

            setLayers(prev=>({
              ...prev,
              reports:e.target.checked
            }));

          }}
        />

        🚨 البلاغات

      </label>



      <label className="
        flex
        items-center
        gap-2
        text-sm
      ">

        <input
          type="checkbox"
          defaultChecked
          onChange={(e)=>{

            setLayers(prev=>({
              ...prev,
              operations:e.target.checked
            }));

          }}
        />

        🏢  إدراة الطوارئ

      </label>


    </div>

  );
}