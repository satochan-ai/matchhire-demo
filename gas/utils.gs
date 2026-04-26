/**
 * utils.gs
 *
 * シート読み込み・JSON 変換の共通ユーティリティ。
 */

// ─────────────────────────────────────────
// シートデータ取得
// ─────────────────────────────────────────

/**
 * 指定シートの全行を、1行目をヘッダーとしたオブジェクト配列に変換して返す。
 *
 * @param {string} spreadsheetId  スプレッドシート ID
 * @param {string} sheetName      シート名（テーブル名と同一）
 * @returns {Object[]}            ヘッダーをキーとしたオブジェクトの配列
 * @throws {Error}                シートが存在しない場合
 */
function getSheetRows(spreadsheetId, sheetName) {
  var ss    = SpreadsheetApp.openById(spreadsheetId);
  var sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    throw new Error(
      "シート \"" + sheetName + "\" が見つかりません。" +
      "スプレッドシートにシートが存在するか確認してください。"
    );
  }

  var range  = sheet.getDataRange();
  var values = range.getValues();

  // データが 1 行（ヘッダーのみ）または 0 行の場合は空配列を返す
  if (values.length <= 1) {
    return [];
  }

  var headers = values[0].map(function(h) { return String(h).trim(); });
  var rows    = values.slice(1);

  return rows
    // ID カラム（先頭列）が空の行はスキップ
    .filter(function(row) { return row[0] !== "" && row[0] !== null && row[0] !== undefined; })
    .map(function(row) {
      var obj = {};
      headers.forEach(function(header, i) {
        var cell = row[i];

        // undefined / null は空文字に統一
        if (cell === undefined || cell === null) {
          obj[header] = "";
          return;
        }

        // Date オブジェクトは YYYY-MM-DD 文字列に変換
        if (cell instanceof Date) {
          obj[header] = formatDate(cell);
          return;
        }

        // boolean はそのまま維持
        if (typeof cell === "boolean") {
          obj[header] = cell;
          return;
        }

        // 数値はそのまま維持（文字列化しない）
        if (typeof cell === "number") {
          obj[header] = cell;
          return;
        }

        obj[header] = String(cell).trim();
      });
      return obj;
    });
}

// ─────────────────────────────────────────
// 日付フォーマット
// ─────────────────────────────────────────

/**
 * Date オブジェクトを "YYYY-MM-DD" 文字列に変換する。
 * @param {Date} date
 * @returns {string}
 */
function formatDate(date) {
  var y  = date.getFullYear();
  var m  = String(date.getMonth() + 1).padStart(2, "0");
  var d  = String(date.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + d;
}

// ─────────────────────────────────────────
// JSON レスポンス生成
// ─────────────────────────────────────────

/**
 * 成功レスポンス用の ContentService オブジェクトを返す。
 * @param {Object} data  JSON 化するオブジェクト
 * @returns {TextOutput}
 */
function jsonOk(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * エラーレスポンス用の ContentService オブジェクトを返す。
 * GAS の doGet は HTTP ステータスコードを変えられないため、
 * 常に 200 で返しボディの error フィールドでエラーを表現する。
 * @param {string} message  エラーメッセージ
 * @returns {TextOutput}
 */
function jsonError(message) {
  return ContentService
    .createTextOutput(JSON.stringify({ error: message }))
    .setMimeType(ContentService.MimeType.JSON);
}
