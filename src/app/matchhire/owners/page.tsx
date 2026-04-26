"use client";

import { useState, useMemo } from "react";
import { OwnerSummaryCards } from "@/components/owners/OwnerSummaryCards";
import { OwnerTable } from "@/components/owners/OwnerTable";
import { OwnerPerformanceChart } from "@/components/owners/OwnerPerformanceChart";
import { computeOwnerMetrics } from "@/lib/mockData";
import { useRawData } from "@/hooks/useRawData";

type ChartMode = "count" | "rate";

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8 animate-pulse">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="h-8 w-40 rounded bg-gray-200" />
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-28 rounded-xl bg-gray-200" />)}
        </div>
        <div className="h-64 rounded-xl bg-gray-200" />
      </div>
    </div>
  );
}

function PageError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          <p className="font-semibold mb-1">データの取得に失敗しました</p>
          <p className="text-red-500 mb-4 break-all">{message}</p>
          <button onClick={onRetry} className="rounded-lg bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700">再試行する</button>
        </div>
      </div>
    </div>
  );
}

export default function OwnersPage() {
  const { data, loading, error, refetch } = useRawData([
    "contacts", "applications", "interviews", "candidates",
  ]);
  const [chartMode, setChartMode] = useState<ChartMode>("count");

  const metrics = useMemo(() => computeOwnerMetrics(undefined, data), [data]);

  if (loading) return <PageSkeleton />;
  if (error)   return <PageError message={error.message} onRetry={refetch} />;

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">担当者別分析</h1>
          <p className="mt-1 text-sm text-gray-500">
            担当者ごとの採用ファネルパフォーマンスを確認できます
          </p>
        </div>

        <OwnerSummaryCards metrics={metrics} />

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-base font-semibold text-gray-700">担当者別パフォーマンス比較</h2>
            <div className="flex rounded-lg border border-gray-200 bg-slate-50 p-0.5 gap-0.5">
              {(["count", "rate"] as ChartMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setChartMode(mode)}
                  className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${
                    chartMode === mode
                      ? "bg-white text-blue-600 shadow-sm font-semibold"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {mode === "count" ? "件数" : "率（%）"}
                </button>
              ))}
            </div>
          </div>
          <OwnerPerformanceChart metrics={metrics} mode={chartMode} />
        </div>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-700">担当者一覧</h2>
          </div>
          <OwnerTable metrics={metrics} />
        </div>

      </div>
    </div>
  );
}
