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
| 1-1 | test | `ImageControls` の画像未選択状態テストを作成/更新 | `test(ui): cover image controls empty state` | `b278d29` | done |  |
| 1-2 | impl | 画像未選択時の配置調整UIを非表示または待機表示に変更 | `feat(ui): simplify image controls before upload` | `92f83e0` | done |  |
| 1-3 | impl | `Contain / Cover / Fill` を日本語ラベルへ変更 | `feat(ui): localize image fit labels` | `1775988` | done | 内部値は維持 |
| 1-4 | verify | ImageControls / SimulatorScreen 関連テストを実行 | - |  | done | `npm test -- tests/components/controls/ImageControls.test.tsx tests/components/screens/SimulatorScreen.test.tsx` で 19 passed |

### Task 2: タブ間の次ステップ導線追加

| ID | 種別 | 内容 | 対応コミット(予定) | 実績コミット | 状態 | メモ |
|---|---|---|---|---|---|---|
| 2-1 | test | 次ステップCTAでタブ遷移するテストを追加 | `test(ui): cover step navigation between control tabs` | `dde9233` | done |  |
| 2-2 | impl | `SimulatorScreen` に次タブ遷移ハンドラを追加 | `feat(ui): add control step navigation handlers` | `e95fc58` | changed | 既存 `activateControlPanelTab` を流用したため専用ハンドラ追加は不要 |
| 2-3 | impl | 各Controlに次ステップCTAを追加 | `feat(ui): add next step calls to action` | `e95fc58` | changed | Control内部ではなく各tabpanel末尾に配置し、タブ切替責務を親に集約 |
| 2-4 | impl | 画像未選択時のCTA待機/disabled状態を実装 | `feat(ui): gate step actions before upload` | `e95fc58` | changed | CTA追加と同一コミットでdisabled状態を実装。保存ボタン既存disabled維持 |
| 2-5 | verify | SimulatorScreen 関連テストを実行 | - |  | done | `npm test -- tests/components/screens/SimulatorScreen.test.tsx` で 17 passed |

### Task 3: モバイル操作パネルと書き出し視認性改善

| ID | 種別 | 内容 | 対応コミット(予定) | 実績コミット | 状態 | メモ |
|---|---|---|---|---|---|---|
| 3-1 | test | モバイルタブ表示/補助導線のテストを追加/更新 | `test(ui): cover mobile control tab affordance` | `76ef210`, `a99e28d` | done | 補助CTA名の衝突を避けるため `すぐに書き出しへ進む` に調整 |
| 3-2 | impl | 960px以下でタブを2段グリッド表示に変更 | `feat(ui): improve mobile control tab layout` | `5284635` | changed | 書き出し補助CTA/スクロールヒントと同一コミットで実装 |
| 3-3 | impl | 画像読み込み後の書き出し補助CTA/ステータスを追加 | `feat(ui): surface export action after upload` | `5284635` | changed | モバイルタブ改善と同一コミットで実装 |
| 3-4 | impl | デスクトップのパネル内部スクロール視覚ヒントを追加 | `feat(ui): add control panel scroll affordance` | `5284635` | changed | モバイルタブ改善と同一コミットで実装 |
| 3-5 | verify | 関連テストとブラウザ目視確認を実行 | - |  | done | `npm test -- tests/components/screens/SimulatorScreen.test.tsx` で 18 passed。目視確認はTask 4で実施予定 |

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
| 2026-05-04 | Task 2 のCTA配置をControl内部からtabpanel末尾へ変更 | タブ切替責務を `SimulatorScreen` に集約し、Controlの責務拡大を避けるため | implementation decision |
| 2026-05-04 | Task 3 のモバイルタブ、書き出し補助CTA、スクロールヒントを1コミットで実装 | CSSと補助CTAの見た目が密接に関連するため | implementation decision |

## 最終確認

- [ ] 全タスクの状態を更新した
- [ ] `changed/skipped` の理由を記載した
- [ ] 実施内容がPR要約に反映された
- [ ] 関連テストの実行結果を記録した
- [ ] 実ブラウザ確認結果を記録した
