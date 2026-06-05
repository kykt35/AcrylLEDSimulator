# Phase 3 MVP Implementation Plan

## 概要
Phase 3 では、Phase 2 で確定した画面仕様、状態設計、API 契約、受入基準をもとに、PoC 構成を MVP 実装へ置き換える。現状は `app/page.tsx` と `PocWorkbench` にトップ画面、シミュレーター UI、保存 PoC が混在しているため、まず画面責務を分離し、その後に状態集約、操作パネル分割、保存フロー、結果画面、テスト整備の順で進める。

## 前提条件
- 要件の基準は `docs/specs/product/milestones.md`、`docs/specs/product/prd.md`、`docs/specs/ux/ui-design.md`、`docs/specs/architecture/tech-stack.md` を参照する
- 設計の基準は `docs/specs/ux/screens.md`、`docs/specs/architecture/component-design.md`、`docs/specs/architecture/state-design.md`、`docs/specs/architecture/api.md`、`docs/specs/product/acceptance-criteria.md` を参照する
- 現状コードは PoC として `app/page.tsx` と `components/simulator/PocWorkbench.tsx` を中心に構成されている
- 既存資産として `SimulatorCanvas`、`LightingControls`、`ImageUploader`、`exportCanvasImage`、`lightingPresets` は段階的に流用する
- Phase 3 では Must 機能を優先し、共有 URL、保存履歴、注文導線は対象外とする

**特記事項**
- main ブランチには直接コミットしないこと
- 各 Task の完了時に動作確認と必要なテスト更新を行うこと
- 計画上の API は `Next.js Route Handler` 前提とし、`/api/upload` は簡略化を許容する
- 保存成功導線は結果画面遷移を優先し、保存完了モーダルは補助扱いとする

## タスク一覧

### Task 1: 画面分割と MVP シェルを構築する

**目的:** PoC の単一画面構成をトップ画面、シミュレーター画面、保存結果画面へ分離し、Phase 3 の実装土台を固定する。

**変更ファイル:**
- `app/page.tsx`
- `app/simulator/page.tsx`
- `app/result/page.tsx`
- `app/layout.tsx`
- `app/globals.css`
- `components/simulator/PocWorkbench.tsx`
- `components/screens/SimulatorScreen.tsx`

**サブタスク:**
1. [ ] 現行 `app/page.tsx` からトップ画面へ残す要素とシミュレーター側へ移す要素を切り分ける
2. [ ] コミット: `feat: split home and simulator routes`
3. [ ] `app/page.tsx` をトップ画面責務へ整理し、`試してみる` 導線を追加する
4. [ ] `app/simulator/page.tsx` を新設し、MVP シミュレーター画面のエントリにする
5. [ ] `app/result/page.tsx` を新設し、保存結果表示の受け口を用意する
6. [ ] `PocWorkbench` の代替として `SimulatorScreen` を追加し、今後の状態集約先を固定する
7. [ ] 3 画面で最低限の遷移が成立することを確認する

**受け入れ条件:**
- [ ] `app/page.tsx` がトップ画面責務だけを持つ
- [ ] `/simulator` と `/result` の画面入口が存在する
- [ ] PoC 時点のプレビュー導線を壊さずに画面遷移できる

---

### Task 2: シミュレーター状態を集約し、Canvas を描画責務へ絞る

**目的:** 画像入力、シミュレーション設定、保存状態、UI 補助状態を `SimulatorScreen` に集約し、描画と UI 制御の境界を明確にする。

**変更ファイル:**
- `components/screens/SimulatorScreen.tsx`
- `components/simulator/SimulatorCanvas.tsx`
- `components/simulator/CameraController.tsx`
- `components/simulator/PocWorkbench.tsx`
- `components/upload/ImageUploader.tsx`
- `lib/image/loadPngTexture.ts`
- `lib/simulator/lightingPresets.ts`

**サブタスク:**
1. [ ] `sourceImage`、`simulation`、`save`、`ui` の state 形状を `SimulatorScreen` に実装する
2. [ ] コミット: `feat: centralize simulator screen state`
3. [ ] `sourceImage` と `save` の状態遷移を reducer または同等の明示的な更新ロジックへ寄せる
4. [ ] `SimulatorCanvas` が props ベースで表示更新する構成へ整理する
5. [ ] `ImageUploader` を入力コンポーネント責務へ限定し、読み込み結果を上位へ返す
6. [ ] `PocWorkbench` を廃止または薄い互換ラッパへ縮退させる
7. [ ] 画像アップロードからプレビュー反映までのデータフローが単一路になることを確認する

**受け入れ条件:**
- [ ] シミュレーター画面状態が 1 箇所で管理されている
- [ ] `SimulatorCanvas` が画面状態を独自保持しない
- [ ] 画像読込成功 / 失敗時の state 遷移が UI と一致する

---

### Task 3: 操作パネルを責務ごとに分割する

**目的:** PoC の単一操作パネルを、画像設定、発光設定、表示設定、出力設定へ分割し、MVP UI の拡張性を確保する。

**変更ファイル:**
- `components/controls/LightingControls.tsx`
- `components/controls/ImageControls.tsx`
- `components/controls/DisplayControls.tsx`
- `components/controls/SaveControls.tsx`
- `components/upload/ImageUploader.tsx`
- `components/actions/ExportPreviewButton.tsx`
- `components/screens/SimulatorScreen.tsx`

**サブタスク:**
1. [ ] 現行 `LightingControls` の責務を棚卸しし、分割単位を確定する
2. [ ] コミット: `feat: split simulator control panels`
3. [ ] 画像設定 UI をファイル選択、ファイル名表示、差し替え導線中心に切り出す
4. [ ] 発光設定 UI を LED 色と明るさ変更に限定する
5. [ ] 表示設定 UI を背景、カメラ切替、リセット導線へ分離する
6. [ ] 出力設定 UI を保存ボタン、状態表示、再試行導線へ分離する
7. [ ] 各パネルが独立して動き、設定変更が他セクションへ副作用を漏らさないことを確認する

**受け入れ条件:**
- [ ] 操作パネルが責務単位で分割されている
- [ ] 画像差し替え、LED 色変更、背景切替、カメラ変更、保存操作が独立して動く
- [ ] 状態表示とエラー表示がパネル配置と矛盾しない

---

### Task 4: 保存フローと Route Handler を実装する

**目的:** Canvas 書き出しから保存 API、保存成功 / 失敗の UI 応答までを一連のフローとして成立させる。

**変更ファイル:**
- `app/api/save/route.ts`
- `app/api/upload/route.ts`
- `components/screens/SimulatorScreen.tsx`
- `components/controls/SaveControls.tsx`
- `components/actions/ExportPreviewButton.tsx`
- `lib/export/exportCanvasImage.ts`
- `lib/save/` 配下の新規ファイル

**サブタスク:**
1. [ ] `exportCanvasImage` を保存フローから再利用できる形へ整理する
2. [ ] コミット: `feat: implement simulator save flow`
3. [ ] `/api/save` を追加し、保存画像と simulation 情報を受け取れるようにする
4. [ ] 必要な場合のみ `/api/upload` を追加し、未実装時は `sourceImageId = null` 運用を採る
5. [ ] 保存中、保存成功、保存失敗の state と UI 表示を実装する
6. [ ] 保存成功時に結果画面へ渡すスナップショットを構築する
7. [ ] バリデーションエラーと保存失敗で現在の設定が保持されることを確認する

**受け入れ条件:**
- [ ] 現在のプレビューを保存処理へ渡せる
- [ ] `/api/save` の入出力が `docs/specs/architecture/api.md` と整合する
- [ ] 保存成功 / 失敗の分岐が画面上で明確に判別できる

---

### Task 5: 保存結果画面と補助 UI を実装する

**目的:** 保存成功後の確認導線を整え、注意事項、保存完了、エラー表示の UI を MVP として一貫させる。

**変更ファイル:**
- `app/result/page.tsx`
- `components/screens/ResultScreen.tsx`
- `components/modals/NoticeModal.tsx`
- `components/modals/SaveCompleteModal.tsx`
- `components/ui/ErrorNotice.tsx`
- `components/screens/SimulatorScreen.tsx`
- `app/page.tsx`

**サブタスク:**
1. [ ] 保存結果画面に必要な表示項目と再編集導線の受け渡し方法を確定する
2. [ ] コミット: `feat: add result screen and support ui`
3. [ ] 結果画面へ出力画像、主要設定値、再編集 / 新規作成 / ダウンロード導線を実装する
4. [ ] トップ画面とシミュレーター画面から開ける `notice` UI を実装する
5. [ ] 必要なら保存完了モーダルを追加し、結果画面遷移の補助導線にする
6. [ ] 共通エラー表示コンポーネントを用意し、画像読込と保存失敗で再利用する
7. [ ] 保存成功後の次アクション導線が途切れないことを確認する

**受け入れ条件:**
- [ ] 結果画面で保存完了が明確に伝わる
- [ ] 再編集、新規作成、ダウンロードの導線が使える
- [ ] 注意事項とエラー表示のトーンと配置が一貫している

---

### Task 6: テスト更新と QA 前の実装検証を行う

**目的:** Phase 4 へ引き継げる最低限の信頼性を確保し、主要フローと既知課題を明確化する。

**変更ファイル:**
- `app/`、`components/`、`lib/` 配下の関連テストファイル
- `.docs/topics/20260402_4_mvp-phase-3-mvp-implementation/checklist-1.md`
- `.docs/topics/20260402_4_mvp-phase-3-mvp-implementation/report-2.md`

**サブタスク:**
1. [ ] 既存テスト環境を確認し、必要なユニットテストと画面テストの対象を決める
2. [ ] コミット: `test: cover phase3 simulator flows`
3. [ ] 画像入力、設定変更、保存成功 / 失敗の主要 state 遷移をテストで担保する
4. [ ] ルーティング分割後の主要画面表示と導線を確認する
5. [ ] Chrome、Safari、Edge を想定した確認観点をチェックリストへ残す
6. [ ] 既知不具合、未実装の簡略化、Phase 4 での確認事項を `report-2.md` にまとめる
7. [ ] Phase 3 完了判定が `docs/specs/product/acceptance-criteria.md` を満たすか確認する

**受け入れ条件:**
- [ ] 主要フローの回帰を検知できるテストがある
- [ ] デスクトップ前提のレイアウト確認観点が整理されている
- [ ] Phase 4 へ渡す既知課題と確認項目が文書化されている

## 推奨実装順
1. Task 1 で画面ルーティングと入口を確立する
2. Task 2 で状態管理を `SimulatorScreen` に集約する
3. Task 3 で UI パネルを責務分離する
4. Task 4 で保存 API と保存状態遷移を実装する
5. Task 5 で結果画面と補助 UI を完成させる
6. Task 6 でテスト整備と QA 引き継ぎを行う

## 依存関係
- Task 2 は Task 1 完了後に着手する
- Task 3 は Task 2 の state 集約を前提とする
- Task 4 は Task 2 と Task 3 の両方を前提とする
- Task 5 は Task 4 の保存成功レスポンスと画面遷移設計を前提とする
- Task 6 は全 Task の後段で実施する

## リスクと対策
- 画面分割と state 集約を同時に進めると責務が再混在する
- 対策: 先に `SimulatorScreen` を導入し、状態の集約先を固定してから UI を分割する
- 保存 API の永続化方式を先に作り込みすぎるとスコープ超過になる
- 対策: `/api/save` の契約維持を優先し、保存先の実装は差し替え可能な最小構成に留める
- 結果画面への状態受け渡しが複雑化しやすい
- 対策: MVP は直前保存結果の表示に限定し、履歴や共有の責務を入れない

## 完了判定
- トップ画面からシミュレーター画面へ遷移し、PNG アップロード、LED 色変更、明るさ変更、背景切替、カメラ切替、保存、結果確認まで通せる
- 保存失敗時に画像と設定が保持され、再試行できる
- 実装内容が `docs/specs/product/acceptance-criteria.md` の Must 機能を満たしている
- Phase 4 へ引き継ぐテスト結果と既知課題が文書化されている
