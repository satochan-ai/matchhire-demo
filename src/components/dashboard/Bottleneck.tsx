"use client";

import type { BottleneckIssue } from "@/lib/bottleneck";

interface BottleneckProps {
  /** bottleneckIssues をそのまま渡す。並び替え・フィルタは行わない。 */
  issues: BottleneckIssue[];
}

const severityStyles: Record<string, { stripe: string; bg: string; badge: string; text: string; icon: string }> = {
  alert: {
    stripe: "border-l-red-500",
    bg: "bg-red-50",
    badge: "bg-red-100 text-red-700 border-red-200",
    text: "text-red-700",
    icon: "!",
  },
  warning: {
    stripe: "border-l-amber-500",
    bg: "bg-amber-50",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    text: "text-amber-700",
    icon: "!",
  },
  good: {
    stripe: "border-l-green-500",
    bg: "bg-green-50",
    badge: "bg-green-100 text-green-700 border-green-200",
    text: "text-green-700",
    icon: "✓",
  },
};

export function Bottleneck({ issues }: BottleneckProps) {
  const top = issues[0];
  if (!top) return null;

  const isGood = top.id === "問題なし";
  const styles = severityStyles[isGood ? "good" : top.severity];
  // 補助表示は先頭を除く最大2件、配列順のまま（並び替えない）
  const rest = issues.slice(1, 3);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* 最優先アクション */}
      <div className={`flex gap-3.5 border-l-4 p-4 ${styles.stripe} ${styles.bg} md:p-5`}>
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base font-extrabold text-white ${
          isGood ? "bg-green-500" : top.severity === "alert" ? "bg-red-500" : "bg-amber-500"
        }`}>
          {styles.icon}
        </span>
        <div className="min-w-0">
          <div className="mb-0.5 flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              {isGood ? "現在の状態" : "最優先アクション"}
            </span>
            <span className={`rounded-full border px-2 py-0 text-[10px] font-bold ${styles.badge}`}>
              {isGood ? "Good" : top.severity === "alert" ? "Alert" : "Warning"}
            </span>
          </div>
          <h3 className={`text-base font-extrabold ${styles.text} md:text-lg`}>{top.id}</h3>
          <p className="mt-1 text-sm text-gray-700">{top.message}</p>
        </div>
      </div>

      {/* 補助表示（最大2件・配列順） */}
      {rest.length > 0 && (
        <div className="border-t border-gray-100 px-4 py-3 md:px-5">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
            他に該当した項目（優先度順・最大2件）
          </p>
          <ul className="space-y-2">
            {rest.map((issue) => (
              <li key={issue.id} className="flex items-start gap-2 text-xs text-gray-600">
                <span
                  className={`mt-0.5 shrink-0 rounded-full border px-1.5 py-0 text-[10px] font-bold ${
                    issue.severity === "alert"
                      ? "border-red-200 bg-red-100 text-red-600"
                      : "border-amber-200 bg-amber-100 text-amber-700"
                  }`}
                >
                  {issue.severity === "alert" ? "Alert" : "Warning"}
                </span>
                <span><b className="font-semibold text-gray-800">{issue.id}</b>：{issue.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
