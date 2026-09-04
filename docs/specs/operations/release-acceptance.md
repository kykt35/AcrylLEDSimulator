# リリースブラウザ受入記録

## 目的

MVPの主要導線をproduction build、自動E2E、実ブラウザで確認し、M5のGo/Hold判断に必要な環境、結果、不具合、残作業を記録する。

PlaywrightのChromium/WebKitは継続的な回帰検知に使う。実ブラウザの表示・操作・ダウンロード受入とは別の証跡として扱い、WebKit成功だけでSafari確認を完了にしない。

当初は実Chrome/Edge/Safariを必須としていたが、2026-09-04のユーザー判断により、今回の実ブラウザ受入はChromeのみを必須範囲とする。Edge/Safariは将来のクロスブラウザ確認としてDeferredにし、Chrome限定スコープのGo/Holdを判定する。

## 判定基準

以下をすべて満たす場合だけGoとする。

- unit test、typecheck、production build、Chromium/WebKit E2Eがすべて成功している
- 実Chromeでユーザー操作可能な必須シナリオを完了している
- 390 x 844相当で注意事項、設定drawer、crop、download導線へ到達できる
- 未解決のCritical/High不具合が0件である
- syntheticなWebGL lossと保存失敗はChromium/WebKit E2Eで成功している
- Edge/Safariの未実行をDeferredとして明示している

未実行またはBlockedの必須項目が1つでもあればHoldとする。

## 今回の受入対象

| 項目 | 内容 |
|---|---|
| Issue | [#34](https://github.com/kykt35/AcrylLEDSimulator/issues/34) |
| branch | `test/release-browser-acceptance` |
| base | `main` at `605b97b` |
| 自動受入commit | `b05cb4d` |
| 実Chrome受入commit | `b05cb4d`（後続はdocsのみ） |
| 実Chrome desktop viewport | 1536 x 753 |
| 実Chrome mobile viewport | 390 x 844 |
| 実行日 | 2026-09-04 |
| 実行者 | Codex |
| CI URL | PR作成後に追記 |

## 自動受入結果

| 検証 | 結果 | 詳細 |
|---|---|---|
| `pnpm test` | Pass | 20 files / 92 tests |
| `pnpm typecheck` | Pass | TypeScript error 0 |
| `pnpm build` | Pass | Next.js 15.5.15 production build |
| Playwright Chromium | Pass | 7 tests |
| Playwright WebKit | Pass | 7 tests |
| 全E2E | Pass | 14 tests / 56.9s / 1 worker |

自動E2Eは、次を実ファイルまたはブラウザAPIで確認した。

- PNG upload、3D canvas、配置、発光、背景、カメラ、彫刻調整
- crop範囲変更、PNG/JPG/彫刻PNGのdownload、ファイル名、バイナリsignature
- `?resume=1`、UI reset、`?reset=1`、sessionStorage消去
- 非PNG、破損PNGからの再upload
- syntheticな`webglcontextlost`後のfallback/retry
- canvas書き出し失敗後の設定保持と再download

## 実ブラウザ環境

| 環境 | バージョン / 状態 | 備考 |
|---|---|---|
| OS | macOS 26.6.2 | ローカル受入環境 |
| Chrome | 152.0.7977.76 | 実ブラウザを使用 |
| Edge | 未インストール | 今回の必須範囲外 / Deferred |
| Safari | 26.6.2 | 今回の必須範囲外 / Deferred |

## 必須シナリオ

| ID | シナリオ | Chromium | WebKit | Chrome | Edge | Safari |
|---|---|---|---|---|---|---|
| B-01 | production初期表示、console errorなし | Pass | Pass | Pass | Deferred | Deferred |
| B-02 | 正常PNG uploadと3D描画 | Pass | Pass | Pass | Deferred | Deferred |
| B-03 | 配置、発光、背景、カメラ調整 | Pass | Pass | Pass | Deferred | Deferred |
| B-04 | 彫刻生成、表示切替、彫刻PNG download | Pass | Pass | Pass | Deferred | Deferred |
| B-05 | crop、PNG/JPG download | Pass | Pass | Pass | Deferred | Deferred |
| B-06 | 非PNG/破損PNG後の回復 | Pass | Pass | Pass | Deferred | Deferred |
| B-07 | WebGL fallback/retry | Pass | Pass | 自動のみ | Deferred | Deferred |
| B-08 | 保存失敗後の再試行 | Pass | Pass | 自動のみ | Deferred | Deferred |
| B-09 | resume/reset | Pass | Pass | Pass | Deferred | Deferred |
| B-10 | 注意事項モーダルの表示/閉鎖 | Pass | Pass | Pass | Deferred | Deferred |

実Chromeではconsole error 0件、正常PNG後の3D canvas、設定変更、彫刻生成、実ファイルdownload、resume、UI/query resetを確認した。B-06は非PNGエラー後の正常uploadまで実行し、破損PNGのエラー表示も確認した。B-07とB-08は通常のUI操作では意図的に発生させられないため、自動E2Eを受入証跡とする。

## 390 x 844受入

| 項目 | Chrome 152 | 結果 / 証跡 |
|---|---|---|
| 初期レイアウト | 実行済み | Pass。横方向の欠落なし |
| ハンバーガーメニュー | 実行済み | Pass。開閉可能 |
| メニューから注意事項を開く | 実行済み | Pass。メニュー閉鎖後もモーダルを表示 |
| 注意事項の内容と閉じる操作 | 実行済み | Pass。viewport内で読めて閉鎖可能 |
| PNG upload | 実行済み | Pass。ユーザー操作でrepository-owned fixtureを選択 |
| 設定drawer | 実行済み | Pass。各tabを表示・操作可能 |
| crop | 実行済み | Pass。範囲を42.58% x 74.83%へ変更 |
| download | 実行済み | Pass。420 x 530 canvasから179 x 397 PNGを出力 |

## 既知の不具合・受入ブロッカー

| ID | 種別 | Severity | 内容 | 回避策 / 次の対応 | 追跡 |
|---|---|---|---|---|---|
| QA-ENV-01 | 受入環境 | - | Chrome拡張機能経由のfile chooserが再接続後に不安定 | repository-owned fixtureをユーザー操作で選択して回避。Chrome受入完了 | 解消 |
| QA-ENV-02 | 受入範囲 | - | Microsoft Edgeが受入端末に未インストール | ユーザー判断により今回の必須範囲外 | Deferred |
| QA-ENV-03 | 受入範囲 | - | 実Safariの主要フロー受入が未実行 | ユーザー判断により今回の必須範囲外 | Deferred |

今回の自動受入とChrome限定スコープでは、製品のCritical/High不具合を検出していない。Edge/Safari固有の問題は未評価である。

## Go / Hold判定

| 項目 | 判定 |
|---|---|
| 自動品質ゲート | Pass |
| Chromium/WebKit E2E | Pass |
| 実Chrome主要フロー | Pass |
| 実Edge主要フロー | Deferred（今回の必須範囲外） |
| 実Safari主要フロー | Deferred（今回の必須範囲外） |
| 390 x 844主要フロー | Pass |
| Critical/High 0件の確認 | Pass（Chrome限定スコープ） |
| M5 | **Go（Chrome限定スコープ）** |

Chromium/WebKit自動E2Eと実Chromeのdesktop/390 x 844受入が成功したため、今回のChrome限定スコープをGoとする。これはEdge/Safariの互換性を保証する判定ではなく、両ブラウザはDeferredとして残す。
