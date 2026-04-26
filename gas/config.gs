/**
 * config.gs
 *
 * スプレッドシート ID と API Key を一元管理する。
 *
 * 【設定方法】
 *   1. SPREADSHEET_ID に対象スプレッドシートの ID を貼り付ける
 *      （スプレッドシート URL の /d/XXXXXXXX/edit の XXXXXXXX 部分）
 *
 *   2. API_KEY は直接書かず、GAS スクリプトプロパティに保存する（下記手順）
 *      ① GAS エディタ上部メニュー → 「プロジェクトの設定」
 *      ② 「スクリプトプロパティ」→「プロパティを追加」
 *      ③ プロパティ名: API_KEY
 *         値: 任意のランダム文字列（例: openssl rand -hex 32 で生成）
 *
 *   3. コード上での API_KEY の取得は getConfig() 経由で行う。
 *      絶対にソースコードに直書きしないこと。
 */

// ─────────────────────────────────────────
// スプレッドシート ID（直書きで問題ない）
// ─────────────────────────────────────────

/** 対象スプレッドシートの ID */
var SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE";

// ─────────────────────────────────────────
// 設定取得ユーティリティ
// ─────────────────────────────────────────

/**
 * スクリプトプロパティから設定値を取得する。
 * @returns {{ spreadsheetId: string, apiKey: string }}
 */
function getConfig() {
  var props  = PropertiesService.getScriptProperties();
  var apiKey = props.getProperty("API_KEY");

  if (!apiKey) {
    throw new Error(
      "スクリプトプロパティ API_KEY が設定されていません。" +
      "GAS エディタ → プロジェクトの設定 → スクリプトプロパティ に API_KEY を追加してください。"
    );
  }

  return {
    spreadsheetId: SPREADSHEET_ID,
    apiKey:        apiKey,
  };
}
