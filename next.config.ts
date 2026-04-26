import type { NextConfig } from "next";

/**
 * GITHUB_PAGES=true のときだけ静的エクスポート設定を有効にする。
 *
 * ローカル開発（npm run dev）: 通常モード、API Routes 有効、basePath なし
 * GitHub Pages ビルド       : output: "export"、basePath: "/matchhire-demo"
 *
 * pageExtensions を ['tsx', 'jsx'] に絞ることで、
 * すべての API Route（*.route.ts）を静的エクスポートの対象から除外する。
 * ページ・レイアウトはすべて .tsx のため影響なし。
 *
 * ビルドコマンド例:
 *   GitHub Actions : GITHUB_PAGES=true NEXT_PUBLIC_DATA_SOURCE=mock npm run build:gh
 *   ローカル確認   : $env:GITHUB_PAGES="true"; $env:NEXT_PUBLIC_DATA_SOURCE="mock"; npm run build:gh
 */
const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  ...(isGithubPages && {
    output: "export",
    basePath: "/matchhire-demo",
    assetPrefix: "/matchhire-demo/",
    trailingSlash: true,
    images: { unoptimized: true },
    // route.ts（API Routes）を静的エクスポート対象から除外する
    // ページ・レイアウト・コンポーネントはすべて .tsx なので影響なし
    pageExtensions: ["tsx", "jsx"],
  }),
};

export default nextConfig;
