"use client";

import type { DateRangeKey } from "@/lib/mockData";

interface DateFilterOption {
  key: DateRangeKey;
  label: string;
}

const OPTIONS: DateFilterOption[] = [
  { key: "today",      label: "今日" },
  { key: "this_week",  label: "今週" },
  { key: "this_month", label: "今月" },
  { key: "all",        label: "全期間" },
];

interface DateFilterProps {
  value: DateRangeKey;
  onChange: (key: DateRangeKey) => void;
  /** 現在の基準日（表示用）YYYY-MM-DD */
  baseDate: string;
}

export function DateFilter({ value, onChange, baseDate }: DateFilterProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-xs font-medium text-gray-400 whitespace-nowrap">期間：</span>
      <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-0.5 gap-0.5">
        {OPTIONS.map((opt) => {
          const isActive = value === opt.key;
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => onChange(opt.key)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? "bg-white text-blue-600 shadow-sm font-semibold"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      <span className="text-xs text-gray-400">基準日：{baseDate}</span>
    </div>
  );
}
