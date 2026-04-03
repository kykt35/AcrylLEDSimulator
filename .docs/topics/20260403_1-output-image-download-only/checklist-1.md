# 実装チェックリスト: output-image-download-only

## 対応プラン
- Plan: `./plan-1.md`
- Topic: `20260403_1-output-image-download-only`

## ステータス定義
- `planned`: 計画済み（未着手）
- `done`: 計画どおり完了
- `changed`: 計画から変更して実施（理由を記載）
- `skipped`: 未実施 / 不要化（理由を記載）

## Task別チェック

### Task 1: 出力処理を Blob ベースへ置き換える

| ID | 種別 | 内容 | 対応コミット(予定) | 実績コミット | 状態 | メモ |
|---|---|---|---|---|---|---|
| 1-1 | test | `exportCanvasImage` の Blob 出力と形式指定のテストを作成/更新 | `test: cover blob-based canvas export` |  | planned |  |
| 1-2 | impl | `exportCanvasImage` を `toBlob()` ベースへ変更し `png/jpeg` を扱えるようにする | `feat: switch canvas export to blob output` |  | planned |  |
| 1-3 | impl | `downloadBlob` ユーティリティを追加する | `feat: add blob download helper` |  | planned |  |
| 1-4 | verify | 関連テストを実行して結果を確認する | - |  | planned |  |

### Task 2: シミュレーター画面をダウンロード専用フローへ変更する

| ID | 種別 | 内容 | 対応コミット(予定) | 実績コミット | 状態 | メモ |
|---|---|---|---|---|---|---|
| 2-1 | test | ダウンロード専用フローと形式選択 UI の画面テストを作成/更新 | `test: update simulator screen for download flow` |  | planned |  |
| 2-2 | impl | `SimulatorScreen` の保存処理をダウンロード処理へ置き換える | `feat: wire simulator download flow` |  | planned |  |
| 2-3 | impl | `SaveControls` と完了モーダルをダウンロード前提へ変更する | `feat: update download controls and modal` |  | planned |  |
| 2-4 | verify | 関連テストを実行して結果を確認する | - |  | planned |  |

### Task 3: 保存専用の画面・API・状態保持を整理する

| ID | 種別 | 内容 | 対応コミット(予定) | 実績コミット | 状態 | メモ |
|---|---|---|---|---|---|---|
| 3-1 | test | 保存 API / 結果画面の廃止に合わせてテスト前提を整理する | `test: remove result screen save assumptions` |  | planned |  |
| 3-2 | impl | `/api/save`、`/result`、保存結果保持ロジックを削除または整理する | `refactor: remove save-only result flow` |  | planned |  |
| 3-3 | impl | 再編集に必要な state のみに絞ってセッション保持を整理する | `refactor: trim session state for download flow` |  | planned |  |
| 3-4 | verify | 関連テストを実行して結果を確認する | - |  | planned |  |

### Task 4: 文言・回帰テスト・仕上げ確認を完了する

| ID | 種別 | 内容 | 対応コミット(予定) | 実績コミット | 状態 | メモ |
|---|---|---|---|---|---|---|
| 4-1 | test | 保存文言の残存箇所に対するテストを更新する | `test: align copy with download terminology` |  | planned |  |
| 4-2 | impl | UI 文言、補助説明、リンク導線をダウンロード前提へ調整する | `chore: align app copy for download-only flow` |  | planned |  |
| 4-3 | verify | 対象テスト一式を実行し、必要な手動確認観点を記録する | `test: verify download-only output flow` |  | planned |  |

## 計画差分ログ

| 日時 | 変更内容 | 理由 | 承認者 |
|---|---|---|---|
|  |  |  |  |

## 最終確認
- [ ] 全タスクの状態を更新した
- [ ] `changed/skipped` の理由を記載した
- [ ] 実施内容がPR要約に反映された
