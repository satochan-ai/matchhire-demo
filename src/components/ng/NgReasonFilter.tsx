"use client";

import { jobs, owners } from "@/lib/mockData";

export interface NgFilterState {
  jobId: string;    // "" = 全件
  ownerId: string;  // "" = 全件
}

export const DEFAULT_NG_FILTERS: NgFilterState = { jobId: "", ownerId: "" };

interface NgReasonFilterProps {
  filters: NgFilterState;
  onChange: (filters: NgFilterState) => void;
}

function selectClass(active: boolean) {
  return `h-10 w-full rounded-lg border px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 md:w-auto ${
    active ? "border-blue-300 bg-blue-50 text-blue-700" : "border-gray-200 bg-white text-gray-700"
  }`;
}

export function NgReasonFilter({ filters, onChange }: NgReasonFilterProps) {
  const set = <K extends keyof NgFilterState>(key: K, value: string) =>
    onChange({ ...filters, [key]: value });

  const isDefault =
    filters.jobId === DEFAULT_NG_FILTERS.jobId &&
    filters.ownerId === DEFAULT_NG_FILTERS.ownerId;

  return (
    <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
      {/* 求人別 */}
      <select
        value={filters.jobId}
        onChange={(e) => set("jobId", e.target.value)}
        className={selectClass(filters.jobId !== "")}
        aria-label="求人で絞り込み"
      >
        <option value="">すべての求人</option>
        {jobs.map((j) => (
          <option key={j.id} value={j.id}>{j.title}</option>
        ))}
      </select>

      {/* 担当者別 */}
      <select
        value={filters.ownerId}
        onChange={(e) => set("ownerId", e.target.value)}
        className={selectClass(filters.ownerId !== "")}
        aria-label="担当者で絞り込み"
      >
        <option value="">すべての担当者</option>
        {owners.map((o) => (
          <option key={o.id} value={o.id}>{o.name}</option>
        ))}
      </select>

      {!isDefault && (
        <button
          type="button"
          onClick={() => onChange(DEFAULT_NG_FILTERS)}
          className="h-10 w-full rounded-lg border border-gray-200 bg-white px-4 text-xs font-medium text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700 md:ml-auto md:w-auto"
        >
          条件をリセット
        </button>
      )}
    </div>
  );
}
