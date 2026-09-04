# API Specification

## 目的

現行MVPのブラウザとアプリケーションサーバーの境界を定義し、未実装のサーバー保存APIを現行契約として扱わないようにする。

## 現行MVPのAPI境界

現行MVPにアプリ独自のAPI Route Handlerは存在しない。

| 処理 | 実行場所 | 使用するブラウザAPI |
|---|---|---|
| PNG入力 | クライアント | `FileReader.readAsDataURL` |
| 画像/彫刻処理 | クライアント | Canvas 2D |
| 3Dプレビュー | クライアント | WebGL / React Three Fiber |
| PNG/JPG書き出し | クライアント | `HTMLCanvasElement.toBlob` |
| ローカルダウンロード | クライアント | `URL.createObjectURL` と一時 `a` 要素 |
| 編集状態の保存/復元 | クライアント | `sessionStorage` |

PNGファイル、Data URL、生成したBlob、編集スナップショットはアプリケーションサーバーへ送信しない。

## ページルート

| URL | 種別 | 内容 |
|---|---|---|
| `/` | page | `SimulatorScreen` |
| `/simulator` | page | `/` と同じ `SimulatorScreen` |
| `/usage` | page | 使い方 |
| `/about` | page | アプリ概要 |

`/result` は存在せず、ダウンロード成功時のルート遷移は行わない。

## クライアント側ダウンロードフロー

```text
1. 3Dプレビュー内のCanvasを取得する
2. ExportCropRegionをピクセル座標へ変換する
3. PNGまたはJPGのBlobを生成する
4. EditorSnapshotをsessionStorageまたはメモリへ保存する
5. Object URLを一時リンクへ設定してダウンロードを開始する
6. Object URLを破棄する
7. 成功stateとtoastを表示する
```

処理中に例外が発生した場合はサーバーへ再送せず、画面内エラーとして扱う。

## 現行MVPに存在しないAPI

- `POST /api/upload`
- `POST /api/save`
- `GET /api/simulations/:id`
- `GET /api/simulations`
- 共有URL発行API

`POST /api/upload` は現行UIから使用されず実ストレージへ保存しない実装だったため、Issue #32 / PR #38で削除した。

`POST /api/save` のリクエスト、レスポンス、エラーコードは実装されておらず、現行MVPの契約ではない。

## 将来サーバー機能を設計する条件

サーバー保存または共有を追加する場合は、少なくとも次を同じ設計で確定する。

- 利用者の識別、認証、認可
- 元画像と生成画像の保存先
- ファイル形式、容量、画像寸法、リクエストサイズの制限
- データの保持期間、削除、URL失効
- 保存IDと共有tokenの生成
- 同一データの再送、冪等性、競合処理
- レート制限と濫用対策
- 成功/失敗レスポンスとユーザー向け回復導線
- 監視、ログ、個人情報の取り扱い

APIパスやpayloadは、これらの要件が確定するまで予約しない。

## 関連実装

- `app/page.tsx`
- `app/simulator/page.tsx`
- `components/screens/SimulatorScreen.tsx`
- `lib/image/loadPngTexture.ts`
- `lib/export/exportCanvasImage.ts`
- `lib/download/downloadBlob.ts`
- `lib/save/session.ts`
