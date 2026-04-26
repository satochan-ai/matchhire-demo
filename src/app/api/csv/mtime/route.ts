/**
 * GET /api/csv/mtime
 *
 * data/*.csv ファイルの最終更新時刻（mtime）の最大値を返す。
 * クライアント側のポーリングで変化を検知し、自動リロードのトリガーに使う。
 *
 * レスポンス例: { "mtime": 1714000000000 }
 */

import { NextResponse } from "next/server";
import fs   from "fs";
import path from "path";

const TABLES = [
  "candidates",
  "jobs",
  "applications",
  "contacts",
  "interviews",
  "evaluations",
];

export async function GET() {
  const dataDir = path.join(process.cwd(), "data");
  let maxMtime = 0;

  for (const table of TABLES) {
    const filePath = path.join(dataDir, `${table}.csv`);
    try {
      const stat = fs.statSync(filePath);
      if (stat.mtimeMs > maxMtime) maxMtime = stat.mtimeMs;
    } catch {
      // ファイルが存在しない場合はスキップ
    }
  }

  return NextResponse.json({ mtime: maxMtime });
}
