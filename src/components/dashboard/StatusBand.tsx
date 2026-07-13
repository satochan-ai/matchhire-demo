"use client";

import type { KpiCardItem, KpiStatus } from "@/components/dashboard/KpiCards";

export type OverallState = "good" | "warning" | "alert" | "no-data";

export interface StatusBandProps {
  overallState: OverallState;
  overallDesc: string;
  /** 固定4項目（応募数・有効応募率・一次面接化率・内定率）。値は呼び出し元で計算済みのものを渡す。 */
  primaryKpis: KpiCardItem[];
}

const OVERALL_STYLES: Record<OverallState, { label: string; icon: string; text: string; bg: string }> = {
  good:    { label: "良好",     icon: "✓", text: "text-green-700",  bg: "bg-green-50" },
  warning: { label: "注意",     icon: "!", text: "text-amber-700",  bg: "bg-amber-50" },
  alert:   { label: "要対応",   icon: "!", text: "text-red-700",    bg: "bg-red-50" },
  "no-data": { label: "データなし", icon: "–", text: "text-slate-500", bg: "bg-slate-50" },
};

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

export function StatusBand({ overallState, overallDesc, primaryKpis }: StatusBandProps) {
  const s = OVERALL_STYLES[overallState];

  return (
    <div className="grid grid-cols-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm sm:grid-cols-[176px_1fr]">
      {/* 総合状態 */}
      <div className={`flex flex-col justify-center gap-1.5 border-b border-gray-200 px-5 py-4 sm:border-b-0 sm:border-r ${s.bg}`}>
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">総合状態</span>
        <span className={`flex items-center gap-2 text-lg font-extrabold ${s.text}`}>
          <span aria-hidden>{s.icon}</span>
          {s.label}
        </span>
        <span className="text-xs text-gray-500">{overallDesc}</span>
      </div>

      {/* 主要KPI（固定4項目） */}
      <div className="grid grid-cols-2 sm:grid-cols-4">
        {primaryKpis.map((item, i) => (
          <div
            key={item.label}
            className={`flex flex-col gap-0.5 border-gray-200 px-4 py-3.5 ${
              i % 2 === 0 ? "border-r" : "sm:border-r"
            } ${i >= 2 ? "border-t sm:border-t-0" : ""} last:border-r-0`}
          >
            <span className="flex items-center gap-1.5 text-[11px] text-gray-500">
              {item.label}
              <span className={`rounded-full border px-1.5 py-0 text-[9px] font-bold ${CHIP_STYLES[item.status]}`}>
                {CHIP_LABEL[item.status]}
              </span>
            </span>
            <span className="text-xl font-extrabold tabular text-gray-900 md:text-2xl">
              {item.isPercent ? `${item.value.toFixed(1)}%` : item.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
