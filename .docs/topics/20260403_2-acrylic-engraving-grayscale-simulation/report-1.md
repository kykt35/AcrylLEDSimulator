# Acrylic Engraving Grayscale Simulation Report

- Report Type: architecture-review
- Topic: acrylic-engraving-grayscale-simulation
- Source Documents: `docs/MVP_PRD.md`, `components/screens/SimulatorScreen.tsx`, `components/simulator/SimulatorCanvas.tsx`, `components/simulator/AcrylicStandMesh.tsx`, `lib/image/loadPngTexture.ts`, `components/controls/ImageControls.tsx`
- Created: 2026-04-03

## Summary

実際のレーザー彫刻アクリルは、板の表面または内部に微細な傷を入れることで導光中の光を散乱させ、彫刻部だけが光って見える。したがって、シミュレーションでは「元画像をそのまま発光させる」のではなく、「どこにどれだけ散乱を起こすか」を表す彫刻マップを作り、そのマップに応じて板内部の光を漏らす表現へ変換する必要がある。

この要件に対しては、入力画像から彫刻用グレースケール画像を生成し、そのグレースケール値を「彫刻密度」または「散乱強度」として扱う構成が最も実装しやすい。黒に近いほど未彫刻、白に近いほど強く彫刻された領域とみなし、LED の色と強度を掛け合わせて発光感を描画する。

現状の実装は透過 PNG をそのまま `meshStandardMaterial.map` に貼り付けているだけで、彫刻深さ・導光距離・散乱強度の概念がない。そのため、次の 2 段構成へ拡張するのが妥当である。

- 前処理: 入力画像から彫刻用グレースケール画像を生成する
- 描画処理: グレースケール画像を散乱マップとして使い、LED 導光で彫刻部が光る見え方を近似する

## Current State

### 実装上の現状

- [`components/controls/ImageControls.tsx`](/Users/kiyotada/AcrylLedSimulator/components/controls/ImageControls.tsx) と [`components/upload/ImageUploader.tsx`](/Users/kiyotada/AcrylLedSimulator/components/upload/ImageUploader.tsx) は PNG 入力のみを扱う
- [`lib/image/loadPngTexture.ts`](/Users/kiyotada/AcrylLedSimulator/lib/image/loadPngTexture.ts) は PNG を Data URL として読むだけで、画像加工は行っていない
- [`components/simulator/AcrylicStandMesh.tsx`](/Users/kiyotada/AcrylLedSimulator/components/simulator/AcrylicStandMesh.tsx) はアップロード画像を `boxGeometry` の `map` に貼り付け、板全体に一様な `emissive` を与えている
- [`components/simulator/SimulatorCanvas.tsx`](/Users/kiyotada/AcrylLedSimulator/components/simulator/SimulatorCanvas.tsx) には「彫刻面だけが光る」ための専用パスがない

### 問題点

- 元画像の明度がそのまま彫刻密度へ変換されていない
- 透明部分と未彫刻部分の意味が分離されていない
- 板の下から入る導光が、彫刻位置に応じて減衰・散乱する表現になっていない
- レーザー彫刻で使うグレースケール画像と、画面表示用画像の責務が分かれていない

## Physical Interpretation

見え方を整理すると、シミュレーションで再現すべき現象は次の通りである。

1. LED の光がアクリル板の端面から内部に入る
2. 未彫刻部では光は比較的閉じ込められ、強くは見えない
3. 彫刻部では表面粗さや微細な傷により光が外へ散乱する
4. 彫刻が強い場所ほど明るく見えやすい
5. LED から遠い場所は、同じ彫刻量でもやや暗く見えやすい

このため、厳密な光線追跡は不要でも、最低限次の 3 要素を近似する必要がある。

- `engravingStrength`: 画素ごとの彫刻量
- `edgeLighting`: LED 端面からの入光量
- `scattering`: 彫刻量に応じた発光の漏れ量

## Requirement Interpretation

「入力画像から彫刻用のグレースケール画像にし、シミュレーションのようにしたい」を実装要件へ落とすと、意味は以下になる。

- 入力画像を単なる表示画像として扱うのをやめ、彫刻データ生成の素材として扱う
- 出力するグレースケール画像は、レーザー彫刻機へ渡す元データとしても解釈できるようにする
- シミュレーターは、そのグレースケール画像を元に「彫刻されるほど光る」見え方を近似する
- 必要に応じて、彫刻用画像とシミュレーション用画像を別解像度・別補正で持てるようにする

## Recommended Approach

### 結論

推奨構成は「CPU 前処理 + GPU 表示」の 2 段構成である。

- CPU 側で入力画像を解析し、彫刻用グレースケール画像を生成する
- GPU 側でその画像を `engraving map` として使い、LED 色・輝度・距離減衰を掛けて表示する

この構成にすると、加工ロジックと見え方ロジックの責務を分離できる。将来、実機に合わせて補正パラメータを増やす場合も、前処理と表示処理を個別に改善しやすい。

### 推奨理由

- 彫刻用画像をそのまま保存・書き出ししやすい
- シミュレーションの明るさ調整を UI から独立して制御できる
- 元画像の種類が写真でも線画でも、同じ前処理パイプラインに載せやすい
- 現在の Next.js + React Three Fiber 構成に追加しやすい

## Image Processing Pipeline

### 1. 入力画像の正規化

最初に入力画像を `CanvasRenderingContext2D` へ描き、RGBA ピクセルを取得する。ここで以下を揃える。

- 解像度をシミュレーション用に縮小または固定化する
- 透明部分は「彫刻なし」として黒へ寄せる
- カラーチャンネルは輝度へ変換する

基本的な輝度変換式は以下でよい。

```ts
const luma = 0.299 * r + 0.587 * g + 0.114 * b;
const alphaNormalized = a / 255;
const base = luma * alphaNormalized;
```

ポイントは、透明 PNG のアルファを無視しないことである。透明背景のイラストでは、アルファを掛けないと背景が誤って彫刻領域に変換される。

### 2. 階調の補正

元画像をそのままグレースケール化すると、中間調が多すぎて全体がぼんやり光りやすい。したがって、彫刻用には補正パラメータを持たせるべきである。

- `invert`: 白黒反転
- `gamma`: 中間調の強調または抑制
- `contrast`: コントラスト調整
- `threshold`: 2 値化に近づける下限

例:

```ts
const normalized = base / 255;
const contrasted = clamp((normalized - 0.5) * contrast + 0.5, 0, 1);
const gammaCorrected = Math.pow(contrasted, gamma);
const thresholded = gammaCorrected < threshold ? 0 : gammaCorrected;
const engravingStrength = invert ? 1 - thresholded : thresholded;
```

実務上は、写真よりも線画・ロゴ向けに `threshold` と `contrast` を強めに持つ方が、彫刻らしい見え方になりやすい。

### 3. エッジ強調の追加

実機では、面全体ベタ彫刻よりも輪郭やハッチングの方が光って見えやすいことが多い。そのため、MVP でも簡易エッジ抽出を追加する価値が高い。

方法:

- Sobel などで輪郭成分を求める
- 元のグレースケールと混合する
- `edgeWeight` で寄与率を制御する

例:

```ts
engravingMap = clamp(
  baseGrayscale * fillWeight + edgeMagnitude * edgeWeight,
  0,
  1
);
```

これにより、人物写真やカラーイラストでも「光って見せたい線」を強調しやすくなる。

### 4. ノイズ除去とブラー

細かなノイズは実機では不要な微細彫刻になりやすく、シミュレーションでも汚く見える。したがって、軽い平滑化を入れる。

- 小さなガウシアンブラーでザラつきを抑える
- 必要なら最小面積以下の孤立点を除去する

### 5. 彫刻用グレースケール画像の生成

最終的な `engravingStrength` を 0..255 に戻し、1 チャンネル相当の PNG として保存できるようにする。保存時の意味は以下で統一する。

- `0` = 未彫刻
- `255` = 最も強い彫刻

この定義を UI と出力ファイルで一致させるべきである。

## Rendering Model

### 1. 必要なテクスチャ

シミュレーション用には少なくとも次のテクスチャを持つ。

- `engravingMap`: 彫刻強度マップ
- `maskMap`: 板形状の有効領域

必要なら将来的に以下を追加できる。

- `normalLikeMap`: 擬似凹凸用
- `thicknessMap`: 板厚差分用

### 2. 明るさの近似式

MVP では次のような近似で十分である。

```ts
finalGlow =
  ledIntensity *
  ledColor *
  engravingStrength *
  edgeLighting *
  distanceFalloff;
```

各要素の意味:

- `engravingStrength`: グレースケール値
- `edgeLighting`: 板下端または LED 差し込み位置に近いほど強い係数
- `distanceFalloff`: 板内部を進むほど減衰する係数

例えば UV の `v` 座標を使って、下から上へ減衰するだけでも、かなりそれらしく見える。

```glsl
float edgeLighting = smoothstep(0.0, 0.35, 1.0 - vUv.y);
float distanceFalloff = mix(1.0, 0.55, vUv.y);
float glow = engraving * edgeLighting * distanceFalloff * brightness;
```

現状の `meshStandardMaterial` ではこの制御が弱いため、`shaderMaterial` または `onBeforeCompile` でカスタムシェーダへ移行するのがよい。

### 3. 発光と板材の分離

板そのものの透明感と、彫刻部の発光感は別レイヤとして扱うべきである。

- ベースレイヤ: 透明アクリルの板材
- グロウレイヤ: 彫刻マップに応じた加算発光

実装としては以下のどちらかが扱いやすい。

- 1 枚のメッシュでカスタムフラグメントシェーダを書く
- 同形状メッシュを 2 枚重ね、上層で発光専用マテリアルを使う

MVP では後者の方が実装難度が低い。

## Proposed Repo Design

### 追加するとよい責務

- `lib/image/generateEngravingMap.ts`
  - PNG を読み込み、彫刻用グレースケール画像を生成する
- `lib/image/engravingFilters.ts`
  - gamma, threshold, edge 強調などの純関数を置く
- `lib/export/exportEngravingImage.ts`
  - 彫刻用 PNG のダウンロードを行う
- `components/controls/EngravingControls.tsx`
  - threshold, contrast, gamma, invert, edgeWeight を操作する
- `components/simulator/EngravingGlowMaterial.tsx`
  - 彫刻マップを使った発光表現を担当する

### 既存コードへの接続点

- [`lib/image/loadPngTexture.ts`](/Users/kiyotada/AcrylLedSimulator/lib/image/loadPngTexture.ts)
  - 現在は Data URL を返すだけなので、ここから `ImageBitmap` または `HTMLImageElement` を元に前処理関数を呼ぶ
- [`components/screens/SimulatorScreen.tsx`](/Users/kiyotada/AcrylLedSimulator/components/screens/SimulatorScreen.tsx)
  - `sourceImage` とは別に `engravingMap` と加工パラメータ state を持つ
- [`components/simulator/AcrylicStandMesh.tsx`](/Users/kiyotada/AcrylLedSimulator/components/simulator/AcrylicStandMesh.tsx)
  - 単純な `map` 表示から、板材レイヤ + 発光レイヤ構成へ変更する
- [`components/controls/ImageControls.tsx`](/Users/kiyotada/AcrylLedSimulator/components/controls/ImageControls.tsx)
  - 「透過 PNG 推奨」に加えて「彫刻用に白が強く光る」などのガイドを追加する

## MVP Implementation Plan

### Phase 1: 彫刻用グレースケールを作る

最初に入れるべき最小機能は次の通りである。

1. PNG を読み込む
2. アルファ込みでグレースケール化する
3. `contrast`, `gamma`, `threshold`, `invert` を調整できる
4. 生成したグレースケール画像を 2D プレビュー表示する
5. その画像を PNG としてダウンロードできる

この段階で、「彫刻データとして何が出るか」をまず確定させるべきである。

### Phase 2: シミュレーターへ接続する

次に、生成済みの `engravingMap` を Three.js 側へ渡し、以下を追加する。

1. 彫刻部だけが発光する
2. 板下部ほど明るく、上部ほど少し減衰する
3. LED 色変更が発光色へ反映される
4. 明るさ調整がグロウ強度へ反映される

### Phase 3: 実機寄せの補正を追加する

その後、必要なら以下を追加する。

- 輪郭強調
- 疑似ブラーによる散乱のにじみ
- 板厚差分
- 側面や接地部の発光強調
- 白版あり / なし相当の見え方切り替え

## UI Recommendations

ユーザーが迷わないよう、UI は「元画像」と「彫刻データ」を分けて見せるべきである。

- 元画像プレビュー
- 彫刻用グレースケールプレビュー
- LED 導光シミュレーションプレビュー

また、調整項目は以下から始めるのが妥当である。

- `コントラスト`
- `しきい値`
- `中間調`
- `白黒反転`
- `輪郭強調`

これにより、ユーザーは「何を彫刻データとして出すか」と「完成イメージがどう変わるか」を切り分けて確認できる。

## Risks And Controls

- 写真素材をそのまま使うと中間調が多く、全面が曇って光る見え方になりやすい
- 対応: `threshold` と `edgeWeight` を初期値でやや強めにする

- 実機の光り方は板厚、彫刻面、素材品質に左右されるため、完全一致は難しい
- 対応: PRD 通り「意思決定支援の見え方シミュレーター」として位置付ける

- `meshStandardMaterial` では彫刻部のみの発光制御が弱い
- 対応: 発光専用マテリアルを分離する

- グレースケール出力とシミュレーション表示で白黒の意味がずれると、ユーザーが混乱する
- 対応: `0 = 未彫刻 / 255 = 強彫刻` を全 UI で固定する

## Test Plan

追加・更新観点は以下で十分である。

- `generateEngravingMap` がアルファ込みでグレースケール化できる
- `invert`, `gamma`, `contrast`, `threshold` の各補正が期待通り反映される
- エッジ強調あり / なしで出力差分が出る
- シミュレーションで未彫刻部は強く光らず、彫刻部のみが強く光る
- LED 色変更時に彫刻部の発光色が変わる
- 生成した彫刻用 PNG をダウンロードできる

## Recommended Next Steps

1. `generateEngravingMap` を純関数として実装し、Vitest で画像処理ロジックを固める
2. 生成したグレースケール画像を 2D プレビューする UI を追加する
3. `AcrylicStandMesh` を板材レイヤとグロウレイヤに分離する
4. MVP では UV ベースの下方向減衰だけ先に入れ、実機との差分を見ながら補正を追加する

## Conclusion

実現の要点は、入力画像を「表示テクスチャ」ではなく「彫刻強度マップ」へ変換することにある。前処理で彫刻用グレースケール画像を生成し、その値を散乱強度として LED 導光シミュレーションへ使えば、実機に近い「彫刻した部分だけが光る」見え方へ大きく近づけられる。

このリポジトリでは、まず CPU 側で彫刻マップ生成を実装し、その次に Three.js 側で発光レイヤを追加する順序が最も安全である。最初から厳密な光学再現を狙う必要はなく、グレースケール生成の品質と彫刻部限定の発光制御を揃えるだけで、ユーザー価値は十分に上がる。
