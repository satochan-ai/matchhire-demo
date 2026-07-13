"use client";

export type KpiStatus = "good" | "warning" | "alert";

export interface KpiCardItem {
  label: string;
  value: number;
  isPercent: boolean;
  status: KpiStatus;
}

interface KpiCardsProps {
  items: KpiCardItem[];
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

export function KpiCards({ items }: KpiCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-5">
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

/** 目標値以上=good、目標の70%以上=warning、それ未満=alert という共通ルールでステータスを判定 */
export function statusFromTarget(value: number, target: number): KpiStatus {
  if (value >= target) return "good";
  if (value >= target * 0.7) return "warning";
  return "alert";
}
