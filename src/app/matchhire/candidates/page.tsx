"use client";

import { useState, useMemo } from "react";
import { CandidateTable } from "@/components/candidates/CandidateTable";
import { CandidateFilters, type FilterState } from "@/components/candidates/CandidateFilters";
import { useCandidates } from "@/hooks/useCandidates";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import type { Candidate } from "@/lib/mockData";

// CandidateTable が参照する型を re-export（後方互換）
export type { Candidate };

const DEFAULT_FILTERS: FilterState = {
  search: "",
  channel: "all",
  status: "all",
  valid: "all",
};

// ─────────────────────────────────────────
// ページ本体
// ─────────────────────────────────────────

export default function CandidatesPage() {
  const { candidates, loading, error, refetch } = useCandidates();
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

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

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">候補者一覧</h1>
            <p className="mt-1 text-sm text-gray-500">
              {loading
                ? "読み込み中…"
                : `${filtered.length} 件 / 全 ${candidates.length} 件`}
            </p>
          </div>

          {/* sheets モード時のデータソース表示バッジ */}
          {!loading && !error && process.env.NEXT_PUBLIC_DATA_SOURCE === "sheets" && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Sheets 連携中
            </span>
          )}
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <CandidateFilters filters={filters} onChange={setFilters} />
        </div>

        {/* ローディング / エラー / テーブル */}
        {loading ? (
          <LoadingState variant="table" />
        ) : error ? (
          <ErrorState message={error.message} onRetry={refetch} fullPage={false} />
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <CandidateTable candidates={filtered} />
          </div>
        )}

      </div>
    </div>
  );
}
