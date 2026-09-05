import MainLayout from "../../components/layout/MainLayout";
import LiveStreamCard from "./components/LiveStreamCard";
import WeatherWidget from "./components/WeatherWidget";
import GovernoratesRainMap from "./components/GovernoratesRainMap";
import DigitalClock from "./components/DigitalClock";
import CalendarWidget from "./components/CalendarWidget";

export default function Monitoring() {
  return (
    <MainLayout>
      <div className="min-h-screen w-full bg-slate-100 p-3 sm:p-4 lg:p-6">
        
        {/* =====================================================
            عنوان الصفحة
        ===================================================== */}
        <div className="mb-4 sm:mb-5 lg:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            الرصد
          </h1>

          <p className="mt-1.5 text-sm sm:text-base text-slate-500">
            متابعة مباشرة للأخبار، حالة الطقس، وأحدث البلاغات الواردة.
          </p>
        </div>


        {/* =====================================================
            التخطيط الرئيسي

            Mobile:
            1 column

            Tablet:
            1 column

            Desktop:
            12 columns
            Left  = 8
            Right = 4

            2XL:
            نترك مساحة أفضل للمكونات الكبيرة
        ===================================================== */}
        <div
          className="
            grid
            grid-cols-1
            gap-4
            lg:gap-5
            2xl:gap-6
            xl:grid-cols-12
            items-stretch
            w-full
            min-w-0
          "
        >

          {/* ===================================================
              العمود الأيسر
          =================================================== */}
          <section
            className="
              xl:col-span-8
              w-full
              min-w-0
              h-full
            "
          >
            <div
              className="
                w-full
                h-full
                min-w-0
                rounded-2xl
                sm:rounded-3xl
                p-3
                sm:p-4
                lg:p-5
                bg-gradient-to-br
                from-emerald-500/15
                via-teal-500/10
                to-teal-900/15
                backdrop-blur-xl
                border
                border-white/50
                shadow-xl
                flex
                flex-col
              "
            >

              {/* =================================================
                  الخريطة
              ================================================= */}
              <div className="w-full min-w-0 overflow-hidden rounded-xl sm:rounded-2xl">
                <GovernoratesRainMap />
              </div>


              {/* =================================================
                  الحالة الجوية
              ================================================= */}
              <div className="mt-5 sm:mt-6 w-full min-w-0">
                <h2
                  className="
                    mb-3
                    text-base
                    sm:text-lg
                    font-bold
                    text-slate-700
                  "
                >
                  🌤️ الحالة الجوية
                </h2>

                <div
                  className="
                    w-full
                    min-w-0
                    max-w-full
                    overflow-hidden
                    rounded-xl
                    sm:rounded-2xl
                  "
                >
                  <WeatherWidget />
                </div>
              </div>

            </div>
          </section>


          {/* ===================================================
              العمود الأيمن
          =================================================== */}
          <aside
            className="
              xl:col-span-4
              w-full
              min-w-0
              h-full
            "
          >
            <div
              className="
                w-full
                h-full
                min-w-0
                rounded-2xl
                sm:rounded-3xl
                p-3
                sm:p-4
                lg:p-5
                bg-gradient-to-br
                from-emerald-500/15
                via-teal-500/10
                to-teal-900/15
                backdrop-blur-xl
                border
                border-white/50
                shadow-xl
                flex
                flex-col
              "
            >

              {/* =================================================
                  الرصد الإعلامي
              ================================================= */}
              <section className="w-full min-w-0">

                <h2
                  className="
                    mb-3
                    text-base
                    sm:text-lg
                    font-bold
                    text-slate-700
                  "
                >
                  📡 الرصد الإعلامي
                </h2>

                <div className="grid w-full min-w-0 grid-cols-1 gap-4">

                  <div className="w-full min-w-0 overflow-hidden">
                    <LiveStreamCard
                      channelName="قناة الحدث"
                      title="البث المباشر لقناة الحدث"
                      videoId="-EEHXzLNS6o"
                    />
                  </div>

                  <div className="w-full min-w-0 overflow-hidden">
                    <LiveStreamCard
                      channelName="القناة الإخبارية"
                      title="البث المباشر | القناة الإخبارية"
                      videoId="yYJjtr3fbZE"
                    />
                  </div>

                </div>
              </section>


              {/* =================================================
                  الساعة الرقمية
              ================================================= */}
              <section className="mt-5 sm:mt-6 w-full min-w-0">
                <DigitalClock />
              </section>

              {/* =================================================
                  التقويم (هجري / ميلادي)
              ================================================= */}
              <section className="mt-5 sm:mt-6 w-full min-w-0">
                <CalendarWidget />
              </section>

            </div>
          </aside>

        </div>
      </div>
    </MainLayout>
  );
}
