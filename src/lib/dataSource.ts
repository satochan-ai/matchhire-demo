/**
 * データソース切り替えユーティリティ
 *
 * 環境変数 NEXT_PUBLIC_DATA_SOURCE で制御する。
 *   "mock"   → mockData.ts の静的データを使用（デフォルト）
 *   "sheets" → GAS 経由でスプレッドシートを取得
 *
 * 将来 Supabase を追加する場合は DataSource に "supabase" を足し、
 * 各 repository で分岐を追加するだけでよい。
 */

export type DataSource = "mock" | "csv" | "sheets";

/**
 * 現在のデータソースを返す。
 * 環境変数が未設定または未知の値のときは "mock" にフォールバックする。
 *
 * | 値       | 挙動                                              |
 * |----------|---------------------------------------------------|
 * | "mock"   | mockData.ts の静的データを即時返却（デフォルト）   |
 * | "csv"    | /api/csv/[table] 経由で data/*.csv を読み込む      |
 * | "sheets" | /api/sheets/[table] 経由で GAS → スプレッドシート |
 */
export function getDataSource(): DataSource {
  const env = process.env.NEXT_PUBLIC_DATA_SOURCE;
  if (env === "csv")    return "csv";
  if (env === "sheets") return "sheets";
  return "mock";
}
