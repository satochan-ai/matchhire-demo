/**
 * Code.gs
 *
 * GAS Web App のエントリポイント。
 * GET リクエストを受け取り、対象シートのデータを JSON で返す。
 *
 * エンドポイント:
 *   GET {deployUrl}?table=candidates&key=YOUR_API_KEY
 *
 * レスポンス（成功）:
 *   { "rows": [ { "id": "c1", "name": "山田 太郎", ... }, ... ] }
 *
 * レスポンス（エラー）:
 *   { "error": "エラーメッセージ" }
 *
 * ※ GAS は HTTP ステータスコードを変更できないため、エラー時も HTTP 200 で返す。
 *    Next.js Route Handler 側（route.ts）でボディの error フィールドを確認して
 *    適切なステータスコードに変換している。
 */

// ─────────────────────────────────────────
// 許可するテーブル名（ホワイトリスト）
// ─────────────────────────────────────────

var ALLOWED_TABLES = [
  "candidates",
  "jobs",
  "applications",
  "contacts",
  "interviews",
  "evaluations",
];

// ─────────────────────────────────────────
// エントリポイント
// ─────────────────────────────────────────

/**
 * GAS Web App の GET ハンドラー。
 * @param {Object} e  リクエストイベントオブジェクト
 * @returns {TextOutput}
 */
function doGet(e) {
  try {
    // ── 1. パラメータ取得 ────────────────
    var params = e.parameter || {};
    var table  = params.table  || "";
    var key    = params.key    || "";

    // ── 2. API Key 認証 ──────────────────
    var config = getConfig();
    if (key !== config.apiKey) {
      return jsonError("Unauthorized: API Key が一致しません。");
    }

    // ── 3. テーブル名バリデーション ───────
    if (!table) {
      return jsonError("Bad Request: クエリパラメータ table が指定されていません。");
    }
    if (ALLOWED_TABLES.indexOf(table) === -1) {
      return jsonError(
        "Bad Request: \"" + table + "\" は対応していないテーブルです。" +
        "対応テーブル: " + ALLOWED_TABLES.join(", ")
      );
    }

    // ── 4. シートからデータ取得 ──────────
    var rows = getSheetRows(config.spreadsheetId, table);

    // ── 5. 成功レスポンス ────────────────
    return jsonOk({ rows: rows });

  } catch (err) {
    // 予期しないエラー（シートが存在しない、設定ミスなど）
    return jsonError("Internal Error: " + err.message);
  }
}

// ─────────────────────────────────────────
// 動作確認用（GAS エディタから直接実行可能）
// ─────────────────────────────────────────

/**
 * candidates シートの取得テスト。
 * GAS エディタで testFetchCandidates を選択して「実行」するとログに出力される。
 */
function testFetchCandidates() {
  var e = { parameter: { table: "candidates", key: getConfig().apiKey } };
  var result = doGet(e);
  Logger.log(result.getContent());
}

/**
 * API Key 認証テスト（不正キーで弾かれることを確認）。
 */
function testUnauthorized() {
  var e = { parameter: { table: "candidates", key: "wrong-key" } };
  var result = doGet(e);
  Logger.log(result.getContent()); // { "error": "Unauthorized: ..." } が出力されれば OK
}

/**
 * 不正テーブル名テスト。
 */
function testUnknownTable() {
  var e = { parameter: { table: "owners", key: getConfig().apiKey } };
  var result = doGet(e);
  Logger.log(result.getContent()); // { "error": "Bad Request: ..." } が出力されれば OK
}
