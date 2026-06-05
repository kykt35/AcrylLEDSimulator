# LED発光設定仕様

## 目的

LED色、明るさ、高さ方向の減衰を調整し、アクリル板と彫刻用画像の発光表現を比較できるようにする。

## 利用者

- LED色の候補を比較したいユーザー
- 明るさや導光の上方向への届き方を調整したい制作担当者

## 入口

| 種別 | 入口 | 内容 |
|---|---|---|
| UI | `components/controls/LightingControls.tsx` | LED色プリセット、明るさ、高さ方向の減衰を変更する |
| Screen | `components/screens/SimulatorScreen.tsx` | 発光状態を保持し、3Dプレビューへ渡す |
| Preset | `lib/simulator/lightingPresets.ts` | LED色プリセットを定義する |
| 3D | `components/simulator/SceneLighting.tsx` | シーンライトと背景色を適用する |
| 3D | `components/simulator/LedBaseMesh.tsx` | LED台座とpoint lightを表示する |
| 3D | `components/simulator/EngravingGlowMaterial.tsx` | 彫刻モードの発光強度を計算する |

## 実装から分かる仕様

### LED色プリセット

- LED色はプリセットから選ぶ。
- 初期値は `lightingPresets[0]` の `ice-blue`。
- 未知のプリセットIDを指定した場合は先頭プリセットにフォールバックする。

| ID | ラベル | 色 |
|---|---|---|
| `ice-blue` | Ice Blue | `#7fe7ff` |
| `sunset-pink` | Sunset Pink | `#ff8ac2` |
| `lime` | Lime | `#c6ff76` |
| `warm-white` | Warm White | `#ffe6b7` |
| `cool-white` | Cool White | `#dff4ff` |

根拠:

- `lib/simulator/lightingPresets.ts`
- `components/screens/SimulatorScreen.tsx`

### 明るさ

- 初期値は1.2。
- UIでは0.6から2.4まで、0.1刻みで変更できる。
- LED台座のpoint light intensityは `brightness * 18`。
- LEDバーのemissive intensityは `brightness * 1.4`。
- アクリル板のemissive intensityは素材プリセット値にbrightnessを掛ける。
- 彫刻モードの発光強度にもbrightnessを掛ける。

根拠:

- `components/controls/LightingControls.tsx`
- `components/screens/SimulatorScreen.tsx`
- `components/simulator/LedBaseMesh.tsx`
- `components/simulator/AcrylicStandMesh.tsx`
- `components/simulator/EngravingGlowMaterial.tsx`

### 高さ方向の減衰

- 初期値は0.3。
- UIでは0から0.8まで、0.05刻みで変更できる。
- 彫刻モードの発光プレーンで、UVのY座標に応じた上方向への減衰として使う。
- `heightAttenuation` が大きいほど、上部と距離方向の発光が弱くなる。

根拠:

- `components/controls/LightingControls.tsx`
- `components/screens/SimulatorScreen.tsx`
- `components/simulator/EngravingGlowMaterial.tsx`

## エラー・例外

| 条件 | 応答/挙動 |
|---|---|
| 未知のLEDプリセットID | 先頭プリセットへフォールバックする |
| UI範囲外のbrightness | UI上は入力できない。状態値の追加検証はない |
| UI範囲外のheightAttenuation | UI上は入力できない。状態値の追加検証はない |

## 関連実装

- `components/controls/LightingControls.tsx`
- `components/screens/SimulatorScreen.tsx`
- `components/simulator/SceneLighting.tsx`
- `components/simulator/LedBaseMesh.tsx`
- `components/simulator/AcrylicStandMesh.tsx`
- `components/simulator/EngravingGlowMaterial.tsx`
- `lib/simulator/lightingPresets.ts`

## 関連テスト

- `tests/components/controls/LightingControls.test.tsx`
- `tests/components/screens/SimulatorScreen.test.tsx`
- `tests/components/simulator/AcrylicStandMesh.test.tsx`
- `tests/components/simulator/SimulatorCanvas.test.tsx`

## 未確認・推定

- LED色プリセットが実際のLED製品色に対応しているかは未確認。
- 明るさと減衰の値は視覚調整用で、物理単位との対応は未定義。
- brightnessやheightAttenuationをURLや保存データ以外で外部入力する仕様はない。
