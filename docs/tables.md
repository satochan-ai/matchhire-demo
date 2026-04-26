# tables.md

## MatchHire：データモデル定義

---

## 1. 概要

採用プロセスを以下の主要エンティティで管理する。

* 候補者（candidates）
* 求人（jobs）
* 接触アクション（outreach_actions）
* 応募（applications）
* 面接（interviews）
* 評価（evaluations）

---

## 2. テーブル定義

---

### 2.1 candidates（候補者）

| カラム        | 型         | 説明   |
| ---------- | --------- | ---- |
| id         | uuid      | 主キー  |
| name       | text      | 氏名   |
| email      | text      | メール  |
| phone      | text      | 電話   |
| skills     | text      | スキル  |
| experience | text      | 経歴   |
| created_at | timestamp | 作成日時 |

---

### 2.2 jobs（求人）

| カラム          | 型         | 説明   |
| ------------ | --------- | ---- |
| id           | uuid      | 主キー  |
| title        | text      | 求人名  |
| description  | text      | 内容   |
| requirements | text      | 必須条件 |
| created_at   | timestamp | 作成日時 |

---

### 2.3 outreach_actions（接触）

| カラム           | 型         | 説明         |
| ------------- | --------- | ---------- |
| id            | uuid      | 主キー        |
| candidate_id  | uuid      | 候補者        |
| job_id        | uuid      | 求人         |
| action_type   | text      | scout / dm |
| sent_at       | timestamp | 送信日時       |
| opened_flag   | boolean   | 開封         |
| replied_flag  | boolean   | 返信         |
| response_type | text      | 返信内容       |
| created_at    | timestamp | 作成日時       |

---

### 2.4 applications（応募）

| カラム            | 型         | 説明                  |
| -------------- | --------- | ------------------- |
| id             | uuid      | 主キー                 |
| candidate_id   | uuid      | 候補者                 |
| job_id         | uuid      | 求人                  |
| route          | text      | direct / scout / dm |
| valid_flag     | boolean   | 有効応募                |
| invalid_reason | text      | 無効理由                |
| applied_at     | timestamp | 応募日時                |

---

### 2.5 interviews（面接）

| カラム            | 型         | 説明          |
| -------------- | --------- | ----------- |
| id             | uuid      | 主キー         |
| application_id | uuid      | 応募          |
| interview_date | timestamp | 面接日         |
| stage          | text      | 1次/2次/最終    |
| result         | text      | pass / fail |
| created_at     | timestamp | 作成日時        |

---

### 2.6 evaluations（評価）

| カラム          | 型         | 説明    |
| ------------ | --------- | ----- |
| id           | uuid      | 主キー   |
| interview_id | uuid      | 面接    |
| score        | integer   | 評価    |
| comment      | text      | コメント  |
| reason       | text      | 不採用理由 |
| created_at   | timestamp | 作成日時  |

---

## 3. リレーション

```id="rel123"
candidates 1:N outreach_actions
candidates 1:N applications
jobs 1:N applications
applications 1:N interviews
interviews 1:N evaluations
```

---

## 4. 設計ポイント

* 候補者と応募は分離（1人が複数応募可能）
* 応募と面接を分離（複数面接対応）
* 上流（outreach）を独立管理
* 有効応募フラグで質を管理

---

以上
