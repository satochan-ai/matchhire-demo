"use client";

/**
 * useCandidates フック
 *
 * candidatesRepository.fetchCandidates() を呼び出し、
 * loading / error / data / refetch を返す。
 *
 * データソース（mock / sheets）の違いは repository に隠蔽されているため、
 * このフックは意識しない。
 */

import { useState, useEffect, useCallback } from "react";
import type { Candidate } from "@/lib/mockData";
import { fetchCandidates } from "@/lib/repositories/candidatesRepository";

export interface UseCandidatesResult {
  /** 取得済み候補者一覧。ロード中・エラー時は空配列 */
  candidates: Candidate[];
  /** データ取得中は true */
  loading: boolean;
  /** 取得失敗時にエラーオブジェクトをセット。成功時は null */
  error: Error | null;
  /** 再取得をトリガーする関数 */
  refetch: () => void;
}

export function useCandidates(): UseCandidatesResult {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading]       = useState<boolean>(true);
  const [error, setError]           = useState<Error | null>(null);
  // refetch のたびにインクリメントして useEffect を再実行する
  const [revision, setRevision]     = useState<number>(0);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    fetchCandidates()
      .then((data) => {
        if (!cancelled) setCandidates(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setCandidates([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [revision]);

  const refetch = useCallback(() => {
    setRevision((r) => r + 1);
  }, []);

  return { candidates, loading, error, refetch };
}
