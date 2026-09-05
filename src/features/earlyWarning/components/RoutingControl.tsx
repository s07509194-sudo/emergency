import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

interface RoutingControlProps {
  from: [number, number] | null;
  to: [number, number] | null;
  onRouteFound?: (info: { distanceKm: number; durationMin: number }) => void;
}

export default function RoutingControl({ from, to, onRouteFound }: RoutingControlProps) {
  const map = useMap();

  useEffect(() => {
    if (!from || !to) return;

    const control = (L as any).Routing.control({
      waypoints: [L.latLng(from[0], from[1]), L.latLng(to[0], to[1])],
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      createMarker: () => null, // بنستخدم أيقوناتنا الخاصة بدل ما تعمل المكتبة ماركرز جديدة
      lineOptions: {
        styles: [{ color: "#0ea5e9", weight: 5, opacity: 0.85 }],
      },
    }).addTo(map);

    // إخفاء لوحة التعليمات الافتراضية بتاعة المكتبة (إنجليزي مش متناسق مع تصميمنا)
    // وعرض بياناتنا العربية الخاصة بدل منها
    const container = control.getContainer?.();
    if (container) container.style.display = "none";

    control.on("routesfound", (e: any) => {
      const summary = e.routes?.[0]?.summary;
      if (summary && onRouteFound) {
        onRouteFound({
          distanceKm: Math.round((summary.totalDistance / 1000) * 10) / 10,
          durationMin: Math.round(summary.totalTime / 60),
        });
      }
    });

    return () => {
      map.removeControl(control);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from?.[0], from?.[1], to?.[0], to?.[1], map]);

  return null;
}
