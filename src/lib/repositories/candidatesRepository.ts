/**
 * candidatesRepository
 *
 * データソースに応じて candidates を取得し、共通の Candidate 型に正規化して返す。
 *
 * mock  モード → mockData.ts の静的配列を即時 resolve
 * sheets モード → /api/sheets/candidates（Next.js Route Handler）を fetch
 *
 * 将来 Supabase に移行する場合は、このファイルの内部実装だけ差し替えれば
 * hooks / pages 側は変更不要。
 */

import { candidates as mockCandidates, type Candidate } from "@/lib/mockData";
import { getDataSource } from "@/lib/dataSource";
import { emptyToNull, toArray } from "@/lib/repositories/utils";

// ─────────────────────────────────────────
// GAS レスポンス行の生型
// スプレッドシートのカラム名（snake_case）と 1:1 対応する
// ─────────────────────────────────────────

interface SheetsCandidateRow {
  id: string;
  name: string;
  skills: string;       // カンマ区切り → string[]
  bio: string;
  channel: string;
  status: string;
  valid: string;
  updated_at: string;
}

// ─────────────────────────────────────────
// 正規化：GAS 行 → Candidate 型
// ─────────────────────────────────────────

function normalize(row: SheetsCandidateRow): Candidate {
  return {
    id:        row.id,
    name:      row.name,
    skills:    toArray(row.skills),
    bio:       row.bio ?? "",
    channel:   row.channel   as Candidate["channel"],
    status:    row.status    as Candidate["status"],
    valid:     row.valid     as Candidate["valid"],
    updatedAt: row.updated_at,
  };
}

// ─────────────────────────────────────────
// 公開 API
// ─────────────────────────────────────────

/**
 * 候補者一覧を取得する。
 * @throws {Error} sheets モードで /api/sheets/candidates が 200 以外を返した場合
 */
export async function fetchCandidates(): Promise<Candidate[]> {
  const source = getDataSource();

  // ── mock モード ──────────────────────────
  if (source === "mock") {
    return Promise.resolve(mockCandidates);
  }

  // ── csv / sheets モード：Route Handler 経由で取得 ──
  // csv    → /api/csv/candidates    （data/candidates.csv を読み込む）
  // sheets → /api/sheets/candidates （GAS → スプレッドシート）
  const endpoint =
    source === "csv"
      ? "/api/csv/candidates"
      : "/api/sheets/candidates";

  const res = await fetch(endpoint, { cache: "no-store" });

  if (!res.ok) {
    const label = source === "csv" ? "CSV" : "GAS";
    throw new Error(
      `candidates の取得に失敗しました（HTTP ${res.status}）。` +
        `NEXT_PUBLIC_DATA_SOURCE=mock に戻すか、${label} の設定を確認してください。`
    );
  }

  const json = await res.json();

  if (json.error) {
    throw new Error(
      source === "csv"
        ? `CSV エラー: ${json.error}`
        : `GAS エラー: ${json.error}`
    );
  }

  if (!Array.isArray(json.rows)) {
    throw new Error("レスポンスの形式が不正です（rows が配列ではありません）");
  }

  return (json.rows as SheetsCandidateRow[]).map(normalize);
}

/**
 * 指定 ID の候補者を取得する。
 * 現フェーズでは全件取得してフィルタする（GAS が単件 API を持たないため）。
 */
export async function fetchCandidateById(id: string): Promise<Candidate | null> {
  const all = await fetchCandidates();
  return all.find((c) => c.id === id) ?? null;
}
