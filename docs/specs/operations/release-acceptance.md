# リリースブラウザ受入記録

## 目的

MVPの主要導線をproduction build、自動E2E、実ブラウザで確認し、M5のGo/Hold判断に必要な環境、結果、不具合、残作業を記録する。

PlaywrightのChromium/WebKitは継続的な回帰検知に使う。実Chrome/Edge/Safariの表示・操作・ダウンロード受入とは別の証跡として扱い、WebKit成功だけでSafari確認を完了にしない。

## 判定基準

以下をすべて満たす場合だけGoとする。

- unit test、typecheck、production build、Chromium/WebKit E2Eがすべて成功している
- 実Chrome/Edge/Safariで必須シナリオを完了している
- 390 x 844相当で注意事項、設定drawer、crop、download導線へ到達できる
- 未解決のCritical/High不具合が0件である
- Medium以下の未解決事項に、受容判断、回避策、追跡Issueがある

未実行またはBlockedの必須項目が1つでもあればHoldとする。

## 今回の受入対象

| 項目 | 内容 |
|---|---|
| Issue | [#34](https://github.com/kykt35/AcrylLEDSimulator/issues/34) |
| branch | `test/release-browser-acceptance` |
| base | `main` at `605b97b` |
| 自動受入commit | `4e832b4` |
| 実行日 | 2026-09-04 |
| 実行者 | Codex |
| CI URL | PR作成後に追記 |

## 自動受入結果

| 検証 | 結果 | 詳細 |
|---|---|---|
| `pnpm test` | Pass | 20 files / 92 tests |
| `pnpm typecheck` | Pass | TypeScript error 0 |
| `pnpm build` | Pass | Next.js 15.5.15 production build |
| Playwright Chromium | Pass | 6 tests |
| Playwright WebKit | Pass | 6 tests |
| 全E2E | Pass | 12 tests / 52.8s / 1 worker |

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
| Edge | 未インストール | 必須受入を実行できない |
| Safari | 26.6.2 | インストール済み。必須主要フローは未実行 |

## 必須シナリオ

| ID | シナリオ | Chromium | WebKit | Chrome | Edge | Safari |
|---|---|---|---|---|---|---|
| B-01 | production初期表示、console errorなし | Pass | Pass | Pass | Blocked | Pending |
| B-02 | 正常PNG uploadと3D描画 | Pass | Pass | Blocked | Blocked | Pending |
| B-03 | 配置、発光、背景、カメラ調整 | Pass | Pass | Blocked | Blocked | Pending |
| B-04 | 彫刻生成、表示切替、彫刻PNG download | Pass | Pass | Blocked | Blocked | Pending |
| B-05 | crop、PNG/JPG download | Pass | Pass | Blocked | Blocked | Pending |
| B-06 | 非PNG/破損PNG後の回復 | Pass | Pass | Blocked | Blocked | Pending |
| B-07 | WebGL fallback/retry | Pass | Pass | Blocked | Blocked | Pending |
| B-08 | 保存失敗後の再試行 | Pass | Pass | Blocked | Blocked | Pending |
| B-09 | resume/reset | Pass | Pass | Blocked | Blocked | Pending |
| B-10 | 注意事項モーダルの表示/閉鎖 | Pass | Pass | Pass | Blocked | Pending |

`Blocked`と`Pending`は製品不具合の判定ではなく、実行環境または受入作業が未完了であることを示す。

## 390 x 844受入

| 項目 | Chrome 152 | 結果 / 証跡 |
|---|---|---|
| 初期レイアウト | 実行済み | Pass。横方向の欠落なし |
| ハンバーガーメニュー | 実行済み | Pass。開閉可能 |
| メニューから注意事項を開く | 実行済み | Pass。メニュー閉鎖後もモーダルを表示 |
| 注意事項の内容と閉じる操作 | 実行済み | Pass。viewport内で読めて閉鎖可能 |
| PNG upload | Blocked | Chrome拡張機能のローカルファイルアクセスが無効 |
| 設定drawer/crop/download | Blocked | uploadを前提とするため未実行 |

## 既知の不具合・受入ブロッカー

| ID | 種別 | Severity | 内容 | 回避策 / 次の対応 | 追跡 |
|---|---|---|---|---|---|
| QA-ENV-01 | 受入環境 | - | Chrome拡張機能からfixtureを選択できず、実Chromeの主要フローを完了できない | 拡張機能詳細でローカルファイルURLへのアクセスを許可し、B-02〜B-09と390 x 844の残項目を再実行する | Issue #34 |
| QA-ENV-02 | 受入環境 | - | Microsoft Edgeが受入端末に未インストール | Edge最新版を利用できる端末でB-01〜B-10を実行する | Issue #34 |
| QA-ENV-03 | 受入環境 | - | 実Safariの主要フロー受入が未実行 | Safari 26.6.2でB-01〜B-10を手動実行する | Issue #34 |

今回実行した範囲では製品のCritical/High不具合は検出していない。ただし、3実ブラウザの必須matrixが完了するまでは「Critical/High 0件」を最終確定しない。

## Go / Hold判定

| 項目 | 判定 |
|---|---|
| 自動品質ゲート | Pass |
| Chromium/WebKit E2E | Pass |
| 実Chrome主要フロー | 部分完了 / Blocked |
| 実Edge主要フロー | Blocked |
| 実Safari主要フロー | Pending |
| 390 x 844主要フロー | 部分完了 / Blocked |
| Critical/High 0件の最終確認 | 未完了 |
| M5 | **Hold** |

Hold理由は製品不具合ではなく、実Chrome/Edge/Safariと390 x 844の必須受入が未完了なためである。QA-ENV-01〜03を解消し、同じ受入対象commitまたは後続commitで必須matrixを再実行してから判定を更新する。
