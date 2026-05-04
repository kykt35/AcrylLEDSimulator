# 実装チェックリスト: uiux-current-improvements

## 対応プラン

- Plan: `./plan-2.md`
- Topic: `20260409_1_uiux-improvement-report`
- Source report: `./report-1.md`

## ステータス定義

- `planned`: 計画済み（未着手）
- `done`: 計画どおり完了
- `changed`: 計画から変更して実施（理由を記載）
- `skipped`: 未実施 / 不要化（理由を記載）

## Task別チェック

### Task 1: 画像未選択時のUI整理と文言改善

| ID | 種別 | 内容 | 対応コミット(予定) | 実績コミット | 状態 | メモ |
|---|---|---|---|---|---|---|
| 1-1 | test | `ImageControls` の画像未選択状態テストを作成/更新 | `test(ui): cover image controls empty state` |  | planned |  |
| 1-2 | impl | 画像未選択時の配置調整UIを非表示または待機表示に変更 | `feat(ui): simplify image controls before upload` |  | planned |  |
| 1-3 | impl | `Contain / Cover / Fill` を日本語ラベルへ変更 | `feat(ui): localize image fit labels` |  | planned | 内部値は維持 |
| 1-4 | verify | ImageControls / SimulatorScreen 関連テストを実行 | - |  | planned |  |

### Task 2: タブ間の次ステップ導線追加

| ID | 種別 | 内容 | 対応コミット(予定) | 実績コミット | 状態 | メモ |
|---|---|---|---|---|---|---|
| 2-1 | test | 次ステップCTAでタブ遷移するテストを追加 | `test(ui): cover step navigation between control tabs` |  | planned |  |
| 2-2 | impl | `SimulatorScreen` に次タブ遷移ハンドラを追加 | `feat(ui): add control step navigation handlers` |  | planned | ロジックは親に集約 |
| 2-3 | impl | 各Controlに次ステップCTAを追加 | `feat(ui): add next step calls to action` |  | planned | 画像->彫刻->ライト->表示->書き出し |
| 2-4 | impl | 画像未選択時のCTA待機/disabled状態を実装 | `feat(ui): gate step actions before upload` |  | planned | 保存ボタン既存disabled維持 |
| 2-5 | verify | SimulatorScreen 関連テストを実行 | - |  | planned |  |

### Task 3: モバイル操作パネルと書き出し視認性改善

| ID | 種別 | 内容 | 対応コミット(予定) | 実績コミット | 状態 | メモ |
|---|---|---|---|---|---|---|
| 3-1 | test | モバイルタブ表示/補助導線のテストを追加/更新 | `test(ui): cover mobile control tab affordance` |  | planned |  |
| 3-2 | impl | 960px以下でタブを2段グリッド表示に変更 | `feat(ui): improve mobile control tab layout` |  | planned | 横スクロール依存を下げる |
| 3-3 | impl | 画像読み込み後の書き出し補助CTA/ステータスを追加 | `feat(ui): surface export action after upload` |  | planned |  |
| 3-4 | impl | デスクトップのパネル内部スクロール視覚ヒントを追加 | `feat(ui): add control panel scroll affordance` |  | planned |  |
| 3-5 | verify | 関連テストとブラウザ目視確認を実行 | - |  | planned | デスクトップ/モバイル相当 |

### Task 4: 入口ガイドと最終UX確認

| ID | 種別 | 内容 | 対応コミット(予定) | 実績コミット | 状態 | メモ |
|---|---|---|---|---|---|---|
| 4-1 | test | シミュレーター開始ガイドの表示テストを追加 | `test(ui): cover simulator start guide` |  | planned |  |
| 4-2 | impl | ヘッダー下に短い開始ガイドを追加 | `feat(ui): add simulator start guide` |  | planned | プレビュー主役を維持 |
| 4-3 | docs | `/about` の説明/CTA文言を必要最小限で整合 | `docs(ui): align about copy with simulator entry` |  | planned | ルーティング変更はしない |
| 4-4 | verify | 主要テストを実行 | - |  | planned | `npm test` または対象テスト |
| 4-5 | verify | 実ブラウザでデスクトップ/モバイル相当のUX確認 | - |  | planned | 結果をメモに記録 |

## 計画差分ログ

| 日時 | 変更内容 | 理由 | 承認者 |
|---|---|---|---|
| 2026-05-04 | `report-1.md` をもとに `plan-2.md` / `checklist-2.md` を作成 | 現状UI分析から実装可能なPR単位へ分解するため | user request |

## 最終確認

- [ ] 全タスクの状態を更新した
- [ ] `changed/skipped` の理由を記載した
- [ ] 実施内容がPR要約に反映された
- [ ] 関連テストの実行結果を記録した
- [ ] 実ブラウザ確認結果を記録した
