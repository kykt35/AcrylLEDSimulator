# 実装チェックリスト: UIUX改善レポート対応

## 対応プラン
- Plan Index: `./plan-1-index.md`
- Parts:
  - `./plan-1-part1.md`
  - `./plan-1-part2.md`
  - `./plan-1-part3.md`
- Topic: `20260409_1_uiux-improvement-report`

## ステータス定義
- `planned`: 計画済み（未着手）
- `done`: 計画どおり完了
- `changed`: 計画から変更して実施（理由を記載）
- `skipped`: 未実施 / 不要化（理由を記載）

## Task別チェック

### Task 1.1: アップロード体験をドロップゾーンUIへ刷新する

| ID | 種別 | 内容 | 対応コミット(予定) | 実績コミット | 状態 | メモ |
|---|---|---|---|---|---|---|
| 1.1-1 | test | `ImageUploader` / `ImageControls` の期待挙動をテスト追加 | `test: cover drag and drop uploader states` | `c2e28a4` | done | ドロップ状態とPNGバリデーションを追加 |
| 1.1-2 | impl | `ImageUploader` をドロップゾーンUIへ置き換え | `feat: replace native uploader with dropzone` | `c2e28a4` | done | 実装は基礎UI改善コミットへ集約 |
| 1.1-3 | impl | ローディング・制約表示・サムネイルプレビューを接続 | `feat: add uploader feedback and preview` | `c2e28a4`, `843b397` | done | 読み込み中表示とプレビューを接続し、リセット時の状態同期を修正 |
| 1.1-4 | verify | `ImageUploader.test.tsx` と `ImageControls.test.tsx` を実行 | - | `npm test` | done | 全テスト成功 |

### Task 1.2: 画像タブの入力部品をテーマ準拠に統一する

| ID | 種別 | 内容 | 対応コミット(予定) | 実績コミット | 状態 | メモ |
|---|---|---|---|---|---|---|
| 1.2-1 | test | サイズ選択と画像調整UIの回帰テストを追加 | `test: cover styled image controls` | `c2e28a4` | done | ボタン型サイズ選択と値バッジを検証 |
| 1.2-2 | impl | サイズ選択UIをテーマ準拠に置き換え | `feat: restyle acrylic size selector` | `c2e28a4` | done | セレクトをチップ型ラジオへ変更 |
| 1.2-3 | impl | スライダーの見た目と数値フィードバックを改善 | `feat: polish image adjustment sliders` | `c2e28a4` | done | 数値バッジ付きレンジUIへ統一 |
| 1.2-4 | verify | `ImageControls.test.tsx` を実行 | - | `npm test` | done | 全テスト成功 |

### Task 1.3: 3Dプレビュー見出しと主要フォーム要素の見た目を整える

| ID | 種別 | 内容 | 対応コミット(予定) | 実績コミット | 状態 | メモ |
|---|---|---|---|---|---|---|
| 1.3-1 | test | 見出し文言と各コントロールの回帰テストを更新 | `test: update simulator and control labels` | `c2e28a4` | done | タブ進行状態と保存UIのテストを更新 |
| 1.3-2 | impl | デバッグ用見出しをユーザー向け文言へ差し替え | `fix: replace debug heading in preview panel` | `c2e28a4` | done | `3D プレビュー` へ差し替え済み |
| 1.3-3 | impl | ラジオ/チェック/スライダー系の見た目を統一 | `feat: unify native form control styles` | `c2e28a4` | done | トグル・セグメント・レンジの見た目を統一 |
| 1.3-4 | verify | 関連テストを実行 | - | `npm test` | done | 全テスト成功 |

### Task 2.1: 初回空状態とプレビュー誘導を改善する

| ID | 種別 | 内容 | 対応コミット(予定) | 実績コミット | 状態 | メモ |
|---|---|---|---|---|---|---|
| 2.1-1 | test | 未アップロード時プレースホルダーのテストを追加 | `test: cover simulator empty state guidance` | `c2e28a4` | done | 空状態表示テストを追加 |
| 2.1-2 | impl | 3Dプレビュー領域へ空状態プレースホルダーを追加 | `feat: add guided empty state to preview` | `c2e28a4` | done | 空状態CTAを追加 |
| 2.1-3 | impl | 空状態とアップロード導線の文言・接続を統一 | `feat: align empty state with upload flow` | `c2e28a4` | done | 画像タブ誘導と文言を統一 |
| 2.1-4 | verify | `SimulatorScreen.test.tsx` を実行 | - | `npm test` | done | 全テスト成功 |

### Task 2.2: タブ進行状態とセクション要約を整理する

| ID | 種別 | 内容 | 対応コミット(予定) | 実績コミット | 状態 | メモ |
|---|---|---|---|---|---|---|
| 2.2-1 | test | タブステータス表示と要約表示のテストを追加 | `test: cover control tab progress states` | `c2e28a4` | done | タブ状態と要約表示の期待値を更新 |
| 2.2-2 | impl | 完了済み/未設定/未到達の進行状態を可視化 | `feat: visualize simulator step progress` | `c2e28a4` | done | タブに進行状態とマーカーを追加 |
| 2.2-3 | impl | タブ内サマリーを圧縮して説明を補助UIへ退避 | `feat: compact control panel summaries` | `c2e28a4` | done | 説明をヘルプボタンへ退避 |
| 2.2-4 | verify | `SimulatorScreen.test.tsx` を実行 | - | `npm test` | done | 全テスト成功 |

### Task 2.3: 色・背景・保存フィードバックの視認性を高める

| ID | 種別 | 内容 | 対応コミット(予定) | 実績コミット | 状態 | メモ |
|---|---|---|---|---|---|---|
| 2.3-1 | test | プリセット視覚表示と保存フィードバックのテストを更新 | `test: cover visual preset and save feedback states` | `c2e28a4` | done | トーストとプリセット見た目の回帰を更新 |
| 2.3-2 | impl | ライティング/背景プリセットに視覚ヒントを追加 | `feat: add visual cues to presets` | `c2e28a4` | done | カラードットと背景スウォッチを追加 |
| 2.3-3 | impl | ローディング、保存完了、全体リセット導線を改善 | `feat: improve loading and save feedback` | `c2e28a4` | done | ローディングオーバーレイと成功トーストを追加 |
| 2.3-4 | verify | 関連テストを実行 | - | `npm test`, `npm run build` | done | テスト・ビルド成功 |

### Task 3.1: モバイル用のコントロール導線を再設計する

| ID | 種別 | 内容 | 対応コミット(予定) | 実績コミット | 状態 | メモ |
|---|---|---|---|---|---|---|
| 3.1-1 | test | モバイル時の導線と表示テストを更新 | `test: cover mobile simulator navigation` | `c2e28a4` | done | 既存画面テストを新構造へ更新 |
| 3.1-2 | impl | モバイル用のコントロール導線を再構成 | `feat: optimize simulator controls for mobile` | `c2e28a4` | done | モバイルでプレビューをsticky化 |
| 3.1-3 | impl | タブ横スクロールの可視化または代替UIを追加 | `feat: clarify mobile tab overflow` | `c2e28a4` | done | フェードと余白で横スクロールを可視化 |
| 3.1-4 | verify | `SimulatorScreen.test.tsx` を実行 | - | `npm test` | done | 全テスト成功 |

### Task 3.2: ホーム画面のヒーローとCTAを強化する

| ID | 種別 | 内容 | 対応コミット(予定) | 実績コミット | 状態 | メモ |
|---|---|---|---|---|---|---|
| 3.2-1 | test | ヒーロー内ビジュアルとCTA配置のテストを追加 | `test: cover homepage hero enhancements` | `c2e28a4` | done | ホームのヒーロー表示テストを追加 |
| 3.2-2 | impl | ヒーローへシミュレーター視覚素材を追加 | `feat: add visual hero for simulator landing` | `c2e28a4` | done | 右カラムにビジュアルカードを追加 |
| 3.2-3 | impl | CTAサイズ・余白・配置を調整 | `feat: strengthen homepage primary cta` | `c2e28a4` | done | CTAのサイズと影を強化 |
| 3.2-4 | verify | `page.test.tsx` を実行 | - | `npm test` | done | 全テスト成功 |

### Task 3.3: モーダルとステータス通知のアクセシビリティを補強する

| ID | 種別 | 内容 | 対応コミット(予定) | 実績コミット | 状態 | メモ |
|---|---|---|---|---|---|---|
| 3.3-1 | test | フォーカス制御とライブリージョンのテストを追加 | `test: cover modal focus and live regions` | `c2e28a4` | done | モーダル開閉とEsc動作を追加検証 |
| 3.3-2 | impl | モーダルへフォーカストラップとEscクローズを追加 | `feat: harden modal keyboard accessibility` | `c2e28a4` | done | `NoticeModal` にフォーカス制御を追加 |
| 3.3-3 | impl | 状態変化にライブリージョンを追加 | `feat: announce simulator status changes` | `c2e28a4` | done | 保存・読込状態をライブリージョンで通知 |
| 3.3-4 | verify | 関連テストを実行 | - | `npm test`, `npm run build` | done | テスト・ビルド成功 |

## 計画差分ログ

| 日時 | 変更内容 | 理由 | 承認者 |
|---|---|---|---|
| 2026-04-09 | 実装コミットを `c2e28a4` に集約 | `app/globals.css` と `SimulatorScreen` に跨る変更が多く、レビュー可能性を保ちながら差分を一貫させるため | Codex |
| 2026-04-09 | `843b397` でアップローダー状態同期を追補 | コードレビューで、全体リセット後にアップローダー文言が残る可能性を修正したため | Codex |

## 最終確認
- [x] 全タスクの状態を更新した
- [x] `changed/skipped` の理由を記載した
- [x] 実施内容がPR要約に反映された
