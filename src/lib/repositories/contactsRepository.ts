import { contacts as mockContacts, type Contact } from "@/lib/mockData";
import { getDataSource } from "@/lib/dataSource";
import { toBoolean } from "@/lib/repositories/utils";

interface SheetsContactRow {
  id: string;
  candidate_id: string;
  owner_id: string;
  date: string;
  channel: string;
  opened: string | boolean;
  replied: string | boolean;
}

function normalize(row: SheetsContactRow): Contact {
  return {
    id:          row.id,
    candidateId: row.candidate_id,
    ownerId:     row.owner_id,
    date:        row.date,
    channel:     row.channel as Contact["channel"],
    opened:      toBoolean(row.opened),
    replied:     toBoolean(row.replied),
  };
}

async function fetchFromEndpoint(endpoint: string): Promise<Contact[]> {
  const res = await fetch(endpoint, { cache: "no-store" });
  if (!res.ok) throw new Error(`contacts の取得に失敗しました（HTTP ${res.status}）`);
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  if (!Array.isArray(json.rows)) throw new Error("レスポンス形式が不正です");
  return (json.rows as SheetsContactRow[]).map(normalize);
}

export async function fetchContacts(): Promise<Contact[]> {
  const source = getDataSource();
  if (source === "mock")   return Promise.resolve(mockContacts);
  if (source === "csv")    return fetchFromEndpoint("/api/csv/contacts");
  return fetchFromEndpoint("/api/sheets/contacts");
}
