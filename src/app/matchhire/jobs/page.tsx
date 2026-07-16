"use client";

import { useState, useMemo } from "react";
import { computeJobMetrics } from "@/lib/mockData";
import { JobFilters, DEFAULT_JOB_FILTERS, type JobFilterState } from "@/components/jobs/JobFilters";
import { JobTable } from "@/components/jobs/JobTable";
import { useRawData } from "@/hooks/useRawData";
import { ListPageHeader } from "@/components/common/ListPageHeader";
import { ListEmptyState } from "@/components/common/ListEmptyState";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";

export default function JobsPage() {
  const { data, loading, error, refetch } = useRawData(["jobs", "applications", "interviews"]);
  const [filters, setFilters] = useState<JobFilterState>(DEFAULT_JOB_FILTERS);

  const allJobs = useMemo(() => computeJobMetrics(data), [data]);

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    return allJobs.filter((job) => {
      if (q && !job.title.toLowerCase().includes(q) && !job.department.toLowerCase().includes(q)) return false;
      if (filters.status         && job.status         !== filters.status)         return false;
      if (filters.employmentType && job.employmentType !== filters.employmentType) return false;
      return true;
    });
  }, [allJobs, filters]);

  // サマリーカードはフィルタ結果ではなく、常に全求人データを基準とする
  const activeCount = allJobs.filter((j) => j.status === "募集中").length;
  const pausedCount = allJobs.filter((j) => j.status === "停止").length;
  const filledCount = allJobs.filter((j) => j.status === "充足").length;

  const isFiltering =
    filters.query !== DEFAULT_JOB_FILTERS.query ||
    filters.status !== DEFAULT_JOB_FILTERS.status ||
    filters.employmentType !== DEFAULT_JOB_FILTERS.employmentType;

  if (loading) return <LoadingState variant="cards" />;
  if (error)   return <ErrorState message={error.message} onRetry={refetch} />;

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-6">

        <ListPageHeader
          title="求人管理"
          description="求人ごとの応募・選考状況を確認できます"
          filteredCount={filtered.length}
          totalCount={allJobs.length}
        />

        {/* 求人サマリー（既存4項目・全求人基準、フィルタと連動しない） */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "全求人", value: allJobs.length, color: "text-gray-900" },
            { label: "募集中", value: activeCount,    color: "text-green-600" },
            { label: "停止中", value: pausedCount,    color: "text-gray-400"  },
            { label: "充足",   value: filledCount,    color: "text-blue-600"  },
          ].map((card) => (
            <div key={card.label} className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-xs font-medium text-gray-400">{card.label}</p>
              <p className={`mt-0.5 text-2xl font-bold tabular-nums ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* 集計単位の注記（computeJobMetrics はダッシュボードKPIと定義が異なる） */}
        <p className="!mt-2 text-[11px] text-gray-400">
          求人ごとの登録データ件数を集計しています。ダッシュボードの応募コホートKPIとは集計単位が異なります。
        </p>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <JobFilters value={filters} onChange={setFilters} />
          {filtered.length === 0 ? (
            <ListEmptyState
              title="条件に一致する求人がありません"
              description="条件を変更するか、フィルタをリセットしてください"
              showReset={isFiltering}
              onReset={() => setFilters(DEFAULT_JOB_FILTERS)}
            />
          ) : (
            <JobTable rows={filtered} />
          )}
        </div>

      </div>
    </div>
  );
}
