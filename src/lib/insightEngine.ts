/**
 * insightEngine.ts
 *
 * ルールベースの自動インサイト生成エンジン。
 * AI API 不要・純粋な TypeScript 関数として実装。
 * 将来 LLM API に差し替える場合は generateInsights() の中身を置き換えるだけでよい。
 */

import type { NgReasonCount } from "@/lib/mockData";

// ─────────────────────────────────────────
// 入力型
// ─────────────────────────────────────────

export interface KpiInput {
  sentCount: number;
  openRate: number;
  replyRate: number;
  validRate: number;
  interviewRate: number;
  offerRate: number;
  acceptRate: number;
  documentPassRate: number;
}

export type BottleneckIssue =
  | "開封率が低い"
  | "返信率が低い"
  | "有効応募率が低い"
  | "書類通過率が低い"
  | "問題なし";

// ─────────────────────────────────────────
// 出力型
// ─────────────────────────────────────────

export type InsightLevel = "alert" | "warning" | "info" | "good";

export interface Insight {
  id: string;
  level: InsightLevel;
  message: string;
}

// ─────────────────────────────────────────
// ヘルパー
// ─────────────────────────────────────────

/** 数値を小数点1桁の % 文字列に変換 */
const f = (n: number) => `${n.toFixed(1)}%`;

// ─────────────────────────────────────────
// ルール定義
// ─────────────────────────────────────────

type Rule = (
  kpi: KpiInput,
  bottleneck: BottleneckIssue,
  topNg: NgReasonCount[]
) => Insight | null;

const rules: Rule[] = [

  // ── 送信数チェック ──
  (kpi) => {
    if (kpi.sentCount === 0) {
      return {
        id: "no-sent",
        level: "alert",
        message: "この期間のスカウト・DM送信件数が 0 件です。データが集計対象外の期間になっている可能性があります。",
      };
    }
    if (kpi.sentCount < 5) {
      return {
        id: "low-sent",
        level: "warning",
        message: `送信数が ${kpi.sentCount} 件と少ない期間です。母数が小さいため各指標の変動が大きくなりやすい点に注意してください。`,
      };
    }
    return null;
  },

  // ── 開封率 ──
  (kpi) => {
    if (kpi.openRate < 25) {
      return {
        id: "open-critical",
        level: "alert",
        message: `開封率が ${f(kpi.openRate)} と非常に低い状態です。件名のパーソナライズや送信タイミングの見直しが急務です。`,
      };
    }
    if (kpi.openRate < 40) {
      return {
        id: "open-low",
        level: "warning",
        message: `開封率が ${f(kpi.openRate)} で目標の 40% を下回っています。件名に候補者の実績・スキルを盛り込むA/Bテストを検討してください。`,
      };
    }
    return null;
  },

  // ── 返信率 ──
  (kpi) => {
    if (kpi.replyRate < 8) {
      return {
        id: "reply-critical",
        level: "alert",
        message: `返信率が ${f(kpi.replyRate)} と深刻に低い状態です。スカウト文面の訴求が候補者に刺さっていない可能性が高く、文面の全面見直しをおすすめします。`,
      };
    }
    if (kpi.replyRate < 15) {
      return {
        id: "reply-low",
        level: "warning",
        message: `返信率が ${f(kpi.replyRate)} で目標の 15% を下回っています。冒頭でキャリアへの共感を示し、ポジションの魅力を具体的に伝える文面への改善が有効です。`,
      };
    }
    return null;
  },

  // ── 有効応募率 ──
  (kpi, _, topNg) => {
    if (kpi.validRate < 30) {
      const ngHint = topNg.length > 0
        ? `不採用理由の上位は「${topNg[0].reason}」（${f(topNg[0].rate)}）です。スカウト対象の絞り込み条件を見直すことで改善が見込まれます。`
        : "スカウト対象の絞り込み条件を見直してください。";
      return {
        id: "valid-critical",
        level: "alert",
        message: `有効応募率が ${f(kpi.validRate)} と低迷しています。${ngHint}`,
      };
    }
    if (kpi.validRate < 50) {
      return {
        id: "valid-low",
        level: "warning",
        message: `有効応募率が ${f(kpi.validRate)} で目標の 50% を下回っています。ターゲット条件の精度向上やスカウト文面と求人要件のズレを確認してください。`,
      };
    }
    return null;
  },

  // ── NG理由：スキル不足が多い ──
  (_, __, topNg) => {
    const skillNg = topNg.find((n) => n.reason === "スキル不足");
    if (skillNg && skillNg.rate >= 30) {
      return {
        id: "ng-skill",
        level: "warning",
        message: `不採用理由の ${f(skillNg.rate)} が「スキル不足」です。スカウト対象のスキル要件を厳格化するか、書類選考基準を調整することで面接の質が向上します。`,
      };
    }
    return null;
  },

  // ── NG理由：志向性・カルチャー問題 ──
  (_, __, topNg) => {
    const cultureNg = topNg.find(
      (n) => n.reason === "志向性不一致" || n.reason === "カルチャーフィット不足"
    );
    if (cultureNg && cultureNg.rate >= 25) {
      return {
        id: "ng-culture",
        level: "warning",
        message: `「${cultureNg.reason}」が不採用理由の ${f(cultureNg.rate)} を占めています。スカウト文面にカルチャーや働き方の情報を加え、ミスマッチを事前に防ぐことを検討してください。`,
      };
    }
    return null;
  },

  // ── NG理由：条件不一致・他社決定 ──
  (_, __, topNg) => {
    const condNg  = topNg.find((n) => n.reason === "条件不一致");
    const otherNg = topNg.find((n) => n.reason === "他社決定");
    const combined = (condNg?.rate ?? 0) + (otherNg?.rate ?? 0);
    if (combined >= 30) {
      return {
        id: "ng-condition",
        level: "warning",
        message: `「条件不一致」「他社決定」の合計が不採用の ${f(combined)} を占めています。提示条件の競争力強化とクロージングプロセスの見直しをおすすめします。`,
      };
    }
    return null;
  },

  // ── 面接化率 ──
  (kpi) => {
    if (kpi.interviewRate > 0 && kpi.interviewRate < 40) {
      return {
        id: "interview-low",
        level: "warning",
        message: `有効応募から面接への転換率が ${f(kpi.interviewRate)} です。書類選考基準の見直しや、一次面接のハードルを下げることで改善できる可能性があります。`,
      };
    }
    return null;
  },

  // ── 内定率 ──
  (kpi) => {
    if (kpi.offerRate > 0 && kpi.offerRate < 15) {
      return {
        id: "offer-low",
        level: "warning",
        message: `面接から内定への転換率が ${f(kpi.offerRate)} と低い状態です。評価基準が厳しすぎないか、または面接でのミスマッチが多い可能性があります。`,
      };
    }
    return null;
  },

  // ── 承諾率 ──
  (kpi) => {
    if (kpi.acceptRate > 0 && kpi.acceptRate < 50) {
      return {
        id: "accept-low",
        level: "alert",
        message: `承諾率が ${f(kpi.acceptRate)} と低い状態です。内定後のフォローや提示条件・クロージングに課題がある可能性があります。オファー面談の質を高めることを検討してください。`,
      };
    }
    if (kpi.acceptRate > 0 && kpi.acceptRate < 80) {
      return {
        id: "accept-mid",
        level: "info",
        message: `承諾率は ${f(kpi.acceptRate)} です。内定後のフォロー強化や競合他社比較への対策を継続することで、さらなる改善が期待できます。`,
      };
    }
    return null;
  },

  // ── ファネル全体が健全 ──
  (kpi, bottleneck) => {
    if (bottleneck === "問題なし" && kpi.sentCount >= 5) {
      return {
        id: "all-good",
        level: "good",
        message: `現在の採用ファネルは健全な状態です（開封率 ${f(kpi.openRate)} / 返信率 ${f(kpi.replyRate)} / 有効応募率 ${f(kpi.validRate)}）。送信数を増やしてスケールを目指すフェーズです。`,
      };
    }
    return null;
  },
];

// ─────────────────────────────────────────
// メイン関数
// ─────────────────────────────────────────

/**
 * KPI・ボトルネック・NG理由データからインサイトを生成する。
 * @param maxInsights 最大出力件数（デフォルト 5）
 */
export function generateInsights(
  kpi: KpiInput,
  bottleneck: BottleneckIssue,
  ngData: NgReasonCount[],
  maxInsights = 5
): Insight[] {
  // NG理由を件数降順にして上位3件を渡す
  const topNg = [...ngData]
    .filter((n) => n.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const results: Insight[] = [];
  for (const rule of rules) {
    if (results.length >= maxInsights) break;
    const insight = rule(kpi, bottleneck, topNg);
    if (insight) results.push(insight);
  }
  return results;
}
