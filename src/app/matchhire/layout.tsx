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

        {/* モバイル専用フッター（PC はサイドバー下部に表示） */}
        <footer className="md:hidden shrink-0 border-t border-slate-200 bg-white px-4 py-2 text-center">
          <p className="text-[10px] text-slate-400 leading-relaxed">
            © 2026 MatchHire. All rights reserved. 無断転載・無断複製を禁じます。
          </p>
        </footer>
      </div>
    </div>
  );
}
