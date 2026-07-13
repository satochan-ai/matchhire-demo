"use client";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  /** true の場合、min-h-screen を伴うページ全体レイアウトで表示する */
  fullPage?: boolean;
}

function ErrorCard({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
      <p className="font-semibold mb-1">データの取得に失敗しました</p>
      <p className="text-red-500 mb-4 break-all">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-lg bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700 transition-colors"
        >
          再試行する
        </button>
      )}
    </div>
  );
}

export function ErrorState({ message, onRetry, fullPage = true }: ErrorStateProps) {
  if (!fullPage) return <ErrorCard message={message} onRetry={onRetry} />;

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <ErrorCard message={message} onRetry={onRetry} />
      </div>
    </div>
  );
}
