import { HashRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login/Login";
import Dashboard from "./features/dashboard/Dashboard";
import CriticalPoints from "./features/criticalPoints/CriticalPoints";
import Monitoring from "./features/monitoring/Monitoring";
import Alerts from "./features/alerts/Alerts";
import EarlyWarning from "./features/earlyWarning/EarlyWarning";
import Equipment from "./features/equipment/Equipment";
import Analytics from "./features/analytics/Analytics";
import QuickSend from "./features/quickSend/QuickSend";
import OperationsRoom from "./features/operationsRoom/OperationsRoom";
import Attendance from "./features/attendance/Attendance";

export default function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/operations-room" element={<OperationsRoom />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/critical-points" element={<CriticalPoints />} />
        <Route path="/monitoring" element={<Monitoring />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/early-warning" element={<EarlyWarning />} />
        <Route path="/equipment" element={<Equipment />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/quick-send" element={<QuickSend />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
