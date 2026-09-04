# 画像入力仕様

## 目的

ユーザーがPNGファイルを選択またはドラッグ&ドロップし、アクリル板プレビュー用の画像としてブラウザ内で読み込めるようにする。読み込んだ画像は配置調整と彫刻用画像生成の入力になる。

## 利用者

- 既存PNG画像で見え方を確認したいユーザー
- 画像の収まり、拡大率、位置を調整したいユーザー

## 入口

| 種別 | 入口 | 内容 |
|---|---|---|
| UI | `components/screens/SimulatorScreen.tsx` | プレビュー面クリック、ファイル入力、ドラッグ&ドロップを処理する |
| UI | `components/controls/ImageControls.tsx` | アクリル板サイズ、content fit、拡大率、位置を変更する |
| Lib | `lib/image/loadPngTexture.ts` | PNGファイル検証、Data URL読み込み、初期彫刻画像生成を行う |
| Lib | `lib/image/composePreviewImage.ts` | 透明余白を除いたプレビュー配置画像を生成する |

## 実装から分かる仕様

### PNG読み込み

- クライアント側の読み込み対象は `File` である。
- ファイル入力の `accept` は `image/png`。
- ファイルタイプが `image/png` でない場合は拒否する。
- ファイルサイズが8MBを超える場合は拒否する。
- 読み込みは `FileReader.readAsDataURL` で行う。
- ファイル選択とドラッグ&ドロップは、どちらもブラウザ内で同じ読み込み処理を実行する。画像入力のためのHTTPリクエストは送信しない。
- 読み込み成功時、元画像Data URL、ファイル名、初期彫刻画像を状態に保存する。
- 元画像Data URLはブラウザ内のプレビュー、彫刻生成、セッション保存に使用し、サーバーには永続化しない。
- 再利用可能な画像URL、共有URL、サーバー側の画像IDは画像入力処理から生成しない。
- 読み込み成功時、書き出しクロップ範囲は全体に戻り、書出範囲表示は閉じる。
- 読み込み失敗時、画像と彫刻のプレビュー状態はerrorまたはidle相当に戻る。

根拠:

- `components/screens/SimulatorScreen.tsx`
- `lib/image/loadPngTexture.ts`

### ドラッグ&ドロップ

- プレビュー面にファイルをドラッグすると `dropEffect` を `copy` にする。
- ドラッグ中はドロップ用オーバーレイを表示する。
- ドロップされた先頭ファイルを読み込む。
- 画像が読み込み済みの場合も、プレビュー面へのドロップで画像差し替えできる。
- 画像未選択かつ処理中でない場合、プレビュー面クリックまたはEnter/Spaceでファイル選択を開く。

根拠:

- `components/screens/SimulatorScreen.tsx`

### 画像配置

- アクリル板サイズは `small`, `medium`, `large` の3種類。
- デフォルトのアクリル板サイズは `medium`。
- content fitは `contain`, `cover`, `fill` の3種類。
- 画像スケールは0.4から1.6の範囲に丸める。
- 横位置と縦位置は -100 から 100 の範囲に丸める。
- 配置調整をリセットすると `contain`, scale 1, offsetX 0, offsetY 0 に戻る。
- プレビュー合成では、アルファ値8以上の不透明領域を検出し、透明余白を除いて1580 x 2380の内部画像へ描画する。
- `contain` は全体を収め、`cover` は余白なく広げ、`fill` は枠いっぱいに伸ばす。

根拠:

- `components/controls/ImageControls.tsx`
- `lib/simulator/acrylicSizePresets.ts`
- `lib/simulator/imageLayout.ts`
- `lib/image/composePreviewImage.ts`

## エラー・例外

| 条件 | 応答/挙動 |
|---|---|
| PNG以外のファイル | `PNGファイルを選択してください。` を表示する |
| 8MB超過 | `8MB 以下の PNG ファイルを選択してください。` を表示する |
| FileReader失敗 | PNG読み込み失敗として扱う |
| プレビュー合成用canvas初期化失敗 | 元画像または現行画像にフォールバックし、状態はerrorになる |

## 関連実装

- `components/screens/SimulatorScreen.tsx`
- `components/controls/ImageControls.tsx`
- `lib/image/loadPngTexture.ts`
- `lib/image/composePreviewImage.ts`
- `lib/simulator/imageLayout.ts`
- `lib/simulator/acrylicSizePresets.ts`

## 関連テスト

- `tests/components/screens/SimulatorScreen.test.tsx`
- `tests/components/controls/ImageControls.test.tsx`
- `tests/lib/image/loadPngTexture.test.ts`

## 未確認・推定

- 最大8MBの根拠となるプロダクト要件は未確認。
- 透明余白除去のアルファしきい値8が、すべての入稿画像に適切かは未検証。
