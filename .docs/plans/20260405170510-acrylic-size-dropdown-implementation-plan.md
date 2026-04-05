# アクリル板サイズプルダウン - 実装計画

## 概要
`/simulator` にアクリル板サイズを選択するプルダウンを追加し、選択値が 3D プレビュー、台座表現、カメラ距離、保存復元へ一貫して反映されるようにする。現状は [`components/simulator/AcrylicStandMesh.tsx`](/Users/kiyotada/projects/quartet-labo/AcrylLEDSimulator/components/simulator/AcrylicStandMesh.tsx) と [`components/simulator/LedBaseMesh.tsx`](/Users/kiyotada/projects/quartet-labo/AcrylLEDSimulator/components/simulator/LedBaseMesh.tsx) に固定寸法が埋め込まれているため、この計画ではサイズプリセットの導入を起点に UI・描画・保存の責務を整理する。

## 前提条件
- MVP では自由入力ではなく、定型のサイズプリセット選択のみを対象とする
- 初期値は現状の見た目に最も近い中サイズを採用する
- サイズ変更時に画像レイアウト `imageLayout` は維持し、自動リセットは行わない
- 回帰確認は [`tests/components/controls/ImageControls.test.tsx`](/Users/kiyotada/projects/quartet-labo/AcrylLEDSimulator/tests/components/controls/ImageControls.test.tsx)、[`tests/components/screens/SimulatorScreen.test.tsx`](/Users/kiyotada/projects/quartet-labo/AcrylLEDSimulator/tests/components/screens/SimulatorScreen.test.tsx)、[`tests/components/simulator/AcrylicStandMesh.test.tsx`](/Users/kiyotada/projects/quartet-labo/AcrylLEDSimulator/tests/components/simulator/AcrylicStandMesh.test.tsx)、[`tests/components/simulator/CameraController.test.tsx`](/Users/kiyotada/projects/quartet-labo/AcrylLEDSimulator/tests/components/simulator/CameraController.test.tsx)、[`tests/lib/save/session.test.ts`](/Users/kiyotada/projects/quartet-labo/AcrylLEDSimulator/tests/lib/save/session.test.ts) を中心に行う

**特記事項**
- mainブランチには直接コミットしないこと
- サブタスクを基準に適宜コミットを行うこと
- 実装完了後にコードレビューを実行すること
- 全ての作業が完了した後、PRを作成する

## タスク一覧

### Task 1: サイズプリセット基盤と保存復元の契約を先に固定する

**目的:** サイズ選択を UI の一時 state で終わらせず、描画と保存で共通利用できる型・プリセット・snapshot 契約を定義する。

**変更ファイル:**
- `lib/simulator/acrylicSizePresets.ts`
- `lib/save/session.ts`
- `tests/lib/save/session.test.ts`
- `tests/components/screens/SimulatorScreen.test.tsx`

**サブタスク:**
1. [ ] テストの作成/更新: `SimulationSnapshot` に `acrylicSizeId` を追加した際の保存・復元互換性を検証する。既存データで値が欠けるケースはデフォルトへフォールバックすることも確認する（コミット: `test: cover acrylic size snapshot defaults`）
2. [ ] サイズプリセット定義ファイルを追加し、既定サイズ ID・プリセット一覧・取得関数を実装する（コミット: `feat: add acrylic size presets`）
3. [ ] `EditorSnapshot` の simulation 契約へ `acrylicSizeId` を追加し、型と復元フォールバックを整える（コミット: `feat: persist acrylic size selection`）
4. [ ] テスト実行

**受け入れ条件:**
- [ ] サイズプリセットが単一モジュールで管理され、UI と描画の両方から参照できる
- [ ] 保存時に `acrylicSizeId` が snapshot へ含まれる
- [ ] 旧 snapshot に `acrylicSizeId` がない場合も既定サイズで安全に復元される

---

### Task 2: 操作パネルと画面 state にサイズ選択を追加する

**目的:** ユーザーがプルダウンでサイズを選択でき、その選択が `SimulatorScreen` の状態と表示ラベルへ反映されるようにする。

**変更ファイル:**
- `components/controls/ImageControls.tsx`
- `components/screens/SimulatorScreen.tsx`
- `tests/components/controls/ImageControls.test.tsx`
- `tests/components/screens/SimulatorScreen.test.tsx`

**サブタスク:**
1. [ ] テストの作成/更新: `ImageControls` にサイズプルダウンが表示され、変更イベントが上位コールバックへ渡ることを検証する（コミット: `test: cover acrylic size dropdown controls`）
2. [ ] テストの作成/更新: `SimulatorScreen` で既定サイズ表示、サイズ変更、resume 復元時の反映を検証する（コミット: `test: cover simulator size selection state`）
3. [ ] `ImageControls` にサイズプルダウン UI と props を追加し、`SimulatorScreen` に `acrylicSizeId` state、status 表示、snapshot 連携を実装する（コミット: `feat: add acrylic size selector`）
4. [ ] テスト実行

**受け入れ条件:**
- [ ] 画像設定セクションでサイズをプルダウン選択できる
- [ ] 初期表示時に既定サイズが選択されている
- [ ] サイズ選択変更が `SimulatorScreen` の state と保存データへ反映される
- [ ] `resume=1` で前回選択したサイズが復元される

---

### Task 3: 3D シーンへサイズプリセットを反映し、見切れ回帰を防ぐ

**目的:** 選択されたサイズが板 geometry、台座寸法、ライト位置、カメラ距離へ伝播し、見た目の整合性を保つ。

**変更ファイル:**
- `components/simulator/SimulatorCanvas.tsx`
- `components/simulator/AcrylicStandMesh.tsx`
- `components/simulator/LedBaseMesh.tsx`
- `components/simulator/CameraController.tsx`
- `tests/components/simulator/SimulatorCanvas.test.tsx`
- `tests/components/simulator/AcrylicStandMesh.test.tsx`
- `tests/components/simulator/CameraController.test.tsx`

**サブタスク:**
1. [ ] テストの作成/更新: `SimulatorCanvas` が `sizePreset` を下位コンポーネントへ受け渡すこと、`AcrylicStandMesh` がプリセット寸法を geometry に反映することを検証する（コミット: `test: cover acrylic size rendering props`）
2. [ ] テストの作成/更新: `CameraController` がサイズ係数に応じてカメラ距離を補正することを検証する（コミット: `test: cover camera distance by acrylic size`）
3. [ ] `SimulatorCanvas` に `sizePreset` props を追加し、`AcrylicStandMesh` と `LedBaseMesh` の固定値をプリセット参照へ置き換える（コミット: `feat: scale acrylic mesh and base by preset`）
4. [ ] `CameraController` にサイズ倍率補正を実装し、正面・俯瞰・接写の基準位置と整合させる（コミット: `feat: adjust camera for acrylic size`）
5. [ ] テスト実行

**受け入れ条件:**
- [ ] サイズ変更時にアクリル板寸法がプレビューへ即時反映される
- [ ] 台座と発光位置が板サイズに対して不自然に崩れない
- [ ] 各サイズで正面・俯瞰・接写の初期表示が極端に見切れない
- [ ] 既存の LED 色、明るさ、背景、画像オーバーレイの動作が回帰しない

## 依存関係
- Task 2 は Task 1 の完了後に着手する
- Task 3 は Task 2 の完了後に着手する

## 備考
- サイズ選択肢の具体値は実商品の SKU に寄せて最終決定すること
- `LedBaseMesh` の寸法比率は見た目優先の暫定値としてよく、実測完全一致は今回のスコープ外とする
- 実装後は `/simulator` 上で S/M/L の各サイズについて、画像未選択時と画像選択時の両方を手動確認する
