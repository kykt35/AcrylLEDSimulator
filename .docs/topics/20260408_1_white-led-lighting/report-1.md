# White LED Lighting Preset Report

- Report Type: investigation
- Topic: white-led-lighting
- Source Documents: `lib/simulator/lightingPresets.ts`, `components/controls/LightingControls.tsx`, `components/screens/SimulatorScreen.tsx`, `components/simulator/SceneLighting.tsx`, `components/simulator/LedBaseMesh.tsx`, `components/simulator/EngravingGlowMaterial.tsx`, `tests/components/controls/LightingControls.test.tsx`, `tests/components/screens/SimulatorScreen.test.tsx`
- Created: 2026-04-08

## Summary

ライトに白系を追加するだけなら、現状の設計では `lightingPresets` に白系プリセットを追加するのが最短である。現在のライト設定は `lib/simulator/lightingPresets.ts` のプリセット配列を起点に、UI 表示、状態保持、3D シーン描画まで一貫して参照しているため、データ追加だけで基本フローは成立する。

ただし、白系は既存の青系やピンク系よりも「背景や板材の白飛び」「発光感の弱さ」「寒色寄りか暖色寄りかの見え方差」が目立ちやすい。したがって、実装は 2 段階に分けるのが妥当である。

- Phase 1: 白系プリセットを 1 から 3 種追加する
- Phase 2: 必要に応じて白系専用の見え方補正を入れる

## Current State

### 設定の流れ

- `lib/simulator/lightingPresets.ts`
  - `id`, `label`, `glowColor` を持つプリセット配列を定義している
- `components/controls/LightingControls.tsx`
  - `lightingPresets` をそのまま列挙してボタン表示している
- `components/screens/SimulatorScreen.tsx`
  - `ledColorId` を state で保持し、`getLightingPreset` で現在プリセットを引いている
- `components/simulator/SceneLighting.tsx`
  - 補助 directional light の色に `glowColor` を使っている
- `components/simulator/LedBaseMesh.tsx`
  - 台座 LED バーの `color` と `emissive` に `glowColor` を使っている
- `components/simulator/EngravingGlowMaterial.tsx`
  - 彫刻面グロウの色に `glowColor` を使っている

### この構成から分かること

- 白系追加は state や props の型変更なしで実装できる
- UI 側はプリセット配列の増減に追従するため、新しいボタン追加も自動で反映される
- 保存復元は `ledColorId` を保持しているため、新しい `id` を使っても既存の仕組みで扱える

## Recommended Approach

### Phase 1: 最小実装

最小実装では `lib/simulator/lightingPresets.ts` に白系プリセットを追加する。

候補:

- Pure White: `#f5f7ff`
- Warm White: `#ffe6b7`
- Cool White: `#dff4ff`

推奨は、最初から 1 色だけに絞らず、少なくとも `Warm White` と `Cool White` の 2 種を入れることである。白系はユーザーの期待値が広く、「白」と言っても実際には暖色寄りと寒色寄りでかなり印象が変わるためである。

実装差分は以下で足りる。

1. `lib/simulator/lightingPresets.ts` に白系プリセットを追加する
2. 必要なら表示順を調整する
3. `tests/components/controls/LightingControls.test.tsx` に白系ボタンの操作ケースを追加する
4. `tests/components/screens/SimulatorScreen.test.tsx` に新規プリセット選択時の表示確認を追加する

### Phase 2: 白系の見え方補正

白系を追加すると、現状の単一 `glowColor` モデルでは次の問題が出る可能性がある。

- `SceneLighting` の白色 directional light と干渉し、色差が見えにくい
- `LedBaseMesh` の LED バーが背景に埋もれやすい
- `EngravingGlowMaterial` の additive blending でハイライトが飽和しやすい

この場合は、次の順で補正を検討するのがよい。

1. 白系プリセットだけ `brightness` 初期値を下げるのではなく、全体の明るさレンジを維持したまま `glowColor` をやや有色に寄せる
2. `lightingPresets` に `accentColor` または `baseLightColor` を追加し、発光面と補助光の色を分ける
3. 必要なら `EngravingGlowMaterial` 側で白系の最大発光を少し抑える係数を設ける

MVP としては、まず 2 色程度の白系を「少し色味のある白」で追加し、それで十分かを確認する方がよい。いきなりプリセット構造を拡張する必要はない。

## Implementation Details

### 1. プリセット追加

対象:

- `lib/simulator/lightingPresets.ts`

想定変更:

- `lightingPresets` 配列に白系エントリを追加する
- 既存の `LightingPreset` 型は `glowColor` のみなので、そのまま流用できる

例:

```ts
{
  id: "warm-white",
  label: "Warm White",
  glowColor: "#ffe6b7"
},
{
  id: "cool-white",
  label: "Cool White",
  glowColor: "#dff4ff"
}
```

### 2. UI 確認ポイント

対象:

- `components/controls/LightingControls.tsx`

確認ポイント:

- ボタン数が増えても `choice-row` の折り返しや可読性が崩れないか
- 現在値表示に `Warm White` などが正しく出るか
- `aria-pressed` とクリックイベントが既存のまま成立するか

現状の作りではコンポーネント改修は不要な可能性が高い。

### 3. 描画確認ポイント

対象:

- `components/simulator/SceneLighting.tsx`
- `components/simulator/LedBaseMesh.tsx`
- `components/simulator/EngravingGlowMaterial.tsx`

確認ポイント:

- 夜背景と明背景の両方で白系が視認できるか
- 彫刻グロウが単なる灰色に見えないか
- LED バーだけ不自然に強く光りすぎないか
- 加算発光で輪郭が飛びすぎないか

## Risks

### 1. 白が「無色」に見える

`glowColor` がほぼ純白だと、背景光や板の反射と差が出にくく、ユーザーには「ライトを変えても変化が小さい」と見える可能性がある。

対応:

- 完全な `#ffffff` は避ける
- 軽く暖色または寒色に振った白を使う

### 2. 白飛びで彫刻ディテールが潰れる

`EngravingGlowMaterial` は `AdditiveBlending` を使っているため、白系は色付きプリセットより飽和しやすい。

対応:

- 白系は少し彩度を残す
- 必要なら明るさスライダー上限やシェーダ係数を見直す

### 3. 台座光とシーン光の役割が混ざる

現在は同じ `glowColor` を台座発光、彫刻グロウ、補助 light に共用しているため、白系で調整したい箇所が増えると一括制御では足りなくなる。

対応:

- 将来的には `LightingPreset` を以下のように拡張できる

```ts
type LightingPreset = {
  id: string;
  label: string;
  glowColor: string;
  accentLightColor?: string;
  ledBarColor?: string;
};
```

ただし、これは白系の初回追加時点では過剰になりやすい。

## Test Plan

最低限必要な確認は以下である。

1. `tests/components/controls/LightingControls.test.tsx`
   白系ボタン押下で `onPresetChange` が新しい `id` を返すこと
2. `tests/components/screens/SimulatorScreen.test.tsx`
   ライトタブで白系ラベルが表示されること
3. 手動確認
   `/simulator` 上で `night` 背景と明るい背景の両方を見比べ、視認性を確認すること

もし白系専用補正まで入れるなら、`components/simulator/SimulatorCanvas.tsx` をモックして props 伝播も確認するとよい。

## Conclusion

実現方法として最も安全なのは、まず `lightingPresets` に `Warm White` と `Cool White` を追加し、既存フローで表示と保存復元がそのまま成立することを確認する進め方である。現状の構成はプリセット駆動になっているため、初回追加の実装コストは低い。

そのうえで、白系が見えづらい、または白飛びすることが確認できた場合のみ、`LightingPreset` の責務を広げて「彫刻グロウ用の色」と「補助ライト用の色」を分離する。最初から構造拡張に入るより、この段階的対応の方が現在の MVP には適している。
