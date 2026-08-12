import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import { useEffect, useState } from "react";
import L from "leaflet";

import "leaflet-control-geocoder";
import "leaflet/dist/leaflet.css";

import fireIcon from "../../assets/markers/fire.svg";
import floodIcon from "../../assets/markers/flood.svg";
import medicalIcon from "../../assets/markers/medical.svg";
import criticalIcon from "../../assets/markers/critical.svg";
import shelterIcon from "../../assets/markers/shelter.svg";
import landslideIcon from "../../assets/markers/landslide.svg";
import drainageIcon from "../../assets/markers/drainage.svg";

import LayerControl from "./LayerControl";
import MapToolbar from "./MapToolbar";
import MapTypeSwitcher from "./MapTypeSwitcher";

import { emergencyReports } from "../../data/emergencyData";

const fireMarker = L.icon({
  iconUrl: fireIcon,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -30],
});

const floodMarker = L.icon({
  iconUrl: floodIcon,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -30],
});

const medicalMarker = L.icon({
  iconUrl: medicalIcon,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -30],
});

const criticalMarker = L.icon({
  iconUrl: criticalIcon,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -30],
});

const shelterMarker = L.icon({
  iconUrl: shelterIcon,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -30],
});

const landslideMarker = L.icon({
  iconUrl: landslideIcon,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -30],
});

const drainageMarker = L.icon({
  iconUrl: drainageIcon,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -30],
});

function getMarkerIcon(type: string) {
  switch (type) {
    case "Fire":
      return fireMarker;

    case "Flood":
      return floodMarker;

    case "Medical":
      return medicalMarker;

    case "Critical":
      return criticalMarker;

    case "Shelter":
      return shelterMarker;

    case "Landslide":
      return landslideMarker;

    case "Drainage":
      return drainageMarker;

    default:
      return new L.Icon.Default();
  }
}

function SearchControl() {
  const map = useMap();

  useEffect(() => {
    const geocoder = L.Control.Geocoder.nominatim();

    const control = L.Control.geocoder({
      query: "",
      placeholder: "ابحث عن موقع...",
      geocoder,
      defaultMarkGeocode: false,
      position: "topright",
    })
      .on("markgeocode", function (e: any) {
        const latlng = e.geocode.center;

        map.flyTo(latlng, 15, {
          duration: 1.5,
        });

        L.marker(latlng)
          .addTo(map)
          .bindPopup(e.geocode.name)
          .openPopup();
      })
      .addTo(map);

    return () => {
      map.removeControl(control);
    };
  }, [map]);

  return null;
}

type Props = {
  selectedReport: typeof emergencyReports[number] | null;

  setSelectedReport: React.Dispatch<
    React.SetStateAction<typeof emergencyReports[number] | null>
  >;
};
export default function EmergencyMap({
  selectedReport,
  setSelectedReport,
}: Props) {
  const [layers, setLayers] = useState({
    reports: true,
    operations: true,
  });

  const center: [number, number] = [24.47, 39.61];

  const [mapType, setMapType] = useState<"street" | "satellite">("street");

  const [mapRef, setMapRef] = useState<L.Map | null>(null);

  const goHome = () => {
    if (mapRef) {
      mapRef.flyTo(center, 12, {
        duration: 1.5,
      });
    }
  };

  const refreshMap = () => {
    window.location.reload();
  };

  return (
    <div
      className="
      bg-white
      rounded-2xl
      shadow-lg
      p-6
      border
      border-slate-200
    "
    >
      <h2
        className="
        text-2xl
        font-bold
        text-slate-800
        mb-5
      "
      >
        الخريطة التفاعلية للطوارئ
      </h2>

      <div
        className="
        rounded-xl
        overflow-hidden
        shadow-inner
      "
      >
        <div className="relative">
          <MapToolbar onRefresh={refreshMap} onHome={goHome} />

          <MapTypeSwitcher
            mapType={mapType}
            setMapType={setMapType}
          />

          <MapContainer
            whenCreated={setMapRef}
            center={center}
            zoom={12}
            style={{
              height: "600px",
              width: "100%",
            }}
          >
            <LayerControl setLayers={setLayers} />

            {mapType === "street" ? (
              <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
            ) : (
              <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
            )}

            <SearchControl />

            {layers.operations && (
              <Marker position={center}>
                <Popup>
                  <strong>مركز العمليات</strong>
                </Popup>
              </Marker>
            )}

            {layers.reports &&
  emergencyReports.map((report) => (
    <Marker
      key={report.id}
      position={[report.lat, report.lng]}
      icon={getMarkerIcon(report.type)}
      eventHandlers={{
        click: () => {
          setSelectedReport(report);
        },
      }}
    >
      <Popup>
        <div className="min-w-[220px]">
          <h3 className="font-bold text-lg mb-2">
            {report.title}
          </h3>

          <p>
            <strong>النوع:</strong> {report.type}
          </p>

          <p>
            <strong>الحالة:</strong> {report.status}
          </p>

          <p>
            <strong>الخطورة:</strong> {report.severity}
          </p>

          <p>
            <strong>الإحداثيات:</strong>
            <br />
            {report.lat}, {report.lng}
          </p>
        </div>
      </Popup>
    </Marker>
  ))}
            </MapContainer>
        </div>
      </div>
    </div>
  );
}