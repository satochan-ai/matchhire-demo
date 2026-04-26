"use client";

import { useState, useMemo } from "react";
import { ApplicationTable } from "@/components/applications/ApplicationTable";
import { ApplicationFilters, type ApplicationFilterState } from "@/components/applications/ApplicationFilters";
import type { ApplicationRoute } from "@/components/applications/ApplicationRouteBadge";
import type { ApplicationValidity } from "@/components/applications/ApplicationValidityBadge";
import type { CandidateStatus } from "@/components/candidates/CandidateStatusBadge";
import { useRawData } from "@/hooks/useRawData";
import type { Application, Candidate, Job } from "@/lib/mockData";

/** ApplicationTable が要求するフラット型（join済み） */
export interface ApplicationRow {
  id: string;
  appliedAt: string;
  candidateId: string;
  candidateName: string;
  jobTitle: string;
  route: ApplicationRoute;
  validity: ApplicationValidity;
  invalidReason: string | null;
  status: CandidateStatus;
}

function buildRows(
  applications: Application[],
  candidates: Candidate[],
  jobs: Job[]
): ApplicationRow[] {
  return applications.map((app) => {
    const candidate = candidates.find((c) => c.id === app.candidateId);
    const job       = jobs.find((j) => j.id === app.jobId);
    return {
      id:            app.id,
      appliedAt:     app.appliedAt,
      candidateId:   app.candidateId,
      candidateName: candidate?.name ?? "不明",
      jobTitle:      job?.title      ?? "不明",
      route:         app.channel,
      validity:      app.validity,
      invalidReason: app.invalidReason,
      status:        app.status,
    };
  });
}

const DEFAULT_FILTERS: ApplicationFilterState = {
  search: "",
  route: "all",
  validity: "all",
  status: "all",
};

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-6 animate-pulse">
        <div className="h-8 w-36 rounded bg-gray-200" />
        <div className="h-16 rounded-xl bg-gray-200" />
        <div className="h-64 rounded-xl bg-gray-200" />
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
          <button onClick={onRetry} className="rounded-lg bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700">再試行する</button>
        </div>
      </div>
    </div>
  );
}

export default function ApplicationsPage() {
  const { data, loading, error, refetch } = useRawData(["applications", "candidates", "jobs"]);
  const [filters, setFilters] = useState<ApplicationFilterState>(DEFAULT_FILTERS);

  const allRows = useMemo(
    () => buildRows(data.applications ?? [], data.candidates ?? [], data.jobs ?? []),
    [data]
  );

  const filtered = useMemo(() => {
    return allRows.filter((app) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!app.candidateName.toLowerCase().includes(q) && !app.jobTitle.toLowerCase().includes(q)) return false;
      }
      if (filters.route    !== "all" && app.route    !== filters.route)    return false;
      if (filters.validity !== "all" && app.validity !== filters.validity) return false;
      if (filters.status   !== "all" && app.status   !== filters.status)   return false;
      return true;
    });
  }, [allRows, filters]);

  if (loading) return <PageSkeleton />;
  if (error)   return <PageError message={error.message} onRetry={refetch} />;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">応募管理</h1>
          <p className="mt-1 text-sm text-gray-500">
            {filtered.length} 件 / 全 {allRows.length} 件
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <ApplicationFilters filters={filters} onChange={setFilters} />
        </div>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <ApplicationTable applications={filtered} />
        </div>

      </div>
    </div>
  );
}
