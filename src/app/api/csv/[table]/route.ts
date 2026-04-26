/**
 * GET /api/csv/[table]
 *
 * プロジェクトルートの data/{table}.csv を読み込んで JSON で返す Route Handler。
 * サーバーサイド専用（fs を使用）。
 *
 * レスポンス（成功）:
 *   { "rows": [ { "id": "1", "name": "山田 太郎", ... }, ... ] }
 *
 * レスポンス（エラー）:
 *   { "error": "...", "code": "..." }
 */

import { NextRequest, NextResponse } from "next/server";
import { readCsvTable } from "@/lib/repositories/csvRepository";

const ALLOWED_TABLES = [
  "candidates",
  "jobs",
  "applications",
  "contacts",
  "interviews",
  "evaluations",
] as const;

type AllowedTable = (typeof ALLOWED_TABLES)[number];

function isAllowedTable(v: string): v is AllowedTable {
  return (ALLOWED_TABLES as readonly string[]).includes(v);
}

function errorJson(message: string, code: string, status: number): NextResponse {
  return NextResponse.json({ error: message, code }, { status });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ table: string }> }
): Promise<NextResponse> {
  const { table } = await params;

  // ── テーブル名バリデーション ───────────
  if (!isAllowedTable(table)) {
    return errorJson(
      `"${table}" は対応していないテーブルです。対応テーブル: ${ALLOWED_TABLES.join(", ")}`,
      "UNKNOWN_TABLE",
      400
    );
  }

  // ── CSV 読み込み ───────────────────────
  try {
    const rows = readCsvTable(table);
    return NextResponse.json({ rows }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);

    // ファイルが存在しない
    if (message.includes("CSV ファイルが見つかりません")) {
      return errorJson(message, "CSV_NOT_FOUND", 404);
    }

    return errorJson(`CSV 読み込みエラー: ${message}`, "CSV_READ_ERROR", 500);
  }
}
