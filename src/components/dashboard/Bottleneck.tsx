"use client";

import type { BottleneckIssue } from "@/lib/bottleneck";

interface BottleneckProps {
  issues: BottleneckIssue[];
}

const severityStyles: Record<string, { border: string; bg: string; badge: string; text: string }> = {
  alert: {
    border: "border-red-300",
    bg: "bg-red-50",
    badge: "bg-red-100 text-red-700",
    text: "text-red-700",
  },
  warning: {
    border: "border-yellow-300",
    bg: "bg-yellow-50",
    badge: "bg-yellow-100 text-yellow-700",
    text: "text-yellow-700",
  },
  good: {
    border: "border-green-300",
    bg: "bg-green-50",
    badge: "bg-green-100 text-green-700",
    text: "text-green-700",
  },
};

export function Bottleneck({ issues }: BottleneckProps) {
  const top = issues[0];
  if (!top) return null;

  const isGood = top.id === "問題なし";
  const styles = severityStyles[isGood ? "good" : top.severity];

  return (
    <div className="space-y-3">
      <div className={`rounded-xl border p-5 ${styles.border} ${styles.bg}`}>
        <div className="flex items-center gap-3">
          <span className={`rounded-full px-3 py-1 text-sm font-semibold ${styles.badge}`}>
            {isGood ? "Good" : top.severity === "alert" ? "Alert" : "Warning"}
          </span>
          <h3 className={`text-base font-bold ${styles.text}`}>{top.id}</h3>
        </div>
        <p className="mt-3 text-sm text-gray-700">{top.message}</p>
      </div>

      {issues.length > 1 && (
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            他に該当した項目（優先度順）
          </p>
          <ul className="space-y-1.5">
            {issues.slice(1).map((issue) => (
              <li key={issue.id} className="flex items-start gap-2 text-xs text-gray-600">
                <span
                  className={`mt-0.5 inline-block rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                    issue.severity === "alert" ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {issue.severity === "alert" ? "Alert" : "Warning"}
                </span>
                <span>{issue.id}：{issue.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
