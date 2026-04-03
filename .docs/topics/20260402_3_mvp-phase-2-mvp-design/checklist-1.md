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
| 1-1 | design | 対象画面、遷移、主要アクション、MVP 対象外を整理する | `docs: outline phase2 screen spec scope` | 未コミット | done | 3 画面 + 3 モーダル構成を固定 |
| 1-2 | design | `screen-spec.md` に 3 画面と補助モーダルの仕様を記述する | `docs: define mvp screen specifications` | 未コミット | done | 画面責務、状態別 UI、レスポンシブ方針まで記述 |
| 1-3 | design | `user-flow.md` に主要導線と分岐条件を記述する | `docs: add simulator user flow design` | 未コミット | done | 保存成功 / 失敗分岐を明文化 |
| 1-4 | verify | PRD の Must 機能との対応を確認する | - | 未コミット | done | 画像入力、調整、保存導線を仕様へ反映 |

### Task 2: コンポーネント構成と状態管理方針を設計する

| ID | 種別 | 内容 | 対応コミット(予定) | 実績コミット | 状態 | メモ |
|---|---|---|---|---|---|---|
| 2-1 | design | 現行 PoC の責務境界と不足点を整理する | `docs: capture current poc architecture gaps` |  | planned |  |
| 2-2 | design | `component-design.md` に責務分割とディレクトリ構成を記述する | `docs: define mvp component architecture` |  | planned |  |
| 2-3 | design | `state-design.md` に状態種別とデータフローを記述する | `docs: define simulator state management` |  | planned |  |
| 2-4 | verify | 画面仕様と状態更新起点の整合性を確認する | - |  | planned |  |

### Task 3: API、保存データ、エラー処理を設計する

| ID | 種別 | 内容 | 対応コミット(予定) | 実績コミット | 状態 | メモ |
|---|---|---|---|---|---|---|
| 3-1 | design | 保存対象とクライアント / サーバー境界を整理する | `docs: outline save flow constraints` |  | planned |  |
| 3-2 | design | `api-spec.md` にアップロード / 保存 API 契約を記述する | `docs: define upload and save api contracts` |  | planned |  |
| 3-3 | design | `data-model.md` と `error-handling.md` に保存データと失敗時挙動を記述する | `docs: define save data and error handling` |  | planned |  |
| 3-4 | verify | Phase 3 の保存実装に必要な判断材料が揃っているか確認する | - |  | planned |  |

### Task 4: 受入基準と Phase 3 着手用バックログを確定する

| ID | 種別 | 内容 | 対応コミット(予定) | 実績コミット | 状態 | メモ |
|---|---|---|---|---|---|---|
| 4-1 | design | 受入観点とブラウザ確認観点を整理する | `docs: outline mvp acceptance viewpoints` |  | planned |  |
| 4-2 | design | `acceptance-criteria.md` に Must 機能中心の受入基準を記述する | `docs: define mvp acceptance criteria` |  | planned |  |
| 4-3 | design | `phase-3-backlog.md` に Phase 3 の実装順とバックログを記述する | `docs: create phase3 execution backlog` |  | planned |  |
| 4-4 | verify | 受入基準と実装順の依存関係整合性を確認する | - |  | planned |  |

## 計画差分ログ

| 日時 | 変更内容 | 理由 | 承認者 |
|---|---|---|---|
|  |  |  |  |

## 最終確認
- [ ] 全タスクの状態を更新した
- [ ] `changed/skipped` の理由を記載した
- [ ] 実施内容が PR 要約に反映された
