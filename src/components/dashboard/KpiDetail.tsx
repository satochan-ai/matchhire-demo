"use client";

import type { KpiStatus } from "@/components/dashboard/KpiCards";

export interface KpiDetailRow {
  label: string;
  /** 計算式などの補助説明（任意） */
  formula?: string;
  value: number;
  isPercent: boolean;
  status: KpiStatus;
}

export interface KpiDetailGroup {
  groupLabel: string;
  rows: KpiDetailRow[];
}

interface KpiDetailProps {
  groups: KpiDetailGroup[];
}

const CHIP_STYLES: Record<KpiStatus, string> = {
  good:    "bg-green-100 text-green-700 border-green-200",
  warning: "bg-amber-100 text-amber-700 border-amber-200",
  alert:   "bg-red-100 text-red-700 border-red-200",
};

const CHIP_LABEL: Record<KpiStatus, string> = {
  good: "良好",
  warning: "注意",
  alert: "要対応",
};

export function KpiDetail({ groups }: KpiDetailProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-baseline gap-2 border-b border-gray-100 px-5 py-2">
        <h3 className="text-sm font-bold text-gray-800">KPI詳細</h3>
        <span className="ml-auto text-xs text-gray-400">全9項目</span>
      </div>
      {groups.map((group) => (
        <div key={group.groupLabel} className="border-t border-gray-100 first:border-t-0">
          <div className="border-b border-gray-100 bg-slate-50 px-5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">
            {group.groupLabel}
          </div>
          {group.rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center gap-3 border-b border-gray-100 px-5 py-1.5 text-sm last:border-b-0"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate leading-tight text-gray-700">{row.label}</p>
                {row.formula && <p className="truncate text-[10.5px] leading-tight text-gray-400">{row.formula}</p>}
              </div>
              <span className="min-w-[64px] shrink-0 text-right text-base font-extrabold tabular text-gray-900">
                {row.isPercent ? `${row.value.toFixed(1)}%` : row.value.toLocaleString()}
              </span>
              <span className={`shrink-0 rounded-full border px-2 py-0.5 text-center text-[10px] font-bold ${CHIP_STYLES[row.status]}`}>
                {CHIP_LABEL[row.status]}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
