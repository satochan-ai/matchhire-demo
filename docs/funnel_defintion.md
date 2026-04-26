# funnel_definition.md

## MatchHire：採用ファネル定義

---

## 1. 概要

本ファネルは、採用プロセスを以下の3層で定義する。

* 上流：接触（アウトバウンド活動）
* 中流：応募・有効応募
* 下流：選考・決定

各フェーズをKPIで接続し、ボトルネック分析を可能にする。

---

## 2. ファネル全体構造

```id="f1a2b3"
【上流】接触
送信数
 ↓
開封数
 ↓
返信数

【中流】母集団
応募数
 ↓
有効応募数

【下流】選考
書類通過数
 ↓
面接数
 ↓
内定数
 ↓
承諾数
 ↓
入社数
```

---

## 3. フェーズ別定義

---

### 3.1 上流ファネル（接触）

#### 指標

* sent_count（送信数）
* opened_count（開封数）
* replied_count（返信数）

#### KPI

* 開封率 = opened_count / sent_count
* 返信率 = replied_count / opened_count

#### 意味

* スカウト文面・対象選定の質を評価
* 開封されなければスタートしない
* 返信されなければ応募に繋がらない

---

### 3.2 中流ファネル（応募）

#### 指標

* application_count（応募数）
* valid_application_count（有効応募数）

#### KPI

* 応募率 = application_count / replied_count
* 有効応募率 = valid_application_count / application_count

#### 意味

* 応募の“量”ではなく“質”を評価
* 有効応募が次工程の精度を決める

---

### 3.3 下流ファネル（選考）

#### 指標

* document_pass_count（書類通過数）
* interview_count（面接数）
* offer_count（内定数）
* accept_count（承諾数）
* hire_count（入社数）

#### KPI

* 書類通過率 = document_pass_count / valid_application_count
* 面接化率 = interview_count / valid_application_count
* 内定率 = offer_count / interview_count
* 承諾率 = accept_count / offer_count
* 入社率 = hire_count / accept_count

---

## 4. ボトルネック判定ロジック

### 上流ボトルネック

* 開封率が低い → タイトル/対象ミス
* 返信率が低い → 文面/魅力不足

### 中流ボトルネック

* 有効応募率が低い → ターゲットズレ
* 応募率が低い → 誘導不足

### 下流ボトルネック

* 書類通過率低い → 要件ミスマッチ
* 面接通過率低い → 評価/見極め問題
* 承諾率低い → 条件/魅力不足

---

## 5. 分析軸

以下単位で比較可能にする。

* チャネル別（scout / dm / direct）
* テンプレ別
* 求人別
* 担当者別

---

## 6. 特徴

* 応募前（送信）からファネル化
* 有効応募を基準に設計
* 営業ファネルと同構造
* 改善ポイントが明確になる

---

以上
