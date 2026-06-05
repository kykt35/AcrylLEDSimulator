# 表示設定仕様

## 目的

背景、カメラ、アクリル板サイズ、3D操作の表示条件を変更し、完成イメージを複数の見え方で確認できるようにする。

## 利用者

- 正面、俯瞰、接写で見え方を比較したいユーザー
- 背景色による発光の印象差を確認したいユーザー
- アクリル板サイズ別の見え方を確認したい制作担当者

## 入口

| 種別 | 入口 | 内容 |
|---|---|---|
| UI | `components/controls/DisplayControls.tsx` | 背景、カメラ、ビューリセットを変更する |
| UI | `components/controls/ImageControls.tsx` | アクリル板サイズを変更する |
| Screen | `components/screens/SimulatorScreen.tsx` | 背景、カメラ、サイズ状態を保持し、3Dプレビューへ渡す |
| Preset | `lib/simulator/displayPresets.ts` | 背景とカメラ選択肢を定義する |
| Preset | `lib/simulator/acrylicSizePresets.ts` | アクリル板サイズを定義する |
| 3D | `components/simulator/CameraController.tsx` | カメラプリセットとOrbitControlsを適用する |

## 実装から分かる仕様

### 背景プリセット

- 背景はプリセットから選ぶ。
- 初期値は `night`。
- 未知の背景IDを指定した場合は先頭プリセットにフォールバックする。

| ID | ラベル | 色 |
|---|---|---|
| `night` | Night Studio | `#07111f` |
| `rose` | Rose Glow | `#170615` |
| `forest` | Forest Green | `#081307` |

根拠:

- `lib/simulator/displayPresets.ts`
- `components/controls/DisplayControls.tsx`
- `components/screens/SimulatorScreen.tsx`

### カメラプリセット

- カメラプリセットは `front`, `tilt`, `detail`。
- 初期値は `front`。
- 表示ラベルは `正面`, `俯瞰`, `接写`。
- 未知のカメラIDの場合、3D側では `front` の位置にフォールバックする。
- カメラ設定リセットは背景を `night`、カメラを `front` に戻す。
- OrbitControlsは有効で、パンは禁止、距離は2.1から6.4に制限される。
- 書出範囲オーバーレイ表示中はカメラ操作を無効にする。

根拠:

- `lib/simulator/displayPresets.ts`
- `components/controls/DisplayControls.tsx`
- `components/screens/SimulatorScreen.tsx`
- `components/simulator/CameraController.tsx`

### アクリル板サイズ

- サイズプリセットは `small`, `medium`, `large`。
- 初期値は `medium`。
- 未知のサイズIDを指定した場合は `medium` にフォールバックする。
- サイズはアクリル板の幅、高さ、厚み、台座、LEDバー、point light、カメラ距離倍率に影響する。

| ID | ラベル | 仕様上のサイズ |
|---|---|---|
| `small` | S (100 x 150 mm) | 幅1.3、高さ1.95、厚み0.08 |
| `medium` | M (120 x 180 mm) | 幅1.6、高さ2.4、厚み0.08 |
| `large` | L (150 x 200 mm) | 幅1.9、高さ2.75、厚み0.08 |

根拠:

- `lib/simulator/acrylicSizePresets.ts`
- `components/controls/ImageControls.tsx`
- `components/simulator/AcrylicStandMesh.tsx`
- `components/simulator/LedBaseMesh.tsx`
- `components/simulator/CameraController.tsx`

## エラー・例外

| 条件 | 応答/挙動 |
|---|---|
| 未知の背景ID | 先頭背景プリセットへフォールバックする |
| 未知のカメラID | 3Dカメラは `front` 位置へフォールバックする |
| 未知のサイズID | `medium` サイズへフォールバックする |
| WebGL context lost | 3Dプレビューのフォールバックを表示する |

## 関連実装

- `components/controls/DisplayControls.tsx`
- `components/controls/ImageControls.tsx`
- `components/screens/SimulatorScreen.tsx`
- `components/simulator/SimulatorCanvas.tsx`
- `components/simulator/AcrylicStandMesh.tsx`
- `components/simulator/LedBaseMesh.tsx`
- `components/simulator/CameraController.tsx`
- `lib/simulator/displayPresets.ts`
- `lib/simulator/acrylicSizePresets.ts`

## 関連テスト

- `tests/components/controls/DisplayControls.test.tsx`
- `tests/components/controls/ImageControls.test.tsx`
- `tests/components/screens/SimulatorScreen.test.tsx`
- `tests/components/simulator/CameraController.test.tsx`
- `tests/components/simulator/SimulatorCanvas.test.tsx`

## 未確認・推定

- アクリル板サイズの内部3D単位と実寸mmの換算式は未定義。
- 背景プリセットの追加基準やブランド上の制約は未確認。
- OrbitControlsでユーザーが動かしたカメラ状態を書き出し/保存対象にするかは未定義。
