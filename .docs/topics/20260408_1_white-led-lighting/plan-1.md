# white-led-lighting

## 概要
シミュレーターのライト設定に白系プリセットを追加し、既存のプリセット駆動フローを崩さずに UI、状態保持、3D 表示へ反映する。初回実装は `lightingPresets` への追加を中心に進め、必要最小限のテスト更新と手動確認観点の整理までを 1 つの作業計画にまとめる。

## 前提条件
- 現状のライト設定は `lib/simulator/lightingPresets.ts` を単一の定義元として参照している
- `components/controls/LightingControls.tsx` はプリセット配列をそのままボタン描画している
- `components/screens/SimulatorScreen.tsx` は `ledColorId` を保存し、`getLightingPreset` で表示用データを取得している
- 3D 側は `SceneLighting`、`LedBaseMesh`、`EngravingGlowMaterial` が同じ `glowColor` を共有している
- 初回スコープではプリセット構造拡張は行わず、少し色味のある白を追加することで視認性を確保する
- テストは既存の Vitest / Testing Library 構成に合わせて更新する

**特記事項**
- mainブランチには直接コミットしないこと
- サブタスクを基準に適宜コミットを行うこと
- 実装完了後にコードレビューを実行すること
- 全ての作業が完了した後、PRを作成する

## タスク一覧

### Task 1: 白系ライトプリセットを追加する

**目的:** 既存のプリセット駆動構成を維持したまま、白系ライトを UI とシミュレーターで選択可能にする

**変更ファイル:**
- `lib/simulator/lightingPresets.ts`
- `components/controls/LightingControls.tsx`
- `components/screens/SimulatorScreen.tsx`
- 必要に応じて文言確認対象の関連ファイル

**サブタスク:**
1. [ ] 白系プリセット追加後のラベル表示と選択挙動に関する画面テスト更新方針を整理する
2. [ ] コミット: `test: cover white lighting preset selection`
3. [ ] `lightingPresets` に `Warm White` と `Cool White` を追加し、表示順を決める
4. [ ] コミット: `feat: add white lighting presets`
5. [ ] `LightingControls` と `SimulatorScreen` で現在値表示や状態復元に問題がないことを確認し、必要があれば軽微な表示調整を行う
6. [ ] コミット: `feat: align white preset labels in lighting ui`
7. [ ] 関連テストを実行して結果を確認する

---

### Task 2: 白系追加に伴う描画確認と回帰確認を行う

**目的:** 白系プリセットが 3D 表示で破綻しないことを確認し、必要な確認観点をドキュメント化する

**変更ファイル:**
- `tests/components/controls/LightingControls.test.tsx`
- `tests/components/screens/SimulatorScreen.test.tsx`
- 必要に応じて `README.md` または関連 docs

**サブタスク:**
1. [ ] `LightingControls` と `SimulatorScreen` のテストを更新し、白系プリセットの選択と表示文言を検証する
2. [ ] コミット: `test: verify white lighting preset flow`
3. [ ] `night` 背景と明背景での視認性、白飛び、LED バーの見え方を手動確認し、必要なら確認観点をドキュメントへ追記する
4. [ ] コミット: `docs: record white lighting verification notes`
5. [ ] 対象テスト一式を実行して結果を確認する

## 依存関係
- Task 2 は Task 1 の実装完了後に着手する
- 白系プリセットの見え方に問題が出た場合でも、この計画では構造拡張を行わず、追加対応は次の別タスクとして切り出す

## 備考
- 白系は純白ではなく、少し暖色または寒色に寄せた値を使う
- 初回実装候補は `#ffe6b7` と `#dff4ff` を基本とする
- `LightingPreset` に `accentLightColor` などを追加する構造拡張は、白系追加後の見え方検証で必要性が確認された場合のみ別計画で扱う
