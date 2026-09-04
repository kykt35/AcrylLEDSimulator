# Phase 2 API Specification

## 目的
MVP のクライアントとサーバーの境界、および将来サーバー機能を追加する場合の API 契約候補を定義する。

## 設計方針
- PNG入力はブラウザ内の `FileReader` と Data URL で完結させ、サーバーへアップロードしない
- 画像書き出し自体はクライアントで実行し、その結果を保存 API へ渡す
- 保存先実装は後続で差し替え可能とするが、クライアント契約は固定する
- 共有 URL や履歴一覧取得 API は MVP 対象外とする

## API 一覧

| エンドポイント | メソッド | 用途 |
|---|---|---|
| `/api/save` | `POST` | 保存済み出力画像と設定値の登録 |

## 1. `/api/save`

### 用途
- 現在のシミュレーション結果を画像と設定値のセットとして保存する
- 保存結果画面で利用する参照情報を返す

### リクエスト

```http
POST /api/save
Content-Type: application/json
```

```json
{
  "sourceImageId": null,
  "exportedImageDataUrl": "data:image/png;base64,...",
  "simulation": {
    "ledColorId": "ice-blue",
    "brightness": 1.4,
    "backgroundId": "dark-room",
    "cameraPresetId": "front"
  },
  "meta": {
    "sourceFileName": "sample.png"
  }
}
```

### リクエストルール
- `exportedImageDataUrl` はクライアントで書き出した PNG を送る
- 現行MVPは元画像をアップロードしないため、`sourceImageId` は `null` とする
- `simulation` は保存結果画面と再編集導線で使うため必須

### 成功レスポンス

```json
{
  "savedSimulationId": "sim_01HXYZ",
  "resultImageUrl": "https://example.com/result/sim_01HXYZ.png",
  "savedAt": "2026-04-03T10:00:00.000Z",
  "simulation": {
    "ledColorId": "ice-blue",
    "brightness": 1.4,
    "backgroundId": "dark-room",
    "cameraPresetId": "front"
  }
}
```

### 失敗レスポンス

| ステータス | 条件 | レスポンス例 |
|---|---|---|
| `400` | 必須項目不足、Data URL 不正 | `{ "code": "INVALID_PAYLOAD", "message": "保存データが不正です。" }` |
| `422` | 画像書き出しはあるが設定値不正 | `{ "code": "INVALID_SIMULATION", "message": "保存設定を確認してください。" }` |
| `500` | 保存処理失敗 | `{ "code": "SAVE_FAILED", "message": "保存に失敗しました。時間をおいて再試行してください。" }` |

## クライアント側保存フロー

```text
1. Canvas を PNG Data URL として書き出す
2. /api/save に画像と simulation を送る
3. 成功時は保存結果画面に必要な値を state またはレスポンスから組み立てる
```

## MVP で許容する簡略化
- 元画像はブラウザ内で Data URL として読み込み、サーバーへ送信または永続化しない
- `/api/save` の契約では `sourceImageId` を `null` で受ける
- 保存結果画面が当面不要なら、`/api/save` の成功レスポンスを保存完了モーダルで使ってもよい

## 将来拡張
- 元画像のサーバーアップロードは、実ストレージ、認証・認可、容量と形式の制限、レート制限、エラー契約、URLのライフサイクルを含む別機能として設計する
- `GET /api/simulations/:id`
- `GET /api/simulations`
- 共有 URL 用トークン発行
- 保存履歴の絞り込み
