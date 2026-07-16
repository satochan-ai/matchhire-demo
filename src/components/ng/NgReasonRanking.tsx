"use client";

import type { NgReasonCount } from "@/lib/mockData";

interface NgReasonRankingProps {
  /** computeNgReasonMetrics の結果（件数降順ソート済み） */
  data: NgReasonCount[];
  total: number;
}

/**
 * NG理由ランキング。
 * 既存集計の件数・割合（rate）をそのまま表示し、バーの長さにも既存の rate だけを使う。
 */
export function NgReasonRanking({ data, total }: NgReasonRankingProps) {
  const active = data.filter((d) => d.count > 0);

  return (
    <div>
      <ol className="space-y-4">
        {active.map((row, i) => (
          <li key={row.reason}>
            <div className="flex items-baseline gap-2">
              <span
                className={`flex h-5 w-5 shrink-0 translate-y-0.5 items-center justify-center self-start rounded-full text-xs font-bold tabular-nums ${
                  i === 0 ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600"
                }`}
              >
                {i + 1}
              </span>
              <span className="min-w-0 flex-1 break-words text-sm font-medium text-slate-800">
                {row.reason}
              </span>
              <span className="shrink-0 text-sm font-semibold tabular-nums text-gray-900">
                {row.count}件
              </span>
              <span className="w-14 shrink-0 text-right text-xs tabular-nums text-slate-500">
                {row.rate.toFixed(1)}%
              </span>
            </div>
            <div className="mt-1.5 h-2 w-full rounded-full bg-slate-100">
              <div
                className={`h-2 rounded-full ${i === 0 ? "bg-blue-600" : "bg-blue-400"}`}
                style={{ width: `${row.rate}%` }}
              />
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-4 flex items-baseline justify-between border-t border-gray-100 pt-3 text-sm">
        <span className="font-semibold text-slate-600">合計</span>
        <span className="font-semibold tabular-nums text-gray-900">
          {total}件
          <span className="ml-2 text-xs font-medium text-slate-400">100%</span>
        </span>
      </div>
    </div>
  );
}
