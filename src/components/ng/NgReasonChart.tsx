"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { NgReasonCount } from "@/lib/mockData";

/** blue/slate 系に統一（警告色は使わない）。件数降順の並びに合わせて濃→淡 */
const COLORS = [
  "#1d4ed8", // blue-700
  "#3b82f6", // blue-500
  "#0284c7", // sky-600
  "#4f46e5", // indigo-600
  "#0e7490", // cyan-700
  "#475569", // slate-600
  "#94a3b8", // slate-400
];

interface NgReasonChartProps {
  data: NgReasonCount[];
  total: number;
}

export function NgReasonChart({ data, total }: NgReasonChartProps) {
  // 凡例・ツールチップに理由名と件数を併記し、色だけに依存しない
  const chartData = data
    .filter((d) => d.count > 0)
    .map((d) => ({ name: `${d.reason}（${d.count}件）`, value: d.count }));

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs text-slate-500">不採用合計：<span className="tabular-nums">{total}</span> 件</p>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={100}
            paddingAngle={1}
            dataKey="value"
          >
            {chartData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => [`${value} 件`, "件数"]} />
          <Legend
            formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
