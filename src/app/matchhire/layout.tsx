import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default function HireLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* 左サイドバー */}
      <Sidebar />

      {/* 右コンテンツエリア */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* 上部ヘッダー */}
        <Header />

        {/* ページ本体 */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
