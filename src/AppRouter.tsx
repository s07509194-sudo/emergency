import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import Dashboard from "./features/dashboard/Dashboard";
import CriticalPoints from "./features/criticalPoints/CriticalPoints";
import Monitoring from "./features/monitoring/Monitoring";
import Alerts from "./features/alerts/Alerts";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        {/* صفحة النقاط الحرجة */}
        <Route
          path="/critical-points"
          element={<CriticalPoints />}
        />

        {/* صفحة الرصد */}
        <Route
          path="/monitoring"
          element={<Monitoring />}
        />

        {/* صفحة التنبيهات */}
        <Route
          path="/alerts"
          element={<Alerts />}
        />
      </Routes>
    </BrowserRouter>
  );
}