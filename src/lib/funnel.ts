/**
 * funnel.ts
 *
 * MatchHire の正式な採用ファネル定義と KPI 計算式。
 *
 * ファネルは「応募」を最小単位として扱う。同一応募に同一段階の面接レコードが
 * 複数存在しても（例: 1次面接を2回に分けて実施した等）、ファネル上は応募単位で
 * 1件として数える（= 各応募は各ステージに所属するか否かの boolean で判定する）。
 *
 * ステージ定義:
 *   1. 応募         … applications 全件
 *   2. 有効応募     … validity === "有効"
 *   3. 書類通過     … 有効応募 かつ documentResult === "通過"
 *   4. 一次面接実施 … 書類通過 かつ、その応募に interview レコードが1件以上存在
 *   5. 最終面接実施 … 一次面接実施 かつ、(interview が2件以上 = 複数ラウンド実施)
 *                     または (application.status が内定/承諾/入社/不採用/辞退の
 *                     いずれか = 選考プロセスが完了している)
 *                     ※ 面接ラウンド数を明示するフィールドが無いため、実在する
 *                        interview 件数と application.status（意思決定済みか）
 *                        から判定する。1回の面接だけで意思決定に至るケースは
 *                        「単ラウンドで最終面接まで完了した」とみなす。
 *   6. 内定         … 最終面接実施 かつ (hasOffer === true または status が
 *                     内定/承諾/入社のいずれか)
 *   7. 承諾         … 内定 かつ status が 承諾/入社 のいずれか
 *   8. 入社         … 承諾 かつ status === "入社"
 *
 * 各ステージは前段ステージの部分集合になるよう AND で積み上げているため、
 * 定義上ファネルは単調減少し、転換率が 100% を超えることはない。
 */

import type { Application, Interview } from "@/lib/mockData";

// ─────────────────────────────────────────
// 応募単位のファネル所属フラグ
// ─────────────────────────────────────────

export interface ApplicationFunnelFlags {
  applicationId: string;
  applied: boolean;
  validApplication: boolean;
  documentPassed: boolean;
  firstInterviewDone: boolean;
  firstInterviewPassed: boolean;
  finalInterviewDone: boolean;
  offered: boolean;
  accepted: boolean;
  joined: boolean;
}

const DECIDED_STATUSES = new Set(["内定", "承諾", "入社", "不採用", "辞退"]);
const OFFER_STATUSES = new Set(["内定", "承諾", "入社"]);
const ACCEPTED_STATUSES = new Set(["承諾", "入社"]);

export function computeApplicationFunnelFlags(
  app: Application,
  interviews: Interview[]
): ApplicationFunnelFlags {
  const appInterviews = interviews
    .filter((i) => i.applicationId === app.id)
    .sort((a, b) => a.date.localeCompare(b.date));

  const applied = true;
  const validApplication = applied && app.validity === "有効";
  const documentPassed = validApplication && app.documentResult === "通過";
  const firstInterviewDone = documentPassed && appInterviews.length >= 1;
  const firstInterviewPassed =
    firstInterviewDone && appInterviews[0]?.result === "通過";
  const finalInterviewDone =
    firstInterviewDone &&
    (appInterviews.length >= 2 || DECIDED_STATUSES.has(app.status));
  const offered =
    finalInterviewDone && (app.hasOffer === true || OFFER_STATUSES.has(app.status));
  const accepted = offered && ACCEPTED_STATUSES.has(app.status);
  const joined = accepted && app.status === "入社";

  return {
    applicationId: app.id,
    applied,
    validApplication,
    documentPassed,
    firstInterviewDone,
    firstInterviewPassed,
    finalInterviewDone,
    offered,
    accepted,
    joined,
  };
}

// ─────────────────────────────────────────
// ファネル集計
// ─────────────────────────────────────────

export interface FunnelCounts {
  applied: number;
  validApplication: number;
  documentPassed: number;
  firstInterviewDone: number;
  firstInterviewPassed: number;
  finalInterviewDone: number;
  offered: number;
  accepted: number;
  joined: number;
}

export interface FunnelStep {
  label: string;
  count: number;
}

export function computeFunnelCounts(
  applications: Application[],
  interviews: Interview[]
): FunnelCounts {
  const flags = applications.map((a) => computeApplicationFunnelFlags(a, interviews));

  const count = (pred: (f: ApplicationFunnelFlags) => boolean) =>
    flags.filter(pred).length;

  return {
    applied: count((f) => f.applied),
    validApplication: count((f) => f.validApplication),
    documentPassed: count((f) => f.documentPassed),
    firstInterviewDone: count((f) => f.firstInterviewDone),
    firstInterviewPassed: count((f) => f.firstInterviewPassed),
    finalInterviewDone: count((f) => f.finalInterviewDone),
    offered: count((f) => f.offered),
    accepted: count((f) => f.accepted),
    joined: count((f) => f.joined),
  };
}

/** ダッシュボード表示用の8段階ファネルステップ（表示は8段階、KPIには一次面接通過も含む） */
export function buildFunnelSteps(counts: FunnelCounts): FunnelStep[] {
  return [
    { label: "応募", count: counts.applied },
    { label: "有効応募", count: counts.validApplication },
    { label: "書類通過", count: counts.documentPassed },
    { label: "一次面接実施", count: counts.firstInterviewDone },
    { label: "最終面接実施", count: counts.finalInterviewDone },
    { label: "内定", count: counts.offered },
    { label: "承諾", count: counts.accepted },
    { label: "入社", count: counts.joined },
  ];
}

// ─────────────────────────────────────────
// KPI（すべて分母 0 の場合は 0 を返す）
// ─────────────────────────────────────────

export interface FunnelKpis {
  /** 有効応募率 = 有効応募数 ÷ 応募数 */
  validApplicationRate: number;
  /** 書類通過率 = 書類通過数 ÷ 有効応募数 */
  documentPassRate: number;
  /** 一次面接化率 = 一次面接実施応募数 ÷ 書類通過数 */
  firstInterviewRate: number;
  /** 一次面接通過率 = 一次面接通過応募数 ÷ 一次面接実施応募数 */
  firstInterviewPassRate: number;
  /** 最終面接通過率 = 内定数 ÷ 最終面接実施応募数 */
  finalInterviewPassRate: number;
  /** 内定率 = 内定数 ÷ 有効応募数 */
  offerRate: number;
  /** 承諾率 = 承諾数 ÷ 内定数 */
  acceptRate: number;
  /** 入社率 = 入社数 ÷ 承諾数 */
  joinRate: number;
  /** 最終採用率 = 入社数 ÷ 応募数 */
  finalHireRate: number;
}

function pct(numerator: number, denominator: number): number {
  if (denominator === 0) return 0;
  return (numerator / denominator) * 100;
}

export function computeFunnelKpis(counts: FunnelCounts): FunnelKpis {
  return {
    validApplicationRate: pct(counts.validApplication, counts.applied),
    documentPassRate: pct(counts.documentPassed, counts.validApplication),
    firstInterviewRate: pct(counts.firstInterviewDone, counts.documentPassed),
    firstInterviewPassRate: pct(counts.firstInterviewPassed, counts.firstInterviewDone),
    finalInterviewPassRate: pct(counts.offered, counts.finalInterviewDone),
    offerRate: pct(counts.offered, counts.validApplication),
    acceptRate: pct(counts.accepted, counts.offered),
    joinRate: pct(counts.joined, counts.accepted),
    finalHireRate: pct(counts.joined, counts.applied),
  };
}
