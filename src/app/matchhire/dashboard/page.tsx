"use client";

import { useState, useMemo } from "react";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { FunnelChart } from "@/components/dashboard/FunnelChart";
import { Bottleneck } from "@/components/dashboard/Bottleneck";
import { ChannelChart } from "@/components/dashboard/ChannelChart";
import { DateFilter } from "@/components/dashboard/DateFilter";
import { InsightPanel } from "@/components/dashboard/InsightPanel";
import {
  computeDashboardMetrics,
  computeChannelMetrics,
  computeNgReasonMetrics,
  buildDateRange,
  type DateRangeKey,
} from "@/lib/mockData";
import { generateInsights, type BottleneckIssue } from "@/lib/insightEngine";
import { useRawData } from "@/hooks/useRawData";

/** mockData の基準日（ダミーデータが 2026-04 に集中しているため固定） */
const BASE_DATE = "2026-04-25";

function pct(numerator: number, denominator: number) {
  if (denominator === 0) return 0;
  return (numerator / denominator) * 100;
}

const actionsByBottleneck: Record<string, string[]> = {
  "開封率が低い": [
    "件名に候補者名や実績を含めてパーソナライズする",
    "送信時間帯を火〜木の午前中に変更する",
    "件名のA/Bテストを実施する",
  ],
  "返信率が低い": [
    "スカウト文面の冒頭を候補者のキャリアへの共感から始める",
    "ポジションの魅力・成長機会を具体的に記載する",
    "CTA（返信を促す一文）を明確にする",
  ],
  "有効応募率が低い": [
    "スカウト対象条件を現職年収・スキルで絞り込む",
    "ポジション要件と候補者プロフィールのマッチ度を高める",
    "ターゲットペルソナを再定義する",
  ],
  "書類通過率が低い": [
    "書類選考の必須要件・歓迎要件を明文化する",
    "評価シートをブラッシュアップする",
    "面接評価基準を見直す",
  ],
  "問題なし": [
    "送信数を増やしてスケールを目指す",
    "チャネルごとのROIを分析して予算配分を最適化する",
    "内定承諾後のオンボーディング体験を改善する",
  ],
};

// ─────────────────────────────────────────
// ローディング・エラー UI
// ─────────────────────────────────────────

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-8 animate-pulse">
        <div className="h-8 w-48 rounded bg-gray-200" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-gray-200" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="h-64 rounded-xl bg-gray-200" />
          <div className="h-64 rounded-xl bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

function PageError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          <p className="font-semibold mb-1">データの取得に失敗しました</p>
          <p className="text-red-500 mb-4 break-all">{message}</p>
          <button onClick={onRetry} className="rounded-lg bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700 transition-colors">
            再試行する
          </button>
        </div>
      </div>
    </div>
  );
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

  const dashData    = useMemo(() => computeDashboardMetrics(range, data),   [range, data]);
  const channelData = useMemo(() => computeChannelMetrics(range, data),     [range, data]);
  const ngData      = useMemo(() => computeNgReasonMetrics(undefined, data), [data]);

  const openRate         = pct(dashData.opened_count,            dashData.sent_count);
  const replyRate        = pct(dashData.replied_count,           dashData.opened_count);
  const validRate        = pct(dashData.valid_application_count, dashData.replied_count);
  const interviewRate    = pct(dashData.interview_count,         dashData.valid_application_count);
  const offerRate        = pct(dashData.offer_count,             dashData.interview_count);
  const acceptRate       = pct(dashData.accept_count,            dashData.offer_count);
  const documentPassRate = pct(dashData.interview_count,         dashData.valid_application_count);

  const funnelSteps = [
    { label: "送信数",   count: dashData.sent_count },
    { label: "開封数",   count: dashData.opened_count },
    { label: "返信数",   count: dashData.replied_count },
    { label: "有効応募", count: dashData.valid_application_count },
    { label: "面接数",   count: dashData.interview_count },
    { label: "内定数",   count: dashData.offer_count },
  ];

  const bottleneckIssue = ((): BottleneckIssue => {
    if (openRate < 40)         return "開封率が低い";
    if (replyRate < 15)        return "返信率が低い";
    if (validRate < 50)        return "有効応募率が低い";
    if (documentPassRate < 30) return "書類通過率が低い";
    return "問題なし";
  })();

  const actions = actionsByBottleneck[bottleneckIssue] ?? [];

  const insights = useMemo(
    () =>
      generateInsights(
        { sentCount: dashData.sent_count, openRate, replyRate, validRate,
          interviewRate, offerRate, acceptRate, documentPassRate },
        bottleneckIssue,
        ngData
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dashData, openRate, replyRate, validRate, interviewRate, offerRate, acceptRate,
     documentPassRate, bottleneckIssue, ngData]
  );

  if (loading) return <PageSkeleton />;
  if (error)   return <PageError message={error.message} onRetry={refetch} />;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
            <p className="mt-1 text-sm text-gray-500">採用ファネル全体のパフォーマンスを確認できます</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
            <DateFilter value={rangeKey} onChange={setRangeKey} baseDate={BASE_DATE} />
          </div>
        </div>

        {/* ① KPIサマリー */}
        <section>
          <h2 className="mb-4 text-base font-semibold text-gray-700">① KPIサマリー</h2>
          <KpiCards
            sentCount={dashData.sent_count}
            openRate={openRate}
            replyRate={replyRate}
            validRate={validRate}
            interviewRate={interviewRate}
            offerRate={offerRate}
            acceptRate={acceptRate}
          />
        </section>

        {/* ⑥ AIインサイト */}
        <InsightPanel insights={insights} />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* ② ファネル表示 */}
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-base font-semibold text-gray-700">② 採用ファネル</h2>
            <FunnelChart steps={funnelSteps} />
          </section>

          {/* ③④ ボトルネック診断 + アクション提案 */}
          <div className="space-y-5">
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-base font-semibold text-gray-700">③ ボトルネック診断</h2>
              <Bottleneck
                openRate={openRate}
                replyRate={replyRate}
                validRate={validRate}
                documentPassRate={documentPassRate}
              />
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-base font-semibold text-gray-700">④ アクション提案</h2>
              <ul className="space-y-2">
                {actions.map((action, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                      {i + 1}
                    </span>
                    {action}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        {/* ⑤ チャネル比較 */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-base font-semibold text-gray-700">⑤ チャネル比較</h2>
          <ChannelChart data={channelData} />
        </section>

      </div>
    </div>
  );
}
