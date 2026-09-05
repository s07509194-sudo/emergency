import {
  MapContainer,
  TileLayer,
  Marker,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useRegionalWeather } from "../hooks/useRegionalWeather";
import {
  getWeatherCategory,
  type WeatherCategory,
} from "../utils/weatherCodes";

/* =========================================================
   Weather configuration
========================================================= */

const CATEGORY_EMOJI: Record<WeatherCategory, string> = {
  clear: "☀️",
  "partly-cloudy": "⛅",
  cloudy: "☁️",
  fog: "🌫️",
  drizzle: "🌦️",
  rain: "🌧️",
  snow: "❄️",
  storm: "⛈️",
};

/* =========================================================
   تحديد حركة الطقس حسب الحالة
========================================================= */

function getWeatherAnimation(category: WeatherCategory): string {
  switch (category) {
    case "clear":
      return "weather-sun";

    case "partly-cloudy":
      return "weather-partly";

    case "cloudy":
      return "weather-cloud";

    case "fog":
      return "weather-fog";

    case "drizzle":
      return "weather-drizzle";

    case "rain":
      return "weather-rain";

    case "snow":
      return "weather-snow";

    case "storm":
      return "weather-storm";

    default:
      return "weather-cloud";
  }
}

/* =========================================================
   إنشاء أيقونة المدينة
========================================================= */

function createCityIcon(
  name: string,
  temp: number | null,
  code: number | null
): L.DivIcon {
  const category: WeatherCategory =
    code !== null ? getWeatherCategory(code) : "cloudy";

  const emoji =
    code !== null
      ? CATEGORY_EMOJI[category]
      : "…";

  const animationClass =
    getWeatherAnimation(category);

  const html = `
    <div
      class="city-weather-marker ${animationClass}"
      title="${name}"
      aria-label="طقس ${name}"
    >

      <!-- اسم المدينة -->
      <div class="city-weather-name">
        ${name}
      </div>

      <!-- حالة الطقس ودرجة الحرارة -->
      <div class="city-weather-content">

        <div class="weather-icon">
          ${emoji}
        </div>

        <div class="weather-temp">
          ${temp ?? "--"}°
        </div>

      </div>

      <!-- =================================================
           قطرات المطر
      ================================================== -->

      ${
        category === "rain" ||
        category === "drizzle"
          ? `
            <div class="rain-effect">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          `
          : ""
      }

      <!-- =================================================
           الثلج
      ================================================== -->

      ${
        category === "snow"
          ? `
            <div class="snow-effect">
              <span>❄</span>
              <span>❄</span>
              <span>❄</span>
            </div>
          `
          : ""
      }

      <!-- =================================================
           البرق
      ================================================== -->

      ${
        category === "storm"
          ? `
            <div class="lightning-effect">
              ⚡
            </div>
          `
          : ""
      }

    </div>
  `;

  return L.divIcon({
    className: "regional-city-weather-icon",
    html,
    iconSize: [100, 65],
    iconAnchor: [50, 58],
  });
}

/* =========================================================
   Component
========================================================= */

export default function RegionalCitiesMap() {
  const {
    cities,
    loading,
    error,
  } = useRegionalWeather();

  /* =======================================================
     Error
  ======================================================= */

  if (error) {
    return (
      <div
        className="
          bg-red-50
          border
          border-red-200
          text-red-600
          rounded-2xl
          p-4
          text-sm
        "
      >
        تعذر تحميل خريطة المدن المجاورة: {error}
      </div>
    );
  }

  return (
    <div
      className="
        bg-white
        rounded-2xl
        shadow-lg
        overflow-hidden
      "
    >

      {/* =====================================================
          CSS الخاص بالخريطة والأنيميشن
      ===================================================== */}

      <style>
        {`

          /* =================================================
             Leaflet Marker
          ================================================= */

          .regional-city-weather-icon {
            background: transparent !important;
            border: none !important;
          }


          /* =================================================
             بطاقة المدينة
          ================================================= */

          .city-weather-marker {
            position: relative;

            min-width: 82px;
            min-height: 52px;

            padding: 5px 9px;

            background: rgba(255, 255, 255, 0.96);

            border-radius: 14px;

            border: 1px solid
              rgba(226, 232, 240, 0.95);

            box-shadow:
              0 4px 12px
              rgba(15, 23, 42, 0.14),

              0 1px 3px
              rgba(15, 23, 42, 0.08);

            display: flex;

            flex-direction: column;

            align-items: center;

            justify-content: center;

            font-family: inherit;

            cursor: pointer;

            transition:
              transform 0.25s ease,
              box-shadow 0.25s ease,
              border-color 0.25s ease;
          }


          /* =================================================
             Hover
          ================================================= */

          .city-weather-marker:hover {
            transform:
              scale(1.12)
              translateY(-4px);

            box-shadow:
              0 8px 20px
              rgba(15, 23, 42, 0.22);

            border-color: #94a3b8;

            z-index: 9999;
          }


          /* =================================================
             اسم المدينة
          ================================================= */

          .city-weather-name {
            font-size: 10px;

            font-weight: 700;

            color: #334155;

            white-space: nowrap;

            margin-bottom: 2px;

            line-height: 1.1;
          }


          /* =================================================
             محتوى الطقس
          ================================================= */

          .city-weather-content {
            display: flex;

            align-items: center;

            justify-content: center;

            gap: 5px;
          }


          /* =================================================
             أيقونة الطقس
          ================================================= */

          .weather-icon {
            font-size: 20px;

            line-height: 1;

            display: inline-flex;

            align-items: center;

            justify-content: center;

            transform-origin: center;
          }


          /* =================================================
             درجة الحرارة
          ================================================= */

          .weather-temp {
            font-size: 13px;

            font-weight: 800;

            color: #1e293b;

            line-height: 1;
          }


          /* =================================================
             ☀️ الشمس
          ================================================= */

          .weather-sun .weather-icon {
            animation:
              sunRotate 7s linear infinite,
              sunPulse 2s ease-in-out infinite;
          }

          @keyframes sunRotate {

            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }

          }


          @keyframes sunPulse {

            0%,
            100% {
              filter:
                drop-shadow(
                  0 0 2px
                  rgba(251, 191, 36, 0.2)
                );
            }

            50% {
              filter:
                drop-shadow(
                  0 0 8px
                  rgba(251, 191, 36, 0.8)
                );
            }

          }


          /* =================================================
             ⛅ غائم جزئياً
          ================================================= */

          .weather-partly .weather-icon {
            animation:
              partlyCloud
              3s
              ease-in-out
              infinite;
          }


          @keyframes partlyCloud {

            0%,
            100% {
              transform: translateX(0);
            }

            50% {
              transform: translateX(5px);
            }

          }


          /* =================================================
             ☁️ السحب
          ================================================= */

          .weather-cloud .weather-icon {
            animation:
              cloudMove
              3.5s
              ease-in-out
              infinite;
          }


          @keyframes cloudMove {

            0%,
            100% {
              transform: translateX(-3px);
            }

            50% {
              transform: translateX(4px);
            }

          }


          /* =================================================
             🌫️ الضباب
          ================================================= */

          .weather-fog .weather-icon {
            animation:
              fogMove
              4s
              ease-in-out
              infinite;

            opacity: 0.75;
          }


          @keyframes fogMove {

            0%,
            100% {
              transform:
                translateX(-3px);

              opacity: 0.55;
            }

            50% {
              transform:
                translateX(4px);

              opacity: 1;
            }

          }


          /* =================================================
             🌦️ الرذاذ
          ================================================= */

          .weather-drizzle .weather-icon {
            animation:
              drizzleShake
              1.8s
              ease-in-out
              infinite;
          }


          @keyframes drizzleShake {

            0%,
            100% {
              transform:
                translateY(0);
            }

            50% {
              transform:
                translateY(3px);
            }

          }


          /* =================================================
             🌧️ المطر
          ================================================= */

          .weather-rain .weather-icon {
            animation:
              rainCloud
              2s
              ease-in-out
              infinite;
          }


          @keyframes rainCloud {

            0%,
            100% {
              transform:
                translateY(0);
            }

            50% {
              transform:
                translateY(-3px);
            }

          }


          /* =================================================
             قطرات المطر
          ================================================= */

          .rain-effect {
            position: absolute;

            left: 18px;

            right: 18px;

            bottom: -5px;

            height: 15px;

            pointer-events: none;
          }


          .rain-effect span {
            position: absolute;

            width: 2px;

            height: 7px;

            background: #38bdf8;

            border-radius: 999px;

            opacity: 0;

            animation:
              rainDrop
              1s
              linear
              infinite;
          }


          .rain-effect span:nth-child(1) {
            left: 10%;
            animation-delay: 0s;
          }

          .rain-effect span:nth-child(2) {
            left: 30%;
            animation-delay: 0.2s;
          }

          .rain-effect span:nth-child(3) {
            left: 50%;
            animation-delay: 0.4s;
          }

          .rain-effect span:nth-child(4) {
            left: 70%;
            animation-delay: 0.1s;
          }

          .rain-effect span:nth-child(5) {
            left: 90%;
            animation-delay: 0.35s;
          }


          @keyframes rainDrop {

            0% {
              transform:
                translateY(-4px);

              opacity: 0;
            }

            30% {
              opacity: 1;
            }

            100% {
              transform:
                translateY(12px);

              opacity: 0;
            }

          }


          /* =================================================
             ❄️ الثلج
          ================================================= */

          .weather-snow .weather-icon {
            animation:
              snowCloud
              2.5s
              ease-in-out
              infinite;
          }


          @keyframes snowCloud {

            0%,
            100% {
              transform:
                translateX(-3px);
            }

            50% {
              transform:
                translateX(3px);
            }

          }


          .snow-effect {
            position: absolute;

            top: 35px;

            width: 55px;

            pointer-events: none;
          }


          .snow-effect span {
            position: absolute;

            font-size: 8px;

            color: #38bdf8;

            opacity: 0;

            animation:
              snowFall
              2.5s
              linear
              infinite;
          }


          .snow-effect span:nth-child(1) {
            left: 10px;
            animation-delay: 0s;
          }

          .snow-effect span:nth-child(2) {
            left: 25px;
            animation-delay: 0.8s;
          }

          .snow-effect span:nth-child(3) {
            left: 40px;
            animation-delay: 1.4s;
          }


          @keyframes snowFall {

            0% {
              transform:
                translateY(-4px)
                translateX(0);

              opacity: 0;
            }

            25% {
              opacity: 1;
            }

            100% {
              transform:
                translateY(16px)
                translateX(6px);

              opacity: 0;
            }

          }


          /* =================================================
             ⛈️ العاصفة
          ================================================= */

          .weather-storm .weather-icon {
            animation:
              stormShake
              1.5s
              ease-in-out
              infinite;
          }


          @keyframes stormShake {

            0%,
            100% {
              transform:
                translateX(0);
            }

            20% {
              transform:
                translateX(-2px);
            }

            40% {
              transform:
                translateX(2px);
            }

            60% {
              transform:
                translateX(-2px);
            }

            80% {
              transform:
                translateX(2px);
            }

          }


          /* =================================================
             ⚡ البرق
          ================================================= */

          .lightning-effect {
            position: absolute;

            top: 21px;

            right: 17px;

            font-size: 11px;

            opacity: 0;

            animation:
              lightningFlash
              3s
              infinite;
          }


          @keyframes lightningFlash {

            0%,
            70%,
            100% {
              opacity: 0;
            }

            72% {
              opacity: 1;

              transform:
                scale(1.3);
            }

            74% {
              opacity: 0;
            }

            76% {
              opacity: 1;
            }

            78% {
              opacity: 0;
            }

          }


          /* =================================================
             تقليل الحركة
          ================================================= */

          @media (
            prefers-reduced-motion: reduce
          ) {

            .city-weather-marker,
            .weather-icon,
            .rain-effect span,
            .snow-effect span,
            .lightning-effect {
              animation: none !important;
            }

          }

        `}
      </style>


      {/* =====================================================
          Header - Glassmorphism
      ===================================================== */}

      <div
        className="
          relative
          overflow-hidden
          px-5
          py-4

          border-b
          border-white/20

          bg-gradient-to-r
          from-[#267466]
          via-[#2e8574]
          to-[#2d8373]/80

          backdrop-blur-xl
        "
      >

        {/* Glass overlay */}

        <div
          className="
            absolute
            inset-0

            bg-white/10

            backdrop-blur-md

            pointer-events-none
          "
        />


        {/* Glass light */}

        <div
          className="
            absolute

            -top-12
            right-1/4

            w-40
            h-40

            rounded-full

            bg-white/20

            blur-3xl

            pointer-events-none
          "
        />


        {/* Header content */}

        <div
          className="
            relative
            z-10
          "
        >

          <h4
            className="
              text-base
              font-bold
              text-white
              drop-shadow-sm
            "
          >
            المدن المجاورة
          </h4>


          <p
            className="
              text-xs
              text-white/80
              mt-1
            "
          >
            حالة الطقس الحالية للمدن المحيطة
          </p>

        </div>

      </div>


      {/* =====================================================
          Map
      ===================================================== */}

      <div className="relative">

        {/* ===================================================
            Loading
        =================================================== */}

        {loading && (

          <div
            className="
              absolute
              inset-0

              bg-white/70

              backdrop-blur-[1px]

              flex
              items-center
              justify-center

              z-[1000]

              text-sm
              text-slate-500
            "
          >

            <div
              className="
                flex
                flex-col
                items-center
                gap-2
              "
            >

              <div
                className="
                  w-7
                  h-7

                  border-2

                  border-slate-300
                  border-t-blue-500

                  rounded-full

                  animate-spin
                "
              />

              <span>
                جاري تحميل بيانات المدن...
              </span>

            </div>

          </div>

        )}


        {/* ===================================================
            Leaflet Map
        =================================================== */}

        <MapContainer
          center={[24.9, 39.2]}
          zoom={6}

          /* مهم: نوقف Zoom الافتراضي */
          zoomControl={false}

          scrollWheelZoom={false}

          style={{
            height: "850px",
            width: "100%",
          }}
        >

          {/* =================================================
              Zoom In / Zoom Out
          ================================================= */}

          <ZoomControl
            position="topright"
          />


          {/* =================================================
              OpenStreetMap
          ================================================= */}

          <TileLayer
            attribution="
              &copy; OpenStreetMap contributors
            "
            url="
              https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
            "
          />


          {/* =================================================
              Cities
          ================================================= */}

          {cities.map((city) => (

            <Marker
              key={city.name}

              position={[
                city.lat,
                city.lon,
              ]}

              icon={createCityIcon(
                city.name,
                city.temp,
                city.code
              )}
            />

          ))}

        </MapContainer>

      </div>

    </div>
  );
}