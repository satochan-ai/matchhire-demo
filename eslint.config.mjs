import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "next-env.d.ts",
    ],
  },
  {
    // 既存の fetch 系カスタムフック（useCandidates / useRawData 等）は
    // マウント時・refetch 時に loading/error を同期的にリセットする
    // 昔ながらのパターンを採用している。React Compiler 向けの
    // react-hooks/set-state-in-effect は新しい非同期パターンを要求するが、
    // 本フェーズではフック自体の大規模書き換えは行わないため無効化する。
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default eslintConfig;
