"use client";

/**
 * useRawData
 *
 * 複数テーブルを並列フェッチして RawData として返す汎用フック。
 * ページは必要なテーブル名だけを指定することで無駄なフェッチを避ける。
 *
 * 使用例:
 *   const { data, loading, error } = useRawData(["contacts", "applications"]);
 *   const metrics = computeDashboardMetrics(range, data);
 */

import { useState, useEffect, useCallback } from "react";
import type { RawData } from "@/lib/mockData";
import { fetchCandidates }   from "@/lib/repositories/candidatesRepository";
import { fetchJobs }         from "@/lib/repositories/jobsRepository";
import { fetchApplications } from "@/lib/repositories/applicationsRepository";
import { fetchContacts }     from "@/lib/repositories/contactsRepository";
import { fetchInterviews }   from "@/lib/repositories/interviewsRepository";
import { fetchEvaluations }  from "@/lib/repositories/evaluationsRepository";

export type TableName =
  | "candidates"
  | "jobs"
  | "applications"
  | "contacts"
  | "interviews"
  | "evaluations";

export interface UseRawDataResult {
  data: RawData;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

const FETCHERS: Record<TableName, () => Promise<RawData[keyof RawData]>> = {
  candidates:   fetchCandidates,
  jobs:         fetchJobs,
  applications: fetchApplications,
  contacts:     fetchContacts,
  interviews:   fetchInterviews,
  evaluations:  fetchEvaluations,
};

export function useRawData(tables: TableName[]): UseRawDataResult {
  const [data, setData]       = useState<RawData>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError]     = useState<Error | null>(null);
  const [revision, setRevision] = useState<number>(0);

  // tables 配列の文字列化をキーにして依存を安定させる
  const tableKey = tables.slice().sort().join(",");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const promises = tables.map((table) =>
      FETCHERS[table]().then((rows) => [table, rows] as [TableName, RawData[keyof RawData]])
    );

    Promise.all(promises)
      .then((results) => {
        if (cancelled) return;
        const next: RawData = {};
        results.forEach(([table, rows]) => {
          (next as Record<string, unknown>)[table] = rows;
        });
        setData(next);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err : new Error(String(err)));
        setData({});
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableKey, revision]);

  const refetch = useCallback(() => setRevision((r) => r + 1), []);

  return { data, loading, error, refetch };
}
