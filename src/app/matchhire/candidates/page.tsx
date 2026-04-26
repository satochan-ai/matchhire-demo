"use client";

import { useState, useMemo } from "react";
import { CandidateTable } from "@/components/candidates/CandidateTable";
import { CandidateFilters, type FilterState } from "@/components/candidates/CandidateFilters";
import { useCandidates } from "@/hooks/useCandidates";
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
// ローディングスケルトン
// ─────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="animate-pulse divide-y divide-gray-100">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-4">
            <div className="h-4 w-32 rounded bg-gray-200" />
            <div className="h-4 w-20 rounded bg-gray-200" />
            <div className="ml-auto h-4 w-16 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// エラーバナー
// ─────────────────────────────────────────

interface ErrorBannerProps {
  message: string;
  onRetry: () => void;
}

function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
      <p className="font-semibold mb-1">データの取得に失敗しました</p>
      <p className="text-red-500 mb-4 break-all">{message}</p>
      <button
        onClick={onRetry}
        className="rounded-lg bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700 transition-colors"
      >
        再試行する
      </button>
    </div>
  );
}

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
          <LoadingSkeleton />
        ) : error ? (
          <ErrorBanner message={error.message} onRetry={refetch} />
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <CandidateTable candidates={filtered} />
          </div>
        )}

      </div>
    </div>
  );
}
