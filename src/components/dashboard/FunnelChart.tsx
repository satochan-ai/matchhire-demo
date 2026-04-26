"use client";

interface FunnelStep {
  label: string;
  count: number;
}

interface FunnelChartProps {
  steps: FunnelStep[];
}

export function FunnelChart({ steps }: FunnelChartProps) {
  const maxCount = steps[0]?.count ?? 1;

  return (
    <div className="space-y-2">
      {steps.map((step, index) => {
        const widthPct = (step.count / maxCount) * 100;
        const conversionRate =
          index > 0 && steps[index - 1].count > 0
            ? ((step.count / steps[index - 1].count) * 100).toFixed(1)
            : null;

        return (
          <div key={step.label}>
            {conversionRate !== null && (
              <div className="flex items-center gap-2 py-1 pl-4">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span className="text-xs text-gray-500">転換率 {conversionRate}%</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-right text-sm font-medium text-gray-600">
                {step.label}
              </span>
              <div className="flex-1">
                <div
                  className="flex h-9 items-center rounded-md bg-blue-500 px-3 transition-all"
                  style={{ width: `${Math.max(widthPct, 8)}%` }}
                >
                  <span className="text-sm font-bold text-white">
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
