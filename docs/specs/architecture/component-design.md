# Component Design

## 目的

現行MVPの1画面シミュレーターについて、ルート、画面コンテナ、UI、3D表示、画像処理、ダウンロード、セッション保存の責務を定義する。

## 設計方針

- `/` と `/simulator` は同じ `SimulatorScreen` を表示する
- 画面状態と処理の起点は `SimulatorScreen` に集約する
- 操作UIは `components/controls/`、3D表示は `components/simulator/` に分離する
- 画像入力、彫刻生成、Canvas書き出し、ダウンロード、セッション保存は `lib/` の純粋処理またはブラウザ処理へ分離する
- 現行MVPの画像入力とダウンロードはブラウザ内で完結し、アプリ独自APIを使用しない
- 未実装の結果画面、サーバー保存、共有機能の抽象化は現行構成へ混在させない

## 現行ディレクトリ構成

```text
app/
  page.tsx
  simulator/
    page.tsx
  usage/
    page.tsx
  about/
    page.tsx
  layout.tsx
  globals.css

components/
  screens/
    SimulatorScreen.tsx
    SimulatorHeaderActions.tsx
  controls/
    LightingControls.tsx
    DisplayControls.tsx
    ImageControls.tsx
    EngravingControls.tsx
    SaveControls.tsx
    ExportCropOverlay.tsx
    ExportCropOverlayToggle.tsx
  simulator/
    SimulatorCanvas.tsx
    AcrylicStandMesh.tsx
    EngravingGlowMaterial.tsx
    LedBaseMesh.tsx
    SceneLighting.tsx
    CameraController.tsx
  modals/
    NoticeModal.tsx
    SaveCompleteModal.tsx
  ui/
    ErrorNotice.tsx
    PreviewEmptyIcon.tsx

lib/
  image/
    loadPngTexture.ts
    composePreviewImage.ts
    generateEngravingMap.ts
    engravingFilters.ts
  export/
    exportCanvasImage.ts
    exportCropRegion.ts
    exportEngravingImage.ts
  download/
    downloadBlob.ts
  save/
    session.ts
  simulator/
    acrylicMaterial.ts
    acrylicSizePresets.ts
    displayPresets.ts
    imageLayout.ts
    lightingPresets.ts
```

## ルート責務

### `app/page.tsx`

- `searchParams` を解決して `SimulatorScreen` へ渡す
- `/` にシミュレーター本体を表示する

### `app/simulator/page.tsx`

- `app/page.tsx` と同様に `searchParams` を解決して `SimulatorScreen` へ渡す
- `/simulator` に同一のシミュレーターを表示する

### `app/usage/page.tsx`

- PNG追加、調整、書き出しの手順を表示する
- `/` へ戻る導線と注意事項dialogを提供する

### `app/about/page.tsx`

- アプリの目的、対象機能、注意事項を表示する
- `/` で試す導線を提供する

結果専用ルートとAPI Route Handlerは現行MVPに存在しない。

## コンポーネント責務

### 画面統合

#### `SimulatorScreen`

- 画像、彫刻、ライト、表示、配置、書出し、UIの状態を管理する
- ファイル入力、ドラッグ&ドロップ、リセット、復元のイベントを処理する
- 画像処理とダウンロード処理を `lib/` へ委譲する
- 3D表示と各設定コントロールへpropsとcallbackを渡す
- ローディング、成功toast、エラー表示を制御する

#### `SimulatorHeaderActions`

- デスクトップの補助リンクと注意事項ボタンを表示する
- 960px以下のハンバーガーメニューを制御する
- 表示幅に応じた注意事項dialogのフォーカス復帰先を決める

### 操作UI

| コンポーネント | 責務 |
|---|---|
| `LightingControls` | LED色、明るさ、高さ方向の減衰 |
| `DisplayControls` | 背景、カメラ、元画像オーバーレイ、カメラリセット |
| `ImageControls` | アクリルサイズ、content fit、画像サイズ、縦横位置 |
| `EngravingControls` | 彫刻モード、彫刻調整、彫刻用PNGダウンロード |
| `SaveControls` | 書出しプレビュー、PNG/JPG選択、ダウンロード操作 |
| `ExportCropOverlayToggle` | 書出範囲オーバーレイの表示切替 |
| `ExportCropOverlay` | 書出範囲の移動とリサイズ |

設定パネル自体は独立コンポーネントではなく、`SimulatorScreen` が選択中タブに応じて各コントロールを表示する。

### 3D表示

| コンポーネント | 責務 |
|---|---|
| `SimulatorCanvas` | React Three Fiber Canvas、シーン合成、WebGL復旧UI |
| `AcrylicStandMesh` | アクリル板、元画像テクスチャ、彫刻発光面 |
| `EngravingGlowMaterial` | 彫刻画像に基づく発光マテリアル |
| `LedBaseMesh` | LED台座、LEDバー、point light |
| `SceneLighting` | ambient/directional light |
| `CameraController` | カメラプリセット、OrbitControls、リセット |

### フィードバック

| コンポーネント | 責務 |
|---|---|
| `NoticeDialog` / `NoticeModal` | 注意事項、フォーカストラップ、スクロール抑止、フォーカス復帰 |
| `SaveCompleteModal` | ダウンロード開始を非モーダルtoastとして通知 |
| `ErrorNotice` | 画像読込、彫刻生成、ダウンロード失敗を画面内表示 |
| `PreviewEmptyIcon` | 画像未選択時の視覚的な案内 |

ファイル名に `Modal` を含む `SaveCompleteModal` は、実際には `role="status"` のtoastとして描画され、フォーカスを奪わない。

## ライブラリ責務

| 領域 | 主な責務 |
|---|---|
| `lib/image/` | PNG検証、Data URL読込、配置合成、彫刻マップ生成 |
| `lib/export/` | Canvasクロップ、PNG/JPG Blob化、彫刻用PNG Blob化 |
| `lib/download/` | Object URLと一時リンクによるローカルダウンロード |
| `lib/save/session.ts` | `EditorSnapshot` のsessionStorage保存、復元、初期化、メモリフォールバック |
| `lib/simulator/` | 3D表示用プリセット、マテリアル値、画像配置値 |

## 処理の依存方向

```text
app/page.tsx または app/simulator/page.tsx
  ↓
SimulatorScreen
  ├─ controls / modals / ui
  ├─ SimulatorCanvas
  │    └─ 3D表示コンポーネント
  └─ lib
       ├─ image
       ├─ export
       ├─ download
       ├─ save
       └─ simulator
```

表示コンポーネントからページルートやサーバーAPIへ直接依存しない。

## 現行MVPに存在しない構成

- `app/result/page.tsx`
- `app/api/save/route.ts`
- `ExportResultCard`
- `ResultActions`
- `PocWorkbench`
- `ImageUploader`
- `ExportPreviewButton`
- `SimulatorControlPanel`
- `types/save.ts`

これらを将来追加する場合は、現行コンポーネントとして記載せず、対応Issueの設計で責務とデータ境界を定義する。

## 将来拡張との境界

- サーバー保存は認証、ストレージ、容量制限、保持期間を含む別機能とする
- 保存結果画面はサーバー保存または結果の再参照要件が確定した場合に設計する
- 共有URL、保存履歴、比較、注文、管理画面はMVP対象外とする
