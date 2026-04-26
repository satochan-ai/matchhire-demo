# Google Sheets 連携設計書

> MatchHire — データソース統合方針  
> 作成日：2026-04-25  
> ステータス：設計済み・未実装

---

## 1. 概要

本ドキュメントは MatchHire のデータソースを Google スプレッドシートに切り替えるための統合設計を定義する。

### 1.1 方針

| 項目 | 方針 |
|---|---|
| マスターデータ | Google スプレッドシートを Single Source of Truth とする |
| アクセス方法 | Google Apps Script (GAS) を API サーバーとして利用 |
| 認証 | GAS のデプロイ URL + `X-API-Key` ヘッダーによる簡易認証 |
| フォールバック | 環境変数 `NEXT_PUBLIC_DATA_SOURCE=mock` でモックデータに戻せる |
| 将来移行先 | Supabase（型定義・正規化ロジックは共用できる設計にする） |

### 1.2 データフロー

```
Google Sheets（マスター）
      │
      │ HTTPS リクエスト
      ▼
GAS Web App（doGet / doPost）
      │
      │ JSON レスポンス
      ▼
src/app/api/sheets/[table]/route.ts        ← GAS 中継 Route Handler（サーバーサイド）
      │
      │ fetch("/api/sheets/candidates")
      ▼
src/lib/repositories/candidatesRepository.ts   ← fetch + 正規化
      │
      │ mockData と同一の型（Candidate[]）
      ▼
src/hooks/useCandidates.ts                 ← loading / error / refetch
      │
      ▼
React コンポーネント（変更なし）
```

---

## 2. 環境変数設計

`.env.local` に以下を設定する。本番用は Vercel / ホスティング環境の環境変数パネルで管理。

```env
# データソース切り替え: "mock" | "sheets"
NEXT_PUBLIC_DATA_SOURCE=mock

# GAS Web App のデプロイ URL（サーバーサイドのみ）
SHEETS_API_URL=https://script.google.com/macros/s/XXXXXXXXXX/exec

# GAS 側で検証する API キー（サーバーサイドのみ）
SHEETS_API_KEY=your-secret-key-here
```

> **セキュリティ注意**
> - `SHEETS_API_URL` および `SHEETS_API_KEY` は `NEXT_PUBLIC_` プレフィックスを付けず、サーバーサイドのみで使用する。
> - フロントから GAS を直接呼ばず、必ず Next.js Route Handler (`/api/sheets/[table]`) 経由で中継する。
> - GAS API Key は GAS スクリプトプロパティに保存し、コードに直書きしない。

---

## 3. GAS（Google Apps Script）設計

### 3.1 スクリプト構成

```
gas/
├── Code.gs          — doGet エントリポイント・ルーティング・認証
├── candidates.gs    — candidates シート読み込み・変換
├── jobs.gs
├── applications.gs
├── contacts.gs
├── interviews.gs
├── evaluations.gs
└── utils.gs         — シート読み込み共通処理（getSheetData など）
```

### 3.2 エンドポイント仕様

GAS Web App は `doGet(e)` のみ（読み取り専用）。クエリパラメータで対象テーブルを指定する。

| パラメータ | 説明 | 例 |
|---|---|---|
| `table` | 取得対象テーブル名 | `candidates` |
| `key` | API キー | `your-secret-key-here` |

**リクエスト例**
```
GET https://script.google.com/macros/s/XXXXXX/exec?table=candidates&key=SECRET
```

**レスポンス（共通フォーマット）**
```json
{
  "table": "candidates",
  "rows": [
    { "id": "1", "name": "山田 太郎", "skills": "Java,Spring Boot", ... }
  ],
  "fetchedAt": "2026-04-25T10:00:00.000Z"
}
```

**エラーレスポンス**
```json
{
  "error": "Unauthorized",
  "status": 401
}
```

### 3.3 GAS 認証・ルーティング（Code.gs の概要）

```javascript
function doGet(e) {
  // API Key 認証
  const apiKey = PropertiesService.getScriptProperties().getProperty("API_KEY");
  if (e.parameter.key !== apiKey) {
    return jsonResponse({ error: "Unauthorized", status: 401 });
  }

  // テーブルルーティング
  const table = e.parameter.table;
  const handlers = { candidates, jobs, applications, contacts, interviews, evaluations };
  if (!handlers[table]) {
    return jsonResponse({ error: "Unknown table", status: 400 });
  }

  const rows = handlers[table]();
  return jsonResponse({ table, rows, fetchedAt: new Date().toISOString() });
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### 3.4 GAS 共通ユーティリティ（utils.gs の概要）

```javascript
/**
 * 指定シートの全行をヘッダーをキーとしたオブジェクト配列に変換する
 * @param {string} sheetName
 * @returns {Object[]}
 */
function getSheetData(sheetName) {
  const ss     = SpreadsheetApp.getActiveSpreadsheet();
  const sheet  = ss.getSheetByName(sheetName);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  return values.slice(1)
    .filter(row => row[0] !== "")   // 空行スキップ
    .map(row => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = row[i] ?? ""; });
      return obj;
    });
}
```

---

## 4. Next.js 側の実装設計

### 4.1 ディレクトリ構成（追加分）

```
src/
├── lib/
│   ├── mockData.ts                         — 既存・変更なし
│   ├── dataSource.ts                       — NEW: 環境変数に基づきソース選択
│   └── repositories/
│       ├── index.ts                        — NEW: 全 repository を再エクスポート
│       ├── candidatesRepository.ts         — NEW: fetch + 正規化
│       ├── jobsRepository.ts               — NEW
│       ├── applicationsRepository.ts       — NEW
│       ├── contactsRepository.ts           — NEW
│       ├── interviewsRepository.ts         — NEW
│       └── evaluationsRepository.ts        — NEW
├── hooks/
│   ├── useCandidates.ts                    — NEW: loading / error / refetch
│   ├── useJobs.ts                          — NEW
│   └── useApplications.ts                 — NEW
└── app/
    └── api/
        └── sheets/
            └── [table]/
                └── route.ts               — NEW: GAS 中継 Route Handler
```

### 4.2 `dataSource.ts` の設計

```typescript
// src/lib/dataSource.ts

export type DataSource = "mock" | "sheets";

export function getDataSource(): DataSource {
  const env = process.env.NEXT_PUBLIC_DATA_SOURCE;
  return env === "sheets" ? "sheets" : "mock";
}
```

### 4.3 Repository パターン（candidates の例）

```typescript
// src/lib/repositories/candidatesRepository.ts

import { candidates as mockCandidates } from "@/lib/mockData";
import type { Candidate } from "@/lib/mockData";
import { getDataSource } from "@/lib/dataSource";

/** GAS レスポンス行の生型（スプレッドシートのカラム名に対応） */
interface SheetsCandidateRow {
  id: string;
  name: string;
  skills: string;       // カンマ区切り文字列 → string[] に変換
  bio: string;
  channel: string;
  status: string;
  valid: string;
  updated_at: string;
}

/** GAS 行 → mockData 型に正規化 */
function normalize(row: SheetsCandidateRow): Candidate {
  return {
    id:        row.id,
    name:      row.name,
    skills:    row.skills ? row.skills.split(",").map((s) => s.trim()) : [],
    bio:       row.bio,
    channel:   row.channel   as Candidate["channel"],
    status:    row.status    as Candidate["status"],
    valid:     row.valid     as Candidate["valid"],
    updatedAt: row.updated_at,
  };
}

export async function fetchCandidates(): Promise<Candidate[]> {
  if (getDataSource() === "mock") {
    return Promise.resolve(mockCandidates);    // フォールバック
  }

  const res = await fetch("/api/sheets/candidates", { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch candidates: ${res.status}`);
  const json = await res.json();
  return (json.rows as SheetsCandidateRow[]).map(normalize);
}
```

### 4.4 React Hook の設計

```typescript
// src/hooks/useCandidates.ts
"use client";

import { useState, useEffect } from "react";
import type { Candidate } from "@/lib/mockData";
import { fetchCandidates } from "@/lib/repositories/candidatesRepository";

interface UseCandidatesResult {
  candidates: Candidate[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useCandidates(): UseCandidatesResult {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<Error | null>(null);
  const [tick, setTick]             = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchCandidates()
      .then((data) => { if (!cancelled) setCandidates(data); })
      .catch((err)  => { if (!cancelled) setError(err instanceof Error ? err : new Error(String(err))); })
      .finally(()   => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [tick]);

  return { candidates, loading, error, refetch: () => setTick((t) => t + 1) };
}
```

### 4.5 Route Handler（GAS 中継）の設計

```typescript
// src/app/api/sheets/[table]/route.ts

import { NextRequest, NextResponse } from "next/server";

const ALLOWED_TABLES = [
  "candidates", "jobs", "applications",
  "contacts",  "interviews", "evaluations",
] as const;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ table: string }> }
) {
  const { table } = await params;

  if (!(ALLOWED_TABLES as readonly string[]).includes(table)) {
    return NextResponse.json({ error: "Unknown table" }, { status: 400 });
  }

  const gasUrl = process.env.SHEETS_API_URL;
  const apiKey = process.env.SHEETS_API_KEY;

  if (!gasUrl || !apiKey) {
    return NextResponse.json({ error: "GAS not configured" }, { status: 503 });
  }

  try {
    const res = await fetch(`${gasUrl}?table=${table}&key=${apiKey}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json({ error: "GAS upstream error" }, { status: 502 });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: "Network error" }, { status: 502 });
  }
}
```

### 4.6 ページ側の差し替えイメージ（candidates page）

```typescript
// 変更前：mockData を直接インポート
import { candidates } from "@/lib/mockData";

export default function CandidatesPage() {
  // candidates は静的配列
  const filtered = useMemo(() => candidates.filter(...), [filters]);
  ...
}

// ──────────────────────────────────────

// 変更後：hook に差し替え（3行変更）
import { useCandidates } from "@/hooks/useCandidates";

export default function CandidatesPage() {
  const { candidates, loading, error } = useCandidates();

  if (loading) return <LoadingSkeleton />;
  if (error)   return <ErrorBanner message={error.message} />;

  // 以降は変更なし
  const filtered = useMemo(() => candidates.filter(...), [candidates, filters]);
  ...
}
```

---

## 5. キャッシュ戦略

| テーブル | Route Handler の cache 設定 | 理由 |
|---|---|---|
| candidates | `no-store` | 選考状況は常に最新が必要 |
| jobs | `revalidate: 300` | 求人変更は頻繁ではない |
| applications | `no-store` | 応募ステータスはリアルタイム性が高い |
| contacts | `revalidate: 60` | スカウト送信はほぼリアルタイム |
| interviews | `no-store` | 面接結果は即時反映が必要 |
| evaluations | `no-store` | 評価入力は即時反映が必要 |

---

## 6. エラー設計

| エラー種別 | HTTP | UI 表示 |
|---|---|---|
| GAS 環境変数未設定 | 503 | 「データソース未設定」バナー |
| GAS レスポンスエラー（4xx/5xx） | 502 | 「データ取得失敗」＋リトライボタン |
| 認証失敗（API Key 不一致） | 401 | 「認証エラー。管理者に連絡してください」 |
| 不明テーブル指定 | 400 | 開発時のみ表示（本番は到達しない） |
| 正規化失敗（型キャスト不一致） | — | コンソール警告、不正行をスキップして残りを返す |
| mock フォールバック | — | `NEXT_PUBLIC_DATA_SOURCE=mock` で即時切り替え |

---

## 7. Supabase 移行パス

Repository 関数のシグネチャ（引数・戻り値型）を固定することで、hook・ページの変更ゼロで移行できる。

```
フェーズ 0（現在）
  mockData.ts → ページが直接 import

フェーズ 1（本設計）
  GAS + sheetsRepository.fetchCandidates()
      → useCandidates() → ページ

フェーズ 2（将来）
  Supabase Client → supabaseRepository.fetchCandidates()
      → useCandidates() → ページ（hook・ページは無変更）
```

- 正規化ロジック（`normalize()`）は Supabase 版でも再利用可能。
- Supabase カラム名を `snake_case` で統一しておくことで変換処理が共用できる。
- Supabase 移行時は `candidatesRepository.ts` の内部実装だけ差し替えれば完了。

---

## 8. 実装フェーズ計画

| フェーズ | 作業内容 | 優先度 | 対応ファイル |
|---|---|---|---|
| **1** | `dataSource.ts` 実装 | 高 | `src/lib/dataSource.ts` |
| **2** | `candidatesRepository.ts` + `useCandidates` 実装 | 高 | `src/lib/repositories/`, `src/hooks/` |
| **3** | Route Handler 実装 | 高 | `src/app/api/sheets/[table]/route.ts` |
| **4** | GAS スクリプト作成・スプレッドシート整備・デプロイ | 高 | `gas/` |
| **5** | `.env.local` 設定・candidates ページ差し替え・動作確認 | 高 | `src/app/hire/candidates/page.tsx` |
| **6** | 残テーブルの repository・hook 実装 | 中 | 各 repository / hook |
| **7** | 全ページを hook に差し替え | 中 | 各 page.tsx |
| **8** | Supabase 移行（repository 内部実装差し替えのみ） | 低 | 各 repository |
