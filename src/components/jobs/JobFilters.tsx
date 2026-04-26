"use client";

import type { JobStatus, EmploymentType } from "@/lib/mockData";

export interface JobFilterState {
  query: string;
  status: JobStatus | "";
  employmentType: EmploymentType | "";
}

interface Props {
  value: JobFilterState;
  onChange: (next: JobFilterState) => void;
}

const STATUS_OPTIONS: Array<JobStatus | ""> = ["", "募集中", "停止", "充足"];
const EMPLOYMENT_OPTIONS: Array<EmploymentType | ""> = ["", "正社員", "契約社員", "業務委託"];

export function JobFilters({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* テキスト検索 */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="求人名・部署で検索"
          value={value.query}
          onChange={(e) => onChange({ ...value, query: e.target.value })}
          className="h-9 w-64 rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
      </div>

      {/* ステータス */}
      <select
        value={value.status}
        onChange={(e) => onChange({ ...value, status: e.target.value as JobStatus | "" })}
        className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>{s === "" ? "ステータス: すべて" : s}</option>
        ))}
      </select>

      {/* 雇用形態 */}
      <select
        value={value.employmentType}
        onChange={(e) => onChange({ ...value, employmentType: e.target.value as EmploymentType | "" })}
        className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
      >
        {EMPLOYMENT_OPTIONS.map((t) => (
          <option key={t} value={t}>{t === "" ? "雇用形態: すべて" : t}</option>
        ))}
      </select>

      {/* リセット */}
      {(value.query || value.status || value.employmentType) && (
        <button
          onClick={() => onChange({ query: "", status: "", employmentType: "" })}
          className="text-xs text-gray-400 hover:text-gray-600 underline"
        >
          リセット
        </button>
      )}
    </div>
  );
}
