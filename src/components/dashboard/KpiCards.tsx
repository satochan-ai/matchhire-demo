"use client";

type KpiStatus = "good" | "warning" | "alert";

interface KpiItem {
  label: string;
  value: number;
  isPercent: boolean;
  status: KpiStatus;
}

interface KpiCardsProps {
  sentCount: number;
  openRate: number;
  replyRate: number;
  validRate: number;
  interviewRate: number;
  offerRate: number;
  acceptRate: number;
}

function getStatus(key: string, value: number): KpiStatus {
  const thresholds: Record<string, { good: number; warning: number }> = {
    openRate: { good: 40, warning: 25 },
    replyRate: { good: 15, warning: 8 },
    validRate: { good: 50, warning: 30 },
    interviewRate: { good: 60, warning: 40 },
    offerRate: { good: 30, warning: 15 },
    acceptRate: { good: 80, warning: 50 },
  };
  const t = thresholds[key];
  if (!t) return "good";
  if (value >= t.good) return "good";
  if (value >= t.warning) return "warning";
  return "alert";
}

const statusStyles: Record<KpiStatus, { card: string; badge: string; label: string }> = {
  good: {
    card: "border-green-200 bg-green-50",
    badge: "bg-green-100 text-green-700",
    label: "Good",
  },
  warning: {
    card: "border-yellow-200 bg-yellow-50",
    badge: "bg-yellow-100 text-yellow-700",
    label: "Warning",
  },
  alert: {
    card: "border-red-200 bg-red-50",
    badge: "bg-red-100 text-red-700",
    label: "Alert",
  },
};

export function KpiCards({
  sentCount,
  openRate,
  replyRate,
  validRate,
  interviewRate,
  offerRate,
  acceptRate,
}: KpiCardsProps) {
  const items: KpiItem[] = [
    { label: "送信数", value: sentCount, isPercent: false, status: "good" },
    { label: "開封率", value: openRate, isPercent: true, status: getStatus("openRate", openRate) },
    { label: "返信率", value: replyRate, isPercent: true, status: getStatus("replyRate", replyRate) },
    { label: "有効応募率", value: validRate, isPercent: true, status: getStatus("validRate", validRate) },
    { label: "面接化率", value: interviewRate, isPercent: true, status: getStatus("interviewRate", interviewRate) },
    { label: "内定率", value: offerRate, isPercent: true, status: getStatus("offerRate", offerRate) },
    { label: "承諾率", value: acceptRate, isPercent: true, status: getStatus("acceptRate", acceptRate) },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-7">
      {items.map((item) => {
        const styles = statusStyles[item.status];
        return (
          <div
            key={item.label}
            className={`rounded-xl border p-3 md:p-4 ${styles.card}`}
          >
            <p className="text-xs font-medium text-gray-500">{item.label}</p>
            <p className="mt-1.5 text-xl font-bold text-gray-800 md:mt-2 md:text-2xl">
              {item.isPercent ? `${item.value.toFixed(1)}%` : item.value.toLocaleString()}
            </p>
            <span className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-xs font-medium md:mt-2 ${styles.badge}`}>
              {styles.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
