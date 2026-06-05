# Phase 4 Report

- Report Type: milestone-phase-breakdown
- Phase: Phase 4
- Topic: QA, acceptance, and release adjustment
- Milestone: M5 QA完了
- Source Documents: `docs/specs/product/milestones.md`, `docs/specs/product/prd.md`
- Created: 2026-04-02

## Summary

Phase 4 は、実装済みの MVP を公開可能品質まで整えるフェーズである。ブラウザ確認、操作導線、保存動作、例外系、見た目の微調整を行い、公開判断に必要な受入記録を揃える。

## Objective

- 主要ブラウザでの基本動作を確認する
- ユーザーが迷わず操作できる導線へ調整する
- 保存や例外ケースを含む受入観点を潰す
- リリース可否を判断できる品質状態にする

## Execution Scope

- 主要ブラウザ確認
- UI 文言調整
- 操作導線確認
- パフォーマンス調整
- 保存動作確認
- 例外ケース確認
- 見た目微調整
- 不具合修正

## Deliverables

- リリース候補版
- 不具合一覧
- 受入確認記録

## Completion Criteria

- 画像アップロード、表示、色変更、背景切替、カメラ操作、保存が通る
- 一般ユーザーが最小説明で操作できる
- 重大不具合が解消され、残課題が公開判断可能なレベルで整理されている
- M5 として、リリース Go / Hold を判断できる材料が揃っている

## Risks And Controls

- QA 期間に仕様変更が入り込む
- 対応: 調整対象は品質改善に限定し、新機能は次フェーズへ送る
- ブラウザ差異で描画品質がぶれる
- 対応: 対応ブラウザと許容差分を先に定義する
- 実物との差異による誤認が残る
- 対応: 注意書きや説明文を UI 上で整備する

## Handoff To Next Phase

- Phase 5 へは、リリース候補版、既知課題、公開時の注意点、計測項目を引き継ぐ
- 受入で確認した操作導線の改善点は、初期利用レポートと合わせて次期改善へ接続する
- M5 完了後は、公開遅延の原因になる大きな修正以外は原則止める
