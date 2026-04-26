/**
 * MatchHire Mock Data Store
 *
 * Supabase 移行時は各テーブルへの SELECT クエリに置き換える。
 * 型定義は Supabase の generated types と揃えた命名にしている。
 */

// ─────────────────────────────────────────
// 型定義
// ─────────────────────────────────────────

export type CandidateStatus =
  | "応募受付"
  | "書類選考"
  | "面接"
  | "内定"
  | "承諾"
  | "入社"
  | "不採用"
  | "辞退";

export type ValidStatus = "有効" | "無効" | "未判定";

export type Channel = "scout" | "dm" | "direct";

export type DocumentResult = "通過" | "不通過" | "審査中" | "未実施";

export type InterviewResult = "通過" | "不採用" | "保留" | "未確定";

export type EvaluationGrade = "A" | "B" | "C" | "D";

export type EvaluationResult = "通過" | "不採用" | "保留";

export type NgReason =
  | "スキル不足"
  | "経験不足"
  | "カルチャーフィット不足"
  | "志向性不一致"
  | "条件不一致"
  | "他社決定"
  | "辞退";

// ─────────────────────────────────────────
// Owners（担当者）
// ─────────────────────────────────────────

export interface Owner {
  id: string;
  name: string;
  department: string;
}

export const owners: Owner[] = [
  { id: "o1", name: "田中 一郎", department: "採用部" },
  { id: "o2", name: "鈴木 美咲", department: "採用部" },
  { id: "o3", name: "山本 健太", department: "人事部" },
];

// ─────────────────────────────────────────
// Jobs（求人）
// ─────────────────────────────────────────

export type JobStatus = "募集中" | "停止" | "充足";
export type EmploymentType = "正社員" | "契約社員" | "業務委託";

export interface Job {
  id: string;
  title: string;
  department: string;
  status: JobStatus;
  employmentType: EmploymentType;
  description: string;
  requirements: string[];
}

export const jobs: Job[] = [
  {
    id: "j1", title: "バックエンドエンジニア（Java）", department: "エンジニアリング", status: "募集中", employmentType: "正社員",
    description: "金融・EC系の大規模システムを担当するバックエンドチームの中核メンバーを募集。マイクロサービスアーキテクチャの設計・実装から運用改善まで幅広くお任せします。",
    requirements: ["Java（Spring Boot）実務経験3年以上", "REST API設計・実装経験", "RDBMSの設計・チューニング経験", "Git/GitHubを用いたチーム開発経験"],
  },
  {
    id: "j2", title: "フロントエンドエンジニア", department: "エンジニアリング", status: "募集中", employmentType: "正社員",
    description: "ユーザー体験を最優先に考えるフロントエンドエンジニアを募集。React/Next.jsを中心に、デザインチームと連携しながらプロダクトのUI/UXを磨いていただきます。",
    requirements: ["React/Next.js 実務経験2年以上", "TypeScript の実務使用経験", "CSS（Tailwind CSS等）によるスタイリング経験", "パフォーマンス最適化の知識"],
  },
  {
    id: "j3", title: "Webエンジニア（PHP）", department: "エンジニアリング", status: "停止", employmentType: "契約社員",
    description: "自社メディアの新機能開発・保守を担当するWebエンジニアを募集（現在募集停止中）。LaravelベースのAPIサーバー開発が主な業務です。",
    requirements: ["PHP（Laravel）実務経験2年以上", "MySQL 設計・運用経験", "Gitを用いた開発経験"],
  },
  {
    id: "j4", title: "バックエンドエンジニア（Python）", department: "エンジニアリング", status: "停止", employmentType: "正社員",
    description: "機械学習基盤とAPI連携するバックエンドエンジニアを募集（現在募集停止中）。PythonによるAPI開発およびデータパイプライン構築をお任せします。",
    requirements: ["Python 実務経験3年以上", "FastAPI または Django REST Framework の使用経験", "クラウド（AWS/GCP）でのインフラ構築経験"],
  },
  {
    id: "j5", title: "インフラエンジニア（Go/k8s）", department: "インフラ", status: "充足", employmentType: "正社員",
    description: "Kubernetes を中心としたコンテナ基盤の設計・運用を担当するインフラエンジニアを募集（充足済み）。",
    requirements: ["Kubernetes の本番運用経験", "Go による運用ツール開発経験", "CI/CD パイプライン構築経験", "クラウドコスト最適化の経験"],
  },
  {
    id: "j6", title: "iOSエンジニア", department: "モバイル", status: "充足", employmentType: "正社員",
    description: "自社iOSアプリの新機能開発・リファクタリングを担当するエンジニアを募集（充足済み）。Swift UIへの移行プロジェクトも推進中。",
    requirements: ["Swift 実務経験3年以上", "App Store へのリリース経験", "SwiftUI または UIKit での開発経験", "パフォーマンスチューニング経験"],
  },
  {
    id: "j7", title: "Androidエンジニア", department: "モバイル", status: "募集中", employmentType: "正社員",
    description: "自社Androidアプリの新機能開発からリアーキテクチャまで幅広く担当するエンジニアを募集。Jetpack Compose への移行プロジェクトをリードしていただきます。",
    requirements: ["Kotlin 実務経験3年以上", "Google Play へのリリース経験", "Jetpack Compose の使用経験優遇", "MVVM/MVI アーキテクチャの理解"],
  },
  {
    id: "j8", title: "データアナリスト", department: "データ", status: "募集中", employmentType: "業務委託",
    description: "事業データを活用して意思決定を支援するデータアナリストを業務委託で募集。BIダッシュボード構築とアドホック分析が主な業務です。",
    requirements: ["SQL による複雑なクエリ作成経験", "BIツール（Looker / Tableau 等）の使用経験", "Python（pandas）によるデータ加工経験", "ビジネス課題をデータで解決した実績"],
  },
  {
    id: "j9", title: "テックリード（Java）", department: "エンジニアリング", status: "停止", employmentType: "正社員",
    description: "バックエンドチームの技術的なリードを担うテックリードを募集（現在募集停止中）。コードレビュー・アーキテクチャ設計・メンタリングを担当。",
    requirements: ["Java 実務経験7年以上", "チームリード・テックリード経験3年以上", "システム設計・アーキテクチャ設計の経験", "採用・メンタリング経験優遇"],
  },
  {
    id: "j10", title: "フルスタックエンジニア", department: "エンジニアリング", status: "募集中", employmentType: "業務委託",
    description: "フロントエンド・バックエンドを横断して機能開発を担うフルスタックエンジニアを業務委託で募集。スモールチームで裁量を持って開発できます。",
    requirements: ["React/Next.js 実務経験2年以上", "Node.js または Python による API 開発経験", "RDBMSの設計・実装経験", "フルスタック開発の実績"],
  },
  {
    id: "j11", title: "Webエンジニア（Ruby）", department: "エンジニアリング", status: "停止", employmentType: "契約社員",
    description: "Ruby on Railsで構築された社内管理ツールの保守・改善を担うエンジニアを募集（現在募集停止中）。",
    requirements: ["Ruby on Rails 実務経験2年以上", "RESTful API の設計・実装経験", "PostgreSQL の使用経験"],
  },
];

// ─────────────────────────────────────────
// Candidates（候補者）
// ─────────────────────────────────────────

export interface Candidate {
  id: string;
  name: string;
  skills: string[];
  bio: string;
  channel: Channel;
  status: CandidateStatus;
  valid: ValidStatus;
  updatedAt: string;
}

export const candidates: Candidate[] = [
  {
    id: "1",
    name: "山田 太郎",
    skills: ["Java", "Spring Boot"],
    bio: "大手SIerにて5年間Javaバックエンド開発に従事。マイクロサービス設計・運用経験あり。",
    channel: "scout",
    status: "書類選考",
    valid: "有効",
    updatedAt: "2026-04-24",
  },
  {
    id: "2",
    name: "佐藤 花子",
    skills: ["React", "TypeScript"],
    bio: "スタートアップでフロントエンドエンジニアとして3年勤務。React / Next.js によるSPA開発が得意。",
    channel: "dm",
    status: "面接",
    valid: "有効",
    updatedAt: "2026-04-23",
  },
  {
    id: "3",
    name: "鈴木 一郎",
    skills: ["PHP", "Laravel"],
    bio: "Web制作会社にてLaravelを用いたECサイト開発を2年担当。",
    channel: "direct",
    status: "応募受付",
    valid: "未判定",
    updatedAt: "2026-04-22",
  },
  {
    id: "4",
    name: "高橋 美咲",
    skills: ["Python", "Django"],
    bio: "データ分析とWebAPI開発を兼務。PythonとDjangoで社内向けシステムを構築した実績あり。",
    channel: "scout",
    status: "不採用",
    valid: "無効",
    updatedAt: "2026-04-20",
  },
  {
    id: "5",
    name: "伊藤 健二",
    skills: ["Go", "Docker", "k8s"],
    bio: "クラウドネイティブな開発を5年経験。GoによるAPI開発、Kubernetes運用が専門。",
    channel: "scout",
    status: "内定",
    valid: "有効",
    updatedAt: "2026-04-19",
  },
  {
    id: "6",
    name: "渡辺 奈々",
    skills: ["Vue.js", "Nuxt"],
    bio: "受託開発会社にてVue.js / Nuxtを用いたフロントエンド開発を4年担当。",
    channel: "dm",
    status: "承諾",
    valid: "有効",
    updatedAt: "2026-04-18",
  },
  {
    id: "7",
    name: "中村 翔太",
    skills: ["Ruby", "Rails"],
    bio: "スタートアップにてRailsフルスタック開発を3年経験。",
    channel: "direct",
    status: "辞退",
    valid: "無効",
    updatedAt: "2026-04-17",
  },
  {
    id: "8",
    name: "小林 さくら",
    skills: ["iOS", "Swift"],
    bio: "iOSアプリ開発4年。App Store公開アプリ3本。Swift / SwiftUIが得意。",
    channel: "scout",
    status: "入社",
    valid: "有効",
    updatedAt: "2026-04-15",
  },
  {
    id: "9",
    name: "加藤 亮",
    skills: ["Android", "Kotlin"],
    bio: "Androidアプリ開発3年。Kotlin / Jetpack Composeを用いたUI構築が専門。",
    channel: "dm",
    status: "書類選考",
    valid: "未判定",
    updatedAt: "2026-04-14",
  },
  {
    id: "10",
    name: "吉田 麻衣",
    skills: ["データ分析", "Python", "SQL"],
    bio: "事業会社のデータアナリストとして5年勤務。BIツール導入・分析基盤構築の経験あり。",
    channel: "direct",
    status: "面接",
    valid: "有効",
    updatedAt: "2026-04-13",
  },
];

// ─────────────────────────────────────────
// Applications（応募）
// ─────────────────────────────────────────

export interface Application {
  id: string;
  appliedAt: string;
  candidateId: string;   // → candidates.id
  jobId: string;         // → jobs.id
  ownerId: string;       // → owners.id
  channel: Channel;
  validity: ValidStatus;
  invalidReason: string | null;
  status: CandidateStatus;
  documentResult: DocumentResult;
  interviewStage: string;
  hasOffer: boolean;
}

export const applications: Application[] = [
  { id: "a1",  appliedAt: "2026-04-20", candidateId: "1",  jobId: "j1",  ownerId: "o1", channel: "scout",  validity: "有効",  invalidReason: null,             status: "書類選考", documentResult: "審査中", interviewStage: "書類選考中",    hasOffer: false },
  { id: "a2",  appliedAt: "2026-04-15", candidateId: "2",  jobId: "j2",  ownerId: "o1", channel: "dm",     validity: "有効",  invalidReason: null,             status: "面接",    documentResult: "通過",   interviewStage: "2次面接",       hasOffer: false },
  { id: "a3",  appliedAt: "2026-04-22", candidateId: "3",  jobId: "j3",  ownerId: "o2", channel: "direct", validity: "未判定", invalidReason: null,             status: "応募受付", documentResult: "未実施", interviewStage: "未着手",        hasOffer: false },
  { id: "a4",  appliedAt: "2026-04-10", candidateId: "4",  jobId: "j4",  ownerId: "o2", channel: "scout",  validity: "無効",  invalidReason: "ポジション不一致", status: "不採用",  documentResult: "不通過", interviewStage: "終了",          hasOffer: false },
  { id: "a5",  appliedAt: "2026-04-01", candidateId: "5",  jobId: "j5",  ownerId: "o1", channel: "scout",  validity: "有効",  invalidReason: null,             status: "内定",    documentResult: "通過",   interviewStage: "最終面接完了",  hasOffer: true  },
  { id: "a6",  appliedAt: "2026-03-20", candidateId: "6",  jobId: "j2",  ownerId: "o3", channel: "dm",     validity: "有効",  invalidReason: null,             status: "承諾",    documentResult: "通過",   interviewStage: "全面接完了",    hasOffer: true  },
  { id: "a7",  appliedAt: "2026-04-05", candidateId: "7",  jobId: "j11", ownerId: "o3", channel: "direct", validity: "無効",  invalidReason: "年収条件ミスマッチ", status: "辞退", documentResult: "通過",   interviewStage: "1次面接後辞退", hasOffer: false },
  { id: "a8",  appliedAt: "2026-03-01", candidateId: "8",  jobId: "j6",  ownerId: "o3", channel: "scout",  validity: "有効",  invalidReason: null,             status: "入社",    documentResult: "通過",   interviewStage: "全面接完了",    hasOffer: true  },
  { id: "a9",  appliedAt: "2026-04-13", candidateId: "9",  jobId: "j7",  ownerId: "o1", channel: "dm",     validity: "未判定", invalidReason: null,             status: "書類選考", documentResult: "審査中", interviewStage: "書類選考中",    hasOffer: false },
  { id: "a10", appliedAt: "2026-04-08", candidateId: "10", jobId: "j8",  ownerId: "o2", channel: "direct", validity: "有効",  invalidReason: null,             status: "面接",    documentResult: "通過",   interviewStage: "1次面接",       hasOffer: false },
  { id: "a11", appliedAt: "2026-04-18", candidateId: "1",  jobId: "j9",  ownerId: "o1", channel: "scout",  validity: "無効",  invalidReason: "経験年数不足",    status: "不採用",  documentResult: "不通過", interviewStage: "終了",          hasOffer: false },
  { id: "a12", appliedAt: "2026-04-19", candidateId: "2",  jobId: "j10", ownerId: "o2", channel: "direct", validity: "未判定", invalidReason: null,             status: "応募受付", documentResult: "未実施", interviewStage: "未着手",        hasOffer: false },
];

// ─────────────────────────────────────────
// Interviews（面接）
// ─────────────────────────────────────────

export interface Interview {
  id: string;
  applicationId: string;  // → applications.id
  candidateId: string;    // → candidates.id
  date: string;
  interviewer: string;
  result: InterviewResult;
  comment: string;
}

export const interviews: Interview[] = [
  { id: "i1",  applicationId: "a2",  candidateId: "2",  date: "2026-04-21", interviewer: "田中 部長",     result: "通過",  comment: "コミュニケーション能力が高く、技術力も申し分なし。次回は技術面接へ。" },
  { id: "i2",  applicationId: "a2",  candidateId: "2",  date: "2026-04-17", interviewer: "鈴木 採用担当",  result: "通過",  comment: "カルチャーフィット問題なし。志望動機も明確。" },
  { id: "i3",  applicationId: "a4",  candidateId: "4",  date: "2026-04-14", interviewer: "山本 マネージャー", result: "不採用", comment: "スキルセットは問題ないが、求めるポジションとの方向性が合わなかった。" },
  { id: "i4",  applicationId: "a5",  candidateId: "5",  date: "2026-04-15", interviewer: "CEO 佐々木",   result: "通過",  comment: "技術力・人柄ともに申し分なし。即戦力として期待大。" },
  { id: "i5",  applicationId: "a5",  candidateId: "5",  date: "2026-04-10", interviewer: "CTO 中島",     result: "通過",  comment: "k8sの深い知識を持つ。アーキテクチャ設計の議論も活発でよかった。" },
  { id: "i6",  applicationId: "a5",  candidateId: "5",  date: "2026-04-05", interviewer: "田中 部長",     result: "通過",  comment: "コミュニケーション良好。チームフィットも問題なし。" },
  { id: "i7",  applicationId: "a6",  candidateId: "6",  date: "2026-04-05", interviewer: "CEO 佐々木",   result: "通過",  comment: "入社意欲が高く、ビジョンへの共感も強い。即決で内定。" },
  { id: "i8",  applicationId: "a7",  candidateId: "7",  date: "2026-04-12", interviewer: "田中 部長",     result: "通過",  comment: "スキルは十分。しかし翌日に辞退連絡あり。" },
  { id: "i9",  applicationId: "a8",  candidateId: "8",  date: "2026-03-20", interviewer: "CTO 中島",     result: "通過",  comment: "iOSの知識が深く、即戦力として最高評価。" },
  { id: "i10", applicationId: "a10", candidateId: "10", date: "2026-04-16", interviewer: "田中 部長",     result: "通過",  comment: "分析スキルが高く、ビジネス理解も深い。2次面接へ進める。" },
];

// ─────────────────────────────────────────
// Contacts（接触履歴 = スカウト・DM送信）
// ─────────────────────────────────────────

export interface Contact {
  id: string;
  candidateId: string;  // → candidates.id
  ownerId: string;      // → owners.id
  date: string;
  channel: "scout" | "dm";
  opened: boolean;
  replied: boolean;
}

export const contacts: Contact[] = [
  { id: "c1", candidateId: "1",  ownerId: "o1", date: "2026-04-18", channel: "scout", opened: true,  replied: true  },
  { id: "c2", candidateId: "1",  ownerId: "o2", date: "2026-04-10", channel: "scout", opened: true,  replied: false },
  { id: "c3", candidateId: "2",  ownerId: "o1", date: "2026-04-12", channel: "dm",    opened: true,  replied: true  },
  { id: "c4", candidateId: "4",  ownerId: "o2", date: "2026-04-08", channel: "scout", opened: true,  replied: true  },
  { id: "c5", candidateId: "4",  ownerId: "o2", date: "2026-04-01", channel: "scout", opened: false, replied: false },
  { id: "c6", candidateId: "5",  ownerId: "o1", date: "2026-03-28", channel: "scout", opened: true,  replied: true  },
  { id: "c7", candidateId: "6",  ownerId: "o3", date: "2026-03-18", channel: "dm",    opened: true,  replied: true  },
  { id: "c8", candidateId: "8",  ownerId: "o3", date: "2026-02-25", channel: "scout", opened: true,  replied: true  },
  { id: "c9", candidateId: "9",  ownerId: "o1", date: "2026-04-11", channel: "dm",    opened: true,  replied: true  },
];

// ─────────────────────────────────────────
// Evaluations（面接評価）
// ─────────────────────────────────────────

export interface Evaluation {
  id: string;
  interviewId: string;    // → interviews.id
  candidateId: string;    // → candidates.id
  /** join 用（interviews → applications 経由） */
  applicationId: string;  // → applications.id
  technicalScore: number | null;
  communicationScore: number | null;
  alignmentScore: number | null;
  overallGrade: EvaluationGrade | null;
  result: EvaluationResult | null;
  ngReason: NgReason | null;
  concerns: string;
  comment: string;
  nextAction: string;
}

export const evaluations: Evaluation[] = [
  // ── 通過 ──
  {
    id: "e1",
    interviewId: "i4", applicationId: "a5", candidateId: "5",
    technicalScore: 5, communicationScore: 4, alignmentScore: 5,
    overallGrade: "A", result: "通過", ngReason: null,
    concerns: "",
    comment: "即戦力として申し分なし。チームへの貢献度も高く期待できる。",
    nextAction: "内定通知を送付する",
  },
  {
    id: "e2",
    interviewId: "i1", applicationId: "a2", candidateId: "2",
    technicalScore: 4, communicationScore: 5, alignmentScore: 4,
    overallGrade: "A", result: "通過", ngReason: null,
    concerns: "",
    comment: "コミュニケーション力が非常に高い。技術力も安定している。",
    nextAction: "2次面接の日程調整",
  },
  // ── 不採用 ──
  {
    id: "e3",
    interviewId: "i3", applicationId: "a4", candidateId: "4",
    technicalScore: 3, communicationScore: 3, alignmentScore: 2,
    overallGrade: "C", result: "不採用", ngReason: "志向性不一致",
    concerns: "ポジションとの方向性ミスマッチ",
    comment: "技術力は平均的。ただしキャリア志向が当社の求める方向と異なる。",
    nextAction: "不採用通知",
  },
  {
    id: "e4",
    interviewId: "i8", applicationId: "a7", candidateId: "7",
    technicalScore: 4, communicationScore: 4, alignmentScore: 3,
    overallGrade: "B", result: "不採用", ngReason: "辞退",
    concerns: "翌日に辞退連絡",
    comment: "スキルは十分だったが候補者側から辞退。",
    nextAction: "辞退理由のヒアリング",
  },
  {
    id: "e5",
    interviewId: "i2", applicationId: "a2", candidateId: "2",
    technicalScore: 2, communicationScore: 3, alignmentScore: 3,
    overallGrade: "D", result: "不採用", ngReason: "スキル不足",
    concerns: "フレームワーク理解が浅い",
    comment: "React の深い知識が不足。現時点では採用基準を満たさない。",
    nextAction: "不採用通知",
  },
  {
    id: "e6",
    interviewId: "i5", applicationId: "a5", candidateId: "5",
    technicalScore: 3, communicationScore: 4, alignmentScore: 3,
    overallGrade: "C", result: "不採用", ngReason: "経験不足",
    concerns: "大規模インフラ運用経験なし",
    comment: "k8s の基礎はあるが、本番規模での運用経験が不足している。",
    nextAction: "不採用通知",
  },
  {
    id: "e7",
    interviewId: "i6", applicationId: "a5", candidateId: "5",
    technicalScore: 4, communicationScore: 2, alignmentScore: 3,
    overallGrade: "C", result: "不採用", ngReason: "カルチャーフィット不足",
    concerns: "チームワーク面に懸念",
    comment: "個人プレー志向が強くチーム文化との相性に不安がある。",
    nextAction: "不採用通知",
  },
  {
    id: "e8",
    interviewId: "i9", applicationId: "a8", candidateId: "8",
    technicalScore: 3, communicationScore: 3, alignmentScore: 4,
    overallGrade: "C", result: "不採用", ngReason: "条件不一致",
    concerns: "希望年収が予算超過",
    comment: "スキル・意欲は問題なし。ただし希望年収が採用予算を大幅に超えた。",
    nextAction: "条件面の再調整を打診",
  },
  {
    id: "e9",
    interviewId: "i10", applicationId: "a10", candidateId: "10",
    technicalScore: 2, communicationScore: 4, alignmentScore: 3,
    overallGrade: "D", result: "不採用", ngReason: "スキル不足",
    concerns: "統計・MLの知識が基礎レベル",
    comment: "ビジネス理解は高いが、技術的な分析スキルが求めるレベルに達していない。",
    nextAction: "不採用通知",
  },
  {
    id: "e10",
    interviewId: "i7", applicationId: "a6", candidateId: "6",
    technicalScore: 4, communicationScore: 4, alignmentScore: 4,
    overallGrade: "B", result: "不採用", ngReason: "他社決定",
    concerns: "他社オファーを優先",
    comment: "評価は高かったが、候補者が他社の内定を承諾した。",
    nextAction: "将来の再アプローチを検討",
  },
  {
    id: "e11",
    interviewId: "i3", applicationId: "a4", candidateId: "4",
    technicalScore: 3, communicationScore: 3, alignmentScore: 2,
    overallGrade: "C", result: "不採用", ngReason: "経験不足",
    concerns: "実務経験年数が要件未満",
    comment: "ポテンシャルはあるが即戦力としては経験年数が足りない。",
    nextAction: "不採用通知",
  },
  {
    id: "e12",
    interviewId: "i6", applicationId: "a5", candidateId: "5",
    technicalScore: 2, communicationScore: 3, alignmentScore: 2,
    overallGrade: "D", result: "不採用", ngReason: "志向性不一致",
    concerns: "長期在籍の意向が見えない",
    comment: "短期での転職意向が強く、長期的なコミットメントが期待できない。",
    nextAction: "不採用通知",
  },
];

// ─────────────────────────────────────────
// DateRange（期間フィルタ）
// ─────────────────────────────────────────

export type DateRangeKey = "today" | "this_week" | "this_month" | "all";

export interface DateRange {
  key: DateRangeKey;
  /** YYYY-MM-DD（null = 制限なし） */
  start: string | null;
  end: string | null;
}

/** YYYY-MM-DD 文字列が範囲内かどうかを判定 */
function inRange(date: string, range: DateRange): boolean {
  if (range.start && date < range.start) return false;
  if (range.end   && date > range.end)   return false;
  return true;
}

/**
 * 基準日（YYYY-MM-DD）から各期間の DateRange を生成する。
 * baseDate を引数に取ることでテスト・SSR でも安全に動作する。
 */
export function buildDateRange(key: DateRangeKey, baseDate: string): DateRange {
  if (key === "all") return { key, start: null, end: null };

  const base = new Date(`${baseDate}T00:00:00`);

  if (key === "today") {
    return { key, start: baseDate, end: baseDate };
  }

  if (key === "this_week") {
    // 月曜始まり
    const day = base.getDay(); // 0=Sun
    const diffToMon = day === 0 ? -6 : 1 - day;
    const mon = new Date(base);
    mon.setDate(base.getDate() + diffToMon);
    const sun = new Date(mon);
    sun.setDate(mon.getDate() + 6);
    return {
      key,
      start: mon.toISOString().slice(0, 10),
      end:   sun.toISOString().slice(0, 10),
    };
  }

  // this_month
  const start = `${baseDate.slice(0, 7)}-01`;
  const lastDay = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
  const end = `${baseDate.slice(0, 7)}-${String(lastDay).padStart(2, "0")}`;
  return { key, start, end };
}

// ─────────────────────────────────────────
// Dashboard Metrics（ダッシュボード用集計値）
// ─────────────────────────────────────────

export interface DashboardMetrics {
  sent_count: number;
  opened_count: number;
  replied_count: number;
  valid_application_count: number;
  interview_count: number;
  offer_count: number;
  accept_count: number;
}

export interface ChannelMetrics {
  channel: string;
  openRate: number;
  replyRate: number;
  validRate: number;
}

// ─────────────────────────────────────────
// 外部データオーバーライド型
// CSV / Sheets モードで各テーブルの生データを渡すと
// module-level の静的配列の代わりに使われる（mock モードは省略で OK）
// ─────────────────────────────────────────

export interface RawData {
  contacts?:     Contact[];
  applications?: Application[];
  interviews?:   Interview[];
  candidates?:   Candidate[];
  owners?:       Owner[];
  jobs?:         Job[];
  evaluations?:  Evaluation[];
}

/**
 * 期間フィルタ付きダッシュボード集計。
 * range を省略すると全期間を対象にする（後方互換）。
 * data を渡すと mockData の静的配列の代わりに使用する（CSV / Sheets モード用）。
 */
export function computeDashboardMetrics(range?: DateRange, data?: RawData): DashboardMetrics {
  const r: DateRange = range ?? { key: "all", start: null, end: null };
  const _contacts     = data?.contacts     ?? contacts;
  const _applications = data?.applications ?? applications;
  const _interviews   = data?.interviews   ?? interviews;
  const _candidates   = data?.candidates   ?? candidates;

  const filteredContacts     = _contacts.filter((c) => inRange(c.date, r));
  const filteredApplications = _applications.filter((a) => inRange(a.appliedAt, r));
  const filteredInterviews   = _interviews.filter((i) => inRange(i.date, r));

  const sent_count             = filteredContacts.length;
  const opened_count           = filteredContacts.filter((c) => c.opened).length;
  const replied_count          = filteredContacts.filter((c) => c.replied).length;
  const valid_application_count = filteredApplications.filter((a) => a.validity === "有効").length;
  const interview_count        = filteredInterviews.length;
  const offer_count            = filteredApplications.filter((a) => a.hasOffer).length;

  // 承諾・入社候補者は updatedAt で期間判定
  const accept_count = _candidates.filter(
    (c) =>
      (c.status === "承諾" || c.status === "入社") &&
      inRange(c.updatedAt, r)
  ).length;

  return {
    sent_count,
    opened_count,
    replied_count,
    valid_application_count,
    interview_count,
    offer_count,
    accept_count,
  };
}

function pct(n: number, d: number) {
  return d === 0 ? 0 : (n / d) * 100;
}

/**
 * 期間フィルタ付きチャネル別集計。
 * range を省略すると全期間を対象にする（後方互換）。
 */
export function computeChannelMetrics(range?: DateRange, data?: RawData): ChannelMetrics[] {
  const r: DateRange = range ?? { key: "all", start: null, end: null };
  const _contacts     = data?.contacts     ?? contacts;
  const _applications = data?.applications ?? applications;

  const filteredContacts     = _contacts.filter((c) => inRange(c.date, r));
  const filteredApplications = _applications.filter((a) => inRange(a.appliedAt, r));

  const channelMap: Record<string, { sent: number; opened: number; replied: number }> = {
    scout:  { sent: 0, opened: 0, replied: 0 },
    dm:     { sent: 0, opened: 0, replied: 0 },
    direct: { sent: 0, opened: 0, replied: 0 },
  };

  filteredContacts.forEach((c) => {
    const ch = channelMap[c.channel];
    if (!ch) return;
    ch.sent++;
    if (c.opened) ch.opened++;
    if (c.replied) ch.replied++;
  });

  const validByChannel: Record<string, number> = { scout: 0, dm: 0, direct: 0 };
  filteredApplications.forEach((a) => {
    if (a.validity === "有効" && validByChannel[a.channel] !== undefined) {
      validByChannel[a.channel]++;
    }
  });

  const totalByChannel: Record<string, number> = { scout: 0, dm: 0, direct: 0 };
  filteredApplications.forEach((a) => {
    if (totalByChannel[a.channel] !== undefined) totalByChannel[a.channel]++;
  });

  // ── channelMap は filteredContacts ベースなので既に正しい ──

  const labelMap: Record<string, string> = {
    scout:  "スカウト",
    dm:     "DM",
    direct: "ダイレクト",
  };

  return ["scout", "dm", "direct"].map((key) => ({
    channel:   labelMap[key],
    openRate:  pct(channelMap[key].opened,  channelMap[key].sent),
    replyRate: pct(channelMap[key].replied, channelMap[key].opened),
    validRate: pct(validByChannel[key],     totalByChannel[key]),
  }));
}

// ─────────────────────────────────────────
// Owner Metrics（担当者別集計）
// ─────────────────────────────────────────

export interface OwnerMetrics {
  ownerId: string;
  ownerName: string;
  department: string;
  sentCount: number;
  openedCount: number;
  repliedCount: number;
  openRate: number;
  replyRate: number;
  validCount: number;
  interviewCount: number;
  offerCount: number;
  acceptCount: number;
}

/**
 * 担当者別集計。将来の期間フィルタ対応のため range? を受け取る構造にしている。
 */
export function computeOwnerMetrics(range?: DateRange, data?: RawData): OwnerMetrics[] {
  const r: DateRange = range ?? { key: "all", start: null, end: null };
  const _contacts     = data?.contacts     ?? contacts;
  const _applications = data?.applications ?? applications;
  const _interviews   = data?.interviews   ?? interviews;
  const _candidates   = data?.candidates   ?? candidates;
  const _owners       = data?.owners       ?? owners;

  const filteredContacts     = _contacts.filter((c) => inRange(c.date, r));
  const filteredApplications = _applications.filter((a) => inRange(a.appliedAt, r));
  const filteredInterviews   = _interviews.filter((i) => inRange(i.date, r));

  // interview → application → ownerId の逆引きマップ
  const appOwnerMap: Record<string, string> = {};
  filteredApplications.forEach((a) => { appOwnerMap[a.id] = a.ownerId; });

  return _owners.map((owner) => {
    const ownerContacts = filteredContacts.filter((c) => c.ownerId === owner.id);
    const ownerApps     = filteredApplications.filter((a) => a.ownerId === owner.id);
    const ownerInterviews = filteredInterviews.filter(
      (i) => appOwnerMap[i.applicationId] === owner.id
    );

    const sentCount     = ownerContacts.length;
    const openedCount   = ownerContacts.filter((c) => c.opened).length;
    const repliedCount  = ownerContacts.filter((c) => c.replied).length;
    const validCount    = ownerApps.filter((a) => a.validity === "有効").length;
    const interviewCount = ownerInterviews.length;
    const offerCount    = ownerApps.filter((a) => a.hasOffer).length;
    const acceptCount   = ownerApps.filter((a) => {
      const candidate = _candidates.find((c) => c.id === a.candidateId);
      return candidate?.status === "承諾" || candidate?.status === "入社";
    }).length;

    return {
      ownerId:      owner.id,
      ownerName:    owner.name,
      department:   owner.department,
      sentCount,
      openedCount,
      repliedCount,
      openRate:  pct(openedCount,  sentCount),
      replyRate: pct(repliedCount, openedCount),
      validCount,
      interviewCount,
      offerCount,
      acceptCount,
    };
  });
}

// ─────────────────────────────────────────
// NgReason Metrics（NG理由分析）
// ─────────────────────────────────────────

export const NG_REASONS: NgReason[] = [
  "スキル不足",
  "経験不足",
  "カルチャーフィット不足",
  "志向性不一致",
  "条件不一致",
  "他社決定",
  "辞退",
];

export interface NgReasonCount {
  reason: NgReason;
  count: number;
  rate: number; // 全不採用件数に対する割合（%）
}

export interface NgReasonFilters {
  jobId?: string;    // → jobs.id（未指定 = 全件）
  ownerId?: string;  // → owners.id（未指定 = 全件）
  range?: DateRange; // 将来の期間フィルタ用
}

/**
 * NG理由集計。
 * jobId / ownerId / range でフィルタ可能（すべてオプション）。
 */
// ─────────────────────────────────────────
// 求人集計
// ─────────────────────────────────────────

export interface JobMetrics {
  id: string;
  title: string;
  department: string;
  status: JobStatus;
  employmentType: EmploymentType;
  applicationCount: number;
  validApplicationCount: number;
  interviewCount: number;
  offerCount: number;
}

export function computeJobMetrics(data?: RawData): JobMetrics[] {
  const _jobs         = data?.jobs         ?? jobs;
  const _applications = data?.applications ?? applications;
  const _interviews   = data?.interviews   ?? interviews;

  return _jobs.map((job) => {
    const jobApps = _applications.filter((a) => a.jobId === job.id);
    const appIds  = new Set(jobApps.map((a) => a.id));

    const applicationCount      = jobApps.length;
    const validApplicationCount = jobApps.filter((a) => a.validity === "有効").length;
    const interviewCount        = _interviews.filter((i) => appIds.has(i.applicationId)).length;
    const offerCount            = jobApps.filter((a) =>
      a.status === "内定" || a.status === "承諾" || a.status === "入社"
    ).length;

    return {
      id: job.id,
      title: job.title,
      department: job.department,
      status: job.status,
      employmentType: job.employmentType,
      applicationCount,
      validApplicationCount,
      interviewCount,
      offerCount,
    };
  });
}

export function computeNgReasonMetrics(filters?: NgReasonFilters, data?: RawData): NgReasonCount[] {
  const r: DateRange = filters?.range ?? { key: "all", start: null, end: null };
  const _evaluations  = data?.evaluations  ?? evaluations;
  const _applications = data?.applications ?? applications;

  // 不採用の評価のみ
  const ngEvals = _evaluations.filter((e) => e.result === "不採用" && e.ngReason !== null);

  // jobId / ownerId フィルタ：evaluation.applicationId → applications で join
  const filtered = ngEvals.filter((e) => {
    const app = _applications.find((a) => a.id === e.applicationId);
    if (!app) return false;
    if (!inRange(app.appliedAt, r)) return false;
    if (filters?.jobId   && app.jobId   !== filters.jobId)   return false;
    if (filters?.ownerId && app.ownerId !== filters.ownerId) return false;
    return true;
  });

  const total = filtered.length;

  return NG_REASONS.map((reason) => {
    const count = filtered.filter((e) => e.ngReason === reason).length;
    return {
      reason,
      count,
      rate: total === 0 ? 0 : parseFloat(((count / total) * 100).toFixed(1)),
    };
  }).sort((a, b) => b.count - a.count);
}
