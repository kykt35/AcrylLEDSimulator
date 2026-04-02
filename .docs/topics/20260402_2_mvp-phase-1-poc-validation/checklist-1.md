# 実装チェックリスト: Phase 1 PoC Implementation Plan

## 対応プラン
- Plan: `./plan-1.md`
- Topic: `20260402_2_mvp-phase-1-poc-validation`

## ステータス定義
- `planned`: 計画済み（未着手）
- `done`: 計画どおり完了
- `changed`: 計画から変更して実施（理由を記載）
- `skipped`: 未実施 / 不要化（理由を記載）

## Task別チェック

### Task 1: PoC 基盤セットアップ

| ID | 種別 | 内容 | 対応コミット(予定) | 実績コミット | 状態 | メモ |
|---|---|---|---|---|---|---|
| 1-1 | test | 初期画面と Canvas マウント条件のテスト作成 | `test: add phase1 poc app shell coverage` |  | planned |  |
| 1-2 | impl | Next.js / R3F / レイアウトの最小構成追加 | `feat: scaffold phase1 poc app shell` |  | planned |  |
| 1-3 | verify | テスト実行コマンドとセットアップメモ整備 | `chore: document phase1 poc setup` |  | planned |  |
| 1-4 | verify | テスト実行と結果確認 | - |  | planned |  |

### Task 2: 透過 PNG とアクリル板表現の PoC

| ID | 種別 | 内容 | 対応コミット(予定) | 実績コミット | 状態 | メモ |
|---|---|---|---|---|---|---|
| 2-1 | test | PNG 読み込みと透過反映のテスト作成 | `test: cover png upload and acrylic mesh inputs` |  | planned |  |
| 2-2 | impl | アップロード UI、PNG ローダー、アクリル板メッシュの実装 | `feat: add png upload and acrylic panel prototype` |  | planned |  |
| 2-3 | verify | サンプル画像での表示確認と技術メモ記録 | `docs: record acrylic panel poc findings` |  | planned |  |
| 2-4 | verify | テスト実行と結果確認 | - |  | planned |  |

### Task 3: 発光表現とカメラ操作の PoC

| ID | 種別 | 内容 | 対応コミット(予定) | 実績コミット | 状態 | メモ |
|---|---|---|---|---|---|---|
| 3-1 | test | LED 色変更とカメラ操作のテスト作成 | `test: add lighting and camera poc coverage` |  | planned |  |
| 3-2 | impl | LED ベース、発光表現、カメラ操作の実装 | `feat: prototype led glow and camera controls` |  | planned |  |
| 3-3 | verify | 見た目評価基準の整理と記録 | `docs: define visual acceptance notes for poc` |  | planned |  |
| 3-4 | verify | テスト実行と結果確認 | - |  | planned |  |

### Task 4: 画像書き出し検証と PoC 評価まとめ

| ID | 種別 | 内容 | 対応コミット(予定) | 実績コミット | 状態 | メモ |
|---|---|---|---|---|---|---|
| 4-1 | test | 画像書き出し処理のテスト作成 | `test: cover preview export behavior` |  | planned |  |
| 4-2 | impl | Canvas 画像出力と操作ボタンの実装 | `feat: add preview export verification` |  | planned |  |
| 4-3 | verify | 性能、難易度、残課題、Go / No-Go 判断のレポート化 | `docs: summarize phase1 poc evaluation` |  | planned |  |
| 4-4 | verify | テスト実行と結果確認 | - |  | planned |  |

## 計画差分ログ

| 日時 | 変更内容 | 理由 | 承認者 |
|---|---|---|---|
|  |  |  |  |

## 最終確認
- [ ] 全タスクの状態を更新した
- [ ] `changed/skipped` の理由を記載した
- [ ] 実施内容がPR要約に反映された
