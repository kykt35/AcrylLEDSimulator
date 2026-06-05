# 実装チェックリスト: 3Dビュー画像入力導線変更

## 対応プラン
- Plan: `./plan-1.md`
- Topic: `20260410_1_3d-view-image-input`

## ステータス定義
- `planned`: 計画済み（未着手）
- `done`: 計画どおり完了
- `changed`: 計画から変更して実施（理由を記載）
- `skipped`: 未実施 / 不要化（理由を記載）

## Task別チェック

### Task 1: 3Dビュー入力導線の受け皿を設計する

| ID | 種別 | 内容 | 対応コミット(予定) | 実績コミット | 状態 | メモ |
|---|---|---|---|---|---|---|
| 1-1 | test | 3Dビュー上のクリック選択・ドラッグ受付に関するテスト追加/更新 | `test: cover file input entry points on simulator preview` | `406403b` | done | `tests/components/screens/SimulatorScreen.test.tsx` を更新 |
| 1-2 | impl | `SimulatorCanvas` もしくは外側ホストにアップロード受け皿を追加 | `feat: add preview-host upload surface` | `406403b` | done | `preview-stage` を入力面へ変更 |
| 1-3 | impl | drag中/読込中/空状態のスタイルを整理 | `feat: style drag and click upload affordance on preview` | `406403b` | done | `app/globals.css` に drag/hint UI を追加 |
| 1-4 | verify | 関連コンポーネントテストを実行 | - | `npm test -- tests/components/screens/SimulatorScreen.test.tsx` | done | 16 tests passed |

### Task 2: 画像選択ロジックを 3Dビュー用に再配置する

| ID | 種別 | 内容 | 対応コミット(予定) | 実績コミット | 状態 | メモ |
|---|---|---|---|---|---|---|
| 2-1 | test | PNG検証と無効入力時の回帰テストを更新 | `test: preserve png validation when moving upload entry` | `256d47d` | done | サイズ制限の検証を追加 |
| 2-2 | impl | PNG選択ロジックを共通化し、3Dビュー側から再利用可能にする | `refactor: extract reusable png file selection logic` | `256d47d` | done | `validatePngFile` にサイズ制限を集約 |
| 2-3 | impl | `handleFileSelected` と新入力導線を接続 | `feat: connect preview surface to source image loader` | `406403b` | done | preview input と drop が同じハンドラを利用 |
| 2-4 | verify | 読み込み成功・失敗・非PNGのテストを実行 | - | `npm test -- tests/components/controls/ImageControls.test.tsx tests/lib/image/loadPngTexture.test.ts tests/components/screens/SimulatorScreen.test.tsx` | done | 21 tests passed |

### Task 3: 画像タブから旧アップロードUIを撤去し、状態表示を整理する

| ID | 種別 | 内容 | 対応コミット(予定) | 実績コミット | 状態 | メモ |
|---|---|---|---|---|---|---|
| 3-1 | test | 画像タブの新表示内容に合わせてテスト更新 | `test: update image controls after removing inline uploader` | `256d47d` | done | `ImageControls` テストを更新 |
| 3-2 | impl | `ImageControls` をステータス表示と調整UI中心に整理 | `feat: simplify image controls to status and layout only` | `256d47d` | done | 3Dビュー起点の説明と状態表示へ変更 |
| 3-3 | impl | 旧 `ImageUploader` UI を削除または内部整理 | `refactor: remove deprecated image uploader panel ui` | `256d47d` | done | コンポーネントとテストを削除 |
| 3-4 | verify | コントロール系テストを実行 | - | `npm test -- tests/components/controls/ImageControls.test.tsx tests/lib/image/loadPngTexture.test.ts tests/components/screens/SimulatorScreen.test.tsx` | done | 関連3ファイル通過 |

### Task 4: 仕様文言と回帰確認項目を更新する

| ID | 種別 | 内容 | 対応コミット(予定) | 実績コミット | 状態 | メモ |
|---|---|---|---|---|---|---|
| 4-1 | docs | 画面仕様・エラーハンドリングのアップロード導線表現を更新 | `docs: update simulator upload flow references` |  | done | `docs/specs/ux/screens.md` と `docs/specs/architecture/error-handling.md` を更新 |
| 4-2 | docs | QA観点へ3Dビュー起点の操作を追加 | `docs: add qa coverage for preview-based upload` |  | done | クリック・ドラッグのQA観点を追記 |
| 4-3 | verify | チェックリストとテスト結果の整合を確認 | - |  | done | コミットとテスト結果を反映済み |

## 計画差分ログ

| 日時 | 変更内容 | 理由 | 承認者 |
|---|---|---|---|
|  |  |  |  |

## 最終確認
- [x] 全タスクの状態を更新した
- [x] `changed/skipped` の理由を記載した
- [ ] 実施内容がPR要約に反映された
