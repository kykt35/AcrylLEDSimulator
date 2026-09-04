# 仕様変更履歴

仕様ドキュメントの変更履歴を記録する。実装変更に伴う仕様更新では、PR番号またはコミットを分かる範囲で記載する。

| 日付 | 種別 | 対象 | 変更内容 | 関連PR/コミット |
|---|---|---|---|---|
| 2026-06-05 | initial | `docs/specs/` | 仕様ドキュメント構造、機能一覧、運用ルールを追加 |  |
| 2026-06-06 | changed | 彫刻調整 | 階調数を2〜8、輪郭線幅を1〜5、輪郭強調を0〜2の範囲として仕様化 | PR #25, PR #26 |
| 2026-06-07 | changed | 彫刻モード、3D表示 | 連続グレースケール/階調モードを追加し、元画像表示時のアクリル素材opacityを1.0へ変更 | PR #27, PR #28 |
| 2026-09-04 | bugfix | build、型検査 | 彫刻画像Blobと輪郭線幅、ダウンロードテストの型不整合を解消 | Issue #29 / PR #37 |
| 2026-09-04 | operations | CI、リリース検証 | `pnpm typecheck` と `pnpm build` をCI品質ゲートへ追加 | Issue #30 / PR #39 |
| 2026-09-04 | changed | 画像入力、API境界 | 未使用の画像アップロードAPIを削除し、ブラウザ内のFileReader/Data URL処理をMVPの正規フローとして明記 | Issue #32 / PR #38 |
| 2026-09-04 | bugfix | `features/simulator.md` | モバイルメニューから注意事項モーダルを開く際のメニュー閉鎖とフォーカス復帰を明記 | Issue #31 / PR #40 |
| 2026-09-04 | changed | UX、architecture、受入基準 | `/` と `/simulator` の1画面、ローカルダウンロード、sessionStorage、成功toastを現行MVPとして統一し、結果画面とサーバー保存を将来候補へ分離 | Issue #33 |
| 2026-09-04 | operations | リリースブラウザ受入 | Playwright Chromium/WebKitの主要・回復導線E2Eと実Chrome desktop/390 x 844受入を完了し、ユーザー承認のChrome限定スコープをM5 Go、Edge/SafariをDeferredとして記録 | Issue #34 |
