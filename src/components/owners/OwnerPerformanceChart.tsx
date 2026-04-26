"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { OwnerMetrics } from "@/lib/mockData";

type ChartMode = "count" | "rate";

interface OwnerPerformanceChartProps {
  metrics: OwnerMetrics[];
  mode: ChartMode;
}

export function OwnerPerformanceChart({ metrics, mode }: OwnerPerformanceChartProps) {
  if (mode === "count") {
    const data = metrics.map((m) => ({
      name:        m.ownerName,
      送信数:       m.sentCount,
      有効応募数:   m.validCount,
      面接数:       m.interviewCount,
      内定数:       m.offerCount,
      承諾数:       m.acceptCount,
    }));

    return (
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 13 }} />
          <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="送信数"     fill="#93c5fd" radius={[4, 4, 0, 0]} />
          <Bar dataKey="有効応募数" fill="#6ee7b7" radius={[4, 4, 0, 0]} />
          <Bar dataKey="面接数"     fill="#a78bfa" radius={[4, 4, 0, 0]} />
          <Bar dataKey="内定数"     fill="#34d399" radius={[4, 4, 0, 0]} />
          <Bar dataKey="承諾数"     fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  // rate モード
  const data = metrics.map((m) => ({
    name:     m.ownerName,
    開封率:   parseFloat(m.openRate.toFixed(1)),
    返信率:   parseFloat(m.replyRate.toFixed(1)),
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fontSize: 13 }} />
        <YAxis unit="%" tick={{ fontSize: 12 }} domain={[0, 100]} />
        <Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} />
        <Legend />
        <Bar dataKey="開封率" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        <Bar dataKey="返信率" fill="#10b981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
