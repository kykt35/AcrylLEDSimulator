# acrylic-engraving-grayscale-simulation

## 概要
入力 PNG からレーザー彫刻用のグレースケール画像を生成し、その結果を使って「彫刻した部分だけが LED 導光で光る」見え方をシミュレーター上で表現する。実装は、画像前処理、編集 UI、Three.js 側の発光表現、仕上げ検証の順に進める。

## 前提条件
- 現状の入力導線は PNG アップロードと Data URL 読み込みのみを提供している
- 現状の `AcrylicStandMesh` はアップロード画像をそのまま貼り付けており、彫刻強度マップの概念がない
- MVP では厳密な光学再現ではなく、彫刻量に応じた散乱発光の近似表現を目標とする
- グレースケール画像の意味は `0 = 未彫刻`, `255 = 強彫刻` で統一する
- テストは Vitest / Testing Library ベースの既存構成に合わせて追加・更新する

**特記事項**
- mainブランチには直接コミットしないこと
- サブタスクを基準に適宜コミットを行うこと
- 実装完了後にコードレビューを実行すること
- 全ての作業が完了した後、PRを作成する

## タスク一覧

### Task 1: 彫刻用グレースケール生成基盤を実装する

**目的:** 入力画像を彫刻強度マップへ変換する純関数と出力処理を整備し、後続 UI とシミュレーションが利用できる基盤を作る

**変更ファイル:**
- `lib/image/generateEngravingMap.ts`
- `lib/image/engravingFilters.ts`
- `lib/image/loadPngTexture.ts`
- `lib/export/exportEngravingImage.ts`
- `tests/lib/image/generateEngravingMap.test.ts`
- `tests/lib/image/loadPngTexture.test.ts`

**サブタスク:**
1. [ ] アルファ込みグレースケール化、`contrast`、`gamma`、`threshold`、`invert` の画像処理テストを作成する
2. [ ] コミット: `test: cover engraving map generation`
3. [ ] `engravingFilters` と `generateEngravingMap` を実装し、`0 = 未彫刻 / 255 = 強彫刻` の定義で出力できるようにする
4. [ ] コミット: `feat: add engraving map generation pipeline`
5. [ ] 読み込み導線を拡張し、元画像に加えて彫刻用グレースケール画像とそのメタデータを扱えるようにする
6. [ ] コミット: `feat: load source image with engraving assets`
7. [ ] 彫刻用 PNG の書き出し処理を追加し、関連テストを実行して結果を確認する

---

### Task 2: 彫刻データ編集 UI と 2D プレビューを追加する

**目的:** ユーザーが彫刻用グレースケール画像を調整し、元画像との差分を見ながら出力内容を確定できるようにする

**変更ファイル:**
- `components/controls/EngravingControls.tsx`
- `components/controls/ImageControls.tsx`
- `components/screens/SimulatorScreen.tsx`
- `components/ui/ErrorNotice.tsx`
- `tests/components/controls/EngravingControls.test.tsx`
- `tests/components/screens/SimulatorScreen.test.tsx`

**サブタスク:**
1. [ ] 彫刻パラメータ編集とグレースケール 2D プレビューに関する画面テストを作成/更新する
2. [ ] コミット: `test: cover engraving controls and preview`
3. [ ] `contrast`、`gamma`、`threshold`、`invert`、必要なら `edgeWeight` を操作する UI を追加する
4. [ ] コミット: `feat: add engraving adjustment controls`
5. [ ] `SimulatorScreen` に元画像プレビュー、彫刻用グレースケールプレビュー、出力導線を接続する
6. [ ] コミット: `feat: wire engraving map preview flow`
7. [ ] 関連テストを実行して結果を確認する

---

### Task 3: 彫刻マップを使った LED 導光シミュレーションを実装する

**目的:** Three.js 側で彫刻部のみが強く光る見え方を近似し、LED 色・明るさ・上下減衰をシミュレーションへ反映する

**変更ファイル:**
- `components/simulator/AcrylicStandMesh.tsx`
- `components/simulator/SimulatorCanvas.tsx`
- `components/simulator/EngravingGlowMaterial.tsx`
- `lib/simulator/acrylicMaterial.ts`
- `tests/components/simulator/AcrylicStandMesh.test.tsx`
- `tests/components/simulator/SimulatorCanvas.test.tsx`

**サブタスク:**
1. [ ] 彫刻マップ適用時の発光表現と未彫刻部の抑制に関するコンポーネントテストを作成/更新する
2. [ ] コミット: `test: cover engraving glow simulation`
3. [ ] 板材レイヤと発光レイヤを分離し、彫刻強度に応じた発光マテリアルを実装する
4. [ ] コミット: `feat: add engraving glow material`
5. [ ] `SimulatorCanvas` と `SimulatorScreen` から彫刻マップ、LED 色、明るさを渡し、下端からの減衰を反映する
6. [ ] コミット: `feat: drive simulator with engraving map`
7. [ ] 関連テストを実行して結果を確認する

---

### Task 4: 仕上げ調整、文言整備、回帰確認を完了する

**目的:** UI 上の意味づけを統一し、彫刻用画像出力とシミュレーションの導線をレビュー可能な状態に仕上げる

**変更ファイル:**
- `app/page.tsx`
- `README.md`
- `docs` 配下の必要な設計メモ
- `tests/app/page.test.tsx`
- 文言や説明が残る関連 UI / テストファイル

**サブタスク:**
1. [ ] 彫刻用画像とシミュレーション導線に関する文言・案内のテスト更新を行う
2. [ ] コミット: `test: align copy for engraving workflow`
3. [ ] UI 文言、補助説明、README や関連ドキュメントを彫刻ワークフロー前提へ調整する
4. [ ] コミット: `docs: align app copy with engraving workflow`
5. [ ] 対象テスト一式を実行し、必要なら手動確認観点を記録する
6. [ ] コミット: `test: verify engraving grayscale simulation flow`
7. [ ] 最終差分を見直してレビュー可能な状態に整える

## 依存関係
- Task 2 は Task 1 の完了後に着手
- Task 3 は Task 1 の出力形式確定後に着手し、Task 2 の state 設計と揃えて接続する
- Task 4 は Task 2 と Task 3 の完了後に着手

## 備考
- `edgeWeight` やノイズ除去は Task 1 で純関数として入れられるなら入れるが、複雑化する場合は後続タスクへ回してよい
- MVP の発光減衰は UV ベースの縦方向係数で十分とし、厳密な導光解析はスコープ外とする
- 画像処理ロジックは可能な限り純関数化し、UI と Three.js 依存を分離する
