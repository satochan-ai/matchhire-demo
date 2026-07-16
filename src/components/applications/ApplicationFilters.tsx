"use client";

import type { ApplicationRoute } from "@/components/applications/ApplicationRouteBadge";
import type { CandidateStatus, ValidStatus } from "@/components/candidates/CandidateStatusBadge";
import { SearchField } from "@/components/common/SearchField";
import { FilterBar } from "@/components/common/FilterBar";

export interface ApplicationFilterState {
  search: string;
  route: ApplicationRoute | "all";
  validity: ValidStatus | "all";
  status: CandidateStatus | "all";
}

export const DEFAULT_APPLICATION_FILTERS: ApplicationFilterState = {
  search: "",
  route: "all",
  validity: "all",
  status: "all",
};

interface ApplicationFiltersProps {
  filters: ApplicationFilterState;
  onChange: (filters: ApplicationFilterState) => void;
}

const routeOptions: { value: ApplicationRoute | "all"; label: string }[] = [
  { value: "all",    label: "すべての経路" },
  { value: "scout",  label: "スカウト" },
  { value: "dm",     label: "DM" },
  { value: "direct", label: "ダイレクト" },
];

const validityOptions: { value: ValidStatus | "all"; label: string }[] = [
  { value: "all",  label: "すべての有効応募" },
  { value: "有効",  label: "有効" },
  { value: "無効",  label: "無効" },
  { value: "未判定", label: "未判定" },
];

const statusOptions: { value: CandidateStatus | "all"; label: string }[] = [
  { value: "all",   label: "すべてのステータス" },
  { value: "応募受付", label: "応募受付" },
  { value: "書類選考", label: "書類選考" },
  { value: "面接",   label: "面接" },
  { value: "内定",   label: "内定" },
  { value: "承諾",   label: "承諾" },
  { value: "入社",   label: "入社" },
  { value: "不採用",  label: "不採用" },
  { value: "辞退",   label: "辞退" },
];

function selectClass(active: boolean) {
  return `h-10 rounded-lg border px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 ${
    active ? "border-blue-300 bg-blue-50 text-blue-700" : "border-gray-200 bg-white text-gray-700"
  }`;
}

export function ApplicationFilters({ filters, onChange }: ApplicationFiltersProps) {
  const set = <K extends keyof ApplicationFilterState>(
    key: K,
    value: ApplicationFilterState[K]
  ) => onChange({ ...filters, [key]: value });

  const isDefault =
    filters.search.trim() === "" &&
    filters.route === DEFAULT_APPLICATION_FILTERS.route &&
    filters.validity === DEFAULT_APPLICATION_FILTERS.validity &&
    filters.status === DEFAULT_APPLICATION_FILTERS.status;

  return (
    <FilterBar>
      <SearchField
        value={filters.search}
        onChange={(v) => set("search", v)}
        placeholder="候補者名・求人名で検索"
        aria-label="候補者名・求人名で検索"
      />

      <div className="grid grid-cols-2 gap-2 md:contents">
        {/* 応募経路 */}
        <select
          value={filters.route}
          onChange={(e) => set("route", e.target.value as ApplicationRoute | "all")}
          className={selectClass(filters.route !== "all")}
          aria-label="応募経路"
        >
          {routeOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* 有効応募 */}
        <select
          value={filters.validity}
          onChange={(e) => set("validity", e.target.value as ValidStatus | "all")}
          className={selectClass(filters.validity !== "all")}
          aria-label="有効応募"
        >
          {validityOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* ステータス */}
        <select
          value={filters.status}
          onChange={(e) => set("status", e.target.value as CandidateStatus | "all")}
          className={`col-span-2 md:col-auto ${selectClass(filters.status !== "all")}`}
          aria-label="応募ステータス"
        >
          {statusOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {!isDefault && (
        <button
          type="button"
          onClick={() => onChange(DEFAULT_APPLICATION_FILTERS)}
          className="h-10 w-full rounded-lg border border-gray-200 bg-white px-4 text-xs font-medium text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700 md:ml-auto md:w-auto"
        >
          条件をリセット
        </button>
      )}
    </FilterBar>
  );
}
