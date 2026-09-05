import { useEffect, useState } from "react";
import logo from "../../../assets/logo.png";

import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  ZoomControl,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import type {
  Feature,
  FeatureCollection,
} from "geojson";

import { useGovernorateWeather } from "../hooks/useGovernorateWeather";
import { useRegionalWeather } from "../hooks/useRegionalWeather";

import {
  getWeatherCategory,
  type WeatherCategory,
} from "../utils/weatherCodes";


/* =========================================================
   لون المحافظة حسب كمية الأمطار
========================================================= */

function getRainColor(mm: number | null): string {
  if (mm === null) {
    return "#94a3b8";
  }

  if (mm >= 25) {
    return "#dc2626";
  }

  if (mm >= 10) {
    return "#f59e0b";
  }

  if (mm > 0) {
    return "#facc15";
  }

  return "#22c55e";
}


/* =========================================================
   وصف حالة المطر
========================================================= */

function getRainLabel(mm: number | null): string {
  if (mm === null) {
    return "غير متاح";
  }

  if (mm >= 25) {
    return "غزير";
  }

  if (mm >= 10) {
    return "متوسط";
  }

  if (mm > 0) {
    return "خفيف";
  }

  return "لا يوجد مطر";
}


/* =========================================================
   رموز الطقس
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
   Animation الخاصة بالطقس
========================================================= */

function getWeatherAnimationClass(
  category: WeatherCategory
): string {
  switch (category) {
    case "clear":
      return "weather-sun";

    case "partly-cloudy":
    case "cloudy":
      return "weather-cloud";

    case "fog":
      return "weather-fog";

    case "drizzle":
    case "rain":
      return "weather-rain";

    case "snow":
      return "weather-snow";

    case "storm":
      return "weather-storm";

    default:
      return "weather-symbol";
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
  const category =
    code !== null
      ? getWeatherCategory(code)
      : null;

  const emoji =
    category !== null
      ? CATEGORY_EMOJI[category]
      : "…";

  const animationClass =
    category !== null
      ? getWeatherAnimationClass(category)
      : "weather-symbol";

  const html = `
    <style>
      @keyframes weatherSunSpin {
        from {
          transform: rotate(0deg) scale(1);
        }
        to {
          transform: rotate(360deg) scale(1);
        }
      }

      @keyframes weatherPulse {
        0%, 100% {
          transform: scale(1);
          filter: brightness(1);
        }

        50% {
          transform: scale(1.18);
          filter: brightness(1.25);
        }
      }

      @keyframes weatherCloudFloat {
        0%, 100% {
          transform: translateX(-2px);
        }

        50% {
          transform: translateX(3px);
        }
      }

      @keyframes weatherFogMove {
        0%, 100% {
          transform: translateX(-3px);
          opacity: .75;
        }

        50% {
          transform: translateX(3px);
          opacity: 1;
        }
      }

      @keyframes weatherRainDrop {
        0%, 100% {
          transform: translateY(-2px);
        }

        50% {
          transform: translateY(4px);
        }
      }

      @keyframes weatherSnowFall {
        0%, 100% {
          transform: translateY(-3px) rotate(0deg);
        }

        50% {
          transform: translateY(4px) rotate(20deg);
        }
      }

      @keyframes weatherStormFlash {
        0%, 70%, 100% {
          transform: scale(1);
          filter: brightness(1);
        }

        75% {
          transform: scale(1.2);
          filter: brightness(1.8);
        }

        80% {
          transform: scale(1);
          filter: brightness(1);
        }
      }

      .weather-symbol {
        display: inline-block;
        transform-origin: center;
        line-height: 1;
      }

      .weather-sun {
        animation:
          weatherSunSpin 8s linear infinite,
          weatherPulse 2s ease-in-out infinite;
      }

      .weather-cloud {
        animation: weatherCloudFloat 2.5s ease-in-out infinite;
      }

      .weather-fog {
        animation: weatherFogMove 2s ease-in-out infinite;
      }

      .weather-rain {
        animation: weatherRainDrop .9s ease-in-out infinite;
      }

      .weather-snow {
        animation: weatherSnowFall 1.6s ease-in-out infinite;
      }

      .weather-storm {
        animation: weatherStormFlash 1.15s linear infinite;
      }

      @media (prefers-reduced-motion: reduce) {
        .weather-symbol {
          animation: none !important;
        }
      }
    </style>

    <div
      style="
        background:#ffffff;
        border-radius:12px;
        padding:4px 10px;
        box-shadow:0 2px 8px rgba(0,0,0,0.18);
        border:1px solid #e2e8f0;
        display:flex;
        flex-direction:column;
        align-items:center;
        font-family:inherit;
        min-width:64px;
      "
    >

      <div
        style="
          font-size:11px;
          font-weight:600;
          color:#334155;
          white-space:nowrap;
          margin-bottom:2px;
        "
      >
        ${name}
      </div>

      <div
        style="
          display:flex;
          align-items:center;
          gap:4px;
        "
      >

        <span
          class="weather-symbol ${animationClass}"
          style="font-size:20px;"
          title="${category ?? "حالة الطقس"}"
        >
          ${emoji}
        </span>

        <span
          style="
            font-size:13px;
            font-weight:700;
            color:#1e293b;
          "
        >
          ${temp ?? "--"}°
        </span>

      </div>

    </div>
  `;

  return L.divIcon({
    className: "regional-city-weather-icon",
    html,
    iconSize: [80, 44],
    iconAnchor: [40, 44],
  });
}


/* =========================================================
   Component
========================================================= */

export default function GovernoratesRainMap() {

  /* =======================================================
     بيانات طقس المحافظات
  ======================================================= */

  const {
    data,
    loading,
    error,
  } = useGovernorateWeather();


  /* =======================================================
     بيانات المدن
  ======================================================= */

  const {
    cities,
    loading: citiesLoading,
  } = useRegionalWeather();


  /* =======================================================
     GeoJSON
  ======================================================= */

  const [
    geoData,
    setGeoData,
  ] = useState<FeatureCollection | null>(null);


  const [
    geoLoading,
    setGeoLoading,
  ] = useState(true);


  const [
    geoError,
    setGeoError,
  ] = useState<string | null>(null);


  /* =======================================================
     تحميل حدود المحافظات
  ======================================================= */

  useEffect(() => {

    let isMounted = true;

    async function loadGeoJSON() {

      try {

        setGeoLoading(true);
        setGeoError(null);

        const url =
          `${import.meta.env.BASE_URL}data/madinah_governorates.geojson`;

        console.log(
          "Loading GeoJSON:",
          url
        );

        const res = await fetch(url);

        console.log(
          "GeoJSON status:",
          res.status
        );

        if (!res.ok) {
          throw new Error(
            `تعذر تحميل ملف حدود المحافظات (${res.status})`
          );
        }

        const text = await res.text();

        if (!text.trim()) {
          throw new Error(
            "ملف حدود المحافظات فارغ"
          );
        }

        let json: FeatureCollection;

        try {

          json = JSON.parse(text);

        } catch {

          throw new Error(
            "ملف حدود المحافظات ليس بصيغة GeoJSON صحيحة"
          );
        }

        if (
          !json ||
          json.type !== "FeatureCollection"
        ) {
          throw new Error(
            "ملف حدود المحافظات غير صالح"
          );
        }

        if (isMounted) {

          setGeoData(json);
          setGeoLoading(false);
          setGeoError(null);

        }

      } catch (err) {

        console.error(
          "GeoJSON Error:",
          err
        );

        if (isMounted) {

          setGeoLoading(false);

          setGeoError(
            err instanceof Error
              ? err.message
              : "تعذر تحميل حدود المحافظات"
          );

        }

      }

    }

    loadGeoJSON();

    return () => {
      isMounted = false;
    };

  }, []);


  /* =======================================================
     الواجهة
  ======================================================= */

  return (

    <div
      className="
        relative
        w-full
        max-w-[1400px]
        h-[780px]
        bg-white
        rounded-2xl
        shadow-lg
        overflow-hidden
      "
    >

      {/* =====================================================
          Header
      ===================================================== */}

      <div
        className="
          relative
          z-30
          isolate
          overflow-hidden
          px-5
          py-3
          border-b
          border-white/20
          bg-gradient-to-r
          from-[#087f73]
          via-[#0b9f91]
          to-[#16b8a7]
          shadow-md
        "
      >

        {/* Glass Overlay */}

        <div
          className="
            absolute
            inset-0
            bg-white/5
            backdrop-blur-sm
            pointer-events-none
          "
        />


        {/* إضاءة خلفية */}

        <div
          className="
            absolute
            -top-16
            right-1/4
            w-44
            h-44
            rounded-full
            bg-white/20
            blur-3xl
            pointer-events-none
          "
        />

        <div
          className="
            absolute
            -bottom-20
            left-10
            w-40
            h-40
            rounded-full
            bg-[#7de3d8]/20
            blur-3xl
            pointer-events-none
          "
        />


        {/* محتوى الهيدر */}

        <div
          className="
            relative
            z-10
            flex
            items-center
            justify-between
            gap-4
            flex-wrap
          "
        >

          {/* الشعار والعنوان */}

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                w-11
                h-11
                rounded-xl
                bg-white
                flex
                items-center
                justify-center
                shadow-md
                shrink-0
                overflow-hidden
              "
            >

              <img
                src={logo}
                alt="شعار أمانة المدينة المنورة"
                className="
                  w-9
                  h-9
                  object-contain
                "
              />

            </div>


            <div>

              <h4
                className="
                  text-base
                  font-bold
                  text-white
                  drop-shadow-sm
                "
              >
                خريطة الأمطار والمدن المجاورة
              </h4>

              <p
                className="
                  text-xs
                  text-white/80
                  mt-1
                "
              >
                متابعة الحالة المطرية وحالة الطقس بالمحافظات
              </p>

            </div>

          </div>


          {/* رمز الطقس */}

          <div
            className="
              w-10
              h-10
              rounded-full
              bg-white/15
              border
              border-white/20
              backdrop-blur-md
              flex
              items-center
              justify-center
              text-xl
              shadow-sm
            "
          >
            🌧️
          </div>

        </div>

      </div>


      {/* =====================================================
          Map
      ===================================================== */}

      <div
        className="
          relative
          z-0
          w-full
          h-[700px]
        "
      >

        {/* ===================================================
            Legend
        =================================================== */}

        <style>{`

          @keyframes legendGlassFloat {

            0%, 100% {
              transform: translateY(0);
            }

            50% {
              transform: translateY(-4px);
            }

          }

          @keyframes legendGlassShine {

            0% {
              transform:
                translateX(-130%)
                rotate(18deg);
            }

            55%, 100% {
              transform:
                translateX(160%)
                rotate(18deg);
            }

          }

          .rain-legend-glass {
            animation:
              legendGlassFloat
              4s
              ease-in-out
              infinite;
          }

          .rain-legend-glass::after {

            content: "";

            position: absolute;

            inset:
              -40%
              auto
              -40%
              -35%;

            width: 30%;

            background:
              linear-gradient(
                90deg,
                transparent,
                rgba(255,255,255,.38),
                transparent
              );

            transform:
              rotate(18deg);

            animation:
              legendGlassShine
              5s
              ease-in-out
              infinite;

            pointer-events: none;

          }

          @media (prefers-reduced-motion: reduce) {

            .rain-legend-glass,
            .rain-legend-glass::after {

              animation: none !important;

            }

          }

        `}</style>


        <div
          className="
            rain-legend-glass
            absolute
            bottom-5
            right-5
            z-[1000]
            w-[295px]
            overflow-hidden
            rounded-2xl
            border
            border-white/50
            bg-slate-900/55
            p-3
            text-white
            shadow-2xl
            backdrop-blur-xl
          "
          dir="rtl"
          aria-label="مفتاح ألوان كمية الأمطار"
        >

          <div
            className="
              relative
              z-10
              mb-2
              flex
              items-center
              justify-between
              border-b
              border-white/20
              pb-2
            "
          >

            <span
              className="
                text-xs
                font-bold
                tracking-wide
              "
            >
              كمية الأمطار
            </span>

            <span
              className="text-base"
              aria-hidden="true"
            >
              🌧️
            </span>

          </div>


          <div
            className="
              relative
              z-10
              grid
              grid-cols-2
              gap-x-3
              gap-y-2
              text-[16px]
              text-white/95
            "
          >

            <span
              className="
                flex
                items-center
                gap-1.5
              "
            >
              <span
                className="
                  h-2.5
                  w-2.5
                  rounded-full
                  bg-green-500
                  ring-1
                  ring-white/50
                "
              />
              لا يوجد
            </span>


            <span
              className="
                flex
                items-center
                gap-1.5
              "
            >
              <span
                className="
                  h-2.5
                  w-2.5
                  rounded-full
                  bg-yellow-400
                  ring-1
                  ring-white/50
                "
              />
              خفيف
            </span>


            <span
              className="
                flex
                items-center
                gap-1.5
              "
            >
              <span
                className="
                  h-2.5
                  w-2.5
                  rounded-full
                  bg-orange-500
                  ring-1
                  ring-white/50
                "
              />
              متوسط
            </span>


            <span
              className="
                flex
                items-center
                gap-1.5
              "
            >
              <span
                className="
                  h-2.5
                  w-2.5
                  rounded-full
                  bg-red-600
                  ring-1
                  ring-white/50
                "
              />
              غزير
            </span>

          </div>

        </div>


        {/* ===================================================
            Leaflet Map
            الخريطة تظهر دائمًا حتى لو فشل GeoJSON
        =================================================== */}

        <MapContainer
          center={[24.7, 39.5]}
          zoom={6.3}
          zoomControl={false}
          scrollWheelZoom={true}
          style={{
            height: "100%",
            width: "100%",
          }}
        >

          {/* Zoom */}

          <ZoomControl
            position="topleft"
          />


          {/* OpenStreetMap */}

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />


          {/* =================================================
              حدود المحافظات
          ================================================= */}

          {geoData && (

            <GeoJSON

              key={
                JSON.stringify(
                  data ?? {}
                )
              }

              data={geoData}

              style={(feature?: Feature) => {

                const name =
                  feature?.properties?.name as
                    | string
                    | undefined;

                const precip =
                  name
                    ? data?.[name]?.precipToday ?? null
                    : null;

                return {

                  fillColor:
                    getRainColor(
                      precip
                    ),

                  fillOpacity: 0.55,

                  color: "#ffffff",

                  weight: 1.5,

                };

              }}


              onEachFeature={(
                feature,
                layer
              ) => {

                const name =
                  feature?.properties?.name as
                    | string
                    | undefined;

                const gov =
                  name
                    ? data?.[name]
                    : undefined;


                /* Tooltip */

                layer.bindTooltip(

                  `
                    <div
                      style="
                        font-family:inherit;
                        text-align:center;
                        min-width:110px;
                      "
                    >

                      <div
                        style="
                          font-weight:700;
                          margin-bottom:2px;
                        "
                      >
                        ${name ?? ""}
                      </div>

                      <div
                        style="
                          font-size:12px;
                          color:#475569;
                        "
                      >

                        ${getRainLabel(
                          gov?.precipToday ?? null
                        )}

                        ·

                        ${
                          gov?.precipToday ?? "--"
                        }

                        مم

                      </div>

                    </div>
                  `,

                  {
                    sticky: true,
                    direction: "top",
                  }

                );


                /* Hover */

                layer.on(
                  "mouseover",
                  () => {

                    if (
                      "setStyle" in layer &&
                      typeof layer.setStyle ===
                        "function"
                    ) {

                      layer.setStyle({

                        fillOpacity: 0.8,

                        weight: 2,

                      });

                    }

                  }
                );


                layer.on(
                  "mouseout",
                  () => {

                    if (
                      "setStyle" in layer &&
                      typeof layer.setStyle ===
                        "function"
                    ) {

                      layer.setStyle({

                        fillOpacity: 0.55,

                        weight: 1.5,

                      });

                    }

                  }
                );

              }}

            />

          )}


          {/* =================================================
              المدن المجاورة
          ================================================= */}

          {cities.map((city) => (

            <Marker
              key={`${city.name}-${city.lat}-${city.lon}`}
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


        {/* ===================================================
            تحميل GeoJSON
        =================================================== */}

        {geoLoading && (

          <div
            className="
              absolute
              inset-0
              z-[900]
              flex
              items-center
              justify-center
              bg-white/40
              backdrop-blur-[1px]
              pointer-events-none
            "
          >

            <div
              className="
                flex
                flex-col
                items-center
                gap-2
                rounded-2xl
                bg-white/90
                px-6
                py-4
                shadow-lg
              "
            >

              <div
                className="
                  w-7
                  h-7
                  border-2
                  border-slate-300
                  border-t-[#0b9f91]
                  rounded-full
                  animate-spin
                "
              />

              <span
                className="
                  text-sm
                  text-slate-600
                "
              >
                جاري تحميل حدود المحافظات...
              </span>

            </div>

          </div>

        )}


        {/* ===================================================
            خطأ GeoJSON
            لا نخفي الخريطة
        =================================================== */}

        {geoError && !geoLoading && (

          <div
            className="
              absolute
              top-4
              right-4
              z-[1000]
              max-w-[340px]
              rounded-xl
              border
              border-red-200
              bg-red-50/95
              px-4
              py-3
              text-sm
              text-red-700
              shadow-lg
              backdrop-blur
            "
            dir="rtl"
          >

            <div
              className="
                font-bold
                mb-1
              "
            >
              تعذر تحميل حدود المحافظات
            </div>

            <div>
              {geoError}
            </div>

          </div>

        )}


        {/* ===================================================
            تحميل بيانات الطقس
        =================================================== */}

        {(loading || citiesLoading) && !geoLoading && (

          <div
            className="
              absolute
              top-4
              left-4
              z-[1000]
              rounded-xl
              bg-white/90
              px-4
              py-2
              text-xs
              text-slate-600
              shadow-lg
              backdrop-blur
            "
            dir="rtl"
          >

            جاري تحديث بيانات الطقس...
          </div>

        )}


        {/* ===================================================
            خطأ بيانات الطقس
            لا نخفي الخريطة
        =================================================== */}

        {error && !loading && (

          <div
            className="
              absolute
              top-4
              left-4
              z-[1000]
              max-w-[300px]
              rounded-xl
              border
              border-amber-200
              bg-amber-50/95
              px-4
              py-3
              text-xs
              text-amber-700
              shadow-lg
              backdrop-blur
            "
            dir="rtl"
          >

            تعذر تحديث بيانات طقس المحافظات:
            {" "}
            {error}

          </div>

        )}

      </div>

    </div>

  );
}