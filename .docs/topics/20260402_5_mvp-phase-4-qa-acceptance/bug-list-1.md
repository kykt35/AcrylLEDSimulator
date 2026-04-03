# Phase 4 Bug List

## Severity Definition
- Critical: 公開不可、主要機能停止、データ欠損
- High: Must 機能に重大な支障
- Medium: 回避可能だが体験を損なう
- Low: 軽微な見た目や文言の問題

## Current Items

| ID | Severity | Area | Status | Summary | Notes |
|---|---|---|---|---|---|
| QA-001 | Low | test environment | accepted | R3F component tests emit jsdom DOM warnings | 実アプリ不具合ではなく、test mock の制約による warning |
| QA-002 | Medium | manual verification | open | Safari / Edge の実機確認が未完了 | Go / Hold 判定前に手動確認が必要 |
