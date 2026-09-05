import { simulateNetwork, generateMockId } from "./mockNetwork";
import type {
  PlanStatus,
  PlanStatusChangeInput,
  PlanStatusEvent,
  Decision,
  AddDecisionInput,
  OperationsRoomKpis,
} from "../types/operationsRoom";

/**
 * طبقة خدمة غرفة العمليات.
 *
 * ⚠️ TODO (عند ربط الـ backend الحقيقي):
 * استبدل جسم كل دالة بنداء fetch/axios حقيقي لنفس التوقيع (signature)،
 * بدون ما تغيّر اسم الدالة ولا شكل القيمة المرجعة — هيك الصفحات يلي
 * بتستهلك هالخدمة ما بتحتاج أي تعديل.
 *
 * أمثلة على المسارات المتوقعة لاحقًا:
 *   GET   /api/operations-room/plan-status
 *   POST  /api/operations-room/plan-status/change
 *   GET   /api/operations-room/decisions
 *   POST  /api/operations-room/decisions
 *   GET   /api/operations-room/kpis
 */

let mockPlanStatus: PlanStatus = {
  currentLevel: "monitoring",
  escalationTier: 0,
  activeSince: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  lastChangedBy: "النظام",
  history: [
    {
      id: generateMockId("evt"),
      fromLevel: null,
      toLevel: "monitoring",
      reason: "بدء المناوبة اليومية - لا يوجد حدث نشط",
      changedBy: "النظام",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    },
  ],
};

let mockDecisions: Decision[] = [
  {
    id: generateMockId("dec"),
    source: "plan_status_change",
    summary: "بدء المناوبة اليومية - لا يوجد حدث نشط",
    actor: "النظام",
    timestamp: mockPlanStatus.activeSince,
    planLevelAtTime: "monitoring",
  },
];

/** يحسب المستوى التالي المنطقي بناءً على نوع الإجراء (تصعيد/خفض) */
function resolveNextLevel(
  action: "escalate" | "de_escalate",
  current: PlanStatus["currentLevel"]
): PlanStatus["currentLevel"] {
  if (action === "escalate") {
    if (current === "monitoring") return "activated";
    return "escalated";
  }
  // de_escalate
  if (current === "escalated") return "de_escalated";
  return "deactivated";
}

export const operationsRoomService = {
  async getPlanStatus(): Promise<PlanStatus> {
    return simulateNetwork(mockPlanStatus);
  },

  async changePlanStatus(input: PlanStatusChangeInput): Promise<PlanStatus> {
    const event: PlanStatusEvent = {
      id: generateMockId("evt"),
      fromLevel: mockPlanStatus.currentLevel,
      toLevel: input.toLevel,
      reason: input.reason,
      changedBy: input.changedBy,
      timestamp: new Date().toISOString(),
    };

    const isEscalationStep =
      input.toLevel === "activated" || input.toLevel === "escalated";

    mockPlanStatus = {
      currentLevel: input.toLevel,
      escalationTier: isEscalationStep
        ? mockPlanStatus.escalationTier + 1
        : 0,
      activeSince: event.timestamp,
      lastChangedBy: input.changedBy,
      history: [event, ...mockPlanStatus.history],
    };

    // كل تغيير حالة يُسجَّل تلقائيًا كقرار بارز في السجل
    await this.addDecision({
      summary: `تغيير حالة الخطة إلى: ${input.toLevel}`,
      details: input.reason,
      actor: input.changedBy,
    });

    return simulateNetwork(mockPlanStatus);
  },

  /** اختصار: تصعيد بمستوى واحد أعلى مع سبب إجباري */
  async escalate(reason: string, changedBy: string): Promise<PlanStatus> {
    const toLevel = resolveNextLevel("escalate", mockPlanStatus.currentLevel);
    return this.changePlanStatus({ toLevel, reason, changedBy });
  },

  /** اختصار: خفض تصعيد بمستوى واحد مع سبب إجباري */
  async deEscalate(reason: string, changedBy: string): Promise<PlanStatus> {
    const toLevel = resolveNextLevel(
      "de_escalate",
      mockPlanStatus.currentLevel
    );
    return this.changePlanStatus({ toLevel, reason, changedBy });
  },

  async getDecisionLog(): Promise<Decision[]> {
    return simulateNetwork(mockDecisions);
  },

  async addDecision(input: AddDecisionInput): Promise<Decision> {
    const decision: Decision = {
      id: generateMockId("dec"),
      source: "manual",
      summary: input.summary,
      details: input.details,
      actor: input.actor,
      timestamp: new Date().toISOString(),
      planLevelAtTime: mockPlanStatus.currentLevel,
    };

    mockDecisions = [decision, ...mockDecisions];
    return simulateNetwork(decision, 200);
  },

  async getKpis(): Promise<OperationsRoomKpis> {
    const escalationCount = mockPlanStatus.history.filter(
      (e) => e.toLevel === "escalated"
    ).length;

    const kpis: OperationsRoomKpis = {
      avgActivationTimeMinutes: 12,
      escalationCount,
      staffingComplianceDuringActivation: 87,
      decisionsLogged: mockDecisions.length,
      lastUpdated: new Date().toISOString(),
    };

    return simulateNetwork(kpis, 300);
  },
};
