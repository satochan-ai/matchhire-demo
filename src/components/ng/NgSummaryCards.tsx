"use client";

import type { NgReasonCount } from "@/lib/mockData";

interface NgSummaryCardsProps {
  /** computeNgReasonMetrics の結果（件数降順ソート済み） */
  reasons: NgReasonCount[];
  /** フィルタ適用後のNG総数 */
  total: number;
}

/**
 * NG理由分析の総括サマリー。
 * 既存集計（computeNgReasonMetrics）の結果だけを表示し、独自スコアや優先度は算出しない。
 */
export function NgSummaryCards({ reasons, total }: NgSummaryCardsProps) {
  const activeKinds = reasons.filter((r) => r.count > 0).length;
  const top = reasons.length > 0 && reasons[0].count > 0 ? reasons[0] : null;

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <p className="text-xs font-medium text-slate-500">NG総数</p>
        <p className="mt-1 text-xl font-bold tabular-nums text-gray-900">
          {total}
          <span className="ml-1 text-xs font-medium text-slate-400">件</span>
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <p className="text-xs font-medium text-slate-500">発生している理由</p>
        <p className="mt-1 text-xl font-bold tabular-nums text-gray-900">
          {activeKinds}
          <span className="ml-1 text-xs font-medium text-slate-400">/ {reasons.length}種類</span>
        </p>
      </div>

      <div className="col-span-2 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm md:col-span-1">
        <p className="text-xs font-medium text-slate-500">最多NG理由</p>
        {top ? (
          <>
            <p className="mt-1 break-words text-sm font-bold leading-snug text-gray-900">
              {top.reason}
            </p>
            <p className="mt-0.5 text-xs tabular-nums text-slate-500">
              {top.count}件（{top.rate.toFixed(1)}%）
            </p>
          </>
        ) : (
          <p className="mt-1 text-sm font-bold text-slate-400">—</p>
        )}
      </div>
    </div>
  );
}
