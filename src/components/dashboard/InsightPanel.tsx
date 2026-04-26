"use client";

import type { Insight, InsightLevel } from "@/lib/insightEngine";

interface InsightPanelProps {
  insights: Insight[];
}

const levelConfig: Record<
  InsightLevel,
  { icon: string; bg: string; border: string; dot: string; label: string }
> = {
  alert: {
    icon: "⚠️",
    bg: "bg-red-50",
    border: "border-red-200",
    dot: "bg-red-500",
    label: "要対応",
  },
  warning: {
    icon: "💡",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    dot: "bg-yellow-400",
    label: "改善提案",
  },
  info: {
    icon: "ℹ️",
    bg: "bg-blue-50",
    border: "border-blue-200",
    dot: "bg-blue-400",
    label: "情報",
  },
  good: {
    icon: "✅",
    bg: "bg-green-50",
    border: "border-green-200",
    dot: "bg-green-500",
    label: "良好",
  },
};

function InsightItem({ insight }: { insight: Insight }) {
  const cfg = levelConfig[insight.level];
  return (
    <li className={`flex gap-3 rounded-lg border p-3.5 ${cfg.bg} ${cfg.border}`}>
      <span className="mt-0.5 text-base leading-none">{cfg.icon}</span>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className={`inline-block h-1.5 w-1.5 rounded-full shrink-0 ${cfg.dot}`} />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            {cfg.label}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-gray-700">{insight.message}</p>
      </div>
    </li>
  );
}

export function InsightPanel({ insights }: InsightPanelProps) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* ヘッダー */}
      <div className="mb-4 flex items-center gap-2">
        <span className="text-lg">🤖</span>
        <h2 className="text-base font-semibold text-gray-700">AIインサイト</h2>
        <span className="ml-auto rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500">
          ルールベース自動生成
        </span>
      </div>

      {insights.length === 0 ? (
        <p className="text-sm text-gray-400">
          この期間のデータが不足しているため、インサイトを生成できません。
        </p>
      ) : (
        <ul className="space-y-3">
          {insights.map((insight) => (
            <InsightItem key={insight.id} insight={insight} />
          ))}
        </ul>
      )}
    </section>
  );
}
