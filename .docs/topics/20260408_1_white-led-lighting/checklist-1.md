# 実装チェックリスト: white-led-lighting

## 対応プラン
- Plan: `./plan-1.md`
- Topic: `20260408_1_white-led-lighting`

## ステータス定義
- `planned`: 計画済み（未着手）
- `done`: 計画どおり完了
- `changed`: 計画から変更して実施（理由を記載）
- `skipped`: 未実施 / 不要化（理由を記載）

## Task別チェック

### Task 1: 白系ライトプリセットを追加する

| ID | 種別 | 内容 | 対応コミット(予定) | 実績コミット | 状態 | メモ |
|---|---|---|---|---|---|---|
| 1-1 | test | 白系プリセット追加後のラベル表示と選択挙動に関するテスト更新方針を整理する | `test: cover white lighting preset selection` | `feat: add white lighting presets` | changed | テスト更新と実装を同一コミットに集約 |
| 1-2 | impl | `lightingPresets` に `Warm White` と `Cool White` を追加し、表示順を決める | `feat: add white lighting presets` | `feat: add white lighting presets` | done |  |
| 1-3 | impl | `LightingControls` と `SimulatorScreen` で現在値表示や状態復元に問題がないことを確認し、必要があれば軽微な表示調整を行う | `feat: align white preset labels in lighting ui` | `feat: add white lighting presets` | changed | 既存 UI のままで成立したため確認のみ実施 |
| 1-4 | verify | 関連テストを実行して結果を確認する | - | `npm test -- --run tests/components/controls/LightingControls.test.tsx tests/components/screens/SimulatorScreen.test.tsx` | done | 15 tests passed |

### Task 2: 白系追加に伴う描画確認と回帰確認を行う

| ID | 種別 | 内容 | 対応コミット(予定) | 実績コミット | 状態 | メモ |
|---|---|---|---|---|---|---|
| 2-1 | test | `LightingControls` と `SimulatorScreen` のテストを更新し、白系プリセットの選択と表示文言を検証する | `test: verify white lighting preset flow` |  | planned |  |
| 2-2 | verify | `night` 背景と明背景での視認性、白飛び、LED バーの見え方を手動確認し、必要なら確認観点を記録する | `docs: record white lighting verification notes` |  | planned |  |
| 2-3 | verify | 対象テスト一式を実行して結果を確認する | - |  | planned |  |

## 計画差分ログ

| 日時 | 変更内容 | 理由 | 承認者 |
|---|---|---|---|
| 2026-04-08 | Task 1 の test / impl を 1 コミットへ集約 | 小規模変更で分離してもレビュー効率が上がらないため | Codex |
| 2026-04-08 | Task 1 の UI 調整を確認のみへ変更 | 既存のプリセット列挙 UI がそのまま利用できたため | Codex |

## 最終確認
- [ ] 全タスクの状態を更新した
- [ ] `changed/skipped` の理由を記載した
- [ ] 実施内容がPR要約に反映された
