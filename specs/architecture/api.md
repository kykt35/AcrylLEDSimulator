# Phase 2 API Specification

## 目的
MVP の画像アップロードと保存機能に必要な最小 API 契約を定義し、Phase 3 実装でクライアントとサーバーの境界が揺れないようにする。

## 設計方針
- MVP では `Next.js Route Handler` を前提にする
- 画像書き出し自体はクライアントで実行し、その結果を保存 API へ渡す
- 保存先実装は後続で差し替え可能とするが、クライアント契約は固定する
- 共有 URL や履歴一覧取得 API は MVP 対象外とする

## API 一覧

| エンドポイント | メソッド | 用途 |
|---|---|---|
| `/api/upload` | `POST` | 元画像の保存先確保またはアップロード |
| `/api/save` | `POST` | 保存済み出力画像と設定値の登録 |

## 1. `/api/upload`

### 用途
- ユーザーが選択した PNG を保存し、再利用可能な URL を返す
- MVP では即時プレビューが優先のため、クライアント上の object URL だけで完結してもよい
- 永続保存が必要な場合に備えて API 契約は先に用意する

### リクエスト

```http
POST /api/upload
Content-Type: multipart/form-data
```

| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| `file` | binary | 必須 | PNG ファイル |
| `clientFileName` | string | 任意 | 元ファイル名 |

### 成功レスポンス

```json
{
  "sourceImageId": "src_01HXYZ",
  "sourceImageUrl": "https://example.com/source/src_01HXYZ.png",
  "fileName": "sample.png",
  "mimeType": "image/png",
  "width": 1200,
  "height": 1200
}
```

### バリデーション
- PNG 以外は受け付けない
- サイズ上限は MVP で別途決めるが、少なくとも UI に制限を明示する
- 空ファイルは拒否する

### 失敗レスポンス

| ステータス | 条件 | レスポンス例 |
|---|---|---|
| `400` | PNG 以外、空ファイル | `{ "code": "INVALID_FILE", "message": "PNG ファイルを選択してください。" }` |
| `413` | ファイルサイズ超過 | `{ "code": "FILE_TOO_LARGE", "message": "ファイルサイズが上限を超えています。" }` |
| `500` | 保存先書き込み失敗 | `{ "code": "UPLOAD_FAILED", "message": "画像の保存に失敗しました。" }` |

## 2. `/api/save`

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
  "sourceImageId": "src_01HXYZ",
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
- `sourceImageId` は未アップロード運用の場合 `null` 許容でもよい
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
2. 画像入力が永続保存対象なら /api/upload を先に実行する
3. /api/save に画像と simulation を送る
4. 成功時は保存結果画面に必要な値を state またはレスポンスから組み立てる
```

## MVP で許容する簡略化
- `/api/upload` を実装せず、ローカル object URL だけでプレビューを成立させる
- その場合でも `/api/save` の契約は維持し、`sourceImageId` を `null` で受ける
- 保存結果画面が当面不要なら、`/api/save` の成功レスポンスを保存完了モーダルで使ってもよい

## 将来拡張
- `GET /api/simulations/:id`
- `GET /api/simulations`
- 共有 URL 用トークン発行
- 保存履歴の絞り込み
