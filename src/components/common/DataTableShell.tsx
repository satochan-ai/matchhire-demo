import type { ReactNode } from "react";

interface DataTableShellProps {
  children: ReactNode;
}

/** thead/tbody を受け取るテーブルの外枠（overflow-x-auto + table w-full）だけを共通化する薄いラッパー */
export function DataTableShell({ children }: DataTableShellProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}
