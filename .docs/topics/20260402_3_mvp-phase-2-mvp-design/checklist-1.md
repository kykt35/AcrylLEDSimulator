# 実装チェックリスト: Phase 2 MVP Design

## 対応プラン
- Plan: `./plan-1.md`
- Topic: `20260402_3_mvp-phase-2-mvp-design`

## ステータス定義
- `planned`: 計画済み（未着手）
- `done`: 計画どおり完了
- `changed`: 計画から変更して実施（理由を記載）
- `skipped`: 未実施 / 不要化（理由を記載）

## Task別チェック

### Task 1: 画面仕様とユーザーフローの設計を確定する

| ID | 種別 | 内容 | 対応コミット(予定) | 実績コミット | 状態 | メモ |
|---|---|---|---|---|---|---|
| 1-1 | design | 対象画面、遷移、主要アクション、MVP 対象外を整理する | `docs: outline phase2 screen spec scope` | `359e1e9` | done | 3 画面 + 3 モーダル構成を固定 |
| 1-2 | design | `screen-spec.md` に 3 画面と補助モーダルの仕様を記述する | `docs: define mvp screen specifications` | `359e1e9` | done | 画面責務、状態別 UI、レスポンシブ方針まで記述 |
| 1-3 | design | `user-flow.md` に主要導線と分岐条件を記述する | `docs: add simulator user flow design` | `359e1e9` | done | 保存成功 / 失敗分岐を明文化 |
| 1-4 | verify | PRD の Must 機能との対応を確認する | - | `359e1e9` | done | 画像入力、調整、保存導線を仕様へ反映 |

### Task 2: コンポーネント構成と状態管理方針を設計する

| ID | 種別 | 内容 | 対応コミット(予定) | 実績コミット | 状態 | メモ |
|---|---|---|---|---|---|---|
| 2-1 | design | 現行 PoC の責務境界と不足点を整理する | `docs: capture current poc architecture gaps` | `c785bef` | done | `PocWorkbench` 集中の問題を整理 |
| 2-2 | design | `component-design.md` に責務分割とディレクトリ構成を記述する | `docs: define mvp component architecture` | `c785bef` | done | 画面、UI、3D、保存の境界を定義 |
| 2-3 | design | `state-design.md` に状態種別とデータフローを記述する | `docs: define simulator state management` | `c785bef` | done | 画像入力、設定、保存、UI 補助 state を分類 |
| 2-4 | verify | 画面仕様と状態更新起点の整合性を確認する | - | `c785bef` | done | 画面遷移と保存フローに合わせて持ち場所を整理 |

### Task 3: API、保存データ、エラー処理を設計する

| ID | 種別 | 内容 | 対応コミット(予定) | 実績コミット | 状態 | メモ |
|---|---|---|---|---|---|---|
| 3-1 | design | 保存対象とクライアント / サーバー境界を整理する | `docs: outline save flow constraints` | `02fd4cd` | done | クライアント書き出し + Route Handler 保存で整理 |
| 3-2 | design | `api-spec.md` にアップロード / 保存 API 契約を記述する | `docs: define upload and save api contracts` | `02fd4cd` | done | `/api/upload` と `/api/save` の最小契約を定義 |
| 3-3 | design | `data-model.md` と `error-handling.md` に保存データと失敗時挙動を記述する | `docs: define save data and error handling` | `02fd4cd` | done | 保存モデルと UI 応答を定義 |
| 3-4 | verify | Phase 3 の保存実装に必要な判断材料が揃っているか確認する | - | `02fd4cd` | done | リクエスト / レスポンス / 異常系を網羅 |

### Task 4: 受入基準と Phase 3 着手用バックログを確定する

| ID | 種別 | 内容 | 対応コミット(予定) | 実績コミット | 状態 | メモ |
|---|---|---|---|---|---|---|
| 4-1 | design | 受入観点とブラウザ確認観点を整理する | `docs: outline mvp acceptance viewpoints` | `b62d80e` | done | Must 機能中心の判定軸へ整理 |
| 4-2 | design | `acceptance-criteria.md` に Must 機能中心の受入基準を記述する | `docs: define mvp acceptance criteria` | `b62d80e` | done | 操作、保存、エラー時挙動を定義 |
| 4-3 | design | `phase-3-backlog.md` に Phase 3 の実装順とバックログを記述する | `docs: create phase3 execution backlog` | `b62d80e` | done | 依存関係順に Epic 化 |
| 4-4 | verify | 受入基準と実装順の依存関係整合性を確認する | - | `b62d80e` | done | Phase 3 の着手順を検証 |

## 計画差分ログ

| 日時 | 変更内容 | 理由 | 承認者 |
|---|---|---|---|
| 2026-04-03 | Phase 2 計画を設計成果物の追加とチェックリスト更新として実施 | plan-1.md に基づく実装対象がドキュメントであるため | Codex |

## 最終確認
- [x] 全タスクの状態を更新した
- [x] `changed/skipped` の理由を記載した
- [ ] 実施内容が PR 要約に反映された
