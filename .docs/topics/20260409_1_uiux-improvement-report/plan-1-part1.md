# UIUX改善レポート対応 - Part 1: シミュレーターの基礎UI改善

## 概要
リリース前に必須となるP0/P1項目を先に処理する。アップロード体験、3Dプレビュー見出し、ネイティブフォーム要素の浮きといった第一印象に直結する箇所を改善し、シミュレーターの基礎UIを整える。

## タスク一覧

### Task 1.1: アップロード体験をドロップゾーンUIへ刷新する

**目的:** 画像アップロード導線をダークテーマに馴染むUIへ置き換え、ドラッグ&ドロップ、ローディング、プレビューを含む基本体験を改善する。

**変更ファイル:**
- `components/upload/ImageUploader.tsx`
- `components/controls/ImageControls.tsx`
- `app/globals.css`
- `tests/components/upload/ImageUploader.test.tsx`
- `tests/components/controls/ImageControls.test.tsx`

**サブタスク:**
1. [ ] `ImageUploader` / `ImageControls` の期待挙動をテストで追加し、ドロップゾーン表示、選択後ステータス、プレビュー表示の回帰を防ぐ
2. [ ] コミット: `test: cover drag and drop uploader states`
3. [ ] `ImageUploader` をクリック + ドラッグ&ドロップ両対応のドロップゾーンUIへ置き換え、インラインスタイルを廃止する
4. [ ] コミット: `feat: replace native uploader with dropzone`
5. [ ] ファイル選択中/読み込み中の視覚フィードバック、ファイル制約メッセージ、サムネイルプレビューを `ImageControls` と接続して表示する
6. [ ] コミット: `feat: add uploader feedback and preview`
7. [ ] `ImageUploader.test.tsx` と `ImageControls.test.tsx` を実行して結果を確認する

**受け入れ条件:**
- [ ] PNGアップロード導線がドロップゾーンとして表示され、ダークテーマに馴染んでいる
- [ ] ドラッグオーバー時のハイライト、選択後のファイル状態、サムネイルまたは現在画像プレビューが表示される
- [ ] 既存の `onFileSelected` フローを壊さずに利用できる

---

### Task 1.2: 画像タブの入力部品をテーマ準拠に統一する

**目的:** アクリル板サイズセレクトと画像調整スライダーを、既存デザインシステムと整合した操作部品へ統一する。

**変更ファイル:**
- `components/controls/ImageControls.tsx`
- `app/globals.css`
- `tests/components/controls/ImageControls.test.tsx`

**サブタスク:**
1. [ ] `ImageControls` のサイズ選択と画像調整UIに対する表示・操作テストを追加し、既存機能の回帰を抑える
2. [ ] コミット: `test: cover styled image controls`
3. [ ] アクリル板サイズの `<select>` をテーマ準拠のカスタムセレクト、または既存チップボタンに寄せた選択UIへ置き換える
4. [ ] コミット: `feat: restyle acrylic size selector`
5. [ ] 画像調整スライダーにカスタムトラック/ノブと数値表示を追加し、入力方式を一貫させる
6. [ ] コミット: `feat: polish image adjustment sliders`
7. [ ] `ImageControls.test.tsx` を実行して結果を確認する

**受け入れ条件:**
- [ ] サイズ選択UIがダークテーマ上で浮かず、キーボード操作可能である
- [ ] サイズ・横位置・縦位置の調整値が視認しやすく、スライダー操作中に現在値が把握できる
- [ ] 画像タブ内でネイティブフォーム要素だけが浮く状態が解消される

---

### Task 1.3: 3Dプレビュー見出しと主要フォーム要素の見た目を整える

**目的:** デバッグ残骸の除去と、他タブに残るラジオ/チェック/スライダー系のネイティブUI統一をまとめて行う。

**変更ファイル:**
- `components/screens/SimulatorScreen.tsx`
- `components/controls/LightingControls.tsx`
- `components/controls/DisplayControls.tsx`
- `components/controls/EngravingControls.tsx`
- `components/controls/SaveControls.tsx`
- `app/globals.css`
- `tests/components/screens/SimulatorScreen.test.tsx`
- `tests/components/controls/LightingControls.test.tsx`
- `tests/components/controls/DisplayControls.test.tsx`
- `tests/components/controls/EngravingControls.test.tsx`

**サブタスク:**
1. [ ] プレビュー見出し文言と各コントロールの選択UIに対する回帰テストを更新する
2. [ ] コミット: `test: update simulator and control labels`
3. [ ] `Canvas mount verification` をユーザー向け見出しへ変更し、プレビュー領域の文言を整理する
4. [ ] コミット: `fix: replace debug heading in preview panel`
5. [ ] ライティング、表示、彫刻、保存タブに残るラジオ/チェック/スライダーをチップ・トグル・セグメント等の統一UIへ寄せる
6. [ ] コミット: `feat: unify native form control styles`
7. [ ] 関連コンポーネントのテストを実行して結果を確認する

**受け入れ条件:**
- [ ] 3Dプレビュー領域にデバッグ用文言が残っていない
- [ ] PNG/JPG選択、各種チェックボックス、ライティング調整が共通の見た目ルールに沿う
- [ ] 操作方法の不統一による学習コストが減っている

## Part内の依存関係
- Task 1.2 は Task 1.1 のアップロードUI更新後に進めると、画像タブ全体のスタイル調整をまとめやすい
- Task 1.3 は Task 1.2 で定めたUIパターンを他タブへ展開する位置づけ

## 備考
- このPartでフォームコントロールの共通見た目パターンを確立し、後続Partでは状態表示や導線改善に集中する
