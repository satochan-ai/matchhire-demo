"use client";

export type ApplicationValidity = "有効" | "無効" | "未判定";

const validityStyles: Record<ApplicationValidity, string> = {
  有効:  "bg-green-100 text-green-700",
  無効:  "bg-red-100 text-red-600",
  未判定: "bg-gray-100 text-gray-500",
};

export function ApplicationValidityBadge({ validity }: { validity: ApplicationValidity }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${validityStyles[validity]}`}>
      {validity}
    </span>
  );
}
