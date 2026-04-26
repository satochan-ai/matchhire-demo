/**
 * csvRepository.ts
 *
 * プロジェクトルートの data/*.csv を読み込んで
 * ヘッダーをキーとしたオブジェクト配列に変換するユーティリティ。
 *
 * ・サーバーサイド（Route Handler / Server Component）専用
 * ・fs / path を使用するため、クライアントバンドルに含めてはいけない
 * ・CSV 仕様
 *     - 1 行目: ヘッダー行（カラム名）
 *     - ダブルクォートで囲まれたフィールドは内部カンマ・改行を許容
 *     - 空行はスキップ
 */

import fs   from "fs";
import path from "path";

// ─────────────────────────────────────────
// 型
// ─────────────────────────────────────────

export type CsvRow = Record<string, string>;

// ─────────────────────────────────────────
// CSV パーサー（RFC 4180 準拠・最小実装）
// ─────────────────────────────────────────

/**
 * CSV 文字列を CsvRow[] に変換する。
 * ダブルクォートで囲まれたフィールド内のカンマ・改行・エスケープ済みクォート ("")
 * を正しく処理する。
 *
 * @param csvText  生の CSV 文字列
 * @returns        ヘッダーをキーとしたオブジェクトの配列
 */
export function parseCsv(csvText: string): CsvRow[] {
  // CRLF → LF に正規化
  const normalized = csvText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  const lines = splitCsvLines(normalized);
  if (lines.length === 0) return [];

  const headers = parseFields(lines[0]);

  const rows: CsvRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === "") continue;            // 空行スキップ

    const fields = parseFields(line);
    const row: CsvRow = {};
    headers.forEach((header, idx) => {
      row[header] = fields[idx] ?? "";
    });

    // id カラムが空の行はスキップ（ヘッダーの最初のカラムを id とみなす）
    if (headers[0] && row[headers[0]] === "") continue;

    rows.push(row);
  }

  return rows;
}

/**
 * CSV テキストをクォートを考慮しながら行単位に分割する。
 * クォートで囲まれたフィールド内の改行は行の区切りとして扱わない。
 */
function splitCsvLines(text: string): string[] {
  const lines: string[] = [];
  let current = "";
  let inQuote = false;

  for (let i = 0; i < text.length; i++) {
    const ch   = text[i];
    const next = text[i + 1];

    if (ch === '"') {
      if (inQuote && next === '"') {
        // エスケープされたクォート ("")
        current += '"';
        i++;
      } else {
        inQuote = !inQuote;
        current += ch;
      }
    } else if (ch === "\n" && !inQuote) {
      lines.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim() !== "") lines.push(current);

  return lines;
}

/**
 * CSV の 1 行をフィールドの配列に分解する。
 * クォートで囲まれたフィールドの前後のクォートを除去し、
 * 内部の "" を " に戻す。
 */
function parseFields(line: string): string[] {
  const fields: string[] = [];
  let i     = 0;

  while (i <= line.length) {
    if (i === line.length) {
      fields.push("");
      break;
    }

    if (line[i] === '"') {
      // クォートフィールド
      let field = "";
      i++; // 開きクォートをスキップ
      while (i < line.length) {
        if (line[i] === '"') {
          if (line[i + 1] === '"') {
            field += '"';
            i += 2;
          } else {
            i++; // 閉じクォートをスキップ
            break;
          }
        } else {
          field += line[i];
          i++;
        }
      }
      fields.push(field);
      // 次のカンマをスキップ
      if (line[i] === ",") i++;
    } else {
      // 非クォートフィールド
      const end = line.indexOf(",", i);
      if (end === -1) {
        fields.push(line.slice(i));
        break;
      }
      fields.push(line.slice(i, end));
      i = end + 1;
    }
  }

  return fields;
}

// ─────────────────────────────────────────
// ファイル読み込み
// ─────────────────────────────────────────

/** 許可するテーブル名（ディレクトリトラバーサル対策） */
const ALLOWED_TABLES = new Set([
  "candidates",
  "jobs",
  "applications",
  "contacts",
  "interviews",
  "evaluations",
]);

/**
 * プロジェクトルートの data/{table}.csv を読み込んで CsvRow[] を返す。
 *
 * @param table  テーブル名（allowedTables に含まれる必要がある）
 * @throws {Error} テーブル名が不正 / ファイルが存在しない場合
 */
export function readCsvTable(table: string): CsvRow[] {
  if (!ALLOWED_TABLES.has(table)) {
    throw new Error(`"${table}" は CSV 対応テーブルではありません。`);
  }

  const filePath = path.join(process.cwd(), "data", `${table}.csv`);

  if (!fs.existsSync(filePath)) {
    throw new Error(
      `CSV ファイルが見つかりません: data/${table}.csv\n` +
      "プロジェクトルートの data/ フォルダに CSV ファイルを配置してください。"
    );
  }

  const text = fs.readFileSync(filePath, "utf-8");
  return parseCsv(text);
}
