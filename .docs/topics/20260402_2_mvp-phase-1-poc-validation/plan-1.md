# Phase 1 PoC Implementation Plan

## 概要
Phase 1 では、LEDアクリルスタンド見え方シミュレーターの PoC を作成し、MVP に必要な 3D 表現、発光表現、カメラ操作、画像書き出しの成立性を確認する。対象は本番品質の作り込みではなく、Phase 2 の設計判断に必要な技術検証と制約整理である。

## 前提条件
- 要件の基準は `specs/product/milestones.md` と `specs/product/prd.md` を参照する
- この Phase では PoC を優先し、注文導線や管理機能は扱わない
- 実装対象はデスクトップブラウザ優先とし、対応ブラウザは Chrome / Edge / Safari の最新版を前提にする
- まだ実装コードは存在しないため、ディレクトリ構成も本計画に含めて定義する

**特記事項**
- mainブランチには直接コミットしないこと
- サブタスクを基準に適宜コミットを行うこと
- 実装完了後にコードレビューを実行すること
- 全ての作業が完了した後、PRを作成する

## タスク一覧

- 各Taskの中に `サブタスク` セクションを必ず含める
- サブタスクは「具体的な実装内容」または「実施手順」を明示する（コミット単位）

### Task 1: PoC 基盤セットアップ

**目的:** Next.js + React Three Fiber を前提に、PoC を開始できる最小構成とテスト基盤を用意する。

**変更ファイル:**
- `package.json`
- `next.config.js`
- `tsconfig.json`
- `app/page.tsx`
- `app/layout.tsx`
- `components/simulator/SimulatorCanvas.tsx`
- `tests/app/page.test.tsx`
- `tests/components/simulator/SimulatorCanvas.test.tsx`

**サブタスク:**
1. [ ] 初期画面と Canvas マウント条件に対するテストを作成する
2. [ ] コミット: `test: add phase1 poc app shell coverage`
3. [ ] Next.js アプリ、R3F、基本レイアウト、Canvas の最小構成を追加する
4. [ ] コミット: `feat: scaffold phase1 poc app shell`
5. [ ] テスト実行コマンドと開発用 README メモを整備する
6. [ ] コミット: `chore: document phase1 poc setup`
7. [ ] テストを実行して結果を確認する

---

### Task 2: 透過 PNG とアクリル板表現の PoC

**目的:** 透過 PNG を取り込み、アクリル板風の 3D 表示として成立するかを確認する。

**変更ファイル:**
- `components/upload/ImageUploader.tsx`
- `components/simulator/AcrylicStandMesh.tsx`
- `lib/image/loadPngTexture.ts`
- `lib/simulator/acrylicMaterial.ts`
- `tests/components/upload/ImageUploader.test.tsx`
- `tests/components/simulator/AcrylicStandMesh.test.tsx`
- `tests/lib/image/loadPngTexture.test.ts`

**サブタスク:**
1. [ ] PNG 読み込みと透過反映の要件に対するテストを作成する
2. [ ] コミット: `test: cover png upload and acrylic mesh inputs`
3. [ ] アップロード UI、PNG ローダー、アクリル板メッシュの簡易実装を追加する
4. [ ] コミット: `feat: add png upload and acrylic panel prototype`
5. [ ] サンプル画像で表示確認し、制約事項を技術メモへ記録する
6. [ ] コミット: `docs: record acrylic panel poc findings`
7. [ ] テストを実行して結果を確認する

---

### Task 3: 発光表現とカメラ操作の PoC

**目的:** LED 色変更、簡易 bloom、カメラ操作を加え、見た目が MVP に十分かを判断できる状態を作る。

**変更ファイル:**
- `components/controls/LightingControls.tsx`
- `components/simulator/LedBaseMesh.tsx`
- `components/simulator/SceneLighting.tsx`
- `components/simulator/CameraController.tsx`
- `lib/simulator/lightingPresets.ts`
- `tests/components/controls/LightingControls.test.tsx`
- `tests/components/simulator/CameraController.test.tsx`

**サブタスク:**
1. [ ] LED 色変更とカメラ操作の UI / 状態変更テストを作成する
2. [ ] コミット: `test: add lighting and camera poc coverage`
3. [ ] LED ベース、発光色切替、簡易 bloom 相当、カメラ操作を実装する
4. [ ] コミット: `feat: prototype led glow and camera controls`
5. [ ] 見た目評価用のプリセットを追加し、十分それっぽい基準をメモ化する
6. [ ] コミット: `docs: define visual acceptance notes for poc`
7. [ ] テストを実行して結果を確認する

---

### Task 4: 画像書き出し検証と PoC 評価まとめ

**目的:** 現在表示の画像出力方式を確認し、性能・実装難易度・継続可否を判断できる成果物を揃える。

**変更ファイル:**
- `components/actions/ExportPreviewButton.tsx`
- `lib/export/exportCanvasImage.ts`
- `tests/lib/export/exportCanvasImage.test.ts`
- `.docs/topics/20260402_2_mvp-phase-1-poc-validation/report-2.md`

**サブタスク:**
1. [ ] 画像書き出し処理の入出力と失敗系テストを作成する
2. [ ] コミット: `test: cover preview export behavior`
3. [ ] Canvas 画像出力処理と操作ボタンを PoC として実装する
4. [ ] コミット: `feat: add preview export verification`
5. [ ] パフォーマンス、実装難易度、残課題、Go / No-Go 判断をレポートにまとめる
6. [ ] コミット: `docs: summarize phase1 poc evaluation`
7. [ ] テストを実行して結果を確認する

## 依存関係
- Task 2 は Task 1 の完了後に着手する
- Task 3 は Task 1 の完了後に着手し、Task 2 のアクリル板実装を前提に統合する
- Task 4 は Task 2 と Task 3 の完了後に着手する

## 備考
- PoC の評価基準は「物理的に正確か」ではなく「MVP の意思決定支援に十分な見え方か」で判断する
- 見た目改善案のうち Phase 1 で入れないものは、Phase 2 の設計インプットとして別途整理する
- 実装で重すぎる表現やブラウザ差異の大きい表現は採用候補から外す
