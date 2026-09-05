import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css";
import { LocateFixed, Navigation } from "lucide-react";
import { useEffect } from "react";
import type { SensorPoint } from "../utils/readSensors";
import RoutingControl from "./RoutingControl";

// أيقونة نقطة زرقاء صغيرة لكل مستشعر منفرد (بدون تجميع)
const sensorIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      background:#0ea5e9;
      width:14px;height:14px;
      border-radius:50%;
      border:2px solid #a8e7dd;
      box-shadow:0 0 0 3px rgba(30, 119, 112, 0.35);
    "></div>
  `,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

// أيقونة النقطة المختارة (من الخريطة أو من الليست)
const selectedIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      background:#dc2626;
      width:20px;height:20px;
      border-radius:50%;
      border:3px solid #ffffff;
      box-shadow:0 0 0 4px rgba(220,38,38,0.35);
    "></div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// أيقونة موقعي الحالي
const myLocationIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      background:#16a34a;
      width:18px;height:18px;
      border-radius:50%;
      border:3px solid #ca52e2;
      box-shadow:0 0 0 6px rgba(117, 87, 224, 0.3);
    "></div>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

/** يحرّك الخريطة تلقائيًا لمكان المستشعر المختار من الليست */
function FlyToSelected({ sensor }: { sensor: SensorPoint | null }) {
  const map = useMap();

  useEffect(() => {
    if (sensor) {
      map.flyTo([sensor.lat, sensor.lng], Math.max(map.getZoom(), 15), { duration: 0.8 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sensor?.id]);

  return null;
}

interface SensorsClusterMapProps {
  sensors: SensorPoint[];
  loading: boolean;
  selectedSensor: SensorPoint | null;
  onSelectSensor: (sensor: SensorPoint) => void;
}

export default function SensorsClusterMap({
  sensors,
  loading,
  selectedSensor,
  onSelectSensor,
}: SensorsClusterMapProps) {
  const [myLocation, setMyLocation] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distanceKm: number; durationMin: number } | null>(null);

  function handleLocateMe() {
    if (!navigator.geolocation) {
      setLocationError("المتصفح لا يدعم تحديد الموقع");
      return;
    }

    setLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMyLocation([pos.coords.latitude, pos.coords.longitude]);
        setLocating(false);
      },
      () => {
        setLocationError("تعذر الوصول لموقعك. تأكد من تفعيل صلاحية الموقع للمتصفح");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden relative">

      {/* شريط التحكم بالموقع والمسار */}
      <div className="flex flex-wrap items-center gap-3 px-5 py-3
  bg-gradient-to-r from-emerald-100/20 via-emerald-900/30 to-emerald-950/55
  backdrop-blur-xl
  border-b border-white/40
  shadow-md">
        <button
          onClick={handleLocateMe}
          disabled={locating}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-lg px-3 py-2 text-sm font-semibold transition"
        >
          <LocateFixed size={16} className={locating ? "animate-pulse" : ""} />
          {locating ? "جاري تحديد الموقع..." : "تحديد موقعي"}
        </button>

        {myLocation && !selectedSensor && (
          <span className="text-xs text-slate-500">اضغط على أي مستشعر بالخريطة أو الليست لرسم المسار إليه</span>
        )}

        {selectedSensor && (
          <div className="flex items-center gap-2 bg-sky-50 border border-sky-200 rounded-lg px-3 py-2 text-sm">
            <Navigation size={14} className="text-sky-600" />
            <span className="text-slate-700 font-medium">{selectedSensor.code}</span>
            {myLocation && routeInfo && (
              <span className="text-slate-500">
                — {routeInfo.distanceKm} كم · {routeInfo.durationMin} دقيقة
              </span>
            )}
          </div>
        )}

        {locationError && <span className="text-xs text-red-500">{locationError}</span>}
      </div>

      <div className="relative">
        {loading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-[1000] text-sm text-slate-500">
            جاري تحميل بيانات المستشعرات...
          </div>
        )}

        <MapContainer
          center={[24.4709, 39.6122]}
          zoom={12}
          zoomControl={false}
          style={{ height: "900px", width: "100%" }}
        >
          <ZoomControl position="topleft" />

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MarkerClusterGroup chunkedLoading maxClusterRadius={70}>
            {sensors.map((s) => (
              <Marker
                key={s.id}
                position={[s.lat, s.lng]}
                icon={selectedSensor?.id === s.id ? selectedIcon : sensorIcon}
                eventHandlers={{
                  click: () => {
                    onSelectSensor(s);
                    setRouteInfo(null);
                  },
                }}
              >
                <Popup>
                  <div style={{ minWidth: 200 }}>
                    <h3 style={{ marginBottom: 8 }}>{s.code}</h3>
                    <hr />
                    <p><strong>المحافظة:</strong> {s.governorate}</p>
                    <p><strong>الحالة:</strong> {s.status}</p>
                    <p><strong>Latitude:</strong> {s.lat}</p>
                    <p><strong>Longitude:</strong> {s.lng}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>

          {myLocation && (
            <Marker position={myLocation} icon={myLocationIcon}>
              <Popup>موقعك الحالي</Popup>
            </Marker>
          )}

          {myLocation && selectedSensor && (
            <RoutingControl
              from={myLocation}
              to={[selectedSensor.lat, selectedSensor.lng]}
              onRouteFound={setRouteInfo}
            />
          )}

          <FlyToSelected sensor={selectedSensor} />
        </MapContainer>
      </div>
    </div>
  );
}
