"use client";

import { useState, useMemo } from "react";
import { CandidateTable } from "@/components/candidates/CandidateTable";
import {
  CandidateFilters,
  DEFAULT_CANDIDATE_FILTERS,
  type FilterState,
} from "@/components/candidates/CandidateFilters";
import { useCandidates } from "@/hooks/useCandidates";
import { ListPageHeader } from "@/components/common/ListPageHeader";
import { ListEmptyState } from "@/components/common/ListEmptyState";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import type { Candidate } from "@/lib/mockData";

// CandidateTable が参照する型を re-export（後方互換）
export type { Candidate };

// ─────────────────────────────────────────
// ページ本体
// ─────────────────────────────────────────

export default function CandidatesPage() {
  const { candidates, loading, error, refetch } = useCandidates();
  const [filters, setFilters] = useState<FilterState>(DEFAULT_CANDIDATE_FILTERS);

  const filtered = useMemo(() => {
    return candidates.filter((c) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchName  = c.name.toLowerCase().includes(q);
        const matchSkill = c.skills.some((s) => s.toLowerCase().includes(q));
        if (!matchName && !matchSkill) return false;
      }
      if (filters.channel !== "all" && c.channel !== filters.channel) return false;
      if (filters.status  !== "all" && c.status  !== filters.status)  return false;
      if (filters.valid   !== "all" && c.valid    !== filters.valid)   return false;
      return true;
    });
  }, [candidates, filters]);

  const isFiltering =
    filters.search !== DEFAULT_CANDIDATE_FILTERS.search ||
    filters.channel !== DEFAULT_CANDIDATE_FILTERS.channel ||
    filters.status !== DEFAULT_CANDIDATE_FILTERS.status ||
    filters.valid !== DEFAULT_CANDIDATE_FILTERS.valid;

  if (loading) return <LoadingState variant="table" />;
  if (error)   return <ErrorState message={error.message} onRetry={refetch} />;

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-6">

        <ListPageHeader
          title="候補者一覧"
          description="候補者の現在ステータスと応募状況を確認できます"
          filteredCount={filtered.length}
          totalCount={candidates.length}
          right={
            process.env.NEXT_PUBLIC_DATA_SOURCE === "sheets" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Sheets 連携中
              </span>
            ) : undefined
          }
        />

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <CandidateFilters filters={filters} onChange={setFilters} />
          {filtered.length === 0 ? (
            <ListEmptyState
              title="該当する候補者が見つかりませんでした"
              description="条件を変更するか、フィルタをリセットしてください"
              showReset={isFiltering}
              onReset={() => setFilters(DEFAULT_CANDIDATE_FILTERS)}
            />
          ) : (
            <CandidateTable candidates={filtered} />
          )}
        </div>

      </div>
    </div>
  );
}
