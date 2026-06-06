# 書き出し/保存仕様

## 目的

3Dプレビューの現在の見え方、または生成済みの彫刻用画像をローカルへダウンロードできるようにする。書き出し後はエディタ状態をセッションに保存し、必要に応じて復元できるようにする。

## 利用者

- シミュレーション結果をPNG/JPGで保存したいユーザー
- 彫刻用グレースケールPNGを保存したい制作担当者
- 書き出し後に同じ状態から作業を再開したいユーザー

## 入口

| 種別 | 入口 | 内容 |
|---|---|---|
| UI | `components/controls/SaveControls.tsx` | 書き出し形式、プレビュー、ダウンロードボタンを提供する |
| UI | `components/controls/ExportCropOverlayToggle.tsx` | 書出範囲オーバーレイの表示/非表示を切り替える |
| UI | `components/controls/ExportCropOverlay.tsx` | 書出範囲を移動/リサイズする |
| Screen | `components/screens/SimulatorScreen.tsx` | 保存状態、形式、クロップ範囲、セッション保存を制御する |
| Lib | `lib/export/exportCanvasImage.ts` | 3DプレビューcanvasをPNG/JPG Blobへ変換する |
| Lib | `lib/export/exportCropRegion.ts` | クロップ範囲を丸める |
| Lib | `lib/export/exportEngravingImage.ts` | 彫刻用PNGをBlobへ変換する |
| Lib | `lib/save/session.ts` | エディタスナップショットをsessionStorageへ保存/復元する |

## 実装から分かる仕様

### シミュレーション画像書き出し

- 書き出し対象はプレビュー領域内の最初の `canvas`。
- 書き出し形式は `png` または `jpg`。
- 初期形式は `png`。
- `png` は `image/png`、`jpg` は `image/jpeg` としてBlob化する。
- Canvasの `preserveDrawingBuffer` は有効になっている。
- ダウンロードファイル名は元ファイル名の拡張子を外し、選択形式の拡張子を付ける。
- 元ファイル名が空の場合は `acryl-led-simulation.{format}` を使う。
- 画像が未選択の場合、保存ボタンは無効になる。
- 保存中は保存ボタンを無効にする。
- 成功時は保存完了モーダルを表示する。

根拠:

- `components/controls/SaveControls.tsx`
- `components/screens/SimulatorScreen.tsx`
- `components/simulator/SimulatorCanvas.tsx`
- `lib/export/exportCanvasImage.ts`
- `lib/download/downloadBlob.ts`

### 書出範囲クロップ

- クロップ範囲は正規化された `x`, `y`, `width`, `height` で保持する。
- 初期値は全面 `x=0`, `y=0`, `width=1`, `height=1`。
- クロップ範囲の最小サイズは0.08。
- `width` / `height` は0.08から1へ丸める。
- `x` / `y` はクロップ範囲がキャンバス外へ出ないように丸める。
- 書出範囲オーバーレイでは、範囲全体の移動と四隅のリサイズができる。
- オーバーレイ表示中は、ホイールとクリックをプレビュー操作へ伝播しない。
- 書出しパネルを開いていて画像がある場合、120ms後に次のanimation frameでクロップ済みプレビューData URLを生成する。

根拠:

- `components/controls/ExportCropOverlay.tsx`
- `components/controls/ExportCropOverlayToggle.tsx`
- `components/screens/SimulatorScreen.tsx`
- `lib/export/exportCropRegion.ts`
- `lib/export/exportCanvasImage.ts`

### 彫刻用PNG書き出し

- 彫刻用画像がある場合だけ、彫刻用PNGダウンロードボタンを有効にする。
- ファイル名は元ファイル名の拡張子を外し、`-engraving.png` を付ける。
- 白黒反転を指定した場合は、RGB値を反転したPNG Blobを生成する。
- 反転しない場合は、彫刻用PNG Data URLをそのままBlobへ変換する。

根拠:

- `components/controls/EngravingControls.tsx`
- `components/screens/SimulatorScreen.tsx`
- `lib/export/exportEngravingImage.ts`

### セッション保存/復元

- シミュレーション画像の書き出し成功前に、エディタスナップショットを保存する。
- 保存先は `sessionStorage` の `acryl-led-simulator:editor`。
- `sessionStorage` が使えない場合はメモリ上のフォールバックを使う。
- 保存対象は元画像ファイル名、元画像Data URL、彫刻画像Data URL、彫刻調整値、平均強度、LED色、明るさ、高さ減衰、背景、カメラ、アクリルサイズ、元画像オーバーレイ表示、画像配置。
- 読み込み時に不足している彫刻調整値、`heightAttenuation`、`acrylicSizeId` はデフォルトで補完する。
- 読み込み時の彫刻調整値 `toneLevels` は、2から8の範囲へ正規化する。
- `?resume=1` がある場合だけセッション保存を復元する。
- `?reset=1` がある場合は状態とsessionStorageをクリアする。

根拠:

- `components/screens/SimulatorScreen.tsx`
- `lib/save/session.ts`

## エラー・例外

| 条件 | 応答/挙動 |
|---|---|
| プレビュー領域がない | `プレビュー領域が見つかりません。` |
| 対象canvasがない | `書き出し対象の canvas が見つかりません。` |
| 書き出し用canvas初期化失敗 | `書き出し用の canvas を初期化できません。` |
| `toBlob` がBlobを返さない | `画像の書き出しに失敗しました。` |
| 彫刻用PNG Data URLが不正 | `彫刻用画像の形式が不正です。` |
| sessionStorage書き込み失敗 | 例外は出さず、メモリ保存だけにフォールバックする |
| sessionStorage JSON不正 | メモリ保存があればそれを使い、なければ復元しない |

## 関連実装

- `components/screens/SimulatorScreen.tsx`
- `components/controls/SaveControls.tsx`
- `components/controls/ExportCropOverlay.tsx`
- `components/controls/ExportCropOverlayToggle.tsx`
- `components/controls/EngravingControls.tsx`
- `components/modals/SaveCompleteModal.tsx`
- `lib/export/exportCanvasImage.ts`
- `lib/export/exportCropRegion.ts`
- `lib/export/exportEngravingImage.ts`
- `lib/download/downloadBlob.ts`
- `lib/save/session.ts`

## 関連テスト

- `tests/components/controls/ExportCropOverlay.test.tsx`
- `tests/components/controls/ExportCropOverlayToggle.test.tsx`
- `tests/components/controls/EngravingControls.test.tsx`
- `tests/components/screens/SimulatorScreen.test.tsx`
- `tests/lib/export/exportCanvasImage.test.ts`
- `tests/lib/export/exportCropRegion.test.ts`
- `tests/lib/export/exportEngravingImage.test.ts`
- `tests/lib/download/downloadBlob.test.ts`
- `tests/lib/save/session.test.ts`

## 未確認・推定

- 書き出し画像の推奨解像度、DPI、余白ルールは未定義。
- JPG書き出し時の品質指定は実装されていない。
- セッション保存されたData URLの容量上限とブラウザ別挙動は未検証。
- 書き出し完了モーダル後の導線や永続保存機能の要否は未確認。
