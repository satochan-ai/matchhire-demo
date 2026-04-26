import { notFound } from "next/navigation";
import Link from "next/link";
import { EvaluationForm } from "@/components/evaluations/EvaluationForm";

interface InterviewMeta {
  candidateName: string;
  jobTitle: string;
  stage: string;
}

const INTERVIEW_META: Record<string, InterviewMeta> = {
  "1": { candidateName: "山田 太郎",  jobTitle: "バックエンドエンジニア（Java）", stage: "1次面接" },
  "2": { candidateName: "佐藤 花子",  jobTitle: "フロントエンドエンジニア",        stage: "2次面接" },
  "3": { candidateName: "鈴木 一郎",  jobTitle: "Webエンジニア（PHP）",            stage: "1次面接" },
  "4": { candidateName: "高橋 美咲",  jobTitle: "バックエンドエンジニア（Python）", stage: "1次面接" },
  "5": { candidateName: "伊藤 健二",  jobTitle: "インフラエンジニア（Go/k8s）",    stage: "最終面接" },
  "6": { candidateName: "渡辺 奈々",  jobTitle: "フロントエンドエンジニア",        stage: "最終面接" },
  "7": { candidateName: "中村 翔太",  jobTitle: "Webエンジニア（Ruby）",           stage: "1次面接" },
  "8": { candidateName: "小林 さくら", jobTitle: "iOSエンジニア",                 stage: "最終面接" },
  "9": { candidateName: "加藤 亮",    jobTitle: "Androidエンジニア",              stage: "1次面接" },
  "10": { candidateName: "吉田 麻衣", jobTitle: "データアナリスト",               stage: "1次面接" },
};

/** 静的エクスポート用：INTERVIEW_META の全 ID を事前生成 */
export function generateStaticParams() {
  return Object.keys(INTERVIEW_META).map((id) => ({ id }));
}

export default async function EvaluationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meta = INTERVIEW_META[id];
  if (!meta) notFound();

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Link
            href="/matchhire/candidates"
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            候補者一覧
          </Link>
          <span className="text-gray-300">/</span>
          <Link
            href={`/matchhire/candidates/${id}`}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            {meta.candidateName}
          </Link>
          <span className="text-gray-300">/</span>
          <h1 className="text-xl font-bold text-gray-900">面接評価入力</h1>
        </div>

        {/* サブタイトル */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600">
            <span><span className="font-medium text-gray-400">候補者：</span>{meta.candidateName}</span>
            <span><span className="font-medium text-gray-400">求人：</span>{meta.jobTitle}</span>
            <span><span className="font-medium text-gray-400">ステージ：</span>{meta.stage}</span>
          </div>
        </div>

        {/* フォーム本体 */}
        <EvaluationForm
          candidateName={meta.candidateName}
          jobTitle={meta.jobTitle}
          stage={meta.stage}
        />

      </div>
    </div>
  );
}
