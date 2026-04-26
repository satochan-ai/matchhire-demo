/**
 * GET /api/sheets/[table]
 *
 * GAS Web App への中継 Route Handler。
 * サーバーサイドのみで実行されるため、SHEETS_API_URL / SHEETS_API_KEY は
 * ブラウザに絶対に渡らない。
 *
 * レスポンス形式（成功時）:
 *   { table: string; rows: unknown[]; fetchedAt: string }
 *
 * レスポンス形式（エラー時）:
 *   { error: string; code: string }
 */

import { NextRequest, NextResponse } from "next/server";

// ─────────────────────────────────────────
// 許可するテーブル名（ホワイトリスト）
// ─────────────────────────────────────────

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

// ─────────────────────────────────────────
// ヘルパー：エラー JSON を返す
// ─────────────────────────────────────────

function errorJson(
  message: string,
  code: string,
  status: number
): NextResponse {
  return NextResponse.json({ error: message, code }, { status });
}

// ─────────────────────────────────────────
// GET ハンドラー
// ─────────────────────────────────────────

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ table: string }> }
): Promise<NextResponse> {
  const { table } = await params;

  // ── 1. テーブル名バリデーション ──────────
  if (!isAllowedTable(table)) {
    return errorJson(
      `"${table}" は対応していないテーブルです。` +
        `対応テーブル: ${ALLOWED_TABLES.join(", ")}`,
      "UNKNOWN_TABLE",
      400
    );
  }

  // ── 2. 環境変数チェック ──────────────────
  const gasUrl = process.env.SHEETS_API_URL;
  const apiKey = process.env.SHEETS_API_KEY;

  if (!gasUrl || !apiKey) {
    const missing: string[] = [];
    if (!gasUrl) missing.push("SHEETS_API_URL");
    if (!apiKey) missing.push("SHEETS_API_KEY");

    return errorJson(
      `GAS が設定されていません。環境変数 ${missing.join(", ")} を .env.local に設定してください。` +
        " mock モードで動作させる場合は NEXT_PUBLIC_DATA_SOURCE=mock を設定してください。",
      "GAS_NOT_CONFIGURED",
      503
    );
  }

  // ── 3. GAS へ fetch ──────────────────────
  // API Key はサーバーサイドのクエリパラメータとして送信する
  // （ブラウザには gasUrl も apiKey も露出しない）
  const targetUrl = `${gasUrl}?table=${encodeURIComponent(table)}&key=${encodeURIComponent(apiKey)}`;

  let gasRes: Response;
  try {
    gasRes = await fetch(targetUrl, {
      cache: "no-store",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return errorJson(
      `GAS へのネットワークリクエストに失敗しました: ${message}`,
      "GAS_NETWORK_ERROR",
      502
    );
  }

  // ── 4. GAS レスポンスのステータス確認 ────
  if (!gasRes.ok) {
    return errorJson(
      `GAS がエラーを返しました（HTTP ${gasRes.status}）。` +
        " GAS のデプロイ設定や API Key を確認してください。",
      "GAS_UPSTREAM_ERROR",
      502
    );
  }

  // ── 5. GAS レスポンスを JSON パース ───────
  let gasJson: unknown;
  try {
    gasJson = await gasRes.json();
  } catch {
    return errorJson(
      "GAS のレスポンスが JSON として解析できませんでした。" +
        " GAS の doGet() が正しい JSON を返しているか確認してください。",
      "GAS_INVALID_JSON",
      502
    );
  }

  // ── 6. GAS 側エラーレスポンスの確認 ──────
  if (
    typeof gasJson === "object" &&
    gasJson !== null &&
    "error" in gasJson
  ) {
    const gasError = (gasJson as { error: string }).error;
    return errorJson(
      `GAS エラー: ${gasError}`,
      "GAS_APP_ERROR",
      502
    );
  }

  // ── 7. rows の型確認 ──────────────────────
  if (
    typeof gasJson !== "object" ||
    gasJson === null ||
    !Array.isArray((gasJson as { rows?: unknown }).rows)
  ) {
    return errorJson(
      "GAS のレスポンス形式が不正です。{ table, rows, fetchedAt } の形式で返してください。",
      "GAS_INVALID_RESPONSE",
      502
    );
  }

  // ── 8. 成功レスポンスをそのまま転送 ───────
  // gasUrl / apiKey はレスポンスに含まれないため、そのまま返して問題ない
  return NextResponse.json(gasJson, { status: 200 });
}
