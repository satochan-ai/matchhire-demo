"use client";

interface ListEmptyStateProps {
  title: string;
  description: string;
  showReset?: boolean;
  onReset?: () => void;
  resetLabel?: string;
}

/** 一覧シェル内にそのまま置く前提の空状態。カード枠・shadow・背景は追加しない */
export function ListEmptyState({
  title,
  description,
  showReset = false,
  onReset,
  resetLabel = "条件をリセット",
}: ListEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <svg className="mb-3 h-9 w-9 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
      </svg>
      <p className="text-sm font-semibold text-gray-700">{title}</p>
      <p className="mt-1 text-xs text-gray-400">{description}</p>
      {showReset && onReset && (
        <button
          type="button"
          onClick={onReset}
          className="mt-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100"
        >
          {resetLabel}
        </button>
      )}
    </div>
  );
}
