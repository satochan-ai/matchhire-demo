"use client";

import { useState, useMemo } from "react";
import { NgReasonFilter, type NgFilterState } from "@/components/ng/NgReasonFilter";
import { NgReasonChart } from "@/components/ng/NgReasonChart";
import { NgReasonTable } from "@/components/ng/NgReasonTable";
import { computeNgReasonMetrics } from "@/lib/mockData";
import { useRawData } from "@/hooks/useRawData";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";

const DEFAULT_FILTERS: NgFilterState = { jobId: "", ownerId: "" };

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

  if (loading) return <LoadingState variant="cards" />;
  if (error)   return <ErrorState message={error.message} onRetry={refetch} />;

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
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
