"use client";

import type { JobStatus, EmploymentType } from "@/lib/mockData";
import { SearchField } from "@/components/common/SearchField";
import { FilterBar } from "@/components/common/FilterBar";

export interface JobFilterState {
  query: string;
  status: JobStatus | "";
  employmentType: EmploymentType | "";
}

export const DEFAULT_JOB_FILTERS: JobFilterState = { query: "", status: "", employmentType: "" };

interface Props {
  value: JobFilterState;
  onChange: (next: JobFilterState) => void;
}

const STATUS_OPTIONS: Array<JobStatus | ""> = ["", "募集中", "停止", "充足"];
const EMPLOYMENT_OPTIONS: Array<EmploymentType | ""> = ["", "正社員", "契約社員", "業務委託"];

function selectClass(active: boolean) {
  return `h-10 rounded-lg border px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 ${
    active ? "border-blue-300 bg-blue-50 text-blue-700" : "border-gray-200 bg-white text-gray-700"
  }`;
}

export function JobFilters({ value, onChange }: Props) {
  const isDefault =
    value.query === DEFAULT_JOB_FILTERS.query &&
    value.status === DEFAULT_JOB_FILTERS.status &&
    value.employmentType === DEFAULT_JOB_FILTERS.employmentType;

  return (
    <FilterBar>
      <SearchField
        value={value.query}
        onChange={(v) => onChange({ ...value, query: v })}
        placeholder="求人名・部署で検索"
        aria-label="求人名・部署で検索"
      />

      <div className="grid grid-cols-2 gap-2 md:contents">
        {/* ステータス */}
        <select
          value={value.status}
          onChange={(e) => onChange({ ...value, status: e.target.value as JobStatus | "" })}
          className={selectClass(value.status !== "")}
          aria-label="求人ステータス"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s === "" ? "ステータス: すべて" : s}</option>
          ))}
        </select>

        {/* 雇用形態 */}
        <select
          value={value.employmentType}
          onChange={(e) => onChange({ ...value, employmentType: e.target.value as EmploymentType | "" })}
          className={selectClass(value.employmentType !== "")}
          aria-label="雇用形態"
        >
          {EMPLOYMENT_OPTIONS.map((t) => (
            <option key={t} value={t}>{t === "" ? "雇用形態: すべて" : t}</option>
          ))}
        </select>
      </div>

      {!isDefault && (
        <button
          type="button"
          onClick={() => onChange(DEFAULT_JOB_FILTERS)}
          className="h-10 w-full rounded-lg border border-gray-200 bg-white px-4 text-xs font-medium text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700 md:ml-auto md:w-auto"
        >
          条件をリセット
        </button>
      )}
    </FilterBar>
  );
}
