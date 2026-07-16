"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  NgReasonFilter,
  DEFAULT_NG_FILTERS,
  type NgFilterState,
} from "@/components/ng/NgReasonFilter";
import { NgSummaryCards } from "@/components/ng/NgSummaryCards";
import { NgReasonRanking } from "@/components/ng/NgReasonRanking";
import { NgReasonChart } from "@/components/ng/NgReasonChart";
import { computeNgReasonMetrics } from "@/lib/mockData";
import { useRawData } from "@/hooks/useRawData";
import { ListPageHeader } from "@/components/common/ListPageHeader";
import { ListEmptyState } from "@/components/common/ListEmptyState";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";

export default function NgReasonsPage() {
  const { data, loading, error, refetch } = useRawData(["evaluations", "applications"]);
  const [filters, setFilters] = useState<NgFilterState>(DEFAULT_NG_FILTERS);

  // フィルタ適用後の集計（既存の computeNgReasonMetrics をそのまま使用）
  const ngData = useMemo(
    () => computeNgReasonMetrics(
      { jobId: filters.jobId || undefined, ownerId: filters.ownerId || undefined },
      data
    ),
    [filters, data]
  );

  // フィルタなしの全体集計（分析対象の母数と空状態の判定に使用）
  const allNgData = useMemo(() => computeNgReasonMetrics(undefined, data), [data]);

  const total    = useMemo(() => ngData.reduce((sum, d) => sum + d.count, 0), [ngData]);
  const allTotal = useMemo(() => allNgData.reduce((sum, d) => sum + d.count, 0), [allNgData]);

  const isFiltering =
    filters.jobId !== DEFAULT_NG_FILTERS.jobId ||
    filters.ownerId !== DEFAULT_NG_FILTERS.ownerId;

  if (loading) return <LoadingState variant="cards" />;
  if (error)   return <ErrorState message={error.message} onRetry={refetch} />;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto max-w-6xl space-y-5 md:space-y-6">

        {/* ═════ ページヘッダー ═════ */}
        <div>
          <ListPageHeader
            title="NG理由分析"
            description="面接評価で不採用となった理由と発生傾向を確認できます"
            filteredCount={total}
            totalCount={allTotal}
          />
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            この画面ではNG理由の内訳を確認します。全体のボトルネック判断は
            <Link
              href="/matchhire/dashboard"
              className="rounded text-blue-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1"
            >
              ダッシュボード
            </Link>
            を参照してください。
          </p>
        </div>

        {/* ═════ フィルタ（既存：求人・担当者） ═════ */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <NgReasonFilter filters={filters} onChange={setFilters} />
        </div>

        {allTotal === 0 ? (
          /* データ自体が0件（フィルタ結果0件とは区別する） */
          <EmptyState message="分析対象となる不採用データがまだありません。面接評価が登録されると、ここにNG理由の内訳が表示されます。" />
        ) : total === 0 ? (
          /* フィルタ結果が0件 */
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <ListEmptyState
              title="該当する不採用データが見つかりませんでした"
              description="条件を変更するか、フィルタをリセットしてください"
              showReset={isFiltering}
              onReset={() => setFilters(DEFAULT_NG_FILTERS)}
            />
          </div>
        ) : (
          <>
            {/* ═════ 総括サマリー ═════ */}
            <NgSummaryCards reasons={ngData} total={total} />

            {/* ═════ ランキング（主）＋ 構成比（従） ═════ */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:items-start">
              <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
                <h2 className="mb-4 text-sm font-bold text-gray-800 md:text-base">NG理由ランキング</h2>
                <NgReasonRanking data={ngData} total={total} />
              </section>

              <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
                <h2 className="mb-4 text-sm font-bold text-gray-800 md:text-base">NG理由の構成比</h2>
                <NgReasonChart data={ngData} total={total} />
              </section>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
