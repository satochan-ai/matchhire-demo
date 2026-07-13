/**
 * insightEngine.ts
 *
 * ルールベースの自動インサイト生成エンジン。
 * AI API 不要・純粋な TypeScript 関数として実装。
 * 将来 LLM API に差し替える場合は generateInsights() の中身を置き換えるだけでよい。
 *
 * 採用ファネルに関するインサイトは src/lib/funnel.ts が算出した正式な
 * FunnelCounts / FunnelKpis のみを情報源とする（ここで再計算しない）。
 * 「ファネルが健全かどうか」の最終判定も、ダッシュボードが表示している
 * src/lib/bottleneck.ts の diagnoseBottlenecks() の結果をそのまま受け取り、
 * 別ロジックで再判定しない（同一画面内で KPI と AI インサイトが矛盾しないため）。
 *
 * スカウト送信・開封・返信などの「母集団形成／アプローチ活動」指標は、
 * 採用ファネル（応募〜入社）とは独立したカテゴリとして扱い、
 * これらの指標だけを根拠に「採用ファネルが健全」と判定することはない。
 */

import type { NgReasonCount } from "@/lib/mockData";
import type { FunnelCounts, FunnelKpis } from "@/lib/funnel";
import type { BottleneckIssue } from "@/lib/bottleneck";

// ─────────────────────────────────────────
// 入力型
// ─────────────────────────────────────────

/** 母集団形成／アプローチ活動（スカウト・DM）の指標。採用ファネルとは別カテゴリ。 */
export interface ApproachInput {
  sentCount: number;
  openRate: number;
  replyRate: number;
}

// ─────────────────────────────────────────
// 出力型
// ─────────────────────────────────────────

export type InsightLevel = "alert" | "warning" | "info" | "good";
export type InsightCategory = "funnel" | "approach" | "ng";

export interface Insight {
  id: string;
  level: InsightLevel;
  category: InsightCategory;
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

interface RuleContext {
  funnelCounts: FunnelCounts;
  funnelKpis: FunnelKpis;
  bottleneckIssues: BottleneckIssue[];
  approach: ApproachInput;
  topNg: NgReasonCount[];
}

type Rule = (ctx: RuleContext) => Insight | null;

const rules: Rule[] = [

  // ── アプローチ活動：送信数チェック ──
  ({ approach }) => {
    if (approach.sentCount === 0) {
      return {
        id: "approach-no-sent",
        level: "alert",
        category: "approach",
        message: "この期間のスカウト・DM送信件数が 0 件です。データが集計対象外の期間になっている可能性があります。",
      };
    }
    if (approach.sentCount < 5) {
      return {
        id: "approach-low-sent",
        level: "warning",
        category: "approach",
        message: `送信数が ${approach.sentCount} 件と少ない期間です。母数が小さいため各指標の変動が大きくなりやすい点に注意してください。`,
      };
    }
    return null;
  },

  // ── アプローチ活動：開封率 ──
  ({ approach }) => {
    if (approach.openRate < 25) {
      return {
        id: "approach-open-critical",
        level: "alert",
        category: "approach",
        message: `開封率が ${f(approach.openRate)} と非常に低い状態です。件名のパーソナライズや送信タイミングの見直しが急務です。`,
      };
    }
    if (approach.openRate < 40) {
      return {
        id: "approach-open-low",
        level: "warning",
        category: "approach",
        message: `開封率が ${f(approach.openRate)} で目標の 40% を下回っています。件名に候補者の実績・スキルを盛り込むA/Bテストを検討してください。`,
      };
    }
    return null;
  },

  // ── アプローチ活動：返信率 ──
  ({ approach }) => {
    if (approach.replyRate < 8) {
      return {
        id: "approach-reply-critical",
        level: "alert",
        category: "approach",
        message: `返信率が ${f(approach.replyRate)} と深刻に低い状態です。スカウト文面の訴求が候補者に刺さっていない可能性が高く、文面の全面見直しをおすすめします。`,
      };
    }
    if (approach.replyRate < 15) {
      return {
        id: "approach-reply-low",
        level: "warning",
        category: "approach",
        message: `返信率が ${f(approach.replyRate)} で目標の 15% を下回っています。冒頭でキャリアへの共感を示し、ポジションの魅力を具体的に伝える文面への改善が有効です。`,
      };
    }
    return null;
  },

  // ── 採用ファネル：有効応募率（正式KPI = 有効応募数 ÷ 応募数） ──
  ({ funnelCounts, funnelKpis, topNg }) => {
    if (funnelCounts.applied === 0) return null;
    if (funnelKpis.validApplicationRate < 30) {
      const ngHint = topNg.length > 0
        ? `不採用理由の上位は「${topNg[0].reason}」（${f(topNg[0].rate)}）です。ターゲット条件の見直しで改善が見込まれます。`
        : "スカウト対象の絞り込み条件を見直してください。";
      return {
        id: "funnel-valid-critical",
        level: "alert",
        category: "funnel",
        message: `有効応募率が ${f(funnelKpis.validApplicationRate)} と低迷しています。${ngHint}`,
      };
    }
    if (funnelKpis.validApplicationRate < 50) {
      return {
        id: "funnel-valid-low",
        level: "warning",
        category: "funnel",
        message: `有効応募率が ${f(funnelKpis.validApplicationRate)} で目標の 50% を下回っています。ターゲット条件の精度向上を確認してください。`,
      };
    }
    return null;
  },

  // ── 採用ファネル：書類通過率（正式KPI = 書類通過数 ÷ 有効応募数） ──
  ({ funnelCounts, funnelKpis }) => {
    if (funnelCounts.validApplication === 0) return null;
    if (funnelKpis.documentPassRate < 30) {
      return {
        id: "funnel-document-low",
        level: "warning",
        category: "funnel",
        message: `書類通過率が ${f(funnelKpis.documentPassRate)} で目標の 30% を下回っています。書類選考基準を見直してください。`,
      };
    }
    return null;
  },

  // ── NG理由：スキル不足が多い ──
  ({ topNg }) => {
    const skillNg = topNg.find((n) => n.reason === "スキル不足");
    if (skillNg && skillNg.rate >= 30) {
      return {
        id: "ng-skill",
        level: "warning",
        category: "ng",
        message: `不採用理由の ${f(skillNg.rate)} が「スキル不足」です。スカウト対象のスキル要件を厳格化するか、書類選考基準を調整することで面接の質が向上します。`,
      };
    }
    return null;
  },

  // ── NG理由：志向性・カルチャー問題 ──
  ({ topNg }) => {
    const cultureNg = topNg.find(
      (n) => n.reason === "志向性不一致" || n.reason === "カルチャーフィット不足"
    );
    if (cultureNg && cultureNg.rate >= 25) {
      return {
        id: "ng-culture",
        level: "warning",
        category: "ng",
        message: `「${cultureNg.reason}」が不採用理由の ${f(cultureNg.rate)} を占めています。スカウト文面にカルチャーや働き方の情報を加え、ミスマッチを事前に防ぐことを検討してください。`,
      };
    }
    return null;
  },

  // ── NG理由：条件不一致・他社決定 ──
  ({ topNg }) => {
    const condNg  = topNg.find((n) => n.reason === "条件不一致");
    const otherNg = topNg.find((n) => n.reason === "他社決定");
    const combined = (condNg?.rate ?? 0) + (otherNg?.rate ?? 0);
    if (combined >= 30) {
      return {
        id: "ng-condition",
        level: "warning",
        category: "ng",
        message: `「条件不一致」「他社決定」の合計が不採用の ${f(combined)} を占めています。提示条件の競争力強化とクロージングプロセスの見直しをおすすめします。`,
      };
    }
    return null;
  },

  // ── 採用ファネル：一次面接化率（正式KPI = 一次面接実施応募数 ÷ 書類通過数） ──
  ({ funnelCounts, funnelKpis }) => {
    if (funnelCounts.documentPassed === 0) return null;
    if (funnelKpis.firstInterviewRate < 40) {
      return {
        id: "funnel-first-interview-low",
        level: "warning",
        category: "funnel",
        message: `一次面接化率が ${f(funnelKpis.firstInterviewRate)} です。書類選考通過後の面接調整プロセスに課題がある可能性があります。`,
      };
    }
    return null;
  },

  // ── 採用ファネル：内定率（正式KPI = 内定数 ÷ 有効応募数） ──
  ({ funnelCounts, funnelKpis }) => {
    if (funnelCounts.validApplication === 0) return null;
    if (funnelKpis.offerRate < 15) {
      return {
        id: "funnel-offer-low",
        level: "warning",
        category: "funnel",
        message: `内定率が ${f(funnelKpis.offerRate)} と低い状態です。評価基準が厳しすぎないか、または面接でのミスマッチが多い可能性があります。`,
      };
    }
    return null;
  },

  // ── 採用ファネル：承諾率（正式KPI = 承諾数 ÷ 内定数） ──
  ({ funnelCounts, funnelKpis }) => {
    if (funnelCounts.offered === 0) return null;
    if (funnelKpis.acceptRate < 50) {
      return {
        id: "funnel-accept-low",
        level: "alert",
        category: "funnel",
        message: `承諾率が ${f(funnelKpis.acceptRate)} と低い状態です。内定後のフォローや提示条件・クロージングに課題がある可能性があります。`,
      };
    }
    if (funnelKpis.acceptRate < 80) {
      return {
        id: "funnel-accept-mid",
        level: "info",
        category: "funnel",
        message: `承諾率は ${f(funnelKpis.acceptRate)} です。内定後のフォロー強化や競合他社比較への対策を継続することで、さらなる改善が期待できます。`,
      };
    }
    return null;
  },

  // ── 採用ファネル全体の健全性：ダッシュボードと同じ diagnoseBottlenecks() の結果を根拠にする ──
  ({ funnelCounts, funnelKpis, bottleneckIssues }) => {
    if (funnelCounts.applied === 0) return null;
    const isHealthy = bottleneckIssues.length === 1 && bottleneckIssues[0].id === "問題なし";
    if (isHealthy) {
      return {
        id: "funnel-all-good",
        level: "good",
        category: "funnel",
        message: `現在の採用ファネルは健全な状態です（有効応募率 ${f(funnelKpis.validApplicationRate)} / 書類通過率 ${f(funnelKpis.documentPassRate)} / 内定率 ${f(funnelKpis.offerRate)}）。`,
      };
    }
    return null;
  },
];

// ─────────────────────────────────────────
// メイン関数
// ─────────────────────────────────────────

/**
 * 正式なファネル集計（funnelCounts/funnelKpis）、ダッシュボードと共有する
 * ボトルネック診断結果（bottleneckIssues）、アプローチ指標、NG理由データから
 * インサイトを生成する。ファネル関連の数値はすべて呼び出し元から渡された
 * 値をそのまま使用し、ここでは再計算しない。
 *
 * @param maxInsights 最大出力件数（デフォルト 5）
 */
export function generateInsights(
  funnel: { counts: FunnelCounts; kpis: FunnelKpis },
  bottleneckIssues: BottleneckIssue[],
  approach: ApproachInput,
  ngData: NgReasonCount[],
  maxInsights = 5
): Insight[] {
  // NG理由を件数降順にして上位3件を渡す
  const topNg = [...ngData]
    .filter((n) => n.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const ctx: RuleContext = {
    funnelCounts: funnel.counts,
    funnelKpis: funnel.kpis,
    bottleneckIssues,
    approach,
    topNg,
  };

  const results: Insight[] = [];
  for (const rule of rules) {
    if (results.length >= maxInsights) break;
    const insight = rule(ctx);
    if (insight) results.push(insight);
  }
  return results;
}
