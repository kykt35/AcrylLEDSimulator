# Phase 4 QA Checklist

## Scope
- Target build: `codex/phase4-qa-acceptance`
- Target milestone: M5 QA完了
- Verification focus: 基本導線、保存、例外系、文言、見た目、リリース判断

## Browsers

| Browser | Priority | Status | Notes |
|---|---|---|---|
| Chrome latest (desktop) | must | ready | 自動テストとローカル build で確認する |
| Safari latest (desktop) | must | pending | 手動確認が必要 |
| Edge latest (desktop) | must | pending | 手動確認が必要 |

## Scenarios

| ID | Category | Scenario | Expected Result | Status |
|---|---|---|---|---|
| Q4-01 | Flow | トップ画面からシミュレーターへ進む | CTA から `/simulator` へ遷移できる | ready |
| Q4-02 | Upload | 透過 PNG を読み込む | プレビューへ反映される | ready |
| Q4-03 | Controls | LED 色と明るさを変更する | 即時反映される | ready |
| Q4-04 | Controls | 背景とカメラを変更する | 即時反映される | ready |
| Q4-05 | Save | 保存成功から結果画面へ進む | 成功表示と結果画面導線が出る | ready |
| Q4-06 | Result | 再編集と新規作成を行う | 適切な状態で `/simulator` に戻る | ready |
| Q4-07 | Result | ダウンロードする | 画像ダウンロード導線がある | ready |
| Q4-08 | Error | PNG 以外を選択する | エラー表示が出て再選択できる | ready |
| Q4-09 | Error | 壊れた画像の読み込みに失敗する | 画面が壊れず再試行できる | ready |
| Q4-10 | Error | 保存 API が失敗する | 設定保持のまま再試行できる | ready |
| Q4-11 | Error | 結果未保存で `/result` を開く | 結果未存在メッセージが出る | ready |
| Q4-12 | Layout | デスクトップで表示が崩れない | 主要 UI が重ならず読める | ready |

## Acceptance Gates
- Must 機能が `docs/acceptance-criteria.md` と矛盾しない
- 重大不具合が 0 件である、または Go 判定時に明確な回避策がある
- `npm test` と `npm run build` が成功する
- Safari / Edge の手動確認結果が受入記録へ追記される
