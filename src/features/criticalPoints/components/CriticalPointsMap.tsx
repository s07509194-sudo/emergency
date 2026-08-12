import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import type { CriticalPoint } from "../utils/readExcel";

// إصلاح مشكلة أيقونة Leaflet الافتراضية
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/**
 * يحدد لون النقطة حسب درجة الخطورة، بنفس منطق المطابقة
 * المستخدم في useCriticalPoints (يدعم عالية/عالي، منخفضة/منخفض).
 */
function getRiskColor(risk: string): string {
  const value = risk.trim();

  if (value.includes("عالي")) return "#ef4444"; // أحمر
  if (value.includes("متوسط")) return "#f59e0b"; // أصفر/برتقالي
  if (value.includes("منخفض")) return "#22c55e"; // أخضر

  return "#3b82f6"; // أزرق (احتياطي لو القيمة غير معروفة)
}

/**
 * ينشئ أيقونة Pin ملوّنة (SVG) حسب درجة الخطورة،
 * بدون الاعتماد على صور خارجية إضافية.
 */
function createRiskIcon(risk: string): L.DivIcon {
  const color = getRiskColor(risk);

  const svg = `
    <svg width="30" height="42" viewBox="0 0 30 42" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15 0C6.7 0 0 6.7 0 15c0 10.5 15 27 15 27s15-16.5 15-27C30 6.7 23.3 0 15 0z"
        fill="${color}"
        stroke="#ffffff"
        stroke-width="1.5"
      />
      <circle cx="15" cy="15" r="6" fill="#ffffff" />
    </svg>
  `;

  return L.divIcon({
    className: "",
    html: svg,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -38],
  });
}

interface CriticalPointsMapProps {
  points: CriticalPoint[];
  loading: boolean;
}

export default function CriticalPointsMap({ points, loading }: CriticalPointsMapProps) {
  return (
    <MapContainer
      center={[24.4709, 39.6122]}
      zoom={12}
      zoomControl={false}
      style={{
        height: "600px",
        width: "100%",
        borderRadius: "12px",
      }}
    >
      <ZoomControl position="topleft" />

      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {!loading &&
        points.map((point) => (
          <Marker
            key={point.id}
            position={[point.lat, point.lng]}
            icon={createRiskIcon(point.risk)}
          >
            <Popup>
              <div style={{ minWidth: 220 }}>
                <h3 style={{ marginBottom: 10 }}>
                  {point.problem}
                </h3>

                <hr />

                <p>
                  <strong>البلدية:</strong> {point.municipality}
                </p>

                <p>
                  <strong>الحي:</strong> {point.district}
                </p>

                <p>
                  <strong>درجة الخطورة:</strong> {point.risk}
                </p>

                <p>
                  <strong>الكود:</strong> {point.code}
                </p>

                <p>
                  <strong>Latitude:</strong> {point.lat}
                </p>

                <p>
                  <strong>Longitude:</strong> {point.lng}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}
