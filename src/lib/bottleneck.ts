/**
 * bottleneck.ts
 *
 * 採用ファネルのボトルネックを優先順位付きで診断する。
 *
 * 分析対象の応募が 0 件の場合は、いずれの判定も意味を持たないため
 * 判定を一切行わず空配列を返す（呼び出し側で「分析対象データなし」を表示する）。
 *
 * 判定順序（優先度が高い順に評価し、該当したものを上から積み上げて返す）:
 *   1. 応募不足（応募が1件以上ある場合のみ判定）
 *   2. 有効応募率低下
 *   3. 書類通過率低下
 *   4. 一次面接化率低下
 *   5. 一次面接通過率低下
 *   6. 最終面接通過率低下
 *   7. 内定承諾率低下（承諾率）
 *   8. 入社率低下
 *   9. 長期停滞（応募から一定日数を超えて未決着）
 *   10. 評価未入力（面接実施済みだが評価レコードが無い）
 *
 * 「11. 次回対応期限超過」は、現在のデータモデルに次回対応の期限日を保持する
 * フィールドが存在しないため算出不可能。ダミー判定はせず、常に非該当として扱う
 * （将来 evaluations に deadline 的なフィールドが追加された場合に実装する）。
 */

import type { Application, Evaluation, Interview } from "@/lib/mockData";
import type { FunnelCounts, FunnelKpis } from "@/lib/funnel";

// ─────────────────────────────────────────
// 閾値定数（一箇所にまとめ、後から変更できるようにする）
// ─────────────────────────────────────────

export const BOTTLENECK_THRESHOLDS = {
  /** 応募不足とみなす応募数の下限 */
  minApplications: 5,
  /** 有効応募率の目標値（%） */
  validApplicationRate: 50,
  /** 書類通過率の目標値（%） */
  documentPassRate: 30,
  /** 一次面接化率の目標値（%） */
  firstInterviewRate: 40,
  /** 一次面接通過率の目標値（%） */
  firstInterviewPassRate: 50,
  /** 最終面接通過率の目標値（%） */
  finalInterviewPassRate: 30,
  /** 承諾率の目標値（%） */
  acceptRate: 50,
  /** 入社率の目標値（%） */
  joinRate: 80,
  /** 長期停滞とみなす経過日数（応募日から） */
  stagnationDays: 21,
} as const;

const DECIDED_STATUSES = new Set(["内定", "承諾", "入社", "不採用", "辞退"]);

// ─────────────────────────────────────────
// 型
// ─────────────────────────────────────────

export type BottleneckIssueId =
  | "応募不足"
  | "有効応募率低下"
  | "書類通過率低下"
  | "一次面接化率低下"
  | "一次面接通過率低下"
  | "最終面接通過率低下"
  | "内定承諾率低下"
  | "入社率低下"
  | "長期停滞"
  | "評価未入力"
  | "問題なし";

export type BottleneckSeverity = "alert" | "warning";

export interface BottleneckIssue {
  id: BottleneckIssueId;
  severity: BottleneckSeverity;
  message: string;
  /** この判定に該当した件数（該当する場合のみ意味を持つ） */
  affectedCount?: number;
}

export interface BottleneckContext {
  counts: FunnelCounts;
  kpis: FunnelKpis;
  applications: Application[];
  interviews: Interview[];
  evaluations: Evaluation[];
  /** 長期停滞判定の基準日（YYYY-MM-DD）。省略時は判定をスキップする。 */
  baseDate?: string;
}

// ─────────────────────────────────────────
// 判定本体
// ─────────────────────────────────────────

/**
 * 優先順位順にすべての該当ボトルネックを返す（該当なしなら「問題なし」の1件）。
 */
export function diagnoseBottlenecks(ctx: BottleneckContext): BottleneckIssue[] {
  const { counts, kpis } = ctx;
  const t = BOTTLENECK_THRESHOLDS;

  // 分析対象の応募が 0 件の場合、判定自体が無意味なため空配列を返す。
  // 「応募不足」等の警告は出さない（呼び出し側で EmptyState を表示する）。
  if (counts.applied === 0) return [];

  const issues: BottleneckIssue[] = [];

  // 1. 応募不足（応募が1件以上ある場合のみ判定）
  if (counts.applied > 0 && counts.applied < t.minApplications) {
    issues.push({
      id: "応募不足",
      severity: "alert",
      message: `応募数が ${counts.applied} 件と少ない状態です（目標 ${t.minApplications} 件以上）。母数を増やす施策が必要です。`,
      affectedCount: counts.applied,
    });
  }

  // 2. 有効応募率低下
  if (counts.applied > 0 && kpis.validApplicationRate < t.validApplicationRate) {
    issues.push({
      id: "有効応募率低下",
      severity: "warning",
      message: `有効応募率が ${kpis.validApplicationRate.toFixed(1)}% で目標の ${t.validApplicationRate}% を下回っています。ターゲット精度の見直しが必要です。`,
    });
  }

  // 3. 書類通過率低下
  if (counts.validApplication > 0 && kpis.documentPassRate < t.documentPassRate) {
    issues.push({
      id: "書類通過率低下",
      severity: "warning",
      message: `書類通過率が ${kpis.documentPassRate.toFixed(1)}% で目標の ${t.documentPassRate}% を下回っています。書類選考基準を見直してください。`,
    });
  }

  // 4. 一次面接化率低下
  if (counts.documentPassed > 0 && kpis.firstInterviewRate < t.firstInterviewRate) {
    issues.push({
      id: "一次面接化率低下",
      severity: "warning",
      message: `一次面接化率が ${kpis.firstInterviewRate.toFixed(1)}% で目標の ${t.firstInterviewRate}% を下回っています。面接調整プロセスに課題がある可能性があります。`,
    });
  }

  // 5. 一次面接通過率低下
  if (counts.firstInterviewDone > 0 && kpis.firstInterviewPassRate < t.firstInterviewPassRate) {
    issues.push({
      id: "一次面接通過率低下",
      severity: "warning",
      message: `一次面接通過率が ${kpis.firstInterviewPassRate.toFixed(1)}% で目標の ${t.firstInterviewPassRate}% を下回っています。面接評価基準またはスクリーニング精度を確認してください。`,
    });
  }

  // 6. 最終面接通過率低下
  if (counts.finalInterviewDone > 0 && kpis.finalInterviewPassRate < t.finalInterviewPassRate) {
    issues.push({
      id: "最終面接通過率低下",
      severity: "warning",
      message: `最終面接通過率が ${kpis.finalInterviewPassRate.toFixed(1)}% で目標の ${t.finalInterviewPassRate}% を下回っています。最終選考基準の見直しが必要です。`,
    });
  }

  // 7. 内定承諾率低下
  if (counts.offered > 0 && kpis.acceptRate < t.acceptRate) {
    issues.push({
      id: "内定承諾率低下",
      severity: "alert",
      message: `承諾率が ${kpis.acceptRate.toFixed(1)}% で目標の ${t.acceptRate}% を下回っています。内定後フォローや条件面の競争力を確認してください。`,
    });
  }

  // 8. 入社率低下
  if (counts.accepted > 0 && kpis.joinRate < t.joinRate) {
    issues.push({
      id: "入社率低下",
      severity: "warning",
      message: `入社率が ${kpis.joinRate.toFixed(1)}% で目標の ${t.joinRate}% を下回っています。オンボーディングまでのフォロー体制を確認してください。`,
    });
  }

  // 9. 長期停滞（応募日からの経過日数）
  if (ctx.baseDate) {
    const stagnant = ctx.applications.filter((a) => {
      if (DECIDED_STATUSES.has(a.status)) return false;
      const days = daysBetween(a.appliedAt, ctx.baseDate!);
      return days !== null && days > t.stagnationDays;
    });
    if (stagnant.length > 0) {
      issues.push({
        id: "長期停滞",
        severity: "warning",
        message: `応募から ${t.stagnationDays} 日を超えて未決着の応募が ${stagnant.length} 件あります。滞留している候補者のフォローが必要です。`,
        affectedCount: stagnant.length,
      });
    }
  }

  // 10. 評価未入力（面接実施済みだが評価レコードが無い）
  // ctx.interviews は全期間の面接を含み得るため、期間フィルタ後の対象
  // applications（ctx.applications）に紐づく面接だけに絞り込んでから判定する。
  // これにより、表示中の期間と無関係な他期間の面接が混入しない。
  const targetApplicationIds = new Set(ctx.applications.map((a) => a.id));
  const targetInterviews = ctx.interviews.filter((i) => targetApplicationIds.has(i.applicationId));
  const evaluatedInterviewIds = new Set(ctx.evaluations.map((e) => e.interviewId));
  const missingEvaluations = targetInterviews.filter((i) => !evaluatedInterviewIds.has(i.id));
  if (missingEvaluations.length > 0) {
    issues.push({
      id: "評価未入力",
      severity: "warning",
      message: `面接実施済みで評価が未入力の面接が ${missingEvaluations.length} 件あります。評価の入力漏れを確認してください。`,
      affectedCount: missingEvaluations.length,
    });
  }

  // 11. 次回対応期限超過は、期限日フィールドが存在しないため算出しない（意図的に非実装）。

  if (issues.length === 0) {
    issues.push({
      id: "問題なし",
      severity: "warning",
      message: "現在のファネルは健全な状態です。このまま継続してください。",
    });
  }

  return issues;
}

function daysBetween(from: string, to: string): number | null {
  const f = new Date(`${from}T00:00:00`);
  const t = new Date(`${to}T00:00:00`);
  if (isNaN(f.getTime()) || isNaN(t.getTime())) return null;
  return Math.floor((t.getTime() - f.getTime()) / (1000 * 60 * 60 * 24));
}
