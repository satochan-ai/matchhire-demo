"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { OwnerSummaryCards } from "@/components/owners/OwnerSummaryCards";
import { OwnerTable } from "@/components/owners/OwnerTable";
import { OwnerPerformanceChart } from "@/components/owners/OwnerPerformanceChart";
import { computeOwnerMetrics } from "@/lib/mockData";
import { useRawData } from "@/hooks/useRawData";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";

type ChartMode = "count" | "rate";

export default function OwnersPage() {
  const { data, loading, error, refetch } = useRawData([
    "contacts", "applications", "interviews", "candidates",
  ]);
  const [chartMode, setChartMode] = useState<ChartMode>("count");

  // 既存の computeOwnerMetrics をそのまま使用（並び順は owners 定義順）
  const metrics = useMemo(() => computeOwnerMetrics(undefined, data), [data]);

  if (loading) return <LoadingState variant="cards" />;
  if (error)   return <ErrorState message={error.message} onRetry={refetch} />;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-7xl space-y-5 md:space-y-6">

        {/* ═════ ページヘッダー ═════ */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">担当者分析</h1>
          <p className="mt-1 text-sm text-gray-500">
            担当者ごとの応募状況と選考進捗を比較できます
          </p>
          <p className="mt-1 text-sm text-gray-500">
            担当者 <span className="tabular-nums">{metrics.length}</span> 名
          </p>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            この画面では担当者ごとの活動状況と選考進捗を確認します。採用全体のボトルネックは
            <Link
              href="/matchhire/dashboard"
              className="rounded text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
            >
              ダッシュボード
            </Link>
            を参照してください。
          </p>
        </div>

        {metrics.length === 0 ? (
          /* データ自体が0件（担当者マスタが空）の場合は比較表示を描画しない */
          <EmptyState message="分析対象となる担当者データがありません。" />
        ) : (
          <>
            {/* ═════ 総括サマリー ═════ */}
            <OwnerSummaryCards metrics={metrics} />

            {/* ═════ 担当者別比較（グラフ） ═════ */}
            <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-sm font-bold text-gray-800 md:text-base">担当者別比較</h2>
                <div className="flex gap-0.5 rounded-lg border border-gray-200 bg-slate-50 p-0.5">
                  {(["count", "rate"] as ChartMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setChartMode(mode)}
                      aria-pressed={chartMode === mode}
                      className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                        chartMode === mode
                          ? "bg-white font-semibold text-blue-600 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {mode === "count" ? "件数" : "率（%）"}
                    </button>
                  ))}
                </div>
              </div>
              <OwnerPerformanceChart metrics={metrics} mode={chartMode} />
            </section>

            {/* ═════ 担当者別詳細一覧 ═════ */}
            <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-4 py-4 md:px-6">
                <h2 className="text-sm font-bold text-gray-800 md:text-base">担当者一覧</h2>
              </div>
              <OwnerTable metrics={metrics} />
            </section>
          </>
        )}

      </div>
    </div>
  );
}
