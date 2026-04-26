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

interface ChannelData {
  channel: string;
  openRate: number;
  replyRate: number;
  validRate: number;
}

interface ChannelChartProps {
  data: ChannelData[];
}

export function ChannelChart({ data }: ChannelChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="channel" tick={{ fontSize: 13 }} />
        <YAxis unit="%" tick={{ fontSize: 12 }} domain={[0, 100]} />
        <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
        <Legend />
        <Bar dataKey="openRate" name="開封率" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        <Bar dataKey="replyRate" name="返信率" fill="#10b981" radius={[4, 4, 0, 0]} />
        <Bar dataKey="validRate" name="有効応募率" fill="#f59e0b" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
