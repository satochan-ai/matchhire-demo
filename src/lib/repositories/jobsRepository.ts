import { jobs as mockJobs, type Job } from "@/lib/mockData";
import { getDataSource } from "@/lib/dataSource";
import { toArray } from "@/lib/repositories/utils";

interface SheetsJobRow {
  id: string;
  title: string;
  department: string;
  status: string;
  employment_type: string;
  description: string;
  requirements: string;
}

function normalize(row: SheetsJobRow): Job {
  return {
    id:             row.id,
    title:          row.title,
    department:     row.department,
    status:         row.status         as Job["status"],
    employmentType: row.employment_type as Job["employmentType"],
    description:    row.description ?? "",
    requirements:   toArray(row.requirements),
  };
}

async function fetchFromEndpoint(endpoint: string): Promise<Job[]> {
  const res = await fetch(endpoint, { cache: "no-store" });
  if (!res.ok) throw new Error(`jobs の取得に失敗しました（HTTP ${res.status}）`);
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  if (!Array.isArray(json.rows)) throw new Error("レスポンス形式が不正です");
  return (json.rows as SheetsJobRow[]).map(normalize);
}

export async function fetchJobs(): Promise<Job[]> {
  const source = getDataSource();
  if (source === "mock")   return Promise.resolve(mockJobs);
  if (source === "csv")    return fetchFromEndpoint("/api/csv/jobs");
  return fetchFromEndpoint("/api/sheets/jobs");
}
