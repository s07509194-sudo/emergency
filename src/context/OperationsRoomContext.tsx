import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { operationsRoomService } from "../services/operationsRoomService";
import type { PlanStatus } from "../types/operationsRoom";

/**
 * Context عام لحالة الخطة (Plan Status).
 *
 * ليش عام (global) ومش محصور بصفحة "غرفة العمليات" لحالها؟
 * لأنه أكثر من مكان بالتطبيق محتاج يعرف الحالة الحالية بشكل حي:
 * شارة الهيدر، صفحة الحضور والمناوبات (لحساب الجاهزية)، وأي صفحة
 * مستقبلية. توحيد المصدر هون بيمنع تضارب البيانات بين الشاشات.
 */

interface OperationsRoomContextValue {
  planStatus: PlanStatus | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
  escalate: (reason: string, changedBy: string) => Promise<void>;
  deEscalate: (reason: string, changedBy: string) => Promise<void>;
}

const OperationsRoomContext = createContext<OperationsRoomContextValue | null>(
  null
);

export function OperationsRoomProvider({ children }: { children: ReactNode }) {
  const [planStatus, setPlanStatus] = useState<PlanStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const status = await operationsRoomService.getPlanStatus();
    setPlanStatus(status);
    setIsLoading(false);
  }, []);

  const escalate = useCallback(async (reason: string, changedBy: string) => {
    const updated = await operationsRoomService.escalate(reason, changedBy);
    setPlanStatus(updated);
  }, []);

  const deEscalate = useCallback(async (reason: string, changedBy: string) => {
    const updated = await operationsRoomService.deEscalate(reason, changedBy);
    setPlanStatus(updated);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <OperationsRoomContext.Provider
      value={{ planStatus, isLoading, refresh, escalate, deEscalate }}
    >
      {children}
    </OperationsRoomContext.Provider>
  );
}

export function useOperationsRoom(): OperationsRoomContextValue {
  const ctx = useContext(OperationsRoomContext);
  if (!ctx) {
    throw new Error(
      "useOperationsRoom يجب أن يُستخدم داخل OperationsRoomProvider"
    );
  }
  return ctx;
}
