/**
 * スプレッドシート値 → TypeScript 型への変換ユーティリティ
 *
 * GAS は全カラムを文字列で返すため、各 repository で使う共通変換関数をまとめる。
 * mockData（型付きオブジェクト）には適用不要。
 */

/**
 * 空文字・undefined を null に変換する。
 * スプレッドシートの空セルは GAS から "" で返るため。
 */
export function emptyToNull(v: string | undefined): string | null {
  return v === "" || v === undefined ? null : v;
}

/**
 * スプレッドシートの "TRUE" / "FALSE" 文字列（またはチェックボックス boolean）を
 * boolean に変換する。
 */
export function toBoolean(v: string | boolean | undefined): boolean {
  if (typeof v === "boolean") return v;
  const s = String(v ?? "").toUpperCase();
  return s === "TRUE" || s === "1";
}

/**
 * カンマ区切り文字列を trimされた string[] に変換する。
 * 空文字の場合は空配列を返す。
 */
export function toArray(v: string | undefined): string[] {
  if (!v) return [];
  return v.split(",").map((s) => s.trim()).filter(Boolean);
}

/**
 * 数値文字列を number に変換する。
 * パース失敗（NaN）のときは 0 を返す。
 */
export function toNumber(v: string | number | undefined): number {
  const n = Number(v ?? 0);
  return isNaN(n) ? 0 : n;
}
