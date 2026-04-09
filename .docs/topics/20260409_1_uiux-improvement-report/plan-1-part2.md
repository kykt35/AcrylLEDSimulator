# UIUX改善レポート対応 - Part 2: 操作導線とフィードバック改善

## 概要
シミュレーター利用中の迷いを減らすため、空状態、進行ステータス、タブ内要約、色や背景の視覚フィードバック、保存/処理中の応答を改善する。

## タスク一覧

### Task 2.1: 初回空状態とプレビュー誘導を改善する

**目的:** 画像未選択時でもユーザーが次に何をすべきか理解できるよう、3Dプレビュー領域に明確な空状態を用意する。

**変更ファイル:**
- `components/screens/SimulatorScreen.tsx`
- `components/upload/ImageUploader.tsx`
- `app/globals.css`
- `tests/components/screens/SimulatorScreen.test.tsx`

**サブタスク:**
1. [ ] 未アップロード時のプレースホルダー表示と案内文のテストを追加する
2. [ ] コミット: `test: cover simulator empty state guidance`
3. [ ] 3Dプレビュー領域に空状態プレースホルダー、アップロード案内、必要に応じてサンプル表示を追加する
4. [ ] コミット: `feat: add guided empty state to preview`
5. [ ] アップロードUIとの文言とアクションを揃え、空状態から自然に画像選択へ遷移できるよう接続する
6. [ ] コミット: `feat: align empty state with upload flow`
7. [ ] `SimulatorScreen.test.tsx` を実行して結果を確認する

**受け入れ条件:**
- [ ] 初回表示で「何をすればよいか」が3Dプレビュー領域だけ見ても分かる
- [ ] 画像未選択時に空白だけが残らない
- [ ] アップロード後は空状態が適切に消える

---

### Task 2.2: タブ進行状態とセクション要約を整理する

**目的:** 左から右への操作フローを視覚化しつつ、タブ内サマリーの冗長さを削減する。

**変更ファイル:**
- `components/screens/SimulatorScreen.tsx`
- `app/globals.css`
- `tests/components/screens/SimulatorScreen.test.tsx`

**サブタスク:**
1. [ ] タブステータス表示と要約表示の期待挙動をテストで明確化する
2. [ ] コミット: `test: cover control tab progress states`
3. [ ] 完了済み/未設定/未到達を示すステータス表示、チェックマーク、視覚的な強弱をタブに追加する
4. [ ] コミット: `feat: visualize simulator step progress`
5. [ ] 各タブ上部のサマリーをタイトル + ステータス中心に圧縮し、説明文を補助UIへ退避または折りたたむ
6. [ ] コミット: `feat: compact control panel summaries`
7. [ ] `SimulatorScreen.test.tsx` を実行して結果を確認する

**受け入れ条件:**
- [ ] 操作フローが並列タブではなく段階的ステップとして認識しやすい
- [ ] アクティブタブの要約がスクロール領域を過度に圧迫しない
- [ ] 未設定状態と設定済み状態が視覚的に識別できる

---

### Task 2.3: 色・背景・保存フィードバックの視認性を高める

**目的:** プリセット選択時の視覚ヒントと、処理中/保存完了時のフィードバックを強化して体験品質を上げる。

**変更ファイル:**
- `components/controls/LightingControls.tsx`
- `components/controls/DisplayControls.tsx`
- `components/controls/SaveControls.tsx`
- `components/screens/SimulatorScreen.tsx`
- `app/globals.css`
- `tests/components/controls/LightingControls.test.tsx`
- `tests/components/controls/DisplayControls.test.tsx`
- `tests/components/screens/SimulatorScreen.test.tsx`

**サブタスク:**
1. [ ] ライティング/背景プリセットの視覚表示と保存時フィードバックに関するテストを追加または更新する
2. [ ] コミット: `test: cover visual preset and save feedback states`
3. [ ] ライティングプリセットにカラードット、背景プリセットにサムネイル等のプレビュー要素を追加する
4. [ ] コミット: `feat: add visual cues to presets`
5. [ ] 読み込み中オーバーレイ、保存完了アニメーションまたはトースト、全体リセット導線を実装する
6. [ ] コミット: `feat: improve loading and save feedback`
7. [ ] 関連テストを実行して結果を確認する

**受け入れ条件:**
- [ ] 色や背景の違いがテキストを読まなくても把握しやすい
- [ ] 画像処理中やダウンロード完了時に状態変化が視覚的に伝わる
- [ ] 既存の個別リセット導線を損なわず、全体リセットの導線が明示される

## Part内の依存関係
- Task 2.2 は Task 2.1 の空状態文言とステータス定義を踏まえて実装する
- Task 2.3 は Task 1.3 の共通コントロールパターンを利用して仕上げる

## 備考
- このPartではスタイル変更だけでなく、状態設計と文言整理も同時に扱う
