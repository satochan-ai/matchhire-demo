"use client";

import { useState, useMemo } from "react";
import { ApplicationTable } from "@/components/applications/ApplicationTable";
import {
  ApplicationFilters,
  DEFAULT_APPLICATION_FILTERS,
  type ApplicationFilterState,
} from "@/components/applications/ApplicationFilters";
import type { ApplicationRoute } from "@/components/applications/ApplicationRouteBadge";
import type { CandidateStatus, ValidStatus } from "@/components/candidates/CandidateStatusBadge";
import { useRawData } from "@/hooks/useRawData";
import { ListPageHeader } from "@/components/common/ListPageHeader";
import { ListEmptyState } from "@/components/common/ListEmptyState";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import type { Application, Candidate, Job } from "@/lib/mockData";

/** ApplicationTable が要求するフラット型（join済み） */
export interface ApplicationRow {
  id: string;
  appliedAt: string;
  candidateId: string;
  candidateName: string;
  jobTitle: string;
  route: ApplicationRoute;
  validity: ValidStatus;
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

export default function ApplicationsPage() {
  const { data, loading, error, refetch } = useRawData(["applications", "candidates", "jobs"]);
  const [filters, setFilters] = useState<ApplicationFilterState>(DEFAULT_APPLICATION_FILTERS);

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

  const isFiltering =
    filters.search !== DEFAULT_APPLICATION_FILTERS.search ||
    filters.route !== DEFAULT_APPLICATION_FILTERS.route ||
    filters.validity !== DEFAULT_APPLICATION_FILTERS.validity ||
    filters.status !== DEFAULT_APPLICATION_FILTERS.status;

  if (loading) return <LoadingState variant="table" />;
  if (error)   return <ErrorState message={error.message} onRetry={refetch} />;

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-6">

        <ListPageHeader
          title="応募管理"
          description="応募単位の有効判定と選考状況を確認できます"
          filteredCount={filtered.length}
          totalCount={allRows.length}
        />

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <ApplicationFilters filters={filters} onChange={setFilters} />
          {filtered.length === 0 ? (
            <ListEmptyState
              title="該当する応募が見つかりませんでした"
              description="条件を変更するか、フィルタをリセットしてください"
              showReset={isFiltering}
              onReset={() => setFilters(DEFAULT_APPLICATION_FILTERS)}
            />
          ) : (
            <ApplicationTable applications={filtered} />
          )}
        </div>

      </div>
    </div>
  );
}
