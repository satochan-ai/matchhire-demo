"use client";

import { useState, useMemo } from "react";
import { NgReasonFilter, type NgFilterState } from "@/components/ng/NgReasonFilter";
import { NgReasonChart } from "@/components/ng/NgReasonChart";
import { NgReasonTable } from "@/components/ng/NgReasonTable";
import { computeNgReasonMetrics } from "@/lib/mockData";
import { useRawData } from "@/hooks/useRawData";

const DEFAULT_FILTERS: NgFilterState = { jobId: "", ownerId: "" };

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8 animate-pulse">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="h-8 w-56 rounded bg-gray-200" />
        <div className="h-16 rounded-xl bg-gray-200" />
        <div className="grid grid-cols-2 gap-6">
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
      <div className="mx-auto max-w-6xl">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          <p className="font-semibold mb-1">データの取得に失敗しました</p>
          <p className="text-red-500 mb-4 break-all">{message}</p>
          <button onClick={onRetry} className="rounded-lg bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700">再試行する</button>
        </div>
      </div>
    </div>
  );
}

export default function NgReasonsPage() {
  const { data, loading, error, refetch } = useRawData(["evaluations", "applications"]);
  const [filters, setFilters] = useState<NgFilterState>(DEFAULT_FILTERS);

  const ngData = useMemo(
    () => computeNgReasonMetrics(
      { jobId: filters.jobId || undefined, ownerId: filters.ownerId || undefined },
      data
    ),
    [filters, data]
  );

  const total = useMemo(() => ngData.reduce((sum, d) => sum + d.count, 0), [ngData]);

  if (loading) return <PageSkeleton />;
  if (error)   return <PageError message={error.message} onRetry={refetch} />;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-6xl space-y-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">不採用理由（NG理由）分析</h1>
          <p className="mt-1 text-sm text-gray-500">
            面接評価の不採用結果を理由別に集計します
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <NgReasonFilter filters={filters} onChange={setFilters} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-gray-700">① NG理由の割合</h2>
            <NgReasonChart data={ngData} total={total} />
          </section>

          <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-4">
              <h2 className="text-base font-semibold text-gray-700">② NG理由 一覧</h2>
            </div>
            <NgReasonTable data={ngData} total={total} />
          </section>
        </div>

      </div>
    </div>
  );
}
