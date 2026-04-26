"use client";

/**
 * useCsvAutoReload
 *
 * CSV モード時のみ動作する自動リロードフック。
 * /api/csv/mtime を POLL_INTERVAL ミリ秒ごとにポーリングし、
 * data/*.csv のいずれかが更新されたことを検知したら refetch() を呼ぶ。
 *
 * mock / sheets モードでは何もしない（早期 return）。
 */

import { useEffect, useRef } from "react";
import { getDataSource } from "@/lib/dataSource";

/** ポーリング間隔（ミリ秒） */
const POLL_INTERVAL = 3_000;

export function useCsvAutoReload(refetch: () => void) {
  // 直前に取得した mtime を保持する ref（再レンダリングを起こさない）
  const prevMtime = useRef<number | null>(null);

  useEffect(() => {
    // CSV モード以外は何もしない
    if (getDataSource() !== "csv") return;

    let cancelled = false;

    const check = async () => {
      try {
        const res = await fetch("/api/csv/mtime", { cache: "no-store" });
        if (!res.ok || cancelled) return;

        const { mtime } = (await res.json()) as { mtime: number };

        if (prevMtime.current !== null && mtime !== prevMtime.current) {
          // mtime が変化 → CSV が更新されたのでデータを再取得
          refetch();
        }

        prevMtime.current = mtime;
      } catch {
        // ネットワークエラーは無視（次のポーリングで再試行）
      }
    };

    // 初回チェック（ベースライン mtime を記録するだけ。refetch は呼ばない）
    check();

    const timerId = setInterval(check, POLL_INTERVAL);

    return () => {
      cancelled = true;
      clearInterval(timerId);
    };
  // refetch は useCallback で安定しているため依存に含める
  }, [refetch]);
}
