"use client";

interface LoadingStateProps {
  /** スケルトンのブロック構成。省略時は汎用の3ブロックレイアウト。 */
  variant?: "cards" | "table" | "generic";
}

export function LoadingState({ variant = "generic" }: LoadingStateProps) {
  if (variant === "cards") {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-8 animate-pulse">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="h-8 w-40 rounded bg-gray-200" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 rounded-xl bg-gray-200" />
            ))}
          </div>
          <div className="h-64 rounded-xl bg-gray-200" />
        </div>
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="animate-pulse divide-y divide-gray-100">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4">
              <div className="h-4 w-32 rounded bg-gray-200" />
              <div className="h-4 w-20 rounded bg-gray-200" />
              <div className="ml-auto h-4 w-16 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl animate-pulse space-y-6">
        <div className="h-8 w-40 rounded bg-gray-200" />
        <div className="h-64 rounded-xl bg-gray-200" />
      </div>
    </div>
  );
}
