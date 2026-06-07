# 彫刻用グレースケール仕様

## 目的

入力PNGから、レーザー彫刻や導光表現に使うグレースケール画像を生成する。生成結果は3Dの彫刻モード表示と彫刻用PNGダウンロードに使う。

## 利用者

- 元画像から彫刻用画像を確認したいユーザー
- 白または黒のどちらを導光対象にするか調整したいユーザー
- 彫刻用PNGを書き出したい制作担当者

## 入口

| 種別 | 入口 | 内容 |
|---|---|---|
| UI | `components/controls/EngravingControls.tsx` | 彫刻モード、導光階調、各調整値、比較プレビュー、彫刻PNGダウンロードを提供する |
| Screen | `components/screens/SimulatorScreen.tsx` | 元画像と調整値の変更に応じて彫刻画像を再生成する |
| Lib | `lib/image/generateEngravingMap.ts` | Data URLまたはImageDataから彫刻用画像を生成する |
| Lib | `lib/image/engravingFilters.ts` | 輝度、輪郭、線幅補正、コントラスト、ガンマ、しきい値、階調化の処理を行う |
| 3D | `components/simulator/EngravingGlowMaterial.tsx` | 彫刻画像を発光プレーンとして描画する |

## 実装から分かる仕様

### 生成ロジック

- 元画像をcanvasへ描画し、ImageDataを取得する。
- 各ピクセルの輝度は `0.299 * r + 0.587 * g + 0.114 * b` で計算する。
- 輝度にはalpha値を掛ける。
- `invert=true` の場合、輝度を `1 - source` として扱う。
- コントラストは `(value - 0.5) * contrast + 0.5` で調整する。
- ガンマは `Math.pow(value, gamma)` で調整する。
- ガンマ補正後の値がthreshold未満の場合は0にする。
- `edgeWeight > 0` の場合、Sobel風の3x3カーネルで輪郭マップを作り、強度に加算する。
- `edgeWidth` は輪郭マップの線幅補正レベルを表し、`1` の場合は補正なし、`2` 以上の場合は近傍の最大輪郭値で輪郭マップを広げる。
- 最終値は0から1へ丸め、2から8へ正規化したtoneLevelsに応じて量子化する。
- プレビュー画像は各強度をRGB同値、alpha 255のグレースケール画像にする。
- `averageStrength` は強度平均として保持する。

根拠:

- `lib/image/generateEngravingMap.ts`
- `lib/image/engravingFilters.ts`

### 初期値と調整範囲

| 項目 | 初期値 | UI範囲 |
|---|---:|---|
| contrast | 1.35 | 0.5 - 2.5 |
| gamma | 0.9 | 0.4 - 1.8 |
| threshold | 0.18 | 0 - 1 |
| invert | false | 白を導光 / 黒を導光 |
| edgeWeight | 0.2 | 0 - 2 |
| edgeWidth | 1 | 1 - 5 |
| toneLevels | 2 | 2 - 8 |

根拠:

- `lib/image/engravingFilters.ts`
- `components/controls/EngravingControls.tsx`

### 彫刻モード表示

- 彫刻モードが無効の場合、アクリル板には元画像テクスチャを表示する。
- 彫刻モードが有効の場合、元画像テクスチャを外し、アクリル板前面に彫刻用発光プレーンを表示する。
- 彫刻発光は彫刻画像の赤チャンネルを強度として使う。
- 発光強度はLED色、明るさ、高さ方向の減衰に影響される。
- 強度が0.001以下のピクセルはdiscardする。

根拠:

- `components/simulator/AcrylicStandMesh.tsx`
- `components/simulator/EngravingGlowMaterial.tsx`

### 比較プレビューとダウンロード

- コントロール内に元画像と彫刻用画像を並べて表示する。
- 彫刻用PNGのダウンロードでは、白黒反転オプションを選べる。
- 反転しない場合、生成済みPNG Data URLをBlobへ変換してダウンロードする。
- 反転する場合、canvas上でRGBを反転してPNG Blobを生成する。
- ファイル名は元ファイル名の拡張子を取り除き、`-engraving.png` を付ける。

根拠:

- `components/controls/EngravingControls.tsx`
- `components/screens/SimulatorScreen.tsx`
- `lib/export/exportEngravingImage.ts`
- `lib/download/downloadBlob.ts`

## エラー・例外

| 条件 | 応答/挙動 |
|---|---|
| 元画像の読み込み失敗 | `画像の読み込みに失敗しました。` |
| 画像処理canvas初期化失敗 | `画像処理用の canvas を初期化できません。` |
| preview canvas初期化失敗 | `彫刻用 preview の canvas を初期化できません。` |
| 彫刻用Data URL形式不正 | `彫刻用画像の形式が不正です。` |
| 反転用canvas初期化失敗 | `彫刻用画像の反転に必要な canvas を初期化できません。` |
| 反転Blob生成失敗 | `反転した彫刻用画像の生成に失敗しました。` |

## 関連実装

- `components/screens/SimulatorScreen.tsx`
- `components/controls/EngravingControls.tsx`
- `components/simulator/AcrylicStandMesh.tsx`
- `components/simulator/EngravingGlowMaterial.tsx`
- `lib/image/generateEngravingMap.ts`
- `lib/image/engravingFilters.ts`
- `lib/export/exportEngravingImage.ts`

## 関連テスト

- `tests/components/controls/EngravingControls.test.tsx`
- `tests/components/screens/SimulatorScreen.test.tsx`
- `tests/components/simulator/AcrylicStandMesh.test.tsx`
- `tests/lib/image/generateEngravingMap.test.ts`
- `tests/lib/export/exportEngravingImage.test.ts`

## 未確認・推定

- 実際のレーザー彫刻出力に対するcontrast/gamma/thresholdの推奨値は未確認。
- 生成PNGのDPIや実寸変換ルールは未定義。
- 白黒反転をプレビュー表示にも反映すべきかは、現行ではダウンロード確認用の見た目だけに留まっている。
