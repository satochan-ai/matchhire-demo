"use client";

import { jobs, owners } from "@/lib/mockData";

export interface NgFilterState {
  jobId: string;    // "" = 全件
  ownerId: string;  // "" = 全件
}

interface NgReasonFilterProps {
  filters: NgFilterState;
  onChange: (filters: NgFilterState) => void;
}

export function NgReasonFilter({ filters, onChange }: NgReasonFilterProps) {
  const set = <K extends keyof NgFilterState>(key: K, value: string) =>
    onChange({ ...filters, [key]: value });

  return (
    <div className="flex flex-wrap gap-3">
      {/* 求人別 */}
      <select
        value={filters.jobId}
        onChange={(e) => set("jobId", e.target.value)}
        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
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
        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
      >
        <option value="">すべての担当者</option>
        {owners.map((o) => (
          <option key={o.id} value={o.id}>{o.name}</option>
        ))}
      </select>
    </div>
  );
}
