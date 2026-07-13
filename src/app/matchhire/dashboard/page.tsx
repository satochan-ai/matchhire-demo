"use client";

import { useState, useMemo } from "react";
import { KpiCards, statusFromTarget, type KpiCardItem } from "@/components/dashboard/KpiCards";
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
import { diagnoseBottlenecks, BOTTLENECK_THRESHOLDS } from "@/lib/bottleneck";
import { generateInsights } from "@/lib/insightEngine";
import { useRawData } from "@/hooks/useRawData";
import { EmptyState } from "@/components/common/EmptyState";

/** mockData の基準日（ダミーデータが 2026-04 に集中しているため固定） */
const BASE_DATE = "2026-04-25";

function pct(numerator: number, denominator: number) {
  if (denominator === 0) return 0;
  return (numerator / denominator) * 100;
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

  const kpiItems: KpiCardItem[] = [
    { label: "有効応募率", value: funnelKpis.validApplicationRate, isPercent: true, status: statusFromTarget(funnelKpis.validApplicationRate, BOTTLENECK_THRESHOLDS.validApplicationRate) },
    { label: "書類通過率", value: funnelKpis.documentPassRate, isPercent: true, status: statusFromTarget(funnelKpis.documentPassRate, BOTTLENECK_THRESHOLDS.documentPassRate) },
    { label: "一次面接化率", value: funnelKpis.firstInterviewRate, isPercent: true, status: statusFromTarget(funnelKpis.firstInterviewRate, BOTTLENECK_THRESHOLDS.firstInterviewRate) },
    { label: "一次面接通過率", value: funnelKpis.firstInterviewPassRate, isPercent: true, status: statusFromTarget(funnelKpis.firstInterviewPassRate, BOTTLENECK_THRESHOLDS.firstInterviewPassRate) },
    { label: "最終面接通過率", value: funnelKpis.finalInterviewPassRate, isPercent: true, status: statusFromTarget(funnelKpis.finalInterviewPassRate, BOTTLENECK_THRESHOLDS.finalInterviewPassRate) },
    { label: "内定率", value: funnelKpis.offerRate, isPercent: true, status: "good" },
    { label: "承諾率", value: funnelKpis.acceptRate, isPercent: true, status: statusFromTarget(funnelKpis.acceptRate, BOTTLENECK_THRESHOLDS.acceptRate) },
    { label: "入社率", value: funnelKpis.joinRate, isPercent: true, status: statusFromTarget(funnelKpis.joinRate, BOTTLENECK_THRESHOLDS.joinRate) },
    { label: "最終採用率", value: funnelKpis.finalHireRate, isPercent: true, status: "good" },
  ];

  const approachItems: KpiCardItem[] = [
    { label: "送信数", value: dashData.sent_count, isPercent: false, status: "good" },
    { label: "開封率", value: openRate, isPercent: true, status: statusFromTarget(openRate, 40) },
    { label: "返信率", value: replyRate, isPercent: true, status: statusFromTarget(replyRate, 15) },
  ];

  // ── ⑥ AIインサイト：正式ファネルKPI（funnelKpis）とダッシュボードと同じ
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

  const hasApplications = funnelCounts.applied > 0;

  if (loading) return <LoadingState variant="cards" />;
  if (error)   return <ErrorState message={error.message} onRetry={refetch} />;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-7xl space-y-6 md:space-y-8">

        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-gray-900 md:text-2xl">ダッシュボード</h1>
            <p className="mt-1 max-w-2xl text-sm font-medium leading-relaxed text-slate-800 md:text-base">
              応募から内定・承諾・入社までを一気通貫で可視化する採用プロセス改善ダッシュボードです。
            </p>
          </div>
          <div className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm sm:w-auto">
            <DateFilter value={rangeKey} onChange={setRangeKey} baseDate={BASE_DATE} />
          </div>
        </div>

        {/* 応募コホート方式の説明 */}
        <p className="text-xs leading-relaxed text-slate-500">
          ※ 選択期間内に応募された候補者が、その後どの選考段階まで到達したかを集計しています（応募日を基準にした「応募コホート」方式）。
        </p>

        {hasApplications ? (
          <>
            {/* ① KPIサマリー */}
            <section>
              <h2 className="mb-4 text-base font-semibold text-gray-700">① KPIサマリー（応募〜入社）</h2>
              <KpiCards items={kpiItems} />
            </section>

            {/* ⑥ AIインサイト */}
            <InsightPanel insights={insights} />

            <div className="grid grid-cols-1 gap-5 md:gap-8 lg:grid-cols-2">
              {/* ② ファネル表示 */}
              <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
                <h2 className="mb-4 text-sm font-semibold text-gray-700 md:mb-5 md:text-base">② 採用ファネル</h2>
                <FunnelChart steps={funnelSteps} />
              </section>

              {/* ③ ボトルネック診断 */}
              <div className="space-y-4 md:space-y-5">
                <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
                  <h2 className="mb-3 text-sm font-semibold text-gray-700 md:mb-4 md:text-base">③ ボトルネック診断</h2>
                  <Bottleneck issues={bottleneckIssues} />
                </section>
              </div>
            </div>
          </>
        ) : (
          <section>
            <h2 className="mb-4 text-base font-semibold text-gray-700">① 採用ファネル・KPI・ボトルネック診断</h2>
            <EmptyState message="この期間には分析対象となる応募データがありません。期間を変更して確認してください。" />
          </section>
        )}

        {/* ④ アプローチ状況（スカウト・DM） */}
        <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
          <h2 className="mb-4 text-sm font-semibold text-gray-700 md:mb-5 md:text-base">④ アプローチ状況（スカウト・DM）</h2>
          <KpiCards items={approachItems} />
        </section>

        {/* ⑤ チャネル比較 */}
        <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
          <h2 className="mb-4 text-sm font-semibold text-gray-700 md:mb-5 md:text-base">⑤ チャネル比較</h2>
          <ChannelChart data={channelData} />
        </section>

      </div>
    </div>
  );
}
