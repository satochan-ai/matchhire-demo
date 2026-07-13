"use client";

import { useState, useMemo } from "react";
import { KpiCards, statusFromTarget, type KpiCardItem, type KpiStatus } from "@/components/dashboard/KpiCards";
import { StatusBand, type OverallState } from "@/components/dashboard/StatusBand";
import { KpiDetail, type KpiDetailGroup } from "@/components/dashboard/KpiDetail";
import { FunnelChart } from "@/components/dashboard/FunnelChart";
import { Bottleneck } from "@/components/dashboard/Bottleneck";
import { ChannelChart } from "@/components/dashboard/ChannelChart";
import { DateFilter } from "@/components/dashboard/DateFilter";
import { InsightPanel } from "@/components/dashboard/InsightPanel";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import {
  computeDashboardMetrics,
  computeChannelMetrics,
  computeNgReasonMetrics,
  buildDateRange,
  type DateRangeKey,
} from "@/lib/mockData";
import { computeFunnelCounts, computeFunnelKpis, buildFunnelSteps } from "@/lib/funnel";
import { diagnoseBottlenecks, BOTTLENECK_THRESHOLDS, type BottleneckIssueId, type BottleneckIssue } from "@/lib/bottleneck";
import { generateInsights } from "@/lib/insightEngine";
import { useRawData } from "@/hooks/useRawData";
import { EmptyState } from "@/components/common/EmptyState";

/** mockData の基準日（ダミーデータが 2026-04 に集中しているため固定） */
const BASE_DATE = "2026-04-25";

function pct(numerator: number, denominator: number) {
  if (denominator === 0) return 0;
  return (numerator / denominator) * 100;
}

/**
 * bottleneckIssues の id → 対応する採用ファネル段階ラベルの静的対応表。
 * ここでは既存の診断結果（bottleneckIssues）に含まれる id を見て、
 * どの段階のバーを視覚的に警告表示するかを決めるだけで、新たな判定は行わない。
 */
const ISSUE_TO_STAGE_LABEL: Partial<Record<BottleneckIssueId, string>> = {
  応募不足: "応募",
  有効応募率低下: "有効応募",
  書類通過率低下: "書類通過",
  一次面接化率低下: "一次面接実施",
  一次面接通過率低下: "一次面接実施",
  最終面接通過率低下: "最終面接実施",
  内定承諾率低下: "承諾",
  入社率低下: "入社",
};

/**
 * 主要KPIの状態表示を、対応する bottleneckIssues の有無・severity へマッピングする。
 * KPI値からの独自再判定は行わない。該当issueが無ければ「良好」として扱う
 * （bottleneckIssues 自体の判定・順序・閾値には一切手を加えない）。
 */
function statusFromIssue(issues: BottleneckIssue[], issueId: BottleneckIssueId): KpiStatus {
  const found = issues.find((i) => i.id === issueId);
  return found ? found.severity : "good";
}

// ─────────────────────────────────────────
// ページ本体
// ─────────────────────────────────────────

export default function DashboardPage() {
  const [rangeKey, setRangeKey] = useState<DateRangeKey>("this_month");

  const { data, loading, error, refetch } = useRawData([
    "contacts", "applications", "interviews", "candidates", "evaluations",
  ]);

  const range = useMemo(() => buildDateRange(rangeKey, BASE_DATE), [rangeKey]);

  // ── アプローチ指標（送信・開封・返信）：スカウト/DM 起点の従来指標 ──
  const dashData    = useMemo(() => computeDashboardMetrics(range, data),   [range, data]);
  const channelData = useMemo(() => computeChannelMetrics(range, data),     [range, data]);
  const ngData       = useMemo(() => computeNgReasonMetrics(undefined, data), [data]);

  const openRate  = pct(dashData.opened_count,  dashData.sent_count);
  const replyRate = pct(dashData.replied_count, dashData.opened_count);

  // ── 正式な採用ファネル（応募〜入社）：応募単位で重複排除して集計 ──
  const rangedApplications = useMemo(() => {
    const apps = data.applications ?? [];
    if (range.key === "all") return apps;
    return apps.filter((a) => (!range.start || a.appliedAt >= range.start) && (!range.end || a.appliedAt <= range.end));
  }, [data.applications, range]);

  const funnelCounts = useMemo(
    () => computeFunnelCounts(rangedApplications, data.interviews ?? []),
    [rangedApplications, data.interviews]
  );
  const funnelKpis  = useMemo(() => computeFunnelKpis(funnelCounts), [funnelCounts]);
  const funnelSteps = useMemo(() => buildFunnelSteps(funnelCounts), [funnelCounts]);

  const bottleneckIssues = useMemo(
    () =>
      diagnoseBottlenecks({
        counts: funnelCounts,
        kpis: funnelKpis,
        applications: rangedApplications,
        interviews: data.interviews ?? [],
        evaluations: data.evaluations ?? [],
        baseDate: BASE_DATE,
      }),
    [funnelCounts, funnelKpis, rangedApplications, data.interviews, data.evaluations]
  );

  // bottleneckIssues に含まれる id から、警告表示する段階ラベルの集合を作る
  // （並び替え・再判定はしない。既存の issues 配列の内容をそのまま参照するだけ）
  const warningStages = useMemo(() => {
    const set = new Set<string>();
    bottleneckIssues.forEach((issue) => {
      const label = ISSUE_TO_STAGE_LABEL[issue.id];
      if (label) set.add(label);
    });
    return set;
  }, [bottleneckIssues]);

  const hasApplications = funnelCounts.applied > 0;

  // ── 総合状態：bottleneckIssues の先頭要素の severity をそのまま表示にマッピングするだけ ──
  const overallState: OverallState = !hasApplications
    ? "no-data"
    : bottleneckIssues[0]?.id === "問題なし"
    ? "good"
    : bottleneckIssues[0]?.severity === "alert"
    ? "alert"
    : "warning";

  const overallDesc = !hasApplications
    ? "分析対象の応募データがありません"
    : bottleneckIssues[0]?.id === "問題なし"
    ? "該当するボトルネックはありません"
    : `${bottleneckIssues.filter((i) => i.severity === "alert").length}件の要対応・${bottleneckIssues.filter((i) => i.severity === "warning").length}件の注意を検出`;

  // ── 主要KPI（固定4項目・再計算なし） ──
  // 状態表示は、対応する bottleneckIssues が存在すればその severity を、
  // 存在しなければ「良好」を採用する（正式なボトルネック診断と矛盾させないため）。
  // 「応募数」は 0 件時のみ「no-data」相当（StatusBand 自体が EmptyState に
  // 置き換わるため実際には描画されない）とし、それ以外は「応募不足」issueの
  // 有無で判定する。内定率に対応する issue は bottleneck.ts に存在しないため、
  // 既存どおり閾値なしの中立表示（good）のままとする。
  const primaryKpis: KpiCardItem[] = [
    { label: "応募数", value: funnelCounts.applied, isPercent: false, status: statusFromIssue(bottleneckIssues, "応募不足") },
    { label: "有効応募率", value: funnelKpis.validApplicationRate, isPercent: true, status: statusFromIssue(bottleneckIssues, "有効応募率低下") },
    { label: "一次面接化率", value: funnelKpis.firstInterviewRate, isPercent: true, status: statusFromIssue(bottleneckIssues, "一次面接化率低下") },
    { label: "内定率", value: funnelKpis.offerRate, isPercent: true, status: "good" },
  ];

  // ── KPI詳細（既存の正式9項目を維持し、3グループへ整理） ──
  const kpiDetailGroups: KpiDetailGroup[] = [
    {
      groupLabel: "母集団品質",
      rows: [
        { label: "有効応募率", formula: "有効応募数 ÷ 応募数", value: funnelKpis.validApplicationRate, isPercent: true, status: statusFromTarget(funnelKpis.validApplicationRate, BOTTLENECK_THRESHOLDS.validApplicationRate) },
        { label: "書類通過率", formula: "書類通過数 ÷ 有効応募数", value: funnelKpis.documentPassRate, isPercent: true, status: statusFromTarget(funnelKpis.documentPassRate, BOTTLENECK_THRESHOLDS.documentPassRate) },
        { label: "一次面接化率", formula: "一次面接実施数 ÷ 書類通過数", value: funnelKpis.firstInterviewRate, isPercent: true, status: statusFromTarget(funnelKpis.firstInterviewRate, BOTTLENECK_THRESHOLDS.firstInterviewRate) },
      ],
    },
    {
      groupLabel: "選考通過",
      rows: [
        { label: "一次面接通過率", formula: "一次面接通過数 ÷ 一次面接実施数", value: funnelKpis.firstInterviewPassRate, isPercent: true, status: statusFromTarget(funnelKpis.firstInterviewPassRate, BOTTLENECK_THRESHOLDS.firstInterviewPassRate) },
        { label: "最終面接通過率", formula: "内定数 ÷ 最終面接実施数", value: funnelKpis.finalInterviewPassRate, isPercent: true, status: statusFromTarget(funnelKpis.finalInterviewPassRate, BOTTLENECK_THRESHOLDS.finalInterviewPassRate) },
        { label: "内定率", formula: "内定数 ÷ 有効応募数", value: funnelKpis.offerRate, isPercent: true, status: "good" },
      ],
    },
    {
      groupLabel: "採用決定",
      rows: [
        { label: "承諾率", formula: "承諾数 ÷ 内定数", value: funnelKpis.acceptRate, isPercent: true, status: statusFromTarget(funnelKpis.acceptRate, BOTTLENECK_THRESHOLDS.acceptRate) },
        { label: "入社率", formula: "入社数 ÷ 承諾数", value: funnelKpis.joinRate, isPercent: true, status: statusFromTarget(funnelKpis.joinRate, BOTTLENECK_THRESHOLDS.joinRate) },
        { label: "最終採用率", formula: "入社数 ÷ 応募数", value: funnelKpis.finalHireRate, isPercent: true, status: "good" },
      ],
    },
  ];

  const approachItems: KpiCardItem[] = [
    { label: "送信数", value: dashData.sent_count, isPercent: false, status: "good" },
    {
      label: "開封率", value: openRate, isPercent: true,
      status: statusFromTarget(openRate, 40),
      displayOverride: dashData.sent_count === 0 ? "—" : undefined,
    },
    {
      label: "返信率", value: replyRate, isPercent: true,
      status: statusFromTarget(replyRate, 15),
      displayOverride: dashData.opened_count === 0 ? "—" : undefined,
    },
  ];

  // ── 採用インサイト：正式ファネルKPI（funnelKpis）とダッシュボードと同じ
  //     ボトルネック診断結果（bottleneckIssues）を唯一の情報源として使用する。
  //     ここでは有効応募率等の再計算を行わない。
  const insights = useMemo(
    () =>
      generateInsights(
        { counts: funnelCounts, kpis: funnelKpis },
        bottleneckIssues,
        { sentCount: dashData.sent_count, openRate, replyRate },
        ngData
      ),
    [funnelCounts, funnelKpis, bottleneckIssues, dashData.sent_count, openRate, replyRate, ngData]
  );

  if (loading) return <LoadingState variant="cards" />;
  if (error)   return <ErrorState message={error.message} onRetry={refetch} />;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-7xl space-y-5 md:space-y-6">

        {/* ═════ A. ページヘッダー ═════ */}
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <h1 className="text-xl font-extrabold tracking-tight text-gray-900 md:text-2xl">採用ダッシュボード</h1>
            <p className="mt-1 max-w-2xl text-sm font-medium leading-relaxed text-slate-600 md:text-base">
              いまの採用が健全か、どこで詰まっているかを数秒で判断する
            </p>
          </div>
          <div className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm sm:w-auto">
            <DateFilter value={rangeKey} onChange={setRangeKey} baseDate={BASE_DATE} />
          </div>
        </div>
        <p className="text-xs leading-relaxed text-slate-500">
          ※ 選択期間内に応募された候補者が、その後どの選考段階まで到達したかを集計しています（応募日を基準にした「応募コホート」方式）。
        </p>

        {hasApplications ? (
          <>
            {/*
              MatchHire の価値は「最優先の詰まりを見つけること」であるため、
              最優先アクション（Bottleneck）を現在の採用状況（StatusBand）より
              先に配置する。DOM順と視覚順（PC・モバイルとも）を一致させるため、
              CSS order による表示順の入れ替えは行わない。
            */}
            <div className="flex flex-col gap-5">
              {/* ═════ C. 最優先アクション ═════ */}
              <Bottleneck issues={bottleneckIssues} />

              {/* ═════ B. 現在の採用状況（総合状態 + 主要KPI4項目） ═════ */}
              <StatusBand overallState={overallState} overallDesc={overallDesc} primaryKpis={primaryKpis} />
            </div>

            {/* ═════ D/E. 採用ファネル（主） + KPI詳細（従） ═════ */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,7fr)_minmax(280px,5fr)] lg:items-start">
              <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
                <div className="mb-4 flex items-baseline gap-2">
                  <h2 className="text-sm font-bold text-gray-800 md:text-base">採用ファネル（8段階）</h2>
                  <span className="ml-auto text-[11px] text-gray-400">同一応募の複数面接は重複計上しません</span>
                </div>
                <FunnelChart steps={funnelSteps} warningStages={warningStages} />
              </section>

              <KpiDetail groups={kpiDetailGroups} />
            </div>

            {/* ═════ F. 採用インサイト（補足・下位表示） ═════ */}
            <InsightPanel insights={insights} />
          </>
        ) : (
          <section>
            <h2 className="mb-3 text-sm font-bold text-gray-700">採用ファネル・KPI・ボトルネック診断</h2>
            <EmptyState message="この期間には分析対象となる応募データがありません。期間を変更して確認してください。" />
          </section>
        )}

        {/* ═════ G. アプローチ活動とチャネル（採用ファネルとは別集計） ═════ */}
        <section className="rounded-xl border border-slate-300 bg-slate-100/70 p-4 shadow-sm md:p-6">
          <div className="mb-4 flex items-baseline gap-2">
            <h2 className="text-sm font-bold text-slate-700 md:text-base">母集団形成・アプローチ活動</h2>
            <span className="ml-auto text-[11px] text-slate-500">採用ファネルとは別集計（スカウト・DM）</span>
          </div>
          <div className="space-y-5">
            <div>
              <KpiCards items={approachItems} />
            </div>
            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">チャネル別成果</h3>
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <ChannelChart data={channelData} />
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
