"use client";

import type { CandidateStatus, ValidStatus } from "@/components/candidates/CandidateStatusBadge";

export type Channel = "all" | "direct" | "scout" | "dm";

export interface FilterState {
  search: string;
  channel: Channel;
  status: CandidateStatus | "all";
  valid: ValidStatus | "all";
}

interface CandidateFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

const channelOptions: { value: Channel; label: string }[] = [
  { value: "all", label: "すべての経路" },
  { value: "scout", label: "スカウト" },
  { value: "dm", label: "DM" },
  { value: "direct", label: "ダイレクト" },
];

const statusOptions: { value: CandidateStatus | "all"; label: string }[] = [
  { value: "all", label: "すべてのステータス" },
  { value: "応募受付", label: "応募受付" },
  { value: "書類選考", label: "書類選考" },
  { value: "面接", label: "面接" },
  { value: "内定", label: "内定" },
  { value: "承諾", label: "承諾" },
  { value: "入社", label: "入社" },
  { value: "不採用", label: "不採用" },
  { value: "辞退", label: "辞退" },
];

const validOptions: { value: ValidStatus | "all"; label: string }[] = [
  { value: "all", label: "すべての有効応募" },
  { value: "有効", label: "有効" },
  { value: "無効", label: "無効" },
  { value: "未判定", label: "未判定" },
];

export function CandidateFilters({ filters, onChange }: CandidateFiltersProps) {
  const set = <K extends keyof FilterState>(key: K, value: FilterState[K]) =>
    onChange({ ...filters, [key]: value });

  return (
    <div className="flex flex-wrap gap-3">
      {/* 検索 */}
      <div className="relative min-w-[200px] flex-1">
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          placeholder="氏名・スキルで検索"
          value={filters.search}
          onChange={(e) => set("search", e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
      </div>

      {/* 応募経路 */}
      <select
        value={filters.channel}
        onChange={(e) => set("channel", e.target.value as Channel)}
        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
      >
        {channelOptions.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      {/* ステータス */}
      <select
        value={filters.status}
        onChange={(e) => set("status", e.target.value as CandidateStatus | "all")}
        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
      >
        {statusOptions.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      {/* 有効応募 */}
      <select
        value={filters.valid}
        onChange={(e) => set("valid", e.target.value as ValidStatus | "all")}
        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
      >
        {validOptions.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
