interface FunnelStep {
  label: string;
  count: number;
}

interface Props {
  steps: FunnelStep[];
}

function pct(num: number, den: number) {
  if (den === 0) return 0;
  return Math.round((num / den) * 100);
}

export function JobFunnelCard({ steps }: Props) {
  const maxCount = Math.max(...steps.map((s) => s.count), 1);

  return (
    <div className="space-y-3">
      {steps.map((step, i) => {
        const prev = steps[i - 1];
        const rate = prev ? pct(step.count, prev.count) : 100;
        const barWidth = pct(step.count, maxCount);

        return (
          <div key={step.label}>
            {/* ステージ間の転換率 */}
            {i > 0 && (
              <div className="mb-1 flex items-center gap-1.5 pl-1">
                <svg className="h-3 w-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span className="text-xs text-gray-400">{rate}%</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-right text-xs font-medium text-gray-500">{step.label}</span>
              <div className="flex-1 overflow-hidden rounded-full bg-gray-100 h-5">
                <div
                  className="h-5 rounded-full bg-blue-400 transition-all duration-500"
                  style={{ width: `${barWidth}%` }}
                />
              </div>
              <span className="w-8 shrink-0 text-right text-sm font-semibold text-gray-700">{step.count}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
