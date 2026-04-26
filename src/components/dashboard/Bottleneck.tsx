"use client";

type BottleneckStatus = "Alert" | "Warning" | "Good";

interface DiagnosisResult {
  issue: string;
  status: BottleneckStatus;
  message: string;
  suggestion: string;
}

interface BottleneckProps {
  openRate: number;
  replyRate: number;
  validRate: number;
  documentPassRate: number;
}

function diagnose(
  openRate: number,
  replyRate: number,
  validRate: number,
  documentPassRate: number
): DiagnosisResult {
  if (openRate < 40) {
    return {
      issue: "開封率が低い",
      status: "Alert",
      message: "スカウトメールが開封されていません。件名や送信タイミングに問題がある可能性があります。",
      suggestion: "件名をパーソナライズし、候補者の経歴に合わせた訴求文に変更してください。",
    };
  }
  if (replyRate < 15) {
    return {
      issue: "返信率が低い",
      status: "Alert",
      message: "開封はされているが返信につながっていません。本文の内容に改善余地があります。",
      suggestion: "スカウト文面を見直し、ポジションの魅力や候補者へのメリットを明確に伝えてください。",
    };
  }
  if (validRate < 50) {
    return {
      issue: "有効応募率が低い",
      status: "Warning",
      message: "返信はあるが有効応募に至らないケースが多いです。ターゲット精度に問題がある可能性があります。",
      suggestion: "スカウト対象の条件を見直し、ポジションにマッチした候補者に絞り込んでください。",
    };
  }
  if (documentPassRate < 30) {
    return {
      issue: "書類通過率が低い",
      status: "Warning",
      message: "応募は来ているが書類選考で多く落とされています。選考基準の見直しが必要かもしれません。",
      suggestion: "書類選考の評価基準を明確化し、必須要件と歓迎要件を整理してください。",
    };
  }
  return {
    issue: "問題なし",
    status: "Good",
    message: "現在のファネルは健全な状態です。このまま継続してください。",
    suggestion: "各指標を維持しつつ、送信数を増やしてスケールを目指しましょう。",
  };
}

const statusStyles: Record<BottleneckStatus, { border: string; bg: string; badge: string; text: string }> = {
  Alert: {
    border: "border-red-300",
    bg: "bg-red-50",
    badge: "bg-red-100 text-red-700",
    text: "text-red-700",
  },
  Warning: {
    border: "border-yellow-300",
    bg: "bg-yellow-50",
    badge: "bg-yellow-100 text-yellow-700",
    text: "text-yellow-700",
  },
  Good: {
    border: "border-green-300",
    bg: "bg-green-50",
    badge: "bg-green-100 text-green-700",
    text: "text-green-700",
  },
};

export function Bottleneck({ openRate, replyRate, validRate, documentPassRate }: BottleneckProps) {
  const result = diagnose(openRate, replyRate, validRate, documentPassRate);
  const styles = statusStyles[result.status];

  return (
    <div className={`rounded-xl border p-5 ${styles.border} ${styles.bg}`}>
      <div className="flex items-center gap-3">
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${styles.badge}`}>
          {result.status}
        </span>
        <h3 className={`text-base font-bold ${styles.text}`}>{result.issue}</h3>
      </div>
      <p className="mt-3 text-sm text-gray-700">{result.message}</p>
      <div className="mt-3 rounded-lg bg-white/60 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">改善提案</p>
        <p className="mt-1 text-sm text-gray-700">{result.suggestion}</p>
      </div>
    </div>
  );
}
