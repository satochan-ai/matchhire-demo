"use client";

import type { ReactNode } from "react";

interface ListPageHeaderProps {
  title: string;
  description?: string;
  filteredCount: number;
  totalCount: number;
  /** データソースバッジ等の任意コンテンツ */
  right?: ReactNode;
}

export function ListPageHeader({ title, description, filteredCount, totalCount, right }: ListPageHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        <p className="mt-1 text-sm text-gray-500">
          {filteredCount.toLocaleString()} 件 / 全 {totalCount.toLocaleString()} 件
        </p>
      </div>
      {right}
    </div>
  );
}
