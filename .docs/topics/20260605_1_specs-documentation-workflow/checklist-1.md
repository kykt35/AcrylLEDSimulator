# 実装チェックリスト: Specs Documentation Workflow Implementation Plan

## 対応プラン
- Plan: `./plan-1.md`
- Topic: `20260605_1_specs-documentation-workflow`

## ステータス定義
- `planned`: 計画済み（未着手）
- `done`: 計画どおり完了
- `changed`: 計画から変更して実施（理由を記載）
- `skipped`: 未実施 / 不要化（理由を記載）

## Task別チェック

### Task 1: 仕様入口と運用構造の定義

| ID | 種別 | 内容 | 対応コミット(予定) | 実績コミット | 状態 | メモ |
|---|---|---|---|---|---|---|
| 1-1 | docs | 既存 `docs/*.md` と現行実装の仕様境界を確認する | `docs: audit existing specification sources` | `docs: define specs documentation structure` | done | `docs/`, `app/`, `components/`, `lib/`, `tests/` を確認 |
| 1-2 | docs | `docs/specs/README.md` に分類と参照順序を定義する | `docs: define specs documentation structure` | `docs: define specs documentation structure` | done |  |
| 1-3 | docs | `docs/specs/feature-index.md` をリンク専用入口として作成する | `docs: add feature specification index` | `docs: define specs documentation structure` | done | 詳細本文は書かずリンク入口に限定 |
| 1-4 | docs | `docs/specs/operations/` に仕様更新手順と変更履歴を追加する | `docs: add specification maintenance workflow` | `docs: define specs documentation structure` | done |  |
| 1-5 | verify | `find docs/specs -maxdepth 3 -type f | sort` で配置を確認する | - | `docs: define specs documentation structure` | done | 4ファイルの配置を確認 |

### Task 2: 既存 `docs/` 仕様の分類移行

| ID | 種別 | 内容 | 対応コミット(予定) | 実績コミット | 状態 | メモ |
|---|---|---|---|---|---|---|
| 2-1 | docs | `docs/specs/product`, `docs/specs/ux`, `docs/specs/architecture` を作成する | `docs: create specs hierarchy` | `docs: move existing specs into specs hierarchy` | done |  |
| 2-2 | docs | PRD、マイルストーン、受け入れ条件を `docs/specs/product/` へ移行する | `docs: move product specs` | `docs: move existing specs into specs hierarchy` | done |  |
| 2-3 | docs | ユーザーフロー、画面仕様、UIデザインを `docs/specs/ux/` へ移行する | `docs: move ux specs` | `docs: move existing specs into specs hierarchy` | done |  |
| 2-4 | docs | 技術スタック、コンポーネント、状態、データ、API、エラー仕様を `docs/specs/architecture/` へ移行する | `docs: move architecture specs` | `docs: move existing specs into specs hierarchy` | done |  |
| 2-5 | docs | 旧 `docs/` を移行案内だけにするか空にし、二重管理を解消する | `docs: remove duplicated legacy specs` | `docs: move existing specs into specs hierarchy` | done | `docs/README.md` のみ残す |
| 2-6 | verify | 旧 `docs/` パス参照を検索し、残存参照を確認する | - | `docs: move existing specs into specs hierarchy` | done | 対象旧パスの参照なし |

### Task 3: 現行機能の詳細仕様作成

| ID | 種別 | 内容 | 対応コミット(予定) | 実績コミット | 状態 | メモ |
|---|---|---|---|---|---|---|
| 3-1 | docs | 実装とテストから機能境界、入口、関連パスを洗い出す | `docs: audit simulator feature boundaries` | `docs: add simulator feature specifications` | done | `components/controls`, `components/simulator`, `lib`, `tests` を確認 |
| 3-2 | docs | シミュレーター全体、画像入力、彫刻マップ生成の詳細仕様を追加する | `docs: add simulator input and engraving specs` | `docs: add simulator feature specifications` | done |  |
| 3-3 | docs | LED発光設定、アクリルサイズ、背景、カメラ、表示切替の詳細仕様を追加する | `docs: add lighting and display specs` | `docs: add simulator feature specifications` | done |  |
| 3-4 | docs | 書き出し、クロップ、彫刻画像ダウンロード、セッション保存/復元の詳細仕様を追加する | `docs: add export and save specs` | `docs: add simulator feature specifications` | done |  |
| 3-5 | docs | `feature-index.md` の機能カテゴリと詳細仕様リンクを更新する | `docs: update feature index links` | `docs: add simulator feature specifications` | done | Task 1で作成したリンク構成と詳細仕様を対応 |
| 3-6 | verify | 各詳細仕様の必須見出しと関連実装/関連テストの存在を確認する | - | `docs: add simulator feature specifications` | done | 必須見出しと主要リンクを確認 |

### Task 4: 仕様更新ワークフローと参照リンクの整備

| ID | 種別 | 内容 | 対応コミット(予定) | 実績コミット | 状態 | メモ |
|---|---|---|---|---|---|---|
| 4-1 | docs | `README.md` に仕様入口へのリンクを追加する | `docs: link specs from readme` | `docs: add specification update workflow` | done |  |
| 4-2 | docs | `AGENTS.md` に作業ルール、仕様参照先、検証コマンドを追加する | `docs: add agent project guide` | `docs: add specification update workflow` | done |  |
| 4-3 | docs | `.agents/implementation-change-rules.md` に仕様更新判断ルールを追加する | `docs: add implementation change rules` | `docs: add specification update workflow` | done |  |
| 4-4 | docs | `.agents/skills/spec-update/SKILL.md` に仕様更新手順を追加する | `docs: add spec update skill` | `docs: add specification update workflow` | done |  |
| 4-5 | docs | `.github/pull_request_template.md` に仕様更新確認欄を追加する | `docs: add pr spec checklist` | `docs: add specification update workflow` | done |  |
| 4-6 | verify | `README.md`, `AGENTS.md`, `.agents`, `.github`, `specs`, `.docs` のリンクと旧参照を確認する | - | `docs: add specification update workflow`, `docs: clarify specs workflow verification` | done | 新規/移行仕様リンクと旧仕様パス解消を確認。過去 `.docs` の絶対パスリンクは対象外 |
| 4-7 | verify | ドキュメントのみの変更としてアプリテスト省略可否をPR本文に記録する | - | `docs: add specification update workflow` | done | アプリ実装変更なしのため `pnpm test` は省略 |

## 計画差分ログ

| 日時 | 変更内容 | 理由 | 承認者 |
|---|---|---|---|
| 2026-06-05 | 初版作成 | 元計画と `quartet-labo/an-ne_platform#336` の仕様運用方針を統合するため |  |

## 最終確認
- [x] 全タスクの状態を更新した
- [x] `changed/skipped` の理由を記載した
- [ ] 実施内容がPR要約に反映された
