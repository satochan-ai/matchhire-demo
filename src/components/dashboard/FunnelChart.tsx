"use client";

interface FunnelStep {
  label: string;
  count: number;
}

interface FunnelChartProps {
  steps: FunnelStep[];
  /** bottleneckIssues に基づき警告表示する段階のラベル集合（表示専用、判定はここで行わない） */
  warningStages?: Set<string>;
}

export function FunnelChart({ steps, warningStages }: FunnelChartProps) {
  const maxCount = steps[0]?.count ?? 1;

  return (
    <div className="space-y-1.5">
      {steps.map((step, index) => {
        // 段階間の転換率＝隣接する2段階の件数比。ここでの計算は表示専用の
        // 補助ラベルであり、src/lib/funnel.ts が定義する正式KPIの再実装ではない
        // （応募〜有効応募〜書類通過〜一次面接実施の各遷移は funnel.ts の定義と
        // 数学的に同一の比率になる）。
        const widthPct = (step.count / maxCount) * 100;
        const conversionRate =
          index > 0 && steps[index - 1].count > 0
            ? ((step.count / steps[index - 1].count) * 100).toFixed(1)
            : null;
        const isWarning = warningStages?.has(step.label) ?? false;
        const isZero = step.count === 0;

        return (
          <div key={step.label}>
            {conversionRate !== null && (
              <div className="flex items-center gap-2 py-0.5 pl-4">
                <svg className="h-3.5 w-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span className="text-[11px] text-gray-400 tabular">転換率 {conversionRate}%</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <span className="flex w-24 shrink-0 items-center justify-end gap-1 text-right text-xs font-semibold text-gray-600">
                {step.label}
                {isWarning && (
                  <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-label="要注意の段階" />
                )}
              </span>
              <div className="flex-1">
                <div
                  className={`flex h-8 items-center rounded-md px-3 transition-all ${
                    isZero
                      ? "bg-gray-200"
                      : isWarning
                      ? "bg-amber-500"
                      : "bg-blue-600"
                  }`}
                  style={{ width: `${isZero ? 4 : Math.max(widthPct, 8)}%` }}
                >
                  <span className={`text-sm font-bold tabular ${isZero ? "text-gray-500" : "text-white"}`}>
                    {step.count.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
