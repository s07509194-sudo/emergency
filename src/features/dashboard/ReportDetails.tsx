type Report = {
  id: number;
  title: string;
  type: string;
  status: string;
  severity: string;
  lat: number;
  lng: number;
};


type Props = {
  report: Report | null;
};



export default function ReportDetails({
  report,
}: Props) {



  const getSeverityStyle = (severity: string) => {

    switch (severity) {

      case "High":
      case "مرتفع":
        return {
          text: "مرتفع",
          color: "text-red-600",
          bg: "bg-red-100",
        };


      case "Medium":
      case "متوسط":
        return {
          text: "متوسط",
          color: "text-orange-600",
          bg: "bg-orange-100",
        };


      case "Low":
      case "منخفض":
        return {
          text: "منخفض",
          color: "text-green-600",
          bg: "bg-green-100",
        };


      default:
        return {
          text: severity,
          color: "text-slate-600",
          bg: "bg-slate-100",
        };

    }

  };




  if (!report) {

    return (

      <div
        className="
        bg-white
        rounded-xl
        shadow-lg
        p-5
        h-full
        border
        border-slate-200
        "
      >

        <h2 className="
          text-xl
          font-bold
          text-slate-800
          mb-4
        ">
          📋 تفاصيل البلاغ
        </h2>


        <p className="text-slate-500">
          اختر أي بلاغ من الخريطة لعرض التفاصيل.
        </p>


      </div>

    );

  }



  const severity = getSeverityStyle(
    report.severity
  );



  return (

    <div
      className="
      bg-white
      rounded-xl
      shadow-lg
      p-5
      h-full
      border
      border-slate-200
      "
    >


      <h2
        className="
        text-xl
        font-bold
        text-slate-800
        mb-5
        "
      >

        🚨 {report.title}

      </h2>




      <div className="space-y-4">



        <div>

          <p className="text-sm text-slate-500">
            نوع البلاغ
          </p>

          <p className="font-semibold text-slate-700">
            {report.type}
          </p>

        </div>





        <div>

          <p className="text-sm text-slate-500">
            حالة البلاغ
          </p>

          <p className="font-semibold text-slate-700">
            {report.status}
          </p>

        </div>





        <div>

          <p className="text-sm text-slate-500 mb-2">
            مستوى الخطورة
          </p>


          <span
            className={`
              px-4
              py-2
              rounded-full
              font-bold
              ${severity.color}
              ${severity.bg}
            `}
          >

            ⚠️ {severity.text}

          </span>


        </div>





        <div
          className="
          bg-slate-50
          rounded-lg
          p-3
          "
        >

          <p className="text-sm text-slate-500">
            الموقع
          </p>


          <p className="text-sm font-semibold">
            Latitude:
            {" "}
            {report.lat}
          </p>


          <p className="text-sm font-semibold">
            Longitude:
            {" "}
            {report.lng}
          </p>


        </div>



      </div>


    </div>

  );

}