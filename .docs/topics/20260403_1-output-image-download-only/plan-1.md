# output-image-download-only

## 概要
出力画像フローを「保存」中心の設計から「ダウンロード」専用の設計へ置き換える。`canvas.toDataURL("image/png")` による base64 ベースの一時保持を廃止し、`canvas.toBlob()` で生成した `Blob` を `png/jpg` ファイルとしてダウンロードできるようにする。あわせて、保存 API、結果画面、保存文言など、旧設計に紐づく UI と state を整理する。

## 前提条件
- 現在の出力画像はクライアント側 `canvas` から生成している
- 保存 API `/api/save` は永続化を行っておらず、今回の要件では不要になる
- 透過を維持したい既定動作は `PNG` が適切であり、`JPG` は追加形式として扱う
- テストは Vitest / Testing Library ベースの既存構成に合わせて更新する

**特記事項**
- mainブランチには直接コミットしないこと
- サブタスクを基準に適宜コミットを行うこと
- 実装完了後にコードレビューを実行すること
- 全ての作業が完了した後、PRを作成する

## タスク一覧

### Task 1: 出力処理を Blob ベースへ置き換える

**目的:** base64 `data URL` をやめ、`png/jpg` の実ファイル出力に必要な共通処理を整備する

**変更ファイル:**
- `lib/export/exportCanvasImage.ts`
- `lib/download/downloadBlob.ts`
- `tests/lib/export/exportCanvasImage.test.ts`
- `tests/lib/download/downloadBlob.test.ts`

**サブタスク:**
1. [x] `exportCanvasImage` の戻り値と形式指定に関するテストを作成/更新する
2. [x] コミット: `test: cover blob-based canvas export`
3. [x] `exportCanvasImage` を `toBlob()` ベースの非同期処理へ変更し、`png/jpeg` を選べるようにする
4. [x] コミット: `feat: switch canvas export to blob output`
5. [x] `downloadBlob` ユーティリティを追加し、object URL によるダウンロード処理を実装する
6. [x] コミット: `feat: add blob download helper`
7. [x] 関連テストを実行して結果を確認する

---

### Task 2: シミュレーター画面をダウンロード専用フローへ変更する

**目的:** 保存 API を使わず、シミュレーター画面から直接 `png/jpg` ダウンロードできるようにする

**変更ファイル:**
- `components/screens/SimulatorScreen.tsx`
- `components/controls/SaveControls.tsx`
- `components/modals/SaveCompleteModal.tsx`
- `lib/save/session.ts`
- `tests/components/screens/SimulatorScreen.test.tsx`

**サブタスク:**
1. [x] ダウンロード専用フローと形式選択 UI に関する画面テストを作成/更新する
2. [x] コミット: `test: update simulator screen for download flow`
3. [x] `SimulatorScreen` の `handleSave` / save state を `handleDownload` / download state に置き換える
4. [x] コミット: `feat: wire simulator download flow`
5. [x] `SaveControls` と完了モーダルの文言・props をダウンロード前提へ変更し、必要最小限の形式選択 UI を追加する
6. [x] コミット: `feat: update download controls and modal`
7. [x] 関連テストを実行して結果を確認する

---

### Task 3: 保存専用の画面・API・状態保持を整理する

**目的:** 要件から外れた保存導線と不要コードを削除し、責務をダウンロードへ揃える

**変更ファイル:**
- `app/api/save/route.ts`
- `components/screens/ResultScreen.tsx`
- `app/result/page.tsx`
- `lib/save/session.ts`
- `tests/components/screens/ResultScreen.test.tsx`
- ルーティングや文言参照元の関連ファイル

**サブタスク:**
1. [x] 保存 API / 結果画面の廃止または未使用化に関するテスト整理方針を反映する
2. [x] コミット: `test: remove result screen save assumptions`
3. [x] `/api/save`、`/result`、保存結果保持ロジックを削除またはダウンロード要件に合わせて整理する
4. [x] コミット: `refactor: remove save-only result flow`
5. [x] 画面遷移やセッション保持で残すべき最小 state を見直し、再編集に必要な情報だけ残す
6. [x] コミット: `refactor: trim session state for download flow`
7. [x] 関連テストを実行して結果を確認する

---

### Task 4: 文言・回帰テスト・仕上げ確認を完了する

**目的:** アプリ全体の表現を「保存」から「ダウンロード」へ揃え、回帰を防止する

**変更ファイル:**
- `app/page.tsx`
- `docs` 配下の必要な設計メモ
- `tests/app/page.test.tsx`
- そのほか保存文言が残っている UI / テストファイル

**サブタスク:**
1. [x] 保存文言の残存箇所に対するテスト更新を行う
2. [x] コミット: `test: align copy with download terminology`
3. [x] UI 文言、補助説明、リンク導線をダウンロード前提へ調整する
4. [x] コミット: `chore: align app copy for download-only flow`
5. [x] 対象テスト一式を実行し、必要なら手動確認観点を記録する
6. [x] コミット: `test: verify download-only output flow`
7. [x] 最終差分を見直してレビュー可能な状態に整える

## 依存関係
- Task 2 は Task 1 の完了後に着手
- Task 3 は Task 2 と一部並行できるが、最終的な削除範囲は Task 2 の UI 導線確定後に決定する
- Task 4 は Task 2 と Task 3 の完了後に着手

## 備考
- 初回実装では `PNG` を既定値とし、`JPG` は明示選択時のみ使う方針とする
- `JPG` 出力時の透明部分の扱いは UI 文言または実装で明示する
- 結果画面を完全削除するか、単なる案内画面へ縮退するかは Task 3 の実装時に差分量を見て決める
