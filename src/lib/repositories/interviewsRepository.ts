import { interviews as mockInterviews, type Interview } from "@/lib/mockData";
import { getDataSource } from "@/lib/dataSource";

interface SheetsInterviewRow {
  id: string;
  application_id: string;
  candidate_id: string;
  date: string;
  interviewer: string;
  result: string;
  comment: string;
}

function normalize(row: SheetsInterviewRow): Interview {
  return {
    id:            row.id,
    applicationId: row.application_id,
    candidateId:   row.candidate_id,
    date:          row.date,
    interviewer:   row.interviewer,
    result:        row.result as Interview["result"],
    comment:       row.comment ?? "",
  };
}

async function fetchFromEndpoint(endpoint: string): Promise<Interview[]> {
  const res = await fetch(endpoint, { cache: "no-store" });
  if (!res.ok) throw new Error(`interviews の取得に失敗しました（HTTP ${res.status}）`);
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  if (!Array.isArray(json.rows)) throw new Error("レスポンス形式が不正です");
  return (json.rows as SheetsInterviewRow[]).map(normalize);
}

export async function fetchInterviews(): Promise<Interview[]> {
  const source = getDataSource();
  if (source === "mock")   return Promise.resolve(mockInterviews);
  if (source === "csv")    return fetchFromEndpoint("/api/csv/interviews");
  return fetchFromEndpoint("/api/sheets/interviews");
}
