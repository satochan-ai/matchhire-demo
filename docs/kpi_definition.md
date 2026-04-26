# kpi_definition.md

## MatchHire：KPI定義（完全版）

---

## 1. 概要

本KPIは採用プロセスを以下3段階で定義する。

* 上流：接触（スカウト・DM）
* 中流：応募・有効応募
* 下流：選考・決定

各KPIは必ず「分母・分子」を明確にし、再現性を持たせる。

---

## 2. 上流KPI（接触）

### 2.1 送信数

* sent_count
* 定義：スカウト・DMの送信総数

---

### 2.2 開封数

* opened_count
* 定義：開封された件数

---

### 2.3 開封率

* open_rate = opened_count / sent_count

---

### 2.4 返信数

* replied_count
* 定義：返信があった件数

---

### 2.5 返信率

* reply_rate = replied_count / opened_count

---

### 2.6 応募誘導数

* apply_intent_count
* 定義：応募意思が確認できた数

---

## 3. 中流KPI（応募）

### 3.1 応募数

* application_count
* 定義：全応募数（通常・スカウト・DM含む）

---

### 3.2 有効応募数

* valid_application_count
* 定義：要件を満たし選考対象となる応募

---

### 3.3 応募率

* application_rate = application_count / replied_count

---

### 3.4 有効応募率

* valid_rate = valid_application_count / application_count

---

## 4. 下流KPI（選考）

### 4.1 書類通過数

* document_pass_count

---

### 4.2 書類通過率

* document_pass_rate = document_pass_count / valid_application_count

---

### 4.3 面接数

* interview_count

---

### 4.4 面接化率

* interview_rate = interview_count / valid_application_count

---

### 4.5 内定数

* offer_count

---

### 4.6 内定率

* offer_rate = offer_count / interview_count

---

### 4.7 承諾数

* accept_count

---

### 4.8 承諾率

* accept_rate = accept_count / offer_count

---

### 4.9 入社数

* hire_count

---

### 4.10 入社率

* hire_rate = hire_count / accept_count

---

## 5. 重要派生KPI

### 5.1 最終成果率

* final_conversion = hire_count / sent_count

👉 上流から入社までの総合効率

---

### 5.2 有効応募効率

* efficiency = hire_count / valid_application_count

👉 有効母集団の質評価

---

### 5.3 面接効率

* interview_efficiency = offer_count / interview_count

👉 面接の精度

---

## 6. 分析軸

以下単位で集計可能とする。

* チャネル（scout / dm / direct）
* 求人
* 担当者
* テンプレート
* 期間（日 / 週 / 月）

---

## 7. 設計思想

* 応募数ではなく「有効応募」を基準とする
* 上流→下流を一気通貫で評価
* すべての数値は分母・分子を明確化
* 改善ポイントが特定できる構造

---

以上
