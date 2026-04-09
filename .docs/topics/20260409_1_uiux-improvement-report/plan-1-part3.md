# UIUX改善レポート対応 - Part 3: モバイル・ホーム・a11y改善

## 概要
シミュレーターの基礎体験が整った前提で、モバイル導線、ホーム画面の訴求力、アクセシビリティの不足点を補完する。

## タスク一覧

### Task 3.1: モバイル用のコントロール導線を再設計する

**目的:** 3Dプレビューを見ながら設定を調整しづらい現状を改善し、狭い画面でも操作を継続しやすくする。

**変更ファイル:**
- `components/screens/SimulatorScreen.tsx`
- `app/globals.css`
- `tests/components/screens/SimulatorScreen.test.tsx`

**サブタスク:**
1. [ ] モバイル時のタブ表示、コントロール表示、スクロール導線のテストを更新する
2. [ ] コミット: `test: cover mobile simulator navigation`
3. [ ] モバイル用の下部シート、スティッキープレビュー、またはアコーディオン化のいずれかでコントロール導線を再構成する
4. [ ] コミット: `feat: optimize simulator controls for mobile`
5. [ ] 横スクロールタブのフェードや代替UIを追加し、スクロール可能であることを視覚的に示す
6. [ ] コミット: `feat: clarify mobile tab overflow`
7. [ ] `SimulatorScreen.test.tsx` を実行して結果を確認する

**受け入れ条件:**
- [ ] モバイルで3Dプレビューと設定操作を往復しやすい
- [ ] タブが横スクロール可能であること、または代替UIがあることが明確
- [ ] 960px以下での情報量過多が軽減される

---

### Task 3.2: ホーム画面のヒーローとCTAを強化する

**目的:** プロダクトの視覚訴求を高め、シミュレーターへの遷移意欲を強める。

**変更ファイル:**
- `app/page.tsx`
- `app/globals.css`
- `tests/app/page.test.tsx`

**サブタスク:**
1. [ ] ヒーロー内ビジュアルとCTA配置に関する期待挙動をテストへ追加する
2. [ ] コミット: `test: cover homepage hero enhancements`
3. [ ] ヒーロー右側へシミュレーターの静止画、簡易アニメーション、またはビジュアルカード群を追加する
4. [ ] コミット: `feat: add visual hero for simulator landing`
5. [ ] CTAのサイズ、余白、視線誘導を調整し、ファーストビューで行動しやすくする
6. [ ] コミット: `feat: strengthen homepage primary cta`
7. [ ] `page.test.tsx` を実行して結果を確認する

**受け入れ条件:**
- [ ] ホーム画面のヒーローが視覚的にプロダクト内容を伝える
- [ ] 「試してみる」導線が埋もれず、ファーストビューで見つけやすい
- [ ] 既存の説明テキスト量を増やしすぎず訴求力を高めている

---

### Task 3.3: モーダルとステータス通知のアクセシビリティを補強する

**目的:** モーダル操作と状態変化がキーボード・スクリーンリーダー利用者にも伝わるようにする。

**変更ファイル:**
- `components/modals/NoticeModal.tsx`
- `components/screens/SimulatorScreen.tsx`
- `app/page.tsx`
- `app/globals.css`
- `tests/components/screens/SimulatorScreen.test.tsx`
- `tests/app/page.test.tsx`

**サブタスク:**
1. [ ] `NoticeModal` のフォーカス制御とステータスメッセージの通知方法に関するテストを追加する
2. [ ] コミット: `test: cover modal focus and live regions`
3. [ ] モーダルにフォーカストラップ、Escでのクローズ、背景の操作抑止を実装する
4. [ ] コミット: `feat: harden modal keyboard accessibility`
5. [ ] 画像読込完了、エラー、保存成功などの状態変化に `aria-live` などのライブリージョンを追加する
6. [ ] コミット: `feat: announce simulator status changes`
7. [ ] 関連テストを実行して結果を確認する

**受け入れ条件:**
- [ ] モーダル表示中にフォーカスが外へ抜けず、Escキーで閉じられる
- [ ] 主要な成功/失敗/進行状態がスクリーンリーダーへ伝わる
- [ ] アクセシビリティ改善が既存レイアウトや導線を壊していない

## Part内の依存関係
- Task 3.1 は Part 2 のタブ進行UI確定後に着手する
- Task 3.3 は Task 2.3 のフィードバック導線追加後に実装すると、通知対象を整理しやすい

## 備考
- モバイル最適化とアクセシビリティ対応は、見た目の改善だけでなく操作不能ケースの削減を目的にする
