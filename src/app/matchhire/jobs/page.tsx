"use client";

import { useState, useMemo } from "react";
import { computeJobMetrics } from "@/lib/mockData";
import { JobFilters, type JobFilterState } from "@/components/jobs/JobFilters";
import { JobTable } from "@/components/jobs/JobTable";
import { useRawData } from "@/hooks/useRawData";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";

const DEFAULT_FILTERS: JobFilterState = { query: "", status: "", employmentType: "" };

export default function JobsPage() {
  const { data, loading, error, refetch } = useRawData(["jobs", "applications", "interviews"]);
  const [filters, setFilters] = useState<JobFilterState>(DEFAULT_FILTERS);

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

  const activeCount = allJobs.filter((j) => j.status === "募集中").length;
  const pausedCount = allJobs.filter((j) => j.status === "停止").length;
  const filledCount = allJobs.filter((j) => j.status === "充足").length;

  if (loading) return <LoadingState variant="cards" />;
  if (error)   return <ErrorState message={error.message} onRetry={refetch} />;

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-8">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">求人管理</h1>
          <p className="mt-1 text-sm text-gray-500">求人ごとの採用状況を確認・管理できます</p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "全求人", value: allJobs.length, color: "text-gray-900" },
            { label: "募集中", value: activeCount,    color: "text-green-600" },
            { label: "停止中", value: pausedCount,    color: "text-gray-400"  },
            { label: "充足",   value: filledCount,    color: "text-blue-600"  },
          ].map((card) => (
            <div key={card.label} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium text-gray-400">{card.label}</p>
              <p className={`mt-1 text-3xl font-bold ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-base font-semibold text-gray-700">求人一覧</h2>
            <JobFilters value={filters} onChange={setFilters} />
          </div>
          <p className="mb-4 text-xs text-gray-400">{filtered.length} 件表示</p>
          <JobTable rows={filtered} />
        </section>

      </div>
    </div>
  );
}
