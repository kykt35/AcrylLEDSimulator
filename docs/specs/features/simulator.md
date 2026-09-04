# シミュレーター仕様

## 目的

PNG画像をアクリル板に配置し、LED台座から照らした見え方を3Dプレビューで確認できるようにする。画像入力、配置、彫刻モード、発光設定、表示設定、書き出しの各機能を1画面でつなぐ。

## 利用者

- LEDアクリルスタンドの完成イメージを確認したいユーザー
- 画像の配置や発光条件を比較したい制作担当者
- 彫刻用画像とシミュレーション画像を書き出したいユーザー

## 入口

| 種別 | 入口 | 内容 |
|---|---|---|
| Page | `app/page.tsx` | ルートで `SimulatorScreen` を表示する |
| Page | `app/simulator/page.tsx` | `/simulator` で `SimulatorScreen` を表示する |
| Component | `components/screens/SimulatorScreen.tsx` | 画像入力、状態管理、3D表示、各コントロール、書き出しを統合する |
| Component | `components/simulator/SimulatorCanvas.tsx` | React Three Fiber のCanvasとWebGL復旧UIを提供する |

## 実装から分かる仕様

### 画面構成

- ルート画面と `/simulator` は同じ `SimulatorScreen` を表示する。
- `SimulatorScreen` はクライアントコンポーネントで、画像入力、彫刻、発光、表示、書き出しの状態を保持する。
- 初期状態ではPNG追加を促す空状態を表示する。
- 画像が読み込まれると、プレビュー上部に設定タブと書出範囲トグル、リセットボタンを表示する。
- 設定タブは `ライト`, `カメラ`, `配置`, `彫刻`, `書出し` を持つ。
- タブは `role="tablist"` / `role="tab"` / `role="tabpanel"` を使う。
- 矢印キー、Home、Endでタブ移動できる。
- Escapeで設定パネルを閉じる。

根拠:

- `app/page.tsx`
- `app/simulator/page.tsx`
- `components/screens/SimulatorScreen.tsx`

### ヘッダーと注意事項モーダル

- 961px以上では、使い方、このアプリについて、注意事項の導線をヘッダーに並べて表示する。
- 960px以下ではヘッダー導線をハンバーガーメニュー内に表示する。
- モバイルメニューの注意事項を選ぶと、メニューを閉じてから注意事項モーダルを表示する。
- 注意事項モーダルは、閉じるボタン、Escape、背景押下で閉じられる。
- 注意事項モーダルの表示中はフォーカスをモーダル内に保つ。
- モバイルの注意事項モーダルを閉じた後は、ハンバーガーボタンへフォーカスを戻す。
- モーダル表示中に960pxの境界を跨いでも表示を維持し、閉じた後は変更後の表示幅で可視な注意事項導線へフォーカスを戻す。

根拠:

- `components/screens/SimulatorHeaderActions.tsx`
- `components/modals/NoticeModal.tsx`

### 3Dプレビュー

- 3Dプレビューは `@react-three/fiber` の `Canvas` で描画する。
- Canvasは `preserveDrawingBuffer: true` を設定し、書き出し時にcanvas画像を取得できるようにする。
- 3Dシーンは `SceneLighting`, `AcrylicStandMesh`, `LedBaseMesh`, `CameraController` で構成する。
- アクリル板はサイズプリセットに応じたbox geometryで表示する。
- 通常表示では元画像テクスチャをアクリル板に貼る。
- 元画像テクスチャありのアクリル素材は `opacity: 1.0` で表示する。
- 彫刻モードでは元画像テクスチャを外し、前面に彫刻用発光プレーンを重ねる。
- LED台座は円柱の台座、LEDバー、point lightで構成する。
- WebGLエラーまたはcontext lost時はフォールバックを表示し、再読み込みボタンでCanvasを再生成する。

根拠:

- `components/simulator/SimulatorCanvas.tsx`
- `components/simulator/AcrylicStandMesh.tsx`
- `components/simulator/LedBaseMesh.tsx`
- `components/simulator/SceneLighting.tsx`
- `components/simulator/EngravingGlowMaterial.tsx`

### 状態管理

- 画像入力状態は `idle`, `loading`, `ready`, `error` を持つ。
- 彫刻画像状態は `idle`, `loading`, `ready`, `error` を持つ。
- 保存状態は `idle`, `saving`, `success`, `error` を持つ。
- シミュレーション状態はLED色、明るさ、高さ方向の減衰、背景、カメラ、アクリルサイズ、彫刻モード、画像配置、書き出し形式、クロップ範囲を持つ。
- `?reset=1` はエディタ状態とセッション保存をリセットする。
- `?resume=1` はセッション保存されたエディタスナップショットを復元する。

根拠:

- `components/screens/SimulatorScreen.tsx`
- `lib/save/session.ts`

## エラー・例外

| 条件 | 応答/挙動 |
|---|---|
| 画像読み込み失敗 | 画像入力エラーとして `ErrorNotice` を表示する |
| 彫刻画像生成失敗 | 彫刻生成エラーとして `ErrorNotice` を表示する |
| ダウンロード失敗 | ダウンロードエラーとして `ErrorNotice` を表示する |
| WebGLエラー/context lost | 3Dプレビューのフォールバックと再読み込みボタンを表示する |
| 画像/彫刻/保存処理中 | プレビュー上にローディング表示を出す |

## 関連実装

- `app/page.tsx`
- `app/simulator/page.tsx`
- `components/screens/SimulatorScreen.tsx`
- `components/screens/SimulatorHeaderActions.tsx`
- `components/modals/NoticeModal.tsx`
- `components/simulator/SimulatorCanvas.tsx`
- `components/simulator/AcrylicStandMesh.tsx`
- `components/simulator/LedBaseMesh.tsx`
- `components/simulator/SceneLighting.tsx`
- `components/simulator/EngravingGlowMaterial.tsx`
- `components/simulator/CameraController.tsx`
- `components/ui/ErrorNotice.tsx`
- `components/ui/PreviewEmptyIcon.tsx`

## 関連テスト

- `tests/app/page.test.tsx`
- `tests/components/screens/SimulatorScreen.test.tsx`
- `tests/components/screens/SimulatorHeaderActions.test.tsx`
- `tests/components/modals/NoticeModal.test.tsx`
- `tests/components/simulator/SimulatorCanvas.test.tsx`
- `tests/components/simulator/AcrylicStandMesh.test.tsx`
- `tests/components/simulator/CameraController.test.tsx`

## 未確認・推定

- 実物アクリル板の光学特性とシミュレーション値の一致度は未検証。
- WebGLが使えない環境で代替の2Dプレビューを提供するかは未決定。
- `/` と `/simulator` の使い分け方針は実装上は同一だが、プロダクト上の正規URLは未確認。
