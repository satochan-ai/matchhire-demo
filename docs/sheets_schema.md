# Google Sheets スキーマ定義書

> MatchHire — スプレッドシート構造定義  
> 作成日：2026-04-25  
> ステータス：設計済み・未実装

---

## 共通ルール

| ルール | 内容 |
|---|---|
| ヘッダー行 | 1行目をカラム名として使用（GAS の `getSheetData()` で自動読み取り） |
| カラム命名 | `snake_case`（Supabase 移行時もそのまま使える） |
| ID フォーマット | `c1`, `j1`, `a1` などプレフィックス付き文字列（mockData 互換） |
| 日付フォーマット | `YYYY-MM-DD`（スプレッドシートのセル書式は「テキスト」に設定） |
| 真偽値 | `TRUE` / `FALSE`（スプレッドシートのチェックボックス、またはテキスト） |
| NULL 相当 | 空セル（GAS 側で空文字 `""` として取得し、repository で `null` に変換） |
| 配列フィールド | カンマ区切りテキスト（例: `"Java,Spring Boot"`）→ repository で `split(",")` |
| 空行スキップ | `id` カラムが空の行はスキップ（GAS `utils.gs` で処理） |

---

## 1. candidates シート

**用途**: 候補者マスター  
**mockData 対応型**: `Candidate`

| カラム名 | 型 | 必須 | 説明 | 例 |
|---|---|---|---|---|
| `id` | string | ✅ | 候補者 ID（一意） | `c1` |
| `name` | string | ✅ | 氏名 | `山田 太郎` |
| `skills` | string | | スキル（カンマ区切り） | `Java,Spring Boot` |
| `bio` | string | | 経歴概要 | `大手SIerにて5年間…` |
| `channel` | string | ✅ | 接触経路 `scout` / `dm` / `direct` | `scout` |
| `status` | string | ✅ | 選考ステータス ※1 | `書類選考` |
| `valid` | string | ✅ | 有効応募判定 `有効` / `無効` / `未判定` | `有効` |
| `updated_at` | string | ✅ | 最終更新日（YYYY-MM-DD） | `2026-04-24` |

**※1 status の選択肢**  
`応募受付` / `書類選考` / `面接` / `内定` / `承諾` / `入社` / `不採用` / `辞退`

**正規化マッピング（GAS 行 → Candidate 型）**

| GAS カラム | Candidate フィールド | 変換 |
|---|---|---|
| `id` | `id` | そのまま |
| `name` | `name` | そのまま |
| `skills` | `skills` | `split(",").map(trim)` |
| `bio` | `bio` | そのまま |
| `channel` | `channel` | そのまま（型キャスト） |
| `status` | `status` | そのまま（型キャスト） |
| `valid` | `valid` | そのまま（型キャスト） |
| `updated_at` | `updatedAt` | キャメルケースに変換 |

---

## 2. jobs シート

**用途**: 求人マスター  
**mockData 対応型**: `Job`

| カラム名 | 型 | 必須 | 説明 | 例 |
|---|---|---|---|---|
| `id` | string | ✅ | 求人 ID | `j1` |
| `title` | string | ✅ | 求人タイトル | `バックエンドエンジニア（Java）` |
| `department` | string | ✅ | 部署 | `エンジニアリング` |
| `status` | string | ✅ | 募集状態 `募集中` / `停止` / `充足` | `募集中` |
| `employment_type` | string | ✅ | 雇用形態 `正社員` / `契約社員` / `業務委託` | `正社員` |
| `description` | string | | 求人概要（自由文） | `大規模システムを担当する…` |
| `requirements` | string | | 必須条件（カンマ区切り） | `Java実務経験3年以上,REST API設計経験` |

**正規化マッピング（GAS 行 → Job 型）**

| GAS カラム | Job フィールド | 変換 |
|---|---|---|
| `id` | `id` | そのまま |
| `title` | `title` | そのまま |
| `department` | `department` | そのまま |
| `status` | `status` | そのまま（型キャスト） |
| `employment_type` | `employmentType` | キャメルケースに変換 |
| `description` | `description` | そのまま |
| `requirements` | `requirements` | `split(",").map(trim)` |

---

## 3. applications シート

**用途**: 応募管理（候補者と求人の紐付け）  
**mockData 対応型**: `Application`

| カラム名 | 型 | 必須 | 説明 | 例 |
|---|---|---|---|---|
| `id` | string | ✅ | 応募 ID | `a1` |
| `applied_at` | string | ✅ | 応募日（YYYY-MM-DD） | `2026-04-20` |
| `candidate_id` | string | ✅ | 候補者 ID（→ candidates.id） | `c1` |
| `job_id` | string | ✅ | 求人 ID（→ jobs.id） | `j1` |
| `owner_id` | string | ✅ | 担当者 ID（→ owners.id） | `o1` |
| `channel` | string | ✅ | 応募経路 `scout` / `dm` / `direct` | `scout` |
| `validity` | string | ✅ | 有効応募判定 `有効` / `無効` / `未判定` | `有効` |
| `invalid_reason` | string | | 無効理由（任意） | `ポジション不一致` |
| `status` | string | ✅ | 選考ステータス ※1 | `書類選考` |
| `document_result` | string | ✅ | 書類選考結果 `通過` / `不通過` / `審査中` / `未実施` | `審査中` |
| `interview_stage` | string | | 面接進行状況 | `2次面接` |
| `has_offer` | boolean | ✅ | 内定フラグ | `FALSE` |

**正規化マッピング（GAS 行 → Application 型）**

| GAS カラム | Application フィールド | 変換 |
|---|---|---|
| `id` | `id` | そのまま |
| `applied_at` | `appliedAt` | キャメルケースに変換 |
| `candidate_id` | `candidateId` | キャメルケースに変換 |
| `job_id` | `jobId` | キャメルケースに変換 |
| `owner_id` | `ownerId` | キャメルケースに変換 |
| `channel` | `channel` | そのまま（型キャスト） |
| `validity` | `validity` | そのまま（型キャスト） |
| `invalid_reason` | `invalidReason` | 空文字 → `null` |
| `status` | `status` | そのまま（型キャスト） |
| `document_result` | `documentResult` | キャメルケースに変換（型キャスト） |
| `interview_stage` | `interviewStage` | キャメルケースに変換 |
| `has_offer` | `hasOffer` | `"TRUE"` → `true`（文字列 → boolean） |

---

## 4. contacts シート

**用途**: スカウト・DM 送信履歴  
**mockData 対応型**: `Contact`

| カラム名 | 型 | 必須 | 説明 | 例 |
|---|---|---|---|---|
| `id` | string | ✅ | 接触履歴 ID | `ct1` |
| `candidate_id` | string | ✅ | 候補者 ID | `c1` |
| `owner_id` | string | ✅ | 担当者 ID | `o1` |
| `date` | string | ✅ | 送信日（YYYY-MM-DD） | `2026-04-01` |
| `channel` | string | ✅ | 送信経路 `scout` / `dm` | `scout` |
| `opened` | boolean | ✅ | 開封フラグ | `TRUE` |
| `replied` | boolean | ✅ | 返信フラグ | `FALSE` |

**正規化マッピング（GAS 行 → Contact 型）**

| GAS カラム | Contact フィールド | 変換 |
|---|---|---|
| `id` | `id` | そのまま |
| `candidate_id` | `candidateId` | キャメルケースに変換 |
| `owner_id` | `ownerId` | キャメルケースに変換 |
| `date` | `date` | そのまま |
| `channel` | `channel` | そのまま（型キャスト） |
| `opened` | `opened` | `"TRUE"` → `true` |
| `replied` | `replied` | `"TRUE"` → `true` |

---

## 5. interviews シート

**用途**: 面接記録  
**mockData 対応型**: `Interview`

| カラム名 | 型 | 必須 | 説明 | 例 |
|---|---|---|---|---|
| `id` | string | ✅ | 面接 ID | `i1` |
| `application_id` | string | ✅ | 応募 ID（→ applications.id） | `a1` |
| `candidate_id` | string | ✅ | 候補者 ID（→ candidates.id） | `c1` |
| `date` | string | ✅ | 面接日（YYYY-MM-DD） | `2026-04-21` |
| `interviewer` | string | ✅ | 面接担当者名 | `田中 部長` |
| `result` | string | ✅ | 面接結果 `通過` / `不採用` / `保留` / `未確定` | `通過` |
| `comment` | string | | 面接コメント | `コミュニケーション能力が高く…` |

**正規化マッピング（GAS 行 → Interview 型）**

| GAS カラム | Interview フィールド | 変換 |
|---|---|---|
| `id` | `id` | そのまま |
| `application_id` | `applicationId` | キャメルケースに変換 |
| `candidate_id` | `candidateId` | キャメルケースに変換 |
| `date` | `date` | そのまま |
| `interviewer` | `interviewer` | そのまま |
| `result` | `result` | そのまま（型キャスト） |
| `comment` | `comment` | そのまま |

---

## 6. evaluations シート

**用途**: 面接評価フォーム入力結果  
**mockData 対応型**: `Evaluation`

| カラム名 | 型 | 必須 | 説明 | 例 |
|---|---|---|---|---|
| `id` | string | ✅ | 評価 ID | `e1` |
| `interview_id` | string | ✅ | 面接 ID（→ interviews.id） | `i1` |
| `application_id` | string | ✅ | 応募 ID（→ applications.id） | `a1` |
| `candidate_id` | string | ✅ | 候補者 ID（→ candidates.id） | `c1` |
| `evaluated_at` | string | ✅ | 評価日（YYYY-MM-DD） | `2026-04-21` |
| `grade` | string | ✅ | 総合評価 `A` / `B` / `C` / `D` | `A` |
| `result` | string | ✅ | 合否判定 `通過` / `不採用` / `保留` | `通過` |
| `technical_score` | number | ✅ | 技術スコア（1〜5） | `4` |
| `communication_score` | number | ✅ | コミュニケーションスコア（1〜5） | `5` |
| `motivation_score` | number | ✅ | モチベーションスコア（1〜5） | `4` |
| `culture_fit_score` | number | ✅ | カルチャーフィットスコア（1〜5） | `4` |
| `comment` | string | | 評価コメント | `技術力・人柄ともに申し分なし` |
| `ng_reason` | string | | NG 理由（不採用時のみ） ※2 | `スキル不足` |

**※2 ng_reason の選択肢**  
`スキル不足` / `経験不足` / `カルチャーフィット不足` / `志向性不一致` / `条件不一致` / `他社決定` / `辞退`

**正規化マッピング（GAS 行 → Evaluation 型）**

| GAS カラム | Evaluation フィールド | 変換 |
|---|---|---|
| `id` | `id` | そのまま |
| `interview_id` | `interviewId` | キャメルケースに変換 |
| `application_id` | `applicationId` | キャメルケースに変換 |
| `candidate_id` | `candidateId` | キャメルケースに変換 |
| `evaluated_at` | `evaluatedAt` | キャメルケースに変換 |
| `grade` | `grade` | そのまま（型キャスト） |
| `result` | `result` | そのまま（型キャスト） |
| `technical_score` | `technicalScore` | `Number(value)` |
| `communication_score` | `communicationScore` | `Number(value)` |
| `motivation_score` | `motivationScore` | `Number(value)` |
| `culture_fit_score` | `cultureFitScore` | `Number(value)` |
| `comment` | `comment` | そのまま |
| `ng_reason` | `ngReason` | 空文字 → `null`、型キャスト |

---

## 7. owners シート（参考）

**用途**: 担当者マスター（将来的に管理対象にする場合）  
**mockData 対応型**: `Owner`

| カラム名 | 型 | 必須 | 説明 | 例 |
|---|---|---|---|---|
| `id` | string | ✅ | 担当者 ID | `o1` |
| `name` | string | ✅ | 氏名 | `鈴木 一郎` |
| `department` | string | ✅ | 部署 | `人事部` |

> 現フェーズでは GAS からの動的取得は不要。mockData の固定値を使用する。

---

## 8. スプレッドシート設定チェックリスト

スプレッドシートを作成する際の設定手順。

- [ ] 新規スプレッドシートを作成
- [ ] シート名を英語（`candidates`, `jobs`, `applications`, `contacts`, `interviews`, `evaluations`）に設定
- [ ] 1行目にヘッダー（本書のカラム名）を入力
- [ ] 日付カラム（`applied_at`, `date`, `updated_at` 等）のセル書式を**「テキスト」**に設定
- [ ] boolean カラムはチェックボックス挿入、またはデータの入力規則で `TRUE/FALSE` のみ許可
- [ ] GAS スクリプトをスプレッドシートに紐付けて作成
- [ ] GAS スクリプトプロパティに `API_KEY` を設定
- [ ] GAS を「ウェブアプリとしてデプロイ」→「全員がアクセス可能（認証済みユーザー）」に設定
- [ ] デプロイ URL を `.env.local` の `SHEETS_API_URL` に設定
- [ ] `NEXT_PUBLIC_DATA_SOURCE=sheets` に切り替えて動作確認

---

## 9. 型キャスト・変換 共通ルール（正規化ユーティリティ）

```typescript
// src/lib/repositories/utils.ts

/** 空文字・undefined を null に変換 */
export function emptyToNull(v: string | undefined): string | null {
  return v === "" || v === undefined ? null : v;
}

/** スプレッドシートの TRUE/FALSE 文字列を boolean に変換 */
export function toBoolean(v: string | boolean): boolean {
  if (typeof v === "boolean") return v;
  return v === "TRUE" || v === "true" || v === "1";
}

/** カンマ区切り文字列を string[] に変換 */
export function toArray(v: string): string[] {
  return v ? v.split(",").map((s) => s.trim()).filter(Boolean) : [];
}

/** 数値文字列を number に変換（失敗時は 0） */
export function toNumber(v: string | number): number {
  const n = Number(v);
  return isNaN(n) ? 0 : n;
}
```
