# 実装チェックリスト: acrylic-engraving-grayscale-simulation

## 対応プラン
- Plan: `./plan-1.md`
- Topic: `20260403_2-acrylic-engraving-grayscale-simulation`

## ステータス定義
- `planned`: 計画済み（未着手）
- `done`: 計画どおり完了
- `changed`: 計画から変更して実施（理由を記載）
- `skipped`: 未実施 / 不要化（理由を記載）

## Task別チェック

### Task 1: 彫刻用グレースケール生成基盤を実装する

| ID | 種別 | 内容 | 対応コミット(予定) | 実績コミット | 状態 | メモ |
|---|---|---|---|---|---|---|
| 1-1 | test | アルファ込みグレースケール化と各補正値の画像処理テストを作成/更新 | `test: cover engraving map generation` | `feat: add engraving map generation pipeline` | changed | テストと実装を同一コミットへ集約 |
| 1-2 | impl | `engravingFilters` と `generateEngravingMap` を実装する | `feat: add engraving map generation pipeline` | `feat: add engraving map generation pipeline` | done |  |
| 1-3 | impl | 読み込み導線を拡張し、元画像と彫刻用画像を扱えるようにする | `feat: load source image with engraving assets` | `feat: add engraving map generation pipeline` | changed | 基盤コミットへ統合 |
| 1-4 | verify | 彫刻用 PNG 書き出しを追加し、関連テストを実行して確認する | - | `npm test` | done | 全体テストで確認 |

### Task 2: 彫刻データ編集 UI と 2D プレビューを追加する

| ID | 種別 | 内容 | 対応コミット(予定) | 実績コミット | 状態 | メモ |
|---|---|---|---|---|---|---|
| 2-1 | test | 彫刻パラメータ編集と 2D プレビューの画面テストを作成/更新 | `test: cover engraving controls and preview` | `feat: add engraving preview and glow workflow` | changed | UI 実装と同一コミットへ集約 |
| 2-2 | impl | 彫刻パラメータを編集する UI を追加する | `feat: add engraving adjustment controls` | `feat: add engraving preview and glow workflow` | changed | 2D preview 接続まで含めて実施 |
| 2-3 | impl | `SimulatorScreen` に元画像 / 彫刻画像プレビューと出力導線を接続する | `feat: wire engraving map preview flow` | `feat: add engraving preview and glow workflow` | changed | glow 連携と同時に実施 |
| 2-4 | verify | 関連テストを実行して結果を確認する | - | `npm test` | done | 全体テストで確認 |

### Task 3: 彫刻マップを使った LED 導光シミュレーションを実装する

| ID | 種別 | 内容 | 対応コミット(予定) | 実績コミット | 状態 | メモ |
|---|---|---|---|---|---|---|
| 3-1 | test | 彫刻マップ適用時の発光表現に関するテストを作成/更新 | `test: cover engraving glow simulation` | `feat: add engraving preview and glow workflow` | changed | UI 連携込みで 1 コミットに集約 |
| 3-2 | impl | 板材レイヤと発光レイヤを分離し、発光マテリアルを実装する | `feat: add engraving glow material` | `feat: add engraving preview and glow workflow` | changed | glow workflow コミットへ統合 |
| 3-3 | impl | シミュレーターへ彫刻マップ、LED 色、明るさ、減衰を接続する | `feat: drive simulator with engraving map` | `feat: add engraving preview and glow workflow` | changed | 2D preview 導線と同時に実施 |
| 3-4 | verify | 関連テストを実行して結果を確認する | - | `npm test` | done | 全体テストで確認 |

### Task 4: 仕上げ調整、文言整備、回帰確認を完了する

| ID | 種別 | 内容 | 対応コミット(予定) | 実績コミット | 状態 | メモ |
|---|---|---|---|---|---|---|
| 4-1 | test | 彫刻用画像とシミュレーション導線の文言テストを更新する | `test: align copy for engraving workflow` | `docs: finalize engraving simulation workflow` | changed | docs 更新と同一コミットへ集約 |
| 4-2 | impl | UI 文言、補助説明、README / docs を彫刻ワークフロー前提へ調整する | `docs: align app copy with engraving workflow` | `docs: finalize engraving simulation workflow` | changed | README / LP / checklist を同時更新 |
| 4-3 | verify | 対象テスト一式を実行し、必要な手動確認観点を記録する | `test: verify engraving grayscale simulation flow` | `npm test` | done | Vitest 全件 30 tests passed |

## 計画差分ログ

| 日時 | 変更内容 | 理由 | 承認者 |
|---|---|---|---|
| 2026-04-03 | Task 2 と Task 3 を 1 コミットへ統合 | UI と glow 接続が密結合で分離レビュー効率が低かったため | Codex |
| 2026-04-03 | test / impl の一部を同一コミット化 | 実装単位を保ちつつ履歴を簡潔にするため | Codex |

## 最終確認
- [x] 全タスクの状態を更新した
- [x] `changed/skipped` の理由を記載した
- [ ] 実施内容がPR要約に反映された
