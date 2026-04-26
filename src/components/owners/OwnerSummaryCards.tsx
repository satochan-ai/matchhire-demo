"use client";

import type { OwnerMetrics } from "@/lib/mockData";

interface OwnerSummaryCardsProps {
  metrics: OwnerMetrics[];
}

interface SummaryItem {
  label: string;
  ownerName: string;
  value: string;
  color: string;
  icon: React.ReactNode;
}

function TrophyIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  );
}

export function OwnerSummaryCards({ metrics }: OwnerSummaryCardsProps) {
  if (metrics.length === 0) return null;

  const topSent      = metrics.reduce((a, b) => a.sentCount     > b.sentCount     ? a : b);
  const topReply     = metrics.reduce((a, b) => a.replyRate     > b.replyRate     ? a : b);
  const topValid     = metrics.reduce((a, b) => a.validCount    > b.validCount    ? a : b);
  const topOffer     = metrics.reduce((a, b) => a.offerCount    > b.offerCount    ? a : b);

  const items: SummaryItem[] = [
    {
      label: "送信数 No.1",
      ownerName: topSent.ownerName,
      value: `${topSent.sentCount} 件`,
      color: "border-blue-200 bg-blue-50",
      icon: <TrophyIcon />,
    },
    {
      label: "返信率 No.1",
      ownerName: topReply.ownerName,
      value: `${topReply.replyRate.toFixed(1)}%`,
      color: "border-purple-200 bg-purple-50",
      icon: <TrophyIcon />,
    },
    {
      label: "有効応募 No.1",
      ownerName: topValid.ownerName,
      value: `${topValid.validCount} 件`,
      color: "border-green-200 bg-green-50",
      icon: <TrophyIcon />,
    },
    {
      label: "内定数 No.1",
      ownerName: topOffer.ownerName,
      value: `${topOffer.offerCount} 件`,
      color: "border-amber-200 bg-amber-50",
      icon: <TrophyIcon />,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className={`rounded-xl border p-4 ${item.color}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500">{item.label}</span>
            <span className="text-gray-400">{item.icon}</span>
          </div>
          <p className="text-sm font-bold text-gray-800">{item.ownerName}</p>
          <p className="mt-1 text-xl font-bold text-gray-700">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
